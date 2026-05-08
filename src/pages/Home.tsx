import React, { useState, useEffect } from 'react';
import { PrismaHero } from '../components/ui/prisma-hero';
import { Purpose } from '../components/Purpose';
import { BlogPreview } from '../components/BlogPreview';
import { VaultPreview } from '../components/VaultPreview';
import { Footer } from '../components/Footer';
import { VideoScroll } from '../components/VideoScroll';
import { AnimatePresence, motion } from 'motion/react';
import { ColorInverterWrapper } from '../components/ColorInverterWrapper';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-blue-100 selection:text-blue-900">
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6"
          >
            <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin mb-8" />
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gray-500 text-lg font-light tracking-wide text-center"
            >
              Preparando uma experiência incrível...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <VideoScroll />
          <div className="relative z-10 w-full flex flex-col bg-white">
            <PrismaHero />
          </div>
          <ColorInverterWrapper>
            <div className="dark flex flex-col w-full text-white">
              <Purpose />
              <BlogPreview />
              <VaultPreview />
              <Footer />
            </div>
          </ColorInverterWrapper>
        </>
      )}
    </div>
  );
}
