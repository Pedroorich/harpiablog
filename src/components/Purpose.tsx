import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const FadeInText = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.p
    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.p>
);

const HighlightText = ({ children, delay = 0.2 }: { children: React.ReactNode, delay?: number }) => (
  <motion.span
    initial={{ color: "rgba(156, 163, 175, 1)", backgroundSize: "0% 100%" }}
    whileInView={{ color: "rgba(255, 255, 255, 1)", backgroundSize: "100% 100%" }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
    className="bg-[linear-gradient(120deg,rgba(59,130,246,0.15)_0%,rgba(147,51,234,0.15)_100%)] bg-no-repeat bg-left-bottom font-medium rounded-sm inline"
  >
    {children}
  </motion.span>
);

export function Purpose() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const blurY1 = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const blurY2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <section ref={containerRef} className="px-6 md:px-12 lg:px-24 py-24 md:py-32 border-y border-white/5 transition-colors duration-300 relative overflow-hidden" id="meu-proposito">
      
      {/* Decorative Blur */}
      <motion.div style={{ y: blurY1 }} className="absolute top-1/4 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-900/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <motion.div style={{ y: blurY2 }} className="absolute bottom-1/4 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-zinc-800/30 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col gap-20 md:gap-32 relative z-10">
        
        <div className="space-y-6">
          <FadeInText className="text-2xl md:text-5xl font-serif italic text-white/80 leading-tight">
            A internet está cheia de gente ensinando a ganhar dinheiro… <br className="hidden md:block"/>
            <span className="font-sans not-italic font-bold text-white tracking-tight mt-2 block">mas <HighlightText delay={0.4}>quase ninguém</HighlightText> realmente ganha.</span>
          </FadeInText>
          
          <FadeInText delay={0.2} className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl mt-8">
            Você vê números. Vê promessas. Vê estilos de vida. <br className="hidden md:block"/>
            <span className="text-gray-300 font-medium">Mas <HighlightText delay={0.5}>não vê o processo real.</HighlightText></span>
          </FadeInText>
        </div>

        <div className="space-y-8 md:ml-12 border-l-2 border-white/10 pl-6 md:pl-10">
          <FadeInText className="text-2xl md:text-4xl text-gray-100 font-medium tracking-tight">
            Eu vi isso de perto.
          </FadeInText>
          <FadeInText delay={0.1} className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed">
            Passei anos consumindo conteúdo achando que estava avançando, quando na verdade só estava sendo mais um na multidão que <span className="text-white font-medium">“sabe muito”… e não faz nada.</span>
          </FadeInText>
          <FadeInText delay={0.2} className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed pt-4">
            Foram 4 anos em silêncio, estudando o jogo por trás. <br/>
            Não o que falam — mas o que <HighlightText delay={0.4}>realmente funciona.</HighlightText>
          </FadeInText>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10 bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-16 backdrop-blur-sm shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <FadeInText className="text-xl md:text-3xl text-gray-300 font-light relative z-10 text-center md:text-left">
            E quando eu entrei de verdade, eu não tinha:
          </FadeInText>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 relative z-10">
            {['audiência', 'dinheiro', 'estrutura'].map((item, i) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 30, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(30,30,30,0.8)", borderColor: "rgba(255,255,255,0.15)" }}
                transition={{ duration: 0.7, delay: i * 0.15 + 0.3, type: "spring", bounce: 0.4 }}
                className="bg-black/60 border border-white/5 rounded-2xl py-6 md:py-8 flex items-center justify-center transform-gpu cursor-default transition-colors duration-300"
              >
                <span className="text-red-400/80 font-mono text-sm md:text-lg line-through uppercase tracking-[0.2em]">{item}</span>
              </motion.div>
            ))}
          </div>

          <div className="pt-8 relative z-10">
            <FadeInText delay={0.8} className="text-4xl md:text-6xl font-serif italic text-white text-center">
              Só uma coisa: <span className="font-sans not-italic font-bold tracking-tight text-white block mt-4 sm:inline sm:mt-0"><HighlightText delay={1.2}>clareza.</HighlightText></span>
            </FadeInText>
            <FadeInText delay={1.0} className="text-center text-gray-400 uppercase tracking-[0.3em] text-xs md:text-sm mt-6 font-medium">
              E clareza muda tudo.
            </FadeInText>
          </div>
        </motion.div>

        <div className="space-y-8 md:text-right md:ml-auto max-w-3xl mt-8">
          <FadeInText className="text-2xl md:text-3xl text-gray-200 font-light leading-relaxed">
            Eu aprendi a fazer dinheiro do absoluto zero. A transformar ideia em execução. <br/> <HighlightText delay={0.3}>E execução em resultado.</HighlightText>
          </FadeInText>
          <FadeInText delay={0.1} className="text-lg md:text-xl text-gray-500 font-light leading-relaxed mt-4">
            Sem depender de tráfego pago. Sem precisar de validação externa.
          </FadeInText>
          
          <div className="pt-16 grid gap-8">
            <FadeInText delay={0.2} className="text-4xl md:text-5xl text-white font-semibold tracking-tight">Hoje:</FadeInText>
            <ul className="space-y-8 inline-flex flex-col md:items-end">
              {[
                'já gerei +30 milhões de visualizações orgânicas',
                'construí ofertas que passaram de 6 dígitos',
                'escalei tudo com estratégia, não sorte'
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -30, filter: "blur(5px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ scale: 1.02, originX: 1, color: "rgba(255,255,255,1)" }}
                  transition={{ duration: 0.8, delay: 0.3 + (i * 0.15), ease: "easeOut" }}
                  className="flex items-center gap-4 text-emerald-400 md:justify-end cursor-default group"
                >
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 md:hidden group-hover:scale-150 transition-transform" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-xl md:text-3xl font-light">{item}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 hidden md:block group-hover:scale-150 transition-transform" />
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)", borderColor: "rgba(59, 130, 246, 0.5)" }}
          className="bg-gradient-to-b from-blue-950/40 to-black border border-blue-900/30 rounded-[2rem] p-8 md:p-16 relative overflow-hidden mt-12 shadow-2xl transition-all duration-500"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 blur-[2px]">
            <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="relative z-10 space-y-8 max-w-2xl">
            <FadeInText className="text-xl md:text-3xl text-blue-200 font-light leading-relaxed">
              Mas o jogo evolui. <br/> E quem fica preso no básico… fica para trás.
            </FadeInText>
            <FadeInText delay={0.2} className="text-2xl md:text-5xl text-white font-medium tracking-tight leading-snug">
              Agora eu estou em um novo nível: criando sistemas e aplicativos com <span className="font-serif italic text-blue-400 block mt-2 text-3xl md:text-6xl"><HighlightText delay={0.6}>Inteligência Artificial</HighlightText></span>.
            </FadeInText>
            <FadeInText delay={0.4} className="text-lg md:text-2xl text-blue-100/60 font-light leading-relaxed pt-4">
              Onde dinheiro deixa de depender de esforço direto e passa a depender de estrutura.
            </FadeInText>
          </div>
        </motion.div>

        <div className="space-y-10 flex flex-col items-center text-center max-w-4xl mx-auto pt-28">
          <FadeInText className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed">
            Esse site não é sobre motivação. Não é sobre teoria. <br className="hidden md:block"/> E <span className="text-gray-200">definitivamente</span> não é para todo mundo.
          </FadeInText>
          <FadeInText delay={0.2} className="text-3xl md:text-5xl text-white font-bold tracking-tight">
            É para quem quer <HighlightText delay={0.5}>entender o jogo de verdade.</HighlightText>
          </FadeInText>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-6 py-12">
             {['Sem atalhos', 'Sem ilusões', 'Sem depender de ninguém'].map((badge, i) => (
                <motion.div 
                  key={badge}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -5, backgroundColor: "rgba(39, 39, 42, 0.8)", borderColor: "rgba(255,255,255,0.2)" }}
                  transition={{ delay: 0.4 + (i * 0.15), type: "spring", bounce: 0.5 }}
                  className="px-6 md:px-8 py-3 lg:py-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-xs md:text-sm lg:text-base uppercase tracking-[0.2em] font-medium transition-colors duration-300 cursor-default"
                >
                  {badge}
                </motion.div>
             ))}
          </div>

          <FadeInText delay={0.6} className="text-lg md:text-2xl text-gray-600 font-serif italic pb-8">
            Se você quer conteúdo confortável… você está no lugar errado.
          </FadeInText>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent my-10 origin-center"
          />

          <FadeInText delay={1.0} className="text-3xl md:text-6xl text-white font-serif font-light tracking-tight leading-tight pt-8">
            Mas se você quer aprender a construir do zero, <br/>
            <span className="font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 block mt-6 drop-shadow-lg scale-105 transform">então agora faz sentido você estar aqui.</span>
          </FadeInText>
        </div>

      </div>
    </section>
  );
}
