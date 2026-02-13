
import React from 'react';
import { Course, Category, Testimonial, BlogPost } from './types';

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

// Dados Brutos dos Workshops (Copiados da agenda oficial)
const RAW_WORKSHOPS = [
  // --- BANGU ---
  { id: '101', title: "Prática com Arcólor: Pasta Americana", date: "02 Fev", time: "09:30", instructor: "Claudia Thomaz", price: 2.99, loc: "Bangu" },
  { id: '102', title: "Bolo no Pote: Lucre o Ano Todo", date: "03 Fev", time: "09:30", instructor: "Alice Miralha", price: 24.99, loc: "Bangu" },
  { id: '103', title: "Estrutura de Bolo de Andar (Rich's)", date: "04 Fev", time: "09:30", instructor: "Ana Cristina", price: 2.99, loc: "Bangu" },
  { id: '104', title: "Torta Chocolatuda para Delivery", date: "04 Fev", time: "14:00", instructor: "Diana Machado", price: 29.99, loc: "Bangu" },
  { id: '105', title: "Aulão de Pizzas: Encomendas e Delivery", date: "05 Fev", time: "09:30", instructor: "Luan Gomes", price: 29.99, loc: "Bangu" },
  { id: '106', title: "Aula de Bolo Matilda", date: "05 Fev", time: "14:00", instructor: "Kátia Lima", price: 29.99, loc: "Bangu" },
  { id: '107', title: "Ovos de Páscoa em Pé (Cacau Foods)", date: "06 Fev", time: "14:00", instructor: "Eli Rocha", price: 2.99, loc: "Bangu" },
  { id: '108', title: "Festival de Bolos Gelados", date: "09 Fev", time: "09:30", instructor: "Patricia Oliveira", price: 34.99, loc: "Bangu" },
  { id: '109', title: "Prática de Balões: Parede Orgânica", date: "10 Fev", time: "14:00", instructor: "Adriana Balões", price: 39.99, loc: "Bangu" },
  { id: '110', title: "Rocambole de Brownie", date: "11 Fev", time: "09:30", instructor: "Rogéria Balbino", price: 2.99, loc: "Bangu" },
  { id: '111', title: "Quindim & Fios de Ovos", date: "11 Fev", time: "14:00", instructor: "Lucimar Gomes", price: 24.99, loc: "Bangu" },
  { id: '112', title: "Tortas de Vitrine", date: "12 Fev", time: "14:00", instructor: "Wilson Brandão", price: 29.99, loc: "Bangu" },
  { id: '113', title: "Barras de Chocolate Recheadas (Páscoa)", date: "13 Fev", time: "09:30", instructor: "Leticia Oliveira", price: 24.99, loc: "Bangu" },
  { id: '114', title: "Aulão: Cenoura com Chocolate Gourmet", date: "13 Fev", time: "14:00", instructor: "Quéren Hapuque", price: 2.99, loc: "Bangu" },
  { id: '115', title: "Aula de Massas Folhadas (Bom Princípio)", date: "19 Fev", time: "09:30", instructor: "Alessandra Mauro", price: 2.99, loc: "Bangu" },
  { id: '116', title: "Ovos de Colher: Páscoa Lucrativa", date: "19 Fev", time: "14:00", instructor: "Nina Carvalho", price: 2.99, loc: "Bangu" },
  { id: '117', title: "Long Cake Vintage (Wilton)", date: "20 Fev", time: "14:00", instructor: "Quéren Hapuque", price: 2.99, loc: "Bangu" },
  { id: '118', title: "Colomba Pascal: Especial de Páscoa", date: "21 Fev", time: "09:30", instructor: "Luan Gomes", price: 24.99, loc: "Bangu" },
  { id: '119', title: "Pegue e Monte e Arco Delivery", date: "23 Fev", time: "09:30", instructor: "Adriana Balões", price: 44.99, loc: "Bangu" },
  { id: '120', title: "Biscoito Decorado para Páscoa", date: "23 Fev", time: "14:00", instructor: "Monica Ortega", price: 29.99, loc: "Bangu" },
  { id: '121', title: "Slice Gourmet (Mirtilos e Limão)", date: "24 Fev", time: "09:30", instructor: "Quéren Hapuque", price: 24.99, loc: "Bangu" },
  { id: '122', title: "Bem Casado Píngado", date: "24 Fev", time: "14:00", instructor: "Giovanna Nogueira", price: 19.99, loc: "Bangu" },
  { id: '123', title: "Iniciante em Ovos de Páscoa Recheados", date: "25 Fev", time: "10:00", instructor: "Rita Araújo", price: 2.99, loc: "Bangu" },
  { id: '124', title: "Ovos de Páscoa Salgados", date: "25 Fev", time: "14:00", instructor: "Rita Araújo", price: 2.99, loc: "Bangu" },
  { id: '125', title: "Aulão Tudo Sobre Brownie", date: "26 Fev", time: "09:30", instructor: "Patricia Oliveira", price: 34.99, loc: "Bangu" },
  { id: '126', title: "Sacolé e Sorvete Gourmet", date: "26 Fev", time: "14:00", instructor: "Andréa Vasconcellos", price: 34.99, loc: "Bangu" },
  { id: '127', title: "Aula de Pães Doces", date: "27 Fev", time: "09:30", instructor: "Wilson Brandão", price: 24.99, loc: "Bangu" },
  { id: '128', title: "Mini Bolos Vulcão", date: "28 Fev", time: "09:30", instructor: "Rose Gomes", price: 34.99, loc: "Bangu" },

  // --- CAMPO GRANDE ---
  { id: '201', title: "Quindim & Fios de Ovos", date: "02 Fev", time: "14:00", instructor: "Lucimar Gomes", price: 24.99, loc: "Campo Grande" },
  { id: '202', title: "Mini Bolos Vulcão", date: "03 Fev", time: "14:00", instructor: "Rose Gomes", price: 34.99, loc: "Campo Grande" },
  { id: '203', title: "Prática com Arcólor: Pasta Americana", date: "04 Fev", time: "09:30", instructor: "Claudia Thomaz", price: 2.99, loc: "Campo Grande" },
  { id: '204', title: "Ovos de Páscoa em Pé", date: "05 Fev", time: "14:00", instructor: "Eli Rocha", price: 2.99, loc: "Campo Grande" },
  { id: '205', title: "Confeitaria para Iniciantes", date: "06 Fev", time: "09:30", instructor: "Ana Cristina", price: 34.99, loc: "Campo Grande" },
  { id: '206', title: "Kit Festa na Caixa", date: "06 Fev", time: "14:00", instructor: "Rita Araújo", price: 29.99, loc: "Campo Grande" },
  { id: '207', title: "Bem Casado Píngado", date: "07 Fev", time: "09:30", instructor: "Giovanna Nogueira", price: 19.99, loc: "Campo Grande" },
  { id: '208', title: "Torta Chocolatuda", date: "09 Fev", time: "09:30", instructor: "Diana Machado", price: 29.99, loc: "Campo Grande" },
  { id: '209', title: "Barras de Chocolate Recheadas (Páscoa)", date: "09 Fev", time: "14:00", instructor: "Leticia Oliveira", price: 24.99, loc: "Campo Grande" },
  { id: '210', title: "Cookies Coloridos de Páscoa", date: "10 Fev", time: "10:00", instructor: "Quéren Hapuque", price: 2.99, loc: "Campo Grande" },
  { id: '211', title: "Bolo de Páscoa", date: "10 Fev", time: "14:00", instructor: "Quéren Hapuque", price: 2.99, loc: "Campo Grande" },
  { id: '212', title: "Long Cake Vintage", date: "11 Fev", time: "10:00", instructor: "Quéren Hapuque", price: 2.99, loc: "Campo Grande" },
  { id: '213', title: "Aula de Bolo Matilda", date: "11 Fev", time: "14:00", instructor: "Kátia Lima", price: 29.99, loc: "Campo Grande" },
  { id: '214', title: "Festival de Bolos Gelados", date: "12 Fev", time: "09:30", instructor: "Patricia Oliveira", price: 34.99, loc: "Campo Grande" },
  { id: '215', title: "Pegue e Monte e Arco Delivery", date: "12 Fev", time: "14:00", instructor: "Adriana Balões", price: 44.99, loc: "Campo Grande" },
  { id: '216', title: "Aula de Pães Doces", date: "13 Fev", time: "09:30", instructor: "Wilson Brandão", price: 24.99, loc: "Campo Grande" },
  { id: '217', title: "Tortas de Vitrine", date: "19 Fev", time: "14:00", instructor: "Wilson Brandão", price: 29.99, loc: "Campo Grande" },
  { id: '218', title: "Aulão de Pizzas", date: "20 Fev", time: "09:30", instructor: "Luan Gomes", price: 29.99, loc: "Campo Grande" },
  { id: '219', title: "Bolo no Pote", date: "23 Fev", time: "09:30", instructor: "Alice Miralha", price: 24.99, loc: "Campo Grande" },
  { id: '220', title: "Festival dos Salgados Fritos", date: "23 Fev", time: "14:00", instructor: "Alessandra Mauro", price: 29.99, loc: "Campo Grande" },
  { id: '221', title: "Aulão Tudo Sobre Brownie", date: "24 Fev", time: "09:30", instructor: "Patricia Oliveira", price: 34.99, loc: "Campo Grande" },
  { id: '222', title: "Sacolé e Sorvete Gourmet", date: "24 Fev", time: "14:00", instructor: "Andréa Vasconcellos", price: 34.99, loc: "Campo Grande" },
  { id: '223', title: "Rocambole de Brownie", date: "25 Fev", time: "09:30", instructor: "Rogéria Balbino", price: 2.99, loc: "Campo Grande" },
  { id: '224', title: "Biscoito Decorado para Páscoa", date: "25 Fev", time: "14:00", instructor: "Monica Ortega", price: 29.99, loc: "Campo Grande" },
  { id: '225', title: "Aula de Prática de Balões", date: "26 Fev", time: "09:30", instructor: "Adriana Balões", price: 39.99, loc: "Campo Grande" },
  { id: '226', title: "Ovos de Páscoa Salgados", date: "26 Fev", time: "14:00", instructor: "Rita Araújo", price: 29.99, loc: "Campo Grande" },
  { id: '227', title: "Aulão: Cenoura com Chocolate Gourmet", date: "27 Fev", time: "14:00", instructor: "Quéren Hapuque", price: 2.99, loc: "Campo Grande" },
  { id: '228', title: "Colomba Pascal: Especial de Páscoa", date: "28 Fev", time: "09:30", instructor: "Luan Gomes", price: 24.99, loc: "Campo Grande" },

  // --- DUQUE DE CAXIAS ---
  { id: '301', title: "Ovos de Páscoa em Pé", date: "02 Fev", time: "14:00", instructor: "Eli Rocha", price: 2.99, loc: "Duque de Caxias" },
  { id: '302', title: "Aulão: Cenoura com Chocolate Gourmet", date: "03 Fev", time: "09:30", instructor: "Quéren Hapuque", price: 2.99, loc: "Duque de Caxias" },
  { id: '303', title: "Long Cake Vintage", date: "03 Fev", time: "14:00", instructor: "Quéren Hapuque", price: 2.99, loc: "Duque de Caxias" },
  { id: '304', title: "Cookies Coloridos de Páscoa", date: "04 Fev", time: "09:30", instructor: "Quéren Hapuque", price: 2.99, loc: "Duque de Caxias" },
  { id: '305', title: "Bolo de Páscoa", date: "04 Fev", time: "14:00", instructor: "Quéren Hapuque", price: 2.99, loc: "Duque de Caxias" },
  { id: '306', title: "Aula de Prática de Balões (Parede Orgânica)", date: "05 Fev", time: "09:30", instructor: "Adriana Balões", price: 39.99, loc: "Duque de Caxias" },
  { id: '307', title: "Tortas de Vitrine", date: "06 Fev", time: "14:00", instructor: "Wilson Brandão", price: 29.99, loc: "Duque de Caxias" },
  { id: '308', title: "Prática com Arcólor: Pasta Americana", date: "07 Fev", time: "09:30", instructor: "Claudia Thomaz", price: 2.99, loc: "Duque de Caxias" },
  { id: '309', title: "Sacolé e Sorvete Gourmet", date: "09 Fev", time: "14:00", instructor: "Andréa Vasconcellos", price: 34.99, loc: "Duque de Caxias" },
  { id: '310', title: "Festival de Bolos Gelados", date: "10 Fev", time: "09:30", instructor: "Patricia Oliveira", price: 34.99, loc: "Duque de Caxias" },
  { id: '311', title: "Colomba Pascal: Especial de Páscoa", date: "10 Fev", time: "14:00", instructor: "Luan Gomes", price: 24.99, loc: "Duque de Caxias" },
  { id: '312', title: "Bolo no Pote", date: "11 Fev", time: "09:30", instructor: "Alice Miralha", price: 24.99, loc: "Duque de Caxias" },
  { id: '313', title: "Prática de Balões: Pegue e Monte e Arco Delivery", date: "11 Fev", time: "14:00", instructor: "Adriana Balões", price: 44.99, loc: "Duque de Caxias" },
  { id: '314', title: "Aula de Bolo Matilda", date: "12 Fev", time: "10:00", instructor: "Kátia Lima", price: 29.99, loc: "Duque de Caxias" },
  { id: '315', title: "Bem Casado Píngado", date: "13 Fev", time: "09:30", instructor: "Giovanna Nogueira", price: 19.99, loc: "Duque de Caxias" },
  { id: '316', title: "Torta Salgada - Massa 2 em 1", date: "19 Fev", time: "09:30", instructor: "Rogéria Balbino", price: 34.99, loc: "Duque de Caxias" },
  { id: '317', title: "Ovo de Coco Queimado", date: "19 Fev", time: "14:00", instructor: "Naira de Luca", price: 2.99, loc: "Duque de Caxias" },
  { id: '318', title: "Aula de Pães Doces", date: "20 Fev", time: "09:30", instructor: "Wilson Brandão", price: 24.99, loc: "Duque de Caxias" },
  { id: '319', title: "Mini Bolos Vulcão", date: "21 Fev", time: "09:30", instructor: "Rose Gomes", price: 34.99, loc: "Duque de Caxias" },
  { id: '320', title: "Aulão Tudo Sobre Brownie", date: "23 Fev", time: "09:30", instructor: "Patricia Oliveira", price: 34.99, loc: "Duque de Caxias" },
  { id: '321', title: "Quindim & Fios de Ovos", date: "23 Fev", time: "14:00", instructor: "Lucimar Gomes", price: 24.99, loc: "Duque de Caxias" },
  { id: '322', title: "Iniciante em Ovos de Páscoa Recheados", date: "24 Fev", time: "10:00", instructor: "Rita Araújo", price: 2.99, loc: "Duque de Caxias" },
  { id: '323', title: "Ovos de Páscoa Salgados", date: "24 Fev", time: "14:00", instructor: "Rita Araújo", price: 29.99, loc: "Duque de Caxias" },
  { id: '324', title: "Confeitaria para Iniciantes", date: "25 Fev", time: "09:30", instructor: "Ana Cristina", price: 34.99, loc: "Duque de Caxias" },
  { id: '325', title: "Aula Brigadeiros Coloridos", date: "25 Fev", time: "14:00", instructor: "Nina Carvalho", price: 24.99, loc: "Duque de Caxias" },
  { id: '326', title: "Biscoito Decorado para Páscoa", date: "26 Fev", time: "14:00", instructor: "Monica Ortega", price: 29.99, loc: "Duque de Caxias" },
  { id: '327', title: "Aulão de Pizzas: Encomendas e Delivery", date: "27 Fev", time: "09:30", instructor: "Luan Gomes", price: 29.99, loc: "Duque de Caxias" },
  { id: '328', title: "Festival dos Salgados Fritos", date: "27 Fev", time: "14:00", instructor: "Alessandra Mauro", price: 29.99, loc: "Duque de Caxias" },
  { id: '329', title: "Torta Chocolatuda", date: "28 Fev", time: "09:30", instructor: "Diana Machado", price: 29.99, loc: "Duque de Caxias" }
];

// Funções auxiliares para enriquecer os dados
function getCategory(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('páscoa') || lower.includes('ovo') || lower.includes('chocolate') || lower.includes('colomba') || lower.includes('cenoura')) return 'Páscoa';
  if (lower.includes('balões') || lower.includes('arco') || lower.includes('festa')) return 'Decorações';
  if (lower.includes('pizza') || lower.includes('salgado') || lower.includes('pães') || lower.includes('pão') || lower.includes('torta salgada')) return 'Culinária';
  return 'Confeitaria';
}

function getImage(title: string, category: string): string {
  // Imagens baseadas em keywords para variar o visual
  if (title.toLowerCase().includes('balões')) return 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?auto=format&fit=crop&q=80&w=800';
  if (title.toLowerCase().includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800';
  if (title.toLowerCase().includes('salgado')) return 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&q=80&w=800';
  
  switch(category) {
    case 'Páscoa': return 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800';
    case 'Decorações': return 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?auto=format&fit=crop&q=80&w=800';
    case 'Culinária': return 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&q=80&w=800';
    default: return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'; // Confeitaria
  }
}

// Simula a obtenção do Instagram do professor
function getInstructorHandle(name: string): string {
  const handles: Record<string, string> = {
    "Claudia Thomaz": "@claudiathomaz_cake",
    "Alice Miralha": "@alicemiralha",
    "Ana Cristina": "@anacristinabolos",
    "Diana Machado": "@dianamachado.doces",
    "Luan Gomes": "@chefluangomes",
    "Kátia Lima": "@katialima.cakes",
    "Eli Rocha": "@elirocha.confeitaria",
    "Patricia Oliveira": "@patriciaoliveira_cake",
    "Adriana Balões": "@adrianabaloes",
    "Rogéria Balbino": "@rogeria.balbino",
    "Lucimar Gomes": "@lucimargomes.doces",
    "Wilson Brandão": "@wilsonbrandao_chef",
    "Leticia Oliveira": "@leticiaoliveira.confeitaria",
    "Quéren Hapuque": "@querenhapuque",
    "Alessandra Mauro": "@alessandramauro",
    "Nina Carvalho": "@ninacarvalho.doces",
    "Monica Ortega": "@monicaortega_biscoitos",
    "Giovanna Nogueira": "@giovannanogueira",
    "Rita Araújo": "@ritaaraujo.culinaria",
    "Andréa Vasconcellos": "@andreavasconcellos.gourmet",
    "Rose Gomes": "@rosegomes_bolos",
    "Naira de Luca": "@nairadeluca"
  };
  return handles[name] || "@sonhodafestacursos";
}

// Transformar dados brutos em Course[]
export const COURSES: Course[] = RAW_WORKSHOPS.map(w => {
  const category = getCategory(w.title);
  return {
    id: w.id,
    title: w.title,
    category: category,
    instructor: w.instructor,
    instagram: getInstructorHandle(w.instructor),
    price: w.price,
    image: getImage(w.title, category),
    duration: '4h',
    rating: 5.0,
    level: 'Todos os Níveis',
    description: `Workshop presencial na unidade ${w.loc}. Data: ${w.date} às ${w.time}h. Aprenda na prática com nossos especialistas.`,
    modules: ['Apostila Inclusa', 'Degustação', 'Certificado', 'Aula Prática/Demonstrativa']
  };
});

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
