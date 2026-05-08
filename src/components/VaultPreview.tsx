import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FileText, Download, PlayCircle, BookOpen } from 'lucide-react';

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

export function VaultPreview() {
  const { scrollYProgress } = useScroll();
  const rotateTransform = useTransform(scrollYProgress, [0, 1], [0, 45]);

  // Para adicionar itens depois, basta colocar os objetos aqui dentro, por exemplo:
  // { name: 'Guia de Presença Digital', type: 'PDF', icon: BookOpen }
  const resources: { name: string, type: string, icon: any }[] = [
    // { name: 'Guia de Presença Digital', type: 'PDF', icon: BookOpen },
    // { name: 'Modelos de Mensagens (E-mail e WhatsApp)', type: 'DOC', icon: FileText },
    // { name: 'Planilha de Organização Semanal', type: 'XLS', icon: Download },
    // { name: 'Tutorial em Vídeo: Primeiros Passos', type: 'MP4', icon: PlayCircle }
  ];

  if (resources.length === 0) {
    return null;
  }

  return (
    <section className="px-6 md:px-12 lg:px-24 py-32 bg-transparent relative overflow-hidden">
      {/* Decorative background element */}
      <motion.div 
        style={{ rotate: rotateTransform }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-full blur-[120px] opacity-50 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div>
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 text-xs uppercase tracking-[0.2em] font-semibold mb-8">
               Acesso Liberado 
            </span>
            <FadeInText className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-8 text-white leading-tight">
              Materiais pensados para ajudar <HighlightText delay={0.4}>você a crescer.</HighlightText>
            </FadeInText>
            <FadeInText delay={0.2} className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 font-light">
              Separamos nossos melhores conteúdos educativos, modelos e ferramentas em um só lugar. Tudo criado com muito carinho para facilitar o seu dia a dia e acelerar seus resultados.
            </FadeInText>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600/90 hover:bg-blue-500 text-white rounded-full px-10 py-5 text-lg font-medium transition-all duration-300 shadow-lg shadow-blue-900/50 hover:shadow-blue-900 flex items-center gap-3"
            >
              Acessar Biblioteca Gratuita
              <span>→</span>
            </motion.button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="mb-8 flex justify-between items-center pb-6 border-b border-white/10">
              <h3 className="font-semibold text-xl text-white tracking-wide">Destaques da Biblioteca</h3>
              <span className="text-xs font-semibold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-400 px-3 py-1.5 rounded-full">4 itens</span>
            </div>
            
            <ul className="space-y-4">
              {resources.map((res, i) => {
                const Icon = res.icon;
                return (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.15), type: "spring", bounce: 0.4 }}
                    className="flex justify-between items-center p-5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-blue-950/40 border border-blue-900/30 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-900/50 transition-all duration-300">
                        <Icon size={20} className="group-hover:text-blue-300 transition-colors" />
                      </div>
                      <div>
                        <span className="block text-gray-200 font-medium text-lg group-hover:text-white transition-colors">{res.name}</span>
                        <span className="block text-xs uppercase tracking-wider text-gray-500 mt-1">{res.type}</span>
                      </div>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      className="text-gray-600 group-hover:text-blue-400 bg-white/5 p-3 rounded-full group-hover:bg-blue-900/20 transition-colors duration-300"
                    >
                      <Download size={20} />
                    </motion.div>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
