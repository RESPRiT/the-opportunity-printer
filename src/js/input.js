const STAGES = {
  intro: 'INTRODUCTION',
  skillsSeeking: 'SKILLS_SEEKING',
  skillsEmploying: 'SKILLS_EMPLOYING',
  interests: 'INTERESTS',
  personality: 'PERSONALITY',
};

const ROLES = {
  seeking: '1',
  employing: '2',
  checking: '#'
};

const EMPLOYING_QUESTIONS = {
  tech: {
    text: 'Rank your need (by pressing a number from 1–9) for an individual with skills in TECHNOLOGY and PROGRAMMING',
    input: /[1-9]/,
    store: true
  },
  business: {
    text: 'Rank your need (1–9) for an individual with skills in BUSINESS and MANAGEMENT',
    input: /[1-9]/,
    store: true
  },
  design: {
    text: 'Rank your need (1–9) for an individual with skills in DESIGN and ART',
    input: /[1-9]/,
    store: true
  }
};

const SEEKING_QUESTIONS = {
  tech: {
    text: 'Rank your skills (by pressing a number from 1–9) in TECHNOLOGY and PROGRAMMING',
    input: /[1-9]/,
    store: true
  },
  business: {
    text: 'Rank your skills (1–9) in BUSINESS and MANAGEMENT',
    input: /[1-9]/,
    store: true
  },
  design: {
    text: 'Rank your skills (1–9) in DESIGN and ART',
    input: /[1-9]/,
    store: true
  }
};

const INTEREST_QUESTIONS = {
  politics: {
    text: 'Rank your interest (1-9) in POLITICS and SOCIAL ISSUES',
    input: /[1-9]/,
    store: true
  },
  finance: {
    text: 'Rank your interest (1-9) in FINANCE and ENTREPRENEURSHIP',
    input: /[1-9]/,
    store: true
  },
  arts: {
    text: 'Rank your interest (1-9) in MUSEUMS and CONCERTS',
    input: /[1-9]/,
    store: true
  }
};

const PERSONALITY_QUESTIONS = {
  city: {
    text: 'Choose your favorite city: Press 1 for LONDON, 2 for NEW YORK, 3 for SAN FRANCISCO, 4 for TOKYO, 5 for SEATTLE, 6 for PARIS, 7 for LOS ANGELES, 8 for DUBAI, or 9 for MUMBAI',
    input: /[1-9]/,
    store: true
  },
  animal: {
    text: 'Press 1 if you are a DOG person, 2 if you are a CAT person, or 3 if you are INDIFFERENT',
    input: /[1-3]/,
    store: true
  }
};

const INTRODUCTION = {
  role: {
    text: 'Welcome to the Collaboration Station, press 1, 2, or type # followed by an ID to check messages or to leave a message',
    // determine exceptable input from ROLES keys
    input: new RegExp(`[${Object.values(ROLES).join('')}]`),
    store: true
  },
  employing: {
    text: 'Let’s add your project and find the right people to work with you! (Press + to continue)',
    input: /\+/,
    store: false
  },
  seeking: {
    text: 'Let’s find a project for you! First, please answer a few quick questions to help us find the best matches for you. (Press + to continue)',
    input: /\+/,
    store: false
  },
  checking: {
    text: 'Please input your ID number! (Press + when finished)',
    input: /[0-9\+]/,
    store: true
  }
};

const CONCLUSION = {
  seeking: {
    text: 'Please pull the lever to receive your matches!',
    input: /./,
    store: false
  },
  employing: {
    text: 'Please pull the lever to receive your ID!',
    input: /./,
    store: false
  }
};

let state = {
  role: null,
  currentStage: INTRODUCTION.role,
  responses: null
};

let log = str => document.querySelector('.out').textContent = str;

let handleInput = (keyName) => {
  // determine if we should do anything
  if(!keyName.match(state.currentStage.input)) {
    console.log(`${keyName} does not match ${state.currentStage.input}`);
    return;
  } else {
    console.log(`Got ${keyName}`);
  }

  // check if there's currently a role in progress
  if(state.role == null) {
    state.role = keyName;
    state.responses = {};
    
    // update stage
    switch(state.role) {
      case ROLES.seeking:
        state.currentStage = INTRODUCTION.seeking;
        break;
      case ROLES.checking:
        state.currentStage = INTRODUCTION.checking;
        break;
      case ROLES.employing:
        state.currentStage = INTRODUCTION.employing;
        break;
    }
  } else {
    // do something based on current stage
    switch(state.role) {
      case ROLES.seeking:
        handleSeeking(keyName);
        break;
      case ROLES.employing:
        handleEmploying(keyName);
        break;
      case ROLES.checking:
        // TODO: Implement the voicemail system
        //handleChecking(keyName);
        break;
    }
  }

  log(state.currentStage.text);
};

let handleSeeking = (keyName) => {
  switch(state.currentStage) {
    case INTRODUCTION.seeking:
      state.currentStage = SEEKING_QUESTIONS.tech;
      break;
    case SEEKING_QUESTIONS.tech:
      state.currentStage = SEEKING_QUESTIONS.business;
      state.responses['tech'] = keyName;
      break;
    case SEEKING_QUESTIONS.business:
      state.currentStage = SEEKING_QUESTIONS.design;
      state.responses['business'] = keyName;
      break;
    case SEEKING_QUESTIONS.design:
      state.currentStage = INTEREST_QUESTIONS.politics;
      state.responses['design'] = keyName;
      break;
    case INTEREST_QUESTIONS.politics:
      state.currentStage = INTEREST_QUESTIONS.finance;
      state.responses['politics'] = keyName;
      break;
    case INTEREST_QUESTIONS.finance:
      state.currentStage = INTEREST_QUESTIONS.arts;
      state.responses['finance'] = keyName;
      break;
    case INTEREST_QUESTIONS.arts:
      state.currentStage = PERSONALITY_QUESTIONS.city;
      state.responses['arts'] = keyName;
      break;
    case PERSONALITY_QUESTIONS.city:
      state.currentStage = PERSONALITY_QUESTIONS.animal;
      state.responses['city'] = keyName;
      break;
    case PERSONALITY_QUESTIONS.animal:
      state.currentStage = CONCLUSION.seeking;
      state.responses['animal'] = keyName;
      break;
    case CONCLUSION.seeking:
      state.currentStage = INTRODUCTION.role;
      state.role = null;
      // TODO: find and print matches
      break;
  }
};

let handleEmploying = (keyName) => {
  switch(state.currentStage) {
    case INTRODUCTION.employing:
      state.currentStage = EMPLOYING_QUESTIONS.tech;
      break;
    case EMPLOYING_QUESTIONS.tech:
      state.currentStage = EMPLOYING_QUESTIONS.business;
      state.responses['tech'] = keyName;
      break;
    case EMPLOYING_QUESTIONS.business:
      state.currentStage = EMPLOYING_QUESTIONS.design;
      state.responses['business'] = keyName;
      break;
    case EMPLOYING_QUESTIONS.design:
      state.currentStage = INTEREST_QUESTIONS.politics;
      state.responses['design'] = keyName;
      break;
    case INTEREST_QUESTIONS.politics:
      state.currentStage = INTEREST_QUESTIONS.finance;
      state.responses['politics'] = keyName;
      break;
    case INTEREST_QUESTIONS.finance:
      state.currentStage = INTEREST_QUESTIONS.arts;
      state.responses['finance'] = keyName;
      break;
    case INTEREST_QUESTIONS.arts:
      state.currentStage = PERSONALITY_QUESTIONS.city;
      state.responses['arts'] = keyName;
      break;
    case PERSONALITY_QUESTIONS.city:
      state.currentStage = PERSONALITY_QUESTIONS.animal;
      state.responses['city'] = keyName;
      break;
    case PERSONALITY_QUESTIONS.animal:
      state.currentStage = CONCLUSION.employing;
      state.responses['animal'] = keyName;
      break;
    case CONCLUSION.employing:
      state.currentStage = INTRODUCTION.role;
      state.role = null;
      // TODO: print ID
      break;
  }
};

// numpad events
document.addEventListener('keypress', (event) => {
  const keyName = event.key;
  handleInput(keyName);
});

// main
log(state.currentStage.text);