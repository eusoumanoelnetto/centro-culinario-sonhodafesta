import React from 'react';
import { ArrowLeft, Instagram, ExternalLink, GraduationCap, Star } from 'lucide-react';
import { INSTRUCTORS } from '../constants';

interface TeachersProps {
  onBack: () => void;
  onViewCourses?: (instructorName: string) => void;
}

const Teachers: React.FC<TeachersProps> = ({ onBack, onViewCourses }) => {
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
        <div className="text-center mb-16">
          <span className="text-[#d20000] font-bold text-xs uppercase tracking-widest bg-[#d20000]/10 px-3 py-1 rounded-full">
            Nossa Equipe
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#9A0000] mt-4 mb-6">
            Conheça Nossos Professores
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Profissionais renomados e apaixonados por ensinar. Nossa equipe é formada por especialistas que vivem a confeitaria e o mercado de festas no dia a dia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {INSTRUCTORS.map((instructor) => (
            <div key={instructor.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img 
                  src={instructor.avatar} 
                  alt={instructor.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="font-bold text-xl font-serif">{instructor.name}</h3>
                  <p className="text-sm text-gray-200 opacity-90">{instructor.role}</p>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                  {instructor.bio}
                </p>
                
                <div className="space-y-3 mt-auto">
                  <a 
                    href={`https://instagram.com/${instructor.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-500 hover:text-[#d62976] transition-colors text-sm font-medium w-full justify-center p-2 rounded-lg hover:bg-pink-50"
                  >
                    <Instagram size={18} />
                    {instructor.instagram}
                  </a>
                  
                  <button 
                    onClick={onViewCourses ? () => onViewCourses(instructor.name) : undefined}
                    className="w-full bg-[#fff304] text-[#222] font-bold py-3 rounded-xl hover:bg-[#ffe600] transition-colors flex items-center justify-center gap-2 text-base shadow-sm border border-[#fff304] mt-2 disabled:opacity-60"
                    style={{ color: '#222', fontWeight: 700 }}
                    disabled={!onViewCourses}
                  >
                    <GraduationCap size={18} className="text-[#9A0000]" />
                    Ver Cursos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action - Become a Teacher */}
        <div className="mt-24 bg-[#9A0000] rounded-3xl p-8 md:p-16 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#fff304]">
              <Star size={32} fill="currentColor" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Você também ama ensinar?
            </h2>
            <p className="text-red-100 text-lg mb-8">
              Estamos sempre em busca de novos talentos para integrar nosso time. Se você tem uma técnica diferenciada e quer compartilhar seu conhecimento, venha fazer parte!
            </p>
            <button 
              onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('navigate-to', { detail: 'teacher-application' });
                window.dispatchEvent(event);
              }}
              className="bg-white text-[#9A0000] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center gap-2"
            >
              Quero ser Instrutor <ExternalLink size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Teachers;
