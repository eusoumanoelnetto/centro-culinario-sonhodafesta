
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Plus, BookOpen, GraduationCap, Save, X, CheckCircle2, 
  Image as ImageIcon, Layout, FileText, DollarSign, Calendar, User, 
  Upload, Lock, Eye, EyeOff, Loader2, Instagram, Users, Trash2, Edit, 
  MoreVertical, Search, Filter, Tag, Award, Phone, CheckSquare, Square, Mail, AlertCircle,
  MessageCircle, ChevronDown, FileUp, File as FileIcon, History, RefreshCw, Clock, FileCheck,
  Megaphone, UserPlus, Zap, Ban, UserCheck, BarChart3, AlertTriangle, BellRing, ArrowRight, PenTool,
  TrendingUp, PieChart, Wallet, Send, ChevronRight, Crown, Trophy, MoreHorizontal, MapPin, Store, CalendarDays
} from 'lucide-react';
import { Course, BlogPost, Student } from '../types';
import { COURSES, BLOG_POSTS } from '../constants';
import { recordFormSubmission } from '../services/formSubmissions';
import { listStudents, createStudent, updateStudent, deleteStudent } from '../services/students';

interface AdminDashboardProps {
  onBack: () => void;
  onAddCourse?: (course: Course) => void;
  onAddBlogPost?: (post: BlogPost) => void;
}

interface CertificateLog {
  id: string;
  studentName: string;
  courseTitle: string;
  dateSent: string;
  type: 'Original' | '2ª Via' | 'Correção';
  status: 'Entregue' | 'Pendente' | 'Erro';
  adminUser: string;
}

interface CertRequest {
  id: string;
  studentName: string;
  courseTitle: string;
  dateRequest: string;
  reason: string;
}

// Extensão da interface Course para incluir dados de vendas e Localização (Mock)
interface AdminCourse extends Course {
  capacity: number;
  enrolled: number;
  location: 'Bangu' | 'Campo Grande' | 'Duque de Caxias'; // Novo campo
}

// Senha ofuscada "Sonho2412@#!"
const OBFUSCATED_SECRET = "czBuaDBTb25obzI0MTJAIyE=";

const MOCK_TEACHERS = [
  { id: 1, name: 'Claudia Thomaz', specialty: 'Confeitaria Artística', instagram: '@claudiathomaz_cake', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Luan Gomes', specialty: 'Panificação e Salgados', instagram: '@chefluangomes', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200' },
  { id: 3, name: 'Adriana Balões', specialty: 'Decoração com Balões', instagram: '@adrianabaloes', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
];

const MOCK_CERT_HISTORY: CertificateLog[] = [
  { id: 'log-1', studentName: 'Ana Beatriz Souza', courseTitle: 'Bolo no Pote: Lucre o Ano Todo', dateSent: '10/02/2026 14:30', type: 'Original', status: 'Entregue', adminUser: 'Admin' },
  { id: 'log-2', studentName: 'Roberto Carlos', courseTitle: 'Bolo no Pote: Lucre o Ano Todo', dateSent: '10/02/2026 14:30', type: 'Original', status: 'Entregue', adminUser: 'Admin' },
  { id: 'log-3', studentName: 'Fernanda Lima', courseTitle: 'Ovos de Páscoa em Pé (Cacau Foods)', dateSent: '05/02/2026 09:15', type: 'Original', status: 'Entregue', adminUser: 'Admin' },
];

const MOCK_PENDING_REQUESTS: CertRequest[] = [
  { id: 'req-1', studentName: 'Patricia Poeta', courseTitle: 'Bolo no Pote: Lucre o Ano Todo', dateRequest: 'Hoje, 10:00', reason: 'Perdi o arquivo original' },
  { id: 'req-2', studentName: 'Carlos Eduardo', courseTitle: 'Confeitaria Básica', dateRequest: 'Ontem, 18:30', reason: 'Nome incorreto (Carlos Eduarto)' }
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onAddCourse, onAddBlogPost }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState<'metrics' | 'courses' | 'students' | 'teachers' | 'blog' | 'certificates'>('metrics');
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list'); // 'list' para tabela, 'form' para edição/criação
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Data States
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [teachersList, setTeachersList] = useState(MOCK_TEACHERS);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    if (!isAuthenticated) {
      setStudentsList([]);
      setStudentsError(null);
      return;
    }

    setIsLoadingStudents(true);
    setStudentsError(null);

    try {
      const data = await listStudents();
      setStudentsList(data);
    } catch (error) {
      console.error('Erro ao carregar alunos', error);
      setStudentsError('Não foi possível carregar os alunos. Tente novamente.');
    } finally {
      setIsLoadingStudents(false);
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Inicializa cursos com dados aleatórios de vendas e LOCALIZAÇÃO para demonstração
  const [coursesList, setCoursesList] = useState<AdminCourse[]>(() => {
    const locations = ['Bangu', 'Campo Grande', 'Duque de Caxias'] as const;
    return COURSES.map(c => ({
      ...c,
      capacity: 30, 
      enrolled: Math.floor(Math.random() * 31),
      location: locations[Math.floor(Math.random() * locations.length)] // Random location assignment
    }));
  });
  
  const [blogList, setBlogList] = useState(BLOG_POSTS);
  const [certHistory, setCertHistory] = useState<CertificateLog[]>(MOCK_CERT_HISTORY);
  const [certRequests, setCertRequests] = useState<CertRequest[]>(MOCK_PENDING_REQUESTS);

  // Filter States
  const [studentFilter, setStudentFilter] = useState<'Todos' | 'Ativo' | 'Cancelado' | 'Concluído'>('Todos');
  const [selectedUnitStats, setSelectedUnitStats] = useState<'Bangu' | 'Campo Grande' | 'Duque de Caxias' | 'Geral'>('Geral');
  
  // Chart Time Range State
  const [chartTimeRange, setChartTimeRange] = useState<'mensal' | 'semestral' | 'anual'>('semestral');

  // Certificação States
  const [selectedCertCourse, setSelectedCertCourse] = useState<string>("");
  const [selectedStudentsForCert, setSelectedStudentsForCert] = useState<string[]>([]);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [isSendingCerts, setIsSendingCerts] = useState(false);
  
  // Resolution Modal State
  const [resolvingRequest, setResolvingRequest] = useState<CertRequest | null>(null);
  const [correctionName, setCorrectionName] = useState("");
  const [isNameCorrection, setIsNameCorrection] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'course' | 'student' | 'teacher' | 'blog' | null; id: string | number | null; name: string } | null>(null);

  // Form States (Genéricos para reaproveitar ou específicos)
  const [editingId, setEditingId] = useState<string | number | null>(null); // Se null, é criação. Se tem ID, é edição.

  // Estados dos Formulários
  const [courseData, setCourseData] = useState({
    title: '', instructor: '', instagram: '', date: '', price: '', category: 'Confeitaria', description: '', capacity: '30'
  });
  const [studentData, setStudentData] = useState({ name: '', email: '', cpf: '', whatsapp: '', status: 'Ativo', course: '' });
  const [teacherData, setTeacherData] = useState({ name: '', specialty: '', instagram: '' });
  const [blogData, setBlogData] = useState({ title: '', author: '', category: 'Dicas', content: '', tags: '' });
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // --- Security Logic ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingAuth(true);
    setAuthError(false);

    const isValid = await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        try {
          const salt = 's0nh0';
          const inputHash = btoa(salt + passwordInput);
          resolve(inputHash === OBFUSCATED_SECRET);
        } catch (error) {
          resolve(false);
        }
      }, 800);
    });

    setIsCheckingAuth(false);
    setAuthError(!isValid);
    setIsAuthenticated(isValid);

    try {
      await recordFormSubmission('admin_login', {
        success: isValid,
        input_length: passwordInput.length,
      });
    } catch (error) {
      console.error('Erro ao registrar acesso administrativo', error);
    }
  };

  // --- CRM / Students Logic ---
  const getFilteredStudents = () => {
    if (studentFilter === 'Todos') return studentsList;
    return studentsList.filter(s => s.status === studentFilter);
  };

  const handleWhatsappClick = (student: Student) => {
    if (!student.whatsapp) {
      alert('Este aluno não possui número de WhatsApp cadastrado.');
      return;
    }
    const message = `Olá ${student.name.split(' ')[0]}! Tudo bem?`;
    const num = student.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- Course Occupancy Logic ---
  const handleNotifyTeacher = (course: AdminCourse) => {
    const occupancy = Math.round((course.enrolled / course.capacity) * 100);
    const message = `Olá ${course.instructor.split(' ')[0]}! Tudo bem? Notamos que o curso "${course.title}" está com ${course.enrolled} alunos inscritos (${occupancy}%). Vamos reforçar a divulgação nos stories hoje para tentarmos lotar essa turma? 🚀`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- Certificação Logic ---
  const handleCertCourseSelect = (courseTitle: string) => {
    setSelectedCertCourse(courseTitle);
    if (courseTitle) {
      const eligibleStudents = studentsList
        .filter(s => s.course === courseTitle && s.status === 'Ativo')
        .map(s => s.id);
      setSelectedStudentsForCert(eligibleStudents);
    } else {
      setSelectedStudentsForCert([]);
    }
  };

  const toggleCertStudent = (studentId: string) => {
    setSelectedStudentsForCert(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleCertificateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleBulkSendCert = () => {
    if (!certificateFile) {
      alert("Por favor, faça o upload do arquivo do certificado antes de enviar.");
      return;
    }
    if (selectedStudentsForCert.length === 0) {
      alert("Selecione ao menos um aluno.");
      return;
    }
    setIsSendingCerts(true);
    setTimeout(() => {
      // Mock logic...
      setIsSendingCerts(false);
      showSuccess(`${selectedStudentsForCert.length} certificados enviados com sucesso!`);
      setSelectedCertCourse("");
      setSelectedStudentsForCert([]);
      setCertificateFile(null);
    }, 2000);
  };

  const handleResendSingleCert = (log: CertificateLog) => {
    if(confirm(`Deseja reenviar o certificado para ${log.studentName}? Isso gerará um registro de 2ª via.`)) {
        const newLog: CertificateLog = {
            ...log,
            id: `log-${Date.now()}`,
            dateSent: new Date().toLocaleString('pt-BR'),
            type: '2ª Via',
            status: 'Entregue'
        };
        setCertHistory(prev => [newLog, ...prev]);
        showSuccess(`2ª via enviada para ${log.studentName}`);
    }
  };

  const handleOpenResolve = (request: CertRequest) => {
    setResolvingRequest(request);
    const reasonLower = request.reason.toLowerCase();
    const isCorrection = reasonLower.includes('nome') || reasonLower.includes('erro') || reasonLower.includes('incorreto');
    setIsNameCorrection(isCorrection);
    setCorrectionName(request.studentName); 
  };

  const handleFinalizeResolve = () => {
    if (!resolvingRequest) return;
    if (isNameCorrection) {
        if (correctionName !== resolvingRequest.studentName) {
            setStudentsList(prev => prev.map(s => {
                if (s.name === resolvingRequest.studentName && s.course === resolvingRequest.courseTitle) {
                    return { ...s, name: correctionName };
                }
                return s;
            }));
        }
        const newLog: CertificateLog = {
          id: `log-${Date.now()}`,
          studentName: correctionName,
          courseTitle: resolvingRequest.courseTitle,
          dateSent: new Date().toLocaleString('pt-BR'),
          type: 'Correção',
          status: 'Entregue',
          adminUser: 'Admin'
        };
        setCertHistory(prev => [newLog, ...prev]);
        showSuccess(`Nome corrigido e certificado enviado para "${correctionName}"!`);
    } else {
        const newLog: CertificateLog = {
          id: `log-${Date.now()}`,
          studentName: resolvingRequest.studentName,
          courseTitle: resolvingRequest.courseTitle,
          dateSent: new Date().toLocaleString('pt-BR'),
          type: '2ª Via',
          status: 'Entregue',
          adminUser: 'Admin'
        };
        setCertHistory(prev => [newLog, ...prev]);
        showSuccess(`2ª via reenviada para ${resolvingRequest.studentName}!`);
    }
    setCertRequests(prev => prev.filter(r => r.id !== resolvingRequest.id));
    setResolvingRequest(null);
  };

  // --- CHART DATA GENERATION ---
  const getChartData = () => {
    switch(chartTimeRange) {
        case 'mensal':
            return {
                data: [800, 1200, 950, 1400],
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                tooltipSuffix: 'k'
            };
        case 'anual':
            return {
                data: [900, 1100, 1050, 1300, 1250, 1400, 1200, 1950, 1500, 2800, 2400, 3148],
                labels: ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev'],
                tooltipSuffix: 'k'
            };
        case 'semestral':
        default:
            return {
                data: [1200, 1950, 1500, 2800, 2400, 3148], 
                labels: ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev'],
                tooltipSuffix: 'k'
            };
    }
  };

  // --- METRICS CALCULATION ---
  const calculateMetrics = () => {
    const totalCourses = coursesList.length;
    const totalStudents = coursesList.reduce((acc, curr) => acc + curr.enrolled, 0);
    const totalRevenue = coursesList.reduce((acc, curr) => acc + (curr.price * curr.enrolled), 0);
    
    // Teacher Ranking
    const teacherStats = teachersList.map(teacher => {
        const teacherCourses = coursesList.filter(c => c.instructor === teacher.name);
        const students = teacherCourses.reduce((acc, curr) => acc + curr.enrolled, 0);
        const revenue = teacherCourses.reduce((acc, curr) => acc + (curr.price * curr.enrolled), 0);
        return {
            name: teacher.name,
            courses: teacherCourses.length,
            students: students,
            revenue: revenue,
            image: teacher.image
        };
    }).sort((a, b) => b.students - a.students);

    // Unit Performance
    const unitStats = ['Bangu', 'Campo Grande', 'Duque de Caxias'].map(location => {
        const unitCourses = coursesList.filter(c => c.location === location);
        const students = unitCourses.reduce((acc, curr) => acc + curr.enrolled, 0);
        const revenue = unitCourses.reduce((acc, curr) => acc + (curr.price * curr.enrolled), 0);
        
        return {
            name: location,
            coursesCount: unitCourses.length,
            students,
            revenue,
            topCourses: unitCourses.sort((a, b) => b.enrolled - a.enrolled).slice(0, 3)
        };
    }).sort((a, b) => b.revenue - a.revenue); // Sort by revenue to find winner

    const funnel = {
        active: studentsList.filter(s => s.status === 'Ativo').length,
        completed: studentsList.filter(s => s.status === 'Concluído').length,
        canceled: studentsList.filter(s => s.status === 'Cancelado').length,
    };

    return { totalCourses, totalStudents, totalRevenue, teacherStats, funnel, unitStats };
  };

  // Helper for Bezier Curve
  const getSmoothPath = (data: number[], width: number, height: number, maxVal: number) => {
    if (data.length === 0) return "";
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (val / maxVal) * (height * 0.7) - (height * 0.15); 
        return [x, y];
    });
    const command = (point: number[], i: number, a: number[][]) => {
       const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
       const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
       return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
    };
    const controlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
        const p = previous || current;
        const n = next || current;
        const smoothing = 0.2;
        const o = line(p, n);
        const angle = o.angle + (reverse ? Math.PI : 0);
        const length = o.length * smoothing;
        const x = current[0] + Math.cos(angle) * length;
        const y = current[1] + Math.sin(angle) * length;
        return [x, y];
    };
    const line = (pointA: number[], pointB: number[]) => {
        const lengthX = pointB[0] - pointA[0];
        const lengthY = pointB[1] - pointA[1];
        return {
            length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
            angle: Math.atan2(lengthY, lengthX)
        };
    };
    const d = points.reduce((acc, point, i, a) => i === 0 
        ? `M ${point[0]},${point[1]}` 
        : `${acc} ${command(point, i, a)}`
    , "");
    return d;
  };

  // --- Actions Logic ---
  const handleAddNew = () => {
    setEditingId(null);
    setUploadedImage(null);
    setCourseData({ title: '', instructor: '', instagram: '', date: '', price: '', category: 'Confeitaria', description: '', capacity: '30' });
    setStudentData({ name: '', email: '', cpf: '', whatsapp: '', status: 'Ativo', course: '' });
    setTeacherData({ name: '', specialty: '', instagram: '' });
    setBlogData({ title: '', author: '', category: 'Dicas', content: '', tags: '' });
    setViewMode('form');
  };

  const handleEdit = (item: any, type: 'course' | 'student' | 'teacher' | 'blog') => {
    setEditingId(item.id);
    setUploadedImage(item.image || item.avatar || null); 
    if (type === 'course') {
      const c = item as AdminCourse;
      setCourseData({
        title: c.title,
        instructor: c.instructor,
        instagram: c.instagram || '',
        date: 'Data Existente', 
        price: c.price.toString(),
        category: c.category,
        description: c.description || '',
        capacity: c.capacity.toString()
      });
    } else if (type === 'student') {
      setStudentData({
        name: item.name,
        email: item.email,
        cpf: item.cpf || '',
        whatsapp: item.whatsapp || '',
        status: item.status || 'Ativo',
        course: item.course || '',
      });
    } else if (type === 'teacher') {
      setTeacherData({ name: item.name, specialty: item.specialty, instagram: item.instagram });
    } else if (type === 'blog') {
      setBlogData({ title: item.title, author: item.author, category: item.category, content: item.content || item.excerpt, tags: 'Dicas, Geral' });
    }
    setViewMode('form');
  };

  const handleDelete = async (id: string | number, type: 'course' | 'student' | 'teacher' | 'blog') => {
    let itemName = '';
    
    if (type === 'student') {
      const student = studentsList.find(s => s.id === id);
      itemName = student?.name || 'Aluno';
    } else if (type === 'course') {
      const course = coursesList.find(c => c.id === id);
      itemName = course?.title || 'Curso';
    } else if (type === 'teacher') {
      const teacher = teachersList.find(t => t.id === id);
      itemName = teacher?.name || 'Professor';
    } else if (type === 'blog') {
      const blog = blogList.find(b => b.id === id);
      itemName = blog?.title || 'Post';
    }

    setDeleteModal({ isOpen: true, type, id, name: itemName });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;

    const { type, id } = deleteModal;

    try {
      if (type === 'course') {
        setCoursesList(prev => prev.filter(c => c.id !== id));
      } else if (type === 'student') {
        const studentId = typeof id === 'string' ? id : String(id);
        await deleteStudent(studentId);
        await loadStudents();
        setSelectedStudentsForCert(prev => prev.filter(existingId => existingId !== studentId));
      } else if (type === 'teacher') {
        setTeachersList(prev => prev.filter(t => t.id !== id));
      } else if (type === 'blog') {
        setBlogList(prev => prev.filter(b => b.id !== id));
      }

      showSuccess("Item excluído com sucesso!");
      setDeleteModal(null);
    } catch (error) {
      console.error('Erro ao excluir registro', error);
      alert('Não foi possível excluir este registro. Tente novamente.');
    }
  };

  const handleSendCertificate = (studentName: string) => {
    showSuccess(`Certificado enviado para ${studentName}!`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const basePayload = {
      section: activeTab,
      mode: editingId ? 'update' : 'create',
    };

    let payload: Record<string, any> | null = null;
    let successMessage = activeTab === 'courses' ? 'Dados salvos com sucesso!' : 'Registro atualizado com sucesso!';
    let shouldShowSuccess = false;

    if (activeTab === 'courses') {
      payload = {
        ...basePayload,
        data: courseData,
        has_image: Boolean(uploadedImage),
      };
      shouldShowSuccess = true;
    } else if (activeTab === 'students') {
      const normalizedStatus = (studentData.status || 'Ativo').trim() || 'Ativo';
      const normalizedCourse = studentData.course.trim();
      const normalizedCpf = studentData.cpf.trim();
      const studentPayload = {
        name: studentData.name.trim(),
        email: studentData.email.trim(),
        cpf: normalizedCpf || undefined,
        whatsapp: studentData.whatsapp?.trim() || undefined,
        password: normalizedCpf || undefined, // CPF vira senha padrão
        firstAccess: true,
        status: normalizedStatus,
        course: normalizedCourse ? normalizedCourse : undefined,
        source: 'admin' as const,
      };

      if (!studentPayload.name || !studentPayload.email) {
        alert('Informe nome e e-mail do aluno.');
        return;
      }

      payload = {
        ...basePayload,
        data: studentPayload,
      };

      try {
        if (editingId) {
          await updateStudent(String(editingId), studentPayload);
          successMessage = 'Aluno atualizado com sucesso!';
        } else {
          await createStudent(studentPayload);
          successMessage = 'Aluno cadastrado com sucesso!';
        }

        await loadStudents();
        setStudentData({ name: '', email: '', cpf: '', whatsapp: '', status: 'Ativo', course: '' });
        setEditingId(null);
        shouldShowSuccess = true;
      } catch (error) {
        console.error('Erro ao salvar aluno', error);
        alert('Não foi possível salvar o aluno. Tente novamente.');
        return;
      }
    } else if (activeTab === 'teachers') {
      payload = {
        ...basePayload,
        data: teacherData,
      };
      shouldShowSuccess = true;
    } else if (activeTab === 'blog') {
      payload = {
        ...basePayload,
        data: blogData,
      };
      shouldShowSuccess = true;
    }

    if (shouldShowSuccess) {
      showSuccess(successMessage);
      setViewMode('list');
    }

    try {
      if (payload) {
        await recordFormSubmission('admin_record', payload);
      }
    } catch (error) {
      console.error('Erro ao registrar alteração administrativa', error);
      alert('Não foi possível registrar essa alteração no Supabase. Revise e tente novamente.');
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedImage(URL.createObjectURL(file));
  };

  const getFormTitle = () => {
    if (activeTab === 'courses') return editingId ? 'Editar Curso' : 'Novo Curso';
    if (activeTab === 'students') return editingId ? 'Editar Aluno' : 'Novo Aluno';
    if (activeTab === 'teachers') return editingId ? 'Editar Professor' : 'Novo Professor';
    if (activeTab === 'blog') return editingId ? 'Editar Artigo' : 'Nova Publicação';
    return 'Registro';
  };

  // --- RENDER METRICS ---
  const renderMetricsDashboard = () => {
    const metrics = calculateMetrics();
    const chartDataObj = getChartData();
    const maxRev = Math.max(...chartDataObj.data) * 1.1; 
    
    const svgWidth = 800;
    const svgHeight = 220; 
    const pathD = getSmoothPath(chartDataObj.data, svgWidth, svgHeight, maxRev);
    const fillD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

    const selectedUnitData = selectedUnitStats === 'Geral' 
        ? null 
        : metrics.unitStats.find(u => u.name === selectedUnitStats);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 font-inter">
            {/* KPI Cards - Modern SaaS Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    label: "Receita Total", 
                    value: `R$ ${metrics.totalRevenue.toFixed(2)}`, 
                    icon: Wallet, 
                    bgIcon: "bg-emerald-100 text-emerald-700", 
                    trend: "+12% este mês", 
                    trendColor: "text-emerald-600 bg-emerald-50",
                    isPositive: true
                  },
                  { 
                    label: "Alunos Ativos", 
                    value: metrics.totalStudents, 
                    icon: Users, 
                    bgIcon: "bg-blue-100 text-blue-700", 
                    sub: `${metrics.totalCourses} cursos ativos`,
                    trendColor: "text-blue-600 bg-blue-50"
                  },
                  { 
                    label: "Taxa de Conclusão", 
                    value: `${Math.round((metrics.funnel.completed / (metrics.funnel.active + metrics.funnel.completed + metrics.funnel.canceled)) * 100)}%`, 
                    icon: GraduationCap, 
                    bgIcon: "bg-purple-100 text-purple-700", 
                    progress: 20 
                  },
                  { 
                    label: "Cancelados", 
                    value: metrics.funnel.canceled, 
                    icon: Ban, 
                    bgIcon: "bg-red-100 text-red-700", 
                    alert: "Requer atenção", 
                    alertColor: "text-red-600 bg-red-50" 
                  },
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group">
                     {/* Header: Label & Icon */}
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{kpi.label}</span>
                        <div className={`p-2.5 rounded-xl ${kpi.bgIcon} transition-colors`}>
                          <kpi.icon size={20} />
                        </div>
                     </div>
                     
                     {/* Value */}
                     <div className="flex flex-col">
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight leading-none font-inter">
                          {kpi.value}
                        </h3>
                        
                        {/* Context/Footer */}
                        <div className="mt-4 flex items-center min-h-[20px]">
                           {kpi.trend && (
                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${kpi.trendColor}`}>
                               {kpi.isPositive ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />} 
                               {kpi.trend}
                             </span>
                           )}
                           {kpi.sub && (
                             <span className="text-xs text-gray-400 font-medium">{kpi.sub}</span>
                           )}
                           {kpi.alert && (
                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${kpi.alertColor}`}>
                               <AlertCircle size={14} /> {kpi.alert}
                             </span>
                           )}
                        </div>

                        {/* Visual Progress Bar if needed */}
                        {kpi.progress !== undefined && (
                          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{width: `${kpi.progress}%`}}></div>
                          </div>
                        )}
                     </div>
                  </div>
                ))}
            </div>

            {/* --- UNIT PERFORMANCE & COURSE RANKING SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Desempenho por Unidade */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <Store size={20} className="text-[#9A0000]" />
                            Desempenho por Unidade
                        </h3>
                    </div>
                    
                    <div className="space-y-4 flex-grow">
                        {metrics.unitStats.map((unit, index) => {
                            const isWinner = index === 0;
                            const percentage = (unit.revenue / metrics.unitStats[0].revenue) * 100;
                            
                            return (
                                <div 
                                    key={unit.name} 
                                    onClick={() => setSelectedUnitStats(unit.name as any)}
                                    className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
                                        selectedUnitStats === unit.name 
                                            ? 'border-[#9A0000] ring-1 ring-[#9A0000]/10 bg-red-50/20' 
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            {isWinner && <Trophy size={14} className="text-yellow-500" />}
                                            <h4 className={`font-bold text-sm ${selectedUnitStats === unit.name ? 'text-[#9A0000]' : 'text-gray-700'}`}>{unit.name}</h4>
                                        </div>
                                        <span className="font-bold text-gray-900 text-sm font-inter">R$ {unit.revenue.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${isWinner ? 'bg-[#9A0000]' : 'bg-gray-400'}`} 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                                        <span>{unit.coursesCount} cursos ativos</span>
                                        <span>{unit.students} alunos</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Top Cursos da Unidade Selecionada */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <Award size={20} className="text-[#9A0000]" />
                                Top Cursos
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 font-medium">
                                {selectedUnitStats === 'Geral' ? 'Selecione uma unidade ao lado' : `Ranking: ${selectedUnitStats}`}
                            </p>
                        </div>
                        {selectedUnitStats !== 'Geral' && (
                            <button onClick={() => setSelectedUnitStats('Geral')} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                                <X size={12} /> Limpar
                            </button>
                        )}
                    </div>

                    <div className="flex-grow">
                        {selectedUnitData ? (
                            <div className="space-y-3">
                                {selectedUnitData.topCourses.map((course, idx) => (
                                    <div key={course.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:shadow-sm transition-all bg-gray-50/30 group">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                                            idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                            idx === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-bold text-gray-800 text-sm truncate">{course.title}</h4>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">{course.instructor}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="block font-bold text-[#9A0000] text-sm font-inter">R$ {(course.price * course.enrolled).toFixed(0)}</span>
                                            <span className="text-[10px] text-gray-400">{course.enrolled} vendas</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                                <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                   <MapPin size={24} className="text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Selecione uma unidade para ver detalhes</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Curve Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">Curva de Receita</h3>
                          <p className="text-xs text-gray-400 mt-1 font-medium">Tendência de faturamento nos últimos meses</p>
                        </div>
                        
                        <div className="flex bg-gray-100/80 p-1 rounded-lg">
                           {(['mensal', 'semestral', 'anual'] as const).map((range) => (
                             <button
                               key={range}
                               onClick={() => setChartTimeRange(range)}
                               className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                                 chartTimeRange === range 
                                   ? 'bg-white text-gray-800 shadow-sm text-[#9A0000]' 
                                   : 'text-gray-500 hover:text-gray-700'
                               }`}
                             >
                               {range.charAt(0).toUpperCase() + range.slice(1)}
                             </button>
                           ))}
                        </div>
                    </div>
                    
                    <div className="relative h-[220px] w-full" key={chartTimeRange}>
                        {/* Simple lines background */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="border-b border-gray-50 w-full h-full"></div>
                            ))}
                        </div>
                        
                        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#9A0000" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#9A0000" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d={fillD} fill="url(#gradientArea)" />
                            <path d={pathD} fill="none" stroke="#9A0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            {chartDataObj.data.map((val, i) => {
                                const x = (i / (chartDataObj.data.length - 1)) * svgWidth;
                                const y = svgHeight - (val / maxRev) * (svgHeight * 0.7) - (svgHeight * 0.15);
                                return (
                                    <g key={i} className="group/dot">
                                      <circle cx={x} cy={y} r="4" fill="#fff" stroke="#9A0000" strokeWidth="2.5" className="cursor-pointer hover:r-6 transition-all" />
                                      {/* Tooltip positioned above */}
                                      <foreignObject x={x - 40} y={y - 50} width="80" height="40" className="opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none">
                                        <div className="bg-gray-900 text-white text-[10px] font-bold py-1.5 px-2 rounded-lg text-center shadow-xl transform translate-y-1 font-inter">
                                          R$ {val}
                                        </div>
                                      </foreignObject>
                                    </g>
                                );
                            })}
                        </svg>
                        
                        {/* X Axis Labels */}
                        <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] font-bold text-gray-400 translate-y-6 px-2">
                            {chartDataObj.labels.map((label, i) => (
                                <span key={i}>{label}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                      <PieChart size={18} className="text-gray-400" />
                      Status do Funil
                    </h3>
                    <div className="space-y-6 flex-grow">
                        {[
                          { label: 'Ativos', val: metrics.funnel.active, total: metrics.totalStudents, color: 'bg-blue-500', bg: 'bg-blue-50' },
                          { label: 'Concluídos', val: metrics.funnel.completed, total: metrics.totalStudents, color: 'bg-green-500', bg: 'bg-green-50' },
                          { label: 'Cancelados', val: metrics.funnel.canceled, total: metrics.totalStudents, color: 'bg-red-500', bg: 'bg-red-50' }
                        ].map((stat, i) => (
                          <div key={i}>
                              <div className="flex justify-between text-xs mb-2 font-medium">
                                  <span className="text-gray-600">{stat.label}</span>
                                  <span className="text-gray-900 font-bold font-inter">{stat.val}</span>
                              </div>
                              <div className={`w-full h-2 ${stat.bg} rounded-full overflow-hidden`}>
                                <div 
                                  className={`h-full ${stat.color} rounded-full transition-all duration-1000`} 
                                  style={{width: `${(stat.val / metrics.totalStudents) * 100}%`}}
                                ></div>
                              </div>
                          </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50">
                        <div className="flex gap-3 items-start bg-blue-50/50 p-3 rounded-xl">
                           <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600 shrink-0">
                             <Zap size={14} />
                           </div>
                           <div>
                             <p className="text-xs font-bold text-gray-800 mb-1">Dica de Retenção</p>
                             <p className="text-[10px] text-gray-500 leading-relaxed">
                               A taxa de cancelamento está em <span className="font-bold text-blue-600">{(metrics.funnel.canceled / metrics.totalStudents * 100).toFixed(1)}%</span>.
                             </p>
                           </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teacher Performance Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-lg">Instrutores</h3>
                    <button onClick={() => setActiveTab('teachers')} className="text-xs font-bold text-[#9A0000] hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                      Ver Todos
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-gray-50/80 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Nome</th>
                                <th className="p-4 text-center">Cursos</th>
                                <th className="p-4 text-center">Alunos</th>
                                <th className="p-4 pr-6 text-right">Receita</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                            {metrics.teacherStats.map((teacher, idx) => (
                                <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <img src={teacher.image} alt="" className="w-8 h-8 rounded-full object-cover bg-gray-200 border border-gray-100" />
                                            <span className="font-bold text-gray-900 text-sm">{teacher.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center text-gray-500">{teacher.courses}</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
                                            {teacher.students}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right font-mono text-gray-600 font-medium">R$ {teacher.revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
  };

  // --- LOGIN SCREEN ---
  // (Mantido igual ao original, omitido para focar na mudança solicitada)
  if (!isAuthenticated) {
    // ... (Login form code)
    return (
      <div className="min-h-screen bg-[#2c3e50] flex items-center justify-center p-4 font-quicksand">
        {/* ... (Login UI Code) ... */}
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative overflow-hidden animate-in zoom-in-95 duration-300">
          <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="text-center mb-8 mt-4">
            <div className="w-16 h-16 bg-[#9A0000] rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg transform rotate-3">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-800">Acesso Restrito</h2>
            <p className="text-gray-500 text-sm">Área administrativa Sonho da Festa</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Senha de Acesso</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setAuthError(false); }}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${authError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-[#9A0000] outline-none transition-all text-gray-900 bg-white`}
                  placeholder="Digite a senha..."
                  autoFocus
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {authError && <p className="text-xs text-red-500 font-bold ml-1 animate-pulse">Senha incorreta.</p>}
            </div>
            <button type="submit" disabled={!passwordInput || isCheckingAuth} className="w-full bg-[#9A0000] text-white py-4 rounded-xl font-bold hover:bg-[#7a0000] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {isCheckingAuth ? <Loader2 size={20} className="animate-spin" /> : <>Entrar no Painel <ArrowLeft size={18} className="rotate-180" /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER TABLES ---
  // (Mantido igual ao original, omitido para brevidade)
  const renderCoursesTable = () => (
    // ... (Existing implementation)
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <th className="p-4">Curso</th>
            <th className="p-4">Ocupação</th>
            <th className="p-4">Preço</th>
            <th className="p-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {coursesList.map(course => {
            const percentage = (course.enrolled / course.capacity) * 100;
            let statusColor = 'bg-red-500';
            
            if (percentage >= 70) {
              statusColor = 'bg-green-500';
            } else if (percentage >= 30) {
              statusColor = 'bg-yellow-500';
            }

            return (
              <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={course.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 line-clamp-1">{course.title}</span>
                    <span className="text-xs text-gray-500 block">{course.instructor} • {course.location}</span>
                  </div>
                </td>
                <td className="p-4 w-48">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-bold text-gray-700">{course.enrolled}/{course.capacity}</span>
                    <span className={`${percentage < 30 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${statusColor}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  {percentage < 30 && (
                    <button 
                      onClick={() => handleNotifyTeacher(course)}
                      className="mt-2 text-[10px] flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors w-fit"
                      title="Enviar mensagem para o professor"
                    >
                      <Megaphone size={10} /> Cobrar Divulgação
                    </button>
                  )}
                </td>
                <td className="p-4 font-mono font-medium">R$ {course.price.toFixed(2)}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(course, 'course')} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(course.id, 'course')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Excluir"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // ... (Other render functions: renderStudentsTable, renderTeachersTable, renderBlogTable remain the same)
  const renderStudentsTable = () => {
    // ... (Existing Code)
    const students = getFilteredStudents();
    return (
      <>
        {/* CRM DASHBOARD SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-500">
          <div className="bg-[#fffbe5] p-5 rounded-2xl border border-[#fff304] relative overflow-hidden">
            {/* ... (Existing Content) ... */}
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-2">
              <Megaphone size={100} className="text-[#9A0000]" />
            </div>
            <h3 className="text-[#9A0000] font-bold text-lg mb-1">Recuperação de Vendas</h3>
            <div className="text-3xl font-bold text-gray-800 mb-2">{studentsList.filter(s => s.status === 'Cancelado').length}</div>
            <p className="text-xs text-gray-600 mb-4">Alunos cancelados que podem ser resgatados com uma oferta.</p>
            <button 
              onClick={() => setStudentFilter('Cancelado')}
              className="text-xs bg-[#9A0000] text-white px-3 py-2 rounded-lg font-bold hover:bg-[#7a0000] transition-colors flex items-center gap-2"
            >
              <Zap size={14} /> Ver Oportunidades
            </button>
          </div>
          {/* ... (Other CRM Cards) ... */}
           <div className="bg-green-50 p-5 rounded-2xl border border-green-200 relative overflow-hidden">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-2">
              <UserCheck size={100} className="text-green-600" />
            </div>
            <h3 className="text-green-800 font-bold text-lg mb-1">Ex-Alunos (Leads Quentes)</h3>
            <div className="text-3xl font-bold text-gray-800 mb-2">{studentsList.filter(s => s.status === 'Concluído' || s.status === 'Ativo').length}</div>
            <p className="text-xs text-gray-600 mb-4">Alunos satisfeitos prontos para comprar um novo curso.</p>
            <button 
              onClick={() => setStudentFilter('Concluído')}
              className="text-xs bg-green-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Users size={14} /> Oferecer Novidades
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center">
            <div className="bg-gray-100 p-3 rounded-full mb-3">
              <UserPlus size={24} className="text-gray-500" />
            </div>
            <h3 className="text-gray-800 font-bold mb-2">Novo Aluno Manual</h3>
            <button onClick={handleAddNew} className="w-full bg-gray-800 text-white py-2 rounded-xl font-bold text-sm hover:bg-gray-700 transition-colors">
              Cadastrar Manualmente
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['Todos', 'Ativo', 'Cancelado', 'Concluído'].map(filter => (
            <button
              key={filter}
              onClick={() => setStudentFilter(filter as any)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                studentFilter === filter 
                  ? 'bg-[#9A0000] text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
          {studentsError ? (
            <div className="p-8 text-center text-sm text-red-600">
              <p>{studentsError}</p>
              <button
                onClick={loadStudents}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
              >
                <RefreshCw size={16} /> Tentar novamente
              </button>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500 flex flex-col items-center gap-4">
              {isLoadingStudents ? (
                <div className="flex items-center gap-2 text-[#9A0000] font-bold">
                  <Loader2 size={20} className="animate-spin" /> Carregando alunos...
                </div>
              ) : (
                <>
                  <p>Nenhum aluno cadastrado ainda.</p>
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#9A0000] text-white font-bold hover:bg-[#7a0000] transition-colors"
                  >
                    <UserPlus size={16} /> Cadastrar primeiro aluno
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {isLoadingStudents && (
                <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                  <Loader2 size={14} className="animate-spin" /> Atualizando lista de alunos...
                </div>
              )}
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Aluno / Lead</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Último Curso</th>
                    <th className="p-4">Contato</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {students.map(student => {
                    const leadTag = student.leadTag || 'Novo';
                    const lastContact = student.lastContact || 'Sem registro';
                    const status = student.status || 'Pendente';
                    const courseTitle = student.course || 'Sem curso';

                    const leadTagClass = leadTag === 'VIP'
                      ? 'bg-[#fff304] text-[#9A0000]'
                      : leadTag === 'Sumido'
                      ? 'bg-red-100 text-red-600'
                      : leadTag === 'Novo'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-500';

                    const statusClass = status === 'Ativo'
                      ? 'bg-green-100 text-green-700'
                      : status === 'Pendente'
                      ? 'bg-yellow-100 text-yellow-700'
                      : status === 'Concluído'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700';

                    return (
                      <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{student.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${leadTagClass}`}>
                                {leadTag}
                              </span>
                              <span className="text-[10px] text-gray-400">Último: {lastContact}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold flex items-center w-fit gap-1 ${statusClass}`}>
                            {status === 'Cancelado' && <Ban size={10} />}
                            {status === 'Concluído' && <CheckCircle2 size={10} />}
                            {status}
                          </span>
                        </td>
                        <td className="p-4 max-w-xs truncate" title={courseTitle}>{courseTitle}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleWhatsappClick(student)}
                            className="flex items-center gap-2 text-green-600 font-bold hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors border border-green-100"
                            title="Enviar mensagem personalizada"
                          >
                            <MessageCircle size={16} />
                            <span className="hidden xl:inline">Chamar</span>
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleSendCertificate(student.name)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Enviar Certificado"><Award size={16} /></button>
                            <button onClick={() => handleEdit(student, 'student')} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(student.id, 'student')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Excluir"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </>
    );
  };

  const renderTeachersTable = () => (
    // ... (Existing Table Code)
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <th className="p-4">Nome</th>
            <th className="p-4">Especialidade</th>
            <th className="p-4">Instagram</th>
            <th className="p-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {teachersList.map(teacher => (
            <tr key={teacher.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="p-4 flex items-center gap-3">
                <img src={teacher.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                <span className="font-bold text-gray-900">{teacher.name}</span>
              </td>
              <td className="p-4">{teacher.specialty}</td>
              <td className="p-4 text-blue-600">{teacher.instagram}</td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => handleEdit(teacher, 'teacher')} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(teacher.id, 'teacher')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBlogTable = () => (
    // ... (Existing Table Code)
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <th className="p-4">Artigo</th>
            <th className="p-4">Autor</th>
            <th className="p-4">Categoria</th>
            <th className="p-4">Data</th>
            <th className="p-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {blogList.map(post => (
            <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="p-4 flex items-center gap-3">
                <img src={post.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-200" />
                <span className="font-bold text-gray-900 line-clamp-1 max-w-[200px]">{post.title}</span>
              </td>
              <td className="p-4">{post.author}</td>
              <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">{post.category}</span></td>
              <td className="p-4">{post.date}</td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => handleEdit(post, 'blog')} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(post.id, 'blog')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // --- DASHBOARD LAYOUT ---
  return (
    <div className="min-h-screen bg-[#fcfaf8] font-quicksand pb-20 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header */}
      <div className="bg-[#2c3e50] text-white pt-8 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-6">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
              <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                <ArrowLeft size={20} />
              </div>
              <span className="font-bold text-sm">Sair do Painel</span>
            </button>
            <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Admin Conectado
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Painel de Controle</h1>
          <p className="text-gray-400">Gerencie todo o ecossistema do Sonho da Festa em um só lugar.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-700">Menu de Gestão</h3>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => { setActiveTab('metrics'); setViewMode('list'); }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'metrics' ? 'bg-[#9A0000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <BarChart3 size={20} /> Visão Geral
                </button>
                <button
                  onClick={() => { setActiveTab('courses'); setViewMode('list'); }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-[#9A0000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <GraduationCap size={20} /> Cursos
                </button>
                <button
                  onClick={() => { setActiveTab('students'); setViewMode('list'); }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-[#9A0000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Users size={20} /> Alunos (CRM)
                </button>
                <button
                  onClick={() => { setActiveTab('teachers'); setViewMode('list'); }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'teachers' ? 'bg-[#9A0000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <User size={20} /> Professores
                </button>
                <div className="border-t border-gray-100 my-2"></div>
                <button
                  onClick={() => { setActiveTab('blog'); setViewMode('list'); }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'blog' ? 'bg-[#9A0000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <BookOpen size={20} /> Blog
                </button>
                <button
                  onClick={() => { setActiveTab('certificates'); setViewMode('list'); }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'certificates' ? 'bg-[#9A0000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Award size={20} />
                  <span className="flex-1">Certificação</span>
                  {certRequests.length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">{certRequests.length}</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden min-h-[500px]">
              
              {isSuccess && (
                <div className="absolute top-0 left-0 w-full bg-green-500 text-white p-4 text-center font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top-full z-50">
                  <CheckCircle2 size={24} /> {successMessage}
                </div>
              )}

              {/* LIST VIEW (TABLES) */}
              {viewMode === 'list' && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 font-serif flex items-center gap-2">
                      {activeTab === 'metrics' && 'Visão Geral & Métricas'}
                      {activeTab === 'courses' && 'Gerenciar Cursos'}
                      {activeTab === 'students' && 'Gerenciar Alunos & Leads'}
                      {activeTab === 'teachers' && 'Gerenciar Professores'}
                      {activeTab === 'blog' && 'Gerenciar Blog'}
                      {activeTab === 'certificates' && 'Gerenciar Certificados'}
                    </h2>
                    
                    {activeTab !== 'certificates' && activeTab !== 'students' && activeTab !== 'metrics' && (
                      <button 
                        onClick={handleAddNew}
                        className="bg-[#9A0000] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#7a0000] transition-all shadow-lg flex items-center gap-2"
                      >
                        <Plus size={20} />
                        {activeTab === 'courses' && 'Novo Curso'}
                        {activeTab === 'teachers' && 'Novo Professor'}
                        {activeTab === 'blog' && 'Nova Publicação'}
                      </button>
                    )}
                  </div>

                  {activeTab !== 'certificates' && activeTab !== 'students' && activeTab !== 'metrics' && (
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#9A0000] bg-white text-gray-900 placeholder:text-gray-400" />
                      </div>
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 bg-white"><Filter size={18} /> Filtros</button>
                    </div>
                  )}

                  {activeTab === 'metrics' && renderMetricsDashboard()}
                  {activeTab === 'courses' && renderCoursesTable()}
                  {activeTab === 'students' && renderStudentsTable()}
                  {activeTab === 'teachers' && renderTeachersTable()}
                  {activeTab === 'blog' && renderBlogTable()}
                  
                  {/* CERTIFICATES SECTION */}
                  {activeTab === 'certificates' && (
                    <div className="animate-in fade-in duration-300">
                      
                      {/* PENDING REQUESTS NOTIFICATION PANEL */}
                      {certRequests.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8 shadow-sm">
                          <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                            <BellRing size={20} className="animate-bounce" />
                            Notificações de Solicitação ({certRequests.length})
                          </h3>
                          <div className="space-y-3">
                            {certRequests.map(req => (
                              <div key={req.id} className="bg-white p-4 rounded-xl border border-yellow-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-800">{req.studentName}</span>
                                    <span className="text-xs text-gray-400">• {req.dateRequest}</span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Curso: <strong>{req.courseTitle}</strong>
                                  </p>
                                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={14} /> Motivo: {req.reason}
                                  </p>
                                </div>
                                <button 
                                  onClick={() => handleOpenResolve(req)}
                                  className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-200 transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                  Resolver / Reenviar <ArrowRight size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT COLUMN: SETUP */}
                        <div className="lg:col-span-1 space-y-6">
                          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                              <Filter size={18} className="text-[#9A0000]" /> Configuração do Envio
                            </h3>
                            
                            {/* Course Selection */}
                            <div className="mb-4">
                              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">1. Selecione a Turma</label>
                              <select 
                                value={selectedCertCourse} 
                                onChange={(e) => handleCertCourseSelect(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 text-sm"
                              >
                                <option value="">Escolher turma...</option>
                                {Array.from(new Set(studentsList.map(s => s.course))).map((courseName, idx) => (
                                  <option key={idx} value={courseName}>{courseName}</option>
                                ))}
                              </select>
                            </div>

                            {/* File Upload */}
                            <div className="mb-2">
                              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">2. Arquivo do Certificado</label>
                              {!certificateFile ? (
                                <div className="relative group">
                                  <input 
                                    type="file" 
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleCertificateFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-white group-hover:border-[#9A0000] group-hover:bg-red-50/30 transition-all text-center p-4">
                                    <FileUp size={24} className="text-gray-400 group-hover:text-[#9A0000] mb-2" />
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-[#9A0000]">Clique ou arraste</span>
                                    <span className="text-[10px] text-gray-400 mt-1">PDF ou Imagem (Max 5MB)</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 relative">
                                  <div className="bg-red-50 p-2 rounded-lg text-[#9A0000]">
                                    <FileIcon size={20} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{certificateFile.name}</p>
                                    <p className="text-xs text-gray-500">{(certificateFile.size / 1024).toFixed(0)} KB</p>
                                  </div>
                                  <button 
                                    onClick={() => setCertificateFile(null)}
                                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Stats */}
                          {selectedCertCourse && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-3 rounded-xl border border-gray-200">
                              <Users size={18} className="text-[#9A0000]" />
                              <span>{studentsList.filter(s => s.course === selectedCertCourse).length} alunos matriculados</span>
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: LIST & ACTION */}
                        <div className="lg:col-span-2">
                          {selectedCertCourse ? (
                            <div className="space-y-6 h-full flex flex-col">
                              <div className="flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">Seleção de Destinatários</h3>
                                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                  <span className="font-bold text-[#9A0000]">{selectedStudentsForCert.length}</span> selecionados
                                </div>
                              </div>

                              <div className="flex-grow overflow-y-auto max-h-[400px] border border-gray-100 rounded-2xl bg-white shadow-sm custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                  <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                      <th className="p-4 w-16 text-center">Enviar</th>
                                      <th className="p-4">Aluno</th>
                                      <th className="p-4">Status</th>
                                      <th className="p-4 hidden sm:table-cell">E-mail</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-sm text-gray-700">
                                    {studentsList.filter(s => s.course === selectedCertCourse).map(student => {
                                      const isSelected = selectedStudentsForCert.includes(student.id);
                                      const isCancelled = student.status === 'Cancelado';
                                      
                                      return (
                                        <tr key={student.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${isCancelled ? 'opacity-50 bg-gray-50' : ''}`}>
                                          <td className="p-4 text-center">
                                            <button 
                                              onClick={() => toggleCertStudent(student.id)}
                                              className={`p-1 rounded transition-colors ${isSelected ? 'text-[#9A0000]' : 'text-gray-300 hover:text-gray-400'}`}
                                            >
                                              {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                            </button>
                                          </td>
                                          <td className="p-4 font-bold text-gray-900">{student.name}</td>
                                          <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold flex items-center w-fit gap-1 ${
                                              student.status === 'Ativo' ? 'bg-green-100 text-green-700' : 
                                              student.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                              {student.status === 'Cancelado' && <AlertCircle size={10} />}
                                              {student.status}
                                            </span>
                                          </td>
                                          <td className="p-4 text-gray-500 hidden sm:table-cell">{student.email}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              <div className="flex justify-end pt-2">
                                <button 
                                  onClick={handleBulkSendCert}
                                  disabled={selectedStudentsForCert.length === 0 || !certificateFile || isSendingCerts}
                                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold shadow-lg transition-all w-full md:w-auto justify-center ${
                                    selectedStudentsForCert.length > 0 && certificateFile && !isSendingCerts
                                      ? 'bg-[#9A0000] text-white hover:bg-[#7a0000] hover:-translate-y-1' 
                                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                  }`}
                                >
                                  {isSendingCerts ? (
                                    <>
                                      <Loader2 size={20} className="animate-spin" /> Enviando...
                                    </>
                                  ) : (
                                    <>
                                      <Mail size={20} />
                                      Enviar {selectedStudentsForCert.length} Certificados
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-center p-8">
                              <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                                <Award size={40} className="text-gray-300" />
                              </div>
                              <h3 className="text-xl font-bold text-gray-700 mb-2">Envio de Certificados</h3>
                              <p className="text-gray-500 max-w-xs mx-auto">
                                Selecione uma turma e faça o upload do arquivo ao lado para gerenciar os envios.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* --- HISTÓRICO DE ENVIOS --- */}
                      <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <History size={20} className="text-[#9A0000]" />
                            Histórico de Envios
                          </h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {certHistory.length} registros
                          </span>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-gray-50">
                                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  <th className="p-4">Data</th>
                                  <th className="p-4">Aluno</th>
                                  <th className="p-4">Curso</th>
                                  <th className="p-4">Tipo</th>
                                  <th className="p-4">Status</th>
                                  <th className="p-4 text-right">Ações</th>
                                </tr>
                              </thead>
                              <tbody className="text-sm text-gray-700">
                                {certHistory.map((log) => (
                                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 whitespace-nowrap text-gray-500 flex items-center gap-2">
                                      <Clock size={14} /> {log.dateSent}
                                    </td>
                                    <td className="p-4 font-bold text-gray-900">{log.studentName}</td>
                                    <td className="p-4 max-w-xs truncate" title={log.courseTitle}>{log.courseTitle}</td>
                                    <td className="p-4">
                                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        log.type === 'Original' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                      }`}>
                                        {log.type}
                                      </span>
                                    </td>
                                    <td className="p-4">
                                      <span className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full w-fit">
                                        <FileCheck size={12} /> {log.status}
                                      </span>
                                    </td>
                                    <td className="p-4 text-right">
                                      <button 
                                        onClick={() => handleResendSingleCert(log)}
                                        className="text-gray-400 hover:text-[#9A0000] hover:bg-red-50 p-2 rounded-lg transition-all"
                                        title="Reenviar (Gera 2ª via)"
                                      >
                                        <RefreshCw size={16} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                                {certHistory.length === 0 && (
                                  <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                      Nenhum histórico de envio encontrado.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </>
              )}

              {/* FORM VIEW (ADD/EDIT) */}
              {viewMode === 'form' && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                    <button onClick={() => setViewMode('list')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                      <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 font-serif">
                      {getFormTitle()}
                    </h2>
                  </div>

                  <form onSubmit={handleSave} className="space-y-6 max-w-3xl mx-auto">
                    {/* ... (Existing Form Code) ... */}
                    {activeTab === 'courses' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Título</label>
                            <input required type="text" value={courseData.title} onChange={e => setCourseData({...courseData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Instrutor</label>
                            <input required type="text" value={courseData.instructor} onChange={e => setCourseData({...courseData, instructor: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Preço</label>
                            <input required type="number" step="0.01" value={courseData.price} onChange={e => setCourseData({...courseData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Categoria</label>
                            <select value={courseData.category} onChange={e => setCourseData({...courseData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900">
                              <option>Confeitaria</option><option>Decorações</option><option>Páscoa</option><option>Culinária</option>
                            </select>
                          </div>
                          <div>
                             <label className="text-xs font-bold text-gray-500 uppercase ml-1">Imagem</label>
                             <div className="relative">
                               <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                               <div className="w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 text-center text-sm hover:border-[#9A0000] bg-white">
                                 {uploadedImage ? "Imagem Selecionada" : "Escolher Arquivo"}
                               </div>
                             </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descrição</label>
                          <textarea rows={4} value={courseData.description} onChange={e => setCourseData({...courseData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none resize-none bg-white text-gray-900 placeholder:text-gray-400"></textarea>
                        </div>
                      </>
                    )}

                    {/* STUDENT FORM */}
                    {activeTab === 'students' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome Completo</label>
                            <input required type="text" value={studentData.name} onChange={e => setStudentData({...studentData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-mail</label>
                            <input required type="email" value={studentData.email} onChange={e => setStudentData({...studentData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">WhatsApp</label>
                            <div className="flex gap-2">
                              <input 
                                type="tel" 
                                value={studentData.whatsapp} 
                                onChange={e => setStudentData({...studentData, whatsapp: e.target.value})} 
                                placeholder="(21) 99999-9999" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" 
                              />
                              <button
                                type="button"
                                disabled={!studentData.whatsapp}
                                onClick={() => {
                                  const num = studentData.whatsapp.replace(/\D/g, '');
                                  if(num) window.open(`https://wa.me/55${num}`, '_blank');
                                }}
                                className="px-4 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[50px] justify-center group"
                                title="Abrir WhatsApp Web"
                              >
                                <MessageCircle size={20} />
                                <span className="hidden xl:inline">Conversar</span>
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">CPF</label>
                            <input 
                              type="text" 
                              value={studentData.cpf} 
                              onChange={e => setStudentData({...studentData, cpf: e.target.value})} 
                              placeholder="000.000.000-00" 
                              maxLength={14}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" 
                            />
                            <p className="text-[10px] text-gray-400 mt-1 ml-1">Será usado como senha padrão no primeiro acesso</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Status</label>
                            <select value={studentData.status} onChange={e => setStudentData({...studentData, status: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900">
                              <option>Ativo</option><option>Pendente</option><option>Cancelado</option>
                            </select>
                          </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Curso de Interesse</label>
                            <div className="relative">
                              <select 
                                value={studentData.course} 
                                onChange={e => setStudentData({...studentData, course: e.target.value})} 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 appearance-none"
                              >
                                <option value="">Selecione um curso...</option>
                                {Array.from(new Set(coursesList.map(c => c.category))).sort().map(category => (
                                  <optgroup key={category} label={category} className="font-bold text-[#9A0000]">
                                    {coursesList
                                      .filter(c => c.category === category)
                                      .map(course => (
                                        <option key={course.id} value={course.title} className="text-gray-700 font-normal">
                                          {course.title}
                                        </option>
                                      ))
                                    }
                                  </optgroup>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDown size={16} />
                              </div>
                            </div>
                        </div>
                      </>
                    )}

                    {/* TEACHER FORM */}
                    {activeTab === 'teachers' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome</label>
                            <input required type="text" value={teacherData.name} onChange={e => setTeacherData({...teacherData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Especialidade</label>
                            <input required type="text" value={teacherData.specialty} onChange={e => setTeacherData({...teacherData, specialty: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Instagram (@)</label>
                            <input type="text" value={teacherData.instagram} onChange={e => setTeacherData({...teacherData, instagram: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" />
                          </div>
                          <div>
                             <label className="text-xs font-bold text-gray-500 uppercase ml-1">Foto do Professor</label>
                             <div className="relative">
                               <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                               <div className="w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 text-center text-sm hover:border-[#9A0000] bg-white">
                                 {uploadedImage ? "Foto Selecionada" : "Escolher Foto"}
                               </div>
                             </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* BLOG FORM */}
                    {activeTab === 'blog' && (
                      <>
                        <div className="space-y-4">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Imagem de Capa</label>
                          <div className="relative">
                             <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                             <div className="w-full h-32 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#9A0000] bg-white">
                               {uploadedImage ? <img src={uploadedImage} alt="Preview" className="h-full object-contain" /> : "Clique para adicionar capa"}
                             </div>
                          </div>

                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Título</label>
                          <input type="text" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} placeholder="Título do Artigo" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none text-lg font-bold bg-white text-gray-900 placeholder:text-gray-400" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Categoria</label>
                                <select value={blogData.category} onChange={e => setBlogData({...blogData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900">
                                  <option>Dicas</option><option>Receitas</option><option>Tendências</option><option>Curiosidades</option><option>Confeitaria</option><option>Culinária</option>
                                </select>
                             </div>
                             <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tags (separadas por vírgula)</label>
                                <input type="text" value={blogData.tags} onChange={e => setBlogData({...blogData, tags: e.target.value})} placeholder="Ex: Chocolate, Verão, Vendas" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 placeholder:text-gray-400" />
                             </div>
                          </div>

                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Conteúdo</label>
                          <textarea rows={10} value={blogData.content} onChange={e => setBlogData({...blogData, content: e.target.value})} placeholder="Escreva o conteúdo aqui..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none resize-none bg-white text-gray-900 placeholder:text-gray-400"></textarea>
                        </div>
                      </>
                    )}

                    <div className="flex justify-end pt-6 border-t border-gray-100">
                      <button type="submit" className="bg-[#9A0000] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#7a0000] transition-all shadow-lg flex items-center gap-2">
                        <Save size={20} />
                        {editingId ? 'Salvar Alterações' : 'Criar Registro'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* RESOLUTION MODAL */}
      {resolvingRequest && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-300 relative">
            <button 
              onClick={() => setResolvingRequest(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isNameCorrection ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                {isNameCorrection ? <Edit size={32} /> : <FileCheck size={32} />}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 font-serif">
                {isNameCorrection ? 'Corrigir e Emitir' : 'Reenviar Certificado'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Motivo: <strong className="text-gray-700">{resolvingRequest.reason}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Curso</p>
                <p className="font-bold text-gray-800">{resolvingRequest.courseTitle}</p>
              </div>

              {isNameCorrection ? (
                // CASE 1: CORRECTION (SHOW INPUT)
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
                    Corrigir Nome para: <PenTool size={12} />
                  </label>
                  <input 
                    type="text" 
                    value={correctionName}
                    onChange={(e) => setCorrectionName(e.target.value)}
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9A0000] outline-none bg-white text-gray-900 font-bold"
                    placeholder="Digite o nome correto"
                  />
                  <p className="text-[10px] text-orange-500 mt-2 ml-1 flex items-center gap-1">
                    <AlertTriangle size={10} />
                    Atenção: Isso alterará o cadastro do aluno permanentemente.
                  </p>
                </div>
              ) : (
                // CASE 2: RESEND (SHOW CONFIRMATION TEXT)
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                  <p className="mb-2">
                    O aluno solicitou uma segunda via do arquivo original.
                  </p>
                  <p>
                    O certificado será reenviado para o e-mail cadastrado sem alterações nos dados.
                  </p>
                </div>
              )}

              <button 
                onClick={handleFinalizeResolve}
                className={`w-full text-white py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 mt-4 ${
                  isNameCorrection 
                    ? 'bg-[#9A0000] hover:bg-[#7a0000]' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isNameCorrection ? (
                  <>Salvar e Gerar Novo <Save size={18} /></>
                ) : (
                  <>Confirmar Reenvio <Send size={18} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal?.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 overflow-hidden">
            <button 
              onClick={() => setDeleteModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center p-8 bg-red-50">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 font-serif mb-2">
                Excluir {deleteModal?.type === 'student' ? 'Aluno' : deleteModal?.type === 'course' ? 'Curso' : deleteModal?.type === 'teacher' ? 'Professor' : 'Post'}?
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Tem certeza que deseja excluir <strong className="text-gray-800">"{deleteModal?.name}"</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
