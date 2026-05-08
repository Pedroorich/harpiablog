import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Edit2, Trash2, Plus } from 'lucide-react';

export function Admin() {
  const { user, isAdmin, isLoading, signIn, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'posts' | 'tools'>('posts');

  const [posts, setPosts] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campos compartilhados
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  
  // Campos de Posts
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState('');

  // Campos de Tools
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [copyText, setCopyText] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    
    const unsubscribePosts = onSnapshot(query(collection(db, 'posts')), (snapshot) => {
      const p: any[] = [];
      snapshot.forEach(doc => p.push({ id: doc.id, ...doc.data() }));
      p.sort((a,b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setPosts(p);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'posts'));

    const unsubscribeTools = onSnapshot(query(collection(db, 'tools')), (snapshot) => {
      const t: any[] = [];
      snapshot.forEach(doc => t.push({ id: doc.id, ...doc.data() }));
      t.sort((a,b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setTools(t);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'tools'));

    return () => {
      unsubscribePosts();
      unsubscribeTools();
    };
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setIsSubmitting(true);
    setMessage('');

    try {
      if (activeTab === 'posts') {
        if (editingId) {
          await updateDoc(doc(db, 'posts', editingId), { title, excerpt, content, category, time, image, updatedAt: serverTimestamp() });
          setMessage('Artigo atualizado com sucesso!');
        } else {
          await setDoc(doc(collection(db, 'posts')), { title, excerpt, content, category, time, image, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
          setMessage('Artigo publicado com sucesso!');
        }
      } else {
        if (editingId) {
          await updateDoc(doc(db, 'tools', editingId), { title, description, url, copyText, category, updatedAt: serverTimestamp() });
          setMessage('Ferramenta atualizada com sucesso!');
        } else {
          await setDoc(doc(collection(db, 'tools')), { title, description, url, copyText, category, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
          setMessage('Ferramenta publicada com sucesso!');
        }
      }
      resetForm();
    } catch (e) {
      handleFirestoreError(e, editingId ? OperationType.UPDATE : OperationType.CREATE, activeTab);
      setMessage(`Erro ao salvar ${activeTab === 'posts' ? 'artigo' : 'ferramenta'}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: any, type: 'posts' | 'tools') => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category || '');
    if (type === 'posts') {
      setExcerpt(item.excerpt || '');
      setContent(item.content || '');
      setTime(item.time || '');
      setImage(item.image || '');
    } else {
      setDescription(item.description || '');
      setUrl(item.url || '');
      setCopyText(item.copyText || '');
    }
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, type: 'posts' | 'tools') => {
    if (!isAdmin) return;
    if (window.confirm(`Tem certeza que deseja excluir est${type === 'posts' ? 'e artigo' : 'a ferramenta'}?`)) {
      try {
        await deleteDoc(doc(db, type, id));
        setMessage(`${type === 'posts' ? 'Artigo' : 'Ferramenta'} excluída com sucesso!`);
        if (editingId === id) resetForm();
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `${type}/${id}`);
        setMessage('Erro ao excluir.');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('');
    setExcerpt('');
    setContent('');
    setTime('');
    setImage('');
    setDescription('');
    setUrl('');
    setCopyText('');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
        <div className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center max-w-md w-full">
          <h1 className="text-3xl font-semibold mb-6 tracking-tight">Acesso Restrito</h1>
          {!user ? (
            <button onClick={signIn} className="w-full bg-white text-black font-semibold rounded-full py-4 text-sm transition-transform hover:scale-105">
              Entrar com Google
            </button>
          ) : (
            <>
              <p className="text-gray-400 mb-8 font-light">Sua conta ({user.email}) não possui privilégios de administrador.</p>
              <button onClick={signOut} className="w-full border border-white/20 text-white font-semibold rounded-full py-4 text-sm transition-colors hover:bg-white/10">Sair</button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-semibold tracking-tight">Painel Admin</h1>
          <button onClick={signOut} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Sair ({user.email})
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => { setActiveTab('posts'); resetForm(); }}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'posts' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            Artigos
          </button>
          <button 
            onClick={() => { setActiveTab('tools'); resetForm(); }}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'tools' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            Ferramentas
          </button>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-xl text-sm font-medium ${message.includes('sucesso') ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50' : 'bg-red-950/40 text-red-400 border border-red-900/50'}`}>
            {message}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{editingId ? `Editar ${activeTab === 'posts' ? 'Artigo' : 'Ferramenta'}` : `Nov${activeTab === 'posts' ? 'o Artigo' : 'a Ferramenta'}`}</h2>
            {editingId && (
              <button onClick={resetForm} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <Plus size={16} /> Nova
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Título</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Categoria</label>
                <input required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              </div>

              {activeTab === 'posts' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Resumo (Excerpt)</label>
                    <input required value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Tempo de Leitura</label>
                    <input required value={time} onChange={e => setTime(e.target.value)} placeholder="Ex: 5 min de leitura" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">URL da Imagem</label>
                    <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Conteúdo (Markdown opcional)</label>
                    <textarea required value={content} onChange={e => setContent(e.target.value)} rows={10} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Descrição</label>
                    <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">URL da Ferramenta (Opcional)</label>
                    <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Texto para Copiar (Opcional)</label>
                    <input value={copyText} onChange={e => setCopyText(e.target.value)} placeholder="npm install ..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </>
              )}
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Publicar'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <h2 className="text-2xl font-semibold mb-6">Histórico de {activeTab === 'posts' ? 'Artigos' : 'Ferramentas'}</h2>
          {(activeTab === 'posts' ? posts : tools).length === 0 ? (
            <p className="text-gray-400">Nenhum registro encontrado.</p>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'posts' ? posts : tools).map(item => (
                <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-semibold text-lg text-gray-200">{item.title}</h3>
                    <div className="flex gap-4 text-xs text-gray-500 mt-2">
                      <span className="uppercase tracking-widest">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleEdit(item, activeTab)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-full transition-colors focus:outline-none"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id, activeTab)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full transition-colors focus:outline-none"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
