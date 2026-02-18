
import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }) => {
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className={`fixed inset-0 z-[70] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Overlay with Blur */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sidebar / Floating Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-full 
          md:w-[400px] md:h-[600px] md:max-h-[calc(100vh-2rem)] 
          md:top-4 md:right-4 
          bg-white shadow-2xl transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col md:rounded-2xl overflow-hidden border border-white/20 
          ${isOpen 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full md:translate-x-10 md:opacity-0 pointer-events-none'
          }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#9A0000]/10 p-2 rounded-lg text-[#9A0000]">
               <ShoppingBag size={20} />
            </div>
            <div>
               <h2 className="text-lg font-bold text-gray-800 leading-none">Seu Carrinho</h2>
               <p className="text-xs text-gray-500 mt-0.5">{cartItems.length} {cartItems.length === 1 ? 'curso selecionado' : 'cursos selecionados'}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto bg-gray-50/50 p-5 scroll-smooth custom-scrollbar">
          
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-gray-300" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-600">Seu carrinho está vazio</p>
                <p className="text-sm text-gray-400 max-w-[200px] mx-auto mt-2">Explore nossos cursos e transforme sua carreira.</p>
              </div>
              <button 
                onClick={onClose}
                className="px-6 py-2 border-2 border-[#9A0000] text-[#9A0000] rounded-full font-bold hover:bg-[#9A0000] hover:text-white transition-all text-sm"
              >
                Voltar para a loja
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-4 animate-in slide-in-from-right-4 duration-300 group hover:border-[#9A0000]/30 transition-colors relative overflow-hidden">
                  {/* Decorative bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#9A0000] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between py-0.5">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 pr-6">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{item.instructor}</p>
                      {item.selectedSeat && (
                        <p className="text-xs font-bold text-[#9A0000] mt-1 bg-red-50 inline-block px-1.5 py-0.5 rounded">
                          Assento: {item.selectedSeat}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-[#9A0000]">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onRemoveItem(item.cartItemId)}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
            <div className="flex justify-between items-end mb-6">
               <span className="text-sm text-gray-500">Total</span>
               <div className="text-right">
                  <span className="text-2xl font-bold text-[#9A0000] block leading-none">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-green-600 font-bold">
                    Em até 3x sem juros
                  </span>
               </div>
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              <button 
                onClick={onCheckout}
                className="w-full bg-[#d20000] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#b00000] transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Finalizar Compra <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              <button 
                onClick={onClose}
                className="w-full bg-white border border-[#9A0000]/30 text-[#9A0000] py-3 rounded-xl font-bold text-sm hover:bg-red-50 transition-all"
              >
                Continuar comprando
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
               <ShieldCheck size={12} className="text-green-500" />
               Compra 100% Segura
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
