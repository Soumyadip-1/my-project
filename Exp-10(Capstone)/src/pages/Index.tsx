import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PenTool, LogOut, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LetterList from '@/components/LetterList';
import LetterComposer from '@/components/LetterComposer';
import LetterViewer from '@/components/LetterViewer';
import Auth from './Auth';

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const [showComposer, setShowComposer] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center vintage-paper">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-script text-lg">Opening your letter box...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const handleLetterSent = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (selectedLetter) {
    return (
      <div className="min-h-screen vintage-paper p-4">
        <div className="max-w-4xl mx-auto">
          <LetterViewer 
            letter={selectedLetter} 
            onBack={() => setSelectedLetter(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen vintage-paper">
      {/* Header */}
      <header className="border-b border-accent/30 vintage-paper">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-script text-romantic">
                e-Letter
              </h1>
              <p className="text-muted-foreground italic">
                "Unified Network"
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowComposer(true)}
                className="btn-vintage"
              >
                <PenTool className="w-4 h-4 mr-2" />
                Write New Letter
              </Button>
              
              <Button
                variant="ghost"
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave 
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <LetterList 
          onLetterSelect={setSelectedLetter}
          refreshTrigger={refreshTrigger}
        />
      </main>

      {/* Letter Composer Modal */}
      {showComposer && (
        <LetterComposer
          onClose={() => setShowComposer(false)}
          onLetterSent={handleLetterSent}
        />
      )}
    </div>
  );
};

export default Index;
