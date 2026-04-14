
document.getElementById('sliceBtn').addEventListener('click', () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;

    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-20, now);
    compressor.connect(audioCtx.destination);

    // the base that sounbds like Sukuna dismantle

    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.6, audioCtx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) noiseData[i] = Math.random() * 2 - 1;

    const airSource = audioCtx.createBufferSource();
    airSource.buffer = noiseBuffer;
    const airFilter = audioCtx.createBiquadFilter();
    const airGain = audioCtx.createGain();
    airFilter.type = "lowpass";
    airFilter.Q.value = 2;
    airFilter.frequency.setValueAtTime(100, now);
    airFilter.frequency.exponentialRampToValueAtTime(3000, now + 0.1);
    airFilter.frequency.exponentialRampToValueAtTime(200, now + 0.4);
    airGain.gain.setValueAtTime(0, now);
    airGain.gain.linearRampToValueAtTime(0.6, now + 0.05);
    airGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    airSource.connect(airFilter).connect(airGain).connect(compressor);

    // Another poor growl

    const carrier = audioCtx.createOscillator();
    const modulator = audioCtx.createOscillator();
    const modGain = audioCtx.createGain();
    const carrierGain = audioCtx.createGain();
    const carrierFilter = audioCtx.createBiquadFilter();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(150, now);
    carrier.frequency.exponentialRampToValueAtTime(50, now + 0.5);
    modulator.type = 'sine';
    modulator.frequency.value = 35;
    modGain.gain.value = 80;
    carrierFilter.type = "lowpass";
    carrierFilter.frequency.value = 600;
    carrierGain.gain.setValueAtTime(0, now);
    carrierGain.gain.linearRampToValueAtTime(0.4, now + 0.05);
    carrierGain.gain.linearRampToValueAtTime(0, now + 0.6);
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(carrierFilter).connect(carrierGain).connect(compressor);

    // A very poor attempt at the flare 

    const surge = audioCtx.createOscillator();
    const surgeGain = audioCtx.createGain();
    const surgeLFO = audioCtx.createOscillator();
    const surgeLFOGain = audioCtx.createGain();

    surge.type = 'sine';
    surge.frequency.setValueAtTime(100, now);
    surge.frequency.exponentialRampToValueAtTime(300, now + 0.1);

    surgeLFO.frequency.value = 20;
    surgeLFOGain.gain.value = 0.5;

    surgeGain.gain.setValueAtTime(0, now);
    surgeGain.gain.linearRampToValueAtTime(0.5, now + 0.08);
    surgeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    surgeLFO.connect(surgeLFOGain);
    surgeLFOGain.connect(surgeGain.gain);
    surge.connect(surgeGain).connect(compressor);

    // the start

    airSource.start(now);
    carrier.start(now);
    modulator.start(now);
    surge.start(now);
    surgeLFO.start(now);

    carrier.stop(now + 1.0);
    surge.stop(now + 0.5);
});