export interface FlashcardData {
  id: string
  type: 'terminology' | 'instruments' | 'anatomy'
  category: string
  // Terminology
  term?: string
  definition?: string
  audioUrl?: string
  // Visual cards
  question?: string
  imageUrl?: string
  answer?: string
  explanation?: string
}

export const terminologyFlashcards: FlashcardData[] = [
  {
    id: 'term-1',
    type: 'terminology',
    category: 'Anatomy & Physiology',
    term: '-ectomy',
    definition: 'Surgical removal of a body part or tissue. Example: Appendectomy (removal of the appendix)',
    audioUrl: '/audio/ectomy.mp3'
  },
  {
    id: 'term-2',
    type: 'terminology',
    category: 'Surgical Procedures',
    term: '-ostomy',
    definition: 'Creation of an artificial opening. Example: Colostomy (opening in the colon)',
    audioUrl: '/audio/ostomy.mp3'
  },
  {
    id: 'term-3',
    type: 'terminology',
    category: 'Anatomy & Physiology',
    term: '-otomy',
    definition: 'Surgical incision into a body part. Example: Laparotomy (incision into the abdominal wall)',
    audioUrl: '/audio/otomy.mp3'
  },
  {
    id: 'term-4',
    type: 'terminology',
    category: 'Surgical Procedures',
    term: '-plasty',
    definition: 'Surgical repair or reconstruction. Example: Rhinoplasty (nose reconstruction)',
    audioUrl: '/audio/plasty.mp3'
  },
  {
    id: 'term-5',
    type: 'terminology',
    category: 'Anatomy & Physiology',
    term: '-rrhaphy',
    definition: 'Surgical suturing or stitching. Example: Herniorrhaphy (repair of a hernia)',
    audioUrl: '/audio/rrhaphy.mp3'
  },
  {
    id: 'term-6',
    type: 'terminology',
    category: 'Surgical Procedures',
    term: '-scopy',
    definition: 'Visual examination using an instrument. Example: Arthroscopy (examination of a joint)',
    audioUrl: '/audio/scopy.mp3'
  },
  {
    id: 'term-7',
    type: 'terminology',
    category: 'Anatomy & Physiology',
    term: 'Asepsis',
    definition: 'The absence of disease-causing microorganisms; sterile condition',
    audioUrl: '/audio/asepsis.mp3'
  },
  {
    id: 'term-8',
    type: 'terminology',
    category: 'Sterilization',
    term: 'Autoclave',
    definition: 'A device that uses steam under pressure to sterilize surgical instruments and materials',
    audioUrl: '/audio/autoclave.mp3'
  },
  {
    id: 'term-9',
    type: 'terminology',
    category: 'Patient Care',
    term: 'Hemostasis',
    definition: 'The process of stopping bleeding or hemorrhage',
    audioUrl: '/audio/hemostasis.mp3'
  },
  {
    id: 'term-10',
    type: 'terminology',
    category: 'Anatomy & Physiology',
    term: 'Proximal',
    definition: 'Closer to the point of attachment or origin; opposite of distal',
    audioUrl: '/audio/proximal.mp3'
  },
  {
    id: 'term-11',
    type: 'terminology',
    category: 'Anatomy & Physiology',
    term: 'Distal',
    definition: 'Farther from the point of attachment or origin; opposite of proximal',
    audioUrl: '/audio/distal.mp3'
  },
  {
    id: 'term-12',
    type: 'terminology',
    category: 'Surgical Procedures',
    term: 'Anastomosis',
    definition: 'Surgical connection between two structures, such as blood vessels or intestines',
    audioUrl: '/audio/anastomosis.mp3'
  }
]

export const instrumentsFlashcards: FlashcardData[] = [
  {
    id: 'inst-1',
    type: 'instruments',
    category: 'Instrumentation',
    question: 'What is this surgical instrument?',
    imageUrl: '/images/scalpel.jpg',
    answer: 'Scalpel',
    explanation: 'A small, sharp knife used for making incisions in surgical procedures. Available in various blade sizes (#10, #11, #15, etc.)'
  },
  {
    id: 'inst-2',
    type: 'instruments',
    category: 'Instrumentation',
    question: 'What is this surgical instrument?',
    imageUrl: '/images/forceps.jpg',
    answer: 'Kelly Forceps',
    explanation: 'Hemostatic forceps used for clamping blood vessels and securing tissue. Features curved or straight tips with serrated jaws.'
  },
  {
    id: 'inst-3',
    type: 'instruments',
    category: 'Instrumentation',
    question: 'What is this surgical instrument?',
    imageUrl: '/images/retractor.jpg',
    answer: 'Retractor',
    explanation: 'Used to hold back tissue and organs to provide better visualization of the surgical site.'
  },
  {
    id: 'inst-4',
    type: 'instruments',
    category: 'Instrumentation',
    question: 'What is this surgical instrument?',
    imageUrl: '/images/scissors.jpg',
    answer: 'Mayo Scissors',
    explanation: 'Heavy-duty scissors used for cutting thick tissue, sutures, and bandages. Available in straight or curved variations.'
  },
  {
    id: 'inst-5',
    type: 'instruments',
    category: 'Instrumentation',
    question: 'What is this surgical instrument?',
    imageUrl: '/images/needle-holder.jpg',
    answer: 'Needle Holder',
    explanation: 'Used to grasp and guide surgical needles during suturing. Features a locking mechanism for secure grip.'
  },
  {
    id: 'inst-6',
    type: 'instruments',
    category: 'Instrumentation',
    question: 'What is this surgical instrument?',
    imageUrl: '/images/tissue-forceps.jpg',
    answer: 'Tissue Forceps',
    explanation: 'Thumb forceps used for grasping and holding tissue. May have teeth for better grip or be smooth (non-toothed).'
  },
  {
    id: 'inst-7',
    type: 'instruments',
    category: 'Instrumentation',
    question: 'What is this surgical instrument?',
    imageUrl: '/images/towel-clamps.jpg',
    answer: 'Towel Clamps',
    explanation: 'Used to secure surgical drapes and towels to the patient or surgical field. Has sharp penetrating tips.'
  },
  {
    id: 'inst-8',
    type: 'instruments',
    category: 'Instrumentation',
    question: 'What is this surgical instrument?',
    imageUrl: '/images/suction.jpg',
    answer: 'Yankauer Suction',
    explanation: 'Rigid suction device used to remove blood, fluids, and debris from the surgical site during procedures.'
  },
  {
    id: 'inst-9',
    type: 'instruments',
    category: 'Instrumentation',
    question: 'What is this surgical instrument?',
    imageUrl: '/images/metzenbaum.jpg',
    answer: 'Metzenbaum Scissors',
    explanation: 'Delicate scissors designed for cutting fine tissue. Longer and thinner than Mayo scissors.'
  },
  {
    id: 'inst-10',
    type: 'instruments',
    category: 'Instrumentation',
    question: 'What is this surgical instrument?',
    imageUrl: '/images/mosquito.jpg',
    answer: 'Mosquito Forceps',
    explanation: 'Small hemostatic forceps used for clamping small blood vessels and delicate tissue.'
  }
]

export const anatomyFlashcards: FlashcardData[] = [
  {
    id: 'anat-1',
    type: 'anatomy',
    category: 'Anatomy & Physiology',
    question: 'What body system is this?',
    imageUrl: '/images/cardiovascular.jpg',
    answer: 'Cardiovascular System',
    explanation: 'Responsible for circulating blood throughout the body. Includes the heart, blood vessels (arteries, veins, capillaries), and blood.'
  },
  {
    id: 'anat-2',
    type: 'anatomy',
    category: 'Anatomy & Physiology',
    question: 'What body system is this?',
    imageUrl: '/images/respiratory.jpg',
    answer: 'Respiratory System',
    explanation: 'Responsible for gas exchange. Includes the nose, pharynx, larynx, trachea, bronchi, and lungs. Delivers oxygen and removes carbon dioxide.'
  },
  {
    id: 'anat-3',
    type: 'anatomy',
    category: 'Anatomy & Physiology',
    question: 'What body system is this?',
    imageUrl: '/images/digestive.jpg',
    answer: 'Digestive System',
    explanation: 'Breaks down food and absorbs nutrients. Includes mouth, esophagus, stomach, small intestine, large intestine, liver, and pancreas.'
  },
  {
    id: 'anat-4',
    type: 'anatomy',
    category: 'Anatomy & Physiology',
    question: 'What body system is this?',
    imageUrl: '/images/nervous.jpg',
    answer: 'Nervous System',
    explanation: 'Controls body functions through electrical signals. Includes the brain, spinal cord, and peripheral nerves. Central and peripheral divisions.'
  },
  {
    id: 'anat-5',
    type: 'anatomy',
    category: 'Anatomy & Physiology',
    question: 'What body system is this?',
    imageUrl: '/images/skeletal.jpg',
    answer: 'Skeletal System',
    explanation: 'Provides structure and support. Includes 206 bones, joints, and cartilage. Protects organs and enables movement with muscles.'
  },
  {
    id: 'anat-6',
    type: 'anatomy',
    category: 'Anatomy & Physiology',
    question: 'What body system is this?',
    imageUrl: '/images/muscular.jpg',
    answer: 'Muscular System',
    explanation: 'Enables movement and maintains posture. Includes skeletal, smooth, and cardiac muscle. Works with skeletal system for locomotion.'
  },
  {
    id: 'anat-7',
    type: 'anatomy',
    category: 'Anatomy & Physiology',
    question: 'What body system is this?',
    imageUrl: '/images/lymphatic.jpg',
    answer: 'Lymphatic System',
    explanation: 'Part of immune system. Includes lymph nodes, spleen, thymus, and lymphatic vessels. Filters pathogens and maintains fluid balance.'
  },
  {
    id: 'anat-8',
    type: 'anatomy',
    category: 'Anatomy & Physiology',
    question: 'What body system is this?',
    imageUrl: '/images/urinary.jpg',
    answer: 'Urinary System',
    explanation: 'Filters blood and removes waste. Includes kidneys, ureters, bladder, and urethra. Regulates water and electrolyte balance.'
  },
  {
    id: 'anat-9',
    type: 'anatomy',
    category: 'Anatomy & Physiology',
    question: 'What body system is this?',
    imageUrl: '/images/endocrine.jpg',
    answer: 'Endocrine System',
    explanation: 'Regulates body functions through hormones. Includes pituitary, thyroid, adrenal glands, pancreas. Controls metabolism, growth, reproduction.'
  },
  {
    id: 'anat-10',
    type: 'anatomy',
    category: 'Anatomy & Physiology',
    question: 'What body system is this?',
    imageUrl: '/images/integumentary.jpg',
    answer: 'Integumentary System',
    explanation: 'Body\'s protective covering. Includes skin, hair, nails, and glands. Regulates temperature and prevents infection.'
  }
]

