import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Facebook, Linkedin, Link2, ChevronUp, Mail, Instagram } from 'lucide-react';
import { DEFAULT_BLOG_IMAGE } from '../constants';

// Ícone customizado para X (novo Twitter) - Logo oficial estilizado
const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L2.306 21.75H-0.424v-3.308l7.227-8.26L-0.424 2.25h6.657l5.214 6.817L21.578 2.25h3.308v3.308h-6.698zM17.3 19.928h1.828L6.633 4.156H4.702l12.598 15.772z" />
  </svg>
);

// Ícone customizado para WhatsApp com estilo melhorado
const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a6.963 6.963 0 00-6.993 6.99c0 1.539.402 3.04 1.165 4.357l-1.241 4.534 4.644-1.218c1.28.693 2.73 1.059 4.237 1.059h.004a6.975 6.975 0 006.982-6.99c0-1.862-.716-3.615-2.017-4.92a6.954 6.954 0 00-4.933-2.042M19.313 2.04H4.687C3.233 2.04 2.04 3.233 2.04 4.687v14.626c0 1.454 1.193 2.647 2.647 2.647h14.626c1.454 0 2.647-1.193 2.647-2.647V4.687c0-1.454-1.193-2.646-2.647-2.646" />
  </svg>
);

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

interface PostDetailsProps {
  post: BlogPost;
  onBack: () => void;
}

const PostDetails: React.FC<PostDetailsProps> = ({ post, onBack }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<{ id: string; title: string; level: number }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Gera tabela de conteúdo a partir dos headings
    const headings = Array.from(document.querySelectorAll('h2, h3')).map((heading, index) => ({
      id: `heading-${index}`,
      title: heading.textContent || '',
      level: parseInt(heading.tagName[1]),
    }));
    setTableOfContents(headings);
  }, [post.content]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Data inválida';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Confira este post: ${post.title}`;
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'instagram':
        // Instagram não tem deep link de compartilhamento direto, então copiamos o link
        navigator.clipboard.writeText(url);
        alert('Link copiado! Cole no Instagram Stories ou Direct Message.');
        return;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copiado!');
        return;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  return (
    <>
      {/* Barra de progresso de leitura fixa no topo */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#9A0000] to-red-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-[#fcfaf8] to-white pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho com navegação */}
          <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-[#9A0000] transition-all duration-300 group"
            >
              <div className="p-2.5 bg-white rounded-full shadow-md group-hover:shadow-lg group-hover:bg-[#9A0000]/5 transition-all">
                <ArrowLeft size={20} className="group-hover:text-[#9A0000] transition-colors" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Voltar ao blog</span>
            </button>

            {/* Botões de compartilhamento com labels */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:block">
                Compartilhar:
              </span>
              <div className="flex gap-2">
                {[
                  { icon: Facebook, platform: 'facebook', color: 'hover:text-blue-600', bg: 'hover:bg-blue-50' },
                  { icon: XIcon, platform: 'x', isCustom: true, color: 'hover:text-gray-900', bg: 'hover:bg-gray-100' },
                  { icon: Linkedin, platform: 'linkedin', color: 'hover:text-blue-700', bg: 'hover:bg-blue-50' },
                  { icon: Instagram, platform: 'instagram', color: 'hover:text-pink-600', bg: 'hover:bg-pink-50' },
                  { icon: WhatsAppIcon, platform: 'whatsapp', isCustom: true, color: 'hover:text-green-600', bg: 'hover:bg-green-50' },
                  { icon: Link2, platform: 'copy', color: 'hover:text-gray-900', bg: 'hover:bg-gray-100' },
                ].map(({ icon: Icon, platform, color, bg }) => (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    className={`p-2.5 bg-white rounded-full shadow-md hover:shadow-lg ${bg} text-gray-600 ${color} transition-all duration-300 transform hover:scale-110`}
                    title={`Compartilhar no ${platform}`}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Conteúdo principal */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Imagem de capa com efeito parallax */}
                {post.image_url && (
                  <div className="relative w-full h-[500px] overflow-hidden group">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_BLOG_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    
                    {/* Badge de categoria na imagem */}
                    <div className="absolute top-6 left-6">
                      <span className="bg-[#9A0000] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-8 md:p-12 lg:p-14">
                  {/* Metadados melhorados */}
                  <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b-2 border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#9A0000] to-red-600 rounded-full flex items-center justify-center text-white">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-semibold">POR</span>
                        <span className="font-semibold text-gray-800">{post.author}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white">
                        <Calendar size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-semibold">PUBLICADO</span>
                        <span className="font-semibold text-gray-800">{formatDate(post.created_at)}</span>
                      </div>
                    </div>

                    {post.readTime && (
                      <div className="flex items-center gap-2 text-gray-600 ml-auto">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          ⏱
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 font-semibold">TEMPO</span>
                          <span className="font-semibold text-gray-800">{post.readTime}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Título principal */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                  </h1>

                  {/* Excerpt destacado */}
                  {post.excerpt && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-[#9A0000] pl-6 py-6 mb-10 rounded-r-xl shadow-sm">
                      <p className="text-lg text-gray-700 italic leading-relaxed font-serif">
                        "{post.excerpt}"
                      </p>
                    </div>
                  )}

                  {/* Conteúdo principal com tipografia rica */}
                  <div 
                    className="prose prose-lg prose-headings:font-serif prose-headings:text-gray-900 prose-headings:mt-8 prose-headings:mb-4 prose-p:text-gray-700 prose-p:leading-8 prose-strong:text-[#9A0000] prose-strong:font-semibold prose-a:text-[#9A0000] prose-a:font-semibold hover:prose-a:underline prose-li:text-gray-700 prose-li:leading-7 prose-blockquote:border-[#9A0000] prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Separador e rodapé */}
                  <div className="mt-16 pt-10 border-t-2 border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <button
                        onClick={onBack}
                        className="text-[#9A0000] font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-300 group text-base"
                      >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>← Voltar aos posts</span>
                      </button>

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 font-semibold">COMPARTILHAR:</span>
                        <div className="flex gap-2">
                          {[
                            { icon: Facebook, platform: 'facebook', color: 'hover:text-blue-600' },
                            { icon: XIcon, platform: 'x', isCustom: true, color: 'hover:text-gray-900' },
                            { icon: Linkedin, platform: 'linkedin', color: 'hover:text-blue-700' },
                            { icon: Instagram, platform: 'instagram', color: 'hover:text-pink-600' },
                            { icon: WhatsAppIcon, platform: 'whatsapp', isCustom: true, color: 'hover:text-green-600' },
                          ].map(({ icon: Icon, platform, color }) => (
                            <button
                              key={platform}
                              onClick={() => handleShare(platform)}
                              className={`p-3 bg-gray-100 rounded-full ${color} text-gray-600 transition-all duration-300 hover:bg-gray-200 transform hover:scale-110`}
                            >
                              <Icon size={18} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Newsletter CTA */}
              <div className="mt-12 bg-gradient-to-r from-[#9A0000] to-red-600 rounded-3xl shadow-xl p-8 md:p-10 text-white">
                <div className="flex gap-4 items-start">
                  <Mail size={32} className="flex-shrink-0 mt-1" />
                  <div className="flex-grow">
                    <h3 className="text-2xl font-serif font-bold mb-2">Receba atualizações no seu email</h3>
                    <p className="text-red-100 mb-6 leading-relaxed">
                      Inscreva-se na nossa newsletter para recebernotícias, dicas culinárias e ofertas especiais direto na sua caixa de entrada.
                    </p>
                    <form className="flex gap-2" onSubmit={(e) => {
                      e.preventDefault();
                      alert('Obrigado por se inscrever!');
                    }}>
                      <input
                        type="email"
                        placeholder="Seu email..."
                        className="flex-grow px-5 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-white text-[#9A0000] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 flex-shrink-0"
                      >
                        Inscrever
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar com Tabela de Conteúdo */}
            {tableOfContents.length > 0 && (
              <aside className="lg:col-span-1 hidden lg:block">
                <div className="sticky top-32 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="font-serif font-bold text-lg text-gray-900 mb-4">Neste artigo</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                        className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                          item.level === 2
                            ? 'text-gray-900 font-semibold hover:bg-[#9A0000]/5 hover:text-[#9A0000]'
                            : 'text-gray-600 text-sm pl-8 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Card do Autor */}
                <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#9A0000] to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                      {post.author[0]}
                    </div>
                    <h4 className="font-serif font-bold text-gray-900 mb-1">{post.author}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Educador Culinárico</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Compartilhando conhecimento e dicas culinárias para tornar sua experiência em cozinha mais aprazível.
                    </p>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Botão flutuante voltar ao topo */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#9A0000] text-white p-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-red-700 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 z-40"
          aria-label="Voltar ao topo"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
};

export default PostDetails;