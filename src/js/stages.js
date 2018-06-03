const ROLES = {
  seeking: '1',
  employing: '2',
  checking: '+'
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
    text: 'Welcome to the Collaboration Station, press 1, 2, or type + followed by an ID to check messages or to leave a message',
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

const CHECKING = {
  makeInbox: {
    text: 'Press + to record your project description after the beep, press + again to finish recording',
    input: /\+/,
    store: false
  },
  checkingVoicemail: {
    text: 'Checking voicemail (Press + to progress through messages)',
    input: /\+/,
    store: false
  },
  leavingMessageListen: {
    text: 'Press + to begin playing project description',
    input: /\+/,
    store: false
  },
  leavingMessageChoice: {
    text: 'Are you interested in this project? If so, press + to leave a message and phone number, if not, press 0 to return to the main screen',
    input: /[\+0]/,
    store: false
  },
  leavingMessageRecord: {
    text: 'Press + to begin recording your message after the beep, press + to finish recording',
    input: /\+/,
    store: false
  },
  leavingMessagePhone: {
    text: 'Type in your phone number if you would like to provide contact information and press + when you are done, or press + to finish',
    input: /[0-9\+]/,
    store: false
  },
  notFound: {
    text: 'Nothing with that ID was found (Press + to return to the main screen)',
    input: /\+/,
    store: false
  },
  noMessages: {
    text: 'No messages have been left for your project yet (Press + to return to the main screen)',
    input: /\+/,
    store: false
  }
}

const CONCLUSION = {
  seeking: {
    text: 'Please pull the lever to receive your matches!',
    input: /\+/,
    store: false
  },
  employing: {
    text: 'Please pull the lever to receive your ID!',
    input: /\+/,
    store: false
  },
  checking: {
    text: 'Please pull the lever to receive contact information for those who left you messages!',
    input: /\+/,
    store: false
  },
  leaveMessage: {
    text: 'Message and contact info received! (Press + to return to the main screen)',
    input: /\+/,
    store: false
  }
};
