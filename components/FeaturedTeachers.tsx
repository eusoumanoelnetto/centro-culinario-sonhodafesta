import React, { useState } from 'react';
import { Instructor } from '../types';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_TEACHER_IMAGE } from '../constants';

interface FeaturedTeachersProps {
  teachers: Instructor[];
  onTeacherClick: (teacherName: string) => void;
  onViewAllClick: () => void;
}

const FeaturedTeachers: React.FC<FeaturedTeachersProps> = ({ 
  teachers, 
  onTeacherClick, 
  onViewAllClick 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 8;
  const maxIndex = Math.max(0, teachers.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + itemsPerPage));
  };

  const visibleTeachers = teachers.slice(currentIndex, currentIndex + itemsPerPage);

  if (teachers.length === 0) return null;

  return (
    <section className="py-12 bg-[#fcfaf8] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[#d20000] font-bold text-xs uppercase tracking-widest bg-[#d20000]/10 px-3 py-1 rounded-full">
            Nossos Especialistas
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#9A0000] mt-4">
            Aprenda com os melhores
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2">
            Conheça alguns dos nossos professores e descubra os cursos que eles oferecem.
          </p>
        </div>

        {/* Carrossel com setas */}
        <div className="relative flex items-center">
          {/* Seta esquerda */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute -left-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} className="text-[#9A0000]" />
            </button>
          )}

          {/* Cards em grid responsivo */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
            {visibleTeachers.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => onTeacherClick(teacher.name)}
                className="group cursor-pointer flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow mb-2">
                  <img
                    src={teacher.avatar || DEFAULT_TEACHER_IMAGE}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_TEACHER_IMAGE;
                    }}
                  />
                </div>
                <h3 className="font-bold text-[#9A0000] text-xs md:text-sm group-hover:underline">
                  {teacher.name}
                </h3>
                {/* Especialidade abaixo do nome */}
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{teacher.role}</p>
                <button className="mt-2 text-[#d20000] font-bold text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver cursos <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Seta direita */}
          {currentIndex < maxIndex && (
            <button
              onClick={handleNext}
              className="absolute -right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight size={24} className="text-[#9A0000]" />
            </button>
          )}
        </div>

        {/* Botão "Conheça todos" */}
        <div className="text-center mt-10">
          <button
            onClick={onViewAllClick}
            className="bg-white text-[#9A0000] px-6 py-2 rounded-full font-bold border border-[#9A0000] hover:bg-[#9A0000] hover:text-white transition-colors"
          >
            Conheça todos os professores
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTeachers;