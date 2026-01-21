
import { Link } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Mic, Headphones, SpellCheck, BookText } from "lucide-react";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    title: "Text to Speech",
    description: "Listen to any text with customizable voices",
    icon: <Headphones className="h-8 w-8" />,
    href: "/text-to-speech",
    color: "bg-readease-blue",
  },
  {
    title: "Speech to Text",
    description: "Convert your voice into written text",
    icon: <Mic className="h-8 w-8" />,
    href: "/speech-to-text",
    color: "bg-readease-green",
  },
  {
    title: "Phonetic Helper",
    description: "Break down words into easy-to-read parts",
    icon: <SpellCheck className="h-8 w-8" />,
    href: "/phonetic-helper",
    color: "bg-readease-peach",
  },
  {
    title: "Dictionary",
    description: "Look up word definitions with audio and images",
    icon: <BookText className="h-8 w-8" />,
    href: "/dictionary",
    color: "bg-purple-100",
  },
  {
    title: "My Library",
    description: "Access your saved content",
    icon: <Book className="h-8 w-8" />,
    href: "/library",
    color: "bg-gray-100",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-readease-yellow/30">
      <MainNav />
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col space-y-6">
          <section className="text-center py-6">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome to ReadEase!</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your personalized learning companion designed to make reading and writing easier and more fun.
            </p>
          </section>
          
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((card) => (
                <Link key={card.title} to={card.href}>
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardHeader className={cn("rounded-t-xl", card.color)}>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
                        <div className="p-2 bg-white bg-opacity-20 rounded-full">
                          {card.icon}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardDescription className="text-base">{card.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          <section className="readease-card mt-8 bg-readease-blue/20">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-readease-brightBlue flex items-center justify-center">
                  <Book className="text-white h-16 w-16" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Daily Reading Tip</h2>
                <p className="text-lg text-gray-700">
                  Try reading aloud! When you hear yourself speak the words, it helps your brain process the information in different ways, making it easier to remember and understand.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
