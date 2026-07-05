import type { Congratulation, Stats, Student } from '@/types'

export const student: Student = {
  name: 'نورة العتيبي',
  nameEn: 'Noura Al-Otaibi',
  university: 'جامعة الملك سعود',
  universityEn: 'King Saud University',
  major: 'علوم الحاسب',
  majorEn: 'Computer Science',
  graduationYear: 2026,
  profileImage:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
}

export const initialCongratulations: Congratulation[] = [
  {
    id: '1',
    senderName: 'أحمد الشمري',
    message: 'مبروك التخرج يا نورة! فخور بكِ دائماً، مستقبلكِ مشرق بإذن الله ✨',
    createdAt: new Date('2026-06-15'),
  },
  {
    id: '2',
    senderName: 'سارة القحطاني',
    message: 'تهانينا الحارة! رحلة رائعة انتهت وبداية أجمل تنتظركِ 🎓',
    createdAt: new Date('2026-06-16'),
  },
  {
    id: '3',
    senderName: 'محمد الدوسري',
    message: 'كل التوفيق في مسيرتكِ المهنية، أنتِ تستحقين كل خير',
    createdAt: new Date('2026-06-17'),
  },
  {
    id: '4',
    senderName: 'فاطمة الزهراني',
    message: 'فخورة بصديقتي المتفوقة! مبروك التخرج يا جميلة 🌟',
    createdAt: new Date('2026-06-18'),
  },
  {
    id: '5',
    senderName: 'خالد العمري',
    message: 'إنجاز يستحق الاحتفال، مبروك وبالتوفيق دائماً',
    createdAt: new Date('2026-06-19'),
  },
  {
    id: '6',
    senderName: 'ريم الحربي',
    message: 'يوم تستحقين فيه كل الفرح، مبروك التخرج حبيبتي 💫',
    createdAt: new Date('2026-06-20'),
  },
  {
    id: '7',
    senderName: 'عبدالله المطيري',
    message: 'من التميز إلى التميز، مبروك يا نورة!',
    createdAt: new Date('2026-06-21'),
  },
  {
    id: '8',
    senderName: 'لينا السبيعي',
    message: 'ذكريات الجامعة لن تُنسى، ومستقبلكِ أجمل بكثير 🎉',
    createdAt: new Date('2026-06-22'),
  },
]

export const stats: Stats = {
  totalCongratulations: 247,
  totalVisitors: 1834,
  photosShared: 56,
  todaysWishes: 23,
  todayVisitors: 45,
  activeVisitors: 3,
}

export const galleryImages = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf6f?w=600&h=700&fit=crop',
  'https://images.unsplash.com/photo-1627556701792-7b12506d4d66?w=600&h=500&fit=crop',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=650&fit=crop',
]

export const aiKeywords = [
  { word: 'فخر', size: 32 },
  { word: 'مبروك', size: 40 },
  { word: 'نجاح', size: 28 },
  { word: 'مستقبل', size: 24 },
  { word: 'تفوق', size: 30 },
  { word: 'إلهام', size: 22 },
  { word: 'احتفال', size: 26 },
  { word: 'تميز', size: 28 },
  { word: 'فرح', size: 24 },
  { word: 'أحلام', size: 20 },
]

export const emotionData = [
  { label: 'فرح', value: 78, color: '#c9a962' },
  { label: 'فخر', value: 65, color: '#a68b4b' },
  { label: 'إلهام', value: 52, color: '#e8d5a3' },
  { label: 'امتنان', value: 45, color: '#8a8279' },
]

export const bestMessages = [
  'مبروك التخرج يا نورة! فخور بكِ دائماً، مستقبلكِ مشرق بإذن الله',
  'فخورة بصديقتي المتفوقة! مبروك التخرج يا جميلة',
  'ذكريات الجامعة لن تُنسى، ومستقبلكِ أجمل بكثير',
]
