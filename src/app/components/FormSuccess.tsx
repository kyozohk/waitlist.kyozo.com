import { motion } from "motion/react";
import { CheckCircle2, Sparkles } from "lucide-react";

export function FormSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center px-4 max-w-3xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <div className="relative">
          <div className="w-24 h-24 bg-[var(--kyozo-dark)] rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--kyozo-secondary)] rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl mb-4 text-[var(--kyozo-dark)]"
      >
        You're on the list!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-muted-foreground max-w-md mb-8 text-center"
      >
        Thank you for joining Kyozo. We've received your information and will be in touch soon with exclusive early access.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <div className="w-2 h-2 bg-[var(--kyozo-secondary)] rounded-full animate-pulse" />
        <span>Your submission has been securely stored</span>
      </motion.div>
    </motion.div>
  );
}
