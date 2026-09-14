(()=>{
'use strict';

const $=s=>document.querySelector(s);
const STORAGE_KEY='matletica.state.v1';
const TOTAL_QUESTIONS=10;

const DISCIPLINES={
  sums:{title:'Somme',icon:'+',sub:'Addizioni a mente',color:'#1f9d75',levels:[
    {label:'Livello 1',range:[0,10],thresholds:[2,4,7]},
    {label:'Livello 2',range:[0,50],thresholds:[2,4,7]},
    {label:'Livello 3',range:[11,99],thresholds:[4,6,9]}
  ]},
  tables:{title:'Tabelline',icon:'×',sub:'Prodotti rapidi',color:'#e08124',levels:[
    {label:'Livello 1',a:[2,5],b:[2,9],thresholds:[3,5,8],simple:true},
    {label:'Livello 2',a:[0,10],b:[0,10],thresholds:[2,4,7]}
  ]},
  multiplications:{title:'Moltiplicazioni',icon:'××',sub:'Prodotti più impegnativi',color:'#b86618',levels:[
    {label:'Livello 2',number:2,recordKey:'L2',a:[0,10],b:[10,99],thresholds:[5,9,14],speedPenalties:[0,1,3]},
    {label:'Livello 3',number:3,recordKey:'L3',a:[11,99],b:[11,99],thresholds:[15,25,35],speedPenalties:[0,1,3]}
  ]},
  squares:{title:'Quadrati',icon:'x²',sub:'Eleva al quadrato',color:'#7059c7',levels:[
    {label:'Livello 1',range:[0,20],thresholds:[20,25,33]},
    {label:'Livello 2',range:[11,99],thresholds:[20,25,33]}
  ]},
  gcd:{title:'MCD',icon:'M',sub:'Massimo Comune Divisore',color:'#2678c8',levels:[
    {label:'Livello 1',a:[1,10],b:[1,10],thresholds:[8,12,20]},
    {label:'Livello 2',a:[2,20],b:[2,25],thresholds:[8,12,20]}
  ]},
  lcm:{title:'mcm',icon:'m',sub:'Minimo comune multiplo',color:'#3f67b1',levels:[
    {label:'Livello 1',range:[1,10],thresholds:[8,12,20],speedPenalties:[0,1,3]},
    {label:'Livello 2',range:[1,20],thresholds:[8,12,20],speedPenalties:[0,1,3]}
  ]},
  percent:{title:'Percentuali',icon:'%',sub:'Percentuali a mente',color:'#cf4f83',levels:[
    {label:'Livello 1',thresholds:[5,9,14],p:[10,20,25,50,100,0],n:[100,1000,400,10,200,2000,4000]},
    {label:'Livello 2',thresholds:[6,14,20],p:[10,20,25,50,5,30,60],n:[100,1000,400,10,200,2000,4000,150,300,1500,3000,50,500,30,60]},
    {label:'Livello 3',thresholds:[8,18,25],p:[10,20,25,50,5,30,60,15,30,40,75,90,95,2,1],n:[100,1000,400,10,200,2000,4000,150,300,1500,3000,50,500,30,60,90,900,35,80]}
  ]},
  segments:{title:'Segmenti',icon:'↔',sub:'Somma e differenza',color:'#d5633b',levels:[
    {label:'Livello 1',range:[1,10],thresholds:[8,10,15]},
    {label:'Livello 2',range:[1,20],thresholds:[9,12,16]}
  ]},
  pythagoras:{title:'Pitagora',icon:'△',sub:'Teorema di Pitagora',color:'#178aa6',oral:true,levels:[
    {label:'Livello 1',thresholds:[10,20,25],hidden:'hyp'},
    {label:'Livello 2',thresholds:[10,20,25],hidden:'cat'}
  ]},
  polygonFormulas:{title:'Formule · Poligoni',icon:'▱',sub:'Area e perimetro',color:'#0f8f73',oral:true,levels:[
    {label:'Livello 1',thresholds:[10,20,25],shapes:['triangolo scaleno','triangolo isoscele','triangolo equilatero','triangolo rettangolo','quadrato','rombo','parallelogramma','trapezio scaleno','trapezio isoscele','trapezio rettangolo','rettangolo']},
    {label:'Livello 2',thresholds:[10,20,25],shapes:['triangolo scaleno','triangolo isoscele','triangolo equilatero','triangolo rettangolo','quadrato','deltoide','rombo','parallelogramma','trapezio scaleno','trapezio isoscele','trapezio rettangolo','rettangolo','cerchio','esagono','pentagono']}
  ]},
  solidFormulas:{title:'Formule · Solidi',icon:'⬡',sub:'Aree e volume',color:'#3476b8',oral:true,levels:[
    {label:'Livello 1',thresholds:[10,20,25],solids:['cubo','piramide','prisma retto','cilindro','cono','parallelepipedo']}
  ]},
  fractionSums:{title:'Frazioni · Somma',icon:'½+',sub:'Somma e riduci',color:'#9b4db2',levels:[
    {label:'Livello 1',num:[0,5],den:[1,5],thresholds:[8,12,20],speedPenalties:[1,2,3]},
    {label:'Livello 2',num:[0,9],den:[1,10],thresholds:[12,16,24],speedPenalties:[1,2,3]}
  ]},
  fractionProducts:{title:'Frazioni · Moltiplica',icon:'½×',sub:'Moltiplica e riduci',color:'#7a53c7',levels:[
    {label:'Livello 1',num:[1,5],den:[1,5],thresholds:[6,12,20],speedPenalties:[0,1,3]},
    {label:'Livello 2',num:[1,10],den:[1,10],thresholds:[8,12,20],speedPenalties:[1,2,3]}
  ]}
};

const els={
  homeScreen:$('#homeScreen'),gameScreen:$('#gameScreen'),grid:$('#disciplineGrid'),
  homeBtn:$('#homeBtn'),backBtn:$('#backBtn'),athleteBtn:$('#athleteBtn'),athleteTopName:$('#athleteTopName'),welcomeName:$('#welcomeName'),
  themeBtn:$('#themeBtn'),soundBtn:$('#soundBtn'),fullscreenBtn:$('#fullscreenBtn'),infoBtn:$('#infoBtn'),installBtn:$('#installBtn'),
  gameTitle:$('#gameTitle'),gameLevel:$('#gameLevel'),recordMini:$('#recordMini'),
  hudProgress:$('#hudProgress'),hudCorrect:$('#hudCorrect'),hudWrong:$('#hudWrong'),hudTime:$('#hudTime'),hudSpeed:$('#hudSpeed'),
  sollyGame:$('#sollyGame'),gabbyGame:$('#gabbyGame'),speechBubble:$('#speechBubble'),
  questionHint:$('#questionHint'),questionText:$('#questionText'),visualArea:$('#visualArea'),solutionReveal:$('#solutionReveal'),
  answerForm:$('#answerForm'),answerInput:$('#answerInput'),oralControls:$('#oralControls'),oralAnsweredBtn:$('#oralAnsweredBtn'),teacherGrade:$('#teacherGrade'),teacherWrongBtn:$('#teacherWrongBtn'),teacherCorrectBtn:$('#teacherCorrectBtn'),feedbackLine:$('#feedbackLine'),
  athleteModal:$('#athleteModal'),athleteForm:$('#athleteForm'),athleteInput:$('#athleteInput'),cancelAthleteBtn:$('#cancelAthleteBtn'),
  confirmModal:$('#confirmModal'),confirmText:$('#confirmText'),confirmNo:$('#confirmNo'),confirmYes:$('#confirmYes'),
  resultModal:$('#resultModal'),resultMascot:$('#resultMascot'),resultTitle:$('#resultTitle'),resultScore:$('#resultScore'),resultTime:$('#resultTime'),resultAvg:$('#resultAvg'),resultSpeed:$('#resultSpeed'),resultRecord:$('#resultRecord'),resultMessage:$('#resultMessage'),resultHomeBtn:$('#resultHomeBtn'),resultRetryBtn:$('#resultRetryBtn'),resultNextBtn:$('#resultNextBtn'),
  infoModal:$('#infoModal'),closeInfoBtn:$('#closeInfoBtn')
};

let appState=loadState();
let game=null;
let installPrompt=null;
let timerRAF=0;
let warningTimers=[];
let audioCtx=null;

function defaultState(){return {theme:'light',sound:true,currentAthlete:'',athletes:{}}}
function loadState(){
  try{return {...defaultState(),...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return defaultState()}
}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(appState))}
function normName(s){return s.trim().replace(/\s+/g,' ').toLocaleLowerCase('it')}
function athleteData(){
  const k=normName(appState.currentAthlete||'');
  if(!k) return null;
  if(!appState.athletes[k]) appState.athletes[k]={displayName:appState.currentAthlete,records:{},history:[]};
  return appState.athletes[k];
}
function recKey(kind,level){const lv=DISCIPLINES[kind]?.levels?.[level];return `${kind}_${lv?.recordKey??level}`}
function getRecord(kind,level){return athleteData()?.records?.[recKey(kind,level)]||null}
function fmtTime(sec){if(sec==null||!Number.isFinite(sec))return '—';return `${sec.toFixed(sec<10?1:0)} s`}
function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function pick(arr){return arr[randInt(0,arr.length-1)]}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a}
function lcm(a,b){return Math.abs(a*b)/gcd(a,b)}
function reduceFraction(num,den){if(den<0){num=-num;den=-den}if(num===0)return {num:0,den:1};const g=gcd(num,den);return {num:num/g,den:den/g}}
function fractionText(num,den){return den===1?String(num):`${num}/${den}`}
function fractionHtml(num,den){return `<span class="frac"><span class="num">${num}</span><span class="den">${den}</span></span>`}
function cleanNumber(n){return Math.abs(n-Math.round(n))<1e-10?String(Math.round(n)):String(Math.round(n*10000)/10000).replace('.',',')}
function perfectSqrtText(n){const r=Math.sqrt(n);return Number.isInteger(r)?String(r):`√${n}`}
const POLYGON_FORMULAS={
  'triangolo scaleno':{area:'A = (b × h) / 2',perimetro:'P = a + b + c'},
  'triangolo isoscele':{area:'A = (b × h) / 2',perimetro:'P = b + 2l'},
  'triangolo equilatero':{area:'A = (l² × √3) / 4',perimetro:'P = 3l'},
  'triangolo rettangolo':{area:'A = (c₁ × c₂) / 2',perimetro:'P = c₁ + c₂ + i'},
  'quadrato':{area:'A = l²',perimetro:'P = 4l'},
  'deltoide':{area:'A = (D × d) / 2',perimetro:'P = 2(a + b)'},
  'rombo':{area:'A = (D × d) / 2',perimetro:'P = 4l'},
  'parallelogramma':{area:'A = b × h',perimetro:'P = 2(b + l)'},
  'trapezio scaleno':{area:'A = ((B + b) × h) / 2',perimetro:'P = B + b + l₁ + l₂'},
  'trapezio isoscele':{area:'A = ((B + b) × h) / 2',perimetro:'P = B + b + 2l'},
  'trapezio rettangolo':{area:'A = ((B + b) × h) / 2',perimetro:'P = B + b + h + l'},
  'rettangolo':{area:'A = b × h',perimetro:'P = 2(b + h)'},
  'cerchio':{area:'A = πr²',perimetro:'C = 2πr'},
  'esagono':{area:'A = (P × a) / 2',perimetro:'P = 6l'},
  'pentagono':{area:'A = (P × a) / 2',perimetro:'P = 5l'}
};
const SOLID_FORMULAS={
  'cubo':{'Area laterale':'Aₗ = 4l²','Area totale':'Aₜ = 6l²','Volume':'V = l³'},
  'piramide':{'Area laterale':'Aₗ = (Pᵦ × a) / 2','Area totale':'Aₜ = Aₗ + Aᵦ','Volume':'V = (Aᵦ × h) / 3'},
  'prisma retto':{'Area laterale':'Aₗ = Pᵦ × h','Area totale':'Aₜ = Aₗ + 2Aᵦ','Volume':'V = Aᵦ × h'},
  'cilindro':{'Area laterale':'Aₗ = 2πrh','Area totale':'Aₜ = 2πr(r + h)','Volume':'V = πr²h'},
  'cono':{'Area laterale':'Aₗ = πra','Area totale':'Aₜ = πr(a + r)','Volume':'V = (πr²h) / 3'},
  'parallelepipedo':{'Area laterale':'Aₗ = 2h(a + b)','Area totale':'Aₜ = 2(ab + ah + bh)','Volume':'V = abh'}
};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

function applyTheme(){
  document.documentElement.dataset.theme=appState.theme;
  els.themeBtn.textContent=appState.theme==='dark'?'☀':'☾';
  document.querySelector('meta[name="theme-color"]').setAttribute('content',appState.theme==='dark'?'#172724':'#129c89');
}
function updateSound(){els.soundBtn.textContent=appState.sound?'🔊':'🔇'}
function renderAthlete(){
  const n=appState.currentAthlete||'Nuovo matleta';
  els.athleteTopName.textContent=n;
  els.welcomeName.textContent=appState.currentAthlete||'—';
}

function renderHome(){
  renderAthlete();
  els.grid.innerHTML='';
  Object.entries(DISCIPLINES).forEach(([kind,d])=>{
    const card=document.createElement('article');
    card.className='discipline-card';card.style.setProperty('--card-color',d.color);
    const levels=d.levels.map((lv,i)=>{
      const r=getRecord(kind,i);
      const title=r?`Migliore: ${r.bestScore||0}/10${r.bestTime!=null?` – ${fmtTime(r.bestTime)}`:''}`:'Nessun risultato ancora';
      return `<button class="level-btn ${r?'has-record':''}" data-kind="${kind}" data-level="${i}" title="${title}">L${lv.number??i+1}</button>`
    }).join('');
    card.innerHTML=`<div class="disc-head"><div class="disc-icon">${d.icon}</div><div><div class="disc-title">${d.title}</div><div class="disc-sub">${d.sub}</div></div></div><div class="level-row">${levels}</div>`;
    els.grid.appendChild(card);
  });
}

function showScreen(which){
  els.homeScreen.classList.toggle('active',which==='home');
  els.gameScreen.classList.toggle('active',which==='game');
  if(which==='home'){stopQuestionClock();clearWarnings();speechSynthesis?.cancel?.();renderHome()}
}

function openAthleteModal(canCancel=!!appState.currentAthlete){
  els.athleteInput.value='';
  els.cancelAthleteBtn.classList.toggle('hidden',!canCancel);
  els.athleteModal.classList.remove('hidden');
  setTimeout(()=>els.athleteInput.focus(),80);
}
function closeAthleteModal(){els.athleteModal.classList.add('hidden')}
function setAthlete(name){
  const display=name.trim().replace(/\s+/g,' '); if(!display)return;
  appState.currentAthlete=display;
  const k=normName(display);
  if(!appState.athletes[k])appState.athletes[k]={displayName:display,records:{},history:[]};
  else appState.athletes[k].displayName=display;
  saveState();renderAthlete();renderHome();closeAthleteModal();
  say(`Siamo pronti ${display}?`);
}

function buildQuestion(kind,level){
  const lv=DISCIPLINES[kind].levels[level];
  if(kind==='sums'){
    const a=randInt(...lv.range),b=randInt(...lv.range);return {html:`${a} + ${b}`,speak:`${a} più ${b}`,answer:a+b,correctText:String(a+b),hint:'Calcola a mente'};
  }
  if(kind==='tables'){
    const a=randInt(...lv.a),b=randInt(...lv.b);return {html:`${a} × ${b}`,speak:`${a} per ${b}`,answer:a*b,correctText:String(a*b),hint:lv.simple?'Tabelline semplici':'Tabelline'};
  }
  if(kind==='multiplications'){
    const a=randInt(...lv.a),b=randInt(...lv.b);return {html:`${a} × ${b}`,speak:`${a} per ${b}`,answer:a*b,correctText:String(a*b),hint:'Moltiplica a mente'};
  }
  if(kind==='squares'){
    const a=randInt(...lv.range);return {html:`${a}<sup>2</sup>`,speak:`${a} alla seconda`,answer:a*a,correctText:String(a*a),hint:'Eleva al quadrato'};
  }
  if(kind==='gcd'){
    const a=randInt(...lv.a),b=randInt(...lv.b),ans=gcd(a,b);return {html:`MCD(${a}, ${b})`,speak:`Massimo Comune Divisore tra ${a} e ${b}`,answer:ans,correctText:String(ans),hint:'Calcola il Massimo Comune Divisore'};
  }
  if(kind==='lcm'){
    const a=randInt(...lv.range),b=randInt(...lv.range),ans=lcm(a,b);return {html:`mcm(${a}, ${b})`,speak:`Minimo comune multiplo tra ${a} e ${b}`,answer:ans,correctText:String(ans),hint:'Calcola il minimo comune multiplo'};
  }
  if(kind==='percent'){
    const p=pick(lv.p),n=pick(lv.n),ans=p*n/100;return {html:`${p}% <span class="of-word">di</span> ${n}`,speak:`${p} per cento di ${n}`,answer:ans,correctText:cleanNumber(ans),hint:'Calcola la percentuale'};
  }
  if(kind==='segments'){
    const a=randInt(...lv.range),b=randInt(...lv.range),sum=a+b,diff=Math.abs(a-b);return {html:`S = ${sum} &nbsp; D = ${diff}`,speak:`La somma vale ${sum}, la differenza vale ${diff}. Quanto misurano i due segmenti?`,answer:[a,b].sort((x,y)=>x-y),correctText:`${Math.min(a,b)} e ${Math.max(a,b)}`,hint:'Scrivi i due valori separati da uno spazio',segments:true};
  }
  if(kind==='fractionSums'){
    const n1=randInt(...lv.num),d1=randInt(...lv.den),n2=randInt(...lv.num),d2=randInt(...lv.den);
    const common=lcm(d1,d2),num=n1*(common/d1)+n2*(common/d2),r=reduceFraction(num,common);
    return {html:`<span class="frac-expression">${fractionHtml(n1,d1)}<span class="frac-op">+</span>${fractionHtml(n2,d2)}</span>`,speak:`${n1} fratto ${d1}, più ${n2} fratto ${d2}`,fractionAnswer:r,correctText:fractionText(r.num,r.den),hint:'Somma e scrivi il risultato ridotto ai minimi termini'};
  }
  if(kind==='fractionProducts'){
    const n1=randInt(...lv.num),d1=randInt(...lv.den),n2=randInt(...lv.num),d2=randInt(...lv.den),r=reduceFraction(n1*n2,d1*d2);
    return {html:`<span class="frac-expression">${fractionHtml(n1,d1)}<span class="frac-op">×</span>${fractionHtml(n2,d2)}</span>`,speak:`${n1} fratto ${d1}, per ${n2} fratto ${d2}`,fractionAnswer:r,correctText:fractionText(r.num,r.den),hint:'Moltiplica e scrivi il risultato ridotto ai minimi termini'};
  }
  if(kind==='polygonFormulas'){
    const shape=pick(lv.shapes),request=pick(['area','perimetro']),solution=POLYGON_FORMULAS[shape][request];
    const label=request==='perimetro'&&shape==='cerchio'?'circonferenza':request;
    return {html:`<span class="oral-formula-question">${label.toUpperCase()}<small>del</small>${esc(shape.toUpperCase())}</span>`,speak:`Formula ${label} del ${shape}`,hint:'Di’ la formula ad alta voce, poi premi “Ho risposto”',oral:true,correctText:solution,solution:`${label.charAt(0).toUpperCase()+label.slice(1)} del ${shape}: ${solution}`,teacherFormula:true};
  }
  if(kind==='solidFormulas'){
    const solid=pick(lv.solids),request=pick(['Area laterale','Area totale','Volume']),solution=SOLID_FORMULAS[solid][request];
    return {html:`<span class="oral-formula-question">${esc(request.toUpperCase())}<small>del</small>${esc(solid.toUpperCase())}</span>`,speak:`Formula ${request.toLowerCase()} del ${solid}`,hint:'Di’ la formula ad alta voce, poi premi “Ho risposto”',oral:true,correctText:solution,solution:`${request} del ${solid}: ${solution}`,teacherFormula:true};
  }
  if(kind==='pythagoras'){
    if(level===0){
      const c1=randInt(1,10),c2=randInt(1,10),rad=c1*c1+c2*c2;
      return {html:'Quanto vale l’ipotenusa?',speak:`Cateti ${c1} e ${c2}. Quanto vale l'ipotenusa?`,hint:'Rispondi ad alta voce, poi premi “Ho risposto”',oral:true,triangle:{c1,c2,h:'?'},correctText:perfectSqrtText(rad),solution:`i = √(${c1}² + ${c2}²) = ${perfectSqrtText(rad)}`};
    }else{
      let h,c2;do{h=randInt(2,10);c2=randInt(1,9)}while(h<=c2);
      const rad=h*h-c2*c2;
      return {html:'Quanto vale il cateto?',speak:`Ipotenusa ${h} e cateto ${c2}. Quanto vale l'altro cateto?`,hint:'Rispondi ad alta voce, poi premi “Ho risposto”',oral:true,triangle:{c1:'?',c2,h},correctText:perfectSqrtText(rad),solution:`c = √(${h}² − ${c2}²) = ${perfectSqrtText(rad)}`};
    }
  }
  throw new Error('Tipo di prova non riconosciuto');
}

function triangleSvg(t){
  const c1=esc(t.c1),c2=esc(t.c2),h=esc(t.h);
  return `<svg class="pythag-svg" viewBox="0 0 520 270" role="img" aria-label="Triangolo rettangolo">
    <path class="tri" d="M85 220 L85 45 L455 220 Z"/>
    <path class="rightmark" d="M85 190 L115 190 L115 220"/>
    <text x="34" y="138">${c1}</text><text x="258" y="252">${c2}</text><text x="285" y="112" transform="rotate(25 285 112)">${h}</text>
  </svg>`;
}

function startGame(kind,level){
  if(!appState.currentAthlete){openAthleteModal(false);return}
  const d=DISCIPLINES[kind],lv=d.levels[level];
  game={kind,level,index:0,correct:0,wrong:0,responseTimes:[],speedPenalty:0,question:null,qStart:0,locked:false,oralFrozen:null};
  els.gameTitle.textContent=d.title;els.gameLevel.textContent=lv.label;
  const rec=getRecord(kind,level);els.recordMini.textContent=`Record: ${rec?.bestTime!=null?fmtTime(rec.bestTime):'—'}`;
  showScreen('game');
  resetMascots();
  els.feedbackLine.textContent=`${appState.currentAthlete}, concentrati e… via!`;
  say(introFor(kind,level));
  nextQuestion();
}
function introFor(kind,level){
  const n=appState.currentAthlete;
  const map={sums:'alleniamo le somme',tables:'ripassiamo le tabelline',multiplications:'affrontiamo le moltiplicazioni',squares:'eleviamo al quadrato',gcd:'calcoliamo il Massimo Comune Divisore',lcm:'calcoliamo il minimo comune multiplo',percent:'alleniamo le percentuali',segments:'affrontiamo i problemi sui segmenti',pythagoras:'alleniamo il Teorema di Pitagora',polygonFormulas:'ripassiamo le formule dei poligoni',solidFormulas:'ripassiamo le formule dei solidi',fractionSums:'sommiamo le frazioni',fractionProducts:'moltiplichiamo le frazioni'};
  const lv=DISCIPLINES[kind].levels[level];
  return `${n}, ${map[kind]}. Livello ${lv.number??level+1}. Iniziamo!`;
}
function resetMascots(){
  els.sollyGame.src='assets/solly/normal.png';els.gabbyGame.src='assets/gabby/normal.png';
  els.speechBubble.classList.add('hidden');
}
function nextQuestion(){
  if(!game||game.index>=TOTAL_QUESTIONS){finishGame();return}
  game.locked=false;game.oralFrozen=null;resetMascots();clearWarnings();
  game.question=buildQuestion(game.kind,game.level);
  els.questionHint.textContent=game.question.hint||'';
  els.questionText.innerHTML=game.question.html;
  els.solutionReveal.classList.add('hidden');els.solutionReveal.textContent='';
  if(game.question.oral){
    if(game.question.triangle){els.visualArea.innerHTML=triangleSvg(game.question.triangle);els.visualArea.classList.remove('hidden')}
    else{els.visualArea.classList.add('hidden');els.visualArea.innerHTML=''}
    els.answerForm.classList.add('hidden');els.oralControls.classList.remove('hidden');els.oralAnsweredBtn.classList.remove('hidden');els.teacherGrade.classList.add('hidden');
  }else{
    els.visualArea.classList.add('hidden');els.visualArea.innerHTML='';
    els.answerForm.classList.remove('hidden');els.oralControls.classList.add('hidden');
    els.answerInput.value='';els.answerInput.placeholder=game.question.segments?'es. 4 9':game.question.fractionAnswer?'es. 3/4':'Scrivi la risposta';
    setTimeout(()=>els.answerInput.focus(),50);
  }
  updateHUD();
  startQuestionClock();scheduleWarnings();
  say(game.question.speak);
}

function startQuestionClock(){
  stopQuestionClock();game.qStart=performance.now();
  const tick=()=>{if(!game||game.locked)return;const s=(performance.now()-game.qStart)/1000;els.hudTime.textContent=`${s.toFixed(1)} s`;timerRAF=requestAnimationFrame(tick)};tick();
}
function stopQuestionClock(){if(timerRAF)cancelAnimationFrame(timerRAF);timerRAF=0}
function elapsed(){return game?.oralFrozen??((performance.now()-game.qStart)/1000)}
function clearWarnings(){warningTimers.forEach(clearTimeout);warningTimers=[]}
function scheduleWarnings(){
  const th=DISCIPLINES[game.kind].levels[game.level].thresholds;
  const messages=['Sbrigati!','Sei proprio una lumaca!','Tempo… corri!'];
  th.forEach((s,i)=>warningTimers.push(setTimeout(()=>{
    if(!game||game.locked)return;
    els.speechBubble.textContent=messages[i];els.speechBubble.classList.remove('hidden');
    els.gabbyGame.src=i===0?'assets/gabby/sorpresa.png':i===1?'assets/gabby/arrabbiata.png':'assets/gabby/congelata.png';
    say(messages[i]);
  },s*1000)));
}
function speedPenaltyFor(sec){
  const lv=DISCIPLINES[game.kind].levels[game.level],th=lv.thresholds,pen=lv.speedPenalties||[0,1,3];
  if(sec>th[2])return pen[2];if(sec>th[1])return pen[1];if(sec>th[0])return pen[0];return 0;
}
function speedScore(){return Math.max(0,10-game.speedPenalty)}
function updateHUD(){
  if(!game)return;
  els.hudProgress.textContent=`${Math.min(game.index+1,10)}/10`;els.hudCorrect.textContent=game.correct;els.hudWrong.textContent=game.wrong;els.hudSpeed.textContent=`${speedScore()}/10`;
}
function parseAutomaticAnswer(raw,q){
  const s=raw.trim();if(!s)return false;
  if(q.segments){
    const nums=s.replace(/,/g,'.').match(/-?\d+(?:\.\d+)?/g)?.map(Number)||[];
    if(nums.length<2)return false;const a=nums.slice(0,2).sort((x,y)=>x-y);return a[0]===q.answer[0]&&a[1]===q.answer[1];
  }
  if(q.fractionAnswer){
    const compact=s.replace(/\s+/g,'');
    if(q.fractionAnswer.den===1)return /^[-+]?\d+$/.test(compact)&&Number(compact)===q.fractionAnswer.num;
    const m=compact.match(/^([-+]?\d+)\/([-+]?\d+)$/);if(!m)return false;
    return Number(m[1])===q.fractionAnswer.num&&Number(m[2])===q.fractionAnswer.den;
  }
  const n=Number(s.replace(',','.'));if(!Number.isFinite(n))return false;return Math.abs(n-q.answer)<1e-9;
}
function submitAutomatic(){
  if(!game||game.locked||game.question.oral)return;
  const raw=els.answerInput.value;if(!raw.trim())return;
  const ok=parseAutomaticAnswer(raw,game.question);gradeCurrent(ok,elapsed());
}
function gradeCurrent(ok,sec){
  if(!game||game.locked)return;game.locked=true;stopQuestionClock();clearWarnings();
  game.responseTimes.push(sec);game.speedPenalty+=speedPenaltyFor(sec);
  if(ok){game.correct++;els.sollyGame.src='assets/solly/vittoria.png';els.gabbyGame.src='assets/gabby/sorpresa.png';els.feedbackLine.textContent='Ottimo!';tone('good');say('Ottimo!')}
  else{game.wrong++;els.sollyGame.src='assets/solly/triste.png';els.gabbyGame.src='assets/gabby/triste.png';els.feedbackLine.textContent=`Non è corretto. Risposta: ${game.question.correctText}`;tone('bad');say(game.question.teacherFormula?'Non è corretto.':`Sbagliato. La risposta giusta è ${spokenCorrect(game.question.correctText)}`)}
  updateHUD();game.index++;
  setTimeout(()=>nextQuestion(),ok?650:1200);
}
function spokenCorrect(s){return String(s).replace('√','radice quadrata di ').replace('/',' fratto ')}
function oralAnswered(){
  if(!game||game.locked||!game.question.oral)return;
  game.oralFrozen=(performance.now()-game.qStart)/1000;stopQuestionClock();clearWarnings();
  els.oralAnsweredBtn.classList.add('hidden');els.teacherGrade.classList.remove('hidden');
  els.solutionReveal.textContent=`Soluzione: ${game.question.solution}`;els.solutionReveal.classList.remove('hidden');
  els.feedbackLine.textContent='L’insegnante valuta la risposta.';
  if(!game.question.teacherFormula)say(`La risposta giusta era ${spokenCorrect(game.question.correctText)}`);
}

function finishGame(){
  stopQuestionClock();clearWarnings();
  const total=game.responseTimes.reduce((a,b)=>a+b,0),avg=total/(game.responseTimes.length||1),score=game.correct,speed=speedScore();
  const data=athleteData(),key=recKey(game.kind,game.level);let rec=data.records[key]||{bestScore:0,bestTime:null,bestAvg:null,bestSpeed:0};
  rec.bestScore=Math.max(rec.bestScore||0,score);rec.bestSpeed=Math.max(rec.bestSpeed||0,speed);
  let newRecord=false;
  if(score===10&&(rec.bestTime==null||total<rec.bestTime)){rec.bestTime=total;rec.bestAvg=avg;rec.date=new Date().toISOString();newRecord=true}
  data.records[key]=rec;data.history.unshift({kind:game.kind,level:game.level,score,speed,total,at:new Date().toISOString()});data.history=data.history.slice(0,80);saveState();
  const passed=score===10&&speed===10;
  els.resultScore.textContent=score;els.resultTime.textContent=fmtTime(total);els.resultAvg.textContent=fmtTime(avg);els.resultSpeed.textContent=`${speed}/10`;els.resultRecord.textContent=rec.bestTime!=null?fmtTime(rec.bestTime):'—';
  els.resultMascot.src=score===10?'assets/solly/vittoria.png':score>=7?'assets/solly/sorpreso.png':'assets/solly/triste.png';
  if(passed){els.resultTitle.textContent=newRecord?'Nuovo record!':'Prova superata!';els.resultMessage.textContent='10/10 e velocità perfetta: puoi passare al livello successivo.';tone('win')}
  else if(score===10){els.resultTitle.textContent='Precisione perfetta!';els.resultMessage.textContent='10/10: adesso prova a essere ancora più veloce.'}
  else{els.resultTitle.textContent='Continua ad allenarti!';els.resultMessage.textContent=`Hai totalizzato ${score}/10. Un’altra prova e si riparte.`}
  const hasNext=game.level<DISCIPLINES[game.kind].levels.length-1;
  els.resultNextBtn.classList.toggle('hidden',!(passed&&hasNext));
  els.resultModal.classList.remove('hidden');renderHome();
}

function showBubble(msg,ms=1500){els.speechBubble.textContent=msg;els.speechBubble.classList.remove('hidden');setTimeout(()=>els.speechBubble.classList.add('hidden'),ms)}
function say(text){
  if(!appState.sound||!('speechSynthesis'in window)||!text)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='it-IT';u.rate=1.03;const voices=speechSynthesis.getVoices();const it=voices.find(v=>v.lang?.toLowerCase().startsWith('it'));if(it)u.voice=it;speechSynthesis.speak(u)}catch{}
}
function tone(type){
  if(!appState.sound)return;
  try{
    audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
    const now=audioCtx.currentTime;
    const notes=type==='good'?[[660,0,.08],[880,.09,.11]]:type==='win'?[[523,0,.11],[659,.12,.11],[784,.24,.18]]:[[190,0,.16],[145,.12,.18]];
    notes.forEach(([f,off,dur])=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type==='bad'?'sawtooth':'sine';o.frequency.value=f;g.gain.setValueAtTime(.001,now+off);g.gain.exponentialRampToValueAtTime(.16,now+off+.015);g.gain.exponentialRampToValueAtTime(.001,now+off+dur);o.connect(g).connect(audioCtx.destination);o.start(now+off);o.stop(now+off+dur+.03)})
  }catch{}
}

function toggleTheme(){appState.theme=appState.theme==='dark'?'light':'dark';saveState();applyTheme()}
function toggleSound(){appState.sound=!appState.sound;saveState();updateSound();if(!appState.sound)speechSynthesis?.cancel?.();else tone('good')}
async function toggleFullscreen(){try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch{}}

els.grid.addEventListener('click',e=>{const b=e.target.closest('.level-btn');if(b)startGame(b.dataset.kind,Number(b.dataset.level))});
els.answerForm.addEventListener('submit',e=>{e.preventDefault();submitAutomatic()});
els.oralAnsweredBtn.addEventListener('click',oralAnswered);
els.teacherCorrectBtn.addEventListener('click',()=>gradeCurrent(true,game?.oralFrozen??elapsed()));
els.teacherWrongBtn.addEventListener('click',()=>gradeCurrent(false,game?.oralFrozen??elapsed()));

[els.homeBtn,els.backBtn].forEach(b=>b.addEventListener('click',()=>showScreen('home')));
els.themeBtn.addEventListener('click',toggleTheme);els.soundBtn.addEventListener('click',toggleSound);els.fullscreenBtn.addEventListener('click',toggleFullscreen);
els.infoBtn.addEventListener('click',()=>els.infoModal.classList.remove('hidden'));els.closeInfoBtn.addEventListener('click',()=>els.infoModal.classList.add('hidden'));
els.infoModal.addEventListener('click',e=>{if(e.target===els.infoModal)els.infoModal.classList.add('hidden')});
els.athleteBtn.addEventListener('click',()=>{
  if(!appState.currentAthlete){openAthleteModal(false);return}
  els.confirmText.textContent=`Vuoi terminare la sessione di ${appState.currentAthlete} e iniziarne una nuova? I record salvati non verranno cancellati.`;els.confirmModal.classList.remove('hidden')
});
els.confirmNo.addEventListener('click',()=>els.confirmModal.classList.add('hidden'));
els.confirmYes.addEventListener('click',()=>{els.confirmModal.classList.add('hidden');showScreen('home');openAthleteModal(true)});
els.athleteForm.addEventListener('submit',e=>{e.preventDefault();setAthlete(els.athleteInput.value)});els.cancelAthleteBtn.addEventListener('click',closeAthleteModal);

els.resultHomeBtn.addEventListener('click',()=>{els.resultModal.classList.add('hidden');showScreen('home')});
els.resultRetryBtn.addEventListener('click',()=>{const {kind,level}=game;els.resultModal.classList.add('hidden');startGame(kind,level)});
els.resultNextBtn.addEventListener('click',()=>{const {kind,level}=game;els.resultModal.classList.add('hidden');startGame(kind,level+1)});

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;els.installBtn.classList.remove('hidden')});
els.installBtn.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;els.installBtn.classList.add('hidden')});
window.addEventListener('appinstalled',()=>els.installBtn.classList.add('hidden'));

if('serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

applyTheme();updateSound();renderAthlete();renderHome();
if(!appState.currentAthlete)setTimeout(()=>openAthleteModal(false),250);

})();
