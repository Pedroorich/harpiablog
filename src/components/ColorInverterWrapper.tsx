import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function ColorInverterWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 40%"]
  });

  const backgroundColor = useTransform(scrollYProgress, [0, 1], ["#ffffff", "#050505"]);

  return (
    <motion.div ref={ref} style={{ backgroundColor }} className="w-full flex flex-col transition-colors duration-200">
      {children}
    </motion.div>
  );
}
