import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { DEFAULT_BLOG_IMAGE } from '../constants';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  category: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  created_at: string;
  readTime?: string;
}

interface BlogProps {
  onBack: () => void;
  onPostClick: (post: BlogPost) => void; // <-- nova prop
}

const Blog: React.FC<BlogProps> = ({ onBack, onPostClick }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Buscando posts do Supabase...');
      
      const { data, error } = await supabase
        .from('admin_blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📦 Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ Erro na consulta:', error);
        throw error;
      }

      console.log('✅ Posts carregados:', data?.length);
      setPosts(data || []);
    } catch (err: any) {
      console.error('❌ Erro ao carregar posts:', err);
      setError(err.message || 'Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9A0000]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadPosts}
              className="bg-[#9A0000] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#7a0000] transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf8] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#9A0000] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#9A0000]">
            Blog Sonho da Festa
          </h1>
          <p className="text-gray-500 mt-2">
            Dicas, tendências e novidades do mundo da confeitaria e festas.
          </p>
        </div>

        {/* Lista de posts */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum post publicado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(154,0,0,0.1)] transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => onPostClick(post)} // <-- agora navega
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.image_url || DEFAULT_BLOG_IMAGE}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      console.error('Erro na imagem:', post.image_url);
                      e.currentTarget.src = DEFAULT_BLOG_IMAGE;
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#9A0000] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(post.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {post.author}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#9A0000] transition-colors">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-4">
                    <span className="text-[#9A0000] font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ler mais
                      <span className="text-lg">→</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;