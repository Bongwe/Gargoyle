async function audioBufferToWaveBlob(audioBuffer) {

  return new Promise(function(resolve, reject) {

    var worker = new Worker('/public/scripts/waveWorker.js');

    worker.onmessage = function( e ) {
      var blob = new Blob([e.data.buffer], {type:"audio/wav"});
      resolve(blob);
    };

    let pcmArrays = [];
    for(let i = 0; i < audioBuffer.numberOfChannels; i++) {
      pcmArrays.push(audioBuffer.getChannelData(i));
    }

    worker.postMessage({
      pcmArrays,
      config: {sampleRate: audioBuffer.sampleRate}
    });

  });

}

async function loadTransform(e, transformName, ...transformArgs) {

  //modalAdv.innerHTML = '<div style="width:100%; height:100%; overflow:hidden;"><ins class="adsbygoogle" style="display:block; max-height:100%; height:100%;" data-ad-client="ca-pub-3263838347296949" data-ad-slot="8209523126" data-ad-format="auto"></ins></div>';
  //(adsbygoogle = window.adsbygoogle || []).push({});

  if(!globalAudioBuffer) {
  let arrayBuffer = await (await fetch("../audio/example.mp3")).arrayBuffer();
  let ctx = new AudioContext();
  globalAudioBuffer = await ctx.decodeAudioData(arrayBuffer);
  }

  let outputAudioBuffer = await window[transformName+"Transform"](globalAudioBuffer, ...transformArgs)
  let outputWavBlob = await audioBufferToWaveBlob(outputAudioBuffer)
  let audioUrl = window.URL.createObjectURL(outputWavBlob);
  let audioTag =  document.getElementById("output-audio-tag");
  audioTag.src = audioUrl;
  audioTag.play();

  // $("body section.output .loading").style.display = 'none';
  // $("body section.output .finished").style.display = 'block';

  }
