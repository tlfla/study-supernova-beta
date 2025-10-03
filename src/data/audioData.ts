export interface AudioContent {
  id: string
  title: string
  description: string
  file_url: string
  duration_seconds: number
  type: 'qa' | 'study_guide'
  category: string
  keywords: string[]
  created_at: string
  is_active: boolean
}

// Mock audio content data
export const mockAudioContent: AudioContent[] = [
  {
    id: 'audio-1',
    title: 'Surgical Procedures Q&A Session 1',
    description: 'Common questions about basic surgical procedures, sterile technique, and operating room protocols',
    file_url: 'https://cdn.example.com/audio/surgical-procedures-qa-1.mp3',
    duration_seconds: 2700, // 45 min
    type: 'qa',
    category: 'Surgical Procedures',
    keywords: ['procedures', 'sterile technique', 'OR protocols', 'basic surgery'],
    created_at: '2024-01-15T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-2',
    title: 'General Surgery Study Guide',
    description: 'Comprehensive overview of general surgery principles, patient preparation, and surgical team roles',
    file_url: 'https://cdn.example.com/audio/general-surgery-guide.mp3',
    duration_seconds: 3600, // 60 min
    type: 'study_guide',
    category: 'General Surgery',
    keywords: ['general surgery', 'patient prep', 'surgical team', 'principles'],
    created_at: '2024-01-10T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-3',
    title: 'Sterilization Techniques Deep Dive',
    description: 'Complete guide to sterilization methods, equipment handling, and contamination prevention',
    file_url: 'https://pub-a0256e55e50541f88412507bf8c0ece6.r2.dev/AG%20STERILIZATION%201SG.mp3',
    duration_seconds: 2400, // 40 min
    type: 'study_guide',
    category: 'Sterilization',
    keywords: ['sterilization', 'autoclaving', 'contamination', 'equipment'],
    created_at: '2024-01-12T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-4',
    title: 'Sterilization Q&A',
    description: 'Frequently asked questions about sterilization processes and best practices',
    file_url: 'https://pub-a0256e55e50541f88412507bf8c0ece6.r2.dev/AG%20STERILIZATION%201QA.mp3',
    duration_seconds: 1800, // 30 min
    type: 'qa',
    category: 'Sterilization',
    keywords: ['sterilization', 'Q&A', 'best practices', 'processes'],
    created_at: '2024-01-14T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-5',
    title: 'Anatomy & Physiology Q&A Session',
    description: 'Questions covering body systems, organ functions, and anatomical relationships',
    file_url: 'https://cdn.example.com/audio/anatomy-qa.mp3',
    duration_seconds: 3300, // 55 min
    type: 'qa',
    category: 'Anatomy & Physiology',
    keywords: ['anatomy', 'physiology', 'body systems', 'organs'],
    created_at: '2024-01-08T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-6',
    title: 'Instrumentation Basics',
    description: 'Essential surgical instruments, their uses, and proper handling techniques',
    file_url: 'https://cdn.example.com/audio/instrumentation-basics.mp3',
    duration_seconds: 2100, // 35 min
    type: 'study_guide',
    category: 'Instrumentation',
    keywords: ['instruments', 'surgical tools', 'handling', 'basics'],
    created_at: '2024-01-09T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-7',
    title: 'Patient Care Fundamentals',
    description: 'Patient safety, positioning, and preoperative/postoperative care essentials',
    file_url: 'https://cdn.example.com/audio/patient-care.mp3',
    duration_seconds: 2700, // 45 min
    type: 'study_guide',
    category: 'Patient Care',
    keywords: ['patient care', 'safety', 'positioning', 'preop', 'postop'],
    created_at: '2024-01-11T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-8',
    title: 'Pharmacology Q&A',
    description: 'Common surgical medications, anesthesia basics, and drug interactions',
    file_url: 'https://cdn.example.com/audio/pharmacology-qa.mp3',
    duration_seconds: 2400, // 40 min
    type: 'qa',
    category: 'Pharmacology',
    keywords: ['pharmacology', 'medications', 'anesthesia', 'drugs'],
    created_at: '2024-01-13T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-9',
    title: 'Microbiology Study Guide',
    description: 'Microorganisms in surgery, infection control, and aseptic technique',
    file_url: 'https://cdn.example.com/audio/microbiology-guide.mp3',
    duration_seconds: 2700, // 45 min
    type: 'study_guide',
    category: 'Microbiology',
    keywords: ['microbiology', 'infection control', 'aseptic', 'microorganisms'],
    created_at: '2024-01-07T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-10',
    title: 'General Surgery Advanced Topics',
    description: 'Complex procedures, emergency situations, and advanced surgical techniques',
    file_url: 'https://cdn.example.com/audio/general-surgery-advanced.mp3',
    duration_seconds: 3900, // 65 min
    type: 'study_guide',
    category: 'General Surgery',
    keywords: ['advanced', 'complex procedures', 'emergency', 'techniques'],
    created_at: '2024-01-16T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-11',
    title: 'Medical Ethics in Surgery',
    description: 'Ethical considerations, patient rights, and professional responsibilities',
    file_url: 'https://cdn.example.com/audio/medical-ethics.mp3',
    duration_seconds: 1800, // 30 min
    type: 'study_guide',
    category: 'Medical Ethics',
    keywords: ['ethics', 'patient rights', 'responsibilities', 'professional'],
    created_at: '2024-01-06T10:00:00Z',
    is_active: true
  },
  {
    id: 'audio-12',
    title: 'Emergency Procedures Q&A',
    description: 'Critical emergency responses, code protocols, and rapid intervention techniques',
    file_url: 'https://cdn.example.com/audio/emergency-qa.mp3',
    duration_seconds: 2100, // 35 min
    type: 'qa',
    category: 'Emergency Procedures',
    keywords: ['emergency', 'code blue', 'critical care', 'rapid response'],
    created_at: '2024-01-05T10:00:00Z',
    is_active: true
  }
]

// Helper function to group audio by category
export const getAudioByCategory = (audioFiles: AudioContent[]) => {
  const categoryMap = new Map<string, AudioContent[]>()
  
  audioFiles
    .filter(audio => audio.is_active)
    .forEach(audio => {
      const existing = categoryMap.get(audio.category) || []
      categoryMap.set(audio.category, [...existing, audio])
    })
  
  return categoryMap
}

// All categories for browse page
export interface AudioCategorySummary {
  category: string
  fileCount: number
  totalDuration: number // in seconds
  hasFiles: boolean
}

export const allAudioCategories: AudioCategorySummary[] = [
  { category: 'General Surgery', fileCount: 0, totalDuration: 0, hasFiles: true },
  { category: 'Sterilization', fileCount: 0, totalDuration: 0, hasFiles: true },
  { category: 'Anatomy & Physiology', fileCount: 0, totalDuration: 0, hasFiles: true },
  { category: 'Cardiovascular', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Emergency Procedures', fileCount: 0, totalDuration: 0, hasFiles: true },
  { category: 'Genitourinary', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Instrumentation', fileCount: 0, totalDuration: 0, hasFiles: true },
  { category: 'Medical Ethics', fileCount: 0, totalDuration: 0, hasFiles: true },
  { category: 'Microbiology', fileCount: 0, totalDuration: 0, hasFiles: true },
  { category: 'Neurology', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Obstetrics and Gynecology', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Ophthalmic', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Orthopedic', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Otorhinolaryngology', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Patient Care', fileCount: 0, totalDuration: 0, hasFiles: true },
  { category: 'Peripheral Vascular', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Pharmacology', fileCount: 0, totalDuration: 0, hasFiles: true },
  { category: 'Plastics and Reconstructive', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Postoperative', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Preoperative', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Professional and Administrative Responsibilities', fileCount: 0, totalDuration: 0, hasFiles: false },
  { category: 'Surgical Procedures', fileCount: 0, totalDuration: 0, hasFiles: true }
]

// Helper function to get category summary with actual data
export const getCategorySummary = (audioFiles: AudioContent[]): AudioCategorySummary[] => {
  const grouped = getAudioByCategory(audioFiles)
  
  // Update allAudioCategories with actual file counts
  return allAudioCategories.map(cat => {
    const files = grouped.get(cat.category) || []
    return {
      ...cat,
      fileCount: files.length,
      totalDuration: files.reduce((sum, file) => sum + file.duration_seconds, 0),
      hasFiles: files.length > 0
    }
  })
}

// Get total stats for all audio
export const getAudioStats = (audioFiles: AudioContent[]) => {
  const activeFiles = audioFiles.filter(f => f.is_active)
  const categories = new Set(activeFiles.map(f => f.category))
  
  return {
    totalCategories: categories.size,
    totalFiles: activeFiles.length
  }
}

// Format duration for display
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes} min`
}

