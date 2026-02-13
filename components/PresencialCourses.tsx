
import React, { useState } from 'react';
import { MapPin, Calendar, Users, ArrowRight, Clock, ShoppingBag, Award, ChevronRight, Store, FileText, Filter } from 'lucide-react';
import { Course } from '../types';

interface PresencialCoursesProps {
  onBack: () => void;
  onCourseClick: (course: Course) => void;
}

// Dados das Lojas
const LOCATIONS = [
  {
    id: 'caxias',
    name: 'Duque de Caxias',
    address: 'R. Dep. Ampliato Cabral, 66 - Centro, Duque de Caxias - RJ, 25070-370',
    description: 'Nossa maior loja na Baixada. Uma sala de aula com capacidade para 40 alunos e loja completa.',
    hours: 'Seg - Sex: 09h às 19h • Sáb: 09h às 14h',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3678.686888206138!2d-43.31057868503834!3d-22.77685998507856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997092892998af%3A0x6310232490d19641!2sDuque%20de%20Caxias%2C%20RJ!5e0!3m2!1spt-BR!2sbr!4v1647895000000!5m2!1spt-BR!2sbr',
    image: 'https://i.imgur.com/u7804Ci.jpeg' // Imagem do Bolo Rosa (da Hero)
  },
  {
    id: 'bangu',
    name: 'Bangu',
    address: 'Torre B - R. Silva Cardoso, 154 - Sala 316 - Bangu, Rio de Janeiro - RJ, 21810-031',
    description: 'Centro culinário para 40 alunos. Loja completa com fácil acesso pelo calçadão e pela estação de trem.',
    hours: 'Seg - Sex: 09h às 19h • Sáb: 09h às 15h',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3676.046888206085!2d-43.46567868503284!3d-22.87555998496039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9be128928998af%3A0x17d981329c31894!2sBangu%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1647895000000!5m2!1spt-BR!2sbr',
    image: 'https://i.imgur.com/LidmkBE.jpeg' // Imagem Confeitaria/Cupcakes (da Hero)
  },
  {
    id: 'campogrande',
    name: 'Campo Grande',
    address: 'R. Barcelos Domingos, 40 - Campo Grande, Rio de Janeiro - RJ, 23080-020',
    description: 'Nossa loja matriz. Auditório com capacidade para 40 alunos e loja completa. Possui fácil acesso pelo calçadão e pela estação de trem.',
    hours: 'Seg - Sex: 09h às 19h • Sáb: 09h às 15h',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.146888206085!2d-43.55867868503284!3d-22.90555998496039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9be168928998af%3A0x17d981329c31894!2sCampo%20Grande%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1647895000000!5m2!1spt-BR!2sbr',
    image: 'https://i.imgur.com/6l8k314.jpeg' // Imagem Especial Natal (da Hero)
  }
];

// Dados dos Workshops
const WORKSHOPS = [
  // --- BANGU FEVEREIRO ---
  {
    id: 101,
    locationId: 'bangu',
    title: "Prática com Arcólor: Pasta Americana",
    date: "02 Fev",
    time: "09:30",
    instructor: "Claudia Thomaz",
    spots: 8,
    price: 2.99
  },
  {
    id: 102,
    locationId: 'bangu',
    title: "Bolo no Pote: Lucre o Ano Todo",
    date: "03 Fev",
    time: "09:30",
    instructor: "Alice Miralha",
    spots: 15,
    price: 24.99
  },
  {
    id: 103,
    locationId: 'bangu',
    title: "Estrutura de Bolo de Andar (Rich's)",
    date: "04 Fev",
    time: "09:30",
    instructor: "Ana Cristina",
    spots: 20,
    price: 2.99
  },
  {
    id: 104,
    locationId: 'bangu',
    title: "Torta Chocolatuda para Delivery",
    date: "04 Fev",
    time: "14:00",
    instructor: "Diana Machado",
    spots: 12,
    price: 29.99
  },
  {
    id: 105,
    locationId: 'bangu',
    title: "Aulão de Pizzas: Encomendas e Delivery",
    date: "05 Fev",
    time: "09:30",
    instructor: "Luan Gomes",
    spots: 5,
    price: 29.99
  },
  {
    id: 106,
    locationId: 'bangu',
    title: "Aula de Bolo Matilda",
    date: "05 Fev",
    time: "14:00",
    instructor: "Kátia Lima",
    spots: 10,
    price: 29.99
  },
  {
    id: 107,
    locationId: 'bangu',
    title: "Ovos de Páscoa em Pé (Cacau Foods)",
    date: "06 Fev",
    time: "14:00",
    instructor: "Eli Rocha",
    spots: 25,
    price: 2.99
  },
  {
    id: 108,
    locationId: 'bangu',
    title: "Festival de Bolos Gelados",
    date: "09 Fev",
    time: "09:30",
    instructor: "Patricia Oliveira",
    spots: 8,
    price: 34.99
  },
  {
    id: 109,
    locationId: 'bangu',
    title: "Prática de Balões: Parede Orgânica",
    date: "10 Fev",
    time: "14:00",
    instructor: "Adriana Balões",
    spots: 6,
    price: 39.99
  },
  {
    id: 110,
    locationId: 'bangu',
    title: "Rocambole de Brownie",
    date: "11 Fev",
    time: "09:30",
    instructor: "Rogéria Balbino",
    spots: 12,
    price: 2.99
  },
  {
    id: 111,
    locationId: 'bangu',
    title: "Quindim & Fios de Ovos",
    date: "11 Fev",
    time: "14:00",
    instructor: "Lucimar Gomes",
    spots: 10,
    price: 24.99
  },
  {
    id: 112,
    locationId: 'bangu',
    title: "Tortas de Vitrine",
    date: "12 Fev",
    time: "14:00",
    instructor: "Wilson Brandão",
    spots: 15,
    price: 29.99
  },
  {
    id: 113,
    locationId: 'bangu',
    title: "Barras de Chocolate Recheadas (Páscoa)",
    date: "13 Fev",
    time: "09:30",
    instructor: "Leticia Oliveira",
    spots: 18,
    price: 24.99
  },
  {
    id: 114,
    locationId: 'bangu',
    title: "Aulão: Cenoura com Chocolate Gourmet (Maválerio)",
    date: "13 Fev",
    time: "14:00",
    instructor: "Quéren Hapuque",
    spots: 25,
    price: 2.99
  },
  {
    id: 115,
    locationId: 'bangu',
    title: "Aula de Massas Folhadas (Bom Princípio)",
    date: "19 Fev",
    time: "09:30",
    instructor: "Alessandra Mauro",
    spots: 20,
    price: 2.99
  },
  {
    id: 116,
    locationId: 'bangu',
    title: "Ovos de Colher: Páscoa Lucrativa (Iceberg Chef)",
    date: "19 Fev",
    time: "14:00",
    instructor: "Nina Carvalho",
    spots: 25,
    price: 2.99
  },
  {
    id: 117,
    locationId: 'bangu',
    title: "Long Cake Vintage (Wilton)",
    date: "20 Fev",
    time: "14:00",
    instructor: "Quéren Hapuque",
    spots: 15,
    price: 2.99
  },
  {
    id: 118,
    locationId: 'bangu',
    title: "Colomba Pascal: Especial de Páscoa",
    date: "21 Fev",
    time: "09:30",
    instructor: "Luan Gomes",
    spots: 8,
    price: 24.99
  },
  {
    id: 119,
    locationId: 'bangu',
    title: "Pegue e Monte e Arco Delivery",
    date: "23 Fev",
    time: "09:30",
    instructor: "Adriana Balões",
    spots: 5,
    price: 44.99
  },
  {
    id: 120,
    locationId: 'bangu',
    title: "Biscoito Decorado para Páscoa",
    date: "23 Fev",
    time: "14:00",
    instructor: "Monica Ortega",
    spots: 12,
    price: 29.99
  },
  {
    id: 121,
    locationId: 'bangu',
    title: "Slice Gourmet (Mirtilos e Limão Siciliano)",
    date: "24 Fev",
    time: "09:30",
    instructor: "Quéren Hapuque",
    spots: 10,
    price: 24.99
  },
  {
    id: 122,
    locationId: 'bangu',
    title: "Bem Casado Píngado",
    date: "24 Fev",
    time: "14:00",
    instructor: "Giovanna Nogueira",
    spots: 15,
    price: 19.99
  },
  {
    id: 123,
    locationId: 'bangu',
    title: "Iniciante em Ovos de Páscoa Recheados (BWB)",
    date: "25 Fev",
    time: "10:00",
    instructor: "Rita Araújo",
    spots: 25,
    price: 2.99
  },
  {
    id: 124,
    locationId: 'bangu',
    title: "Ovos de Páscoa Salgados (Empadão e Cremoso)",
    date: "25 Fev",
    time: "14:00",
    instructor: "Rita Araújo",
    spots: 10,
    price: 2.99
  },
  {
    id: 125,
    locationId: 'bangu',
    title: "Aulão Tudo Sobre Brownie",
    date: "26 Fev",
    time: "09:30",
    instructor: "Patricia Oliveira",
    spots: 8,
    price: 34.99
  },
  {
    id: 126,
    locationId: 'bangu',
    title: "Sacolé e Sorvete Gourmet",
    date: "26 Fev",
    time: "14:00",
    instructor: "Andréa Vasconcellos",
    spots: 12,
    price: 34.99
  },
  {
    id: 127,
    locationId: 'bangu',
    title: "Aula de Pães Doces",
    date: "27 Fev",
    time: "09:30",
    instructor: "Wilson Brandão",
    spots: 8,
    price: 24.99
  },
  {
    id: 128,
    locationId: 'bangu',
    title: "Mini Bolos Vulcão",
    date: "28 Fev",
    time: "09:30",
    instructor: "Rose Gomes",
    spots: 10,
    price: 34.99
  },

  // --- CAMPO GRANDE FEVEREIRO ---
  {
    id: 201,
    locationId: 'campogrande',
    title: "Quindim & Fios de Ovos",
    date: "02 Fev",
    time: "14:00",
    instructor: "Lucimar Gomes",
    spots: 20,
    price: 24.99
  },
  {
    id: 202,
    locationId: 'campogrande',
    title: "Mini Bolos Vulcão",
    date: "03 Fev",
    time: "14:00",
    instructor: "Rose Gomes",
    spots: 15,
    price: 34.99
  },
  {
    id: 203,
    locationId: 'campogrande',
    title: "Prática com Arcólor: Pasta Americana",
    date: "04 Fev",
    time: "09:30",
    instructor: "Claudia Thomaz",
    spots: 8,
    price: 2.99
  },
  {
    id: 204,
    locationId: 'campogrande',
    title: "Ovos de Páscoa em Pé",
    date: "05 Fev",
    time: "14:00",
    instructor: "Eli Rocha",
    spots: 25,
    price: 2.99
  },
  {
    id: 205,
    locationId: 'campogrande',
    title: "Confeitaria para Iniciantes",
    date: "06 Fev",
    time: "09:30",
    instructor: "Ana Cristina",
    spots: 12,
    price: 34.99
  },
  {
    id: 206,
    locationId: 'campogrande',
    title: "Kit Festa na Caixa",
    date: "06 Fev",
    time: "14:00",
    instructor: "Rita Araújo",
    spots: 15,
    price: 29.99
  },
  {
    id: 207,
    locationId: 'campogrande',
    title: "Bem Casado Píngado",
    date: "07 Fev",
    time: "09:30",
    instructor: "Giovanna Nogueira",
    spots: 18,
    price: 19.99
  },
  {
    id: 208,
    locationId: 'campogrande',
    title: "Torta Chocolatuda",
    date: "09 Fev",
    time: "09:30",
    instructor: "Diana Machado",
    spots: 20,
    price: 29.99
  },
  {
    id: 209,
    locationId: 'campogrande',
    title: "Barras de Chocolate Recheadas (Páscoa)",
    date: "09 Fev",
    time: "14:00",
    instructor: "Leticia Oliveira",
    spots: 25,
    price: 24.99
  },
  {
    id: 210,
    locationId: 'campogrande',
    title: "Cookies Coloridos de Páscoa",
    date: "10 Fev",
    time: "10:00",
    instructor: "Quéren Hapuque",
    spots: 20,
    price: 2.99
  },
  {
    id: 211,
    locationId: 'campogrande',
    title: "Bolo de Páscoa",
    date: "10 Fev",
    time: "14:00",
    instructor: "Quéren Hapuque",
    spots: 20,
    price: 2.99
  },
  {
    id: 212,
    locationId: 'campogrande',
    title: "Long Cake Vintage",
    date: "11 Fev",
    time: "10:00",
    instructor: "Quéren Hapuque",
    spots: 15,
    price: 2.99
  },
  {
    id: 213,
    locationId: 'campogrande',
    title: "Aula de Bolo Matilda",
    date: "11 Fev",
    time: "14:00",
    instructor: "Kátia Lima",
    spots: 12,
    price: 29.99
  },
  {
    id: 214,
    locationId: 'campogrande',
    title: "Festival de Bolos Gelados",
    date: "12 Fev",
    time: "09:30",
    instructor: "Patricia Oliveira",
    spots: 18,
    price: 34.99
  },
  {
    id: 215,
    locationId: 'campogrande',
    title: "Pegue e Monte e Arco Delivery",
    date: "12 Fev",
    time: "14:00",
    instructor: "Adriana Balões",
    spots: 10,
    price: 44.99
  },
  {
    id: 216,
    locationId: 'campogrande',
    title: "Aula de Pães Doces",
    date: "13 Fev",
    time: "09:30",
    instructor: "Wilson Brandão",
    spots: 15,
    price: 24.99
  },
  {
    id: 217,
    locationId: 'campogrande',
    title: "Tortas de Vitrine",
    date: "19 Fev",
    time: "14:00",
    instructor: "Wilson Brandão",
    spots: 15,
    price: 29.99
  },
  {
    id: 218,
    locationId: 'campogrande',
    title: "Aulão de Pizzas",
    date: "20 Fev",
    time: "09:30",
    instructor: "Luan Gomes",
    spots: 20,
    price: 29.99
  },
  {
    id: 219,
    locationId: 'campogrande',
    title: "Bolo no Pote",
    date: "23 Fev",
    time: "09:30",
    instructor: "Alice Miralha",
    spots: 18,
    price: 24.99
  },
  {
    id: 220,
    locationId: 'campogrande',
    title: "Festival dos Salgados Fritos",
    date: "23 Fev",
    time: "14:00",
    instructor: "Alessandra Mauro",
    spots: 20,
    price: 29.99
  },
  {
    id: 221,
    locationId: 'campogrande',
    title: "Aulão Tudo Sobre Brownie",
    date: "24 Fev",
    time: "09:30",
    instructor: "Patricia Oliveira",
    spots: 15,
    price: 34.99
  },
  {
    id: 222,
    locationId: 'campogrande',
    title: "Sacolé e Sorvete Gourmet",
    date: "24 Fev",
    time: "14:00",
    instructor: "Andréa Vasconcellos",
    spots: 15,
    price: 34.99
  },
  {
    id: 223,
    locationId: 'campogrande',
    title: "Rocambole de Brownie",
    date: "25 Fev",
    time: "09:30",
    instructor: "Rogéria Balbino",
    spots: 12,
    price: 2.99
  },
  {
    id: 224,
    locationId: 'campogrande',
    title: "Biscoito Decorado para Páscoa",
    date: "25 Fev",
    time: "14:00",
    instructor: "Monica Ortega",
    spots: 15,
    price: 29.99
  },
  {
    id: 225,
    locationId: 'campogrande',
    title: "Aula de Prática de Balões",
    date: "26 Fev",
    time: "09:30",
    instructor: "Adriana Balões",
    spots: 8,
    price: 39.99
  },
  {
    id: 226,
    locationId: 'campogrande',
    title: "Ovos de Páscoa Salgados",
    date: "26 Fev",
    time: "14:00",
    instructor: "Rita Araújo",
    spots: 15,
    price: 29.99
  },
  {
    id: 227,
    locationId: 'campogrande',
    title: "Aulão: Cenoura com Chocolate Gourmet",
    date: "27 Fev",
    time: "14:00",
    instructor: "Quéren Hapuque",
    spots: 20,
    price: 2.99
  },
  {
    id: 228,
    locationId: 'campogrande',
    title: "Colomba Pascal: Especial de Páscoa",
    date: "28 Fev",
    time: "09:30",
    instructor: "Luan Gomes",
    spots: 20,
    price: 24.99
  },

  // --- DUQUE DE CAXIAS FEVEREIRO ---
  {
    id: 301,
    locationId: 'caxias',
    title: "Ovos de Páscoa em Pé",
    date: "02 Fev",
    time: "14:00",
    instructor: "Eli Rocha",
    spots: 25,
    price: 2.99
  },
  {
    id: 302,
    locationId: 'caxias',
    title: "Aulão: Cenoura com Chocolate Gourmet",
    date: "03 Fev",
    time: "09:30",
    instructor: "Quéren Hapuque",
    spots: 25,
    price: 2.99
  },
  {
    id: 303,
    locationId: 'caxias',
    title: "Long Cake Vintage",
    date: "03 Fev",
    time: "14:00",
    instructor: "Quéren Hapuque",
    spots: 20,
    price: 2.99
  },
  {
    id: 304,
    locationId: 'caxias',
    title: "Cookies Coloridos de Páscoa",
    date: "04 Fev",
    time: "09:30",
    instructor: "Quéren Hapuque",
    spots: 25,
    price: 2.99
  },
  {
    id: 305,
    locationId: 'caxias',
    title: "Bolo de Páscoa",
    date: "04 Fev",
    time: "14:00",
    instructor: "Quéren Hapuque",
    spots: 25,
    price: 2.99
  },
  {
    id: 306,
    locationId: 'caxias',
    title: "Aula de Prática de Balões (Parede Orgânica)",
    date: "05 Fev",
    time: "09:30",
    instructor: "Adriana Balões",
    spots: 10,
    price: 39.99
  },
  {
    id: 307,
    locationId: 'caxias',
    title: "Tortas de Vitrine",
    date: "06 Fev",
    time: "14:00",
    instructor: "Wilson Brandão",
    spots: 15,
    price: 29.99
  },
  {
    id: 308,
    locationId: 'caxias',
    title: "Prática com Arcólor: Pasta Americana",
    date: "07 Fev",
    time: "09:30",
    instructor: "Claudia Thomaz",
    spots: 8,
    price: 2.99
  },
  {
    id: 309,
    locationId: 'caxias',
    title: "Sacolé e Sorvete Gourmet",
    date: "09 Fev",
    time: "14:00",
    instructor: "Andréa Vasconcellos",
    spots: 15,
    price: 34.99
  },
  {
    id: 310,
    locationId: 'caxias',
    title: "Festival de Bolos Gelados",
    date: "10 Fev",
    time: "09:30",
    instructor: "Patricia Oliveira",
    spots: 18,
    price: 34.99
  },
  {
    id: 311,
    locationId: 'caxias',
    title: "Colomba Pascal: Especial de Páscoa",
    date: "10 Fev",
    time: "14:00",
    instructor: "Luan Gomes",
    spots: 20,
    price: 24.99
  },
  {
    id: 312,
    locationId: 'caxias',
    title: "Bolo no Pote",
    date: "11 Fev",
    time: "09:30",
    instructor: "Alice Miralha",
    spots: 20,
    price: 24.99
  },
  {
    id: 313,
    locationId: 'caxias',
    title: "Prática de Balões: Pegue e Monte e Arco Delivery",
    date: "11 Fev",
    time: "14:00",
    instructor: "Adriana Balões",
    spots: 10,
    price: 44.99
  },
  {
    id: 314,
    locationId: 'caxias',
    title: "Aula de Bolo Matilda",
    date: "12 Fev",
    time: "10:00",
    instructor: "Kátia Lima",
    spots: 15,
    price: 29.99
  },
  {
    id: 315,
    locationId: 'caxias',
    title: "Bem Casado Píngado",
    date: "13 Fev",
    time: "09:30",
    instructor: "Giovanna Nogueira",
    spots: 20,
    price: 19.99
  },
  {
    id: 316,
    locationId: 'caxias',
    title: "Torta Salgada - Massa 2 em 1",
    date: "19 Fev",
    time: "09:30",
    instructor: "Rogéria Balbino",
    spots: 15,
    price: 34.99
  },
  {
    id: 317,
    locationId: 'caxias',
    title: "Ovo de Coco Queimado",
    date: "19 Fev",
    time: "14:00",
    instructor: "Naira de Luca",
    spots: 25,
    price: 2.99
  },
  {
    id: 318,
    locationId: 'caxias',
    title: "Aula de Pães Doces",
    date: "20 Fev",
    time: "09:30",
    instructor: "Wilson Brandão",
    spots: 15,
    price: 24.99
  },
  {
    id: 319,
    locationId: 'caxias',
    title: "Mini Bolos Vulcão",
    date: "21 Fev",
    time: "09:30",
    instructor: "Rose Gomes",
    spots: 15,
    price: 34.99
  },
  {
    id: 320,
    locationId: 'caxias',
    title: "Aulão Tudo Sobre Brownie",
    date: "23 Fev",
    time: "09:30",
    instructor: "Patricia Oliveira",
    spots: 18,
    price: 34.99
  },
  {
    id: 321,
    locationId: 'caxias',
    title: "Quindim & Fios de Ovos",
    date: "23 Fev",
    time: "14:00",
    instructor: "Lucimar Gomes",
    spots: 15,
    price: 24.99
  },
  {
    id: 322,
    locationId: 'caxias',
    title: "Iniciante em Ovos de Páscoa Recheados",
    date: "24 Fev",
    time: "10:00",
    instructor: "Rita Araújo",
    spots: 25,
    price: 2.99
  },
  {
    id: 323,
    locationId: 'caxias',
    title: "Ovos de Páscoa Salgados",
    date: "24 Fev",
    time: "14:00",
    instructor: "Rita Araújo",
    spots: 20,
    price: 29.99
  },
  {
    id: 324,
    locationId: 'caxias',
    title: "Confeitaria para Iniciantes",
    date: "25 Fev",
    time: "09:30",
    instructor: "Ana Cristina",
    spots: 12,
    price: 34.99
  },
  {
    id: 325,
    locationId: 'caxias',
    title: "Aula Brigadeiros Coloridos",
    date: "25 Fev",
    time: "14:00",
    instructor: "Nina Carvalho",
    spots: 20,
    price: 24.99
  },
  {
    id: 326,
    locationId: 'caxias',
    title: "Biscoito Decorado para Páscoa",
    date: "26 Fev",
    time: "14:00",
    instructor: "Monica Ortega",
    spots: 15,
    price: 29.99
  },
  {
    id: 327,
    locationId: 'caxias',
    title: "Aulão de Pizzas: Encomendas e Delivery",
    date: "27 Fev",
    time: "09:30",
    instructor: "Luan Gomes",
    spots: 20,
    price: 29.99
  },
  {
    id: 328,
    locationId: 'caxias',
    title: "Festival dos Salgados Fritos",
    date: "27 Fev",
    time: "14:00",
    instructor: "Alessandra Mauro",
    spots: 20,
    price: 29.99
  },
  {
    id: 329,
    locationId: 'caxias',
    title: "Torta Chocolatuda",
    date: "28 Fev",
    time: "09:30",
    instructor: "Diana Machado",
    spots: 20,
    price: 29.99
  }
];

const PresencialCourses: React.FC<PresencialCoursesProps> = ({ onBack, onCourseClick }) => {
  // Inicializar com Duque de Caxias selecionado
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]); 
  const [selectedMonth, setSelectedMonth] = useState('Fevereiro');

  const filteredWorkshops = WORKSHOPS.filter(w => {
    const isCorrectLocation = w.locationId === selectedLocation.id;
    const isCorrectMonth = w.date.includes(selectedMonth.substring(0, 3)); // "Fev" para Fevereiro, "Mar" para Março
    return isCorrectLocation && isCorrectMonth;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#fcfaf8]">
      
      {/* Hero Section */}
      <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={selectedLocation.image} 
            alt="Centro Culinário Sonho da Festa" 
            className="w-full h-full object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#9A0000]/95 via-[#9A0000]/80 to-[#9A0000]/40"></div>
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white">
          <div className="inline-flex items-center gap-2 bg-[#d20000] px-4 py-1.5 rounded-full w-fit mb-6 shadow-lg animate-fade-in">
            <Store size={16} className="text-white" />
            <span className="text-xs font-bold tracking-widest uppercase">Centro Culinário</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Cursos Presenciais</h1>
          <p className="text-lg md:text-xl text-red-100 max-w-2xl font-light leading-relaxed">
            Escolha a unidade mais próxima e venha aprender na prática.
            Cozinhas equipadas e professores renomados esperando por você.
          </p>
        </div>
      </div>

      {/* Location Selector - CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 md:p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left group ${
                selectedLocation.id === loc.id 
                  ? 'bg-[#9A0000] text-white shadow-lg scale-[1.02]' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedLocation.id === loc.id ? 'bg-[#fff304] text-[#9A0000]' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
              }`}>
                <MapPin size={20} />
              </div>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block mb-0.5 ${selectedLocation.id === loc.id ? 'text-red-200' : 'text-gray-400'}`}>
                  Unidade
                </span>
                <span className="font-bold text-lg leading-none">{loc.name}</span>
              </div>
              {selectedLocation.id === loc.id && (
                <ChevronRight className="ml-auto text-[#fff304]" size={20} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <ShoppingBag size={28} />, 
              title: "Material na Loja", 
              desc: "Encontre os materiais do curso com facilidade em nossa loja. Oferecemos aulas com preços super acessíveis (a partir de R$ 2,99) para impulsionar sua carreira." 
            },
            { 
              icon: <FileText size={28} />, 
              title: "Receita e Degustação", 
              desc: "A maioria das aulas inclui apostila e degustação (consulte a descrição específica de cada workshop)." 
            },
            { 
              icon: <Award size={28} />, 
              title: "Certificado", 
              desc: "Ao final da aula, você recebe seu certificado de participação reconhecido no mercado." 
            }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-[#9A0000]/20 transition-colors">
              <div className="text-[#d20000] bg-[#d20000]/5 p-3 rounded-lg flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-bold text-[#9A0000] mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-[#d20000]" />
                <span className="text-[#d20000] font-bold text-sm uppercase tracking-widest">{selectedLocation.name}</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#9A0000]">Agenda da Unidade</h2>
            </div>
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-1">
             <div className="flex gap-2">
               {['Fevereiro', 'Março'].map((month) => (
                 <button
                   key={month}
                   onClick={() => setSelectedMonth(month)}
                   className={`px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all border-b-2 ${
                     selectedMonth === month 
                       ? 'text-[#9A0000] border-[#9A0000] bg-red-50' 
                       : 'text-gray-500 border-transparent hover:text-[#9A0000] hover:bg-gray-50'
                   }`}
                 >
                   {month}
                 </button>
               ))}
             </div>
          </div>

          <div className="space-y-4">
            {filteredWorkshops.length > 0 ? (
              filteredWorkshops.map((workshop) => (
                <div key={workshop.id} className="group bg-[#fcfaf8] p-4 sm:p-6 rounded-2xl border border-gray-100 hover:border-[#9A0000] transition-all hover:shadow-lg flex flex-col md:flex-row items-center gap-6">
                  
                  {/* Date Badge - Red background (#9A0000), white text */}
                  <div className="flex-shrink-0 w-full md:w-24 bg-[#9A0000] rounded-xl p-4 text-center shadow-md border border-[#7a0000]">
                    <span className="block text-2xl font-bold leading-none text-white">{workshop.date.split(' ')[0]}</span>
                    <span className="block text-xs font-bold uppercase mt-1 text-white/90">{workshop.date.split(' ')[1]}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-xl font-bold text-[#140002] mb-2 font-serif group-hover:text-[#9A0000] transition-colors">{workshop.title}</h3>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={16} className="text-[#d20000]" /> {workshop.time}h</span>
                      <span className="flex items-center gap-1"><Users size={16} className="text-[#9A0000]" /> {workshop.instructor}</span>
                      {workshop.spots > 0 ? (
                        <span className="flex items-center gap-1 text-[#9a0000] font-bold bg-[#9d0b48]/10 px-2 py-0.5 rounded-full text-xs">
                          {workshop.spots} vagas
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full text-xs font-bold">
                          Esgotado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex-shrink-0 flex flex-col items-center md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-gray-200 pt-4 md:pt-0 mt-2 md:mt-0">
                    <div className="text-xl font-bold text-[#9A0000]">
                      R$ {workshop.price.toFixed(2).replace('.', ',')}
                    </div>
                    <button 
                      disabled={workshop.spots === 0}
                      onClick={() => {
                        const courseData: Course = {
                          id: workshop.id.toString(),
                          title: workshop.title,
                          category: 'Curso Presencial',
                          instructor: workshop.instructor,
                          price: workshop.price,
                          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
                          duration: '4h', 
                          rating: 5.0,
                          level: 'Todos os Níveis',
                          description: `Workshop presencial na unidade ${selectedLocation.name}. Data: ${workshop.date} às ${workshop.time}h. Garanta sua vaga para aprender técnicas exclusivas com ${workshop.instructor}.`,
                          modules: [
                            'Apostila Completa',
                            'Degustação em Aula',
                            'Certificado de Participação',
                            'Tira-dúvidas com o Professor'
                          ]
                        };
                        onCourseClick(courseData);
                      }}
                      className={`px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-md w-full md:w-auto flex items-center justify-center gap-2
                        ${workshop.spots === 0 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                          : 'bg-[#d20000] text-white hover:bg-[#b00000] hover:-translate-y-0.5 shadow-red-200'
                        }`}
                    >
                      {workshop.spots === 0 ? 'Lista de Espera' : <>Garantir Vaga <ArrowRight size={16} /></>}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhum workshop agendado para <span className="font-bold">{selectedMonth}</span> nesta unidade.</p>
                <button 
                  onClick={() => setSelectedMonth(selectedMonth === 'Fevereiro' ? 'Março' : 'Fevereiro')} 
                  className="mt-4 text-[#9A0000] font-bold hover:underline"
                >
                  Ver agenda de {selectedMonth === 'Fevereiro' ? 'Março' : 'Fevereiro'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Map Section */}
      <section className="bg-[#9A0000] py-20 text-white overflow-hidden relative transition-colors duration-500">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Info */}
            <div className="animate-in slide-in-from-left-4 duration-500" key={`info-${selectedLocation.id}`}>
              <span className="text-[#fff304] font-bold text-xs uppercase tracking-widest bg-white/10 px-2 py-1 rounded">Localização</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 mt-4">Visite a loja de {selectedLocation.name}</h2>
              <p className="text-red-100 mb-8 leading-relaxed text-lg font-light border-l-4 border-[#d20000] pl-4">
                {selectedLocation.description}
              </p>
              
              <div className="space-y-4 bg-[#fffbe5] p-6 rounded-2xl border border-[#9A0000]/10">
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#9A0000] flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-lg text-[#9A0000]">Endereço</h4>
                    <p className="text-[#140002]">{selectedLocation.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="text-[#9A0000] flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-lg text-[#9A0000]">Funcionamento</h4>
                    <p className="text-[#140002]">{selectedLocation.hours}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                 <button className="bg-[#fff304] text-[#9A0000] px-8 py-4 rounded-xl font-bold hover:bg-white transition-colors w-full sm:w-auto shadow-lg shadow-yellow-500/20">
                   Traçar Rota no Waze / Maps
                 </button>
              </div>
            </div>
            
            {/* Map Visual */}
            <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform hover:scale-[1.02] transition-all duration-500" key={`map-${selectedLocation.id}`}>
               <iframe 
                src={selectedLocation.mapEmbed}
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              ></iframe>
              <div className="absolute top-4 right-4 bg-white text-[#9A0000] px-4 py-2 rounded-lg shadow-md font-bold text-sm pointer-events-none">
                📍 {selectedLocation.name}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PresencialCourses;
