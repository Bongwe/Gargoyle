// navigator.mediaDevices.getUserMedia({ audio: true })
// .then(stream => {

//   document.getElementById("Record").addEventListener("click", recordSound); 
//   document.getElementById("Stop").addEventListener("click", stopSound); 
//   document.getElementById("Play").addEventListener("click", playSound);  

//   const mediaRecorder = new MediaRecorder(stream);
//   const audioChunks = [];
//   let audio;

//   mediaRecorder.addEventListener("dataavailable", event => {
//     audioChunks.push(event.data);
//   });

//   mediaRecorder.addEventListener("stop", () => {
//     const audioBlob = new Blob(audioChunks);
//     const audioUrl = URL.createObjectURL(audioBlob);
//     audio = new Audio(audioUrl);
//   });

//   function recordSound () {
//     mediaRecorder.start();
//   }


//   function stopSound () {
//     mediaRecorder.stop();
//   }

//   function playSound () {
//     audio.play();
//   }

// });

var globalAudioBuffer = null; // todo: load an example file by default (that tells them to upload their own)

let maxFileSizeMegabytes = 100;
function loadAudioFile(file) {

  if(file.size > maxFileSizeMegabytes*1000*1000) {
    alert("Sorry, that file is too big. Your audio file needs to be under "+maxFileSizeMegabytes+" megabytes.");
    return;
  }

  let reader = new FileReader();
  reader.onloadend = async function() {
    let arrayBuffer = this.result;
    try {
      globalAudioBuffer = await (new AudioContext()).decodeAudioData(arrayBuffer);
      // $("#audio-load-success").style.display = "flex";
    } catch(e) {
      alert("Sorry, either that's not an audio file, or it's not an audio format that's supported by your browser. Most modern browsers support: wav, mp3, mp4, ogg, webm, flac. You should use Chrome or Firefox if you want the best audio support, and ensure you're using the *latest version* of your browser of choice. Chrome and Firefox update automatically, but you may need to completely close down the browser and potentially restart your device to 'force' it to update itself to the latest version.");
    }
  }
  reader.onerror = function (e) {
    alert("There was an error reading that file: "+JSON.stringify(e));
  }

  reader.readAsArrayBuffer(file);

  // let types = ["audio/mp3", "audio/vnd.wave", "audio/wav", "audio/wave", "audio/x-wav", "audio/ogg", "audio/webm", "audio/aac", "audio/aacp", "audio/3gpp", "audio/3gpp2", "audio/mp4", "audio/mp4a-latm", "audio/mpeg4-generic", "audio/x-flac"];
  // if(true || types.includes(file.type)) { }

}

// Microphone
let currentlyRecording = false;
let maxRecordingSeconds = 5*60;
async function recordFromMicrophone() {

  if(currentlyRecording) {
    return;
  }
  currentlyRecording = true;

  // Change, button, start timer:
  // var micButtonCssText = $("#microphone-button").style.cssText;
  // $("#microphone-button").style.cssText = "background:#e71010; color:white;";
  // $("#microphone-button .start").style.cssText = "display:none;"
  // $("#microphone-button .mic-enable").style.cssText = "display:initial;"

  let chunks = [];
  let stream = await navigator.mediaDevices.getUserMedia({ audio:true, video:false });
  let mediaRecorder = new MediaRecorder(stream, {mimeType:"video/webm"});

  mediaRecorder.start();
  let timerInterval;

  mediaRecorder.ondataavailable = function(e) { chunks.push(e.data); };
  mediaRecorder.onstart = function() {
    console.log('Started, state = ',mediaRecorder.state);

    // $("#microphone-button .mic-enable").style.cssText = "display:none;";
    // $("#microphone-button .stop").style.cssText = "display:initial;";

    var seconds = 0;
    $("#microphone-button .time").innerText = seconds;
    timerInterval = setInterval(() => { seconds++; $("#microphone-button .time").innerText = seconds; }, 1000);


    let stopFn = function() {
      mediaRecorder.stop();
     document.getElementById("microphone-button").removeEventListener("click", stopFn);
      clearTimeout(maxLengthTimeout);
    };
    // $("#microphone-button").addEventListener("click", stopFn)
   
    document.getElementById("microphone-button").addEventListener("click", stopFn)
    let maxLengthTimeout = setTimeout(stopFn, maxRecordingSeconds*1000);

  };

  mediaRecorder.onerror = function(e) { console.log('Error: ',e); };
  mediaRecorder.onwarning = function(e) { console.log('Warning: ', e); };

  mediaRecorder.onstop = async function() {
    console.log('Stopped, state = ' + mediaRecorder.state);

    let blob = new Blob(chunks, { type: mediaRecorder.mimeType });//+'; codecs=opus' });//
    let audioURL = window.URL.createObjectURL(blob);

    let arrayBuffer = await (await fetch(audioURL)).arrayBuffer();

    try {
      globalAudioBuffer = await (new AudioContext()).decodeAudioData(arrayBuffer);
      //$("#audio-load-success").style.display = "flex";
    } catch(e) {
      alert("Sorry, your browser doesn't support a crucial feature needed to allow you to record using your device's microphone. You should use Chrome or Firefox if you want the best audio support, and ensure you're using the *latest version* of your browser of choice. Chrome and Firefox update automatically, but you may need to completely close down the browser and potentially restart your device to 'force' it to update itself to the latest version.");
    }

    // Change, button, end timer:
    // $("#microphone-button").style.cssText = micButtonCssText;
    // $("#microphone-button .start").style.cssText = "display:initial;";
    // $("#microphone-button .stop").style.cssText = "display:none;";
    clearInterval(timerInterval);

    currentlyRecording = false;

  }

  
 


}