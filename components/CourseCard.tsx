import React from 'react';
import { Star, Clock, Heart, Instagram } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (course: Course) => void;
  compact?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, isFavorite = false, onToggleFavorite, compact = false }) => {
  return (
    <div 
      onClick={() => onClick(course)}
      className={`group bg-white rounded-xl overflow-hidden hover:shadow-[0_20px_50px_rgba(154,0,0,0.1)] transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer ${compact ? 'text-sm' : ''}`}
    >
      
      {/* Image Area */}
      <div className={`relative ${compact ? 'h-36' : 'h-36 md:h-60'} overflow-hidden`}>
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-2 left-2 md:top-3 md:left-3">
          <span className={`bg-white/95 backdrop-blur-sm ${compact ? 'px-2 py-0.5 text-[8px]' : 'px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px]'} font-bold uppercase tracking-widest text-[#9A0000] shadow-sm rounded-md`}>
            {course.category}
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(course);
          }}
          className={`absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-full transition-all transform hover:scale-110 shadow-sm ${
            isFavorite 
              ? 'bg-[#fff304] text-[#9A0000] opacity-100' 
              : 'bg-white/50 hover:bg-white text-[#9A0000] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
          }`}
        >
          <Heart size={compact ? 16 : 18} fill={isFavorite ? "#9A0000" : "none"} className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className={`${compact ? 'p-4' : 'p-3 md:p-6'} flex flex-col flex-grow`}>
        <div className={`flex items-center gap-2 ${compact ? 'mb-2' : 'mb-1 md:mb-3'}`}>
          <div className="flex text-[#fff304]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={compact ? 12 : 14} fill={i < Math.floor(course.rating) ? "currentColor" : "none"} className={`${i < Math.floor(course.rating) ? "" : "text-gray-300"} w-3 h-3 md:w-3.5 md:h-3.5`} />
            ))}
          </div>
          {!compact && <span className="text-[10px] md:text-xs text-gray-400 font-medium hidden sm:inline">({course.rating} avaliações)</span>}
        </div>

        <h3 className={`${compact ? 'text-sm mb-1' : 'text-sm md:text-xl mb-1 md:mb-2'} font-bold text-[#140002] leading-tight font-serif group-hover:text-[#9A0000] transition-colors line-clamp-2`}>
          {course.title}
        </h3>
        
        <div className={`text-gray-500 ${compact ? 'text-xs mb-2' : 'text-[10px] md:text-sm mb-2 md:mb-4'}`}>
          <span className="hidden md:inline">Por </span><span className="text-gray-700 font-medium">{course.instructor}</span>
          {course.instagram && !compact && (
            <a 
              href={`https://instagram.com/${course.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hidden md:flex text-[#9A0000] font-bold hover:underline text-xs mt-0.5 items-center gap-1 w-fit"
            >
              <Instagram size={10} /> {course.instagram}
            </a>
          )}
        </div>
        
        <div className={`text-gray-500 ${compact ? 'text-xs mb-2' : 'text-[10px] md:text-sm mb-2 md:mb-4'}`}>
          Unidade: <span className="text-gray-700 font-medium">{course.unit ? course.unit : 'Não informada'}</span>
        </div>
        
        <div className={`mt-auto ${compact ? 'pt-2' : 'pt-2 md:pt-4'} border-t border-gray-50 flex items-end justify-between`}>
          <div>
            {!compact && (
              <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 mb-1">
                <Clock size={12} /> {course.duration}
              </div>
            )}
            <div className={`${compact ? 'text-base' : 'text-lg md:text-2xl'} font-bold text-[#9A0000]`}>
              R$ {course.price.toFixed(2).replace('.', ',')}
            </div>
          </div>
          
          <button className={`${compact ? 'px-3 py-1.5 text-xs' : 'px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-sm'} bg-[#fcfaf8] text-[#9A0000] border border-[#9A0000]/20 rounded-lg font-bold hover:bg-[#9A0000] hover:text-white transition-all`}>
            {compact ? 'Ver' : 'Detalhes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
