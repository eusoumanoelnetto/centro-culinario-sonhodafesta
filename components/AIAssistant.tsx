
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, Phone, ArrowRight, Lock } from 'lucide-react';
import { getPartyAdvice } from '../services/gemini';
import { createLead } from '../services/leads';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  
  // Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');

  // Chat State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLeadCaptured]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;

    setLeadError('');
    setIsLeadSubmitting(true);

    try {
      await createLead({
        name: leadName.trim(),
        phone: leadPhone.trim(),
        source: 'ai_lead',
      });

      setIsLeadCaptured(true);
      setMessages([
        {
          role: 'bot',
          text: `Olá ${leadName.split(' ')[0]}! Sou a Nina, assistente da Sonho da Festa. Vi que você tem interesse em nossos cursos. Como posso te ajudar hoje?`,
        },
      ]);
    } catch (error) {
      console.error('Erro ao registrar lead da IA', error);
      setLeadError('Não foi possível iniciar agora. Tente novamente.');
    } finally {
      setIsLeadSubmitting(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Pass the user name to the AI for personalization
    const botResponse = await getPartyAdvice(userMsg, leadName);
    
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 font-quicksand">
      {isOpen ? (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-2xl shadow-2xl flex flex-col border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-[#9A0000] p-4 flex justify-between items-center text-white relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-[#fff304] p-2 rounded-full text-[#9A0000] shadow-sm">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">Dicas da Sonho</p>
                <p className="text-xs text-red-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#fff304] rounded-full animate-pulse"></span>
                  Online agora
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors relative z-10">
              <X size={20} />
            </button>
          </div>

          {/* Content Area */}
          {!isLeadCaptured ? (
            // LEAD FORM VIEW
            <div className="flex-grow bg-slate-50 p-6 flex flex-col justify-center relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d20000] via-[#fff304] to-[#9A0000]"></div>
               
               <div className="text-center mb-6">
                 <h3 className="text-[#9A0000] font-bold text-xl mb-2">Vamos conversar!</h3>
                 <p className="text-gray-500 text-sm">
                   Preencha seus dados para iniciar o atendimento personalizado com a Nina.
                 </p>
               </div>

               <form onSubmit={handleLeadSubmit} className="space-y-4">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-700 ml-1">Seu Nome</label>
                   <div className="relative">
                     <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                       type="text" 
                       required
                       value={leadName}
                       onChange={(e) => setLeadName(e.target.value)}
                       placeholder="Digite seu nome..."
                       className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400 bg-white"
                     />
                   </div>
                 </div>

                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-700 ml-1">Seu WhatsApp</label>
                   <div className="relative">
                     <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                       type="tel" 
                       required
                       value={leadPhone}
                       onChange={(e) => setLeadPhone(e.target.value)}
                       placeholder="(21) 99999-9999"
                       className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400 bg-white"
                     />
                   </div>
                 </div>

                 <button 
                   type="submit" 
                   className="w-full bg-[#d20000] hover:bg-[#b00000] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 group mt-2 disabled:opacity-60"
                   disabled={isLeadSubmitting}
                 >
                   {isLeadSubmitting ? 'Conectando...' : 'Iniciar Chat'}
                   {!isLeadSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                 </button>

                 {leadError && (
                   <p className="text-center text-xs text-red-600 font-semibold">{leadError}</p>
                 )}
               </form>

               <div className="mt-6 text-center">
                 <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                   <Lock size={10} /> Seus dados estão seguros conosco.
                 </p>
               </div>
            </div>
          ) : (
            // CHAT INTERFACE VIEW
            <>
              <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50 scroll-smooth">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-[#9A0000] text-white flex items-center justify-center text-xs font-bold mr-2 mt-1 flex-shrink-0">
                        N
                      </div>
                    )}
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-[#d20000] text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-gray-800 rounded-bl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                     <div className="w-6 h-6 rounded-full bg-[#9A0000] text-white flex items-center justify-center text-xs font-bold mr-2 mt-1 flex-shrink-0">
                        N
                      </div>
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center h-10">
                      <div className="w-1.5 h-1.5 bg-[#9A0000] rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-[#9A0000] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-[#9A0000] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-100">
                <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-1 focus-within:border-[#9A0000] focus-within:bg-white transition-all">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Digite sua dúvida..."
                    className="flex-grow bg-transparent px-3 py-2 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-[#9A0000] text-white p-2 rounded-full hover:bg-[#7a0000] disabled:opacity-50 disabled:hover:bg-[#9A0000] transition-colors shadow-sm flex items-center justify-center"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="text-center mt-2">
                   <span className="text-[10px] text-gray-400">A IA pode cometer erros. Verifique informações importantes.</span>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#9A0000] text-white p-4 rounded-full shadow-xl hover:bg-[#7a0000] hover:scale-105 transition-all flex items-center gap-3 group border-4 border-white animate-bounce-subtle"
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold px-0 group-hover:px-2 text-sm">
            Fale com a Nina
          </span>
          <div className="relative">
            <MessageCircle size={28} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#fff304] rounded-full border-2 border-[#9A0000]"></span>
          </div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
