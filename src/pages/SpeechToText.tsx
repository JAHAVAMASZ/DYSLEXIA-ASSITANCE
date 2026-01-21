
import React, { useState, useRef, useEffect } from 'react';
import { MainNav } from '@/components/MainNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Copy, DownloadIcon } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const SpeechToText = () => {
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [dyslexiaMode, setDyslexiaMode] = useState<boolean>(false);
  const [interimResult, setInterimResult] = useState<string>("");
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast.success("Started listening. Speak now!");
      };

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setInterimResult(interim);
        if (final) {
          setRecognizedText(prev => prev + final);
          setInterimResult('');
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart if it stops unexpectedly while we still want to listen
          recognitionRef.current.start();
        } else {
          setIsListening(false);
        }
      };
    } else {
      toast.error("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast.error("Failed to start speech recognition");
      }
    }
  };

  const clearText = () => {
    setRecognizedText("");
    setInterimResult("");
    toast.success("Text cleared");
  };

  const copyText = () => {
    if (recognizedText) {
      navigator.clipboard.writeText(recognizedText);
      toast.success("Text copied to clipboard");
    }
  };

  const downloadText = () => {
    if (recognizedText) {
      const blob = new Blob([recognizedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'speech-to-text.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("File downloaded");
    }
  };

  return (
    <div className={`min-h-screen ${dyslexiaMode ? 'dyslexic-mode' : ''} bg-readease-yellow/30`}>
      <MainNav />
      
      <main className="max-w-4xl mx-auto px-4 py-8 md:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Speech to Text</h1>
          <p className="text-gray-600">Convert your voice into written text</p>
        </div>
        
        <Card className="readease-card mb-6">
          <CardContent className="pt-6">
            <div className="mb-6 text-center">
              <Button 
                onClick={toggleListening} 
                className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'readease-btn-primary'} rounded-full h-20 w-20 animate-pulse-gentle p-0 flex items-center justify-center`}
                size="icon"
              >
                {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
              </Button>
              <p className="mt-3 text-lg font-medium">
                {isListening ? "Tap to stop listening" : "Tap to start listening"}
              </p>
            </div>
            
            <div className="mb-6">
              <Textarea
                ref={textareaRef}
                className={`min-h-[200px] text-lg p-4 ${dyslexiaMode ? 'dyslexic-mode' : ''}`}
                value={recognizedText}
                onChange={(e) => setRecognizedText(e.target.value)}
                placeholder="Your speech will appear here..."
              />
              {interimResult && (
                <div className="mt-2 p-2 bg-gray-100 text-gray-500 rounded-md">
                  {interimResult}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={toggleListening} className={isListening ? "bg-red-500 hover:bg-red-600" : "readease-btn-primary"}>
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={clearText}>
                Clear Text
              </Button>
              
              <Button variant="outline" onClick={copyText} disabled={!recognizedText}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </Button>
              
              <Button variant="outline" onClick={downloadText} disabled={!recognizedText}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="readease-card">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Text Settings</h2>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="dyslexia-mode" className="text-lg">Dyslexia-Friendly Font</Label>
              <Switch
                id="dyslexia-mode"
                checked={dyslexiaMode}
                onCheckedChange={setDyslexiaMode}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SpeechToText;
