"use client" 

import * as React from "react"
import { motion } from "motion/react";
 
interface ShiningTextProps {
  text: string;
  className?: string;
}

export function ShiningText({ text, className = "" }: ShiningTextProps) {
  return (
    <motion.div
      className={`bg-[linear-gradient(110deg,#ffffff,35%,#cbd5e1,50%,#ffffff,75%,#ffffff)] bg-[length:200%_100%] bg-clip-text text-transparent inline-block ${className}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.div>
  );
}
