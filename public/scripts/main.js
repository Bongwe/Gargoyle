const player = document.getElementById('player');

var audioChunks = [];
var audioContext = new AudioContext();

const handleSuccess = function(stream) {
    document.getElementById("record").addEventListener("click", record); 
    document.getElementById("stop").addEventListener("click", stop); 
  
    const mediaRecorder = new MediaRecorder(stream);
  
    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });
    
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      audio = new Audio(audioUrl);
      player.src = audioUrl;
    });

    function stop () {
      mediaRecorder.stop();
    }
  
    function record () {
      mediaRecorder.start();
    }

};

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess);
    