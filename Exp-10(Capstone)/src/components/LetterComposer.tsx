import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Mic, Send, Paperclip } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface LetterComposerProps {
  onClose: () => void;
  onLetterSent: () => void;
  recipientId?: string;
}

const moodOptions = [
  { value: 'formal', label: '📄 Formal', emoji: '📄' },
  { value: 'informative', label: '💡 Informative', emoji: '💡' },
  { value: 'appreciation', label: '🙏 Appreciation', emoji: '🙏' },
  { value: 'reminder', label: '⏰ Reminder', emoji: '⏰' },
  { value: 'announcement', label: '📢 Announcement', emoji: '📢' },
  { value: 'general', label: '✉️ General', emoji: '✉️' },
];

const LetterComposer = ({ onClose, onLetterSent, recipientId }: LetterComposerProps) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('formal');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [voiceRecording, setVoiceRecording] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { user } = useAuth();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!validTypes.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: "Only JPG, PNG, MP4, and PDF files are allowed",
            variant: "destructive",
          });
          return false;
        }
        
        if (file.size > maxSize) {
          toast({
            title: "File too large",
            description: "Files must be smaller than 10MB",
            variant: "destructive",
          });
          return false;
        }
        
        return true;
      });
      
      setAttachments(prev => [...prev, ...validFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });
        setVoiceRecording(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Unable to access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    
    if (error) throw error;
    return data.path;
  };

  const sendLetter = async () => {
    if (!user || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please write your letter content",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      // Get all profiles to find the recipient
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Find the other user (recipient)
      const recipient = profiles?.find(p => p.user_id !== user.id);
      
      if (!recipient) {
        toast({
          title: "No recipient found",
          description: "Unable to find the other user",
          variant: "destructive",
        });
        setSending(false);
        return;
      }

      // Upload attachments
      const uploadedAttachments = [];
      for (const file of attachments) {
        try {
          const path = await uploadFile(file, 'attachments');
          uploadedAttachments.push({
            name: file.name,
            path,
            type: file.type,
            size: file.size,
          });
        } catch (error) {
          console.error('Failed to upload attachment:', error);
        }
      }

      // Upload voice message
      let voiceMessageUrl = null;
      if (voiceRecording) {
        try {
          voiceMessageUrl = await uploadFile(voiceRecording, 'voice-messages');
        } catch (error) {
          console.error('Failed to upload voice message:', error);
        }
      }

      // Insert the letter
      const { error: letterError } = await supabase
        .from('letters')
        .insert({
          sender_id: user.id,
          recipient_id: recipient.user_id,
          subject: subject.trim() || null,
          content: content.trim(),
          mood,
          voice_message_url: voiceMessageUrl,
          attachments: uploadedAttachments,
        });

      if (letterError) throw letterError;

      toast({
        title: "Letter sent!",
        description: "Your letter has been delivered",
      });

      // Reset form and close
      setSubject('');
      setContent('');
      setMood('formal');
      setAttachments([]);
      setVoiceRecording(null);
      onLetterSent();
      onClose();

    } catch (error) {
      console.error('Error sending letter:', error);
      toast({
        title: "Failed to send letter",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto letter-paper">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <CardTitle className="font-script text-2xl text-center text-primary">
            ✍️ Compose a Letter
          </CardTitle>
          
          <p className="text-center text-muted-foreground italic">
            ""
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Subject and Mood */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject (Optional)
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="A title for your letter..."
                className="letter-paper border-accent/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Mood</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="letter-paper border-accent/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Letter Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Your Letter
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write here..."
              className="min-h-[200px] letter-paper border-accent/50 resize-none font-serif leading-relaxed"
              style={{ lineHeight: '25px' }}
            />
            <div className="text-right text-xs text-muted-foreground">
              {content.length} characters
            </div>
          </div>

          {/* Voice Recording */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Voice Message (Optional)</Label>
            <div className="flex items-center gap-2">
              {!voiceRecording ? (
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={isRecording ? stopRecording : startRecording}
                  className="flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  {isRecording ? 'Stop Recording' : 'Record Voice Message'}
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    🎙️ Voice message recorded
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setVoiceRecording(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Attachments (Optional)</Label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Paperclip className="w-4 h-4" />
                Add Files (Images, Videos, PDFs)
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.mp4,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Send Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={sendLetter}
              disabled={sending || !content.trim()}
              className="btn-vintage min-w-[200px] h-12"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin mr-2" />
                  ...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Letter 
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LetterComposer;