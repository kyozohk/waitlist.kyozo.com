import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getWaitlistSubmissions } from '@/lib/firestore';
import { sendReplyEmail } from '@/lib/email';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Mail, LogOut, Send, User, Phone, MapPin, Briefcase } from 'lucide-react';

interface Submission {
  id: string;
  timestamp: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  roleTypes: string[];
  creativeWork: string;
  segments: string[];
  productFeedbackSurvey: string;
  resonanceLevel: string;
  resonanceReasons: string[];
  communitySelections: string[];
}

interface ResponsesPageProps {
  onLogout: () => void;
}

export function ResponsesPage({ onLogout }: ResponsesPageProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await getWaitlistSubmissions();
      setSubmissions(data as Submission[]);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedSubmission || !replyMessage.trim()) return;

    setSendingReply(true);
    try {
      await sendReplyEmail(selectedSubmission.email, replyMessage);
      alert('Reply sent successfully!');
      setReplyMessage('');
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Waitlist Responses</h1>
            <p className="text-sm text-muted-foreground">{submissions.length} total submissions</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-6">
          {submissions.map((submission) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {submission.firstName} {submission.lastName}
                      </CardTitle>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{submission.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{submission.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{submission.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDate(submission.timestamp)}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            disabled={!submission.email}
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Reply
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Reply to {submission.firstName} {submission.lastName}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">To: {submission.email}</p>
                            </div>
                            <Textarea
                              placeholder="Write your reply message..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              rows={8}
                              className="resize-none"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setReplyMessage('');
                                  setSelectedSubmission(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSendReply}
                                disabled={!replyMessage.trim() || sendingReply}
                              >
                                {sendingReply ? 'Sending...' : 'Send Reply'}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Role Types
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {submission.roleTypes.map((role, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Creative Work</h4>
                      <p className="text-muted-foreground">{submission.creativeWork}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Beta Testing</h4>
                        <p className="text-muted-foreground capitalize">{submission.productFeedbackSurvey}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Resonance Level</h4>
                        <p className="text-muted-foreground">{submission.resonanceLevel}/5</p>
                      </div>
                    </div>

                    {submission.resonanceReasons.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Resonance Reasons</h4>
                        <div className="flex flex-wrap gap-2">
                          {submission.resonanceReasons.map((reason, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {submission.communitySelections.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Community Selections</h4>
                        <div className="flex flex-wrap gap-2">
                          {submission.communitySelections.map((community, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-sm"
                            >
                              {community}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {submissions.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground">
                Waitlist submissions will appear here once users complete the survey.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
