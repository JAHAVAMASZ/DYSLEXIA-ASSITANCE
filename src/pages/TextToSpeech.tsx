
import React, { useState, useRef } from 'react';
import { MainNav } from '@/components/MainNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RefreshCw, Volume } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';

const TextToSpeech = () => {
  const [text, setText] = useState(
    "ReadEase helps students with dyslexia improve their reading skills. The app highlights each word as it is spoken."
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voice, setVoice] = useState("default");
  const [highlightWords, setHighlightWords] = useState(true);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechSynthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Load available voices when component mounts
  React.useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthRef.current.getVoices();
      setAvailableVoices(voices);
    };

    // Some browsers load voices asynchronously
    if (speechSynthRef.current.onvoiceschanged !== undefined) {
      speechSynthRef.current.onvoiceschanged = loadVoices;
    }

    loadVoices();

    // Cleanup on unmount
    return () => {
      if (utteranceRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  const highlightCurrentWord = (event: SpeechSynthesisEvent) => {
    if (!textRef.current || !highlightWords) return;
    
    const utterance = event.utterance;
    const charIndex = event.charIndex;
    const text = utterance.text;
    
    // Find word boundaries
    let wordStart = charIndex;
    while (wordStart > 0 && !/\s/.test(text[wordStart - 1])) {
      wordStart--;
    }
    
    let wordEnd = charIndex;
    while (wordEnd < text.length && !/\s/.test(text[wordEnd])) {
      wordEnd++;
    }
    
    const word = text.substring(wordStart, wordEnd);
    
    // Split text into before, highlight, and after parts
    const beforeText = text.substring(0, wordStart);
    const afterText = text.substring(wordEnd);
    
    // Set the highlighted HTML
    textRef.current.innerHTML = `
      ${beforeText}<span class="bg-readease-brightBlue text-white px-1 py-0.5 rounded">${word}</span>${afterText}
    `;
  };

  const speak = () => {
    if (speechSynthRef.current && text) {
      // Cancel any ongoing speech
      speechSynthRef.current.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      // Apply settings
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      // Set voice if specified
      if (voice !== "default") {
        const selectedVoice = availableVoices.find(v => v.name === voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      // Word highlighting event listeners
      utterance.onboundary = highlightCurrentWord;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        if (textRef.current) {
          textRef.current.innerHTML = text;
        }
      };
      
      // Start speaking
      speechSynthRef.current.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
      
      toast.success("Starting to read text");
    } else {
      toast.error("Text to speech is not supported in your browser");
    }
  };

  const pause = () => {
    if (isPlaying && !isPaused) {
      speechSynthRef.current.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      speechSynthRef.current.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    speechSynthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    if (textRef.current) {
      textRef.current.innerHTML = text;
    }
  };

  return (
    <div className={`min-h-screen ${dyslexiaMode ? 'dyslexic-mode' : ''} bg-readease-yellow/30`}>
      <MainNav />
      
      <main className="max-w-4xl mx-auto px-4 py-8 md:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Text to Speech</h1>
          <p className="text-gray-600">Listen to any text with customizable voices</p>
        </div>
        
        <Card className="readease-card mb-6">
          <CardContent className="pt-6">
            <div className="mb-6">
              <Label htmlFor="text-input" className="mb-2 block font-semibold text-lg">
                Enter text to be read aloud
              </Label>
              <Textarea
                id="text-input"
                className="min-h-32 text-lg"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            
            <div className="py-4 rounded-lg bg-readease-blue/20 px-4 mb-6">
              <Label className="mb-2 block font-semibold">Text Preview</Label>
              <div 
                ref={textRef} 
                className={`p-4 rounded-lg bg-white min-h-32 text-lg ${dyslexiaMode ? 'dyslexic-mode' : ''}`}
              >
                {text}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {!isPlaying ? (
                <Button 
                  onClick={speak} 
                  className="readease-btn-primary flex gap-2"
                  size="lg"
                >
                  <Play className="h-5 w-5" />
                  Start Reading
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={pause} 
                    variant="outline" 
                    className="flex gap-2"
                    size="lg"
                  >
                    {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  
                  <Button 
                    onClick={stop} 
                    variant="destructive" 
                    className="flex gap-2"
                    size="lg"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="readease-card">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Voice Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="voice-select" className="mb-2 block">Voice</Label>
                <Select
                  value={voice}
                  onValueChange={setVoice}
                >
                  <SelectTrigger id="voice-select" className="w-full">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Voice</SelectItem>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-4">
                <Label htmlFor="dyslexia-mode" className="flex-1">Dyslexia-Friendly Font</Label>
                <Switch
                  id="dyslexia-mode"
                  checked={dyslexiaMode}
                  onCheckedChange={setDyslexiaMode}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="rate-slider">Reading Speed</Label>
                  <span className="text-sm bg-readease-blue/30 px-2 py-1 rounded">
                    {rate.toFixed(1)}x
                  </span>
                </div>
                <Slider
                  id="rate-slider"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[rate]}
                  onValueChange={(values) => setRate(values[0])}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="pitch-slider">Voice Pitch</Label>
                  <span className="text-sm bg-readease-blue/30 px-2 py-1 rounded">
                    {pitch.toFixed(1)}
                  </span>
                </div>
                <Slider
                  id="pitch-slider"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[pitch]}
                  onValueChange={(values) => setPitch(values[0])}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="volume-slider" className="flex items-center gap-1">
                    <Volume className="h-4 w-4" />
                    Volume
                  </Label>
                  <span className="text-sm bg-readease-blue/30 px-2 py-1 rounded">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <Slider
                  id="volume-slider"
                  min={0}
                  max={1}
                  step={0.05}
                  value={[volume]}
                  onValueChange={(values) => setVolume(values[0])}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <Label htmlFor="highlight-words" className="flex-1">Highlight Words</Label>
                <Switch
                  id="highlight-words"
                  checked={highlightWords}
                  onCheckedChange={setHighlightWords}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TextToSpeech;
