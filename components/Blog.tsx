
import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Search, Clock, User, Calendar, Tag, ChevronRight, Share2, Twitter, MessageCircle, Copy } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import { BlogPost } from '../types';
import Modal from './Modal';

interface BlogProps {
  onBack: () => void;
  posts?: BlogPost[]; // Tornando opcional e usando os do constants se não passado (fallback)
}

const CATEGORIES = ['Todos', 'Curiosidades', 'Dicas', 'Culinária', 'Confeitaria'];

const Blog: React.FC<BlogProps> = ({ onBack, posts = BLOG_POSTS }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modal, setModal] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'warning' | 'confirm'; message: string } | null>(null);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'Todos' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShare = (platform: string, post: BlogPost) => {
    const url = window.location.href; // Em produção, seria a URL específica do post
    const text = `Confira este artigo incrível da Sonho da Festa: ${post.title}`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        setModal({ isOpen: true, type: 'success', message: 'Link copiado para a área de transferência!' });
        break;
    }
  };

  if (selectedPost) {
    return (
      <div className="animate-in fade-in slide-in-from-right-8 duration-500 min-h-screen bg-[#fcfaf8] pb-20 font-quicksand">
         {/* Navbar simulada para o artigo */}
         <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <ArrowLeft size={24} />
              </button>
              <span className="font-bold text-[#9A0000] hidden sm:inline">Voltar para o Blog</span>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => handleShare('whatsapp', selectedPost)} className="p-2 text-green-600 hover:bg-green-50 rounded-full"><MessageCircle size={20} /></button>
               <button onClick={() => handleShare('copy', selectedPost)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Share2 size={20} /></button>
            </div>
         </div>

         {/* Article Hero */}
         <div className="relative h-[400px] w-full">
           <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
           <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
             <div className="max-w-4xl mx-auto">
                <span className="bg-[#d20000] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                  {selectedPost.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                  {selectedPost.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#fff304]" />
                    <span>Por <strong>{selectedPost.author}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#fff304]" />
                    <span>{selectedPost.date}</span>
                  </div>
                   <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#fff304]" />
                    <span>{selectedPost.readTime} de leitura</span>
                  </div>
                </div>
             </div>
           </div>
         </div>

         {/* Article Content */}
         <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Text */}
            <div className="lg:col-span-8">
              <div 
                className="prose prose-lg prose-red text-gray-700 leading-relaxed max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content || `<p>${selectedPost.excerpt}</p><p>Conteúdo completo em breve...</p>` }}
              >
              </div>

              {/* Tags/Categories */}
              <div className="mt-12 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Tag size={18} /> Tags Relacionadas</h4>
                <div className="flex gap-2 flex-wrap">
                  {['Festas', 'Dicas', 'Empreendedorismo', selectedPost.category].map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Share */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                 <h3 className="font-bold text-[#9A0000] mb-4 text-lg">Compartilhe este artigo</h3>
                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => handleShare('whatsapp', selectedPost)}
                      className="flex items-center gap-3 w-full p-3 rounded-xl bg-[#25D366]/10 text-[#25D366] font-bold hover:bg-[#25D366] hover:text-white transition-all"
                    >
                      <MessageCircle size={20} /> WhatsApp
                    </button>
                    <button 
                      onClick={() => handleShare('facebook', selectedPost)}
                      className="flex items-center gap-3 w-full p-3 rounded-xl bg-[#1877F2]/10 text-[#1877F2] font-bold hover:bg-[#1877F2] hover:text-white transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg> Facebook
                    </button>
                    <button 
                      onClick={() => handleShare('twitter', selectedPost)}
                      className="flex items-center gap-3 w-full p-3 rounded-xl bg-black/5 text-black font-bold hover:bg-black hover:text-white transition-all"
                    >
                      <Twitter size={20} /> Twitter (X)
                    </button>
                    <button 
                      onClick={() => handleShare('copy', selectedPost)}
                      className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
                    >
                      <Copy size={20} /> Copiar Link
                    </button>
                 </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-[#fcfaf8] pb-20 font-quicksand">
      
      {/* Header */}
      <div className="bg-[#9A0000] text-white pt-8 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-red-200 hover:text-white transition-colors mb-6 group"
          >
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <ArrowLeft size={20} />
            </div>
            <span className="font-bold text-sm">Voltar ao Início</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
             <BookOpen className="text-[#fff304]" size={28} />
             <span className="text-[#fff304] font-bold tracking-widest uppercase text-xs">Blog Sonho da Festa</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Dicas, Receitas e Tendências</h1>
          <p className="text-red-100 max-w-2xl text-lg font-light">
            Conteúdo exclusivo preparado por nossos especialistas para alavancar o seu negócio de festas.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#9A0000] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar artigo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9A0000] bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <article 
                key={post.id}
                onClick={() => {
                  setSelectedPost(post);
                  window.scrollTo(0, 0);
                }}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(154,0,0,0.1)] transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-[#9A0000] shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#140002] mb-3 font-serif group-hover:text-[#9A0000] transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[#9A0000]">
                         <User size={12} />
                      </div>
                      {post.author}
                    </div>
                    
                    <span className="text-[#d20000] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ler mais <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
              <Search size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-500">Tente buscar por outro termo.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          isOpen={modal.isOpen}
          onClose={() => setModal(null)}
          type={modal.type}
          message={modal.message}
        />
      )}
    </div>
  );
};

export default Blog;
