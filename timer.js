(() => {
  const $ = s => document.querySelector(s);
  const keys=['focus','short','long'];
  const defaults={focus:25,short:5,long:15};
  const labels={focus:'Focus session',short:'Short break',long:'Long break'};
  const startLabels={focus:'Start focus',short:'Start break',long:'Start break'};
  const max={focus:120,short:60,long:60};
  const storageKey='focus-den-v1';
  let saved={};
  let storageAvailable = true;
  let stored;
  try { stored = localStorage.getItem(storageKey); } catch { storageAvailable = false; }
  try { saved = JSON.parse(stored) || {}; } catch {}
  const cleanGoal = value => typeof value === 'string' ? value.slice(0, 120) : '';
  const cleanMinutes = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
  function readHistory(data) {
    const sessions = Array.isArray(data?.sessions) ? data.sessions : [];
    return {
      total: cleanMinutes(data?.total),
      today: cleanMinutes(data?.today),
      sessions: sessions.filter(session => Number.isFinite(session?.end) && session.end > 0 &&
        Number.isInteger(session?.minutes) && session.minutes >= 1 && session.minutes <= max.focus)
        .slice(0, 30)
        .map(session => ({end: session.end, minutes: session.minutes, goal: cleanGoal(session.goal)}))
    };
  }
  const options={...defaults};
  for(const key of keys){const v=saved.options?.[key];if(Number.isInteger(v)&&v>=1&&v<=max[key])options[key]=v;}
  const mode=keys.includes(saved.mode)?saved.mode:'focus';
  const total=()=>options[state.mode]*60000;
  const state={mode,sound:saved.sound===true,day:typeof saved.day==='string'?saved.day:'',count:Number.isSafeInteger(saved.count)&&saved.count>=0?saved.count:0,
    status:['running','paused','done'].includes(saved.status)?saved.status:'idle',
    remaining:0,end:null,celebrateUntil:0};
  state.remaining=Number.isFinite(saved.remaining)?Math.min(total(),Math.max(0,saved.remaining)):total();
  state.end=Number.isFinite(saved.end)&&saved.end>0?saved.end:null;
  if(state.status==='running'&&!state.end){state.status='idle';state.remaining=total();}
  let audio, soundOutput, renderedCount=-1, renderedTitle='';
  let history = readHistory(saved.history);
  const goalInput = $('#focus-goal');
  const storageWarning = $('#storage-warning');
  const restoreAudio = $('#restore-audio');
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const historyDialog = $('#focus-history');
  const historyDate = new Intl.DateTimeFormat(undefined, {month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'});
  goalInput.value = cleanGoal(saved.goal);
  const appearance = window.setupAppearance(saved.appearance, () => save());
  const shop = window.setupCabinShop(saved.rewards, state.count, () => save());
  function updateStorageWarning() {
    storageWarning.textContent = storageAvailable ? '' : 'Browser storage is unavailable. Changes will be lost when you reload or close this page.';
  }
  const save=()=>{
    try{localStorage.setItem(storageKey,JSON.stringify({
      options,mode:state.mode,sound:state.sound,day:state.day,count:state.count,
      status:state.status,remaining:state.remaining,end:state.end,rewards:shop.snapshot(),
      goal: goalInput.value, history, appearance: appearance.snapshot()
    }));
      if (!storageAvailable) {
        storageAvailable = true;
        updateStorageWarning();
      }
    } catch {
      if (storageAvailable) {
        storageAvailable = false;
        updateStorageWarning();
      }
    }
  };
  updateStorageWarning();
  const dayKey=(ts=Date.now())=>{
    const d=new Date(ts);return [d.getFullYear(),d.getMonth()+1,d.getDate()].join('-');
  };
  const rollDay=()=>{
    const today=dayKey();
    if(today!==state.day){
      state.day=today;
      state.count=0;
      history.today=0;
      if(historyDialog.open)renderHistory();
      save();
    }
  };
  const playIcon='<path d="M4 2h3v2h3v2h3v4h-3v2H7v2H4z"/>';
  const pauseIcon='<path d="M3 2h4v12H3zm6 0h4v12H9z"/>';
  const starIcon='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 1h4v5h6v4h-3v3h2v5h-5v-3H8v3H3v-5h2v-3H2V6h6z"/></svg>';
  const tracks=$('#tracks'),stars=$('#stars'),startBtn=$('#start'),dialog=$('#preferences');
  const segments=Array.from({length:16},()=>tracks.appendChild(document.createElement('span')));
  const modeButtons=[...document.querySelectorAll('[data-mode]')];
  function renderHistory() {
    $('#history-today').textContent = history.today + ' min';
    $('#history-total').textContent = history.total + ' min';
    $('#history-empty').hidden = history.sessions.length > 0;
    const rows = history.sessions.filter(session => Number.isFinite(new Date(session.end).getTime())).map(session => {
      const row = document.createElement('li');
      const details = document.createElement('div');
      const title = document.createElement('strong');
      const time = document.createElement('time');
      const minutes = document.createElement('span');
      title.textContent = session.goal || 'Focus session';
      time.dateTime = new Date(session.end).toISOString();
      time.textContent = historyDate.format(session.end);
      minutes.textContent = session.minutes + ' min';
      details.append(title, time);
      row.append(details, minutes);
      return row;
    });
    $('#history-sessions').replaceChildren(...rows);
  }
  goalInput.addEventListener('input', save);
  $('#open-history').addEventListener('click', () => {
    tick();
    renderHistory();
    historyDialog.showModal();
  });
  $('#close-history').addEventListener('click', () => historyDialog.close());
  function soundReady() {
    if (!state.sound || !AudioContext) return;
    try {
      if (!audio) {
        audio = new AudioContext();
        soundOutput = audio.createGain();
        soundOutput.connect(audio.destination);
      }
      if (audio.state !== 'running') return audio.resume().catch(() => {});
    } catch {}
  }
  function restoreSoundOnInteraction(event) {
    if (event.isTrusted && audio?.state !== 'running') soundReady();
  }
  document.addEventListener('click', restoreSoundOnInteraction, true);
  document.addEventListener('keydown', restoreSoundOnInteraction, true);
  restoreAudio.addEventListener('click', async () => {
    await soundReady();
    if (audio?.state === 'running') startBtn.focus();
    render();
  });
  function playNotes(frequencies, spacing, duration, volume, wave = 'triangle') {
    if (!state.sound || audio?.state !== 'running') return;
    const start = audio.currentTime;
    frequencies.forEach((frequency, index) => {
      const time = start + index * spacing;
      const note = audio.createOscillator();
      const gain = audio.createGain();
      note.type = wave;
      note.frequency.value = frequency;
      gain.gain.setValueAtTime(.001, time);
      gain.gain.exponentialRampToValueAtTime(volume, time + .022);
      gain.gain.exponentialRampToValueAtTime(.001, time + duration - .02);
      note.connect(gain);
      gain.connect(soundOutput);
      note.start(time);
      note.stop(time + duration);
    });
  }
  function chime() {
    playNotes([523.25, 659.25, 783.99, 1046.5], .12, .45, .10);
  }
  let lastPetSound = -Infinity;
  document.addEventListener('rue-petted', async event => {
    if (!state.sound) return;
    await soundReady();
    if (!state.sound || audio?.state !== 'running' || audio.currentTime - lastPetSound < .16) return;
    lastPetSound = audio.currentTime;
    if (event.detail === 'spin') {
      playNotes([1046.5, 1318.51, 1567.98, 2093], .055, .18, .032, 'sine');
    } else {
      playNotes([659.25, 987.77], .065, .15, .045);
    }
  });
  function renderShelf(pop){
    if(renderedCount===state.count&&!pop)return;
    renderedCount=state.count;
    stars.innerHTML=Array.from({length:4},(_,i)=>'<span class="star-slot'+(i<state.count?' earned':'')+(pop&&i===Math.min(state.count,4)-1?' pop':'')+'">'+starIcon+'</span>').join('');
    if(state.count>4){const more=document.createElement('span');more.className='more';more.textContent='+'+(state.count-4);stars.append(more);}
    stars.setAttribute('aria-label',state.count+' focus '+(state.count===1?'session':'sessions')+' today');
    $('#shelf-note').textContent=state.count?state.count+(state.count===1?' focus session':' focus sessions')+' finished today.':'Finish a focus session to earn a little star.';
  }
  const put=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
  const announce=value=>put($('#announcement'),value);
  function render(pop=false){
    const running=state.status==='running',focus=state.mode==='focus',done=state.status==='done';
    const s=Math.ceil(state.remaining/1000);
    const time=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
    const title=(running?time+' · ':'')+'STILLSPACE';
    if(title!==renderedTitle){document.title=title;renderedTitle=title;}
    put($('#time'),time);
    modeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===state.mode)));
    put($('#clock-note'),running?(focus?'One thing at a time.':'Take a slow breath.'):done?(focus?'Nicely done. Time for a breather.':'Ready for another round?'):state.status==='paused'?'Take your time.':focus?'Ready when you are.':'A little room to breathe.');
    restoreAudio.hidden = !running || !state.sound || !AudioContext || audio?.state === 'running';
    put(startBtn.querySelector('span'),running?'Pause':state.status==='paused'?'Resume':done?(focus?'Take a break':'Back to focus'):startLabels[state.mode]);
    const icon=running?pauseIcon:playIcon;
    const svg=startBtn.querySelector('svg');
    if(svg.dataset.icon!==icon){svg.innerHTML=icon;svg.dataset.icon=icon;}
    const progress=Math.max(0,Math.min(1,1-state.remaining/total()));
    tracks.setAttribute('aria-valuenow',String(Math.round(progress*100)));
    segments.forEach((seg,i)=>seg.classList.toggle('filled',progress>i/segments.length));
    const scene=Date.now()<state.celebrateUntil?'celebrate':running?(focus?'focus':'break'):'idle';
    if(document.body.dataset.scene!==scene)document.body.dataset.scene=scene;
    put($('#fox-note'),scene==='focus'?'Reading right beside you.':scene==='break'?'Taking a tiny fox nap.':scene==='celebrate'?'A little hop for you!':'Keeping your spot warm.');
    const mood=$('#mood');
    const moodText=scene==='focus'?' Reading':scene==='break'?' Snoozing':scene==='celebrate'?' Hooray!':' Cozy';
    if(mood.lastChild.textContent!==moodText)mood.lastChild.textContent=moodText;
    const sound=$('#sound');
    if (soundOutput) soundOutput.gain.value = Number(state.sound);
    sound.setAttribute('aria-pressed',String(state.sound));
    put(sound.querySelector('span'),state.sound?'Sound on':'Sound off');
    sound.querySelector('path').setAttribute('d',state.sound?'M4 9h4l5-4v14l-5-4H4zM16 9q3 3 0 6m2-9q6 6 0 12':'M4 9h4l5-4v14l-5-4H4zM16 9l5 6m0-6-5 6');
    renderShelf(pop);
  }
  function tick(){
    rollDay();
    let pop=false;
    if(state.status==='running'){
      const now=Date.now();
      state.remaining=Math.max(0,state.end-now);
      if(state.remaining===0){
        const end=state.end;
        state.status='done';state.end=null;
        if(state.mode==='focus'){
          shop.earn();
          const minutes = options.focus;
          if(dayKey(end)===state.day){state.count++;history.today+=minutes;pop=true;}
          history.total += minutes;
          history.sessions.unshift({end, minutes, goal: goalInput.value.trim()});
          if (history.sessions.length > 30) history.sessions.pop();
          if (historyDialog.open) renderHistory();
          if(now-end<10000)state.celebrateUntil=now+6500;
          announce('Focus session complete. You earned a star.');
        }else announce('Break complete.');
        if(now-end<10000)chime();
        save();
      }
    }
    render(pop);
  }
  function reset(mode=state.mode){
    state.mode=mode;state.status='idle';state.end=null;state.remaining=total();state.celebrateUntil=0;
    save();render();
  }
  function toggle(){
    soundReady();
    tick();
    if(state.status==='done'){
      reset(state.mode==='focus'?'short':'focus');
      announce(labels[state.mode]+' selected.');
      return;
    }
    if(state.status==='running'){state.status='paused';state.end=null;announce('Timer paused.');}
    else {state.status='running';state.end=Date.now()+state.remaining;announce(labels[state.mode]+' started.');}
    save();render();
  }
  modeButtons.forEach(btn=>btn.addEventListener('click',()=>{
    if(btn.dataset.mode!==state.mode){tick();reset(btn.dataset.mode);announce(labels[state.mode]+' selected.');}
  }));
  startBtn.addEventListener('click',toggle);
  $('#reset').addEventListener('click',()=>{tick();reset();announce('Timer reset.');});
  $('#sound').addEventListener('click',()=>{state.sound=!state.sound;soundReady();save();render();});
  const form=$('#settings-form');
  $('#settings').addEventListener('click',()=>{
    for(const key of keys)form.elements[key].value=options[key];
    $('#reset-hint').hidden=!['running','paused'].includes(state.status);
    dialog.showModal();
  });
  $('#close-settings').addEventListener('click',()=>dialog.close());
  form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    tick();
    const changed=options[state.mode]!==Number(form.elements[state.mode].value);
    for(const key of keys)options[key]=Number(form.elements[key].value);
    if(changed)reset();else{save();render();}
    dialog.close();announce('Timer settings saved.');
  });
  window.addEventListener('keydown',e=>{
    if(e.code==='Space'&&!e.repeat&&!document.querySelector('dialog[open]')&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&
      !(e.target instanceof Element&&e.target.closest('button,input,a,textarea,select,[contenteditable]'))){e.preventDefault();toggle();}
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
  window.addEventListener('storage', event => {
    if (event.key !== storageKey || !event.newValue) return;
    let next;
    try { next = JSON.parse(event.newValue); } catch { return; }
    if (!next?.options || !keys.includes(next.mode)) return;
    for (const key of keys) options[key] = next.options[key];
    Object.assign(state, {
      mode: next.mode, sound: next.sound, day: next.day, count: next.count,
      status: next.status, remaining: next.remaining, end: next.end
    });
    shop.restore(next.rewards, next.count);
    appearance.restore(next.appearance);
    goalInput.value = cleanGoal(next.goal);
    history = readHistory(next.history);
    if (historyDialog.open) renderHistory();
    render();
  });
  if (state.status === 'running') soundReady();
  tick();setInterval(tick,250);
})();
