(function () {
    'use strict';
    
    const audioContext = new AudioContext();
    const recordButton = document.querySelector('#record');
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(attachEvents);
    
    function attachEvents(sourceStream) {
        const data = [];
        let mediaRecorder;
        let isRecording = false;
        
        recordButton.onclick = () => {
            isRecording = !isRecording;
            
            if (isRecording) {
                mediaRecorder = record(sourceStream);
            } else {
                mediaRecorder.stop();
            }
            
            updateButton(isRecording);
        };
    }
    
    function record(sourceStream) {
        const mediaRecorder = new MediaRecorder(sourceStream);
        const data = [];
        
        mediaRecorder.ondataavailable = e => e.data.size && data.push(e.data);
        mediaRecorder.start();
        mediaRecorder.onstop = () => process(data);
        
        return mediaRecorder;
    }
    
    function process(data) {
        const blob = new Blob(data);
        
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
        sourceNode.detune.value = -300;
        
        sourceNode.connect(audioContext.destination);
        sourceNode.start();
    }
    
    function updateButton(isRecording) {
        recordButton.innerHTML = isRecording ? 'Stop' : 'Record';
    }
}());