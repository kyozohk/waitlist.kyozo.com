import { motion } from "motion/react";
import { useState } from "react";
import { WaitlistForm } from "./components/WaitlistForm";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { Shield } from "lucide-react";
import kyozoLogo from "/logo.png";

interface FormSubmission {
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
  artistQuestions: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
  };
  communityQuestions: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
  };
  productFeedbackSurvey: string;
  resonanceLevel: string;
  resonanceReasons: string[];
  communitySelections: string[];
}

export default function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([
    {
      id: "1",
      timestamp: "2026-01-18T14:32:00.000Z",
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah.chen@example.com",
      phone: "+1 415 555 0123",
      location: "San Francisco, USA",
      roleTypes: ["Artist / Musician / Performer"],
      creativeWork: "I'm a visual artist and photographer focusing on urban landscapes and street photography. I've been building my portfolio over the past 5 years and now have a growing Instagram following of around 15K. I'm looking for better ways to connect with my audience and monetize my work beyond just sponsored posts.",
      segments: ["artist"],
      artistQuestions: {
        q1: "strongly-agree",
        q2: "agree",
        q3: "strongly-agree",
        q4: "agree",
        q5: "strongly-agree"
      },
      communityQuestions: {
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: ""
      },
      productFeedbackSurvey: "yes",
      resonanceLevel: "5",
      resonanceReasons: ["control", "relationships", "freedom"],
      communitySelections: ["asia"]
    },
    {
      id: "2",
      timestamp: "2026-01-17T09:15:00.000Z",
      firstName: "Marcus",
      lastName: "Johnson",
      email: "marcus@creativecollective.org",
      phone: "+44 20 7946 0958",
      location: "London, UK",
      roleTypes: ["Community Builder"],
      creativeWork: "I run a creative collective of over 500 designers, artists, and makers in London. We organize monthly meetups, workshops, and collaborative projects. Managing everything across Discord, Eventbrite, Mailchimp, and Stripe has become overwhelming.",
      segments: ["community"],
      artistQuestions: {
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: ""
      },
      communityQuestions: {
        q1: "strongly-agree",
        q2: "strongly-agree",
        q3: "agree",
        q4: "strongly-agree",
        q5: "agree"
      },
      productFeedbackSurvey: "yes",
      resonanceLevel: "4",
      resonanceReasons: ["community-tools", "long-term"],
      communitySelections: ["willer"]
    },
    {
      id: "3",
      timestamp: "2026-01-16T16:45:00.000Z",
      firstName: "Aisha",
      lastName: "Patel",
      email: "aisha.patel@designstudio.com",
      phone: "+65 9123 4567",
      location: "Singapore",
      roleTypes: ["Creative Professional", "Community Builder"],
      creativeWork: "I'm a freelance illustrator specializing in children's book illustrations, and I also run a small online community for Asian illustrators. We have about 200 active members who share work, give feedback, and collaborate on projects.",
      segments: ["artist", "community"],
      artistQuestions: {
        q1: "agree",
        q2: "strongly-agree",
        q3: "agree",
        q4: "strongly-agree",
        q5: "agree"
      },
      communityQuestions: {
        q1: "agree",
        q2: "agree",
        q3: "strongly-agree",
        q4: "agree",
        q5: "strongly-agree"
      },
      productFeedbackSurvey: "yes",
      resonanceLevel: "5",
      resonanceReasons: ["all"],
      communitySelections: ["asia", "willer"]
    },
    {
      id: "4",
      timestamp: "2026-01-15T11:20:00.000Z",
      firstName: "Diego",
      lastName: "Rodriguez",
      email: "diego.r@musiclabel.com",
      phone: "+34 91 123 4567",
      location: "Madrid, Spain",
      roleTypes: ["Artist / Musician / Performer", "Catalyst"],
      creativeWork: "Independent electronic music producer and DJ. I release my own tracks and run a small record label supporting emerging artists. Looking for new ways to engage with fans beyond streaming platforms and build a sustainable income from my music.",
      segments: ["artist"],
      artistQuestions: {
        q1: "strongly-agree",
        q2: "strongly-agree",
        q3: "neutral",
        q4: "disagree",
        q5: "agree"
      },
      communityQuestions: {
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: ""
      },
      productFeedbackSurvey: "no",
      resonanceLevel: "2",
      resonanceReasons: ["control"],
      communitySelections: []
    },
    {
      id: "5",
      timestamp: "2026-01-14T08:30:00.000Z",
      firstName: "Emma",
      lastName: "Williams",
      email: "emma@craftcommunity.co",
      phone: "+61 2 9876 5432",
      location: "Sydney, Australia",
      roleTypes: ["Community Builder", "Explorer"],
      creativeWork: "I manage a craft and maker community with over 1,000 members across Australia. We offer online courses, host maker markets, and run a membership program. The technical overhead of managing multiple platforms is eating into my creative time.",
      segments: ["community"],
      artistQuestions: {
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: ""
      },
      communityQuestions: {
        q1: "strongly-agree",
        q2: "strongly-agree",
        q3: "strongly-agree",
        q4: "strongly-agree",
        q5: "strongly-agree"
      },
      productFeedbackSurvey: "yes",
      resonanceLevel: "4",
      resonanceReasons: ["community-tools", "safe-space", "freedom"],
      communitySelections: ["willer"]
    }
  ]);

  const handleFormSubmit = (formData: FormSubmission) => {
    setSubmissions((prev) => [...prev, formData]);
  };

  const handleAdminAccess = () => {
    setShowAdminLogin(true);
  };

  const handleAdminAuthenticate = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
  };

  const handleAdminClose = () => {
    setIsAdminAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Show Admin Dashboard in full screen when authenticated */}
      {isAdminAuthenticated ? (
        <AdminDashboard submissions={submissions} onClose={handleAdminClose} />
      ) : (
        <>
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top right soft blue gradient blob */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/30 rounded-full blur-3xl" />
            
            {/* Bottom left pink gradient blob */}
            <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-pink-200/40 to-purple-300/30 rounded-full blur-3xl" />
            
            {/* Middle right accent */}
            <div className="absolute top-1/2 -right-40 w-80 h-80 bg-gradient-to-bl from-purple-200/30 to-pink-200/20 rounded-full blur-3xl" />
          </div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-6 px-6 relative z-10"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={kyozoLogo} alt="Kyozo" className="h-32" />
                </div>
                <button
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  onClick={handleAdminAccess}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
              </div>
            </div>
          </motion.header>

          {/* Main Form */}
          <main className="py-8 px-4 relative z-10">
            <WaitlistForm onSubmit={handleFormSubmit} />
          </main>

          {/* Admin Login */}
          {showAdminLogin && (
            <AdminLogin
              onAuthenticate={handleAdminAuthenticate}
              onCancel={() => setShowAdminLogin(false)}
            />
          )}

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="py-12 text-center text-sm text-muted-foreground relative z-10"
          >
            <p>© 2026 Kyozo. Built for creatives, by creatives.</p>
          </motion.footer>
        </>
      )}
    </div>
  );
}