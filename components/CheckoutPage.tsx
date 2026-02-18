
import React, { useState } from 'react';
import { 
  CreditCard, Lock, User, Mail, Phone, FileText, CheckCircle2, 
  ShieldCheck, ArrowRight, MapPin, Calendar, Clock, AlertCircle 
} from 'lucide-react';
import { CartItem } from '../types';
import { recordFormSubmission } from '../services/formSubmissions';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onSuccess: () => void; // Função para limpar o carrinho após sucesso
  onBack: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, onRemoveItem, onSuccess, onBack }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [submissionError, setSubmissionError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    paymentMethod: 'credit_card'
  });

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');
    setStep('processing');

    const orderPayload = {
      customer: {
        name: formData.fullName.trim(),
        cpf: formData.cpf.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      },
      payment_method: formData.paymentMethod,
      total,
      items: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        seat: item.selectedSeat || null,
      })),
    };

    try {
      await recordFormSubmission('checkout', orderPayload);

      setTimeout(() => {
        setStep('success');
        setTimeout(() => onSuccess(), 8000);
      }, 2500);
    } catch (error) {
      console.error('Erro ao registrar pedido', error);
      setSubmissionError('Não foi possível finalizar o pedido. Tente novamente.');
      setStep('form');
    }
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-quicksand">
        <div className="w-16 h-16 border-4 border-[#9A0000] border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">Processando seu pedido...</h2>
        <p className="text-gray-500">Estamos te redirecionando para o ambiente seguro de pagamento.</p>
        <div className="mt-8 flex gap-4 opacity-50 grayscale">
           {/* Logos simulados de pagamento */}
           <div className="h-8 w-12 bg-gray-200 rounded"></div>
           <div className="h-8 w-12 bg-gray-200 rounded"></div>
           <div className="h-8 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center p-4 animate-in zoom-in duration-300 font-quicksand">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#9A0000]"></div>
          
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-[#9A0000] mb-2">Pedido Confirmado!</h2>
          <p className="text-gray-600 mb-8">
            Obrigado, <span className="font-bold text-gray-800">{formData.fullName.split(' ')[0]}</span>.<br/>
            Enviamos os detalhes do acesso para:<br/>
            <strong className="text-[#9A0000]">{formData.email}</strong>
          </p>
          
          <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200 text-left relative">
             <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r border-gray-200"></div>
             <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l border-gray-200"></div>
             
             <div className="flex justify-between mb-3 border-b border-dashed border-gray-300 pb-3">
               <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Protocolo</span>
               <span className="text-xs font-mono font-bold text-gray-800">#SDF-{Math.floor(Math.random() * 10000)}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Valor Total</span>
               <span className="text-xl font-bold text-[#9A0000]">R$ {total.toFixed(2).replace('.', ',')}</span>
             </div>
          </div>

          <button 
            onClick={onSuccess}
            className="w-full bg-[#9A0000] text-white py-4 rounded-xl font-bold hover:bg-[#7a0000] transition-colors shadow-lg shadow-red-100"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf8] pb-20 font-quicksand">
      
      {/* Header Simplificado para Checkout */}
      <div className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img src="https://i.imgur.com/l2VarrP.jpeg" alt="Logo" className="h-10 w-auto object-contain rounded-lg" />
             <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
             <span className="text-lg font-bold text-gray-700 hidden sm:block font-serif">Checkout Seguro</span>
          </div>
          <div className="flex items-center gap-2 text-green-700 text-xs font-bold bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
            <Lock size={14} /> Ambiente Criptografado
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <button onClick={onBack} className="text-gray-500 hover:text-[#9A0000] mb-6 flex items-center gap-2 font-bold text-sm transition-colors group">
          <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Voltar para compras
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Section 1: Student Data */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#9A0000]"></div>
              
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-[#9A0000] text-white flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="text-xl font-bold text-gray-800 font-serif">Dados do Aluno</h2>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6 flex gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Importante:</strong> Preencha com os dados de quem realizará o curso. O certificado será emitido com este nome.
                </p>
              </div>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase ml-1">Nome Completo</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        required
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nome para o certificado"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase ml-1">CPF</label>
                    <div className="relative">
                      <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        required
                        type="text" 
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        placeholder="000.000.000-00"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase ml-1">E-mail</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        required
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Para envio do acesso"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase ml-1">Celular / WhatsApp</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        required
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(21) 99999-9999"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] focus:ring-1 focus:ring-[#9A0000] outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </form>
              {submissionError && (
                <p className="text-sm text-red-600 font-semibold mt-4">{submissionError}</p>
              )}
            </div>

            {/* Section 2: Payment Method (Visual Only) */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 opacity-90 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-gray-200"></div>
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="text-xl font-bold text-gray-800 font-serif">Pagamento</h2>
              </div>
              
              <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="flex gap-4 mb-4 opacity-50 grayscale">
                   <div className="h-8 w-12 bg-gray-300 rounded"></div>
                   <div className="h-8 w-12 bg-gray-300 rounded"></div>
                   <div className="h-8 w-12 bg-gray-300 rounded"></div>
                </div>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Você será redirecionado para um ambiente seguro para concluir o pagamento via <strong>Cartão de Crédito</strong> ou <strong>PIX</strong> na próxima etapa.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 sticky top-28 overflow-hidden">
              <div className="bg-[#9A0000] p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                <h3 className="font-serif font-bold text-xl relative z-10 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#fff304]" />
                  Resumo do Pedido
                </h3>
              </div>
              
              <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto bg-gray-50/50">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <span className="text-[10px] font-bold text-[#9A0000] uppercase tracking-wider bg-[#9A0000]/5 px-1.5 py-0.5 rounded mb-1 inline-block">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-gray-800 text-sm leading-tight mb-2">{item.title}</h4>
                      
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#9A0000]" /> Data a confirmar</span>
                        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#9A0000]" /> Presencial/Online</span>
                        {item.selectedSeat && (
                          <span className="flex items-center gap-1.5 font-bold text-gray-700 bg-red-50 px-1 rounded w-fit">
                            Assento: {item.selectedSeat}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <span className="font-bold text-[#9A0000] text-sm">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                      <button 
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-[10px] text-gray-400 hover:text-red-500 hover:underline transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Section */}
              <div className="bg-white p-6 border-t border-gray-100 space-y-3 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal ({cartItems.length} itens)</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Taxa de Matrícula</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <div className="flex justify-between text-[#9A0000] font-bold text-2xl pt-4 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>

                <button 
                  type="submit"
                  form="checkout-form"
                  className="w-full bg-[#009240] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#007a35] transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 mt-6 group"
                >
                  Ir para Pagamento <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center justify-center gap-2 text-gray-400 mt-4 bg-gray-50 py-2 rounded-lg border border-gray-100">
                   <ShieldCheck size={14} />
                   <span className="text-[10px] uppercase font-bold tracking-wide">Compra 100% Segura e Garantida</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
