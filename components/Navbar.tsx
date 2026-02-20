
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ShoppingCart, User, Search, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { recordFormSubmission } from '../services/formSubmissions';

interface NavbarProps {
  onNavigate: (page: string) => void;
  user?: { name: string; email: string; avatar?: string } | null;
  cartCount?: number;
  onOpenCart?: () => void;
  favoritesCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, user, cartCount = 0, onOpenCart, favoritesCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Using the new logo provided
  const logoUrl = "/assets/logo.webp";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focar no input quando a busca abrir e gerenciar tecla ESC
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      // Pequeno delay para garantir que a animação CSS iniciou
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isSearchOpen]);

  const handleLinkClick = (page: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setSearchError('');
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current?.value.trim()) return;

    const query = inputRef.current.value.trim();
    setIsSearching(true);
    setSearchError('');

    try {
      await recordFormSubmission('search', { query });
    } catch (error) {
      console.error('Erro ao registrar busca', error);
      setSearchError('Não foi possível registrar sua busca agora.');
    }

    setTimeout(() => {
      setIsSearching(false);
      onNavigate('catalog');
      setIsSearchOpen(false);
    }, 600);
  };

  const navItems = [
    { name: 'Início', id: 'home' },
    { name: 'Cursos Presenciais', id: 'presencial' },
    { name: 'Blog', id: 'blog' },
    { name: 'Loja Virtual', href: 'https://sonhodafesta.com.br' }
  ];

  return (
    <>
      {/* Promo Bar */}
      <div className="bg-[#9A0000] text-white text-xs text-center py-2 font-medium tracking-wide relative z-[60]">
        ✨ O SEGREDO DO SUCESSO ESTÁ NO CONHECIMENTO. VENHA APRENDER COM OS MELHORES A PARTIR DE R$2,99✨
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-white py-4 border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            
            {/* Search Overlay - Absolute positioning for smooth transition over content */}
            <div 
              className={`absolute inset-0 bg-white z-20 flex items-center justify-center transition-all duration-300 ease-in-out ${
                isSearchOpen 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible -translate-y-4'
              }`}
            >
              <div className="w-full max-w-3xl px-4 relative">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <Search className="absolute left-0 text-[#9A0000]" size={24} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="O que você quer aprender hoje?"
                    className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#9A0000] py-4 pl-10 pr-12 text-gray-800 placeholder:text-gray-300 focus:outline-none transition-all font-serif font-bold text-xl md:text-2xl"
                  />
                  
                  {/* Action Button inside Input */}
                  <button 
                    type="submit"
                    className="absolute right-0 text-[#9A0000] hover:bg-red-50 p-2 rounded-full transition-colors"
                    disabled={isSearching}
                  >
                    {isSearching ? <Loader2 size={24} className="animate-spin" /> : <ArrowRight size={24} />}
                  </button>
                </form>
                {searchError && (
                  <p className="mt-3 text-center text-xs text-red-500 font-semibold">{searchError}</p>
                )}
                
                {/* Close Button and Hint */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-12 md:-right-16 flex flex-col items-center">
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchError('');
                    }}
                    className="p-2 text-gray-400 hover:text-[#9A0000] hover:bg-gray-50 rounded-full transition-all transform hover:rotate-90"
                    aria-label="Fechar busca"
                  >
                    <X size={28} />
                  </button>
                </div>
                <div className="absolute -bottom-8 left-0 text-xs text-gray-400 pl-10 hidden md:block">
                  Pressione <span className="border border-gray-200 rounded px-1 py-0.5 mx-1 font-mono text-[10px]">ESC</span> para fechar
                </div>
              </div>
            </div>

            {/* Default Navbar Content - Fades out when search is open */}
            <div 
              className={`flex justify-between items-center w-full transition-opacity duration-300 ${
                isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* Logo Section */}
              <div className="flex items-center">
                <a href="#" onClick={(e) => handleLinkClick('home', e)} className="flex-shrink-0 flex items-center gap-4 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#d20000]/10 rounded-full blur-md group-hover:blur-lg transition-all opacity-0 group-hover:opacity-100"></div>
                    <img 
                      src={logoUrl} 
                      alt="Sonho da Festa" 
                      className="relative h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm rounded-xl"
                    />
                  </div>
                  
                  <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>

                  <div className="flex flex-col justify-center">
                    <span className="font-quicksand font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#9A0000] leading-tight mb-0.5 ml-0.5">
                      Centro Culinário
                    </span>
                    <span className="font-pacifico text-2xl sm:text-3xl text-[#d20000] leading-none drop-shadow-sm mt-1">
                      Sonho da Festa
                    </span>
                  </div>
                </a>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {navItems.map((item) => (
                  <a 
                    key={item.name}
                    href={item.href || "#"} 
                    target={item.href ? "_blank" : undefined}
                    rel={item.href ? "noopener noreferrer" : undefined}
                    onClick={(e) => !item.href && handleLinkClick(item.id!, e)}
                    className="text-[#9A0000] font-medium text-sm uppercase tracking-wider hover:text-[#d20000] transition-colors relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d20000] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
              </div>

              {/* Actions */}
              <div className="hidden md:flex items-center space-x-2">
                <button 
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                    setSearchError('');
                  }}
                  className="p-2 text-gray-400 hover:text-[#9A0000] transition-colors hover:bg-gray-50 rounded-full group"
                  aria-label="Buscar"
                >
                  <Search size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={(e) => handleLinkClick('profile', e)}
                  className="p-2 text-gray-400 hover:text-[#d20000] transition-colors hover:bg-gray-50 rounded-full group relative"
                >
                  <Heart size={20} className="group-hover:scale-110 transition-transform" />
                  {favoritesCount > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-[#9A0000] rounded-full border-2 border-white"></span>
                  )}
                </button>
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                <button 
                  onClick={(e) => handleLinkClick('profile', e)}
                  className="flex items-center gap-2 text-[#9A0000] font-bold hover:text-[#d20000] transition-colors px-3 max-w-[150px]"
                >
                  <User size={20} className="flex-shrink-0" />
                  <span className="text-sm truncate">
                    {user ? user.name.split(' ')[0] : 'Entrar'}
                  </span>
                </button>
                <button 
                  onClick={onOpenCart}
                  className="bg-[#d20000] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#b00000] transition-all shadow-md flex items-center gap-2 hover:-translate-y-0.5 group"
                >
                  <ShoppingCart size={18} className="group-hover:animate-bounce" />
                  <span className="hidden xl:inline">Carrinho</span>
                  <span className="bg-white/20 px-1.5 rounded-full text-xs min-w-[20px] text-center">
                    {cartCount}
                  </span>
                </button>
              </div>

              {/* Mobile Toggle */}
              <div className="flex md:hidden items-center gap-2">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-[#9A0000] p-2 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Search size={24} />
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#9A0000] p-2 hover:bg-gray-50 rounded-md transition-colors">
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && !isSearchOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl animate-in slide-in-from-top-5 z-40">
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href || "#"}
                  target={item.href ? "_blank" : undefined}
                  rel={item.href ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!item.href) handleLinkClick(item.id!, e);
                  }}
                  className="block text-lg font-serif font-medium text-[#9A0000] hover:text-[#d20000] border-b border-gray-50 pb-2"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-6 grid grid-cols-2 gap-4">
                 <button 
                   onClick={(e) => handleLinkClick('profile', e)}
                   className="flex items-center justify-center gap-2 border border-[#9A0000] text-[#9A0000] py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                 >
                   <User size={20} /> 
                   <span className="truncate max-w-[100px]">
                     {user ? user.name.split(' ')[0] : 'Entrar'}
                   </span>
                 </button>
                 <button 
                   onClick={() => {
                     setIsMenuOpen(false);
                     if (onOpenCart) onOpenCart();
                   }}
                   className="flex items-center justify-center gap-2 bg-[#d20000] text-white py-3 rounded-lg font-bold hover:bg-[#b00000] transition-colors shadow-md relative"
                 >
                   <ShoppingCart size={20} /> Carrinho
                   {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#fff304] text-[#9A0000] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white">
                        {cartCount}
                      </span>
                   )}
                 </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
