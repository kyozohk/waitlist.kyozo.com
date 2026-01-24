'use client';

import { motion } from "motion/react";
import { useState } from "react";
import { WaitlistForm } from "./components/WaitlistForm";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { Shield } from "lucide-react";
import Image from "next/image";

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

function HomePage() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleFormSubmit = (formData: FormSubmission) => {
    console.log('Form submitted:', formData);
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
        <AdminDashboard onClose={handleAdminClose} />
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
                  <Image src="/logo.png" alt="Kyozo" width={128} height={128} className="h-32" />
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

export default function App() {
  return <HomePage />;
}