
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Mail, Lock, User, Eye, EyeOff, LogIn, ArrowRight, 
  BookOpen, Award, Heart, Settings, LogOut, CheckCircle2, PlayCircle, Download, QrCode, X, Share2, Sparkles, Briefcase, Star,
  Crown, Gift, TrendingUp, ShoppingBag, Ticket, Zap, AlertCircle, HelpCircle, FileText, Send
} from 'lucide-react';
import { Course } from '../types';
import { COURSES } from '../constants';
import CourseCard from './CourseCard';
import { recordFormSubmission } from '../services/formSubmissions';
import { createStudent, authenticateStudent, updatePassword } from '../services/students';

interface UserDashboardProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  user: { name: string; email: string; avatar?: string } | null;
  onLogin: (user: { name: string; email: string; avatar?: string }) => void;
  onLogout: () => void;
  onRate?: (courseId: string, rating: number) => void;
  favorites?: string[];
  allCourses?: Course[];
  onCourseClick?: (course: Course) => void;
}

// Dados simulados base com Gamificação
const BASE_MOCK_DATA = {
  level: "Aluno Bronze",
  currentXp: 1250,
  nextLevelXp: 2000,
  memberSince: "Jan 2024",
  validUntil: "Jan 2027",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  courses: [
    {
      course: COURSES[0], // Masterclass Bolos
      progress: 100,
      completed: true,
      certificateUrl: "#"
    },
    {
      course: COURSES[1], // Ovos de Páscoa
      progress: 45,
      completed: false,
      certificateUrl: null
    },
    {
      course: COURSES[3], // Chantininho
      progress: 10,
      completed: false,
      certificateUrl: null
    }
  ]
};

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  onBack, 
  onNavigate, 
  user, 
  onLogin, 
  onLogout, 
  onRate, 
  favorites = [], 
  allCourses = [],
  onCourseClick
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates' | 'wishlist' | 'settings'>('courses');
  const [showIdCard, setShowIdCard] = useState(false);
  
  // First Access Password Change Modal
  const [showFirstAccessModal, setShowFirstAccessModal] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Rating Modal States
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [courseToRate, setCourseToRate] = useState<Course | null>(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  // Certificate Request Modal States
  const [showCertRequestModal, setShowCertRequestModal] = useState(false);
  const [selectedCertForRequest, setSelectedCertForRequest] = useState<Course | null>(null);
  const [requestType, setRequestType] = useState<'reenvio' | 'correcao' | 'outros'>('reenvio');
  const [requestDescription, setRequestDescription] = useState("");
  const [correctionName, setCorrectionName] = useState("");
  const [isSubmittingCertRequest, setIsSubmittingCertRequest] = useState(false);
  const [certRequestError, setCertRequestError] = useState('');
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loginError, setLoginError] = useState('');

  // Gamification Calc
  const xpPercentage = (BASE_MOCK_DATA.currentXp / BASE_MOCK_DATA.nextLevelXp) * 100;
  const pointsNeeded = BASE_MOCK_DATA.nextLevelXp - BASE_MOCK_DATA.currentXp;

  // Filtrar cursos favoritos reais
  const wishlistCourses = allCourses.filter(c => favorites.includes(c.id));

  // --- CERTIFICATE REQUEST LOGIC ---
  const handleOpenCertRequest = (course: Course) => {
    setSelectedCertForRequest(course);
    setRequestType('reenvio');
    setRequestDescription("");
    setCorrectionName(user?.name || "");
    setShowCertRequestModal(true);
  };

  const handleSubmitCertRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingCertRequest(true);
    setCertRequestError('');

    let finalReason = '';
    if (requestType === 'reenvio') finalReason = 'Solicitação de Reenvio (Perda/Não Recebimento)';
    else if (requestType === 'correcao') finalReason = `Correção de Nome para: ${correctionName}`;
    else finalReason = `Outros: ${requestDescription}`;

    try {
      await recordFormSubmission('certificate_request', {
        student: user?.name || 'Visitante',
        email: user?.email || null,
        course: selectedCertForRequest?.title || '',
        request_type: requestType,
        reason: finalReason,
      });

      alert(`Solicitação enviada com sucesso!\n\nMotivo: ${finalReason}\n\nNossa equipe analisará seu pedido em até 48h.`);
      setShowCertRequestModal(false);
    } catch (error) {
      console.error('Erro ao registrar solicitação de certificado', error);
      setCertRequestError('Não foi possível enviar agora. Tente novamente.');
    } finally {
      setIsSubmittingCertRequest(false);
    }
  };

  // Login Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (isRegistering) {
      // Cadastro: gravar na tabela students com senha
      if (!password || password.length < 4) {
        setLoginError('A senha deve ter pelo menos 4 caracteres.');
        return;
      }

      try {
        const newStudent = await createStudent({
          name: name.trim() || 'Novo Usuário',
          email: email.trim(),
          password: password.trim(),
          firstAccess: false, // Ele já criou a senha
          status: 'Ativo',
          source: 'self-service',
        });

        await recordFormSubmission('user_login', {
          mode: 'register',
          email: email.trim(),
          name: name.trim() || null,
        });

        setStudentId(newStudent.id);
        
        onLogin({
          name: newStudent.name,
          email: newStudent.email,
          avatar: BASE_MOCK_DATA.avatar,
        });
      } catch (error) {
        console.error('Erro ao cadastrar aluno', error);
        const supabaseErr = error as { code?: string; message?: string; details?: string };
        
        // Log detalhado para debug
        console.log('Erro detalhado:', {
          code: supabaseErr?.code,
          message: supabaseErr?.message,
          details: supabaseErr?.details,
          fullError: error
        });
        
        if (supabaseErr?.code === '23505') {
          setLoginError('Este e-mail já está cadastrado. Faça login com sua senha ou CPF.');
          setIsRegistering(false);
        } else if (supabaseErr?.message) {
          setLoginError(`Erro: ${supabaseErr.message}`);
        } else {
          setLoginError('Não foi possível concluir seu cadastro. Tente novamente.');
        }
      }
    } else {
      // Login: autenticar com senha ou CPF
      if (!password) {
        setLoginError('Digite sua senha ou CPF.');
        return;
      }

      try {
        console.log('🔐 Tentando autenticar:', {
          email: email.trim(),
          passwordLength: password.trim().length,
          passwordPreview: password.trim().substring(0, 3) + '...'
        });

        const student = await authenticateStudent(email.trim(), password.trim());

        console.log('🔐 Resultado da autenticação:', student ? 'Sucesso' : 'Falha - credenciais incorretas');

        if (!student) {
          setLoginError('E-mail ou senha incorretos.');
          return;
        }

        console.log('✅ Aluno autenticado:', {
          id: student.id,
          name: student.name,
          firstAccess: student.firstAccess
        });

        await recordFormSubmission('user_login', {
          mode: 'login',
          email: email.trim(),
          name: student.name,
        });

        // Se for primeiro acesso (senha = CPF), pedir para trocar
        if (student.firstAccess) {
          console.log('🔑 Primeiro acesso detectado - solicitando troca de senha');
          setStudentId(student.id);
          setShowFirstAccessModal(true);
          return;
        }

        // Login normal
        console.log('✅ Login normal - redirecionando para dashboard');
        setStudentId(student.id);
        
        onLogin({
          name: student.name,
          email: student.email,
          avatar: BASE_MOCK_DATA.avatar,
        });
      } catch (error) {
        console.error('❌ Erro ao autenticar aluno:', error);
        const authErr = error as { message?: string };
        setLoginError(authErr?.message || 'Erro ao fazer login. Tente novamente.');
      }
    }
  };

  const handleChangePassword = async () => {
    if (!studentId) return;

    if (!newPassword || newPassword.length < 4) {
      alert('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    setIsChangingPassword(true);

    try {
      await updatePassword(studentId, newPassword);
      setShowFirstAccessModal(false);
      
      // Logar automaticamente após trocar senha
      onLogin({
        name: name || 'Aluno',
        email: email,
        avatar: BASE_MOCK_DATA.avatar,
      });
    } catch (error) {
      console.error('Erro ao trocar senha', error);
      alert('Não foi possível trocar sua senha. Tente novamente.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const openRatingModal = (course: Course) => {
     setCourseToRate(course);
     setCurrentRating(0);
     setRatingComment("");
     setShowRatingModal(true);
  };

  const submitRating = () => {
    if (courseToRate && onRate) {
      onRate(courseToRate.id, currentRating);
      setShowRatingModal(false);
      setCourseToRate(null);
      alert("Avaliação enviada com sucesso! Obrigado.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex flex-col animate-in fade-in duration-500 font-quicksand">
        {/* Header Mobile */}
        <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-[#9A0000]">Acesso ao Portal</span>
        </div>

        <div className="flex-grow flex items-center justify-center p-4 md:p-8">
          <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            {/* Visual (Left Side) */}
            <div className="md:w-1/2 bg-[#9A0000] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#d20000] rounded-full blur-3xl translate-y-1/2 translate-x-1/4"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                  <User size={24} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                  {isRegistering ? "Junte-se à nossa comunidade" : "Bem-vindo de volta!"}
                </h1>
                <p className="text-red-100 text-lg leading-relaxed">
                  {isRegistering 
                    ? "Crie sua conta para acompanhar seu progresso, emitir certificados e receber ofertas exclusivas."
                    : "Acesse sua área do aluno para continuar seus estudos e baixar seus materiais."
                  }
                </p>
              </div>

              <div className="relative z-10 mt-12 space-y-4">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                   <Award className="text-[#fff304]" />
                   <span className="font-medium">Certificados reconhecidos</span>
                </div>
              </div>
            </div>

            {/* Form (Right Side) */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
               <div className="max-w-sm mx-auto w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {isRegistering ? "Criar Conta" : "Fazer Login"}
                </h2>
                <p className="text-gray-500 mb-8">
                  {isRegistering ? "Preencha os dados abaixo" : "Entre com suas credenciais"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {isRegistering && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 ml-1">Nome Completo</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400" 
                          placeholder="Seu nome" 
                          required={isRegistering}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1">E-mail</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400" 
                        placeholder="seu@email.com" 
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1">Senha</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400" 
                        placeholder="••••••••" 
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {!isRegistering && (
                    <div className="flex justify-end">
                      <button type="button" className="text-xs font-bold text-[#9A0000] hover:underline">
                        Esqueceu a senha?
                      </button>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full bg-[#9A0000] text-white font-bold py-4 rounded-xl hover:bg-[#7a0000] transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 group"
                  >
                    {isRegistering ? "Cadastrar" : "Entrar"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  {loginError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                      <AlertCircle size={16} />
                      {loginError}
                    </div>
                  )}
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-500 text-sm">
                    {isRegistering ? "Já tem uma conta?" : "Não tem uma conta?"}
                    <button 
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-[#9A0000] font-bold ml-1 hover:underline"
                    >
                      {isRegistering ? "Fazer Login" : "Cadastre-se"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FIRST ACCESS PASSWORD CHANGE MODAL
  if (showFirstAccessModal && studentId) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Primeiro Acesso</h2>
            <p className="text-gray-600 text-sm">
              Por segurança, crie uma nova senha para sua conta.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-2">Nova Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none"
                minLength={4}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-2">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite novamente"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none"
                minLength={4}
                required
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="w-full bg-[#9A0000] text-white font-bold py-4 rounded-xl hover:bg-[#7a0000] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Confirmar Nova Senha
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="min-h-screen bg-[#fcfaf8] font-quicksand pb-20">
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 lg:hidden">
                 <ArrowLeft size={20} />
               </button>
               <div className="flex flex-col">
                 <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Área do Aluno</span>
                 <span className="font-serif font-bold text-[#9A0000] text-xl leading-none">Minha Carreira</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-gray-800">{user.name}</span>
                <span className="text-xs text-[#d20000] bg-[#d20000]/10 px-2 py-0.5 rounded-full">{BASE_MOCK_DATA.level}</span>
              </div>
              <img src={user.avatar || BASE_MOCK_DATA.avatar} alt="Perfil" className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" />
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Student ID Card */}
            <div className="bg-gradient-to-br from-[#9A0000] to-[#7a0000] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group transition-transform hover:scale-[1.02] duration-300">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm p-1 border border-white/20 shadow-inner">
                  <img 
                    src={user.avatar || BASE_MOCK_DATA.avatar} 
                    alt="Foto do Aluno" 
                    className="w-full h-full object-cover rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm">
                    <QrCode size={40} className="text-[#9A0000]" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">Validar</span>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1 opacity-80">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Aluno Oficial</span>
                </div>
                <p className="font-bold text-xl tracking-wide mb-1 text-white text-shadow-sm truncate">{user.name}</p>
                <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-2">
                  <p className="text-xs font-mono text-red-100">ID: 8829-2026</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowIdCard(true);
                    }}
                    className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-lg backdrop-blur-sm transition-all shadow-sm group/btn"
                    title="Abrir Carteirinha Virtual"
                  >
                    <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* GAMIFICATION WIDGET */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2 relative z-10">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nível Atual</span>
                <div className="bg-[#fff304] p-1.5 rounded-lg text-[#9A0000]">
                  <Crown size={16} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#9A0000] font-serif mb-1 relative z-10">{BASE_MOCK_DATA.level}</h3>
              <p className="text-xs text-gray-500 mb-4 relative z-10">{BASE_MOCK_DATA.currentXp} Pontos de Doçura</p>
              
              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full mb-2 overflow-hidden relative z-10">
                <div 
                  className="h-full bg-gradient-to-r from-[#cd7f32] to-[#ffcc00] rounded-full transition-all duration-1000" 
                  style={{ width: `${xpPercentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400 text-center mb-4 relative z-10">
                Faltam <strong>{pointsNeeded} pts</strong> para o nível Prata
              </p>

              <div className="space-y-2 border-t border-gray-100 pt-3 relative z-10">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Próximas Conquistas</p>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Lock size={12} />
                  <span>Badge de Aluno Prata</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Lock size={12} />
                  <span>Prioridade na Agenda</span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('catalog')}
                className="w-full mt-4 bg-[#fcfaf8] border border-[#9A0000]/20 text-[#9A0000] text-xs font-bold py-2 rounded-lg hover:bg-[#9A0000] hover:text-white transition-all relative z-10 flex items-center justify-center gap-1"
              >
                <TrendingUp size={14} />
                Subir de Nível
              </button>

              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#fff304]/20 rounded-full blur-xl"></div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {[
                { id: 'courses', label: 'Meus Cursos', icon: BookOpen },
                { id: 'certificates', label: 'Certificados', icon: Award },
                { id: 'wishlist', label: 'Lista de Desejos', icon: Heart },
                { id: 'settings', label: 'Meus Dados', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 p-4 text-sm font-bold transition-all border-l-4 ${
                    activeTab === item.id 
                      ? 'border-[#9A0000] bg-red-50 text-[#9A0000]' 
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {activeTab === 'courses' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                
                {/* Banner de Incentivo */}
                <div className="bg-gradient-to-r from-[#fff304] to-[#ffeba0] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-yellow-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-full text-[#9A0000] shadow-sm">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#9A0000] text-lg leading-tight">Rumo ao Nível Prata!</h3>
                      <p className="text-sm text-yellow-800">Complete mais cursos, acumule XP e desbloqueie o nível <strong>Prata</strong> para ter prioridade na agenda!</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('catalog')}
                    className="bg-[#9A0000] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#7a0000] transition-colors shadow-lg shadow-red-900/10 whitespace-nowrap"
                  >
                    Ver Catálogo
                  </button>
                </div>

                <div className="flex justify-between items-end">
                   <h2 className="text-2xl font-bold text-gray-800 font-serif">Meus Cursos em Andamento</h2>
                </div>
                
                <div className="grid gap-6">
                  {BASE_MOCK_DATA.courses.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow relative overflow-hidden">
                      {item.completed && (
                        <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                          <CheckCircle2 size={12} /> Concluído (+200 XP)
                        </div>
                      )}
                      
                      <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 relative group">
                        <img src={item.course.image} alt={item.course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-[#9A0000] bg-red-50 px-2 py-1 rounded-md uppercase">{item.course.category}</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{item.course.title}</h3>
                          <p className="text-sm text-gray-500">Instrutor: {item.course.instructor}</p>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                            <span>Progresso</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${item.completed ? 'bg-green-500' : 'bg-[#9A0000]'}`} 
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-end">
                        <button 
                          onClick={() => {
                            if (item.completed) {
                              openRatingModal(item.course);
                            } else {
                              onNavigate('presencial'); 
                            }
                          }}
                          className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${
                            item.completed 
                              ? 'bg-white border-2 border-[#9A0000] text-[#9A0000] hover:bg-red-50' 
                              : 'bg-[#9A0000] text-white hover:bg-[#7a0000]'
                          }`}
                        >
                          {item.completed ? 'Avaliar' : 'Mais Cursos'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATES TAB - UPDATED WITH MODAL TRIGGER */}
            {activeTab === 'certificates' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-2xl font-bold text-gray-800 font-serif">Meus Certificados</h2>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {BASE_MOCK_DATA.courses.filter(c => c.completed).length > 0 ? (
                    BASE_MOCK_DATA.courses.filter(c => c.completed).map((item, idx) => (
                      <div key={idx} className="p-6 border-b border-gray-50 last:border-0 flex flex-col sm:flex-row items-center justify-between hover:bg-gray-50 transition-colors gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 flex-shrink-0">
                            <Award size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 leading-tight">{item.course.title}</h3>
                            <p className="text-sm text-gray-500">Concluído em: 15 Jan 2026</p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                          <button 
                            onClick={() => handleOpenCertRequest(item.course)}
                            className="flex items-center gap-2 text-gray-500 font-bold text-xs hover:text-[#9A0000] px-4 py-2 rounded-lg transition-colors border border-gray-200 hover:border-[#9A0000]"
                          >
                            <HelpCircle size={14} /> Problemas / 2ª Via
                          </button>
                          <button className="flex items-center gap-2 bg-[#9A0000] text-white font-bold text-sm hover:bg-[#7a0000] px-4 py-2 rounded-lg transition-colors shadow-sm">
                            <Download size={18} /> Baixar PDF
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-gray-500">
                      <Award size={48} className="mx-auto text-gray-300 mb-4" />
                      <p>Você ainda não possui certificados. Complete um curso para desbloquear.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'wishlist' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-2xl font-bold text-gray-800 font-serif">Lista de Desejos</h2>
                {wishlistCourses.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {wishlistCourses.map(course => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        onClick={(c) => onCourseClick && onCourseClick(c)}
                        isFavorite={true}
                        compact={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">Sua lista está vazia.</p>
                    <button 
                      onClick={() => onNavigate('catalog')}
                      className="text-[#9A0000] font-bold hover:underline"
                    >
                      Explorar Catálogo de Cursos
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
               <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                 <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Dados Pessoais</h2>
                 <form className="space-y-6 max-w-lg">
                    {/* ... (Mesmo código do form de settings) ... */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
                        <input type="text" defaultValue={user.name.split(' ')[0]} className="w-full mt-1 p-3 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-[#9A0000] border transition-all outline-none text-gray-800" />
                      </div>
                       <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Sobrenome</label>
                        <input type="text" defaultValue={user.name.split(' ').slice(1).join(' ') || ""} className="w-full mt-1 p-3 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-[#9A0000] border transition-all outline-none text-gray-800" />
                      </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Profissão</label>
                        <input type="text" defaultValue="Confeiteira" placeholder="Ex: Estudante, Boleira, Chef..." className="w-full mt-1 p-3 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-[#9A0000] border transition-all outline-none text-gray-800" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">E-mail</label>
                        <input type="email" defaultValue={user.email} className="w-full mt-1 p-3 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-[#9A0000] border transition-all outline-none text-gray-800" />
                    </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Telefone</label>
                        <input type="tel" defaultValue="(21) 99888-7766" className="w-full mt-1 p-3 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-[#9A0000] border transition-all outline-none text-gray-800" />
                    </div>
                    
                    <button type="button" className="px-6 py-3 bg-[#9A0000] text-white rounded-lg font-bold shadow-md hover:bg-[#7a0000] transition-colors">
                      Salvar Alterações
                    </button>
                 </form>

                 {/* Change Password Section */}
                 <div className="mt-12 pt-8 border-t border-gray-100">
                   <h2 className="text-xl font-bold text-gray-800 mb-6">Segurança</h2>
                   <div className="space-y-4">
                     <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Nova Senha</label>
                       <input 
                         type="password" 
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                         placeholder="Digite sua nova senha"
                         className="w-full mt-1 p-3 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-[#9A0000] border transition-all outline-none text-gray-800" 
                       />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Confirmar Nova Senha</label>
                       <input 
                         type="password" 
                         value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                         placeholder="Digite novamente"
                         className="w-full mt-1 p-3 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-[#9A0000] border transition-all outline-none text-gray-800" 
                       />
                     </div>
                     <button
                       onClick={() => {
                         if (!studentId) {
                           alert('Não foi possível identificar o aluno. Faça login novamente.');
                           return;
                         }
                         handleChangePassword();
                       }}
                       disabled={isChangingPassword || !newPassword || !confirmPassword}
                       className="px-6 py-3 bg-gray-800 text-white rounded-lg font-bold shadow-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                       {isChangingPassword ? (
                         <>
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                           Salvando...
                         </>
                       ) : (
                         <>
                           <Lock size={18} />
                           Alterar Senha
                         </>
                       )}
                     </button>
                   </div>
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* FULL SCREEN ID CARD MODAL */}
      {showIdCard && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowIdCard(false)}
        >
           <div className="relative max-w-sm w-full perspective-1000" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowIdCard(false)}
              className="absolute -top-12 right-0 md:-right-12 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all z-50"
            >
              <X size={32} />
            </button>
            <div className="bg-gradient-to-b from-[#9A0000] via-[#800000] to-[#500000] rounded-[2rem] p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden flex flex-col items-center h-[650px] animate-in zoom-in-95 duration-300 transform-gpu">
              {/* ... (ID Card Content) ... */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
              <div className="flex flex-col items-center mb-8 w-full relative z-10">
                <img src="https://i.imgur.com/l2VarrP.jpeg" alt="Logo" className="h-12 brightness-0 invert mb-2 opacity-90" />
                <div className="h-0.5 w-16 bg-[#fff304] rounded-full opacity-80"></div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] mt-2 text-red-200">Carteirinha Digital</span>
              </div>
              <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-b from-[#fff304] to-[#d20000] shadow-lg mb-6 relative z-10">
                <img 
                   src={user.avatar || BASE_MOCK_DATA.avatar} 
                   alt="Foto do Aluno" 
                   className="w-full h-full object-cover rounded-full border-4 border-[#600000]"
                />
                <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-[#600000] z-20" title="Ativo"></div>
              </div>
              <div className="text-center w-full mb-8 relative z-10">
                <h2 className="text-3xl font-bold font-serif mb-1">{user.name}</h2>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[#fff304] font-bold text-sm bg-black/20 inline-block px-4 py-1 rounded-full border border-white/10">
                    {BASE_MOCK_DATA.level}
                  </p>
                  <p className="text-[10px] text-red-200 opacity-80">{BASE_MOCK_DATA.currentXp} pts</p>
                </div>
                <div className="flex justify-center gap-6 mt-6 text-sm text-red-100/80">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Membro Desde</span>
                    <span className="font-mono">{BASE_MOCK_DATA.memberSince}</span>
                  </div>
                   <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Validade</span>
                    <span className="font-mono text-[#fff304]">{BASE_MOCK_DATA.validUntil}</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto bg-white p-4 rounded-xl shadow-lg relative z-10 w-full flex items-center justify-between gap-4">
                 <div className="flex-shrink-0">
                    <QrCode size={64} className="text-black" />
                 </div>
                 <div className="text-left flex-grow">
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Validação</p>
                   <p className="text-black font-mono font-bold text-lg leading-none">8829-2026</p>
                   <p className="text-[10px] text-gray-500 leading-tight mt-1">Apresente este código na loja para descontos.</p>
                 </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#d20000] via-[#fff304] to-[#9A0000]"></div>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button className="flex items-center gap-2 bg-white text-[#9A0000] px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
                <Share2 size={18} /> Compartilhar
              </button>
              <button className="flex items-center gap-2 bg-[#fff304] text-[#9A0000] px-6 py-3 rounded-full font-bold hover:bg-[#ffe504] transition-colors shadow-lg">
                <Download size={18} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RATING MODAL */}
      {showRatingModal && courseToRate && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl animate-in zoom-in-95 duration-300">
             <button 
               onClick={() => setShowRatingModal(false)}
               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
             >
               <X size={20} />
             </button>

             <div className="text-center mb-6">
               <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#d20000]">
                 <Star size={32} fill="#d20000" />
               </div>
               <h3 className="text-2xl font-bold font-serif text-[#9A0000]">Avalie sua experiência</h3>
               <p className="text-gray-500 mt-2 text-sm">{courseToRate.title}</p>
             </div>

             <div className="flex justify-center gap-2 mb-8">
               {[1, 2, 3, 4, 5].map((star) => (
                 <button
                   key={star}
                   onMouseEnter={() => setHoverRating(star)}
                   onMouseLeave={() => setHoverRating(0)}
                   onClick={() => setCurrentRating(star)}
                   className="p-1 transition-transform hover:scale-110 focus:outline-none"
                 >
                   <Star 
                     size={36} 
                     className={`${(hoverRating || currentRating) >= star ? 'text-[#fff304] fill-[#fff304]' : 'text-gray-300'} transition-colors duration-200`} 
                   />
                 </button>
               ))}
             </div>

             <textarea
               rows={3}
               placeholder="Conte-nos o que achou do curso (opcional)..."
               value={ratingComment}
               onChange={(e) => setRatingComment(e.target.value)}
               className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#9A0000] resize-none mb-6 text-gray-900"
             ></textarea>

             <button
               onClick={submitRating}
               disabled={currentRating === 0}
               className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg ${
                 currentRating > 0 
                   ? 'bg-[#9A0000] text-white hover:bg-[#7a0000] hover:-translate-y-1 shadow-red-200' 
                   : 'bg-gray-200 text-gray-400 cursor-not-allowed'
               }`}
             >
               Enviar Avaliação
             </button>
           </div>
        </div>
      )}

      {/* CERTIFICATE REQUEST MODAL */}
      {showCertRequestModal && selectedCertForRequest && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowCertRequestModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <HelpCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold font-serif text-[#9A0000]">Suporte de Certificado</h3>
              <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">
                Curso: <strong>{selectedCertForRequest.title}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitCertRequest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tipo de Solicitação</label>
                <div className="grid grid-cols-1 gap-2 mt-1">
                  {[
                    { id: 'reenvio', label: 'Reenvio de Arquivo', desc: 'Perdi o original / Não recebi' },
                    { id: 'correcao', label: 'Correção de Dados', desc: 'Nome ou curso incorreto' },
                    { id: 'outros', label: 'Outros Assuntos', desc: 'Descreva sua situação' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRequestType(option.id as any)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        requestType === option.id 
                          ? 'border-[#9A0000] bg-red-50' 
                          : 'border-gray-100 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className={`block font-bold text-sm ${requestType === option.id ? 'text-[#9A0000]' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                      <span className="text-xs text-gray-500">{option.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {requestType === 'correcao' && (
                <div className="animate-in slide-in-from-top-2 fade-in">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome Correto para Emissão</label>
                  <input 
                    type="text" 
                    value={correctionName}
                    onChange={(e) => setCorrectionName(e.target.value)}
                    className="w-full mt-1 p-3 bg-white border border-gray-300 rounded-xl focus:border-[#9A0000] outline-none text-gray-900 font-bold"
                    placeholder="Digite o nome completo corretamente"
                    required
                  />
                  <p className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> Verifique a grafia. A reemissão pode levar 48h.
                  </p>
                </div>
              )}

              {requestType === 'outros' && (
                <div className="animate-in slide-in-from-top-2 fade-in">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descrição do Problema</label>
                  <textarea 
                    rows={4}
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    className="w-full mt-1 p-3 bg-white border border-gray-300 rounded-xl focus:border-[#9A0000] outline-none text-gray-900 text-sm resize-none"
                    placeholder="Explique o que aconteceu para podermos ajudar..."
                    required
                  ></textarea>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmittingCertRequest}
                className="w-full bg-[#9A0000] text-white py-4 rounded-xl font-bold hover:bg-[#7a0000] transition-all shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {isSubmittingCertRequest ? 'Enviando...' : 'Enviar Solicitação'}
                {!isSubmittingCertRequest && <Send size={18} />}
              </button>
              {certRequestError && (
                <p className="text-center text-sm text-red-600 font-semibold">{certRequestError}</p>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
