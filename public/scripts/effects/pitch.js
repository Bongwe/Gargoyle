
document.getElementById("filter2").addEventListener("click", filter2);  
const audioElement = document.querySelector('audio');

function filter2 () {

  const blob = new Blob(audioChunks);
    
  convertToArrayBuffer(blob)
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(play);

}

function convertToArrayBuffer(blob) {
  const url = URL.createObjectURL(blob);
  
  return fetch(url).then(response => {
      return response.arrayBuffer();
  });
}

function play(audioBuffer) {

  sample = audioContext.createBufferSource();
  sample.buffer = audioBuffer;
  sample.playbackRate.value = 1.7;
  //sample.loop = true;
  sample.connect(audioContext.destination);
  sample.start();

}
