'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from 'lucide-react';

interface VoiceConversationProps {
  customerId?: string;
  customerName?: string;
  onClose?: () => void;
}

export default function VoiceConversation({ customerId, customerName, onClose }: VoiceConversationProps) {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [gavinResponse, setGavinResponse] = useState('');
  const [conversation, setConversation] = useState<Array<{role: string, text: string}>>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionIdRef = useRef(`session-${Date.now()}`);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio context on user interaction
  const initAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);

  // Start voice conversation
  const startConversation = useCallback(async () => {
    await initAudio();
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        }
      });
      
      // Use WebM/Opus for best compression and quality
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) return;
        
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append('customerId', customerId || '');
          formData.append('sessionId', sessionIdRef.current);
          formData.append('history', JSON.stringify(conversation.slice(-5)));
          
          const response = await fetch('/api/voice/stream', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) throw new Error('Failed to process');
          
          const data = await response.json();
          
          // Update conversation
          setConversation(prev => [
            ...prev,
            { role: 'user', text: data.transcription },
            { role: 'gavin', text: data.response }
          ]);
          
          setTranscript(data.transcription);
          setGavinResponse(data.response);
          
          // Play Gavin's response
          if (data.audio) {
            const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
            audioPlayerRef.current = audio;
            
            audio.onended = () => {
              // Auto-restart listening after response
              if (isActive && mediaRecorderRef.current?.state === 'inactive') {
                setTimeout(() => {
                  audioChunksRef.current = [];
                  mediaRecorderRef.current?.start(100);
                  setIsListening(true);
                }, 300);
              }
            };
            
            await audio.play();
          } else {
            // If no audio, restart listening after delay
            setTimeout(() => {
              if (isActive && mediaRecorderRef.current?.state === 'inactive') {
                audioChunksRef.current = [];
                mediaRecorderRef.current?.start(100);
                setIsListening(true);
              }
            }, 2000);
          }
          
        } catch (error) {
          console.error('Voice processing error:', error);
        } finally {
          setIsProcessing(false);
          audioChunksRef.current = [];
        }
      };
      
      // Start continuous recording with small chunks
      mediaRecorder.start(100);
      setIsActive(true);
      setIsListening(true);
      
      // Initial greeting from Gavin if starting fresh
      if (conversation.length === 0) {
        setTimeout(async () => {
          const greeting = customerName 
            ? `Hey Jeff, I'm ready to talk about ${customerName}. What's on your mind?`
            : "Hey Jeff, I'm listening. What would you like to discuss?";
          
          // Get voice for greeting
          try {
            const response = await fetch('/api/voice/stream', {
              method: 'POST',
              headers: { 'Content-Type': 'multipart/form-data' },
              body: new URLSearchParams({
                text: greeting,
                customerId: customerId || '',
                sessionId: sessionIdRef.current,
              }),
            });
            
            // Just speak the greeting text for now
            console.log('Gavin:', greeting);
          } catch (e) {
            console.log('Gavin:', greeting);
          }
        }, 500);
      }
      
    } catch (error) {
      console.error('Failed to start voice:', error);
      alert('Please allow microphone access to use voice conversation');
    }
  }, [customerId, customerName, conversation, isActive, initAudio]);

  // Stop conversation
  const stopConversation = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    setIsActive(false);
    setIsListening(false);
    setIsProcessing(false);
  }, []);

  // Handle silence detection to trigger processing
  useEffect(() => {
    if (!isListening || !isActive) return;
    
    let lastChunkCount = 0;
    let silenceStartTime: number | null = null;
    
    const detectSilence = () => {
      const currentChunkCount = audioChunksRef.current.length;
      const now = Date.now();
      
      // User is speaking - reset silence timer
      if (currentChunkCount > lastChunkCount) {
        lastChunkCount = currentChunkCount;
        silenceStartTime = null;
        return;
      }
      
      // No new chunks - start tracking silence
      if (currentChunkCount > 5 && !silenceStartTime) {
        silenceStartTime = now;
      }
      
      // If silence for 1.2 seconds and we have audio, process it
      if (silenceStartTime && now - silenceStartTime > 1200 && mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsListening(false);
        silenceStartTime = null;
      }
    };
    
    const interval = setInterval(detectSilence, 100);
    return () => clearInterval(interval);
  }, [isListening, isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, [stopConversation]);

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">Voice Conversation with Gavin</h3>
          <p className="text-sm text-slate-400 max-w-xs">
            Have a natural voice-to-voice conversation. Ask about customers, brainstorm strategies, or get insights.
          </p>
        </div>
        
        <button
          onClick={startConversation}
          className="w-20 h-20 bg-gradient-to-br from-decklar-500 to-decklar-700 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-decklar-500/25"
        >
          <Phone className="w-8 h-8 text-white" />
        </button>
        
        <p className="text-xs text-slate-500">Click to start • Requires microphone</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Active conversation UI */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              msg.role === 'user' 
                ? 'bg-decklar-600 text-white' 
                : 'bg-dark-700 text-slate-200'
            }`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Gavin is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="p-4 border-t border-dark-700 bg-dark-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isListening ? (
              <>
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <Mic className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-400">Listening...</p>
                  <p className="text-xs text-slate-500">Speak naturally</p>
                </div>
              </>
            ) : isProcessing ? (
              <>
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-400">Processing...</p>
                  <p className="text-xs text-slate-500">Transcribing & responding</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-decklar-500/20 rounded-full flex items-center justify-center">
                  <MicOff className="w-5 h-5 text-decklar-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Paused</p>
                  <p className="text-xs text-slate-500">Tap to resume</p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {!isListening && !isProcessing && (
              <button
                onClick={() => {
                  audioChunksRef.current = [];
                  mediaRecorderRef.current?.start(100);
                  setIsListening(true);
                }}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors"
              >
                Resume
              </button>
            )}
            
            <button
              onClick={() => {
                stopConversation();
                onClose?.();
              }}
              className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-colors"
            >
              <PhoneOff className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
