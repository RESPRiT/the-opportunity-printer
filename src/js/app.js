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
  outAlt: document.querySelector('.out-alt')
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
const beep = new Audio('audio/beep.mp3');

let beepEnded = (callback) => beep.addEventListener('ended', callback);

let chunks = [];
let log = str => EL.out.textContent = str;
let logAlt = str => EL.outAlt.textContent = str;

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
        beepEnded(() => mediaRecorder.start());
        beep.play();

        //log(`Recording voicemail welcome for inbox #${state.currID}`);
        //EL.leaveMessage.disabled = true;
        //EL.checkInbox.disabled = true;
        return false;
      case 'recording':
        //EL.makeInbox.style.background = '';
        mediaRecorder.stop();

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
       log(`Inbox #${state.currID} is empty`);
      }
    } else {
      log(`Inbox #${state.currID} does not exist`);
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
