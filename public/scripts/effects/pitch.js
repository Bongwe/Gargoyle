
document.getElementById("filter2").addEventListener("click", filter2);  

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

  const sourceNode = audioContext.createBufferSource();

  sourceNode.buffer = audioBuffer;
  sourceNode.detune.value = +800;
  sourceNode.connect(audioContext.destination);
  sourceNode.start();

}
