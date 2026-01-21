
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-readease-yellow/30 p-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-readease-brightBlue">
          Welcome to ReadEase
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-700">
          Your assistive learning companion for dyslexic students
        </p>
        
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 shadow-xl mb-8">
          <p className="text-lg mb-4">
            ReadEase offers tools to help children and teens with dyslexia improve their reading and writing skills through:
          </p>
          <ul className="text-left text-lg space-y-2 mb-6">
            <li>• Text-to-Speech with word highlighting</li>
            <li>• Speech-to-Text for easier writing</li>
            <li>• Phonetic word breakdown</li>
            <li>• Customizable dyslexia-friendly display</li>
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            {user ? (
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="readease-btn-primary text-lg px-8"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => navigate("/login")} 
                  className="readease-btn-primary text-lg px-8"
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => navigate("/register")}
                  variant="outline" 
                  className="text-lg px-8"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Designed for students, parents, and educators to make learning accessible for everyone.
        </div>
      </div>
    </div>
  );
};

export default Index;
