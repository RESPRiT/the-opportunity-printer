export const ROLES = {
    seeking: '2',
    employing: '1',
    checking: '+'
};

export const EMPLOYING_QUESTIONS = {
    tech: {
        text: 'Rank your need (by pressing a number from 1–9) for an individual with skills in TECHNOLOGY and PROGRAMMING',
        input: /[1-9]/,
        lights: .33,
        store: true,
    },
    business: {
        text: 'Rank your need (1–9) for an individual with skills in BUSINESS and MANAGEMENT',
        input: /[1-9]/,
        lights: .66,
        store: true
    },
    design: {
        text: 'Rank your need (1–9) for an individual with skills in DESIGN and ART',
        input: /[1-9]/,
        lights: 1,
        store: true
    }
};

export const SEEKING_QUESTIONS = {
    tech: {
        text: 'Rank your skills (by pressing a number from 1–9) in TECHNOLOGY and PROGRAMMING',
        input: /[1-9]/,
        lights: .33,
        store: true
    },
    business: {
        text: 'Rank your skills (1–9) in BUSINESS and MANAGEMENT',
        input: /[1-9]/,
        lights: .66,
        store: true
    },
    design: {
        text: 'Rank your skills (1–9) in DESIGN and ART',
        input: /[1-9]/,
        lights: 1,
        store: true
    }
};

export const INTEREST_QUESTIONS = {
    politics: {
        text: 'Rank your interest (1-9) in POLITICS and SOCIAL ISSUES',
        input: /[1-9]/,
        lights: 1.33,
        store: true
    },
    finance: {
        text: 'Rank your interest (1-9) in FINANCE and ENTREPRENEURSHIP',
        input: /[1-9]/,
        lights: 1.66,
        store: true
    },
    arts: {
        text: 'Rank your interest (1-9) in MUSEUMS and CONCERTS',
        input: /[1-9]/,
        lights: 2,
        store: true
    }
};

export const PERSONALITY_QUESTIONS = {
    city: {
        text: 'Choose your favorite city: Press 1 for LONDON, 2 for NEW YORK, 3 for SAN FRANCISCO, 4 for TOKYO, 5 for SEATTLE, 6 for PARIS, 7 for LOS ANGELES, 8 for DUBAI, or 9 for MUMBAI',
        input: /[1-9]/,
        lights: 2.5,
        store: true
    },
    animal: {
        text: 'Press 1 if you are a DOG person, 2 if you are a CAT person, or 3 if you are INDIFFERENT',
        input: /[1-3]/,
        lights: 3,
        store: true
    }
};

export const INTRODUCTION = {
    role: {
        text: 'Welcome to the Collaboration Station, press 1, 2, or type + followed by an ID to check messages or to leave a message',
        // determine exceptable input from ROLES keys
        input: new RegExp(`[${Object.values(ROLES).join('')}]`),
        lights: 0,
        store: true
    },
    employing: {
        text: 'Let’s add your project and find the right people to work with you!',
        subText: '(Press Enter to continue)',
        input: /Enter/,
        lights: 0,
        store: false
    },
    seeking: {
        text: 'Let’s find a project for you! First, please answer a few quick questions to help us find the best matches for you.',
        subText: '(Press Enter to continue)',
        input: /Enter/,
        lights: 0,
        store: false
    },
    checking: {
        text: 'Please input your ID number and press Enter to continue! You can backspace with "-"!',
        input: /[0-9(Enter)\-]/,
        lights: 0,
        store: true
    }
};

export const CHECKING = {
    makeInbox: {
        text: 'Press Enter to record your project description after the beep, press Enter again to finish your recording',
        input: /Enter/,
        lights: 3.5,
        store: false
    },
    makeInboxConfirm: {
        text: 'If you are happy with your project description, press Enter to confirm your recording, if not, press 0 to record again',
        input: /[(Enter)0]/,
        lights: 4,
        store: false
    },
    checkingVoicemail: {
        text: 'Checking voicemail',
        subText: '(Press Enter to progress through messages)',
        input: /Enter/,
        lights: 0,
        store: false
    },
    leavingMessageListen: {
        text: 'Press Enter to begin playing project description',
        lights: 0,
        input: /Enter/,
        store: false
    },
    leavingMessageChoice: {
        text: 'Are you interested in this project? If so, press Enter to leave a message and phone number, if not, press 0 to return to the main screen',
        lights: 0,
        input: /[(Enter)0]/,
        store: false
    },
    leavingMessageRecord: {
        text: 'Press + to begin recording your message after the beep, press Enter again to finish recording',
        lights: 0,
        input: /Enter/,
        store: false
    },
    leavingMessageConfirm: {
        text: 'If you are happy with your message, press Enter to confirm your recording, if not, press 0 to record again',
        input: /[(Enter)0]/,
        lights: 0,
        store: false
    },
    leavingMessagePhone: {
        text: 'Type in your phone number if you would like to provide contact information and press Enter when you are done, or press Enter to finish. You can press "-" to backspace!',
        lights: 4,
        input: /[0-9(Enter)\-]/,
        store: false
    },
    notFound: {
        text: 'Nothing with that ID was found',
        subText: '(Press Enter to return to the main screen)',
        lights: 0,
        input: /Enter/,
        store: false
    },
    noMessages: {
        text: 'No messages have been left for your project yet',
        subText: '(Press Enter to return to the main screen)',
        lights: 0,
        input: /Enter/,
        store: false
    }
};

export const CONCLUSION = {
    seeking: {
        text: 'Please pull the lever to receive your matches!',
        input: /p/,
        lights: 5,
        store: false
    },
    employing: {
        text: 'Please pull the lever to receive your ID!',
        input: /p/,
        lights: 5,
        store: false
    },
    checking: {
        text: 'Please pull the lever to receive contact information for those who left you messages!',
        input: /p/,
        lights: 5,
        store: false
    },
    leavingMessage: {
        text: 'Message and contact info received!',
        subText: '(Press Enter to return to the main screen)',
        input: /Enter/,
        lights: 5,
        store: false
    }
};
