
import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Instagram, Send, CheckCircle2, Award, Users, Store } from 'lucide-react';
import { recordFormSubmission } from '../services/formSubmissions';

interface TeacherApplicationProps {
  onBack: () => void;
}

const TeacherApplication: React.FC<TeacherApplicationProps> = ({ onBack }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setApplicationError('');

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get('name')?.toString().trim() || '',
      instagram: data.get('instagram')?.toString().trim() || '',
      email: data.get('email')?.toString().trim() || '',
      phone: data.get('phone')?.toString().trim() || '',
      interest_area: data.get('interest')?.toString().trim() || '',
      experience: data.get('experience')?.toString().trim() || '',
    };

    try {
      await recordFormSubmission('teacher_application', payload);
      form.reset();
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Erro ao enviar candidatura', error);
      setApplicationError('Não foi possível enviar sua candidatura agora. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-[#fcfaf8] pb-20 font-quicksand">
      
      {/* Header Mobile/Sticky */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold text-[#9A0000]">Voltar</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        
        {isSubmitted ? (
          <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#9A0000] mb-4">Candidatura Enviada!</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Obrigado pelo interesse em fazer parte do time Sonho da Festa. Nossa equipe pedagógica analisará seu perfil e entrará em contato em breve.
            </p>
            <button 
              onClick={onBack}
              className="px-8 py-3 bg-[#9A0000] text-white rounded-xl font-bold hover:bg-[#7a0000] transition-colors"
            >
              Voltar para o Início
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: Pitch & Benefits */}
            <div className="space-y-8">
              <div>
                <span className="text-[#d20000] font-bold text-sm uppercase tracking-widest bg-[#d20000]/10 px-3 py-1 rounded-full">
                  Seja um Instrutor
                </span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#9A0000] mt-4 mb-6">
                  Compartilhe seu talento no maior Centro Culinário do Rio
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Estamos sempre em busca de profissionais apaixonados por confeitaria, decoração e festas. Se você tem uma técnica diferenciada e ama ensinar, seu lugar é aqui.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex gap-4 shadow-sm hover:border-[#9A0000]/30 transition-colors">
                  <div className="bg-[#fff304] w-12 h-12 rounded-xl flex items-center justify-center text-[#9A0000] flex-shrink-0">
                    <Store size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#9A0000] text-lg">Estrutura Completa</h3>
                    <p className="text-sm text-gray-500">Salas equipadas com fornos, batedeiras e utensílios profissionais em 7 unidades.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex gap-4 shadow-sm hover:border-[#9A0000]/30 transition-colors">
                  <div className="bg-[#d20000] w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#9A0000] text-lg">Visibilidade</h3>
                    <p className="text-sm text-gray-500">Divulgação do seu trabalho para nossa base de milhares de alunos e clientes.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex gap-4 shadow-sm hover:border-[#9A0000]/30 transition-colors">
                  <div className="bg-[#9d0b48] w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#9A0000] text-lg">Parceria Duradoura</h3>
                    <p className="text-sm text-gray-500">Modelo de parceria transparente e oportunidades de crescimento.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Application Form */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fff304]/20 rounded-bl-full -z-0"></div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-6 relative z-10">Ficha de Candidatura</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nome Completo</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        required
                        type="text"
                        name="name"
                        placeholder="Seu nome"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 ml-1">Instagram Profissional</label>
                    <div className="relative">
                      <Instagram size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        required
                        type="text"
                        name="instagram"
                        placeholder="@seuinsta"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 ml-1">E-mail</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        required
                        type="email"
                        name="email"
                        placeholder="seu@email.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 ml-1">WhatsApp</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        required
                        type="tel"
                        name="phone"
                        placeholder="(21) 99999-9999"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">Área de Interesse</label>
                  <select name="interest" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white appearance-none text-gray-900">
                    <option>Confeitaria (Bolos e Doces)</option>
                    <option>Salgados e Culinária Quente</option>
                    <option>Decorações de Festas</option>
                    <option>Panificação</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">Conte um pouco sobre sua experiência</label>
                  <textarea 
                    required
                    rows={4}
                    name="experience"
                    placeholder="Quais cursos você gostaria de ministrar? Há quanto tempo atua na área?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white resize-none text-gray-900"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#9A0000] text-white font-bold py-4 rounded-xl hover:bg-[#7a0000] transition-all shadow-lg shadow-red-900/10 flex items-center justify-center gap-2 group mt-2"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Enviar Candidatura <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {applicationError && (
                  <p className="text-center text-sm text-red-600 font-semibold">{applicationError}</p>
                )}
                
                <p className="text-center text-xs text-gray-400 mt-4">
                  Ao enviar, você concorda com nossa Política de Privacidade.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherApplication;
