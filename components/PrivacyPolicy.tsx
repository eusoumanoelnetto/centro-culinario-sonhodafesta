
import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock, FileText, Mail } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#9A0000] mb-4">Política de Privacidade</h1>
          <p className="text-gray-500">Última atualização: Janeiro de 2026</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-8 text-gray-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3 flex items-center gap-2">
              1. Introdução
            </h2>
            <p>
              O <strong>Centro Culinário Sonho da Festa</strong> ("Nós") está comprometido com a proteção dos seus dados pessoais. 
              Esta Política de Privacidade foi elaborada em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong> e demais legislações aplicáveis vigentes em 2026.
              Ao utilizar nosso site e serviços, você concorda com as práticas descritas nesta política.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3 flex items-center gap-2">
              2. Coleta de Dados
            </h2>
            <p className="mb-2">Coletamos os seguintes tipos de informações para fornecer e melhorar nossos serviços:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Dados Pessoais:</strong> Nome completo, e-mail, número de telefone (WhatsApp) e endereço, fornecidos voluntariamente por você ao preencher formulários de interesse, inscrição em cursos ou cadastro na newsletter.</li>
              <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas e tempo de permanência, coletados automaticamente para fins analíticos e de segurança.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3 flex items-center gap-2">
              3. Finalidade do Tratamento
            </h2>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Processar inscrições em cursos presenciais e online.</li>
              <li>Enviar comunicações de marketing, ofertas exclusivas e cronogramas de cursos via WhatsApp ou E-mail (mediante seu consentimento).</li>
              <li>Melhorar a experiência do usuário em nosso site.</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3 flex items-center gap-2">
              4. Compartilhamento de Dados
            </h2>
            <p>
              Não vendemos seus dados pessoais. Podemos compartilhar informações com parceiros estritamente necessários para a operação do serviço (ex: plataformas de pagamento, ferramentas de automação de marketing), que também estão obrigados a cumprir a LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3 flex items-center gap-2">
              5. Seus Direitos (LGPD)
            </h2>
            <p>Como titular dos dados, você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Confirmar a existência de tratamento de dados.</li>
              <li>Acessar seus dados.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#9A0000] mb-3 flex items-center gap-2">
              6. Segurança
            </h2>
            <p>
              Adotamos medidas técnicas e administrativas de segurança aptas a proteger seus dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão.
            </p>
          </section>

          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-bold text-[#9A0000] mb-3 flex items-center gap-2">
              7. Encarregado de Dados (DPO)
            </h2>
            <p className="mb-4">
              Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato com nosso Encarregado de Proteção de Dados:
            </p>
            <div className="flex items-center gap-3 text-gray-700 font-medium">
              <Mail className="text-[#d20000]" />
              <span>privacidade@sonhodafesta.com.br</span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
