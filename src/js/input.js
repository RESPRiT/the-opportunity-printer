// reuse state from app.js
state.role = null;
state.currentStage = INTRODUCTION.role;
state.responses = null;

// let log = str => document.querySelector('.out').textContent = str;

function printId(id) {
  console.log('Printing id #' + id);

}

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
        console.log('Creating inbox...');
        state.currentStage = CONCLUSION.employing;
      }
      break;
    case CONCLUSION.employing:
      console.log('Conclusion');
      state.currentStage = INTRODUCTION.role;
      state.role = null;

      printId(state.currID);
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
        state.currAudio.play();

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
        handleInput(null);
      });
      state.currAudio.play();
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