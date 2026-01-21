
import { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BookText, Volume2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WordDefinition {
  word: string;
  phonetic: string;
  meanings: {
    partOfSpeech: string;
    definition: string;
    example?: string;
  }[];
  audioUrl?: string;
}

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordData, setWordData] = useState<WordDefinition | null>(null);
  const { toast } = useToast();

  // In a real application, this would call a dictionary API
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a word",
        description: "Type a word in the search box to look up its definition.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // This is mock data - in a real app, you'd fetch from a dictionary API
      setTimeout(() => {
        // Mock data for demo purposes
        const mockData: WordDefinition = {
          word: searchTerm.toLowerCase(),
          phonetic: "/ˈdɪkʃənɛri/",
          meanings: [
            {
              partOfSpeech: "noun",
              definition: "A book or electronic resource that lists words and their meanings.",
              example: "Look up the word in the dictionary."
            },
            {
              partOfSpeech: "noun",
              definition: "A reference work with a list of words from one or more languages.",
            }
          ],
          audioUrl: "https://api.dictionaryapi.dev/media/pronunciations/en/dictionary-us.mp3"
        };
        
        setWordData(mockData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch word definition. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const playAudio = () => {
    if (wordData?.audioUrl) {
      const audio = new Audio(wordData.audioUrl);
      audio.play().catch(error => {
        console.error("Failed to play audio:", error);
        toast({
          title: "Audio Error",
          description: "Could not play the pronunciation audio.",
          variant: "destructive",
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-readease-yellow/30">
      <MainNav />
      <main className="max-w-4xl mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col space-y-6">
          <section className="text-center py-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center justify-center gap-2">
              <BookText className="h-8 w-8 text-readease-brightBlue" />
              <span>ReadEase Dictionary</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Look up any word to see its definition, pronunciation, and usage examples.
            </p>
          </section>
          
          <div className="flex space-x-2">
            <Input 
              placeholder="Type a word..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-lg"
            />
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-readease-brightBlue hover:bg-readease-brightBlue/90"
            >
              {isLoading ? "Searching..." : <Search className="mr-1" />}
              {!isLoading && "Search"}
            </Button>
          </div>
          
          {wordData && (
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-readease-brightBlue">{wordData.word}</h2>
                    <p className="text-gray-500">{wordData.phonetic}</p>
                  </div>
                  {wordData.audioUrl && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={playAudio}
                      className="rounded-full h-10 w-10"
                    >
                      <Volume2 className="h-5 w-5 text-readease-brightBlue" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {wordData.meanings.map((meaning, index) => (
                    <div key={index} className="pb-3 border-b last:border-0 border-gray-100">
                      <div className="text-sm font-medium text-gray-500 mb-1">{meaning.partOfSpeech}</div>
                      <div className="font-medium mb-1">Definition:</div>
                      <p className="text-gray-800">{meaning.definition}</p>
                      {meaning.example && (
                        <>
                          <div className="font-medium mt-2 mb-1">Example:</div>
                          <p className="text-gray-600 italic">"{meaning.example}"</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {!wordData && !isLoading && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <BookText className="h-16 w-16 text-readease-blue/50 mx-auto mb-4" />
              <p className="text-lg text-gray-500">Enter a word above to see its definition</p>
            </div>
          )}
          
          {isLoading && (
            <div className="text-center py-12 animate-pulse">
              <p className="text-lg">Looking up your word...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dictionary;
