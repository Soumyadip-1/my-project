import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Mail, Calendar, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Letter {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  mood: string;
  voice_message_url: string | null;
  attachments: any;
  is_read: boolean;
  created_at: string;
  sender: {
    name: string;
  };
}

interface LetterListProps {
  onLetterSelect: (letter: Letter) => void;
  refreshTrigger: number;
}

const moodEmojis: Record<string, string> = {
  formal: '📄',
  informative: '💡',
  appreciation: '🙏',
  reminder: '⏰',
  announcement: '📢',
  general: '✉️',
};

const LetterList = ({ onLetterSelect, refreshTrigger }: LetterListProps) => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const { user } = useAuth();

  const fetchLetters = async () => {
    if (!user) return;

    try {
      // Fetch letters and profiles separately to avoid type issues
      const { data: lettersData, error: lettersError } = await supabase
        .from('letters')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (lettersError) throw lettersError;

      // Fetch profiles to get sender names
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Combine the data
      const lettersWithSender = (lettersData || []).map(letter => {
        const senderProfile = profilesData?.find(p => p.user_id === letter.sender_id);
        return {
          ...letter,
          sender: {
            name: senderProfile?.name || 'Unknown'
          }
        };
      });

      setLetters(lettersWithSender);
    } catch (error) {
      console.error('Error fetching letters:', error);
      toast({
        title: "Error",
        description: "Failed to load letters",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  useEffect(() => {
    fetchLetters();
    fetchProfiles();
  }, [user, refreshTrigger]);

  const markAsRead = async (letterId: string) => {
    try {
      await supabase
        .from('letters')
        .update({ is_read: true })
        .eq('id', letterId);

      setLetters(prev => prev.map(letter => 
        letter.id === letterId 
          ? { ...letter, is_read: true }
          : letter
      ));
    } catch (error) {
      console.error('Error marking letter as read:', error);
    }
  };

  const handleLetterClick = (letter: Letter) => {
    if (!letter.is_read && letter.recipient_id === user?.id) {
      markAsRead(letter.id);
    }
    onLetterSelect(letter);
  };

  const getLetterCounts = () => {
    const sent = letters.filter(l => l.sender_id === user?.id).length;
    const received = letters.filter(l => l.recipient_id === user?.id).length;
    const unread = letters.filter(l => l.recipient_id === user?.id && !l.is_read).length;
    return { sent, received, unread };
  };

  const { sent, received, unread } = getLetterCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your e-letters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Letter Statistics */}
      <Card className="vintage-paper border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-script text-xl">
            <Heart className="w-5 h-5 text-accent" />
            e-LETTERS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{sent}</div>
              <div className="text-muted-foreground">Letters Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{received}</div>
              <div className="text-muted-foreground">Letters Received</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-vintage-gold animate-romantic-pulse">{unread}</div>
              <div className="text-muted-foreground">Unread</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unread Letters Notification */}
      {unread > 0 && (
        <Card className="vintage-paper border-accent romantic-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="wax-seal" />
              <div>
                <h3 className="font-script text-lg text-accent">
                  You have {unread} new letter{unread !== 1 ? 's' : ''}!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Message to review
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Letters List */}
      <div className="space-y-3">
        {letters.length === 0 ? (
          <Card className="vintage-paper border-accent/30">
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-script text-xl text-muted-foreground mb-2">
                Your letter box is empty
              </h3>
              <p className="text-muted-foreground">
                Compose your first e-letter
              </p>
            </CardContent>
          </Card>
        ) : (
          letters.map((letter) => (
            <Card
              key={letter.id}
              className={`vintage-paper border cursor-pointer transition-all duration-300 hover:shadow-romantic ${
                letter.recipient_id === user?.id && !letter.is_read
                  ? 'border-accent romantic-glow'
                  : 'border-accent/30 hover:border-accent/50'
              }`}
              onClick={() => handleLetterClick(letter)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {moodEmojis[letter.mood] || ''}
                      </span>
                      <h3 className="font-script text-lg text-primary">
                        {letter.subject || 'Untitled Letter'}
                      </h3>
                      {letter.recipient_id === user?.id && !letter.is_read && (
                        <Badge variant="secondary" className="bg-accent text-accent-foreground">
                          New
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>
                        {letter.sender_id === user?.id ? 'To' : 'From'}: {letter.sender.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(letter.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {letter.content.substring(0, 100)}...
                    </p>
                    
                    {(letter.voice_message_url || letter.attachments?.length > 0) && (
                      <div className="flex items-center gap-2 mt-2">
                        {letter.voice_message_url && (
                          <Badge variant="outline" className="text-xs">
                            🎙️ Voice
                          </Badge>
                        )}
                        {letter.attachments?.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            📎 {letter.attachments.length} file{letter.attachments.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default LetterList;