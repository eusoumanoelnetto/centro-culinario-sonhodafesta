
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
