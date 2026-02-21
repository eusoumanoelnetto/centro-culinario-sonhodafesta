import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './services/supabase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseCard from './components/CourseCard';
import CourseDetails from './components/CourseDetails';
import PresencialCourses from './components/PresencialCourses';
import Catalog from './components/Catalog';
import AIAssistant from './components/AIAssistant';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookiePolicy from './components/CookiePolicy';
import Blog from './components/Blog';
import TeacherApplication from './components/TeacherApplication';
import Contact from './components/Contact';
import UserDashboard from './components/UserDashboard';
import CartSidebar from './components/CartSidebar';
import CheckoutPage from './components/CheckoutPage';
import SeatSelector from './components/SeatSelector';
import AdminDashboard from './components/AdminDashboard';
import Units from './components/Units';
import Teachers from './components/Teachers'; // <-- import da página de professores
import Modal from './components/Modal';
import { Course, BlogPost, CartItem, CartHistoryEvent } from './types';
import { CATEGORIES, COURSES, TESTIMONIALS, BLOG_POSTS } from './constants';
import { 
  PartyPopper, Palette, Scissors, Cake, Star, 
  MapPin, Phone, Instagram, Youtube, Mail, ArrowRight, Award, ShieldCheck, Zap,
  Gift, Egg, Heart, Baby, Flower, User, MessageCircle, Lock, Cookie, Facebook
} from 'lucide-react';
import { recordFormSubmission } from './services/formSubmissions';
import { createLead } from './services/leads';
import { fetchCartData, upsertCartItem, updateCartItemStatus, appendCartHistory, deleteCartHistoryByAction } from './services/cart';

const logoUrl = '/assets/logo.webp'; // Substitua pelo URL real da logo

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [currentView, setCurrentView] = useState<'home' | 'details' | 'presencial' | 'catalog' | 'privacy' | 'cookies' | 'blog' | 'teacher-application' | 'contact' | 'profile' | 'checkout' | 'admin' | 'units' | 'teachers'>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const coursesRef = useRef<Course[]>(COURSES);
  const pendingCartSync = useRef<Promise<void> | null>(null);
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartHistory, setCartHistory] = useState<CartHistoryEvent[]>([]);

  const [favorites, setFavorites] = useState<string[]>([]);

  const [seatSelectorOpen, setSeatSelectorOpen] = useState(false);
  const [courseToSelectSeat, setCourseToSelectSeat] = useState<Course | null>(null);

  const [user, setUser] = useState<{name: string, email: string, avatar?: string, studentId?: string} | null>(null);

  // Estados para a home (carrossel, cookie, etc.)
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isHoveringTestimonials, setIsHoveringTestimonials] = useState(false);
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [leadFeedback, setLeadFeedback] = useState('');
  const [modal, setModal] = useState<{ isOpen: boolean; type?: 'warning' | 'success' | 'error'; title?: string; message: string; onConfirm?: () => void } | null>(null);

  useEffect(() => {
    coursesRef.current = courses;
  }, [courses]);

  const resolveCourseSnapshot = (courseId: string, fallback: Partial<Course> = {}): Course => {
    const catalogCourse = coursesRef.current.find(course => course.id === courseId);
    if (catalogCourse) {
      return { ...catalogCourse, ...fallback, id: catalogCourse.id };
    }
    return { ...fallback, id: courseId } as Course;
  };

  const syncLocalCartToSupabase = (studentId: string) => {
    if (!studentId) return Promise.resolve();

    const itemsToSync = cart.filter((item) => item.status === 'active' && !item.persisted);
    if (itemsToSync.length === 0) return Promise.resolve();

    const syncPromise = (async () => {
      try {
        await Promise.all(
          itemsToSync.map(async (item) => {
            const targetCartItemId = item.cartItemId ?? `cart-${item.id}-${Date.now()}`;
            await upsertCartItem(studentId, targetCartItemId, {
              ...item,
              id: item.id,
            });
          })
        );
      } catch (error) {
        console.error('Erro ao sincronizar carrinho local com o banco:', error);
      }
    })();

    pendingCartSync.current = syncPromise;
    return syncPromise;
  };

  // Carregar usuário e favoritos do localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('user_session');
    const savedFavorites = localStorage.getItem('user_favorites');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ Sessão restaurada:', userData.name);
        
        if (userData.studentId) {
          import('./services/students').then(async ({ updateStudent, listStudents }) => {
            try {
              const students = await listStudents();
              const student = students.find(s => s.id === userData.studentId);
              if (student && student.favorites) {
                setFavorites(student.favorites);
                localStorage.setItem('user_favorites', JSON.stringify(student.favorites));
                console.log('❤️ Favoritos sincronizados do banco:', student.favorites.length, 'cursos');
              }
            } catch (error) {
              console.error('Erro ao sincronizar favoritos:', error);
              if (savedFavorites) {
                const favoritesData = JSON.parse(savedFavorites);
                setFavorites(favoritesData);
              }
            }
          });
        } else if (savedFavorites) {
          const favoritesData = JSON.parse(savedFavorites);
          setFavorites(favoritesData);
          console.log('❤️ Favoritos restaurados do cache:', favoritesData.length, 'cursos');
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
        localStorage.removeItem('user_session');
      }
    }
  }, []);

  // Load cart and history from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const rawCart = JSON.parse(savedCart);
        setCart(rawCart); // Simplificado; ajuste conforme necessário
      } catch (error) {
        console.error('Erro ao restaurar carrinho:', error);
      }
    }
    const savedHistory = localStorage.getItem('cart_history');
    if (savedHistory) {
      try {
        setCartHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Erro ao restaurar histórico:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save cart history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart_history', JSON.stringify(cartHistory));
  }, [cartHistory]);

  // Proteção de rota: só renderiza AdminDashboard se usuário estiver autenticado e navegou explicitamente para admin
  // ... (outros useEffects existentes, como o de hidratação do Supabase, etc.)

  useEffect(() => {
    let isMounted = true;

    const hydrateFromSupabase = async () => {
      if (!user?.studentId) return;

      const syncPromise = pendingCartSync.current;
      if (syncPromise) {
        try {
          await syncPromise;
        } catch (error) {
          console.error('Erro ao sincronizar itens locais antes de carregar o carrinho remoto:', error);
        } finally {
          pendingCartSync.current = null;
        }
      }

      try {
        const { items, history } = await fetchCartData(user.studentId);
        if (!isMounted) return;

        const activeCartItems: CartItem[] = items
          .filter((item) => item.status === 'active')
          .map((item) => {
            const mergedCourse = resolveCourseSnapshot(item.courseId, item.snapshot);
            return {
              ...mergedCourse,
              selectedSeat: item.snapshot.selectedSeat ?? mergedCourse.selectedSeat,
              cartItemId: item.cartItemId,
              status: item.status,
              persisted: true,
            } satisfies CartItem;
          });

        setCart(activeCartItems);

        const historyEntries: CartHistoryEvent[] = history
          .filter((entry) => entry.action !== 'removed')
          .map((entry) => ({
            id: entry.id,
            cartItemId: entry.cartItemId,
            courseId: entry.courseId,
            action: entry.action,
            course: resolveCourseSnapshot(entry.courseId, entry.snapshot),
            timestamp: new Date(entry.createdAt),
            status: items.find((item) => item.cartItemId === entry.cartItemId)?.status ?? 'active',
          }));

        setCartHistory(historyEntries);
      } catch (error) {
        console.error('Erro ao carregar carrinho do banco:', error);
      }
    };

    void hydrateFromSupabase();

    return () => {
      isMounted = false;
    };
  }, [user?.studentId]);

  // 🔌 Teste de conexão Supabase
  useEffect(() => {
    console.log('🚀 Supabase conectado:', supabase);
  }, []);

  // Carousel Logic & Cookie Check
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShowCookieConsent(true), 1500);
      return () => clearTimeout(timer);
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isHoveringTestimonials) return;

    const interval = setInterval(() => {
      setTestimonialIndex((prevIndex) => {
        const maxIndex = TESTIMONIALS.length - itemsPerPage;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [itemsPerPage, isHoveringTestimonials]);

  const getCategoryIcon = (name: string) => {
    switch(name) {
      case 'Confeitaria': return <Cake strokeWidth={1.5} size={28} />;
      case 'Decorações': return <PartyPopper strokeWidth={1.5} size={28} />;
      case 'Páscoa': return <Egg strokeWidth={1.5} size={28} />;
      default: return <Star strokeWidth={1.5} size={28} />;
    }
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('details');
    window.scrollTo(0, 0);
  };

  const handleToggleFavorite = async (course: Course) => {
    if (!user) {
      setModal({ isOpen: true, type: 'warning', message: 'Por favor, faça login ou cadastre-se para favoritar cursos.' });
      handleNavigate('profile');
      return;
    }

    const updatedFavorites = favorites.includes(course.id)
      ? favorites.filter(id => id !== course.id)
      : [...favorites, course.id];
    
    setFavorites(updatedFavorites);
    localStorage.setItem('user_favorites', JSON.stringify(updatedFavorites));
    
    if (user.studentId) {
      try {
        const { updateStudent } = await import('./services/students');
        await updateStudent(user.studentId, {
          name: user.name,
          email: user.email,
          favorites: updatedFavorites,
        });
        console.log('📡 Favoritos salvos no banco de dados');
      } catch (error) {
        console.error('❌ Erro ao salvar favoritos no banco:', error);
      }
    }
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
  };

  const handleAddBlogPost = (newPost: BlogPost) => {
    setBlogPosts(prev => [newPost, ...prev]);
  };

  const handleRateCourse = (courseId: string, rating: number) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id === courseId) {
        const currentRating = course.rating;
        const newRating = ((currentRating * 10) + rating) / 11;
        return { ...course, rating: parseFloat(newRating.toFixed(1)) };
      }
      return course;
    }));
    
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prev => {
        if (!prev) return null;
        const currentRating = prev.rating;
        const newRating = ((currentRating * 10) + rating) / 11;
        return { ...prev, rating: parseFloat(newRating.toFixed(1)) };
      });
    }
  };

  // Salvar página atual no localStorage sempre que mudar (apenas para usuários logados)
  useEffect(() => {
    if (user) {
      localStorage.setItem('current_view', currentView);
    }
  }, [currentView, user]);

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setCurrentView('home');
      setSelectedCourse(null);
    } else if (page === 'presencial') {
      setCurrentView('presencial');
      setSelectedCourse(null);
    } else if (page === 'catalog') {
      setCurrentView('catalog');
      setSelectedCourse(null);
    } else if (page === 'privacy') {
      setCurrentView('privacy');
      setSelectedCourse(null);
    } else if (page === 'cookies') {
      setCurrentView('cookies');
      setSelectedCourse(null);
    } else if (page === 'blog') {
      setCurrentView('blog');
      setSelectedCourse(null);
    } else if (page === 'teacher-application') {
      setCurrentView('teacher-application');
      setSelectedCourse(null);
    } else if (page === 'contact') {
      setCurrentView('contact');
      setSelectedCourse(null);
    } else if (page === 'profile') {
      setCurrentView('profile');
      setSelectedCourse(null);
    } else if (page === 'checkout') {
      setCurrentView('checkout');
      setSelectedCourse(null);
      setIsCartOpen(false);
    } else if (page === 'admin') {
      setCurrentView('admin');
      setSelectedCourse(null);
    } else if (page === 'units') {
      setCurrentView('units');
      setSelectedCourse(null);
    } else if (page === 'teachers') { // <-- nova rota
      setCurrentView('teachers');
      setSelectedCourse(null);
    }
    window.scrollTo(0, 0);
  };

  const handleFooterCategoryClick = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveCategory(category);
    setCurrentView('catalog');
    window.scrollTo(0, 0);
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLeadStatus('loading');
    setLeadFeedback('');

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get('name')?.toString().trim() || '',
      email: data.get('email')?.toString().trim() || '',
      phone: data.get('phone')?.toString().trim() || '',
    };

    try {
      await createLead({
        ...payload,
        source: 'newsletter_form',
      });
      form.reset();
      setLeadStatus('success');
      setLeadFeedback('Cadastro realizado! Em breve você receberá nossas novidades.');
    } catch (error) {
      console.error('Erro ao cadastrar lead', error);
      setLeadStatus('error');
      setLeadFeedback('Não foi possível concluir o cadastro. Tente novamente.');
    }
  };

  const handleLogin = (userData: {name: string, email: string, avatar?: string, studentId: string, favorites?: string[]}) => {
    setUser(userData);
    
    if (userData.favorites) {
      setFavorites(userData.favorites);
      localStorage.setItem('user_favorites', JSON.stringify(userData.favorites));
      console.log('❤️ Favoritos carregados do banco:', userData.favorites.length, 'cursos');
    }

    if (cart.length > 0) {
      void syncLocalCartToSupabase(userData.studentId);
    }
    
    localStorage.setItem('user_session', JSON.stringify(userData));
    console.log('💾 Sessão salva:', userData.name);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('current_view');
    localStorage.removeItem('user_favorites');
    localStorage.removeItem('cart');
    localStorage.removeItem('cart_history');
    console.log('🚪 Sessão encerrada');
    setFavorites([]);
    setCart([]);
    setCartHistory([]);
    setIsCartOpen(false);
    handleNavigate('home');
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowCookieConsent(false);
  };

  const initiateCoursePurchase = (course: Course) => {
    if (course.description?.toLowerCase().includes('presencial') || course.description?.toLowerCase().includes('workshop')) {
      setCourseToSelectSeat(course);
      setSeatSelectorOpen(true);
    } else {
      addToCart(course);
    }
  };

  const addToCart = (course: Course) => {
    const cartItemId = `cart-${course.id}-${Date.now()}`;
    const newItem: CartItem = {
      ...course,
      cartItemId,
      status: 'active',
      persisted: Boolean(user?.studentId) ? false : undefined,
    };

    setCart((prev) => [...prev, newItem]);
    setIsCartOpen(true);

    const historyEntry: CartHistoryEvent = {
      id: `history-${cartItemId}`,
      cartItemId,
      courseId: course.id,
      action: 'added',
      course: newItem,
      timestamp: new Date(),
      status: 'active',
    };
    setCartHistory((prev) => [...prev, historyEntry]);

    if (user?.studentId) {
      void (async () => {
        try {
          await upsertCartItem(user.studentId, cartItemId, newItem);
          await appendCartHistory(user.studentId, cartItemId, 'added', newItem);
          setCart((prev) =>
            prev.map((item) =>
              item.cartItemId === cartItemId ? { ...item, persisted: true } : item
            )
          );
        } catch (error) {
          console.error('Erro ao sincronizar item adicionado com o banco:', error);
        }
      })();
    }
  };

  const handleSeatConfirmed = (course: Course, seat: string) => {
    const courseWithSeat = { ...course, selectedSeat: seat };
    addToCart(courseWithSeat);
    setSeatSelectorOpen(false);
    setCourseToSelectSeat(null);
  };

  const removeFromCart = (cartItemId: string) => {
    const removedCourse = cart.find(item => item.cartItemId === cartItemId);
    setCart((prev) => prev.filter(item => item.cartItemId !== cartItemId));

    if (removedCourse) {
      setCartHistory((prev) => prev.filter((entry) => !(entry.cartItemId === cartItemId && entry.action === 'added')));

      if (user?.studentId) {
        void (async () => {
          try {
            await updateCartItemStatus(user.studentId!, cartItemId, 'removed');
            await deleteCartHistoryByAction(user.studentId!, cartItemId, 'added');
          } catch (error) {
            console.error('Erro ao atualizar remoção no banco:', error);
          }
        })();
      }
    }
  };

  const handleCheckoutSuccess = () => {
    const checkoutTimestamp = new Date();
    const itemsToFinalize = [...cart];

    const purchasedEntries: CartHistoryEvent[] = itemsToFinalize.map((item) => ({
      id: `history-${item.cartItemId}-purchased-${checkoutTimestamp.getTime()}`,
      cartItemId: item.cartItemId,
      courseId: item.id,
      action: 'purchased',
      course: item,
      timestamp: checkoutTimestamp,
      status: 'purchased',
    }));

    setCartHistory((prev) => {
      const pendingCartItemIds = new Set(itemsToFinalize.map((item) => item.cartItemId));
      const withoutPendingEntries = prev.filter(
        (entry) => !(entry.action === 'added' && pendingCartItemIds.has(entry.cartItemId))
      );
      return [...withoutPendingEntries, ...purchasedEntries];
    });
    setCart([]);
    handleNavigate('home');

    if (user?.studentId) {
      void Promise.allSettled(
        itemsToFinalize.map(async (item) => {
          try {
            await updateCartItemStatus(user.studentId!, item.cartItemId, 'purchased');
            await appendCartHistory(user.studentId!, item.cartItemId, 'purchased', item);
            await deleteCartHistoryByAction(user.studentId!, item.cartItemId, 'added');
          } catch (error) {
            console.error('Erro ao registrar compra no banco:', error);
          }
        })
      );
    }
  };

  const filteredCourses = activeCategory === 'Todos' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  // Função que retorna o conteúdo baseado na view atual
  const renderContent = () => {
    switch (currentView) {
      case 'units':
        return <Units onBack={() => handleNavigate('home')} />;
      case 'admin':
        return (
          <AdminDashboard 
            onBack={() => handleNavigate('home')} 
            onAddCourse={handleAddCourse}
            onAddBlogPost={handleAddBlogPost}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage 
            cartItems={cart}
            onRemoveItem={removeFromCart}
            onSuccess={handleCheckoutSuccess}
            onBack={() => handleNavigate('catalog')}
          />
        );
      case 'details':
        return selectedCourse ? (
          <CourseDetails 
            course={selectedCourse} 
            onBack={() => handleNavigate('home')} 
            onAddToCart={initiateCoursePurchase}
          />
        ) : null;
      case 'presencial':
        return <PresencialCourses onBack={() => handleNavigate('home')} onCourseClick={initiateCoursePurchase} />;
      case 'catalog':
        return (
          <Catalog 
            onBack={() => handleNavigate('home')} 
            onCourseClick={handleCourseClick} 
            initialCategory={activeCategory === 'Todos' ? undefined : activeCategory}
            courses={courses}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'blog':
        return <Blog onBack={() => handleNavigate('home')} posts={blogPosts} />;
      case 'teacher-application':
        return <TeacherApplication onBack={() => handleNavigate('home')} />;
      case 'contact':
        return <Contact onBack={() => handleNavigate('home')} />;
      case 'profile':
        return (
          <UserDashboard 
            onBack={() => handleNavigate('home')} 
            onNavigate={handleNavigate}
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onRate={handleRateCourse}
            favorites={favorites}
            allCourses={courses}
            onCourseClick={handleCourseClick}
            cartHistory={cartHistory}
          />
        );
      case 'privacy':
        return <PrivacyPolicy onBack={() => handleNavigate('home')} />;
      case 'cookies':
        return <CookiePolicy onBack={() => handleNavigate('home')} />;
      case 'teachers': // <-- nova view
        return <Teachers onBack={() => handleNavigate('home')} />;
      case 'home':
      default:
        return (
          <>
            <Hero onViewCatalog={() => handleNavigate('catalog')} />

            {/* Categories */}
            <section className="py-16 border-b border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <span className="text-[#d20000] font-bold text-xs uppercase tracking-widest">Nossas Áreas</span>
                  <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#9A0000] mt-2">Explore por Categoria</h2>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6">
                  {CATEGORIES.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${
                        activeCategory === cat.name 
                          ? 'bg-[#9A0000] text-white border-[#9A0000]' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#9A0000] hover:text-[#9A0000]'
                      }`}
                    >
                      {getCategoryIcon(cat.name)}
                      <span className="font-bold text-sm">{cat.name}</span>
                    </button>
                  ))}

                  <button 
                    onClick={(e) => handleFooterCategoryClick('Todos', e)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${
                      activeCategory === 'Todos' 
                        ? 'bg-[#9A0000] text-white border-[#9A0000]' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#9A0000] hover:text-[#9A0000]'
                    }`}
                  >
                    <span className="font-bold text-sm">Todos os Cursos</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Featured Courses */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#9A0000]">Cursos do Mês</h2>
                    <p className="text-gray-500 mt-2 text-lg font-light">
                      As técnicas mais procuradas pelos profissionais de confeitaria e festas.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleNavigate('catalog')} 
                    className="text-[#d20000] font-bold flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Ver agenda completa <ArrowRight size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                  {filteredCourses.slice(0, 6).map(course => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onClick={handleCourseClick}
                      isFavorite={favorites.includes(course.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-[#9A0000] text-white relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-10" 
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
              />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                  <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
                    A Diferença Sonho da Festa
                  </h2>
                  <p className="text-red-100 max-w-2xl mx-auto">
                    Muito mais que uma loja. Unimos a maior variedade de produtos ao conhecimento técnico especializado, 
                    criando um ecossistema completo para o seu sucesso.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-[#fffbe5] p-8 rounded-2xl border border-[#9A0000]/10">
                    <div className="w-14 h-14 bg-[#fff304] rounded-xl flex items-center justify-center text-[#9A0000] mb-6 shadow-lg">
                      <Award size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#9A0000]">Certificado de Conclusão</h3>
                    <p className="text-[#140002] text-sm leading-relaxed">
                      Valorize seu trabalho. Ao finalizar o curso, receba um certificado que atesta sua participação 
                      e ajuda a transmitir mais profissionalismo aos seus clientes.
                    </p>
                  </div>
                  <div className="bg-[#fffbe5] p-8 rounded-2xl border border-[#9A0000]/10">
                    <div className="w-14 h-14 bg-[#d20000] rounded-xl flex items-center justify-center text-white mb-6 shadow-lg">
                      <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#9A0000]">Aulas Presenciais</h3>
                    <p className="text-[#140002] text-sm leading-relaxed">
                      Aprenda observando os melhores chefs em ação. Nossas aulas focam no ensino passo a passo das técnicas, 
                      onde você assiste, interage e tira dúvidas.
                    </p>
                  </div>
                  <div className="bg-[#fffbe5] p-8 rounded-2xl border border-[#9A0000]/10">
                    <div className="w-14 h-14 bg-[#9d0b48] rounded-xl flex items-center justify-center text-white mb-6 shadow-lg">
                      <Zap size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#9A0000]">Comunidade no WhatsApp</h3>
                    <p className="text-[#140002] text-sm leading-relaxed">
                      Participe da nossa comunidade de alunos no WhatsApp. Receba em primeira mão nosso calendário 
                      de aulas e ofertas exclusivas.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Carousel */}
            <section 
              className="py-24 bg-[#fcfaf8]" 
              onMouseEnter={() => setIsHoveringTestimonials(true)} 
              onMouseLeave={() => setIsHoveringTestimonials(false)}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#9A0000] text-center mb-16">
                  Quem fez, aprovou
                </h2>

                <div className="relative overflow-hidden p-2">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out" 
                    style={{ transform: `translateX(-${testimonialIndex * (100 / itemsPerPage)}%)` }}
                  >
                    {TESTIMONIALS.map((t) => (
                      <div key={t.id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4 px-3">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative h-full flex flex-col">
                          <div className="text-[#d20000] text-6xl font-serif absolute top-4 right-6 opacity-20">"</div>
                          <div className="flex items-center gap-3 mb-4">
                            <img 
                              src={t.avatar} 
                              alt={t.name} 
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0" 
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-[#9A0000] text-sm truncate">{t.name}</p>
                              <p className="text-xs text-gray-500 truncate">{t.role}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 italic text-sm leading-relaxed flex-grow line-clamp-4">
                            {t.content}
                          </p>
                          <div className="flex text-[#fff304] mt-4 gap-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots Navigation */}
                <div className="flex justify-center mt-8 gap-2">
                  {Array.from({ length: TESTIMONIALS.length - itemsPerPage + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTestimonialIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        testimonialIndex === idx ? 'w-8 bg-[#9A0000]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Ir para slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#fff304] selection:text-[#9A0000] bg-[#fcfaf8] font-quicksand overflow-x-hidden">
      {currentView !== 'checkout' && currentView !== 'admin' && (
        <Navbar 
          onNavigate={handleNavigate} 
          user={user} 
          cartCount={cart.length} 
          onOpenCart={() => setIsCartOpen(true)}
          favoritesCount={favorites.length}
        />
      )}
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onRemoveItem={removeFromCart}
        onCheckout={() => handleNavigate('checkout')}
      />

      {courseToSelectSeat && (
        <SeatSelector 
          isOpen={seatSelectorOpen}
          onClose={() => setSeatSelectorOpen(false)}
          course={courseToSelectSeat}
          onConfirm={handleSeatConfirmed}
        />
      )}

      {/* Cookie Consent Banner */}
      {showCookieConsent && (
        <div className="fixed bottom-4 left-4 z-[60] w-[calc(100%-2rem)] md:w-auto md:max-w-sm bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-700">
          <div className="flex items-start gap-4">
            <div className="bg-[#fff304]/20 p-2.5 rounded-full text-[#d20000] flex-shrink-0">
              <Cookie size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Este site utiliza cookies para garantir que você tenha a melhor experiência.
              </p>
              <button 
                onClick={() => handleNavigate('cookies')}
                className="text-xs text-[#9A0000] font-bold hover:underline mt-1"
              >
                Política de Privacidade
              </button>
            </div>
          </div>
          <button 
            onClick={handleAcceptCookies}
            className="w-full mt-4 bg-[#9A0000] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#7a0000] transition-all shadow-md active:scale-95"
          >
            Aceitar
          </button>
        </div>
      )}

      <main className="flex-grow">
        {renderContent()}

        {currentView !== 'details' && currentView !== 'catalog' && currentView !== 'privacy' && 
         currentView !== 'cookies' && currentView !== 'blog' && currentView !== 'teacher-application' && 
         currentView !== 'contact' && currentView !== 'profile' && currentView !== 'checkout' && 
         currentView !== 'admin' && currentView !== 'units' && currentView !== 'teachers' && (
          <section className="py-20 bg-white border-t border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#9A0000] via-[#d20000] to-[#fff304]"></div>
             <div className="max-w-4xl mx-auto px-4 relative z-10">
               <div className="text-center mb-10">
                 <div className="inline-block p-3 rounded-full bg-[#9A0000]/5 text-[#9A0000] mb-4">
                   <Mail size={24} />
                 </div>
                 <h2 className="text-3xl font-serif font-bold text-[#9A0000] mb-4">Receba novidades e ofertas</h2>
                 <p className="text-gray-500 text-lg">
                   Faça parte da nossa lista exclusiva. Cadastre-se para receber o calendário de cursos, dicas e cupons diretamente no seu WhatsApp.
                 </p>
               </div>
               
               <form onSubmit={handleLeadSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#fff304]/10 rounded-bl-full -z-0"></div>
                 <div className="grid grid-cols-1 gap-4 relative z-10">
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nome Completo</label>
                     <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                       <input
                         required
                         type="text"
                         name="name"
                         placeholder="Como podemos te chamar?"
                         className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#9A0000] focus:bg-white transition-all"
                       />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">E-mail</label>
                       <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                         <input
                           required
                           type="email"
                           name="email"
                           placeholder="seu@email.com"
                           className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#9A0000] focus:bg-white transition-all"
                         />
                       </div>
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">WhatsApp</label>
                       <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                         <input
                           required
                           type="tel"
                           name="phone"
                           placeholder="(21) 99999-9999"
                           className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#9A0000] focus:bg-white transition-all"
                         />
                       </div>
                     </div>
                   </div>
                   <button
                     type="submit"
                     disabled={leadStatus === 'loading'}
                     className="mt-4 w-full bg-[#9A0000] text-white font-bold py-4 rounded-xl hover:bg-[#7a0000] transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 group disabled:opacity-60"
                   >
                     {leadStatus === 'loading' ? 'Enviando...' : 'Quero receber novidades e ofertas'}
                     {leadStatus !== 'loading' && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                   </button>
                   {leadFeedback && (
                     <p className={`text-center text-sm font-medium ${leadStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                       {leadFeedback}
                     </p>
                   )}
                   <div className="mt-4 space-y-2">
                     <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5 font-medium">
                       <MessageCircle size={16} className="text-[#9a0000]" /> Entre para o nosso Canal de Ofertas no WhatsApp.
                     </p>
                     <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
                       <Lock size={10} /> Seus dados estão seguros e protegidos.
                     </p>
                   </div>
                 </div>
               </form>
             </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentView !== 'checkout' && currentView !== 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white p-2 rounded-lg">
                  <img src={logoUrl} alt="Sonho da Festa" className="h-32 w-auto object-contain" />
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Desde 1996 transformando paixão em profissão. A maior rede de lojas de festas do Rio de Janeiro.
              </p>
              <div className="flex gap-4">
                <a href="http://instagram.com/cursos.sonhodafesta" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#9A0000] transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="http://facebook.com/cursos.sonhodafesta" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#9A0000] transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="https://www.youtube.com/@sonhodafesta" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#9A0000] transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 text-white font-serif">Navegação</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }} className="hover:text-[#fff304] transition-colors flex items-center gap-2">Início</a></li>
                <li><a href="https://sonhodafesta.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-[#fff304] transition-colors flex items-center gap-2 font-medium text-white">Loja Virtual</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('presencial'); }} className="hover:text-[#fff304] transition-colors flex items-center gap-2">Cursos Presenciais</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('teachers'); }} className="hover:text-[#fff304] transition-colors flex items-center gap-2">Nossos Professores</a></li> {/* <-- novo item */}
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('blog'); }} className="hover:text-[#fff304] transition-colors flex items-center gap-2">Blog</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('teacher-application'); }} className="text-[#fff304] font-bold hover:text-white transition-colors flex items-center gap-2">Quer dar aula?</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('units'); }} className="hover:text-[#fff304] transition-colors flex items-center gap-2">Nossas Unidades</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }} className="hover:text-[#fff304] transition-colors flex items-center gap-2">Contato</a></li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('admin'); }} className="hover:text-[#fff304] transition-colors flex items-center gap-2 text-xs opacity-70 mt-4">
                    <Lock size={12} /> Painel Adm
                  </a>
                </li>
                <li className="pt-4 mt-2 border-t border-gray-800">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('privacy'); }} className="hover:text-[#fff304] transition-colors block text-xs mb-2">Política de privacidade</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('cookies'); }} className="hover:text-[#fff304] transition-colors block text-xs">Política de cookie</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 text-white font-serif">Categorias</h3>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" onClick={(e) => handleFooterCategoryClick('Confeitaria', e)} className="hover:text-[#fff304] transition-colors">Confeitaria</a></li>
                <li><a href="#" onClick={(e) => handleFooterCategoryClick('Decorações', e)} className="hover:text-[#fff304] transition-colors">Decorações</a></li>
                <li><a href="#" onClick={(e) => handleFooterCategoryClick('Páscoa', e)} className="hover:text-[#fff304] transition-colors">Páscoa</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 text-white font-serif">Atendimento</h3>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="text-[#d20000] flex-shrink-0 mt-0.5" size={18} />
                  <span><strong>7 Lojas no Rio de Janeiro</strong><br /><span className="text-xs opacity-70">Cursos em: Caxias, Bangu e C. Grande</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-[#d20000] flex-shrink-0" size={18} />
                  <span>(21) 99071-2742</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-[#d20000] flex-shrink-0" size={18} />
                  <span>sonhodafestacursos@gmail.com</span>
                </li>
              </ul>
            </div>
            </div>
          )}
          <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Sonho da Festa Comércio de Artigos para Festas LTDA.</p>
            <div className="flex items-center gap-6">
              <a href="https://rebrand.ly/6a8f73" target="_blank" rel="noopener noreferrer" className="group relative hover:opacity-100 transition-all">
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-40 bg-[#fff304] text-[#9A0000] text-xs font-bold p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 pointer-events-none text-center z-50 leading-tight">
                  Quer fazer seu site?<br/>Faça conosco, clique aqui!
                  <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-[#fff304] border-b-[6px] border-b-transparent" />
                </div>
                <img 
                  src="https://i.imgur.com/JMe6OUY.png" 
                  alt="Formas de Pagamento e Segurança" 
                  className="h-12 object-contain hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <AIAssistant />

      {/* Global Modal */}
      {modal && (
        <Modal
          isOpen={modal.isOpen}
          onClose={() => setModal(null)}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onConfirm={modal.onConfirm}
        />
      )}
    </div>
  );
};

export default App;