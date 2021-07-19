const BIND_PADS = ['z','x','c','v','b','n','m'];

const pads = document.querySelectorAll('.pad');

pads.forEach(pad => {
  pad.addEventListener('click', () => playNote(pad))
}) 

function playNote(pad){
  const noteAudio = document.getElementById(pad.dataset.note)
  noteAudio.currentTime = 0;
  noteAudio.play()
}

document.addEventListener('keydown', press => {


  const pad = press.pad
  const padIndex = BIND_PADS.indexOf(pad)
  
  
  if(padIndex > -1) playNote(pads[padIndex])
 
 
})
