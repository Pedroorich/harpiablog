import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Tag, Lock } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Footer } from '../components/Footer';
import Markdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/LoginModal';

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setPost(null);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `posts/${id}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-16 h-16 rounded-full border-4 border-gray-800 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-semibold mb-6">Artigo não encontrado</h1>
        <p className="text-gray-400 mb-8">O artigo que você está procurando não existe ou foi removido.</p>
        <Link to="/blog" className="text-blue-400 hover:text-blue-300 transition-colors bg-white/5 px-6 py-3 rounded-full hover:bg-white/10">
          Voltar para o Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-900 selection:text-white relative">
      <nav className="fixed top-0 inset-x-0 z-50 py-6 px-6 md:px-12 backdrop-blur-xl bg-black/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/blog" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-medium">
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <Link to="/" className="font-serif italic font-medium text-xl text-white">Ph.</Link>
        </div>
      </nav>

      <main className="pt-32 md:pt-40 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12 md:mb-16">
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-4 py-1.5 rounded-full uppercase tracking-widest text-xs">
                <Tag size={14} />
                {post.category}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {post.time}
              </span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight mb-8"
            >
              {post.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
               className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed"
            >
              {post.excerpt}
            </motion.p>
          </header>

          {post.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="w-full aspect-video rounded-3xl overflow-hidden mb-16 border border-white/10 shadow-2xl"
            >
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {!user ? (
            <div className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-10 md:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/80 to-black pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                  <Lock className="text-blue-400" size={32} />
                </div>
                <h2 className="text-3xl font-semibold text-white mb-4">Conteúdo Exclusivo</h2>
                <p className="text-gray-400 font-light mb-8 max-w-md">
                  Para ler a versão completa deste artigo, faça login com sua conta. É rápido, gratuito e você terá acesso a todo nosso conhecimento.
                </p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full px-8 py-4 transition-colors"
                >
                  Fazer Login para Ler
                </button>
              </div>
            </div>
          ) : (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="prose prose-invert prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-img:rounded-2xl prose-blue font-light text-gray-300 leading-relaxed"
            >
              <Markdown>{post.content}</Markdown>
            </motion.article>
          )}
        </div>
      </main>
      
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      
      <Footer />
    </div>
  );
}
