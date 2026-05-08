import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
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

export function Blog() {
  const categories = ['Todos', 'Inovação', 'Estratégia', 'Inteligência Artificial', 'Negócios'];
  
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p: any[] = [];
      snapshot.forEach(doc => {
        p.push({ id: doc.id, ...doc.data() });
      });
      // Sort in memory to fallback for posts without createdAt
      p.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setPosts(p);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-900 selection:text-white">
      {/* Navbar minimalista */}
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
        {/* Background Gradients */}
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
              Mural de <HighlightText delay={0.4}>Dicas</HighlightText>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed"
            >
              Artigos, guias e pensamentos sobre tecnologia, negócios e o que realmente faz a diferença na internet hoje.
            </motion.p>
          </header>

          {/* Filtros e Busca */}
          <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-900/30 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide mask-edges">
              {categories.map((cat, i) => (
                <button 
                  key={cat}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${i === 0 ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-900/30' : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent hover:border-white/10'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-auto shrink-0 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" size={18} />
              <input 
                type="text" 
                placeholder="Buscar artigos..." 
                className="w-full md:w-64 bg-black/40 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all duration-300 shadow-inner"
              />
            </div>
          </div>

          {/* Grid de Artigos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {posts.length === 0 && (
               <div className="col-span-full py-20 text-center text-gray-500 font-light text-lg">
                 Nenhum artigo publicado ainda.
               </div>
            )}
            {posts.map((post, i) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="block group">
              <motion.article
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -8 }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }}
                className="flex flex-col h-full cursor-pointer"
              >
                {post.image && (
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-2xl">
                    <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-black/60 backdrop-blur-md border border-emerald-900/50 px-4 py-1.5 rounded-full shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>
                )}
                {!post.image && (
                  <div className="mb-4">
                     <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-4 py-1.5 rounded-full">
                        {post.category}
                      </span>
                  </div>
                )}

                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4 text-sm text-gray-500 font-medium">
                    <span>{post.time}</span>
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 text-gray-100 group-hover:text-white transition-colors duration-300 leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed font-light mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors uppercase tracking-widest mt-auto">
                    Ler artigo
                    <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">→</span>
                  </div>
                </div>
              </motion.article>
              </Link>
            ))}
          </div>

          {/* Load More */}
          {posts.length > 0 && (
            <div className="mt-24 text-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border border-white/20 hover:border-blue-500/50 hover:bg-blue-900/10 text-white rounded-full px-10 py-4 text-sm font-semibold tracking-wider uppercase transition-all duration-300"
              >
                Carregar mais artigos
              </motion.button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
