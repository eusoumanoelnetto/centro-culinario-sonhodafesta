
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, BookOpen } from 'lucide-react';
import CourseCard from './CourseCard';
import { Course } from '../types';
import { CATEGORIES } from '../constants';

interface CatalogProps {
  onBack: () => void;
  onCourseClick: (course: Course) => void;
  initialCategory?: string;
  courses: Course[]; 
  favorites?: string[];
  onToggleFavorite?: (course: Course) => void;
}

const Catalog: React.FC<CatalogProps> = ({ 
  onBack, 
  onCourseClick, 
  initialCategory = 'Confeitaria', 
  courses,
  favorites = [],
  onToggleFavorite
}) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync state if initialCategory prop changes (e.g. via footer navigation while mounted)
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-[#fcfaf8] pb-20">
      
      {/* Header */}
      <div className="bg-[#9A0000] text-white pt-8 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-red-200 hover:text-white transition-colors mb-6 group"
          >
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <ArrowLeft size={20} />
            </div>
            <span className="font-bold text-sm">Voltar ao Início</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
             <BookOpen className="text-[#fff304]" size={28} />
             <span className="text-[#fff304] font-bold tracking-widest uppercase text-xs">Catálogo Oficial</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Escolha o seu próximo passo</h1>
          <p className="text-red-100 max-w-2xl text-lg font-light">
            Explore nossa lista completa de cursos online e presenciais. Filtre por categoria ou pesquise pelo seu instrutor favorito.
          </p>
        </div>
      </div>

      {/* Filters & Search - Floating Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <button
              onClick={() => setActiveCategory('Todos')}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === 'Todos' 
                  ? 'bg-[#9A0000] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.name 
                    ? 'bg-[#9A0000] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar curso ou chef..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9A0000] bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#9A0000] flex items-center gap-2">
            <Filter size={20} />
            {filteredCourses.length} {filteredCourses.length === 1 ? 'Curso encontrado' : 'Cursos encontrados'}
          </h2>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onClick={onCourseClick}
                isFavorite={favorites.includes(course.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
              <Search size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum curso encontrado</h3>
            <p className="text-gray-500">Tente mudar o termo de busca ou selecionar outra categoria.</p>
            <button 
              onClick={() => {setSearchTerm(''); setActiveCategory('Todos');}}
              className="mt-4 text-[#d20000] font-bold hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
