


    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {

        document.getElementById("Record").addEventListener("click", recordSound); 
document.getElementById("Stop").addEventListener("click", stopSound); 
document.getElementById("Play").addEventListener("click", playSound);  


      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];
      let audio;

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        audio = new Audio(audioUrl);
       
      });

      function recordSound () {
        mediaRecorder.start();
    
        }
    

      function stopSound () {
        mediaRecorder.stop();
     }
    
        function playSound () {
            audio.play();
        }
    

    });



