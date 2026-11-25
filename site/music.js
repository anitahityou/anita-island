// Original, locally synthesized island loop. Audio starts only on user request.
const musicButton=document.createElement('button');
musicButton.className='music-button';
musicButton.textContent='♫ 开启海岛音乐';
musicButton.setAttribute('aria-pressed','false');
document.querySelector('header').append(musicButton);
let musicContext,master,musicTimer,nextBar=0,barIndex=0,musicEnabled=false;
const chords=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
const melody=[2,1,2,0,1,2,1,0];
function note(frequency,start,duration,volume,type='sine'){
  const oscillator=musicContext.createOscillator();
  const gain=musicContext.createGain();
  oscillator.type=type;oscillator.frequency.value=frequency;
  gain.gain.setValueAtTime(0,start);
  gain.gain.linearRampToValueAtTime(volume,start+.012);
  gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  oscillator.connect(gain);gain.connect(master);
  oscillator.start(start);oscillator.stop(start+duration+.02);
  oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
}
function scheduleMusic(){
  while(nextBar<musicContext.currentTime+.25){
    const chord=chords[barIndex%chords.length],beat=60/(document.documentElement.dataset.party==='true'?124:104);
    for(let step=0;step<8;step++){
      const start=nextBar+step*beat/2;
      note(chord[melody[(step+barIndex)%8]]*2,start,.35,.055);
      if(step%2===0)note(chord[(step/2)%3],start,.48,.035,'triangle');
    }
    if(document.documentElement.dataset.party==='true'){
      for(let kick=0;kick<4;kick++){note(55,nextBar+kick*beat,.15,.18);note(880,nextBar+(kick+.5)*beat,.035,.018,'triangle');}
    }
    note(chord[0]/2,nextBar,.8,.065);
    note(chord[0]/2,nextBar+beat*2,.7,.05);
    nextBar+=beat*4;barIndex++;
  }
}
musicButton.onclick=async()=>{
  try{
    if(!musicContext){
      musicContext=new AudioContext();
      master=musicContext.createGain();master.gain.value=.45;master.connect(musicContext.destination);
    }
    musicEnabled=!musicEnabled;
    if(musicEnabled){
      await musicContext.resume();
      nextBar=Math.max(nextBar,musicContext.currentTime+.05);scheduleMusic();
      musicTimer=setInterval(scheduleMusic,100);
    }else{
      clearInterval(musicTimer);await musicContext.suspend();
    }
    musicButton.textContent=musicEnabled?'♫ 音乐播放中 · 关闭':'♫ 开启海岛音乐';
    musicButton.setAttribute('aria-pressed',String(musicEnabled));
  }catch{
    musicEnabled=false;clearInterval(musicTimer);
    musicButton.textContent='♫ 点击重试音乐';
    musicButton.setAttribute('aria-pressed','false');
  }
};
document.addEventListener('visibilitychange',()=>{
  if(!musicContext||!musicEnabled)return;
  if(document.hidden){clearInterval(musicTimer);musicContext.suspend();}
  else{musicContext.resume().then(()=>{nextBar=Math.max(nextBar,musicContext.currentTime+.05);scheduleMusic();musicTimer=setInterval(scheduleMusic,100);});}
});
