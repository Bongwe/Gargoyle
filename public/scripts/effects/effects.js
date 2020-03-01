// const AudioContext = window.AudioContext || window.webkitAudioContext;

document.getElementById("filter").addEventListener("click", filter);  

function filter () {
    const blob = new Blob(audioChunks);
    
    convertToArrayBuffer(blob)
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(play2);
    
}

function convertToArrayBuffer(blob) {
    const url = URL.createObjectURL(blob);
    
    return fetch(url).then(response => {
        return response.arrayBuffer();
    });
  }

function play2(audioBuffer) {

    const track  = audioContext.createBufferSource();
    var distortion = audioContext.createWaveShaper();

    distortion.curve = makeDistortionCurve(100);
    distortion.oversample = '4x';
    
    track.buffer = audioBuffer;
    track.connect(distortion).connect(audioContext.destination);
    track.start();

    function makeDistortionCurve(amount) {
        var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
        for ( ; i < n_samples; ++i ) {
            x = i * 2 / n_samples - 1;
            curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
        }
        return curve;
    };
  }
  