/**
 * Gavin Chat Widget v3.0.2
 * Floating chat for asking questions about posts
 * Stays visible while scrolling
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    position: 'bottom-right', // 'bottom-right' | 'bottom-left'
    primaryColor: '#6038FB',
    accentColor: '#00FF40',
    botName: 'Gavin',
    botAvatar: '<img src="/assets/images/gavin-avatar.png" style="width: 24px; height: 24px; border-radius: 50%;">',
    welcomeMessage: "Hi! I'm Gavin. Ask me anything about this post or supply chain visibility!"
  };

  // State
  let isOpen = false;
  let messages = [];
  let currentPost = {
    title: document.title.replace(" | Gavin's Decklar Insights", ""),
    content: ""
  };

  // Extract post content for context
  function getPostContent() {
    const content = document.querySelector('.post-content');
    if (content) {
      return content.innerText.substring(0, 2000); // First 2000 chars
    }
    return "";
  }

  // Create widget HTML
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'gavin-chat-widget';
    widget.innerHTML = `
      <style>
        #gavin-chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
        }

      .gavin-chat-toggle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.accentColor} 100%);
          border: 3px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2px;
          box-shadow: 0 4px 20px rgba(96, 56, 251, 0.4);
          transition: all 0.3s ease;
          animation: gavin-pulse 2s infinite;
        }

        .gavin-chat-toggle img {
          width: 95%;
          height: 95%;
          border-radius: 50%;
          object-fit: cover;
        }

        .gavin-chat-toggle.speaking {
          animation: gavin-speaking-toggle 0.3s ease-in-out infinite;
          box-shadow: 0 0 30px ${CONFIG.accentColor}, 0 0 60px ${CONFIG.primaryColor};
        }

        @keyframes gavin-speaking-toggle {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 255, 64, 0.6); }
          50% { transform: scale(1.08); box-shadow: 0 0 40px rgba(0, 255, 64, 1), 0 0 60px rgba(96, 56, 251, 0.8); }
        }

        .gavin-chat-container {
          position: absolute;
          bottom: 75px;
          right: 0;
          width: 380px;
          height: 500px;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(96, 56, 251, 0.3);
          border-radius: 16px;
          display: none;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .gavin-chat-container.open {
          display: flex;
        }

        .gavin-chat-header {
          background: linear-gradient(135deg, rgba(96, 56, 251, 0.2) 0%, rgba(0, 255, 64, 0.1) 100%);
          padding: 16px 20px;
          border-bottom: 1px solid rgba(96, 56, 251, 0.2);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gavin-chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.accentColor} 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2px;
        }

        .gavin-chat-avatar img {
          width: 90%;
          height: 90%;
          border-radius: 50%;
          object-fit: cover;
        }

        .gavin-chat-avatar.speaking {
          animation: gavin-speaking 0.3s ease-in-out infinite;
          box-shadow: 0 0 20px ${CONFIG.accentColor}, 0 0 40px ${CONFIG.primaryColor};
        }

        @keyframes gavin-speaking {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .gavin-chat-info h4 {
          margin: 0;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
        }

        .gavin-chat-info span {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        .gavin-chat-close {
          margin-left: auto;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 20px;
          padding: 4px;
          transition: color 0.2s;
        }

        .gavin-chat-close:hover {
          color: #fff;
        }

        .gavin-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .gavin-chat-message {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          animation: gavin-message-slide 0.3s ease;
        }

        @keyframes gavin-message-slide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gavin-chat-message.user {
          align-self: flex-end;
          background: ${CONFIG.primaryColor};
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .gavin-chat-message.bot {
          align-self: flex-start;
          background: rgba(96, 56, 251, 0.15);
          color: #fff;
          border: 1px solid rgba(96, 56, 251, 0.3);
          border-bottom-left-radius: 4px;
        }

        .gavin-chat-input-area {
          padding: 16px;
          border-top: 1px solid rgba(96, 56, 251, 0.2);
          display: flex;
          gap: 8px;
        }

        .gavin-chat-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(96, 56, 251, 0.3);
          border-radius: 24px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .gavin-chat-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .gavin-chat-input:focus {
          border-color: ${CONFIG.primaryColor};
        }

        .gavin-chat-send {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: ${CONFIG.primaryColor};
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: all 0.2s;
        }

        .gavin-chat-send:hover {
          background: ${CONFIG.accentColor};
          transform: scale(1.05);
        }

        .gavin-chat-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gavin-chat-typing {
          display: none;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        .gavin-chat-typing.show {
          display: flex;
        }

        .gavin-chat-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${CONFIG.accentColor};
          animation: gavin-typing 1s infinite;
        }

        .gavin-chat-typing span:nth-child(2) { animation-delay: 0.2s; }
        .gavin-chat-typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes gavin-typing {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }

        /* Mobile responsive */
        @media (max-width: 480px) {
          #gavin-chat-widget {
            bottom: 10px;
            right: 10px;
          }

          .gavin-chat-container {
            position: fixed;
            bottom: 80px;
            right: 10px;
            left: 10px;
            width: auto;
            height: 60vh;
          }
        }
      </style>

      <div class="gavin-chat-container" id="gavin-chat-container">
        <div class="gavin-chat-header">
          <div class="gavin-chat-avatar" id="gavin-chat-avatar"><img src="/assets/images/gavin-avatar.png"></div>
          <div class="gavin-chat-info">
            <h4>${CONFIG.botName}</h4>
            <span>Ask me anything</span>
          </div>
          <button class="gavin-chat-close" id="gavin-chat-close">×</button>
        </div>
        <div class="gavin-chat-messages" id="gavin-chat-messages"></div>
        <div class="gavin-chat-typing" id="gavin-chat-typing">
          <span></span><span></span><span></span>
          Gavin is typing...
        </div>
        <div class="gavin-chat-input-area">
          <input type="text" class="gavin-chat-input" id="gavin-chat-input" 
                 placeholder="Ask about this post..." maxlength="500">
          <button class="gavin-chat-send" id="gavin-chat-send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>

      <button class="gavin-chat-toggle" id="gavin-chat-toggle" title="Chat with Gavin">
        <img src="/assets/images/gavin-avatar.png">
      </button>
    `;

    document.body.appendChild(widget);
    return widget;
  }

  // Initialize chat
  function init() {
    const widget = createWidget();
    currentPost.content = getPostContent();

    // Elements
    const toggle = document.getElementById('gavin-chat-toggle');
    const container = document.getElementById('gavin-chat-container');
    const close = document.getElementById('gavin-chat-close');
    const input = document.getElementById('gavin-chat-input');
    const send = document.getElementById('gavin-chat-send');
    const messages = document.getElementById('gavin-chat-messages');
    const typing = document.getElementById('gavin-chat-typing');
    const avatar = document.getElementById('gavin-chat-avatar');

    // Toggle chat
    toggle.addEventListener('click', () => {
      isOpen = !isOpen;
      container.classList.toggle('open', isOpen);
      if (isOpen && messages.children.length === 0) {
        addMessage('bot', CONFIG.welcomeMessage);
      }
      if (isOpen) {
        input.focus();
      }
    });

    // Close chat
    close.addEventListener('click', () => {
      isOpen = false;
      container.classList.remove('open');
    });

    // Send message
    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      addMessage('user', text);
      input.value = '';
      showTyping();

      // Send to backend
      fetchChatResponse(text);
    }

    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    function addMessage(sender, text) {
      const msg = document.createElement('div');
      msg.className = `gavin-chat-message ${sender}`;
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;

      // If this is a bot message, speak it and animate avatar
      if (sender === 'bot') {
        speakResponse(text, avatar);
      }
    }

    function speakResponse(text, avatarEl) {
      // Check if voice player exists
      if (typeof voicePlayer !== 'undefined' && voicePlayer.speak) {
        // Animate avatar while speaking
        const audio = new Audio();
        avatarEl.classList.add('speaking');
        
        // Stop animation after estimated speaking time
        const words = text.split(' ').length;
        const estimatedSeconds = words * 0.4; // ~150 words per minute
        setTimeout(() => {
          avatarEl.classList.remove('speaking');
        }, estimatedSeconds * 1000);
        
        // Use TTS if available
        voicePlayer.speak('gavin-chat', text);
      }
    }

    function showTyping() {
      typing.classList.add('show');
      messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
      typing.classList.remove('show');
    }

    async function fetchChatResponse(userMessage) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            postTitle: currentPost.title,
            postContent: currentPost.content
          })
        });

        if (!response.ok) {
          throw new Error('Chat API error');
        }

        const data = await response.json();
        hideTyping();
        addMessage('bot', data.response || "I'm thinking about that... let me get back to you!");
      } catch (error) {
        hideTyping();
        // Fallback response
        addMessage('bot', generateFallbackResponse(userMessage));
      }
    }

    function generateFallbackResponse(userMessage) {
      const responses = [
        "That's a great question about supply chain visibility! Based on this post, I'd recommend checking out our Bee Labels for that use case.",
        "Interesting! The key insight from this article is that proactive monitoring beats reactive troubleshooting every time.",
        "Great question! Many Decklar customers have seen 20-30% improvement in their visibility metrics by following these best practices.",
        "I'd love to dive deeper into that with you. Would you like me to connect you with our customer success team for a personalized walkthrough?",
        "That's exactly the kind of challenge our IoT tracking solutions are designed for. Have you considered trying our 30-day pilot program?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
