export function createReader({speech,Utterance,onState=()=>{},onFinish=()=>{}}){
 let state='idle',generation=0,current=null;
 const setState=value=>{state=value;onState(value);};
 return {
  get state(){return state;},
  start(text,rate=1){
   const token=++generation;speech.cancel();
   current=new Utterance(text);current.lang='es-CL';current.rate=rate;
   const voices=speech.getVoices();
   current.voice=voices.find(v=>v.lang==='es-CL')||voices.find(v=>v.lang.startsWith('es'))||null;
   current.onend=()=>{if(token!==generation)return;setState('idle');onFinish();};
   current.onerror=event=>{if(token!==generation)return;setState(event.error==='interrupted'||event.error==='canceled'?'idle':'error');};
   setState('playing');speech.speak(current);
  },
  pause(){if(state==='playing'){speech.pause();setState('paused');}},
  resume(){if(state==='paused'){speech.resume();setState('playing');}},
  stop(){++generation;speech.cancel();current=null;setState('idle');}
 };
}

export function createAudioReader({audio,onState=()=>{},onFinish=()=>{}}){
 let state='idle',generation=0,detach=()=>{};
 audio.preload='none';
 const setState=value=>{state=value;onState(value);};
 function play(token){
  setState('loading');
  try {
   Promise.resolve(audio.play())
    .then(()=>{if(token===generation&&state==='loading')setState('playing');})
    .catch(()=>{if(token===generation){detach();setState('error');}});
  }catch{detach();setState('error');}
 }
 return {
  get state(){return state;},
  start(src,rate=1){
   const token=++generation;detach();audio.pause();
   audio.src=src;audio.playbackRate=rate;audio.load();
   const ended=()=>{if(token!==generation)return;detach();setState('idle');onFinish();};
   const failed=()=>{if(token!==generation)return;detach();audio.pause();setState('error');};
   audio.addEventListener('ended',ended);audio.addEventListener('error',failed);
   detach=()=>{audio.removeEventListener('ended',ended);audio.removeEventListener('error',failed);};
   play(token);
  },
  pause(){if(state==='playing'){audio.pause();setState('paused');}},
  resume(){if(state==='paused')play(generation);},
  setRate(rate){audio.playbackRate=rate;},
  stop(){++generation;detach();audio.pause();audio.removeAttribute('src');audio.load();setState('idle');}
 };
}
