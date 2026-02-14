import type { Course } from './types'

type RawWorkshop = {
  id: string
  title: string
  date: string
  time: string
  instructor: string
  price: number
  loc: string
}

export const RAW_WORKSHOPS: RawWorkshop[] = [
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
]

export function getCategory(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('páscoa') || lower.includes('ovo') || lower.includes('chocolate') || lower.includes('colomba') || lower.includes('cenoura')) return 'Páscoa'
  if (lower.includes('balões') || lower.includes('arco') || lower.includes('festa')) return 'Decorações'
  if (lower.includes('pizza') || lower.includes('salgado') || lower.includes('pães') || lower.includes('pão') || lower.includes('torta salgada')) return 'Culinária'
  return 'Confeitaria'
}

export function getImage(title: string, category: string): string {
  if (title.toLowerCase().includes('balões')) return 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?auto=format&fit=crop&q=80&w=800'
  if (title.toLowerCase().includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  if (title.toLowerCase().includes('salgado')) return 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&q=80&w=800'

  switch (category) {
    case 'Páscoa':
      return 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800'
    case 'Decorações':
      return 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?auto=format&fit=crop&q=80&w=800'
    case 'Culinária':
      return 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&q=80&w=800'
    default:
      return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'
  }
}

const INSTRUCTOR_HANDLES: Record<string, string> = {
  'Claudia Thomaz': '@claudiathomaz_cake',
  'Alice Miralha': '@alicemiralha',
  'Ana Cristina': '@anacristinabolos',
  'Diana Machado': '@dianamachado.doces',
  'Luan Gomes': '@chefluangomes',
  'Kátia Lima': '@katialima.cakes',
  'Eli Rocha': '@elirocha.confeitaria',
  'Patricia Oliveira': '@patriciaoliveira_cake',
  'Adriana Balões': '@adrianabaloes',
  'Rogéria Balbino': '@rogeria.balbino',
  'Lucimar Gomes': '@lucimargomes.doces',
  'Wilson Brandão': '@wilsonbrandao_chef',
  'Leticia Oliveira': '@leticiaoliveira.confeitaria',
  'Quéren Hapuque': '@querenhapuque',
  'Alessandra Mauro': '@alessandramauro',
  'Nina Carvalho': '@ninacarvalho.doces',
  'Monica Ortega': '@monicaortega_biscoitos',
  'Giovanna Nogueira': '@giovannanogueira',
  'Rita Araújo': '@ritaaraujo.culinaria',
  'Andréa Vasconcellos': '@andreavasconcellos.gourmet',
  'Rose Gomes': '@rosegomes_bolos',
  'Naira de Luca': '@nairadeluca'
}

export function getInstructorHandle(name: string): string {
  return INSTRUCTOR_HANDLES[name] || '@sonhodafestacursos'
}

export function mapWorkshopToCourse(workshop: RawWorkshop): Course {
  const category = getCategory(workshop.title)
  return {
    id: workshop.id,
    title: workshop.title,
    category,
    instructor: workshop.instructor,
    instagram: getInstructorHandle(workshop.instructor),
    price: workshop.price,
    image: getImage(workshop.title, category),
    duration: '4h',
    rating: 5.0,
    level: 'Todos os Níveis',
    description: `Workshop presencial na unidade ${workshop.loc}. Data: ${workshop.date} às ${workshop.time}h. Aprenda na prática com nossos especialistas.`,
    modules: ['Apostila Inclusa', 'Degustação', 'Certificado', 'Aula Prática/Demonstrativa']
  }
}

export const COURSE_DATA: Course[] = RAW_WORKSHOPS.map(mapWorkshopToCourse)
