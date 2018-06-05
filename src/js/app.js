import Typed from 'typed.js';
import {
  ROLES,
  EMPLOYING_QUESTIONS,
  SEEKING_QUESTIONS,
  CHECKING,
  CONCLUSION,
  INTEREST_QUESTIONS,
  PERSONALITY_QUESTIONS,
  INTRODUCTION
} from './stages.js';

// constants
const ACTIONS = {
  makeInbox: 'MAKE_INBOX',
  checkInbox: 'CHECK_INBOX',
  leaveMessageListen: 'LEAVE_MESSAGE_LISTEN',
  leaveMessageRecord: 'LEAVE_MESSAGE_RECORD'
};

// useful elements
const EL = {
  /*
  makeInbox: document.querySelector('.make-inbox'),
  checkInbox: document.querySelector('.check-inbox'),
  leaveMessage: document.querySelector('.leave-message'),
  id: document.querySelector('.numpad'),
  recordings: document.querySelector('.recordings'),
  */
  out: document.querySelector('.out'),
  outAlt: document.querySelector('.out-alt'),
  lights: document.querySelector('.lights'),
  recording: document.querySelector('.recording'),
  playing: document.querySelector('.playing'),
  bar: document.querySelector('.bar'),
  barBackground: document.querySelector('.bar-background')
};

// state
let state = {
  currAction: null,

  // mapping of id -> inbox welcome audio URL
  inboxes: {},

  // mapping of id -> arr of inbox messages URLs
  messages: {},

  // mapping of seeker project ids -> inbox ids
  projectIDs: {},

  // mapping of project ids -> phone numbers
  phoneNumbers: {},

  // current ID being accessed/used
  currID: null,

  // for re-recording
  tempAudio: null
};

// misc. init
const beep = document.querySelector('.beep');

let beepEnded = (callback) => beep.addEventListener('ended', callback);

let chunks = [];
//let log = str => EL.out.textContent = str;

let type = null;
let log = str => {
  if (type && type.strings[0] == str) return;

  if (type) {
    type.destroy();
  }

  type = new Typed(EL.out, {
    strings: [str],
    typeSpeed: 20,
    loop: false,
    showCursor: false
  });
};

let logAlt = str => {
  if (!str) str = '';
  EL.outAlt.textContent = str;
};

/*
// button lights for progress
let lights = count => {
  if(count == undefined) return;
  for (let i = 0; i < 5; i++) {
    if (count > 0) {
      EL.lights.children[i].classList.add('lit');
    } else {
      EL.lights.children[i].classList.remove('lit');
    }
    count--;
  } 
};
*/

// progress bar
let lights = count => {
  let percentage = count / 5 * 100;
  if (percentage < 1) percentage = 1;
  EL.bar.style.width = percentage + '%';
  EL.barBackground.style.width = 100 - percentage + '%';
};

let recordingLit = lit => {
  if (lit) {
    EL.recording.classList.add('blink');
  } else {
    EL.recording.classList.remove('blink');
  }
};

let playingLit = lit => {
  if (lit) {
    EL.playing.classList.add('lit');
  } else {
    EL.playing.classList.remove('lit');
  }
};

let makeAudio = src => {
  /*
  let audio = document.createElement('audio');
  audio.setAttribute('controls', '');
  audio.controls = true;
  audio.src = src;
  */
  let audio = new Audio(src);

  return audio;
};

let audioFn = {};

// setup media recorder
let success = stream => {
  let mediaRecorder = new MediaRecorder(stream);

  // make inbox, returns true if the call stopped the recording
  audioFn.makeInbox = () => {
    switch (mediaRecorder.state) {
      case 'inactive':
        state.currAction = ACTIONS.makeInbox;
        //state.currID = state.nextID;
        beepEnded(() => {
          mediaRecorder.start();
          recordingLit(true);
        });
        beep.play();

        return false;
      case 'recording':
        mediaRecorder.stop();
        recordingLit(false);

        return true;
    }
  };

  // check inbox
  audioFn.checkInbox = (id, messageNum) => {
    state.currAction = ACTIONS.checkInbox;
    state.currID = id;

    if (state.currID in state.messages) {
      if (state.messages[state.currID].length > 0) {
        return makeAudio(state.messages[state.currID][messageNum]);
      } else {}
    } else {}
  };

  // leave message
  audioFn.leaveMessage = (projectID) => {
    state.currID = state.projectIDs[projectID];

    if (state.currID in state.messages) {
      if (state.currAction != ACTIONS.leaveMessageListen &&
        state.currAction != ACTIONS.leaveMessageRecord) {
        state.currAction = ACTIONS.leaveMessageListen;

        return makeAudio(state.inboxes[state.currID]);
      } else if (state.currAction == ACTIONS.leaveMessageListen) {
        state.currAction = ACTIONS.leaveMessageRecord;
        beepEnded(() => {
          mediaRecorder.start();
          recordingLit(true);
        });
        beep.play();

        return false;
      } else {
        mediaRecorder.stop();
        recordingLit(false);

        return true;
      }
    }
  };

  mediaRecorder.onstop = e => {
    // create audio blob and get URL reference
    let blob = new Blob(chunks, {
      'type': 'audio/ogg; codecs=opus'
    });
    chunks = [];
    let audioSrc = window.URL.createObjectURL(blob);

    switch (state.currAction) {
      case ACTIONS.makeInbox:
        //state.inboxes[state.nextID] = audioSrc;
        //state.messages[state.nextID] = [];
        //state.nextID++;
        state.tempAudio = audioSrc;
        break;
      case ACTIONS.leaveMessageRecord:
        state.currAction = null;
        state.tempAudio = audioSrc;
        /*
        if (state.currI D in state.messages) {
            state.messages[state.currID].push(audioSrc);
        } else {
            console.log(`Inbox #${state.currID} does not exist`);
        }
        */
        break;
      default:
        console.log(`Something went wrong, action ${state.currAction} shouldn't happen here`);
        break;
    }
  };
  mediaRecorder.ondataavailable = e => chunks.push(e.data);
};

// setup media devices
navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(success)
  .catch(err => {
    console.log(`The following getUserMedia error occured: ${err}`);
  });

/******************
 * Input handling *
 ******************/

// reuse state from app.js
state.role = null;
state.currentStage = INTRODUCTION.role;
state.responses = null;
state.altOverride = false;

// let log = str => document.querySelector('.out').textContent = str;

let handleInput = (keyName) => {

  // ignore input if audio is playing
  if (state.currAudio && !state.currAudio.ended) {
    return;
  }

  // determine if we should do anything
  if (keyName != null && !keyName.match(state.currentStage.input)) {
    console.log(`${keyName} does not match ${state.currentStage.input}`);
    return;
  } else {
    console.log(`Got ${keyName}`);
  }

  state.altOverride = false;
  // check if there's currently a role in progress
  if (state.role == null) {
    state.role = keyName;
    state.responses = {};
    logAlt('');

    // update stage
    switch (state.role) {
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
    switch (state.role) {
      case ROLES.seeking:
        handleSeeking(keyName);
        break;
      case ROLES.employing:
        handleEmploying(keyName);
        break;
      case ROLES.checking:
        handleChecking(keyName);
        break;
    }
  }

  log(state.currentStage.text);
  if (!state.altOverride) logAlt(state.currentStage.subText);
  lights(state.currentStage.lights);
};

let handleSeeking = (keyName) => {
  switch (state.currentStage) {
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
      state.currentStage = CHECKING.leavingMessagePhone;
      state.responses['animal'] = keyName;
      break;
    case CHECKING.leavingMessagePhone:
      state.altOverride = true;
      logAlt('');
      if (keyName == '+') {
        state.currentStage = CONCLUSION.seeking;
      } else if (keyName == '-') {
        if (state.responses['phone'].length > 0) {
          state.responses['phone'] = state.responses['phone'].slice(0, -1);
        }
        logAlt(state.responses['phone']);
      } else {
        if (!state.responses['phone']) {
          state.responses['phone'] = keyName;
        } else {
          state.responses['phone'] += keyName;
        }
        console.log(state.responses['phone']);
        logAlt(state.responses['phone']);
      }
      break;
    case CONCLUSION.seeking:
      state.currentStage = INTRODUCTION.role;
      state.role = null;

      // generate random IDs for matches
      let matches = [];
      let i = 0;
      do {
        matches[i] = Math.floor(Math.random() * 1000) + 1;
        i++;
      } while (
        matches.reduce(
          (prev, curr) => prev && !Object.keys(state.projectIDs).includes(curr) &&
          !Object.keys(state.messages).includes(curr)

        ) && i < 4
      );

      // return as many IDs as there are available projects
      let retMatches = [];
      for (i = 0; i < matches.length && i < Object.keys(state.inboxes).length; i++) {
        // TODO: actually have a matching algorithm
        state.projectIDs[matches[i]] = Object.keys(state.inboxes)[i];
        retMatches[i] = matches[i];
      }

      console.log(retMatches);
      // TODO: find and print matches
      state.altOverride = true;
      if (retMatches.length > 0) {
        logAlt(`Matches are ${retMatches.join(', ')}`);
      } else {
        logAlt('No matches :(');
      }
      break;
    default:
      console.log('Can\'t handle for state');
      console.log(state.currentStage);
  }
};

let handleEmploying = (keyName) => {
  switch (state.currentStage) {
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
      state.currentStage = CHECKING.makeInbox;
      state.responses['animal'] = keyName;
      break;
    case CHECKING.makeInbox:
      if (audioFn.makeInbox()) {
        state.currentStage = CHECKING.makeInboxConfirm; //CONCLUSION.employing;
      }
      break;
    case CHECKING.makeInboxConfirm:
      if (keyName == '+') {
        // generate next ID
        let id;
        let i = 0;
        do {
          id = Math.floor(Math.random() * 1000) + 1;
          console.log(id);
          i++;
        } while (
          Object.keys(state.projectIDs).includes(id) &&
          Object.keys(state.messages).includes(id) && i < 10
        );
        state.currID = id;
        state.currentStage = CONCLUSION.employing;
        state.inboxes[state.currID] = state.tempAudio;
        state.messages[state.currID] = [];
        state.tempAudio = null;
      } else {
        state.currentStage = CHECKING.makeInbox;
      }
      break;
    case CONCLUSION.employing:
      state.currentStage = INTRODUCTION.role;
      state.role = null;
      // TODO: Print ID
      state.altOverride = true;
      console.log(`ID is ${state.currID}`);
      logAlt(`ID is ${state.currID}`);
      break;
    default:
      console.log('Can\'t handle for state');
      console.log(state.currentStage);
  }
};

let handleChecking = (keyName) => {
  switch (state.currentStage) {
    case INTRODUCTION.checking:
      state.altOverride = true;
      logAlt('');
      if (keyName == '+') {
        state.altOverride = false;
        if (Object.keys(state.projectIDs).includes(state.responses['id'])) {
          state.currentStage = CHECKING.leavingMessageListen;
        } else if (Object.keys(state.messages).includes(state.responses['id'])) {
          state.currentStage = CHECKING.checkingVoicemail;
        } else {
          state.currentStage = CHECKING.notFound;
        }
      } else if (keyName == '-') {
        if (state.responses['id'].length > 0) {
          state.responses['id'] = state.responses['id'].slice(0, -1);
        }
        logAlt(state.responses['id']);
      } else {
        if (!state.responses['id']) {
          state.responses['id'] = keyName;
        } else {
          state.responses['id'] += keyName;
        }
        console.log(state.responses['id']);
        logAlt(state.responses['id']);
      }
      break;
    case CHECKING.notFound:
      state.currentStage = INTRODUCTION.role;
      state.role = null;
      break;
    case CHECKING.noMessages:
      state.currentStage = INTRODUCTION.role;
      state.role = null;
      break;
    case CHECKING.checkingVoicemail:
      // check if there are any messages
      let currMessages = state.messages[state.responses['id']];
      if (currMessages.length == 0) {
        state.currentStage = CHECKING.noMessages;
        return;
      }

      // start incrementing through messages
      if (state.responses['checked'] == undefined) {
        state.responses['checked'] = 0;
      } else {
        state.responses['checked']++;
      }

      // play message if there is a next message
      if (currMessages.length > state.responses['checked']) {
        state.currAudio = audioFn.checkInbox(state.responses['id'],
          state.responses['checked']);
        state.currAudio.addEventListener('ended', () => {
          playingLit(false);
        });

        state.currAudio.play();
        playingLit(true);
      } else {
        state.currentStage = CONCLUSION.checking;
      }
      break;
    case CONCLUSION.checking:
      state.currentStage = INTRODUCTION.role;
      state.role = null;
      state.altOverride = true;
      logAlt('Contact info/phone numbers coming soon!!');
      break;
    case CHECKING.leavingMessageListen:
      state.currAudio = audioFn.leaveMessage(state.responses['id']);
      state.currAudio.addEventListener('ended', () => {
        state.currentStage = CHECKING.leavingMessageChoice;
        playingLit(false);
        handleInput(null);
      });
      state.currAudio.play();
      playingLit(true);
      break;
    case CHECKING.leavingMessageChoice:
      if (keyName == '+') {
        state.currentStage = CHECKING.leavingMessageRecord;
      } else if (keyName == '0') {
        state.currentStage = INTRODUCTION.role;
        state.role = null;
        state.currAction = null;
      }
      break;
    case CHECKING.leavingMessageRecord:
      if (audioFn.leaveMessage(state.responses['id'])) {
        state.currentStage = CHECKING.leavingMessageConfirm; //CONCLUSION.leavingMessage;
      }
      break;
    case CHECKING.leavingMessageConfirm:
      if (keyName == '+') {
        state.currentStage = CONCLUSION.leavingMessage;
        state.messages[state.currID].push(state.tempAudio);
        state.tempAudio = null;
      } else {
        state.currAction = ACTIONS.leaveMessageListen;
        state.currentStage = CHECKING.leavingMessageRecord;
      }
      break;
    case CONCLUSION.leavingMessage:
      state.currentStage = INTRODUCTION.role;
      state.role = null;
      break;
    default:
      console.log('Can\'t handle for state');
      console.log(state.currentStage);
  }
};

// numpad events
document.addEventListener('keypress', (event) => {
  const keyName = event.key;
  handleInput(keyName);
});

// main
log(state.currentStage.text);
lights(0.05);
console.log(state);