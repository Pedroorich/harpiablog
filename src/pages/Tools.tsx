import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, ExternalLink, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

const HighlightText = ({ children, delay = 0.2 }: { children: React.ReactNode, delay?: number }) => (
  <motion.span
    initial={{ color: "rgba(156, 163, 175, 1)", backgroundSize: "0% 100%" }}
    animate={{ color: "rgba(255, 255, 255, 1)", backgroundSize: "100% 100%" }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
    className="bg-[linear-gradient(120deg,rgba(59,130,246,0.15)_0%,rgba(147,51,234,0.15)_100%)] bg-no-repeat bg-left-bottom font-medium rounded-sm inline"
  >
    {children}
  </motion.span>
);

export function Tools() {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'tools'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const t: any[] = [];
      snapshot.forEach(doc => {
        t.push({ id: doc.id, ...doc.data() });
      });
      t.sort((a,b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setTools(t);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tools');
    });

    return () => unsubscribe();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Poderíamos adicionar um toast/alerta aqui
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-900 selection:text-white">
      <nav className="fixed top-0 inset-x-0 z-50 py-6 px-6 md:px-12 backdrop-blur-xl bg-black/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-medium">
            <ArrowLeft size={18} />
            Voltar para o início
          </Link>
          <div className="font-serif italic font-medium text-xl">Ph.</div>
        </div>
      </nav>

      <main className="pt-32 md:pt-40 pb-20 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <header className="mb-20 md:mb-24 text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-semibold mb-8 tracking-tight"
            >
              Minhas <HighlightText delay={0.4}>Ferramentas</HighlightText>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed"
            >
              As ferramentas que utilizo no meu dia a dia, scripts úteis e recursos essenciais para escalar negócios.
            </motion.p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {tools.length === 0 && (
               <div className="col-span-full py-20 text-center text-gray-500 font-light text-lg">
                 Nenhuma ferramenta adicionada ainda.
               </div>
            )}
            {tools.map((tool, i) => (
              <motion.article
                key={tool.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -8 }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }}
                className="flex flex-col h-full bg-white/5 border border-white/10 rounded-[2rem] p-6 lg:p-8 hover:border-white/20 transition-all group"
              >
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-4 py-1.5 rounded-full">
                      {tool.category || 'Geral'}
                    </span>
                    <div className="flex gap-2">
                      {tool.copyText && (
                        <button 
                          onClick={(e) => { e.preventDefault(); handleCopy(tool.copyText); }}
                          className="p-2 bg-black/40 hover:bg-black/80 rounded-full text-gray-400 hover:text-white transition-colors"
                          title="Copiar snippet/código"
                        >
                          <Copy size={16} />
                        </button>
                      )}
                      {tool.url && (
                        <a 
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-900/20 hover:bg-blue-600/50 rounded-full text-blue-400 hover:text-white transition-colors"
                          title="Acessar"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 text-gray-100 group-hover:text-white transition-colors duration-300 leading-tight">
                    {tool.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed font-light mb-6 flex-grow whitespace-pre-wrap">
                    {tool.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
