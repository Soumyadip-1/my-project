import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Heart, Download, Play, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

interface Letter {
  id: string;
  sender_id: string;
  subject: string;
  content: string;
  mood: string;
  voice_message_url: string | null;
  attachments: any;
  created_at: string;
  sender: { name: string };
}

interface LetterViewerProps {
  letter: Letter;
  onBack: () => void;
}

const moodEmojis: Record<string, string> = {
  formal: '📄',
  informative: '💡',
  appreciation: '🙏',
  reminder: '⏰',
  announcement: '📢',
  general: '✉️',
};

const LetterViewer = ({ letter, onBack }: LetterViewerProps) => {
  const { user } = useAuth();
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [attachmentUrls, setAttachmentUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const generateSignedUrls = async () => {
      try {
        // Generate signed URL for voice message
        if (letter.voice_message_url) {
          console.log('Generating signed URL for voice:', letter.voice_message_url);
          const { data, error } = await supabase.storage
            .from('voice-messages')
            .createSignedUrl(letter.voice_message_url, 3600);
          
          if (error) {
            console.error('Voice URL error:', error);
          } else if (data?.signedUrl) {
            console.log('Voice URL generated successfully');
            setVoiceUrl(data.signedUrl);
          }
        }

        // Generate signed URLs for attachments
        if (letter.attachments && Array.isArray(letter.attachments)) {
          const urls: { [key: string]: string } = {};
          
          for (const attachment of letter.attachments) {
            console.log('Generating signed URL for attachment:', attachment.path);
            const { data, error } = await supabase.storage
              .from('letters-attachments')
              .createSignedUrl(attachment.path, 3600);
            
            if (error) {
              console.error('Attachment URL error:', error);
            } else if (data?.signedUrl) {
              console.log('Attachment URL generated successfully');
              urls[attachment.path] = data.signedUrl;
            }
          }
          
          setAttachmentUrls(urls);
        }
      } catch (error) {
        console.error('Error in generateSignedUrls:', error);
      }
    };

    generateSignedUrls();
  }, [letter.voice_message_url, letter.attachments]);

  const handleDownload = async (attachment: any) => {
    try {
      // Use signed URL for download instead of direct download
      const signedUrl = attachmentUrls[attachment.path];
      if (signedUrl) {
        const a = document.createElement('a');
        a.href = signedUrl;
        a.download = attachment.name;
        a.target = '_blank';
        a.click();
      } else {
        console.error('No signed URL available for attachment');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const isImageFile = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
  };

  const isVideoFile = (fileName: string) => {
    return /\.(mp4|webm|ogg|mov|avi)$/i.test(fileName);
  };

  const renderAttachmentPreview = (attachment: any) => {
    const signedUrl = attachmentUrls[attachment.path];
    
    if (!signedUrl) {
      return (
        <div className="h-16 bg-muted/50 rounded border flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Loading preview...</span>
        </div>
      );
    }

    if (isImageFile(attachment.name)) {
      return (
        <img 
          src={signedUrl} 
          alt={attachment.name}
          className="max-w-full h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => window.open(signedUrl, '_blank')}
          title="Click to view full size"
        />
      );
    }

    if (isVideoFile(attachment.name)) {
      return (
        <video 
          src={signedUrl} 
          controls 
          className="max-w-full h-16 rounded border"
          preload="metadata"
        >
          Your browser does not support video playback.
        </video>
      );
    }

    return (
      <div className="h-16 bg-muted/50 rounded border flex items-center justify-center">
        <span className="text-xs text-muted-foreground">File: {attachment.name}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Letters
      </Button>

      <Card className="letter-paper shadow-romantic">
        <CardHeader className="text-center border-b border-accent/30">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">{moodEmojis[letter.mood] || ''}</span>
            <h1 className="font-script text-3xl text-primary">
              {letter.subject || 'My Dearest Letter'}
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>From: {letter.sender.name}</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(letter.created_at).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap font-serif leading-relaxed text-foreground">
              {letter.content}
            </div>
          </div>

          {letter.voice_message_url && (
            <div className="mt-3 p-2 bg-secondary/20 rounded-md border border-border/40">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs">🎙️</span>
                <span className="text-xs font-medium">Voice Message</span>
                {!voiceUrl && <span className="text-xs text-muted-foreground">Loading...</span>}
              </div>
              {voiceUrl && (
                <audio controls className="w-full h-6" style={{ height: '24px' }}>
                  <source src={voiceUrl} type="audio/wav" />
                  <source src={voiceUrl} type="audio/mp3" />
                  <source src={voiceUrl} type="audio/ogg" />
                  Your browser does not support audio playback.
                </audio>
              )}
            </div>
          )}

          {letter.attachments && Array.isArray(letter.attachments) && letter.attachments.length > 0 && (
            <div className="mt-3">
              <h3 className="text-xs font-medium mb-1 flex items-center gap-1 text-muted-foreground">
                📎 Attachments ({letter.attachments.length})
              </h3>
              <div className="space-y-1">
                {letter.attachments.map((attachment: any, index: number) => {
                  const preview = renderAttachmentPreview(attachment);
                  const signedUrl = attachmentUrls[attachment.path];
                  
                  return (
                    <div key={index} className="p-2 bg-secondary/20 rounded-md border border-border/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium truncate flex-1" title={attachment.name}>
                          {attachment.name}
                        </span>
                        <div className="flex gap-1">
                          {signedUrl && (isImageFile(attachment.name) || isVideoFile(attachment.name)) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(signedUrl, '_blank')}
                              className="h-5 px-1 text-xs"
                              title="Open in new tab"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(attachment)}
                            className="h-5 px-1 text-xs"
                            disabled={!signedUrl}
                            title="Download file"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-1">
                        {preview}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LetterViewer;