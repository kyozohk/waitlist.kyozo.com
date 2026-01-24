import { motion } from "motion/react";

interface AgreementScaleProps {
  value: string;
  onChange: (value: string) => void;
  questionId: string;
}

const AGREEMENT_OPTIONS = [
  { value: "strongly-disagree", label: "Strongly Disagree" },
  { value: "disagree", label: "Disagree" },
  { value: "not-sure", label: "Not Sure" },
  { value: "agree", label: "Agree" },
  { value: "strongly-agree", label: "Strongly Agree" },
];

export function AgreementScale({ value, onChange, questionId }: AgreementScaleProps) {
  return (
    <div className="flex gap-2">
      {AGREEMENT_OPTIONS.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex-1 px-3 py-2 rounded-lg border-2 transition-all
              flex items-center justify-center cursor-pointer
              ${
                isSelected
                  ? "border-[var(--kyozo-primary)] bg-[var(--kyozo-primary)]/10 shadow-md"
                  : "border-border hover:border-[var(--kyozo-primary)]/50 hover:bg-muted/50"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={`text-xs text-center leading-tight ${isSelected ? "font-medium" : ""}`}>
              {option.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}