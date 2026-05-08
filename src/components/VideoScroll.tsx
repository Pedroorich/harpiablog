import React, { useRef, useEffect, useState } from 'react';
import { useScroll, motion, useTransform } from 'motion/react';

export function VideoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (videoRef.current && !isNaN(videoRef.current.duration)) {
        setVideoDuration(videoRef.current.duration);
      }
    };

    if (videoRef.current) {
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        videoRef.current.addEventListener('canplay', handleLoadedMetadata);
        if (videoRef.current.readyState >= 1) handleLoadedMetadata();
        
        // Força o carregamento para dispositivos móveis
        videoRef.current.load();
        
        // Hack para iOS: tentar dar play e depois pause para desbloquear o controle de frame (currentTime)
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            if (videoRef.current) videoRef.current.pause();
          }).catch(() => {
            // Autoplay bloqueado pelo navegador, ignorar
          });
        }
    }
    
    return () => {
        if (videoRef.current) {
            videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current.removeEventListener('canplay', handleLoadedMetadata);
        }
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    // Armazena o tempo que está sendo suavizado ("lerpado") progressivamente
    let currentScrubTime = 0;

    const renderLoop = () => {
      if (videoRef.current && videoDuration > 0) {
        // Alvo direto, sem lag
        const targetTime = scrollYProgress.get() * videoDuration;
        
        // Lerp entre o tempo suave atual e o alvo. Isso deixa a transição 
        // 100% fluida mesmo se a rolagem (scroll wheel) for em degraus/saltinhos
        currentScrubTime += (targetTime - currentScrubTime) * 0.12;
        
        // A GRANDE SACADA: 
        // Atualiza o tempo do vídeo (isso exige processamento da CPU/Decoder).
        // Se o vídeo ainda estiver "buscando" (seeking) o último frame que pedimos, nós pulamos.
        // Isso impede que a fila de renderização trave quando rolamos muito rápido, 
        // fazendo a animação "skipar" frames perfeitamente sincronizada em vez de engasgar e atrasar.
        if (!videoRef.current.seeking) {
           const dist = Math.abs(videoRef.current.currentTime - currentScrubTime);
           // Atualiza apenas se houve uma diferença mínima para poupar processamento
           if (dist > 0.01) {
             videoRef.current.currentTime = currentScrubTime;
           }
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollYProgress, videoDuration]);
  
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -30]);

  return (
    <div ref={containerRef} className="h-[250vh] w-full relative bg-gray-900">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        <motion.div 
          className="relative w-full h-full overflow-hidden shadow-2xl origin-center will-change-transform"
        >
          <video
            ref={videoRef}
            src="https://cdn.leonardo.ai/users/51fd7d85-1781-4d27-8f01-07f39a5ba4c8/generations/1f147e1e-cef1-6060-9998-d7c8660434e4/seedance-2.0_cinematic_hyper-realistic_dramatic_transformation_smooth_motion_high_detail_cont-0.mp4"
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </motion.div>

        <motion.div 
          style={{ opacity: textOpacity, y: textY }} 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-xl z-20"
        >
           <h1 className="text-center px-4 flex flex-col items-center relative w-full mb-4">
             {/* Texto 'Seja' posicionado absolutamente para flutuar acima do centro, com fonte serifada e itálico */}
             <span className="absolute -top-12 sm:-top-16 md:-top-20 lg:-top-24 z-10 text-white/90 text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-serif italic tracking-normal font-normal drop-shadow-sm">
               Seja
             </span>
             {/* BEM VINDO enorme, bem espaçado, com um leve degrade para o fundo, misturando com o video */}
             <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white/80 to-white/20 text-[3rem] sm:text-7xl md:text-8xl lg:text-[11.5rem] font-sans font-light tracking-[0.15em] lg:tracking-[0.2em] uppercase leading-none drop-shadow-sm mt-8 sm:mt-10 md:mt-12 ml-4 lg:ml-10">
               Bem vindo
             </span>
           </h1>
           {/* Recipiente do subtítulo em formato de pílula (pill) desfocada para dar um ar premium */}
           <div className="mt-12 md:mt-16 bg-black/20 backdrop-blur-md py-3 px-6 md:px-10 rounded-full border border-white/5">
             <p className="text-white/70 font-sans tracking-[0.2em] md:tracking-[0.3em] uppercase text-[0.6rem] md:text-xs font-medium text-center">
               Deslize para adquirir meus conhecimentos e projetos
             </p>
           </div>
           
           <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-white/40 to-transparent mt-8 md:mt-12"></div>
        </motion.div>
      </div>
    </div>
  );
}
