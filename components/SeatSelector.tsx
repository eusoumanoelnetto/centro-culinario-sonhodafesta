
import React, { useState } from 'react';
import { X, User, Monitor, CheckCircle2, MapPin } from 'lucide-react';
import { Course } from '../types';

interface SeatSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onConfirm: (course: Course, seat: string) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ isOpen, onClose, course, onConfirm }) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  if (!isOpen) return null;

  // Verifica a unidade baseada na descrição do curso
  const description = course.description?.toLowerCase() || '';
  const isBangu = description.includes('bangu');
  const isCampoGrande = description.includes('campo grande');
  const isCaxias = description.includes('caxias') || description.includes('duque de caxias');

  // Determina se é uma das unidades físicas com o padrão de 40 lugares
  const isPhysicalUnit = isBangu || isCampoGrande || isCaxias;

  // Define o nome da unidade para exibição
  let unitName = 'Centro Culinário';
  if (isBangu) unitName = 'Unidade Bangu';
  else if (isCampoGrande) unitName = 'Unidade Campo Grande';
  else if (isCaxias) unitName = 'Unidade Duque de Caxias';

  // Configuração das fileiras
  // Unidades Físicas: A até G (7 fileiras) | Outros: A até E (5 fileiras)
  const rows = isPhysicalUnit 
    ? ['A', 'B', 'C', 'D', 'E', 'F', 'G'] 
    : ['A', 'B', 'C', 'D', 'E'];

  const leftColIndices = [1, 2, 3];
  const rightColIndices = [4, 5, 6];

  // Função para gerar o ID do assento
  const getSeatLabel = (rowLetter: string, colIndex: number): string | null => {
    if (isPhysicalUnit) {
      // Unidades Físicas: Numeração contínua (Global) e SEM LETRA
      const rowIndex = rows.indexOf(rowLetter);
      const globalNumber = (rowIndex * 6) + colIndex;
      
      // Limite de 40 assentos para estas unidades
      if (globalNumber > 40) return null;
      
      // Retorna apenas o número como string (ex: "13" em vez de "C13")
      return `${globalNumber}`;
    } else {
      // Padrão genérico: Numeração reinicia por fileira com Letra (ex: "A1")
      return `${rowLetter}${colIndex}`;
    }
  };

  // Simular assentos ocupados
  const isOccupied = (seatId: string) => {
    const numericPart = parseInt(seatId.replace(/\D/g, '')) || 0;
    const charPart = seatId.charCodeAt(0);
    const hash = charPart + numericPart + parseInt(course.id);
    return hash % 5 === 0; // 20% de chance de estar ocupado
  };

  const handleSeatClick = (seatId: string) => {
    if (isOccupied(seatId)) return;
    setSelectedSeat(seatId === selectedSeat ? null : seatId);
  };

  const handleConfirm = () => {
    if (selectedSeat) {
      onConfirm(course, selectedSeat);
    }
  };

  const renderSeatButton = (row: string, col: number) => {
    const seatId = getSeatLabel(row, col);
    
    // Espaço vazio (ex: assentos > 40) - Mantém tamanho para grid ficar alinhado
    if (!seatId) {
      return <div key={`${row}-${col}-empty`} className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 invisible"></div>;
    }

    const occupied = isOccupied(seatId);
    const selected = selectedSeat === seatId;

    return (
      <button
        key={seatId}
        disabled={occupied}
        onClick={() => handleSeatClick(seatId)}
        className={`
          /* TAMANHOS DOS ASSENTOS */
          w-10 h-10               /* Mobile */
          md:w-16 md:h-16         /* Tablet/Laptop */
          lg:w-20 lg:h-20         /* Desktop Grande */
          
          rounded-lg md:rounded-xl lg:rounded-2xl
          flex items-center justify-center 
          
          /* TIPOGRAFIA */
          text-xs md:text-lg lg:text-xl font-bold 
          
          /* ESTILO E ANIMAÇÃO */
          transition-all duration-300 relative group border-2 
          ${occupied 
            ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed' 
            : selected 
              ? 'bg-[#9A0000] border-[#7a0000] text-white shadow-lg scale-105 z-10' 
              : 'bg-white border-[#9A0000] text-[#9A0000] hover:bg-[#9A0000] hover:text-white hover:shadow-md'}
        `}
      >
        {seatId}
        {occupied && <User size={24} className="absolute opacity-10 hidden md:block" />}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      
      {/* 
         CONTAINER PRINCIPAL
         - Mobile: w-full max-w-sm (Compacto)
         - Desktop: max-w-5xl (Bem largo para aproveitar a tela)
      */}
      <div className="bg-white w-full max-w-sm md:max-w-4xl lg:max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header - Com botão de fechar Absolute para evitar sobreposição */}
        <div className="bg-[#9A0000] px-6 py-5 text-white relative overflow-hidden shrink-0">
          <div className="relative z-10 pr-12"> {/* Padding right extra para não bater no botão */}
            <p className="text-red-200 text-xs font-bold uppercase tracking-wider mb-1">
              Escolha seu Lugar
            </p>
            <h2 className="text-lg md:text-2xl font-bold font-serif leading-tight mb-2 truncate">
              {course.title}
            </h2>
            <div className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-bold text-[#fff304] border border-white/10">
               <MapPin size={12} /> 
               {unitName}
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-20"
          >
            <X size={24} />
          </button>
          
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 md:gap-8 py-4 bg-gray-50 border-b border-gray-100 text-xs md:text-sm font-bold text-gray-500 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 md:w-6 md:h-6 rounded border-2 border-[#9A0000] bg-white"></div>
            <span>Livre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 md:w-6 md:h-6 rounded bg-gray-200 opacity-50"></div>
            <span>Ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 md:w-6 md:h-6 rounded bg-[#9A0000]"></div>
            <span>Selecionado</span>
          </div>
        </div>

        {/* Área dos Assentos - Scrollavel */}
        <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-white relative flex flex-col items-center">
          
          {/* Palco / Professor */}
          <div className="w-full max-w-xs md:max-w-3xl text-center mb-6 md:mb-10 shrink-0">
             <div className="flex flex-col items-center gap-2">
                <div className="w-full h-2 md:h-3 bg-gray-100 rounded-full shadow-inner mx-auto relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"></div>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Monitor size={20} className="hidden md:block" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Mesa do Professor / Telão</span>
                </div>
             </div>
          </div>

          {/* Grid de Assentos */}
          <div className="flex justify-center gap-4 md:gap-16 lg:gap-24 pb-4">
            {/* Coluna Esquerda */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-5">
              {rows.map(row => (
                leftColIndices.map(col => renderSeatButton(row, col))
              ))}
            </div>

            {/* Corredor Central */}
            <div className="w-6 md:w-16 lg:w-20 flex items-center justify-center relative">
               <div className="absolute inset-y-0 w-px border-l-2 border-dashed border-gray-100 left-1/2 -translate-x-1/2"></div>
               <span className="text-[10px] md:text-xs font-bold text-gray-300 -rotate-90 whitespace-nowrap bg-white py-2 absolute">
                  CORREDOR
               </span>
            </div>

            {/* Coluna Direita */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-5">
              {rows.map(row => (
                rightColIndices.map(col => renderSeatButton(row, col))
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-5 md:p-6 bg-white border-t border-gray-100 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] relative z-20 shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             
             {/* Resumo da Seleção */}
             <div className="flex justify-between w-full md:w-auto md:justify-start md:gap-12">
               <div>
                  <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Assento Escolhido</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#9A0000] text-white flex items-center justify-center font-bold text-sm md:text-lg">
                       {selectedSeat || '-'}
                    </div>
                    <span className="text-gray-400 text-sm hidden md:inline">
                      {selectedSeat ? 'Disponível' : 'Selecione no mapa'}
                    </span>
                  </div>
               </div>
               
               <div className="text-right md:text-left">
                  <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Valor Total</span>
                  <span className="text-2xl md:text-3xl font-bold text-gray-800 leading-none block">
                    R$ {course.price.toFixed(2).replace('.', ',')}
                  </span>
               </div>
             </div>
             
             {/* Botão de Ação */}
             <button 
                onClick={handleConfirm}
                disabled={!selectedSeat}
                className={`
                  w-full md:w-auto md:px-12 py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-3 transition-all
                  ${selectedSeat 
                    ? 'bg-[#d20000] text-white hover:bg-[#b00000] hover:-translate-y-1 shadow-xl shadow-red-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                `}
              >
                {selectedSeat ? (
                  <>Confirmar Reserva <CheckCircle2 size={24} /></>
                ) : (
                  'Selecione um assento'
                )}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
