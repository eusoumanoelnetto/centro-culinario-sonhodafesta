export interface Instructor {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  instagram: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  instagram?: string; // Perfil do professor
  price: number;
  image?: string; // Mantido para compatibilidade (fallback)
  image_url?: string; // Novo campo, vem do banco
  duration: string;
  rating: number;
  description?: string;
  level?: string;
  modules?: string[];
  selectedSeat?: string;
  unit: string; // Unidade onde o curso será realizado
  date?: string; // Data do curso (YYYY-MM-DD)
  capacity?: number; // Capacidade de alunos
}

export type CartStatus = 'active' | 'removed' | 'purchased';

export interface CartItem extends Course {
  cartItemId: string;
  status: CartStatus;
  persisted?: boolean;
}

export interface CartHistoryEvent {
  id: string;
  cartItemId: string;
  courseId: string;
  action: 'added' | 'removed' | 'purchased';
  course: Course;
  timestamp: Date;
  status?: CartStatus;
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
  author: string;
  author_role?: string;
  author_bio?: string;
  category: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  created_at: string;
  readTime?: string;
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
  avatarUrl?: string | null;
  favorites?: string[] | null;
  createdAt?: string | null;
}