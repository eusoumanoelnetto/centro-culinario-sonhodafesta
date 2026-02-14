
export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  instagram?: string; // Novo campo para o perfil do professor
  price: number;
  image: string;
  duration: string;
  rating: number;
  description?: string;
  level?: string;
  modules?: string[];
  selectedSeat?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: 'Curiosidades' | 'Dicas' | 'Culinária' | 'Confeitaria';
  image: string;
  date: string;
  author: string;
  readTime: string;
}

export interface Student {
  id: string;
  clientId: string;
  name: string;
  email: string;
  cpf?: string | null;
  whatsapp?: string | null;
  password?: string | null;
  firstAccess?: boolean | null;
  status?: string | null;
  course?: string | null;
  source?: 'admin' | 'self-service' | null;
  leadTag?: string | null;
  lastContact?: string | null;
  createdAt?: string | null;
}
