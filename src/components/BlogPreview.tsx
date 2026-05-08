import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

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

export function BlogPreview() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p: any[] = [];
      snapshot.forEach(doc => p.push({ id: doc.id, ...doc.data() }));
      p.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setPosts(p.slice(0, 4));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="px-6 md:px-12 lg:px-24 py-32 bg-transparent relative overflow-hidden">
      <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <FadeInText className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-white">Nosso Mural de Dicas</FadeInText>
            <FadeInText delay={0.2} className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
               Ideias claras e diretas para você aplicar hoje no seu negócio, <br className="hidden md:block" /><HighlightText delay={0.4}>sem aquele "tecniquês"</HighlightText> que só confunde.
            </FadeInText>
          </div>
          <Link to="/blog">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-blue-400 font-medium hover:text-blue-300 transition-colors flex items-center gap-2 group border border-blue-900/40 bg-blue-950/20 px-6 py-3 rounded-full hover:bg-blue-900/30"
            >
              Ver todas as dicas
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </motion.div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.length === 0 && (
             <div className="col-span-full text-gray-400 font-light text-center py-10 bg-white/5 rounded-3xl border border-white/10">
                Ainda não há dicas publicadas.
             </div>
          )}
          {posts.map((post, i) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.4)", backgroundColor: "rgba(255,255,255,0.08)" }}
                transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
                className="bg-zinc-900/30 backdrop-blur-md rounded-[2.5rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/5 transition-all duration-300 cursor-pointer h-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-colors duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-4 py-1.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500 font-medium tracking-wide">{post.time}</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl leading-tight mb-6 font-semibold text-gray-100 group-hover:text-white transition-colors duration-300 drop-shadow-sm">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light mb-10 group-hover:text-gray-300 transition-colors duration-300 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="inline-flex items-center gap-3 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors uppercase tracking-widest mt-auto">
                    Ler artigo
                    <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
