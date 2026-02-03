import { motion } from "motion/react";

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
        <div className="w-24 h-24 bg-gradient-to-br from-[#D4A540]/20 to-[#048B9A]/20 rounded-full flex items-center justify-center border-2 border-[#D4A540]/40">
          {/* Subtle earthy checkmark */}
          <svg 
            className="w-12 h-12" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
              d="M5 13l4 4L19 7"
              stroke="#D4A540"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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