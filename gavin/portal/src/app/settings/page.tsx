"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";
import { Key, Database, RefreshCw, Shield, Bot } from "lucide-react";

export default function SettingsPage() {
  const [aiKey, setAiKey] = useState("");
  const [aiModel, setAiModel] = useState("gpt-4o-mini");
  const [aiUrl, setAiUrl] = useState("https://api.openai.com/v1");
  const [saving, setSaving] = useState(false);

  async function reseed() {
    const res = await fetch("/api/seed", { method: "POST" });
    if (res.ok) {
      toast.success("Database reseeded with sample data");
    } else {
      toast.error("Failed to reseed database");
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-[rgba(255,255,255,0.5)]">Configure the Decklar Customer Portal</p>
        </div>

        {/* AI Configuration */}
        <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6038FB] to-[#7B5CFF] shadow-[0_0_15px_rgba(96,56,251,0.4)]">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-white">AI Configuration</CardTitle>
            </div>
            <CardDescription className="text-[rgba(255,255,255,0.5)]">Configure the Gavin AI assistant backend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] p-3 text-sm text-[#F59E0B]">
              AI settings are configured via environment variables. Update OPENAI_API_KEY, AI_MODEL, and AI_BASE_URL in your .env file.
            </div>
            <div className="grid gap-3">
              <div>
                <Label className="text-white">API Base URL</Label>
                <Input value={aiUrl} onChange={(e) => setAiUrl(e.target.value)} placeholder="https://api.openai.com/v1" className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]" />
              </div>
              <div>
                <Label className="text-white">Model</Label>
                <Input value={aiModel} onChange={(e) => setAiModel(e.target.value)} placeholder="gpt-4o-mini" className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]" />
              </div>
              <div>
                <Label className="text-white">API Key</Label>
                <Input type="password" value={aiKey} onChange={(e) => setAiKey(e.target.value)} placeholder="sk-..." className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6038FB] to-[#7B5CFF] shadow-[0_0_15px_rgba(96,56,251,0.4)]">
                <Database className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-white">Data Management</CardTitle>
            </div>
            <CardDescription className="text-[rgba(255,255,255,0.5)]">Manage portal data and sample content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={reseed} className="border-[rgba(96,56,251,0.3)] text-white hover:bg-[rgba(96,56,251,0.1)]">
              <RefreshCw className="mr-2 h-4 w-4 text-[#7B5CFF]" />
              Reseed Sample Data
            </Button>
            <p className="text-xs text-[rgba(255,255,255,0.4)]">This resets sample customers, contacts, calls, and insights.</p>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">About Decklar Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[rgba(255,255,255,0.7)]">
            <p><span className="text-[#7B5CFF] font-medium">Version:</span> 0.1.0</p>
            <p><span className="text-[#7B5CFF] font-medium">Built by:</span> Gavin AI (Decklar Intelligence)</p>
            <p><span className="text-[#7B5CFF] font-medium">Stack:</span> Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, SQLite</p>
            <p className="text-xs text-[rgba(255,255,255,0.4)]">© 2026 Decklar Inc. All rights reserved.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
