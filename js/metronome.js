window.AudioContext = window.AudioContext || window.webkitAudioContext;


metronome = {

  domItems: {
    mainBtn: document.querySelector('.play-pause-btn'),
    playIcon: document.querySelector('#playSVG'),
    pauseIcon: document.querySelector('#pauseSVG'),
    slider: document.querySelector('#rangeSlider'),
    tempoContainer: document.querySelector('.tempo'),
    metCircle: document.querySelector('.circle')
  },

  audioContext: undefined,

  nextNote: 0,

  beat: 1,

  beatRange: 1,

  playing: false,

  bpm: undefined,

  timerId: undefined,

  playing: false,

  getCurrentTime(){
    return this.audioContext.currentTime;
  },

  playSound(time, beat){
    if(beat == 1){
      let osc = this.audioContext.createOscillator();
      osc.connect(this.audioContext.destination);
      osc.frequency.value = 400;
      osc.start(time);
      osc.stop(time + .1);
    } else {
      let osc = this.audioContext.createOscillator();
      osc.connect(this.audioContext.destination);
      osc.frequency.value = 1000;
      osc.start(time);
      osc.stop(time + .1);
    }
  },

  calculateBPM(){
    return parseFloat( (60 / this.bpm).toFixed(2) );
  },

  scheduler(){
    while(this.nextNote < this.audioContext.currentTime + .1) {
        if(this.beatRange < this.beat){
          this.beat = 1;
          this.nextNote += this.calculateBPM();
          this.playSound(this.nextNote, this.beat);
          this.beat++;
        } else {
          this.nextNote += this.calculateBPM();
          this.playSound(this.nextNote, this.beat);
          this.beat++;
        }
    }
  },

  // playMetWithWorker(eventNode, bpm){
  //   eventNode.addEventListener('click', () => {
  //     let worker;
  //       worker = new Worker('worker.js');
  //       worker.postMessage(this.bpm);
  //     worker.onmessage = (e) => {
  //         this.sound.pause();
  //         this.sound.length = 0;
  //         this.sound.play();
  //       }
  //   })
  // },

  startAudioContext(){
      this.audioContext = new AudioContext;
  },

  playPauseListener(){
    this.domItems.mainBtn.addEventListener('click', () => {
      if(this.playing != true){
        this.timerId = setInterval(this.scheduler.bind(this), 50);
        this.playing = true;
        this.pulseAnimationToggle();
        this.animateBtnOut(this.domItems.playIcon);
        this.domItems.playIcon.addEventListener('animationend', () => {
          this.domItems.playIcon.style.animationPlayState = "paused";
          this.domItems.playIcon.style.display = "none";
          this.domItems.pauseIcon.style.display = "block";
        })
      } else {
        clearInterval(this.timerId);
        this.playing = false;
        this.pulseAnimationToggle();
        this.animateBtnOut(this.domItems.pauseIcon);
        this.domItems.pauseIcon.addEventListener('animationend', () => {
          this.domItems.pauseIcon.style.animationPlayState = "paused";
          this.domItems.pauseIcon.style.display = "none";
          this.domItems.playIcon.style.display = "block";
        })
      }
    })
  },

  animateBtnOut(btn){
    btn.style.animation = "iconSwitchOut .2s forwards";
    return btn;
  },

  sliderListener(){
    this.domItems.slider.addEventListener('input', () => {
      this.domItems.tempoContainer.innerHTML = this.domItems.slider.value;
      this.bpm = this.domItems.slider.value;
        this.pulseAnimationToggle();
    })
  },

  pulseAnimationToggle(){
    if(this.playing == true){
        this.domItems.metCircle.style.animation = `pulse ${this.calculateBPM()}s infinite`;
    } else {
      this.domItems.metCircle.style.animation = 'none';
    }
  },

  init(){
     // this.updateBPM(document.querySelector('.bpmInput'))
     // this.playMetWithWorker(document.querySelector('.play'), this.bpm);
     // this.calculateBPM(100);
     // document.querySelector('.meta').innerHTML = 100;
     this.bpm = this.domItems.slider.value;
     this.startAudioContext();
     this.playPauseListener();
     this.sliderListener();
   }
}

metronome.init();
