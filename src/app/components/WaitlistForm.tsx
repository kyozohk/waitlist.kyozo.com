import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { authenticateAnonymously, auth } from "@/lib/firebase";
import { saveWaitlistSubmission } from "@/lib/firestore";
import { sendNewSubmissionNotification } from "@/lib/email";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { ProgressBar } from "./ProgressBar";
import { FormSuccess } from "./FormSuccess";
import { AgreementScale } from "./AgreementScale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "./ui/select";
import { FEATURED_CITIES, OTHER_CITIES } from "@/data/cities";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  roleTypes: string[];
  creativeWork: string;
  betaTesting: string; // "yes" or "no"
  resonanceLevel: string; // 1-5 rating
  resonanceReasons: string[]; // multiple choice selections
  communitySelections: string[]; // ["asia", "willer"] or combinations
}

const TOTAL_STEPS = 6;

interface WaitlistFormProps {
  onSubmit: (formData: any) => void;
}

export function WaitlistForm({ onSubmit }: WaitlistFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState(0);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [requestName, setRequestName] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestCreativeWork, setRequestCreativeWork] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    roleTypes: [],
    creativeWork: "",
    betaTesting: "",
    resonanceLevel: "",
    resonanceReasons: [],
    communitySelections: [],
  });

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleRoleType = (role: string) => {
    const currentRoles = formData.roleTypes;
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];
    updateFormData("roleTypes", newRoles);
  };

  // Random data generators for Fill Info button
  const randomFirstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Dakota", "Skyler"];
  const randomLastNames = ["Chen", "Martinez", "Anderson", "Williams", "Johnson", "Garcia", "Brown", "Davis", "Rodriguez", "Wilson"];
  const randomCreativeWorks = [
    "I'm a digital artist creating surreal landscapes and abstract compositions",
    "I'm a musician and producer working on experimental electronic music",
    "I'm a visual designer specializing in brand identity and motion graphics",
    "I'm a photographer focusing on urban documentary and street photography",
    "I'm a writer crafting short fiction and creative essays about technology and culture",
    "I'm a performance artist exploring themes of identity and connection",
    "I'm a graphic designer and illustrator working on editorial and publishing projects"
  ];

  const fillCurrentStep = () => {
    const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randomAgreement = () => randomElement(["strongly-disagree", "disagree", "neutral", "agree", "strongly-agree"]);

    switch (currentStep) {
      case 1:
        setFormData((prev) => ({
          ...prev,
          firstName: randomElement(randomFirstNames),
          lastName: randomElement(randomLastNames),
          email: `${randomElement(randomFirstNames).toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`,
        }));
        break;
      case 2:
        setFormData((prev) => ({
          ...prev,
          phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          location: randomElement([...FEATURED_CITIES, ...OTHER_CITIES]),
        }));
        break;
      case 3:
        const roles = ["artist-musician-performer", "creative-professional", "curator-cultural-institution", "community-builder", "explorer", "catalyst"];
        const numRoles = Math.floor(Math.random() * 2) + 1;
        const selectedRoles: string[] = [];
        for (let i = 0; i < numRoles; i++) {
          const role = randomElement(roles.filter(r => !selectedRoles.includes(r)));
          selectedRoles.push(role);
        }
        setFormData((prev) => ({
          ...prev,
          roleTypes: selectedRoles,
          creativeWork: randomElement(randomCreativeWorks),
        }));
        break;
      case 4:
        setFormData((prev) => ({
          ...prev,
          betaTesting: randomElement(["yes", "no"]),
        }));
        break;
      case 5:
        const reasons = ["control", "connection", "expression", "privacy", "community", "freedom"];
        const numReasons = Math.floor(Math.random() * 3) + 2;
        const selectedReasons: string[] = [];
        for (let i = 0; i < numReasons; i++) {
          const reason = randomElement(reasons.filter(r => !selectedReasons.includes(r)));
          selectedReasons.push(reason);
        }
        setFormData((prev) => ({
          ...prev,
          resonanceLevel: String(Math.floor(Math.random() * 5) + 1),
          resonanceReasons: selectedReasons,
        }));
        break;
      case 6:
        const communities = ["asia", "willer"];
        const numCommunities = Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 1 : 0;
        const selectedCommunities: string[] = [];
        for (let i = 0; i < numCommunities; i++) {
          const community = randomElement(communities.filter(c => !selectedCommunities.includes(c)));
          selectedCommunities.push(community);
        }
        setFormData((prev) => ({
          ...prev,
          communitySelections: selectedCommunities,
        }));
        break;
    }
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          newErrors.firstName = "Please enter your given name";
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = "Please enter your last name";
        }
        if (!formData.email.trim()) {
          newErrors.email = "Please enter your email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        break;
      case 2:
        if (!formData.phone.trim()) {
          newErrors.phone = "Please enter your phone number";
        }
        if (!formData.location) {
          newErrors.location = "Please select your location";
        }
        break;
      case 3:
        if (!formData.creativeWork.trim()) {
          newErrors.creativeWork = "Please describe your creative work";
        }
        break;
      case 4:
        if (!formData.betaTesting) {
          newErrors.betaTesting = "Please select an option";
        }
        break;
      case 5:
        if (!formData.resonanceLevel) {
          newErrors.resonanceLevel = "Please rate your resonance with Kyozo";
        }
        if (formData.resonanceLevel && formData.resonanceReasons.length === 0) {
          newErrors.resonanceReasons = "Please select at least one reason for your rating";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Prevent double submission
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate call');
      return;
    }
    setIsSubmitting(true);

    // If user is not authenticated yet, try to authenticate first
    let currentUserId = userId;
    if (!currentUserId) {
      try {
        console.log('User not authenticated, attempting authentication...');
        const user = await authenticateAnonymously();
        currentUserId = user.uid;
        setUserId(user.uid);
        console.log('User authenticated:', user.uid);
      } catch (authError) {
        console.error('Failed to authenticate:', authError);
        alert('Authentication failed. Please try again.');
        return;
      }
    }

    try {
      const submissionData = {
        userId: currentUserId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        roleTypes: formData.roleTypes,
        creativeWork: formData.creativeWork,
        segments: [],
        artistQuestions: { q1: '', q2: '', q3: '', q4: '', q5: '' },
        communityQuestions: { q1: '', q2: '', q3: '', q4: '', q5: '' },
        productFeedbackSurvey: formData.betaTesting,
        resonanceLevel: formData.resonanceLevel,
        resonanceReasons: formData.resonanceReasons,
        communitySelections: formData.communitySelections,
      };

      // Save to Firestore
      console.log('Saving to Firestore...');
      const docId = await saveWaitlistSubmission(submissionData);
      console.log('Submission saved with ID:', docId);

      // Send email notification to dev@kyozo.com
      try {
        console.log('Sending email notification...');
        await sendNewSubmissionNotification(formData);
        console.log('Email notification sent');
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the whole submission if email fails
      }

      // Call parent onSubmit
      onSubmit({
        id: docId,
        timestamp: new Date().toISOString(),
        ...formData,
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handlePasscodeSubmit = () => {
    // TODO: Replace with actual passcode validation
    const VALID_PASSCODE = "KYOZO2026";
    
    if (passcode.trim().toUpperCase() === VALID_PASSCODE) {
      setShowLandingPage(false);
      setPasscodeError("");
    } else {
      setPasscodeError("Invalid passcode. Please check and try again.");
    }
  };

  const handleRequestSubmit = () => {
    if (!requestName.trim() || !requestEmail.trim()) {
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestEmail)) {
      return;
    }

    // TODO: Send request to backend/Supabase
    console.log("Waitlist request submitted:", { 
      name: requestName, 
      email: requestEmail,
      creativeWork: requestCreativeWork 
    });
    setRequestSubmitted(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const goToNext = () => {
    setDirection(1);
    handleNext();
  };

  const goToBack = () => {
    setDirection(-1);
    handleBack();
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  if (isSubmitted) {
    return <FormSuccess />;
  }

  // Landing Page
  if (showLandingPage) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4">




        {/* Passcode Entry Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16 w-full bg-[rgba(65,65,65,0.95)] flex flex-col gap-[12px] items-center justify-center p-[48px] relative rounded-[10px]"
        >
          <div className="flex flex-col gap-[20px] items-center text-center w-full mb-4">
            <h3 className="text-[#F1E0C7] text-[36px] tracking-[-1px] leading-[1.2] w-full m-0 font-bold">
              Enter your passcode
            </h3>
            <p className="text-[16px] leading-[24px] text-white tracking-[-0.2px] w-full font-normal font-[Inter]">
              Kyozo operates a private invitation system for access to the platform in beta version. Please enter the passcode you were given to access the sign-up form.
            </p>
          </div>
          
          <div className="flex flex-col gap-[24px] items-center justify-center w-full">
            <Input
              type="text"
              placeholder="Enter your access code"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setPasscodeError("");
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handlePasscodeSubmit();
                }
              }}
              className="h-[60px] rounded-[12px] bg-white text-[#494645] text-[16px] border border-[rgba(79,73,73,0.2)] text-center placeholder:text-[#717182]"
            />
            
            {passcodeError && (
              <p className="text-[#ff6b6b] text-sm text-center font-medium mt-[-10px]">{passcodeError}</p>
            )}
            
            <Button
              onClick={handlePasscodeSubmit}
              className="h-[48px] w-[180px] rounded-full bg-[#f7d47a] text-[#494645] text-[18px] font-semibold hover:bg-[#f7d47a]/90 hover:text-[#494645] transition-opacity border-none"
            >
              Unlock
            </Button>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mb-16"
        >
          <div className="flex gap-[5px] items-center relative w-full">
            <div className="bg-[#494645] flex-[1_0_0] h-[2px] min-h-px min-w-px opacity-40 relative">
              <div aria-hidden="true" className="absolute border-2 border-[#494645] border-solid inset-[-1px] pointer-events-none" />
            </div>
            <p className="font-sans font-semibold leading-[20px] not-italic relative shrink-0 text-[#494645] text-[14px] text-center tracking-[-0.1504px] uppercase w-[44px]">
              Or
            </p>
            <div className="flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative">
              <div className="-scale-y-100 flex-none rotate-180 w-full">
                <div className="bg-[#494645] h-[2px] opacity-40 relative w-full">
                  <div aria-hidden="true" className="absolute border border-[#494645] border-solid inset-[-0.5px] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Request Access Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16 w-full bg-[rgba(245,241,232,0.95)] flex flex-col gap-[12px] items-center justify-center p-[48px] relative rounded-[10px]"
        >
          {!requestSubmitted ? (
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col gap-[20px] items-center text-center w-full mb-[50px]">
                <div className="flex flex-col font-normal justify-center leading-[1.2] shrink-0 text-[#4f4949] text-[36px] tracking-[-1px]">
                  <h3 className="text-[36px] font-bold">Waitlist request</h3>
                </div>
                <p className="font-normal leading-[22px] shrink-0 text-[#504c4c] text-[16px] tracking-[-0.5px] max-w-[486px]">
                  If you'd like to leave us your name and email to request consideration as part of our waitlist, input it here.
                </p>
              </div>

              <div className="flex flex-col gap-[50px] items-center w-full">
                <div className="flex flex-col gap-[38px] items-start w-full">
                  <div className="flex flex-col gap-[12px] items-start w-full">
                    <Label htmlFor="request-name" className="font-semibold text-[#4f4949] text-[13px] tracking-[-0.15px]">Full Name</Label>
                    <Input
                      id="request-name"
                      placeholder="Enter your name"
                      value={requestName}
                      onChange={(e) => setRequestName(e.target.value)}
                      className="h-[60px] rounded-[12px] bg-white border border-[rgba(79,73,73,0.2)] text-[#4f4949] text-[14px] px-[16px] placeholder:text-[#717182] focus-visible:ring-1 focus-visible:ring-[#4f4949] shadow-none"
                    />
                  </div>

                  <div className="flex flex-col gap-[12px] items-start w-full">
                    <Label htmlFor="request-email" className="font-semibold text-[#4f4949] text-[13px] tracking-[-0.15px]">Email Address</Label>
                    <Input
                      id="request-email"
                      type="email"
                      placeholder="And your email"
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleRequestSubmit();
                        }
                      }}
                      className="h-[60px] rounded-[12px] bg-white border border-[rgba(79,73,73,0.2)] text-[#4f4949] text-[14px] px-[16px] placeholder:text-[#717182] focus-visible:ring-1 focus-visible:ring-[#4f4949] shadow-none"
                    />
                  </div>

                  <div className="flex flex-col gap-[12px] items-start w-full">
                    <Label htmlFor="request-creative-work" className="font-semibold text-[#4f4949] text-[13px] tracking-[-0.15px]">Creative work</Label>
                    <Textarea
                      id="request-creative-work"
                      placeholder="And we’d love to hear a bit more about your creative work...."
                      value={requestCreativeWork}
                      onChange={(e) => setRequestCreativeWork(e.target.value)}
                      className="min-h-[150px] rounded-[12px] bg-white border border-[rgba(4,139,154,0.3)] text-[#4f4949] text-[14px] p-[16px] placeholder:text-[#717182] resize-none focus-visible:ring-1 focus-visible:ring-[#048b9a] shadow-none"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleRequestSubmit}
                  disabled={!requestName.trim() || !requestEmail.trim()}
                  className="bg-[#414141] h-[48px] px-[24px] rounded-[999px] text-[#f5f1e8] text-[18px] font-semibold hover:bg-[#414141]/90 border-none tracking-[-0.36px] disabled:opacity-100 opacity-100"
                >
                  Submit request
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#4f4949] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#f5f1e8]"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#4f4949] mb-2">
                Request Submitted!
              </h3>
              <p className="text-[#504c4c]">
                Thank you for your interest. We'll review your request and be in touch soon.
              </p>
            </div>
          )}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 mt-12 text-sm text-muted-foreground"
        >
          <Lock className="w-4 h-4" />
          <span>Private invitation-only access</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Invitation Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 md:p-10 text-foreground shadow-sm border border-cyan-100/50"
      >
        <div>
          <h2 className="text-2xl md:text-3xl text-[var(--kyozo-teal)] mb-4 font-normal text-center">
            You're Invited
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-6">
            We're excited to invite you to be among the first to experience the reimagined Kyozo, and if you are willing to help us beta test, we will give you six months of premium access.
          </p>
        </div>
      </motion.div>

      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <div className="min-h-[450px] relative pb-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            {/* Step 1: Name & Email */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl md:text-4xl mb-3">Welcome to Kyozo</h2>
                    <p className="text-muted-foreground">
                      Let's start with your basic information
                    </p>
                  </div>
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillCurrentStep}
                    className="text-[var(--kyozo-teal)] border-[var(--kyozo-teal)] hover:bg-[var(--kyozo-teal)]/10"
                  >
                    Fill Info
                  </Button> */}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Given Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your given name"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-base h-12"
                  />
                  {errors.firstName && (
                    <p className="text-destructive text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-base h-12"
                  />
                  {errors.lastName && (
                    <p className="text-destructive text-sm">{errors.lastName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-lg h-14 border-2 focus:border-[var(--kyozo-primary)] transition-colors"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Additional Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl md:text-4xl mb-3">Additional Information</h2>
                    <p className="text-muted-foreground">We need a few more details to personalize your experience</p>
                  </div>
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillCurrentStep}
                    className="text-[var(--kyozo-teal)] border-[var(--kyozo-teal)] hover:bg-[var(--kyozo-teal)]/10"
                  >
                    Fill Info
                  </Button> */}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-lg h-14 border-2 focus:border-[var(--kyozo-primary)] transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => updateFormData("location", value)}
                  >
                    <SelectTrigger className="text-lg h-14 border-2 focus:border-[var(--kyozo-primary)] transition-colors">
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {FEATURED_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                      <SelectSeparator />
                      {OTHER_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && (
                    <p className="text-destructive text-sm">{errors.location}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Creative Work */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl md:text-4xl mb-3">Tell us about your creative work</h2>
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillCurrentStep}
                    className="text-[var(--kyozo-teal)] border-[var(--kyozo-teal)] hover:bg-[var(--kyozo-teal)]/10"
                  >
                    Fill Info
                  </Button> */}
                </div>
                
                {/* Role Types - Multiple Choice */}
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200">
                    <h3 className="text-2xl font-semibold mb-2 text-[var(--kyozo-teal)]">
                      Which of these best describes you?
                    </h3>
                    <p className="text-base text-gray-700">
                      We encourage you to select multiple items if more than one of these categories fits you.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { 
                        value: "artist-musician-performer", 
                        label: "Artist / Musician / Performer",
                        description: "I make original work—whether visual art, music, performance, writing, or other creative expression"
                      },
                      { 
                        value: "creative-professional", 
                        label: "Creative Professional",
                        description: "I bring ideas to life through design, storytelling, creative direction, or creative problem-solving"
                      },
                      { 
                        value: "curator-cultural-institution", 
                        label: "Curator/Cultural Institution",
                        description: "I curate experiences, exhibitions, or programs that showcase and contextualize creative work"
                      },
                      { 
                        value: "community-builder", 
                        label: "Community Builder",
                        description: "I gather and guide others, organize spaces, or curate experiences where people connect around creativity"
                      },
                      { 
                        value: "explorer", 
                        label: "Explorer",
                        description: "I'm discovering my creative path and seeking my community"
                      },
                      { 
                        value: "catalyst", 
                        label: "Catalyst",
                        description: "I operate at scale, building cultural institutions, organizing major events, or creating enterprises that amplify creative voices"
                      },
                    ].map((role) => (
                      <div
                        key={role.value}
                        className={`flex items-start space-x-3 p-4 border rounded-lg transition-all cursor-pointer ${
                          formData.roleTypes.includes(role.value)
                            ? 'bg-[#048B9A] border-[#048B9A] shadow-lg shadow-[#048B9A]/20'
                            : 'border-border hover:bg-muted/50'
                        }`}
                        onClick={() => toggleRoleType(role.value)}
                      >
                        <Checkbox
                          id={`role-${role.value}`}
                          checked={formData.roleTypes.includes(role.value)}
                          onCheckedChange={() => toggleRoleType(role.value)}
                          className={`mt-0.5 ${
                            formData.roleTypes.includes(role.value)
                              ? 'border-white data-[state=checked]:bg-white data-[state=checked]:text-[#048B9A]'
                              : ''
                          }`}
                        />
                        <div className="flex-1 cursor-pointer flex flex-col sm:grid sm:grid-cols-[280px_1fr] gap-1 sm:gap-4 items-start">
                          <Label
                            htmlFor={`role-${role.value}`}
                            className={`font-semibold cursor-pointer ${
                              formData.roleTypes.includes(role.value) ? 'text-white' : ''
                            }`}
                          >
                            {role.label}:
                          </Label>
                          <div className={`text-sm font-normal ${
                            formData.roleTypes.includes(role.value) ? 'text-white/90' : 'text-muted-foreground'
                          }`}>
                            {role.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creativeWork">Please give us a short description of your creative work</Label>
                  <Textarea
                    id="creativeWork"
                    placeholder="I'm a graphic designer specializing in brand identity..."
                    value={formData.creativeWork}
                    onChange={(e) => updateFormData("creativeWork", e.target.value)}
                    className="text-lg min-h-[150px] border-2 focus:border-[var(--kyozo-primary)] transition-colors resize-none"
                  />
                  {errors.creativeWork && (
                    <p className="text-destructive text-sm">{errors.creativeWork}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Beta Testing */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl mb-3">Are you willing to help us beta test Kyozo?</h2>
                    <p className="text-muted-foreground text-base">
                      We are offering six months of premium access for free to those who help us test the platform.
                    </p>
                  </div>
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillCurrentStep}
                    className="text-[var(--kyozo-teal)] border-[var(--kyozo-teal)] hover:bg-[var(--kyozo-teal)]/10 flex-shrink-0"
                  >
                    Fill Info
                  </Button> */}
                </div>
                
                <div className="space-y-4">
                  <RadioGroup
                    value={formData.betaTesting}
                    onValueChange={(value) => updateFormData("betaTesting", value)}
                  >
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-[var(--kyozo-primary)] transition-colors cursor-pointer">
                      <RadioGroupItem value="yes" id="beta-yes" />
                      <Label htmlFor="beta-yes" className="flex-1 cursor-pointer text-lg">
                        Yes, count me in
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-[var(--kyozo-primary)] transition-colors cursor-pointer">
                      <RadioGroupItem value="no" id="beta-no" />
                      <Label htmlFor="beta-no" className="flex-1 cursor-pointer text-lg">
                        No, thank you
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.betaTesting && (
                    <p className="text-destructive text-sm">{errors.betaTesting}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Kyozo Vision & Resonance */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="flex items-center justify-end">
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillCurrentStep}
                    className="text-[var(--kyozo-teal)] border-[var(--kyozo-teal)] hover:bg-[var(--kyozo-teal)]/10"
                  >
                    Fill Info
                  </Button> */}
                </div>
                {/* About Kyozo */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <h2 className="text-2xl md:text-3xl text-[var(--kyozo-secondary)] font-semibold text-center">Kyozo's Vision</h2>
                  <div className="space-y-3 text-muted-foreground leading-relaxed">
                    <p>
                      Kyozo gives creatives control.
                    </p>
                    <p>
                      Share work, build meaningful communities, and engage audiences on your terms.
                    </p>
                    <p>
                      Express yourself across multiple formats, distribute how you want, and connect with humans who truly value what you create.
                    </p>
                    <p>
                      Built by creative professionals for creative professionals: Kyozo is anti-"extraction economy", anti-"social economy", and anti-"algorithm tyranny".
                    </p>
                    <p>
                      Kyozo is on a mission to make creative life easier, integrating existing platforms to turbocharge your workflow rather than forcing replacement. We make community management seamless, helping you understand your audience, connect authentically, and transform how you approach creative organizing.
                    </p>
                    <p>
                      Kyozo promotes artists and creatives. We support the building of communities rooted in shared creative interests, free from algorithms and social pressures.
                    </p>
                    <p>
                      Whether you're an individual artist, community leader, or large-scale organizer, Kyozo provides the foundation for authentic creative flourishing.
                    </p>
                    <p>
                      We are excited to have you as part of our founding community of creative leaders!
                    </p>
                  </div>
                </div>

                {/* Rating Question */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl mb-2">How does Kyozo's vision resonate with you?</h3>
                    <p className="text-sm text-muted-foreground">Rate your excitement level from 1 (Low) to 5 (High)</p>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { value: "1", label: "1 - Not sure", description: "Not sure this fits with what I am working on" },
                      { value: "2", label: "2 - Curious", description: "This is an interesting concept; want to learn more. Keep me posted." },
                      { value: "3", label: "3 - Excited", description: "This addresses some challenges I've experienced, and I want to be kept up to date" },
                      { value: "4", label: "4 - Essential", description: "I've been waiting for something exactly like this. Sign me up." },
                      { value: "5", label: "5 - Urgent", description: "This is critical to my creative practice—I need this to exist" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        onClick={() => updateFormData("resonanceLevel", option.value)}
                        className={`
                          p-5 rounded-lg border-2 cursor-pointer transition-all
                          ${formData.resonanceLevel === option.value
                            ? "bg-gradient-to-br from-[var(--kyozo-primary)]/20 to-[var(--kyozo-secondary)]/20 border-[var(--kyozo-primary)] shadow-md"
                            : "border-border hover:border-[var(--kyozo-primary)]/50 hover:bg-muted/30"
                          }
                        `}
                      >
                        <div className="font-semibold text-lg mb-1">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    ))}
                  </div>
                  {errors.resonanceLevel && (
                    <p className="text-destructive text-sm">{errors.resonanceLevel}</p>
                  )}
                </div>

                {/* Multiple Choice Question - shown after rating */}
                {formData.resonanceLevel && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="text-xl md:text-2xl mb-2">Which aspects of Kyozo resonate most with you?</h3>
                      <p className="text-sm text-muted-foreground">(select all that apply)</p>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { value: "control", label: "Kyozo gives creatives control" },
                        { value: "communities-on-terms", label: "Share work, build meaningful communities, and engage audiences on your terms" },
                        { value: "expression", label: "Express yourself across multiple formats, distribute on your own terms" },
                        { value: "anti-economy", label: "Built by creative professionals for creative professionals: anti-\"extraction economy\", anti-\"social economy\", and anti-\"algorithm tyranny\"" },
                        { value: "integration", label: "Integrating existing platforms to turbocharge your workflow rather than forcing replacement, making community management seamless" },
                        { value: "community", label: "Support the building of communities rooted in shared creative interests, free from algorithms and social pressures" },
                        { value: "foundation", label: "Provides the foundation for authentic creative flourishing for individual artists, community leaders, or large-scale organizers" },
                        { value: "all", label: "All of the above—this entire vision speaks to me" },
                      ].map((reason) => (
                        <div
                          key={reason.value}
                          onClick={() => {
                            const newReasons = formData.resonanceReasons.includes(reason.value)
                              ? formData.resonanceReasons.filter((r) => r !== reason.value)
                              : [...formData.resonanceReasons, reason.value];
                            updateFormData("resonanceReasons", newReasons);
                          }}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${formData.resonanceReasons.includes(reason.value)
                              ? "bg-gradient-to-br from-teal-50 to-cyan-100 border-[var(--kyozo-teal)] shadow-sm"
                              : "border-border hover:border-[var(--kyozo-teal)]/50 hover:bg-muted/30"
                            }
                          `}
                        >
                          <div className="text-base font-normal">
                            {reason.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.resonanceReasons && (
                      <p className="text-destructive text-sm">{errors.resonanceReasons}</p>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 6: Join Beta-Communities */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl md:text-4xl mb-3">
                    Kyozo is an eco-system of creative communities. Would you like to join any of these beta-communities?
                  </h2>
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillCurrentStep}
                    className="text-[var(--kyozo-teal)] border-[var(--kyozo-teal)] hover:bg-[var(--kyozo-teal)]/10 flex-shrink-0"
                  >
                    Fill Info
                  </Button> */}
                </div>

                <div className="space-y-4">
                  {/* Creative-Entrepreneurs : Asia */}
                  <div 
                    className={`
                      p-6 rounded-xl border-2 cursor-pointer transition-all
                      ${
                        formData.communitySelections.includes("asia")
                          ? "border-[var(--kyozo-teal)] bg-[var(--kyozo-teal)]/5 shadow-md"
                          : "border-border hover:border-[var(--kyozo-teal)]/50"
                      }
                    `}
                    onClick={() => {
                      const newSelections = formData.communitySelections.includes("asia")
                        ? formData.communitySelections.filter((s) => s !== "asia")
                        : [...formData.communitySelections, "asia"];
                      updateFormData("communitySelections", newSelections);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        id="community-asia"
                        checked={formData.communitySelections.includes("asia")}
                        onCheckedChange={() => {
                          const newSelections = formData.communitySelections.includes("asia")
                            ? formData.communitySelections.filter((s) => s !== "asia")
                            : [...formData.communitySelections, "asia"];
                          updateFormData("communitySelections", newSelections);
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold">Creative-Entrepreneurs : Asia</h3>
                          <span className="px-3 py-1 bg-[var(--kyozo-teal)] text-white text-xs rounded-full font-medium">
                            Community
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          We will share relevant opportunities, connections, and resources tailored to creative entrepreneurs in Asia.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Willer */}
                  <div 
                    className={`
                      p-6 rounded-xl border-2 cursor-pointer transition-all
                      ${
                        formData.communitySelections.includes("willer")
                          ? "border-[var(--kyozo-secondary)] bg-[var(--kyozo-secondary)]/5 shadow-md"
                          : "border-border hover:border-[var(--kyozo-secondary)]/50"
                      }
                    `}
                    onClick={() => {
                      const newSelections = formData.communitySelections.includes("willer")
                        ? formData.communitySelections.filter((s) => s !== "willer")
                        : [...formData.communitySelections, "willer"];
                      updateFormData("communitySelections", newSelections);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        id="community-willer"
                        checked={formData.communitySelections.includes("willer")}
                        onCheckedChange={() => {
                          const newSelections = formData.communitySelections.includes("willer")
                            ? formData.communitySelections.filter((s) => s !== "willer")
                            : [...formData.communitySelections, "willer"];
                          updateFormData("communitySelections", newSelections);
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold">Willer</h3>
                          <span className="px-3 py-1 bg-[var(--kyozo-secondary)] text-white text-xs rounded-full font-medium">
                            Artist/Creative
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Kyozo founder Willer will share his research into creativity, artistic expression, music, and the history of human experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy Note */}
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Kyozo communities contain no group chats, full privacy settings which are defaulted to invisible, so no one will be able to reach you without your consent
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center mt-12 pt-6 border-t"
      >
        <Button
          variant="ghost"
          onClick={goToBack}
          disabled={currentStep === 1}
          className="group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>

        <Button
          onClick={goToNext}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[var(--kyozo-primary)] to-[var(--kyozo-secondary)] hover:opacity-90 transition-opacity group px-8 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : (currentStep === TOTAL_STEPS ? "Submit" : "Next")}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Private Access Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground"
      >
        <Lock className="w-4 h-4" />
        <span>Private invitation-only access</span>
      </motion.div>
    </div>
  );
}