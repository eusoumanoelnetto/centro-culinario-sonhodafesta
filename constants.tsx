
import React from 'react';
import { Course, Category, Testimonial, BlogPost } from './types';
import { COURSE_DATA } from './courseData';

export const COLORS = {
  blue: '#9A0000',
  red: '#d20000',
  green: '#9d0b48',
  yellow: '#fff304',
};

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Confeitaria', icon: 'Cake' },
  { id: '2', name: 'Decorações', icon: 'PartyPopper' },
  { id: '3', name: 'Páscoa', icon: 'Egg' },
  { id: '4', name: 'Culinária', icon: 'ChefHat' },
];

export const COURSES: Course[] = COURSE_DATA;

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Carla Silveira',
    role: 'Confeiteira Profissional',
    content: 'A técnica de ganache que aprendi aqui salvou meu negócio. Hoje vendo bolos blindados com segurança!',
    avatar: 'https://instagram.fsdu11-1.fna.fbcdn.net/v/t51.82787-15/518990582_18512578453031655_6341722018039422047_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzY3NzYwMjE0MTY4MzYzMzQ4Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=PsosV1lJ_BkQ7kNvwH5ll7s&_nc_oc=AdmEhIB3gGVWtDS53tUo3cStEHo7ENKeVOkL8PCZ4Q40imqq03dXy_vYEQPfHtND5dbCkGZvq-23o1Zj7461uf4J&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsdu11-1.fna&_nc_gid=8UxaK6VSR2zMLUVPDsrueQ&oh=00_AfrVjwN4OfsYcDnWXFv-Svys22ksTlG7nn5oDJ_Cbq7JKQ&oe=69747BD7'
  },
  {
    id: '2',
    name: 'Roberto Nunes',
    role: 'Cake Designer',
    content: 'A imersão nos cursos presenciais é incrível. A estrutura da cozinha é de primeiro mundo.',
    avatar: 'https://i.imgur.com/rQIIMw5.jpeg'
  },
  {
    id: '3',
    name: 'Juliana Costa',
    role: 'Empreendedora',
    content: 'Comecei do zero com o curso de Salgados. Hoje sustento minha família com as encomendas!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '4',
    name: 'Marcos Paulo',
    role: 'Decorador de Festas',
    content: 'O curso de balões orgânicos abriu minha mente para novas possibilidades. Recomendo demais!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    role: 'Doceira',
    content: 'As aulas de Páscoa são um investimento certo. O retorno financeiro é garantido na época.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '6',
    name: 'Pedro Henrique',
    role: 'Chef de Cozinha',
    content: 'A didática dos professores é excelente. Mesmo com experiência, aprendi truques valiosos.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '7',
    name: 'Ana Clara',
    role: 'Iniciante',
    content: 'Fiz o curso de Bolos Caseiros e adorei. O ambiente é super acolhedor e profissional.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '8',
    name: 'Lucas Souza',
    role: 'Padeiro',
    content: 'O curso de panificação artesanal elevou o nível dos meus produtos. Clientes elogiam muito!',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '9',
    name: 'Beatriz Rocha',
    role: 'Confeiteira',
    content: 'Aprender sobre precificação foi essencial. Agora sei exatamente quanto cobrar pelos meus doces.',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '10',
    name: 'Ricardo Mendes',
    role: 'Buffet Infantil',
    content: 'Os salgadinhos fritos na hora fazem toda a diferença no meu buffet. Curso prático e direto.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '5 Segredos para o Chantininho Não Derreter no Verão',
    excerpt: 'Descubra os aditivos e técnicas de hidratação corretas para garantir que sua cobertura aguente o calor do Rio de Janeiro.',
    content: `
      <p>O chantininho é o queridinho da confeitaria brasileira, mas trabalhar com ele no calor intenso do Rio de Janeiro pode ser um verdadeiro pesadelo. Se você já sofreu com bolos derretendo na mesa do cliente, este artigo é para você.</p>
      
      <h3>1. A escolha dos ingredientes</h3>
      <p>Nem todo chantilly é igual. Para dias quentes, dê preferência a marcas que prometem maior estabilidade térmica. Além disso, o leite em pó deve ser integral e de boa qualidade, pois a gordura ajuda na estrutura.</p>

      <h3>2. Hidratação correta</h3>
      <p>Muitas confeiteiras erram ao hidratar o chantininho apenas com leite condensado. Em dias muito quentes, prefira hidratar com o próprio chantilly gelado ou água gelada. Isso mantém a temperatura da mistura baixa por mais tempo.</p>

      <h3>3. Pó de Merengue ou Glacê Real</h3>
      <p>Um segredo de ouro: adicione uma colher de sopa de pó de merengue ou glacê real na batida. Esses ingredientes agem como estabilizantes, criando uma estrutura mais rígida que resiste melhor ao calor sem alterar o sabor.</p>

      <h3>4. Temperatura da batedeira</h3>
      <p>Antes de bater, coloque o bowl da batedeira e o batedor no congelador por 15 minutos. O atrito gera calor, e começar com utensílios gelados ajuda a manter a temperatura ideal da emulsão.</p>

      <h3>5. Descanso na geladeira</h3>
      <p>Após cobrir o bolo, deixe-o na geladeira por pelo menos 2 horas antes de entregar. Isso faz com que a gordura do chantininho cristalize novamente, criando uma "casca" protetora.</p>
    `,
    category: 'Confeitaria',
    image: 'https://s01.video.glbimg.com/x720/14099536.jpg',
    date: '10 Out 2025',
    author: 'Chef Bia Mendes',
    readTime: '5 min'
  },
  {
    id: '3',
    title: 'Como Precificar seus Doces e Não Ter Prejuízo',
    excerpt: 'Planilha simples e dicas práticas para calcular custos variáveis, fixos e sua mão de obra na hora de vender.',
    content: `
      <p>Precificar é uma das maiores dificuldades de quem trabalha com confeitaria artesanal. Muitas vezes, multiplicamos o custo dos ingredientes por 3 e achamos que está tudo certo. Mas cuidado: essa conta pode estar te levando à falência.</p>

      <h3>Custos Variáveis vs. Custos Fixos</h3>
      <p>Primeiro, entenda a diferença. Custos variáveis são os ingredientes e embalagens (farinha, açúcar, caixa). Custos fixos são aqueles que você paga vendendo ou não (luz, água, internet, MEI).</p>

      <h3>O valor da sua hora</h3>
      <p>Você não trabalha de graça! Defina um salário para você e divida pelas horas trabalhadas no mês. Esse valor deve entrar no custo de cada doce produzido.</p>

      <h3>Margem de Lucro</h3>
      <p>O lucro não é o seu salário. O lucro é o dinheiro da empresa, para reinvestir em equipamentos ou criar um fundo de reserva. Recomendamos uma margem de 20% a 30% sobre o custo total.</p>
    `,
    category: 'Dicas',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    date: '28 Set 2025',
    author: 'Equipe Sonho',
    readTime: '8 min'
  },
  {
    id: '4',
    title: 'Tendências de Decoração Infantil para 2026',
    excerpt: 'O fim dos painéis sublimados? Veja o que está em alta no mercado de festas internacionais.',
    content: `
      <p>O mercado de festas é dinâmico e 2026 promete trazer uma volta ao lúdico e ao artesanal, deixando um pouco de lado as decorações super processadas.</p>

      <h3>1. O retorno do "Handmade"</h3>
      <p>Painéis pintados à mão, elementos em crochê e papelaria em camadas (scrapbook) estão super em alta. As mães buscam festas com "cara de criança", fugindo dos temas comerciais padronizados.</p>

      <h3>2. Paletas Terrosas e Naturais</h3>
      <p>Mesmo para temas infantis, as cores vibrantes estão dando lugar a tons pastéis terrosos: terracota, verde musgo, mostarda e bege. Isso cria um ambiente mais acolhedor e "instagramável".</p>

      <h3>3. Balões Orgânicos Desconstruídos</h3>
      <p>Os arcos de balões continuam, mas agora misturados com folhagens secas, flores naturais e tecidos fluidos. A ideia é que pareça uma nuvem ou uma onda orgânica, não apenas um arco redondo.</p>

      <h3>4. O Fim dos Painéis Sublimados?</h3>
      <p>Não é o fim, mas o uso excessivo está caindo. A tendência agora são painéis com texturas, treliças de madeira ou fundos de tecido liso com apliques 3D.</p>
    `,
    category: 'Curiosidades',
    image: 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?auto=format&fit=crop&q=80&w=800',
    date: '15 Set 2025',
    author: 'Daniel Lima',
    readTime: '6 min'
  },
  {
    id: '5',
    title: 'Salgadinhos de Festa: Fritar na Hora ou Congelar?',
    excerpt: 'Mitos e verdades sobre o congelamento de salgados e como manter a crocância na entrega.',
    content: `
      <p>Essa é a dúvida de ouro de quem trabalha com buffet: como entregar salgadinhos quentes e crocantes sem enlouquecer fritando tudo na hora da festa?</p>

      <h3>O segredo do congelamento cru</h3>
      <p>A melhor técnica é congelar o salgado empanado e cru. Isso mantém a estrutura da massa e o recheio íntegro. Congele em aberto numa assadeira e depois embale em sacos.</p>

      <h3>Fritar congelado?</h3>
      <p>Sim! O ideal é fritar o salgado ainda congelado (ou levemente descongelado por 10 min) em óleo bem quente (180ºC). Se descongelar totalmente, ele pode encharcar ou estourar.</p>

      <h3>Transporte</h3>
      <p>Se precisar fritar antes, use caixas de papelão com furos para ventilação. Caixas de isopor ou plástico fechadas criam vapor e deixam a coxinha murcha em minutos.</p>
    `,
    category: 'Culinária',
    image: 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&q=80&w=800',
    date: '10 Set 2025',
    author: 'Roberto Carlos',
    readTime: '5 min'
  }
];
