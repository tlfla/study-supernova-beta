#!/usr/bin/env node

// Generate mock surgical tech questions
const categories = [
  'Anatomy & Physiology',
  'Microbiology',
  'Surgical Procedures',
  'Patient Care',
  'Instrumentation',
  'Sterilization',
  'Pharmacology',
  'Medical Ethics',
  'Emergency Procedures',
  'Post-Operative Care'
]

const difficulties = ['easy', 'medium', 'hard']
const tags = [
  'cardiovascular', 'orthopedic', 'neurological', 'gastrointestinal',
  'genitourinary', 'ophthalmic', 'otolaryngologic', 'plastic',
  'pediatric', 'geriatric', 'trauma', 'elective', 'emergency'
]

const questionTemplates = [
  {
    category: 'Anatomy & Physiology',
    templates: [
      'Which of the following structures is responsible for {function} in the {system}?',
      'The {structure} is located in the {location} and functions to {function}.',
      'During {procedure}, the surgical technologist should be aware of the {structure} because {reason}.'
    ]
  },
  {
    category: 'Surgical Procedures',
    templates: [
      'In a {procedure} procedure, the primary incision is typically made in the {location}.',
      'Which instrument is most commonly used during {procedure}?',
      'The sequence of steps in {procedure} includes: {steps}.'
    ]
  },
  {
    category: 'Instrumentation',
    templates: [
      'The {instrument} is used for {purpose} during surgical procedures.',
      'Which of the following instruments would be appropriate for {procedure}?',
      'The {instrument} should be {action} before being passed to the surgeon.'
    ]
  },
  {
    category: 'Sterilization',
    templates: [
      'Which sterilization method is most appropriate for {item}?',
      'The {method} sterilization process requires {requirement} to be effective.',
      'Items sterilized by {method} can be stored for {duration}.'
    ]
  },
  {
    category: 'Patient Care',
    templates: [
      'When positioning a patient for {procedure}, the surgical technologist should ensure {consideration}.',
      'The primary concern during {phase} is {concern}.',
      'Patient safety during {situation} requires {action}.'
    ]
  },
  {
    category: 'Microbiology',
    templates: [
      'Which of the following is the most common cause of {infection} in surgical wounds?',
      'The {organism} is a {type} that can cause {condition} in immunocompromised patients.',
      'Proper {procedure} technique helps prevent {complication} in the operating room.'
    ]
  },
  {
    category: 'Pharmacology',
    templates: [
      'The medication {drug} is used to {purpose} during surgical procedures.',
      'Which of the following is a common side effect of {drug}?',
      'The {drug} should be administered {timing} to be most effective.'
    ]
  },
  {
    category: 'Medical Ethics',
    templates: [
      'Informed consent for {procedure} must include information about {aspect}.',
      'The principle of {principle} requires healthcare providers to {action}.',
      'Patient confidentiality is protected by {regulation} in healthcare settings.'
    ]
  },
  {
    category: 'Emergency Procedures',
    templates: [
      'During a {emergency}, the surgical technologist should {action} first.',
      'The priority in {situation} is to {priority}.',
      'Emergency equipment should be {state} and {location} in the operating room.'
    ]
  },
  {
    category: 'Post-Operative Care',
    templates: [
      'Following {procedure}, patients should be monitored for {complication}.',
      'The {care} phase begins {timing} after surgery is complete.',
      'Discharge instructions for {procedure} should include {instruction}.'
    ]
  }
]

const fillTemplate = (template, variables) => {
  let result = template
  Object.keys(variables).forEach(key => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), variables[key])
  })
  return result
}

const generateQuestion = (id) => {
  const category = categories[Math.floor(Math.random() * categories.length)]
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
  const questionTags = tags.sort(() => 0.5 - Math.random()).slice(0, 3)

  const categoryTemplate = questionTemplates.find(t => t.category === category)
  if (!categoryTemplate) {
    throw new Error(`No template found for category: ${category}`)
  }
  const template = categoryTemplate.templates[Math.floor(Math.random() * categoryTemplate.templates.length)]

  // Generate variables based on category
  let variables = {}
  let question = ''
  let correct = 'A'
  let options = {}
  let rationale = ''

  switch (category) {
    case 'Anatomy & Physiology':
      const systems = ['cardiovascular', 'respiratory', 'digestive', 'nervous', 'muscular', 'skeletal']
      const structures = ['heart', 'lungs', 'liver', 'brain', 'kidneys', 'stomach', 'pancreas']
      const functions = ['pumping blood', 'gas exchange', 'digestion', 'hormone production', 'filtration']

      variables = {
        function: functions[Math.floor(Math.random() * functions.length)],
        system: systems[Math.floor(Math.random() * systems.length)],
        structure: structures[Math.floor(Math.random() * structures.length)],
        location: 'thoracic cavity',
        procedure: 'thoracotomy',
        reason: 'it may be damaged during retraction'
      }

      question = fillTemplate(template, variables)

      // Generate options
      const correctStructure = variables.structure
      const wrongStructures = structures.filter(s => s !== correctStructure)
      const shuffledStructures = [correctStructure, ...wrongStructures.sort(() => 0.5 - Math.random()).slice(0, 3)]
        .sort(() => 0.5 - Math.random())

      correct = 'A' // Will be adjusted based on shuffled position
      shuffledStructures.forEach((structure, index) => {
        const letter = String.fromCharCode(65 + index)
        options[letter] = structure.charAt(0).toUpperCase() + structure.slice(1)
        if (structure === correctStructure) {
          correct = letter
        }
      })

      rationale = `The ${correctStructure} is the correct answer because ${variables.function}.`
      break

    case 'Microbiology':
      const infections = ['surgical site infections', 'pneumonia', 'urinary tract infections', 'bloodstream infections']
      const organisms = ['Staphylococcus aureus', 'Escherichia coli', 'Pseudomonas aeruginosa', 'Candida albicans']
      const types = ['bacterium', 'virus', 'fungus', 'parasite']
      const conditions = ['systemic infection', 'local infection', 'antibiotic resistance', 'sepsis']

      variables = {
        infection: infections[Math.floor(Math.random() * infections.length)],
        organism: organisms[Math.floor(Math.random() * organisms.length)],
        type: types[Math.floor(Math.random() * types.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        procedure: 'aseptic technique',
        complication: 'cross-contamination'
      }

      question = fillTemplate(template, variables)

      if (template.includes('cause')) {
        const correctInfection = variables.infection
        const wrongInfections = infections.filter(i => i !== correctInfection)
        const shuffledInfections = [correctInfection, ...wrongInfections.sort(() => 0.5 - Math.random()).slice(0, 3)]
          .sort(() => 0.5 - Math.random())

        shuffledInfections.forEach((infection, index) => {
          const letter = String.fromCharCode(65 + index)
          options[letter] = infection
          if (infection === correctInfection) {
            correct = letter
          }
        })

        rationale = `${variables.organism} is the most common cause of ${correctInfection}.`
      }
      break

    case 'Pharmacology':
      const drugs = ['lidocaine', 'heparin', 'cefazolin', 'morphine', 'midazolam']
      const purposes = ['local anesthesia', 'anticoagulation', 'antibiotic prophylaxis', 'pain management', 'sedation']
      const sideEffects = ['allergic reaction', 'bleeding', 'nausea', 'respiratory depression', 'hypotension']
      const timings = ['prior to incision', 'during induction', 'post-operatively', 'as needed for pain']

      variables = {
        drug: drugs[Math.floor(Math.random() * drugs.length)],
        purpose: purposes[Math.floor(Math.random() * purposes.length)],
        timing: timings[Math.floor(Math.random() * timings.length)]
      }

      question = fillTemplate(template, variables)

      if (template.includes('side effect')) {
        const correctSideEffect = sideEffects[Math.floor(Math.random() * sideEffects.length)]
        const wrongSideEffects = sideEffects.filter(s => s !== correctSideEffect)
        const shuffledSideEffects = [correctSideEffect, ...wrongSideEffects.sort(() => 0.5 - Math.random()).slice(0, 3)]
          .sort(() => 0.5 - Math.random())

        shuffledSideEffects.forEach((sideEffect, index) => {
          const letter = String.fromCharCode(65 + index)
          options[letter] = sideEffect
          if (sideEffect === correctSideEffect) {
            correct = letter
          }
        })

        rationale = `${correctSideEffect} is a common side effect of ${variables.drug}.`
      }
      break

    case 'Medical Ethics':
      const ethicalProcedures = ['surgery', 'diagnostic procedure', 'experimental treatment']
      const ethicalAspects = ['risks and benefits', 'alternative treatments', 'expected outcomes']
      const ethicalPrinciples = ['autonomy', 'beneficence', 'non-maleficence', 'justice']
      const ethicalActions = ['respect patient wishes', 'act in patient\'s best interest', 'avoid harm', 'treat fairly']
      const ethicalRegulations = ['HIPAA', 'patient privacy laws', 'institutional policies']

      variables = {
        procedure: ethicalProcedures[Math.floor(Math.random() * ethicalProcedures.length)],
        aspect: ethicalAspects[Math.floor(Math.random() * ethicalAspects.length)],
        principle: ethicalPrinciples[Math.floor(Math.random() * ethicalPrinciples.length)],
        action: ethicalActions[Math.floor(Math.random() * ethicalActions.length)],
        regulation: ethicalRegulations[Math.floor(Math.random() * ethicalRegulations.length)]
      }

      question = fillTemplate(template, variables)

      if (template.includes('principle')) {
        const correctPrinciple = variables.principle
        const wrongPrinciples = ethicalPrinciples.filter(p => p !== correctPrinciple)
        const shuffledPrinciples = [correctPrinciple, ...wrongPrinciples.sort(() => 0.5 - Math.random()).slice(0, 3)]
          .sort(() => 0.5 - Math.random())

        shuffledPrinciples.forEach((principle, index) => {
          const letter = String.fromCharCode(65 + index)
          options[letter] = principle
          if (principle === correctPrinciple) {
            correct = letter
          }
        })

        rationale = `The principle of ${correctPrinciple} requires healthcare providers to ${variables.action}.`
      }
      break

    case 'Emergency Procedures':
      const emergencies = ['cardiac arrest', 'massive hemorrhage', 'anaphylaxis', 'malignant hyperthermia']
      const emergencyActions = ['call for help', 'begin CPR', 'administer epinephrine', 'prepare dantrolene']
      const situations = ['code blue', 'trauma activation', 'difficult airway', 'equipment failure']
      const priorities = ['secure airway', 'control bleeding', 'maintain circulation', 'administer medications']
      const states = ['immediately available', 'regularly checked', 'properly maintained']
      const locations = ['easily accessible', 'clearly labeled', 'within reach']

      variables = {
        emergency: emergencies[Math.floor(Math.random() * emergencies.length)],
        action: emergencyActions[Math.floor(Math.random() * emergencyActions.length)],
        situation: situations[Math.floor(Math.random() * situations.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        location: locations[Math.floor(Math.random() * locations.length)]
      }

      question = fillTemplate(template, variables)

      if (template.includes('priority')) {
        const correctPriority = variables.priority
        const wrongPriorities = priorities.filter(p => p !== correctPriority)
        const shuffledPriorities = [correctPriority, ...wrongPriorities.sort(() => 0.5 - Math.random()).slice(0, 3)]
          .sort(() => 0.5 - Math.random())

        shuffledPriorities.forEach((priority, index) => {
          const letter = String.fromCharCode(65 + index)
          options[letter] = priority
          if (priority === correctPriority) {
            correct = letter
          }
        })

        rationale = `The priority in ${variables.situation} is to ${correctPriority}.`
      }
      break

    case 'Post-Operative Care':
      const complications = ['infection', 'bleeding', 'pain', 'atelectasis', 'deep vein thrombosis']
      const careTypes = ['immediate', 'intermediate', 'extended']
      const instructions = ['wound care', 'activity restrictions', 'medication schedules', 'follow-up appointments']

      variables = {
        procedure: 'abdominal surgery',
        complication: complications[Math.floor(Math.random() * complications.length)],
        care: careTypes[Math.floor(Math.random() * careTypes.length)],
        timing: 'immediately',
        instruction: instructions[Math.floor(Math.random() * instructions.length)]
      }

      question = fillTemplate(template, variables)

      if (template.includes('monitored')) {
        const correctComplication = variables.complication
        const wrongComplications = complications.filter(c => c !== correctComplication)
        const shuffledComplications = [correctComplication, ...wrongComplications.sort(() => 0.5 - Math.random()).slice(0, 3)]
          .sort(() => 0.5 - Math.random())

        shuffledComplications.forEach((complication, index) => {
          const letter = String.fromCharCode(65 + index)
          options[letter] = complication
          if (complication === correctComplication) {
            correct = letter
          }
        })

        rationale = `Following ${variables.procedure}, patients should be monitored for ${correctComplication}.`
      }
      break

    case 'Surgical Procedures':
      const surgicalProcedures = ['appendectomy', 'cholecystectomy', 'hernia repair', 'mastectomy', 'hysterectomy']
      const surgicalLocations = ['right lower quadrant', 'upper right quadrant', 'inguinal region', 'breast tissue', 'pelvic area']
      const surgicalInstruments = ['scalpel', 'forceps', 'scissors', 'retractor', 'clamp']

      variables = {
        procedure: surgicalProcedures[Math.floor(Math.random() * surgicalProcedures.length)],
        location: surgicalLocations[Math.floor(Math.random() * surgicalLocations.length)],
        instrument: surgicalInstruments[Math.floor(Math.random() * surgicalInstruments.length)],
        steps: 'incision, dissection, ligation, closure',
        action: 'sterilized and prepared'
      }

      question = fillTemplate(template, variables)

      if (template.includes('incision')) {
        const correctLocation = variables.location
        const wrongLocations = surgicalLocations.filter(l => l !== correctLocation)
        const shuffledLocations = [correctLocation, ...wrongLocations.sort(() => 0.5 - Math.random()).slice(0, 3)]
          .sort(() => 0.5 - Math.random())

        shuffledLocations.forEach((location, index) => {
          const letter = String.fromCharCode(65 + index)
          options[letter] = location
          if (location === correctLocation) {
            correct = letter
          }
        })

        rationale = `The primary incision for ${variables.procedure} is made in the ${correctLocation}.`
      } else if (template.includes('instrument')) {
        const correctInstrument = variables.instrument
        const wrongInstruments = surgicalInstruments.filter(i => i !== correctInstrument)
        const shuffledInstruments = [correctInstrument, ...wrongInstruments.sort(() => 0.5 - Math.random()).slice(0, 3)]
          .sort(() => 0.5 - Math.random())

        shuffledInstruments.forEach((instrument, index) => {
          const letter = String.fromCharCode(65 + index)
          options[letter] = instrument
          if (instrument === correctInstrument) {
            correct = letter
          }
        })

        rationale = `The ${correctInstrument} is most commonly used during ${variables.procedure}.`
      }
      break

    case 'Instrumentation':
      const instrumentPurposes = ['grasping tissue', 'cutting suture', 'clamping vessels', 'retracting incisions', 'suctioning fluids']
      const instrumentList = ['Kocher forceps', 'Allis forceps', 'Pean forceps', 'Kelly forceps', 'Crile forceps']

      variables = {
        instrument: 'Kocher forceps',
        purpose: instrumentPurposes[Math.floor(Math.random() * instrumentPurposes.length)],
        procedure: 'abdominal surgery',
        action: 'tested for proper function'
      }

      question = fillTemplate(template, variables)

      const correctInstrument = variables.instrument
      const wrongInstruments = instrumentList.filter(i => i !== correctInstrument)
      const shuffledInstruments = [correctInstrument, ...wrongInstruments.sort(() => 0.5 - Math.random()).slice(0, 3)]
        .sort(() => 0.5 - Math.random())

      shuffledInstruments.forEach((instrument, index) => {
        const letter = String.fromCharCode(65 + index)
        options[letter] = instrument
        if (instrument === correctInstrument) {
          correct = letter
        }
      })

      rationale = `The ${correctInstrument} is used for ${variables.purpose}.`
      break

    case 'Sterilization':
      const sterilizationMethods = ['steam', 'ethylene oxide', 'hydrogen peroxide plasma', 'dry heat']
      const items = ['surgical instruments', 'heat-sensitive plastics', 'electronic equipment', 'linen packs']

      variables = {
        method: sterilizationMethods[Math.floor(Math.random() * sterilizationMethods.length)],
        item: items[Math.floor(Math.random() * items.length)],
        requirement: 'proper packaging and exposure time',
        duration: '30 days if properly stored'
      }

      question = fillTemplate(template, variables)

      const correctMethod = variables.method
      const wrongMethods = sterilizationMethods.filter(m => m !== correctMethod)
      const shuffledMethods = [correctMethod, ...wrongMethods.sort(() => 0.5 - Math.random()).slice(0, 3)]
        .sort(() => 0.5 - Math.random())

      shuffledMethods.forEach((method, index) => {
        const letter = String.fromCharCode(65 + index)
        options[letter] = method
        if (method === correctMethod) {
          correct = letter
        }
      })

      rationale = `${correctMethod} sterilization is most appropriate for ${variables.item}.`
      break

    case 'Patient Care':
      const carePhases = ['preoperative', 'intraoperative', 'postoperative']
      const careSituations = ['positioning', 'monitoring', 'transport', 'medication administration']

      variables = {
        procedure: 'spinal surgery',
        phase: carePhases[Math.floor(Math.random() * carePhases.length)],
        concern: 'patient safety and comfort',
        situation: careSituations[Math.floor(Math.random() * careSituations.length)],
        action: 'maintain proper body alignment',
        consideration: 'protection of pressure points'
      }

      question = fillTemplate(template, variables)

      if (template.includes('positioning')) {
        const correctConsideration = variables.consideration
        const wrongConsiderations = ['quick procedure completion', 'minimal staff involvement', 'reduced monitoring', 'immediate ambulation']
        const shuffledConsiderations = [correctConsideration, ...wrongConsiderations.sort(() => 0.5 - Math.random()).slice(0, 3)]
          .sort(() => 0.5 - Math.random())

        shuffledConsiderations.forEach((consideration, index) => {
          const letter = String.fromCharCode(65 + index)
          options[letter] = consideration
          if (consideration === correctConsideration) {
            correct = letter
          }
        })

        rationale = `Patient positioning requires ${correctConsideration} to prevent injury.`
      }
      break
  }

  return {
    id: `question-${id}`,
    category,
    question,
    options,
    correct,
    rationale,
    difficulty,
    tags: questionTags
  }
}

// Generate 60 questions
const questions = []
for (let i = 1; i <= 60; i++) {
  questions.push(generateQuestion(i))
}

console.log(JSON.stringify(questions, null, 2))
