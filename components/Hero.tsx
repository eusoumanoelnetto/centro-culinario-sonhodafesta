
import React, { useState } from 'react';
import { ArrowRight, Star, X } from 'lucide-react';

interface HeroProps {
  onViewCatalog: () => void;
}

const Hero: React.FC<HeroProps> = ({ onViewCatalog }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="relative bg-[#fcfaf8] pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-5 text-center lg:text-left z-10 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9A0000]/5 border border-[#9A0000]/10 text-[#9A0000] text-xs font-bold tracking-wider uppercase mb-6">
              <Star size={12} className="fill-[#9A0000]" />
              Desde 1996
            </div>
            
            <h1 className="flex flex-col gap-1 mb-8">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#9A0000] tracking-tight leading-none">
                Transformando
              </span>
              <span className="font-pacifico text-[#d20000] text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Sonhos em Carreiras
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
              Transforme sua paixão por festas em uma carreira de sucesso. 
              Cursos profissionais de confeitaria e decorações com os maiores especialistas do mercado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onViewCatalog}
                className="px-8 py-4 bg-[#9A0000] text-white rounded-full font-bold hover:bg-[#7a0000] transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
              >
                Inscreva-se Agora <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Image Composition */}
          <div className="lg:col-span-7 mt-12 lg:mt-0 relative">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#fff304]/20 via-[#d20000]/5 to-[#9A0000]/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                <img
                  src="https://i.imgur.com/u7804Ci.jpeg"
                  onClick={() => setSelectedImage("https://i.imgur.com/u7804Ci.jpeg")}
                  className="rounded-2xl shadow-xl w-full h-64 object-cover hover:-translate-y-2 transition-transform duration-500 cursor-pointer hover:shadow-2xl"
                  alt="Bolo decorado"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={512}
                  height={256}
                />
                 <img
                  src="https://i.imgur.com/LidmkBE.jpeg"
                  onClick={() => setSelectedImage("https://i.imgur.com/LidmkBE.jpeg")}
                  className="rounded-2xl shadow-xl w-full h-48 object-cover hover:-translate-y-2 transition-transform duration-500 cursor-pointer hover:shadow-2xl"
                  alt="Confeitaria e Cupcakes"
                  loading="lazy"
                  decoding="async"
                  width={384}
                  height={192}
                />
              </div>
              <div className="space-y-4">
                <img
                  src="https://i.imgur.com/JXQmcIv.jpeg"
                  onClick={() => setSelectedImage("https://i.imgur.com/JXQmcIv.jpeg")}
                  className="rounded-2xl shadow-xl w-full h-48 object-cover hover:-translate-y-2 transition-transform duration-500 cursor-pointer hover:shadow-2xl"
                  alt="Baloes"
                  loading="lazy"
                  decoding="async"
                  width={384}
                  height={192}
                />
                <img
                  src="https://i.imgur.com/6l8k314.jpeg"
                  onClick={() => setSelectedImage("https://i.imgur.com/6l8k314.jpeg")}
                  className="rounded-2xl shadow-xl w-full h-64 object-cover hover:-translate-y-2 transition-transform duration-500 cursor-pointer hover:shadow-2xl"
                  alt="Especial de Natal Confeitaria"
                  loading="lazy"
                  decoding="async"
                  width={512}
                  height={256}
                />
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute bottom-10 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-w-xs animate-bounce-slow hidden sm:block pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="bg-[#9d0b48]/10 p-2 rounded-full text-[#9a0000]">
                  <Star className="fill-current" size={24} />
                </div>
                <div>
                  <p className="font-bold text-[#9A0000] text-lg">+327 Mil</p>
                  <p className="text-gray-500 text-xs">Alunos capacitados e certificados</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Image Modal Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full flex items-center justify-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 md:-right-8 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage} 
              alt="Visualização ampliada" 
              className="max-h-[85vh] max-w-full rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
