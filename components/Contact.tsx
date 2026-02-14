
import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Clock, Send, ChevronDown, ChevronUp, ExternalLink, HelpCircle } from 'lucide-react';
import { recordFormSubmission } from '../services/formSubmissions';

interface ContactProps {
  onBack: () => void;
}

const STORES = [
  {
    id: 'caxias',
    name: 'Duque de Caxias',
    address: 'R. Dep. Ampliato Cabral, 66 - Centro',
    city: 'Duque de Caxias - RJ',
    zip: '25070-370',
    phone: '(21) 2671-1234',
    hours: 'Seg - Sex: 09h às 19h • Sáb: 09h às 14h',
    mapLink: 'https://goo.gl/maps/exampleCaxias'
  },
  {
    id: 'bangu',
    name: 'Bangu',
    address: 'R. Silva Cardoso, 154 - Sala 316',
    city: 'Rio de Janeiro - RJ',
    zip: '21810-031',
    phone: '(21) 3331-5678',
    hours: 'Seg - Sex: 09h às 19h • Sáb: 09h às 15h',
    mapLink: 'https://goo.gl/maps/exampleBangu'
  },
  {
    id: 'campogrande',
    name: 'Campo Grande',
    address: 'R. Barcelos Domingos, 40',
    city: 'Rio de Janeiro - RJ',
    zip: '23080-020',
    phone: '(21) 2413-9876',
    hours: 'Seg - Sex: 09h às 19h • Sáb: 09h às 15h',
    mapLink: 'https://goo.gl/maps/exampleCG'
  },
  {
    id: 'novaiguacu',
    name: 'Nova Iguaçu',
    address: 'Av. Gov. Amaral Peixoto, 427',
    city: 'Nova Iguaçu - RJ',
    zip: '26210-060',
    phone: '(21) 2667-4321',
    hours: 'Seg - Sex: 09h às 19h • Sáb: 09h às 14h',
    mapLink: 'https://goo.gl/maps/exampleNI'
  }
];

const FAQS = [
  {
    question: "Onde acontecem os cursos presenciais?",
    answer: "Nossos cursos presenciais ocorrem nas unidades de Duque de Caxias, Bangu e Campo Grande, em salas climatizadas e equipadas."
  },
  {
    question: "Posso comprar os materiais do curso na loja?",
    answer: "Sim! Todas as nossas unidades possuem loja completa. Alunos têm descontos especiais em produtos selecionados no dia do curso."
  },
  {
    question: "Vocês emitem certificado?",
    answer: "Sim, todos os nossos cursos (online e presenciais) oferecem certificado de conclusão reconhecido pelo mercado."
  }
];

const Contact: React.FC<ContactProps> = ({ onBack }) => {
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const handleFaqClick = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');
    setFormError('');

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get('name')?.toString().trim() || '',
      phone: data.get('phone')?.toString().trim() || '',
      email: data.get('email')?.toString().trim() || '',
      subject: data.get('subject')?.toString().trim() || '',
      message: data.get('message')?.toString().trim() || '',
      preferred_store: selectedStore?.id || null,
    };

    try {
      await recordFormSubmission('contact', payload);
      form.reset();
      setFormStatus('sent');
    } catch (error) {
      console.error('Erro ao enviar contato', error);
      setFormError('Não foi possível enviar a mensagem. Tente novamente em instantes.');
      setFormStatus('error');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-[#fcfaf8] pb-20 font-quicksand">
      
      {/* Header Sticky */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold text-[#9A0000]">Voltar para o site</span>
      </div>

      {/* Hero Section */}
      <div className="bg-[#9A0000] text-white pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-[#fff304]/20 rounded-full text-[#fff304] mb-6 backdrop-blur-sm border border-[#fff304]/30">
            <MessageCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Como podemos ajudar?</h1>
          <p className="text-red-100 text-lg max-w-2xl mx-auto font-light">
            Tire suas dúvidas sobre cursos, produtos ou parcerias. Nossa equipe está pronta para te atender.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        
        {/* Primary CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <a 
            href="https://wa.me/5521999999999" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-[#25D366] hover:-translate-y-2 transition-transform duration-300 group flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366] mb-4 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">WhatsApp</h3>
            <p className="text-gray-500 text-sm mb-6">Atendimento rápido para dúvidas sobre cursos e agendamentos.</p>
            <span className="text-[#25D366] font-bold text-sm flex items-center gap-2 border border-[#25D366] px-6 py-2 rounded-full group-hover:bg-[#25D366] group-hover:text-white transition-all">
              Chamar no Zap <ExternalLink size={16} />
            </span>
          </a>

          <a 
            href="tel:+5521990712742"
            className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-[#9A0000] hover:-translate-y-2 transition-transform duration-300 group flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-[#9A0000]/10 rounded-full flex items-center justify-center text-[#9A0000] mb-4 group-hover:bg-[#9A0000] group-hover:text-white transition-colors">
              <Phone size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Telefone</h3>
            <p className="text-gray-500 text-sm mb-6">Fale diretamente com nossa central de atendimento.</p>
            <span className="text-[#9A0000] font-bold text-sm flex items-center gap-2 border border-[#9A0000] px-6 py-2 rounded-full group-hover:bg-[#9A0000] group-hover:text-white transition-all">
              Ligar Agora
            </span>
          </a>

          <a 
            href="mailto:sonhodafestacursos@gmail.com"
            className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-[#d20000] hover:-translate-y-2 transition-transform duration-300 group flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-[#d20000]/10 rounded-full flex items-center justify-center text-[#d20000] mb-4 group-hover:bg-[#d20000] group-hover:text-white transition-colors">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">E-mail</h3>
            <p className="text-gray-500 text-sm mb-6">Para parcerias, sugestões ou assuntos administrativos.</p>
            <span className="text-[#d20000] font-bold text-sm flex items-center gap-2 border border-[#d20000] px-6 py-2 rounded-full group-hover:bg-[#d20000] group-hover:text-white transition-all">
              Enviar E-mail
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Store Locator */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-[#9A0000] flex items-center gap-2">
              <MapPin /> Nossas Lojas
            </h2>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex overflow-x-auto border-b border-gray-100 p-2 gap-2 hide-scrollbar">
                {STORES.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                      selectedStore.id === store.id 
                        ? 'bg-[#9A0000] text-white shadow-md' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {store.name}
                  </button>
                ))}
              </div>
              
              <div className="p-8 animate-in fade-in duration-300" key={selectedStore.id}>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedStore.name}</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-[#9A0000] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedStore.address}</p>
                      <p className="text-gray-500 text-sm">{selectedStore.city} • CEP {selectedStore.zip}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="text-[#9A0000] flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{selectedStore.hours}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-[#9A0000] flex-shrink-0" />
                    <p className="text-gray-600 font-medium">{selectedStore.phone}</p>
                  </div>
                </div>

                <button className="w-full bg-[#fff304] text-[#9A0000] py-4 rounded-xl font-bold hover:bg-[#ffe504] transition-colors shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2">
                  <ExternalLink size={20} />
                  Traçar Rota no GPS
                </button>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-[#9A0000] flex items-center gap-2 mb-4">
                <HelpCircle size={20} /> Perguntas Frequentes
              </h3>
              <div className="space-y-2">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => handleFaqClick(idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {faq.question}
                      {openFaqIndex === idx ? <ChevronUp size={18} className="text-[#9A0000]" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t border-gray-100 animate-in slide-in-from-top-2">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d20000]/5 rounded-bl-full -z-0"></div>
              
              <h2 className="text-2xl font-serif font-bold text-[#9A0000] mb-2 relative z-10">Envie uma mensagem</h2>
              <p className="text-gray-500 mb-8 relative z-10">Preencha o formulário abaixo e responderemos em até 24h.</p>

              {formStatus === 'sent' ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-in zoom-in">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-green-600" size={32} />
                  </div>
                  <h3 className="font-bold text-green-800 text-xl mb-2">Mensagem Enviada!</h3>
                  <p className="text-green-600">Obrigado pelo contato. Em breve nossa equipe retornará.</p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="mt-6 text-green-700 font-bold underline hover:text-green-800"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 ml-1">Seu Nome</label>
                      <input 
                        required
                        type="text" 
                        name="name"
                        placeholder="Nome completo"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 ml-1">Seu Telefone</label>
                      <input 
                        required
                        type="tel" 
                        name="phone"
                        placeholder="(21) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1">E-mail</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1">Assunto</label>
                    <select name="subject" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 appearance-none">
                      <option>Dúvidas sobre Cursos</option>
                      <option>Problemas com Pedido (Loja Virtual)</option>
                      <option>Quero ser Parceiro/Professor</option>
                      <option>Outros Assuntos</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1">Mensagem</label>
                    <textarea 
                      required
                      rows={4}
                      name="message"
                      placeholder="Como podemos ajudar?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] focus:outline-none transition-all bg-gray-50 focus:bg-white resize-none text-gray-900"
                    ></textarea>
                  </div>

                  {formStatus === 'error' && (
                    <p className="text-sm text-red-600 font-medium text-center">{formError}</p>
                  )}

                  <button 
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full bg-[#9A0000] text-white font-bold py-4 rounded-xl hover:bg-[#7a0000] transition-all shadow-lg shadow-red-900/10 flex items-center justify-center gap-2 group mt-2"
                  >
                    {formStatus === 'sending' ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        Enviar Mensagem <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
