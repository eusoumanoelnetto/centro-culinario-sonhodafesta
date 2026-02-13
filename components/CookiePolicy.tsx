import React, { useEffect } from 'react';
import { ArrowLeft, Cookie, Settings, Info } from 'lucide-react';

interface CookiePolicyProps {
  onBack: () => void;
}

const CookiePolicy: React.FC<CookiePolicyProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 bg-[#fcfaf8] min-h-screen pb-20 font-quicksand">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold text-[#9A0000]">Voltar</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[#9A0000]/5 rounded-full text-[#9A0000] mb-4">
            <Cookie size={40} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#9A0000] mb-4">Política de Cookies</h1>
          <p className="text-gray-500">Vigência: 2026</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-8 text-gray-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3">1. O que são Cookies?</h2>
            <p>
              Cookies são pequenos arquivos de texto que são armazenados no seu computador ou dispositivo móvel quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3">2. Como utilizamos os Cookies</h2>
            <p>
              No site do <strong>Sonho da Festa</strong>, utilizamos cookies para melhorar sua experiência de navegação, entender como você interage com nosso conteúdo e personalizar anúncios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3">3. Categorias de Cookies</h2>
            <div className="space-y-4 mt-4">
              <div className="border-l-4 border-[#9A0000] pl-4 py-1">
                <h3 className="font-bold text-gray-900">Cookies Necessários</h3>
                <p className="text-sm">Essenciais para o funcionamento do site. Sem eles, serviços como "Carrinho de Compras" ou áreas de login não funcionam. Estes cookies não podem ser desativados em nossos sistemas.</p>
              </div>
              
              <div className="border-l-4 border-[#d20000] pl-4 py-1">
                <h3 className="font-bold text-gray-900">Cookies de Desempenho</h3>
                <p className="text-sm">Permitem-nos contar visitas e fontes de tráfego para que possamos medir e melhorar o desempenho do nosso site. Eles nos ajudam a saber quais páginas são as mais e menos populares.</p>
              </div>

              <div className="border-l-4 border-[#fff304] pl-4 py-1">
                <h3 className="font-bold text-gray-900">Cookies de Publicidade</h3>
                <p className="text-sm">Podem ser estabelecidos através do nosso site pelos nossos parceiros de publicidade. Podem ser usados por essas empresas para construir um perfil sobre os seus interesses e mostrar-lhe anúncios relevantes em outros sites.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3">4. Gerenciamento de Cookies</h2>
            <p>
              Você pode controlar e/ou excluir cookies conforme desejar. Você pode excluir todos os cookies que já estão no seu computador e pode configurar a maioria dos navegadores para impedir que eles sejam colocados. No entanto, se você fizer isso, talvez tenha que ajustar manualmente algumas preferências sempre que visitar um site e alguns serviços e funcionalidades podem não funcionar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3">5. Atualizações desta Política</h2>
            <p>
              Podemos atualizar nossa Política de Cookies periodicamente para refletir, por exemplo, mudanças nos cookies que usamos ou por outras razões operacionais, legais ou regulatórias. Por favor, revisite esta Política de Cookies regularmente para se manter informado sobre o uso de cookies e tecnologias relacionadas.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
             <p>Dúvidas? Entre em contato através do e-mail: <span className="font-bold text-[#9A0000]">privacidade@sonhodafesta.com.br</span></p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;