import React, { useState, useEffect } from 'react';
import { ArrowLeft, Instagram, ExternalLink, GraduationCap, Star, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { DEFAULT_TEACHER_IMAGE } from '../constants';

interface TeachersProps {
  onBack: () => void;
  onViewCourses?: (instructorName: string) => void;
}

interface Teacher {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
  instagram?: string;
  avatar?: string;
}

const Teachers: React.FC<TeachersProps> = ({ onBack, onViewCourses }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Busca professores da tabela admin_teachers (fonte principal)
        const { data: teachersData, error: teachersError } = await supabase
          .from('admin_teachers')
          .select('*')
          .order('name');

        if (teachersError) throw teachersError;

        let uniqueTeachers: Teacher[] = [];

        if (teachersData && teachersData.length > 0) {
          // Se há dados na tabela, usa apenas eles (já são únicos por ID)
          uniqueTeachers = teachersData;
        } else {
          // Fallback: buscar instrutores únicos dos cursos
          const { data: coursesData, error: coursesError } = await supabase
            .from('admin_courses')
            .select('instructor, specialty, instagram')
            .not('instructor', 'is', null);

          if (coursesError) throw coursesError;

          // Agrupa por nome para evitar duplicatas
          const map = new Map<string, Teacher>();
          coursesData?.forEach((c: any) => {
            if (!map.has(c.instructor)) {
              map.set(c.instructor, {
                id: `course-${c.instructor}`,
                name: c.instructor,
                specialty: c.specialty || '',
                instagram: c.instagram || '',
                bio: `Especialista em ${c.specialty || 'confeitaria'}.`,
              });
            }
          });
          uniqueTeachers = Array.from(map.values());
        }

        console.log('Professores carregados (únicos):', uniqueTeachers);
        setTeachers(uniqueTeachers);
      } catch (err) {
        console.error('Erro ao carregar professores:', err);
        setError('Não foi possível carregar a lista de professores.');
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  const handleViewCourses = (instructorName: string) => {
    if (onViewCourses) {
      onViewCourses(instructorName);
    } else {
      const event = new CustomEvent('navigate-to', { 
        detail: { page: 'catalog', filter: { instructor: instructorName } } 
      });
      window.dispatchEvent(event);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8]">
        <Loader2 className="w-10 h-10 animate-spin text-[#9A0000]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#9A0000] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#7a0000]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Nenhum professor cadastrado ainda.</p>
          <button
            onClick={onBack}
            className="bg-[#9A0000] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#7a0000]"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

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
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img 
                  src={teacher.avatar || DEFAULT_TEACHER_IMAGE} 
                  alt={teacher.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_TEACHER_IMAGE;
                  }}
                />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="font-bold text-xl font-serif">{teacher.name}</h3>
                  <p className="text-sm text-gray-200 opacity-90">{teacher.specialty}</p>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                  {teacher.bio || `Especialista em ${teacher.specialty}.`}
                </p>
                
                <div className="space-y-3 mt-auto">
                  {teacher.instagram && (
                    <a 
                      href={`https://instagram.com/${teacher.instagram.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-500 hover:text-[#d62976] transition-colors text-sm font-medium w-full justify-center p-2 rounded-lg hover:bg-pink-50"
                    >
                      <Instagram size={18} />
                      {teacher.instagram}
                    </a>
                  )}
                  
                  <button 
                    onClick={() => handleViewCourses(teacher.name)}
                    className="w-full bg-[#fff304] text-[#222] font-bold py-3 rounded-xl hover:bg-[#ffe600] transition-colors flex items-center justify-center gap-2 text-base shadow-sm border border-[#fff304] mt-2"
                    style={{ color: '#222', fontWeight: 700 }}
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
              onClick={() => {
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