
import React from 'react';
import { ArrowLeft, MapPin, Clock, Phone, Navigation, MessageCircle, Store, Wifi, Wind, Car, CheckCircle2 } from 'lucide-react';

interface UnitsProps {
  onBack: () => void;
}

const STORES = [
  {
    id: 'caxias',
    name: 'Duque de Caxias',
    image: 'https://i.imgur.com/u7804Ci.jpeg',
    address: 'R. Dep. Ampliato Cabral, 66 - Centro',
    city: 'Duque de Caxias - RJ',
    zip: '25070-370',
    phone: '(21) 2671-1234',
    hours: 'Seg - Sex: 09h às 19h • Sáb: 09h às 14h',
    features: ['Auditório para 40 alunos', 'Loja Completa', 'Sala Climatizada'],
    mapLink: 'https://goo.gl/maps/example'
  },
  {
    id: 'bangu',
    name: 'Bangu',
    image: 'https://i.imgur.com/LidmkBE.jpeg',
    address: 'R. Silva Cardoso, 154 - Sala 316',
    city: 'Rio de Janeiro - RJ',
    zip: '21810-031',
    phone: '(21) 3331-5678',
    hours: 'Seg - Sex: 09h às 19h • Sáb: 09h às 15h',
    features: ['Fácil Acesso (Trem)', 'Equipamentos Profissionais', 'Wi-Fi Grátis'],
    mapLink: 'https://goo.gl/maps/example'
  },
  {
    id: 'campogrande',
    name: 'Campo Grande',
    image: 'https://i.imgur.com/6l8k314.jpeg',
    address: 'R. Barcelos Domingos, 40',
    city: 'Rio de Janeiro - RJ',
    zip: '23080-020',
    phone: '(21) 2413-9876',
    hours: 'Seg - Sex: 09h às 19h • Sáb: 09h às 15h',
    features: ['Matriz', 'Maior variedade de produtos', 'Acessibilidade'],
    mapLink: 'https://goo.gl/maps/example'
  }
];

const Units: React.FC<UnitsProps> = ({ onBack }) => {
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
        <span className="font-bold text-[#9A0000]">Voltar para o Início</span>
      </div>

      {/* Hero Section */}
      <div className="bg-[#9A0000] text-white pt-16 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#d20000] rounded-full blur-3xl translate-y-1/2 translate-x-1/4"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-[#fff304]/20 rounded-full text-[#fff304] mb-6 backdrop-blur-sm border border-[#fff304]/30">
            <Store size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Nossas Unidades</h1>
          <p className="text-red-100 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Visite nossos Centros Culinários. Espaços pensados para você aprender, comprar e empreender.
          </p>
        </div>
      </div>

      {/* Stores List (Zig-Zag Layout) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 space-y-12 md:space-y-20">
        {STORES.map((store, index) => (
          <div 
            key={store.id} 
            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group transition-all hover:shadow-2xl`}
          >
            
            {/* Image Side - Fixed Absolute Positioning for Desktop consistency */}
            <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden flex-shrink-0">
              <img 
                src={store.image} 
                alt={`Loja ${store.name}`} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden"></div>
              <div className="absolute bottom-4 left-4 lg:hidden text-white relative z-10">
                <span className="font-bold text-2xl drop-shadow-md">{store.name}</span>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <div className="hidden lg:block mb-6">
                <span className="text-[#d20000] font-bold text-sm uppercase tracking-widest bg-[#d20000]/5 px-3 py-1 rounded-full">
                  Unidade {index + 1}
                </span>
                <h2 className="text-4xl font-serif font-bold text-gray-800 mt-3">{store.name}</h2>
              </div>

              {/* Info List */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#9A0000] flex-shrink-0 mt-1">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg leading-tight">{store.address}</p>
                    <p className="text-gray-500 text-sm mt-1">{store.city} - CEP {store.zip}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#9A0000] flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <p className="text-gray-600 font-medium">{store.hours}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#9A0000] flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <p className="text-gray-600 font-medium">{store.phone}</p>
                </div>
              </div>

              {/* Features Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {store.features.map((feature, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-bold border border-gray-100">
                    <CheckCircle2 size={14} className="text-[#9A0000]" /> {feature}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 bg-[#9A0000] hover:bg-[#7a0000] text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-100 group-hover:scale-[1.02]">
                  <Navigation size={18} /> Ver no Mapa
                </button>
                <button className="flex items-center justify-center gap-2 bg-white border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white py-3 rounded-xl font-bold transition-all">
                  <MessageCircle size={18} /> Chamar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-20 text-gray-500 text-sm pb-8">
        <p className="bg-white inline-block px-6 py-3 rounded-full shadow-sm border border-gray-100">
          Procurando cursos presenciais? <button onClick={onBack} className="text-[#9A0000] font-bold hover:underline ml-1">Veja a agenda completa</button>
        </p>
      </div>
    </div>
  );
};

export default Units;
