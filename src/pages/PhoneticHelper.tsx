
import { useState } from 'react';
import { MainNav } from '@/components/MainNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Volume } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const PhoneticHelper = () => {
  const [word, setWord] = useState<string>('');
  const [phonetics, setPhonetics] = useState<string[]>([]);
  const [dyslexiaMode, setDyslexiaMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recentWords, setRecentWords] = useState<string[]>([]);
  const [colorCoding, setColorCoding] = useState<boolean>(true);

  // Color mapping for different types of sounds
  const soundColors: {[key: string]: string} = {
    vowels: "bg-red-200", 
    consonants: "bg-blue-200",
    digraphs: "bg-green-200",
    blends: "bg-purple-200"
  };

  // Mock phonetic data
  const mockPhoneticMapping: {[key: string]: string[]} = {
    'cat': ['c', 'a', 't'],
    'dog': ['d', 'o', 'g'],
    'book': ['b', 'oo', 'k'],
    'phonetic': ['ph', 'o', 'n', 'e', 't', 'ic'],
    'reading': ['r', 'ea', 'd', 'ing'],
    'dyslexia': ['d', 'y', 's', 'l', 'e', 'x', 'i', 'a'],
    'school': ['s', 'ch', 'oo', 'l'],
    'through': ['th', 'r', 'ou', 'gh'],
    'together': ['t', 'o', 'g', 'e', 'th', 'er'],
    'thought': ['th', 'ou', 'gh', 't'],
  };
  
  // Sound types for color coding
  const getSoundType = (sound: string): string => {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'aa', 'ae', 'ai', 'ao', 'au', 'ay', 
                    'ea', 'ee', 'ei', 'eo', 'eu', 'ey', 'ia', 'ie', 'io', 'iu', 'iy', 
                    'oa', 'oe', 'oi', 'oo', 'ou', 'oy', 'ua', 'ue', 'ui', 'uo', 'uy'];
    const digraphs = ['ch', 'sh', 'th', 'wh', 'ph', 'gh', 'ng', 'ck'];
    const blends = ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 
                    'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'tr', 'tw'];
    
    if (vowels.includes(sound.toLowerCase())) return "vowels";
    if (digraphs.includes(sound.toLowerCase())) return "digraphs";
    if (blends.includes(sound.toLowerCase())) return "blends";
    return "consonants";
  };
  
  // Get the background color class for a syllable
  const getSyllableColor = (syllable: string): string => {
    if (!colorCoding) return "bg-gray-100";
    return soundColors[getSoundType(syllable)] || "bg-gray-100";
  };

  const breakDownWord = (inputWord: string) => {
    setIsLoading(true);
    
    // Simulate API call to phonetic breakdown service
    setTimeout(() => {
      const lowerWord = inputWord.toLowerCase();
      
      if (mockPhoneticMapping[lowerWord]) {
        setPhonetics(mockPhoneticMapping[lowerWord]);
        
        // Add to recent words if not already there
        if (!recentWords.includes(inputWord)) {
          setRecentWords(prev => [inputWord, ...prev].slice(0, 5));
        }
        
        toast.success(`Successfully broke down '${inputWord}'`);
      } else {
        // If word is not in our mock database, create a simple syllable breakdown
        const simpleSyllables = inputWord.split('').map(char => char);
        setPhonetics(simpleSyllables);
        toast.info("Using basic phonetics - this word isn't in our database yet!");
      }
      
      setIsLoading(false);
    }, 800); // Simulate network delay
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      breakDownWord(word.trim());
    } else {
      toast.error("Please enter a word");
    }
  };

  const speakSyllable = (syllable: string) => {
    const utterance = new SpeechSynthesisUtterance(syllable);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const speakFullWord = () => {
    if (phonetics.length > 0) {
      const fullWord = word;
      const utterance = new SpeechSynthesisUtterance(fullWord);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`min-h-screen ${dyslexiaMode ? 'dyslexic-mode' : ''} bg-readease-yellow/30`}>
      <MainNav />
      
      <main className="max-w-4xl mx-auto px-4 py-8 md:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Phonetic Helper</h1>
          <p className="text-gray-600">Break down words into easy-to-read parts</p>
        </div>
        
        <Card className="readease-card mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="word-input" className="mb-2 block text-lg font-medium">Enter a word</Label>
                  <Input
                    id="word-input"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    className="text-lg h-12"
                    placeholder="Type a word here..."
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    type="submit" 
                    className="readease-btn-primary text-lg w-full h-12" 
                    disabled={isLoading || !word.trim()}
                  >
                    {isLoading ? "Breaking Down..." : "Break Down"}
                  </Button>
                </div>
              </div>
            </form>
            
            {phonetics.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold">Phonetic Breakdown</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={speakFullWord}
                    className="flex items-center gap-1"
                  >
                    <Volume className="h-4 w-4" />
                    Speak Word
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-3">
                  {phonetics.map((syllable, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={cn(
                        "text-2xl font-bold px-4 py-6 relative hover:scale-110 transition-transform",
                        getSyllableColor(syllable)
                      )}
                      onClick={() => speakSyllable(syllable)}
                    >
                      {syllable}
                      <Volume className="h-4 w-4 absolute top-1 right-1 opacity-50" />
                    </Button>
                  ))}
                </div>
                
                <p className="text-center text-lg mt-3 bg-readease-blue/20 py-2 rounded-lg">
                  {phonetics.join(' - ')}
                </p>
              </div>
            )}
            
            {recentWords.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Recently searched words:</h3>
                <div className="flex flex-wrap gap-2">
                  {recentWords.map((recentWord, index) => (
                    <Button 
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWord(recentWord);
                        breakDownWord(recentWord);
                      }}
                    >
                      {recentWord}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="readease-card">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Helper Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dyslexia-mode" className="text-lg">Dyslexia-Friendly Font</Label>
                <Switch
                  id="dyslexia-mode"
                  checked={dyslexiaMode}
                  onCheckedChange={setDyslexiaMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="color-coding" className="text-lg">Color-Code Sounds</Label>
                <Switch
                  id="color-coding"
                  checked={colorCoding}
                  onCheckedChange={setColorCoding}
                />
              </div>
            </div>
            
            {colorCoding && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Color Guide:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className={`${soundColors.vowels} p-2 rounded text-center`}>
                    Vowels
                  </div>
                  <div className={`${soundColors.consonants} p-2 rounded text-center`}>
                    Consonants
                  </div>
                  <div className={`${soundColors.digraphs} p-2 rounded text-center`}>
                    Digraphs (ch, sh)
                  </div>
                  <div className={`${soundColors.blends} p-2 rounded text-center`}>
                    Blends (bl, tr)
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PhoneticHelper;
