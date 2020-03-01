// const AudioContext = window.AudioContext || window.webkitAudioContext;

document.getElementById("filter").addEventListener("click", filter);  

function filter () {

    const audioContext = new AudioContext();

    const audioElement = document.querySelector('audio');
    
    // pass it into the audio context
    const track = audioContext.createMediaElementSource(audioElement);
    
    // track.connect(audioContext.destination);
    
    const gainNode = audioContext.createGain(); 

    const volumeControl = document.querySelector('#volume');
    
    volumeControl.addEventListener('input', function() {
        gainNode.gain.value = this.value;
    }, false);


    var distortion = audioContext.createWaveShaper();

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

    distortion.curve = makeDistortionCurve(100);
    distortion.oversample = '4x';

    //track.connect(gainNode).connect(audioContext.destination);
    
    track.connect(distortion).connect(audioContext.destination);
}
