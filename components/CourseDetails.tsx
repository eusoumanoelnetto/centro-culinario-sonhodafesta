
import React from 'react';
import { ArrowLeft, Clock, Star, CheckCircle2, User, PlayCircle, ShieldCheck, Award, Instagram } from 'lucide-react';
import { Course } from '../types';

interface CourseDetailsProps {
  course: Course;
  onBack: () => void;
  onAddToCart?: (course: Course) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onBack, onAddToCart }) => {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 bg-[#fcfaf8] pb-20">
      
      {/* Sticky Header for Mobile/Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold text-[#9A0000] truncate">{course.title}</span>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] lg:h-[500px] w-full">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#9A0000]/90 via-[#9A0000]/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 text-white">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block bg-[#d20000] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4">
              {course.category}
            </span>
            <h1 className="text-3xl lg:text-5xl font-serif font-bold mb-4 leading-tight">
              {course.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm lg:text-base text-gray-200">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#fff304]" />
                <span>Instrutor: <strong>{course.instructor}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#fff304]" />
                <span>Duração: <strong>{course.duration}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex text-[#fff304]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span>({course.rating} de 5.0)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-[#9A0000] mb-6">Sobre o Curso</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {course.description || "Este curso oferece uma imersão completa nas técnicas mais modernas do mercado. Aprenda com quem é referência e transforme sua carreira."}
              </p>
            </section>

            {/* What you'll learn */}
            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-[#9A0000] mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-[#9a0000]" />
                O que você vai aprender
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.modules ? (
                  course.modules.map((mod, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <PlayCircle size={20} className="text-[#d20000] mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{mod}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Cronograma detalhado disponível na área do aluno.</p>
                )}
              </div>
            </section>

            {/* Instructor */}
            <section>
               <h2 className="text-2xl font-serif font-bold text-[#9A0000] mb-6">Seu Instrutor</h2>
               <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-gray-100">
                 <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200" alt="Instrutor" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-[#9A0000]">{course.instructor}</h3>
                   {course.instagram && (
                     <a 
                       href={`https://instagram.com/${course.instagram.replace('@', '')}`}
                       target="_blank"
                       rel="noopener noreferrer" 
                       className="inline-flex items-center gap-1.5 text-sm text-[#9A0000] hover:text-[#d20000] font-bold bg-red-50 px-3 py-1 rounded-full mb-3 mt-1 transition-colors"
                     >
                       <Instagram size={14} /> {course.instagram}
                     </a>
                   )}
                   <p className="text-gray-500 text-sm mb-2">Especialista em {course.category}</p>
                   <p className="text-gray-600 italic">"Minha missão é ensinar técnicas reais que funcionam no dia a dia da confeitaria e decoração."</p>
                 </div>
               </div>
            </section>

          </div>

          {/* Sidebar / Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="text-center mb-6">
                  <span className="text-gray-400 line-through text-sm">De R$ {(course.price * 1.5).toFixed(2).replace('.', ',')}</span>
                  <div className="text-5xl font-bold text-[#9A0000] mt-2 mb-2">
                    R$ {course.price.toFixed(2).replace('.', ',')}
                  </div>
                  <span className="text-[#9a0000] text-sm font-bold bg-[#9d0b48]/10 px-3 py-1 rounded-full">
                    Economize 33% hoje
                  </span>
                </div>

                <button 
                  onClick={() => onAddToCart && onAddToCart(course)}
                  className="w-full bg-[#d20000] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#b00000] transition-all shadow-lg shadow-red-100 mb-4 transform hover:-translate-y-1"
                >
                  Matricular Agora
                </button>
                <button 
                  onClick={() => onAddToCart && onAddToCart(course)}
                  className="w-full bg-white text-[#9A0000] border-2 border-[#9A0000] py-3 rounded-xl font-bold hover:bg-[#fff0f0] transition-colors mb-6"
                >
                  Adicionar ao Carrinho
                </button>

                <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Award size={18} className="text-[#9A0000]" />
                    <span>Certificado de Conclusão</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock size={18} className="text-[#9A0000]" />
                    <span>Acesso Vitalício</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ShieldCheck size={18} className="text-[#9A0000]" />
                    <span>Garantia de 7 dias</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-[#fff304]/20 p-4 rounded-xl border border-[#fff304] text-center">
                <p className="text-[#9A0000] font-bold text-sm">Dúvidas? Fale com a Nina!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
