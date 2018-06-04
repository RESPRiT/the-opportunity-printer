import Typed from 'typed.js';
import { ROLES, EMPLOYING_QUESTIONS, SEEKING_QUESTIONS, CHECKING, CONCLUSION,
         INTEREST_QUESTIONS, PERSONALITY_QUESTIONS, INTRODUCTION } from './stages.js';

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

  // current ID being accessed/used
  currID: null,

  // ID of next inbox to be created
  nextID: 1
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
    console.log(type);
    type.destroy();
  }

  type = new Typed(EL.out, { 
    strings: [str], 
    typeSpeed: 0,
    loop: false,
    showCursor: false
  });
};

let logAlt = str => EL.outAlt.textContent = str;

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
}

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
  //EL.makeInbox.onclick = 
  audioFn.makeInbox = () => {
    switch (mediaRecorder.state) {
      case 'inactive':
        state.currAction = ACTIONS.makeInbox;
        state.currID = state.nextID;
        //EL.makeInbox.style.background = 'red';
        beepEnded(() => {
          mediaRecorder.start();
          recordingLit(true);
        });
        beep.play();

        //log(`Recording voicemail welcome for inbox #${state.currID}`);
        //EL.leaveMessage.disabled = true;
        //EL.checkInbox.disabled = true;
        return false;
      case 'recording':
        //EL.makeInbox.style.background = '';
        mediaRecorder.stop();
        recordingLit(false);

        //log(`Inbox #${state.currID} created!`);
        //EL.leaveMessage.disabled = false;
        //EL.checkInbox.disabled = false;
        return true;
    }
  };

  // check inbox
  // EL.checkInbox.onclick = 
  // TODO: Probably redundant code idk
  audioFn.checkInbox = (id, messageNum) => {
    state.currAction = ACTIONS.checkInbox;
    state.currID = id;
    //state.currID = EL.id.value;

    if (state.currID in state.messages) {
      if (state.messages[state.currID].length > 0) {
        //log(`Here are the messages left for inbox #${state.currID}`);
        //EL.recordings.innerHTML = '';
        //for (let src of state.messages[state.currID]) {
          //let audio = makeAudio(src);
          //EL.recordings.appendChild(audio);
        //}
        return makeAudio(state.messages[state.currID][messageNum]);
      } else {
       //log(`Inbox #${state.currID} is empty`);
      }
    } else {
      //log(`Inbox #${state.currID} does not exist`);
    }
  };

  // leave message
  //EL.leaveMessage.onclick = 
  audioFn.leaveMessage = (projectID) => {
    state.currID = state.projectIDs[projectID];
    //state.currID = EL.id.value;

    if (state.currID in state.messages) {
      if (state.currAction != ACTIONS.leaveMessageListen &&
        state.currAction != ACTIONS.leaveMessageRecord) {
        state.currAction = ACTIONS.leaveMessageListen;
        //log(`Here is the voicemail greeting for inbox #${state.currID}`);
        return makeAudio(state.inboxes[state.currID]);
        //EL.recordings.innerHTML = '';
        //EL.recordings.appendChild(audio);
        //EL.leaveMessage.style.background = 'green';

        //EL.makeInbox.disabled = true;
        //EL.checkInbox.disabled = true;
      } else if (state.currAction == ACTIONS.leaveMessageListen) {
        state.currAction = ACTIONS.leaveMessageRecord;
        //EL.leaveMessage.style.background = 'red';
        beepEnded(() => mediaRecorder.start());
        beep.play();

        //log(`Recording message for inbox #${state.currID}`);
        //EL.recordings.innerHTML = '';
        //EL.makeInbox.disabled = true;
        //EL.checkInbox.disabled = true;
        return false;
      } else {
        //EL.leaveMessage.style.background = '';
        mediaRecorder.stop();
        recordingLit(false);

        //log(`Message left for inbox #${state.currID}`);
        //EL.makeInbox.disabled = false;
        //EL.checkInbox.disabled = false;
        return true;
      }
    } else {
      log(`Inbox #${state.currID} does not exist`);
    }
  };

  mediaRecorder.onstop = e => {
    // create audio blob and get URL reference
    let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
    chunks = [];
    let audioSrc = window.URL.createObjectURL(blob);

    switch (state.currAction) {
      case ACTIONS.makeInbox:
        state.inboxes[state.nextID] = audioSrc;
        state.messages[state.nextID] = [];
        state.nextID++;
        break;
      case ACTIONS.leaveMessageRecord:
        state.currAction = null;
        if (state.currID in state.messages) {
          state.messages[state.currID].push(audioSrc);
        } else {
          console.log(`Inbox #${state.currID} does not exist`);
        }
        break;
      default:
        console.log(`Something went wrong, action ${state.currAction} shouldn't happen here`);
        break;
    }
  }
  mediaRecorder.ondataavailable = e => chunks.push(e.data);
};

// setup media devices
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(success)
  .catch(err => {
    console.log(`The following getUserMedia error occured: ${err}`);
  }
  );

/******************
 * Input handling *
 ******************/

// reuse state from app.js
state.role = null;
state.currentStage = INTRODUCTION.role;
state.responses = null;

// let log = str => document.querySelector('.out').textContent = str;

let handleInput = (keyName) => {
  // ignore input if audio is playing
  if(state.currAudio && !state.currAudio.ended) {
    return;
  }

  // determine if we should do anything
  if(keyName != null && !keyName.match(state.currentStage.input)) {
    console.log(`${keyName} does not match ${state.currentStage.input}`);
    return;
  } else {
    console.log(`Got ${keyName}`);
  }

  // check if there's currently a role in progress
  if(state.role == null) {
    state.role = keyName;
    state.responses = {};
    logAlt('');
    
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
        handleChecking(keyName);
        break;
    }
  }
  log(state.currentStage.text);
  lights(state.currentStage.lights);
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
      
      // generate random IDs for matches
      let matches = [];
      let i = 1;
      do {
        matches[i] = Math.floor(Math.random() * 1000) + 1;
        i++;
      } while (
        matches.reduce(
          (prev, curr) => prev && !Object.keys(state.projectIDs).includes(curr)
        ) && i <= 4
      );

      let retMatches = [];
      for(i = 1; i <= matches.length; i++) {
        if(state.inboxes[i]) {
          state.projectIDs[matches[i]] = i;
          retMatches[i - 1] = matches[i];
        }
      }

      console.log(retMatches);
      // TODO: find and print matches
      if(retMatches.length > 0) {
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
      state.currentStage = CHECKING.makeInbox;
      state.responses['animal'] = keyName;
      break;
    case CHECKING.makeInbox:
      if(audioFn.makeInbox()) {
        state.currentStage = CONCLUSION.employing;
      }
      break;
    case CONCLUSION.employing:
      state.currentStage = INTRODUCTION.role;
      state.role = null;
      // TODO: Print ID
      console.log(`ID is ${state.currID}`);
      logAlt(`ID is ${state.currID}`);
      break;
    default:
      console.log('Can\'t handle for state');
      console.log(state.currentStage);
  }
};

let handleChecking  = (keyName) => {
  switch(state.currentStage) {
    case INTRODUCTION.checking:
      logAlt('');
      if(keyName == '+') {
        if(Object.keys(state.projectIDs).includes(state.responses['id'])) {
          state.currentStage = CHECKING.leavingMessageListen;
        } else if(Object.keys(state.messages).includes(state.responses['id'])) {
          state.currentStage = CHECKING.checkingVoicemail;
        } else {
          state.currentStage = CHECKING.notFound;
        }
      } else if(keyName == '-') {
        if(state.responses['id'].length > 0) {
          state.responses['id'] = state.responses['id'].slice(0, -1);
        }
        logAlt(state.responses['id']);
      } else {
        if(!state.responses['id']) {
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
      if(currMessages.length == 0) {
        state.currentStage = CHECKING.noMessages;
        return;
      }

      // start incrementing through messages
      if(state.responses['checked'] == undefined) {
        state.responses['checked'] = 0;
      } else {
        state.responses['checked']++;
      }

      // play message if there is a next message
      if(currMessages.length > state.responses['checked']) {
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
      if(keyName == '+') {
        state.currentStage = CHECKING.leavingMessageRecord;
      } else if(keyName == '0') {
        state.currentStage = INTRODUCTION.role;
        state.role = null;
        state.currAction = null;
      }
      break;
    case CHECKING.leavingMessageRecord:
      if(audioFn.leaveMessage(state.responses['id'])) {
        state.currentStage = CHECKING.leavingMessagePhone;
      }
      break;
    case CHECKING.leavingMessagePhone:
      logAlt('');
      if(keyName == '+') {
        state.currentStage = CONCLUSION.leaveMessage;
      } else {
        if(!state.responses['phone']) {
          state.responses['phone'] = keyName;
        } else {
          state.responses['phone'] += keyName;
        }
        console.log(state.responses['phone']);
        logAlt(state.responses['phone']);
      }
      break;
    case CONCLUSION.leaveMessage:
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
lights(0);
