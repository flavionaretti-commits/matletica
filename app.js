(()=>{
'use strict';

const $=s=>document.querySelector(s);
const STORAGE_KEY='matletica.state.v1';
const TOTAL_QUESTIONS=10;

const DISCIPLINES={
  sums:{title:'Somme',icon:'+',sub:'Addizioni a mente',color:'#1f9d75',levels:[
    {label:'Livello 1',range:[0,10],thresholds:[2,4,7],warningWaits:[2,3,2],speedPenalties:[0,1,3]},
    {label:'Livello 2',range:[0,50],thresholds:[2,4,7],warningWaits:[2,3,2],speedPenalties:[0,1,3]},
    {label:'Livello 3',range:[11,99],thresholds:[4,6,9],warningWaits:[2,3,2],speedPenalties:[0,1,3]}
  ]},
  tables:{title:'Tabelline',icon:'×',sub:'Prodotti rapidi',color:'#e08124',levels:[
    {label:'Livello 1',a:[2,5],b:[2,9],thresholds:[3,5,8],warningWaits:[2,3,2],speedPenalties:[1,2,3],simple:true},
    {label:'Livello 2',a:[0,10],b:[0,10],thresholds:[2,4,7],warningWaits:[2,3,2],speedPenalties:[0,1,3]}
  ]},
  multiplications:{title:'Moltiplicazioni',icon:'××',sub:'Prodotti più impegnativi',color:'#b86618',levels:[
    {label:'Livello 2',number:2,recordKey:'L2',a:[0,10],b:[10,99],thresholds:[5,9,14],warningWaits:[4,5,2],speedPenalties:[0,1,3]},
    {label:'Livello 3',number:3,recordKey:'L3',a:[11,99],b:[11,99],thresholds:[15,25,35],warningWaits:[10,10,2],speedPenalties:[0,1,3]}
  ]},
  squares:{title:'Quadrati',icon:'x²',sub:'Eleva al quadrato',color:'#7059c7',levels:[
    {label:'Livello 1',range:[0,20],thresholds:[20,25,33],warningWaits:[5,8,2],speedPenalties:[1,2,3]},
    {label:'Livello 2',range:[11,99],thresholds:[20,25,33],warningWaits:[5,8,2],speedPenalties:[1,2,3]}
  ]},
  gcd:{title:'MCD',icon:'M',sub:'Massimo Comune Divisore',color:'#2678c8',levels:[
    {label:'Livello 1',a:[1,10],b:[1,10],thresholds:[8,12,20],warningWaits:[4,8,2],speedPenalties:[0,1,3]},
    {label:'Livello 2',a:[2,20],b:[2,25],thresholds:[8,12,20],warningWaits:[4,8,2],speedPenalties:[0,1,3]}
  ]},
  lcm:{title:'mcm',icon:'m',sub:'Minimo comune multiplo',color:'#3f67b1',levels:[
    {label:'Livello 1',range:[1,10],thresholds:[8,12,20],warningWaits:[4,8,2],speedPenalties:[0,1,3]},
    {label:'Livello 2',range:[1,20],thresholds:[8,12,20],warningWaits:[4,8,2],speedPenalties:[0,1,3]}
  ]},
  divisibility:{title:'Divisibilità',icon:'÷',sub:'Criteri di divisibilità',color:'#c77819',levels:[
    {label:'Facile',number:1,digits:[2],fast:5,slow:15,maxDivisors:3},
    {label:'Medio',number:2,digits:[3],fast:8,slow:20,maxDivisors:4},
    {label:'Difficile',number:3,digits:[4,5],fast:12,slow:30,maxDivisors:4}
  ]},
  primeRecognition:{title:'Numeri primi',icon:'P',sub:'Riconosci i numeri primi',color:'#4f77c7',levels:[
    {label:'Facile',number:1,min:2,max:19,count:8,fast:5,slow:15,primePattern:[2,3,4,2,5,3,4,2,3,5]},
    {label:'Medio',number:2,min:2,max:29,count:12,fast:7,slow:20,primePattern:[3,5,4,6,3,7,4,5,6,3]},
    {label:'Difficile',number:3,min:2,max:37,count:16,fast:9,slow:25,primePattern:[4,6,5,8,3,7,5,9,6,4]}
  ]},
  percent:{title:'Percentuali',icon:'%',sub:'Percentuali a mente',color:'#cf4f83',levels:[
    {label:'Livello 1',thresholds:[5,9,14],warningWaits:[4,5,2],speedPenalties:[0,1,3],p:[10,20,25,50,100,0],n:[100,1000,400,10,200,2000,4000]},
    {label:'Livello 2',thresholds:[6,14,20],warningWaits:[8,6,2],speedPenalties:[0,1,3],p:[10,20,25,50,5,30,60],n:[100,1000,400,10,200,2000,4000,150,300,1500,3000,50,500,30,60]},
    {label:'Livello 3',thresholds:[8,18,25],warningWaits:[10,7,2],speedPenalties:[0,1,3],p:[10,20,25,50,5,30,60,15,30,40,75,90,95,2,1],n:[100,1000,400,10,200,2000,4000,150,300,1500,3000,50,500,30,60,90,900,35,80]}
  ]},
  segments:{title:'Segmenti',icon:'↔',sub:'Somma e differenza',color:'#d5633b',levels:[
    {label:'Livello 1',range:[1,10],thresholds:[8,10,15],warningWaits:[2,5,2],speedPenalties:[0,1,3]},
    {label:'Livello 2',range:[1,20],thresholds:[9,12,16],warningWaits:[3,4,2],speedPenalties:[0,1,3]}
  ]},
  pythagoras:{title:'Pitagora',icon:'△',sub:'Teorema di Pitagora',color:'#178aa6',oral:true,levels:[
    {label:'Livello 1',thresholds:[10,20,25],warningWaits:[10,5,2],speedPenalties:[0,1,3],hidden:'hyp'},
    {label:'Livello 2',thresholds:[10,20,25],warningWaits:[10,5,2],speedPenalties:[0,1,3],hidden:'cat'}
  ]},
  polygonFormulas:{title:'Formule · Poligoni',icon:'▱',sub:'Area e perimetro',color:'#0f8f73',oral:true,levels:[
    {label:'Livello 1',thresholds:[8,18,25],warningWaits:[10,7,2],speedPenalties:[0,1,3],shapes:['triangolo scaleno','triangolo isoscele','triangolo equilatero','triangolo rettangolo','quadrato','rombo','parallelogramma','trapezio scaleno','trapezio isoscele','trapezio rettangolo','rettangolo']},
    {label:'Livello 2',thresholds:[8,18,25],warningWaits:[10,7,2],speedPenalties:[0,1,3],shapes:['triangolo scaleno','triangolo isoscele','triangolo equilatero','triangolo rettangolo','quadrato','deltoide','rombo','parallelogramma','trapezio scaleno','trapezio isoscele','trapezio rettangolo','rettangolo','cerchio','esagono','pentagono']}
  ]},
  solidFormulas:{title:'Formule · Solidi',icon:'⬡',sub:'Aree e volume',color:'#3476b8',oral:true,levels:[
    {label:'Livello 1',thresholds:[8,18,25],warningWaits:[10,7,2],speedPenalties:[0,1,3],solids:['cubo','piramide','prisma retto','cilindro','cono','parallelepipedo']}
  ]},
  fractionSums:{title:'Frazioni · Somma',icon:'½+',sub:'Somma e riduci',color:'#9b4db2',levels:[
    {label:'Livello 1',num:[0,5],den:[1,5],thresholds:[8,12,20],warningWaits:[4,8,2],speedPenalties:[1,2,3]},
    {label:'Livello 2',num:[0,9],den:[1,10],thresholds:[12,16,24],warningWaits:[4,8,2],speedPenalties:[1,2,3]}
  ]},
  fractionProducts:{title:'Frazioni · Moltiplica',icon:'½×',sub:'Moltiplica e riduci',color:'#7a53c7',levels:[
    {label:'Livello 1',num:[1,5],den:[1,5],thresholds:[6,12,20],warningWaits:[6,8,2],speedPenalties:[0,1,3]},
    {label:'Livello 2',num:[1,10],den:[1,10],thresholds:[8,12,20],warningWaits:[4,8,2],speedPenalties:[1,2,3]}
  ]}
};

const els={
  homeScreen:$('#homeScreen'),gameScreen:$('#gameScreen'),grid:$('#disciplineGrid'),
  homeBtn:$('#homeBtn'),backBtn:$('#backBtn'),athleteBtn:$('#athleteBtn'),athleteTopName:$('#athleteTopName'),welcomeName:$('#welcomeName'),
  themeBtn:$('#themeBtn'),soundBtn:$('#soundBtn'),fullscreenBtn:$('#fullscreenBtn'),infoBtn:$('#infoBtn'),installBtn:$('#installBtn'),
  gameTitle:$('#gameTitle'),gameLevel:$('#gameLevel'),recordMini:$('#recordMini'),
  hudProgress:$('#hudProgress'),hudCorrect:$('#hudCorrect'),hudWrong:$('#hudWrong'),hudTime:$('#hudTime'),hudSpeed:$('#hudSpeed'),
  hudCorrectLabel:$('#hudCorrectLabel'),hudWrongLabel:$('#hudWrongLabel'),hudSpeedLabel:$('#hudSpeedLabel'),
  sollyGame:$('#sollyGame'),gabbyGame:$('#gabbyGame'),speechBubble:$('#speechBubble'),
  questionHint:$('#questionHint'),questionText:$('#questionText'),visualArea:$('#visualArea'),solutionReveal:$('#solutionReveal'),
  answerForm:$('#answerForm'),answerInput:$('#answerInput'),oralControls:$('#oralControls'),oralAnsweredBtn:$('#oralAnsweredBtn'),teacherGrade:$('#teacherGrade'),teacherWrongBtn:$('#teacherWrongBtn'),teacherCorrectBtn:$('#teacherCorrectBtn'),feedbackLine:$('#feedbackLine'),
  athleteModal:$('#athleteModal'),athleteForm:$('#athleteForm'),athleteInput:$('#athleteInput'),cancelAthleteBtn:$('#cancelAthleteBtn'),
  confirmModal:$('#confirmModal'),confirmText:$('#confirmText'),confirmNo:$('#confirmNo'),confirmYes:$('#confirmYes'),
  resultModal:$('#resultModal'),resultMascot:$('#resultMascot'),resultTitle:$('#resultTitle'),resultScore:$('#resultScore'),resultScoreMax:$('#resultScoreMax'),resultScoreRing:$('#resultScoreRing'),resultTime:$('#resultTime'),resultAvg:$('#resultAvg'),resultSpeed:$('#resultSpeed'),resultRecord:$('#resultRecord'),resultMessage:$('#resultMessage'),resultHomeBtn:$('#resultHomeBtn'),resultRetryBtn:$('#resultRetryBtn'),resultNextBtn:$('#resultNextBtn'),
  resultTimeLabel:$('#resultTimeLabel'),resultAvgLabel:$('#resultAvgLabel'),resultSpeedLabel:$('#resultSpeedLabel'),resultRecordLabel:$('#resultRecordLabel'),
  criteriaModal:$('#criteriaModal'),closeCriteriaBtn:$('#closeCriteriaBtn'),
  primeModal:$('#primeModal'),closePrimeBtn:$('#closePrimeBtn'),
  infoModal:$('#infoModal'),closeInfoBtn:$('#closeInfoBtn'),
  reorderModal:$('#reorderModal'),reorderTitle:$('#reorderTitle'),reorderText:$('#reorderText'),reorderOptions:$('#reorderOptions'),reorderEndBtn:$('#reorderEndBtn'),closeReorderBtn:$('#closeReorderBtn')
};

let appState=loadState();
let game=null;
let installPrompt=null;
let timerRAF=0;
let questionStartRAF1=0;
let questionStartRAF2=0;
let questionStartToken=0;
let warningTimers=[];
let warningRunId=0;
let audioCtx=null;
let reorderSourceKind=null;
let longPressTimer=0;
let longPressStart=null;
let suppressLevelClickUntil=0;

function defaultState(){return {theme:'light',sound:true,currentAthlete:'',athletes:{},disciplineOrder:Object.keys(DISCIPLINES)}}
function loadState(){
  try{return {...defaultState(),...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return defaultState()}
}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(appState))}
function getDisciplineOrder(){
  const valid=Object.keys(DISCIPLINES),seen=new Set(),saved=Array.isArray(appState.disciplineOrder)?appState.disciplineOrder:[];
  const order=[];
  saved.forEach(k=>{if(DISCIPLINES[k]&&!seen.has(k)){seen.add(k);order.push(k)}});
  valid.forEach(k=>{if(!seen.has(k)){seen.add(k);order.push(k)}});
  if(JSON.stringify(order)!==JSON.stringify(saved)){appState.disciplineOrder=order;saveState()}
  return order;
}
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
const DIVISIBILITY_PRIMES=[2,3,5,7,11,13,17];
function divisibilityFactors(n){return DIVISIBILITY_PRIMES.filter(p=>n%p===0)}
function randomByDigits(digits){
  const d=pick(digits),min=d===1?0:10**(d-1),max=10**d-1;
  return randInt(min,max);
}
function buildDivisibilityNumber(lv,index){
  const easy=[0,1,2,1,3,0,2,1,2,3];
  const rich=[0,1,2,3,1,4,0,2,3,1];
  const pattern=lv.maxDivisors>=4?rich:easy;
  const wanted=Math.min(pattern[index%pattern.length],lv.maxDivisors||3);
  for(let tries=0;tries<1800;tries++){
    const n=randomByDigits(lv.digits),count=divisibilityFactors(n).length;
    if(count===wanted)return n;
  }
  return randomByDigits(lv.digits);
}
function divisibilitySpeedBonus(sec,lv){
  if(sec<=lv.fast)return 30;
  if(sec>=lv.slow)return 0;
  return Math.max(0,Math.min(30,Math.round(30*(lv.slow-sec)/(lv.slow-lv.fast))));
}
function isPrime(n){
  if(n<2)return false;
  for(let d=2;d*d<=n;d++)if(n%d===0)return false;
  return true;
}
function shuffled(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=randInt(0,i);[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function buildPrimeGrid(lv,index){
  const all=[];for(let n=lv.min;n<=lv.max;n++)all.push(n);
  const primes=all.filter(isPrime),composites=all.filter(n=>!isPrime(n));
  const wanted=Math.min(lv.primePattern[index%lv.primePattern.length],primes.length,lv.count);
  const selected=[...shuffled(primes).slice(0,wanted),...shuffled(composites).slice(0,lv.count-wanted)];
  return shuffled(selected);
}
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
  getDisciplineOrder().forEach(kind=>{
    const d=DISCIPLINES[kind];
    const card=document.createElement('article');
    card.className='discipline-card';card.dataset.kind=kind;card.style.setProperty('--card-color',d.color);
    const levels=d.levels.map((lv,i)=>{
      const r=getRecord(kind,i);
      const pointMode=kind==='divisibility'||kind==='primeRecognition';
      const title=pointMode?(r?.bestPoints!=null?`Record: ${r.bestPoints}/1000${r.bestTime!=null?` – ${fmtTime(r.bestTime)}`:''}`:'Nessun risultato ancora'):(r?`Migliore: ${r.bestScore||0}/10${r.bestTime!=null?` – ${fmtTime(r.bestTime)}`:''}`:'Nessun risultato ancora');
      return `<button class="level-btn ${r?'has-record':''}" data-kind="${kind}" data-level="${i}" title="${title}">L${lv.number??i+1}</button>`
    }).join('');
    const extra=kind==='divisibility'?'<button type="button" class="criteria-btn">CRITERI</button>':kind==='primeRecognition'?'<button type="button" class="prime-list-btn">PRIMI</button>':'';
    card.innerHTML=`<div class="disc-head"><div class="disc-icon">${d.icon}</div><div><div class="disc-title">${d.title}</div><div class="disc-sub">${d.sub}</div></div></div><div class="level-row">${levels}</div>${extra}`;
    els.grid.appendChild(card);
  });
}


function openReorderModal(kind){
  if(!DISCIPLINES[kind])return;
  reorderSourceKind=kind;
  suppressLevelClickUntil=Date.now()+900;
  const d=DISCIPLINES[kind];
  els.reorderTitle.textContent=`Sposta “${d.title}”`;
  els.reorderText.textContent='Scegli davanti a quale sezione inserirla.';
  els.reorderOptions.innerHTML='';
  getDisciplineOrder().filter(k=>k!==kind).forEach(target=>{
    const td=DISCIPLINES[target],btn=document.createElement('button');
    btn.type='button';btn.className='reorder-option';btn.dataset.target=target;
    btn.style.setProperty('--target-color',td.color);
    btn.innerHTML=`<span class="reorder-option-icon">${td.icon}</span><span><small>DAVANTI A</small><strong>${esc(td.title)}</strong></span>`;
    els.reorderOptions.appendChild(btn);
  });
  els.reorderModal.classList.remove('hidden');
  try{navigator.vibrate?.(35)}catch{}
}
function closeReorderModal(){
  els.reorderModal.classList.add('hidden');
  reorderSourceKind=null;
}
function openCriteriaModal(){els.criteriaModal.classList.remove('hidden')}
function closeCriteriaModal(){els.criteriaModal.classList.add('hidden')}
function openPrimeModal(){els.primeModal.classList.remove('hidden')}
function closePrimeModal(){els.primeModal.classList.add('hidden')}
function moveDisciplineBefore(targetKind=null){
  const source=reorderSourceKind;if(!source)return;
  const order=getDisciplineOrder().filter(k=>k!==source);
  if(targetKind&&order.includes(targetKind))order.splice(order.indexOf(targetKind),0,source);else order.push(source);
  appState.disciplineOrder=order;saveState();closeReorderModal();renderHome();
}
function cancelLongPress(){
  if(longPressTimer){clearTimeout(longPressTimer);longPressTimer=0}
  if(longPressStart?.card)longPressStart.card.classList.remove('long-pressing');
  longPressStart=null;
}
function beginLongPress(e){
  if(e.target.closest('.criteria-btn,.prime-list-btn'))return;
  const card=e.target.closest('.discipline-card');if(!card||e.button>0)return;
  cancelLongPress();
  longPressStart={card,x:e.clientX,y:e.clientY,pointerId:e.pointerId};
  card.classList.add('long-pressing');
  longPressTimer=setTimeout(()=>{
    const kind=card.dataset.kind;cancelLongPress();openReorderModal(kind);
  },600);
}
function trackLongPress(e){
  if(!longPressStart||e.pointerId!==longPressStart.pointerId)return;
  if(Math.hypot(e.clientX-longPressStart.x,e.clientY-longPressStart.y)>12)cancelLongPress();
}

function showScreen(which){
  els.homeScreen.classList.toggle('active',which==='home');
  els.gameScreen.classList.toggle('active',which==='game');
  if(which==='home'){cancelPendingQuestionStart();stopQuestionClock();clearWarnings();speechSynthesis?.cancel?.();renderHome()}
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
  if(kind==='divisibility'){
    const n=buildDivisibilityNumber(lv,game?.index??0),divisors=divisibilityFactors(n);
    return {html:`<span class="divisibility-number">${n.toLocaleString('it-IT')}</span>`,speak:`Seleziona tutti i divisori di ${n}`,hint:'Seleziona tutti i divisori corretti e poi premi CONFERMA',divisibility:true,number:n,divisors,correctText:divisors.length?divisors.join(', '):'nessuno'};
  }
  if(kind==='primeRecognition'){
    const numbers=buildPrimeGrid(lv,game?.index??0),primes=numbers.filter(isPrime);
    return {html:'<span class="prime-question-title">TOCCA I NUMERI PRIMI</span>',speak:'Seleziona tutti i numeri primi',hint:'Seleziona tutti e soli i numeri primi, poi premi CONFERMA',primeRecognition:true,numbers,primes,correctText:primes.join(', ')};
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
  cancelPendingQuestionStart();stopQuestionClock();clearWarnings();
  const d=DISCIPLINES[kind],lv=d.levels[level];
  game={kind,level,index:0,correct:0,wrong:0,responseTimes:[],speedPenalty:0,question:null,qStart:0,locked:false,oralFrozen:null,currentWarningLevel:-1,questionReady:false,divPoints:0,divFalsePos:0,divMissed:0,selectedDivisors:new Set(),primePoints:0,primeFalsePos:0,primeMissed:0,selectedPrimeNumbers:new Set()};
  els.gameTitle.textContent=d.title;els.gameLevel.textContent=lv.label;
  const rec=getRecord(kind,level);
  const pointMode=kind==='divisibility'||kind==='primeRecognition';
  els.recordMini.textContent=pointMode?`Record: ${rec?.bestPoints!=null?rec.bestPoints+'/1000':'—'}`:`Record: ${rec?.bestTime!=null?fmtTime(rec.bestTime):'—'}`;
  els.hudCorrectLabel.textContent=pointMode?'PERFETTE':'CORRETTE';
  els.hudWrongLabel.textContent='ERRORI';
  els.hudSpeedLabel.textContent=pointMode?'PUNTI':'VELOCITÀ';
  showScreen('game');
  resetMascots();
  els.questionHint.textContent='';
  els.questionText.innerHTML='';
  els.visualArea.classList.add('hidden');els.visualArea.innerHTML='';
  els.solutionReveal.classList.add('hidden');els.solutionReveal.textContent='';
  els.answerForm.classList.add('hidden');els.oralControls.classList.add('hidden');
  els.hudTime.textContent='0.0 s';
  els.feedbackLine.textContent=`${appState.currentAthlete}, concentrati e… via!`;
  const thisGame=game;
  sayAsync(introFor(kind,level)).then(()=>{
    if(game===thisGame&&els.gameScreen.classList.contains('active'))nextQuestion();
  });
}
function introFor(kind,level){
  const n=appState.currentAthlete;
  const map={sums:'alleniamo le somme',tables:'ripassiamo le tabelline',multiplications:'affrontiamo le moltiplicazioni',squares:'eleviamo al quadrato',gcd:'calcoliamo il Massimo Comune Divisore',lcm:'calcoliamo il minimo comune multiplo',divisibility:'alleniamo i criteri di divisibilità',primeRecognition:'riconosciamo i numeri primi',percent:'alleniamo le percentuali',segments:'affrontiamo i problemi sui segmenti',pythagoras:'alleniamo il Teorema di Pitagora',polygonFormulas:'ripassiamo le formule dei poligoni',solidFormulas:'ripassiamo le formule dei solidi',fractionSums:'sommiamo le frazioni',fractionProducts:'moltiplichiamo le frazioni'};
  const lv=DISCIPLINES[kind].levels[level];
  return `${n}, ${map[kind]}. Livello ${lv.number??level+1}. Iniziamo!`;
}
function resetMascots(){
  els.sollyGame.src='assets/solly/normal.png';els.gabbyGame.src='assets/gabby/normal.png';
  els.speechBubble.classList.add('hidden');
}
function nextQuestion(){
  if(!game||game.index>=TOTAL_QUESTIONS){finishGame();return}
  cancelPendingQuestionStart();
  game.locked=false;game.oralFrozen=null;game.currentWarningLevel=-1;game.questionReady=false;resetMascots();clearWarnings();
  game.question=buildQuestion(game.kind,game.level);
  els.questionHint.textContent=game.question.hint||'';
  els.questionText.innerHTML=game.question.html;
  els.solutionReveal.classList.add('hidden');els.solutionReveal.textContent='';
  if(game.question.divisibility){
    game.selectedDivisors=new Set();
    els.visualArea.innerHTML=`<div class="divisibility-panel"><div class="divisor-help">Seleziona tutti quelli che dividono esattamente il numero</div><div class="divisor-chips">${DIVISIBILITY_PRIMES.map(p=>`<button type="button" class="divisor-chip" data-divisor="${p}" aria-pressed="false">${p}</button>`).join('')}</div><div class="none-hint">Se non ce ne sono, non selezionare nulla.</div><button type="button" class="primary-btn divisibility-confirm">CONFERMA</button></div>`;
    els.visualArea.classList.remove('hidden');
    els.answerForm.classList.add('hidden');els.oralControls.classList.add('hidden');
  }else if(game.question.primeRecognition){
    game.selectedPrimeNumbers=new Set();
    els.visualArea.innerHTML=`<div class="prime-game-panel"><div class="prime-number-grid prime-count-${game.question.numbers.length}">${game.question.numbers.map(n=>`<button type="button" class="prime-number-chip" data-number="${n}" aria-pressed="false">${n}</button>`).join('')}</div><button type="button" class="primary-btn prime-confirm">CONFERMA</button></div>`;
    els.visualArea.classList.remove('hidden');
    els.answerForm.classList.add('hidden');els.oralControls.classList.add('hidden');
  }else if(game.question.oral){
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
  els.hudTime.textContent='0.0 s';
  startQuestionAfterRender();
}

function cancelPendingQuestionStart(){
  questionStartToken++;
  if(questionStartRAF1)cancelAnimationFrame(questionStartRAF1);
  if(questionStartRAF2)cancelAnimationFrame(questionStartRAF2);
  questionStartRAF1=0;questionStartRAF2=0;
}
function startQuestionAfterRender(){
  const token=++questionStartToken;
  // Due frame: il primo applica il DOM, il secondo garantisce che la domanda sia già visibile.
  questionStartRAF1=requestAnimationFrame(()=>{
    questionStartRAF1=0;
    questionStartRAF2=requestAnimationFrame(()=>{
      questionStartRAF2=0;
      if(token!==questionStartToken||!game||game.locked||!els.gameScreen.classList.contains('active'))return;
      game.questionReady=true;
      startQuestionClock();
      scheduleWarnings();
      say(game.question.speak);
    });
  });
}
function startQuestionClock(){
  stopQuestionClock();game.qStart=performance.now();
  const tick=()=>{if(!game||game.locked||!game.questionReady)return;const s=(performance.now()-game.qStart)/1000;els.hudTime.textContent=`${s.toFixed(1)} s`;timerRAF=requestAnimationFrame(tick)};tick();
}
function stopQuestionClock(){if(timerRAF)cancelAnimationFrame(timerRAF);timerRAF=0}
function elapsed(){return game?.oralFrozen??((performance.now()-game.qStart)/1000)}
function clearWarnings(){
  warningRunId++;
  warningTimers.forEach(clearTimeout);warningTimers=[];
  if('speechSynthesis'in window){try{speechSynthesis.cancel()}catch{}}
}
function warningDelay(ms,token){
  return new Promise(resolve=>{
    const id=setTimeout(()=>resolve(token===warningRunId),Math.max(0,ms));
    warningTimers.push(id);
  });
}
function sayWarning(text,token){
  if(!appState.sound||!('speechSynthesis'in window)||!text)return Promise.resolve(token===warningRunId);
  return new Promise(resolve=>{
    try{
      const u=new SpeechSynthesisUtterance(text);u.lang='it-IT';u.rate=1.03;
      const voices=speechSynthesis.getVoices();const it=voices.find(v=>v.lang?.toLowerCase().startsWith('it'));if(it)u.voice=it;
      u.onend=u.onerror=()=>resolve(token===warningRunId);
      speechSynthesis.speak(u);
    }catch{resolve(token===warningRunId)}
  });
}
async function scheduleWarnings(){
  const token=warningRunId;
  const lv=DISCIPLINES[game.kind].levels[game.level];
  const th=lv.thresholds||[],waits=lv.warningWaits||[0,0,0];
  const messages=['Sbrigati!','Sei proprio una lumaca!','Zzz…'];
  for(let i=0;i<th.length;i++){
    // Scratch confronta un contatore intero con “> soglia”: >3 scatta quando arriva a 4.
    const target=th[i]+1;
    const remaining=Math.max(0,target-elapsed());
    if(!(await warningDelay(remaining*1000,token))||!game||game.locked)return;
    game.currentWarningLevel=i;
    els.speechBubble.textContent=messages[i];els.speechBubble.classList.remove('hidden');
    els.gabbyGame.src=i===0?'assets/gabby/sorpresa.png':i===1?'assets/gabby/arrabbiata.png':'assets/gabby/congelata.png';
    // Nei progetti Scratch i primi due avvisi usano “pronuncia e attendi”; il terzo è il suono ZZZ.
    if(i<2){if(!(await sayWarning(messages[i],token))||!game||game.locked)return}
    else tone('bad');
    if(!(await warningDelay((waits[i]||0)*1000,token))||!game||game.locked)return;
  }
}
function speedPenaltyForWarning(){
  const lv=DISCIPLINES[game.kind].levels[game.level],pen=lv.speedPenalties||[0,1,3];
  const i=game.currentWarningLevel??-1;
  return i<0?0:(pen[i]??0);
}
function speedScore(){return Math.max(0,10-game.speedPenalty)}
function updateHUD(){
  if(!game)return;
  els.hudProgress.textContent=`${Math.min(game.index+1,10)}/10`;els.hudCorrect.textContent=game.correct;els.hudWrong.textContent=game.wrong;
  els.hudSpeed.textContent=game.kind==='divisibility'?`${game.divPoints}/1000`:game.kind==='primeRecognition'?`${game.primePoints}/1000`:`${speedScore()}/10`;
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
  if(!game||game.locked||!game.questionReady||game.question.oral||game.question.divisibility||game.question.primeRecognition)return;
  const raw=els.answerInput.value;if(!raw.trim())return;
  const ok=parseAutomaticAnswer(raw,game.question);gradeCurrent(ok,elapsed());
}
function toggleDivisorButton(btn){
  if(!game||game.locked||!game.questionReady||!game.question?.divisibility)return;
  const p=Number(btn.dataset.divisor);
  if(game.selectedDivisors.has(p)){game.selectedDivisors.delete(p);btn.classList.remove('selected');btn.setAttribute('aria-pressed','false')}
  else{game.selectedDivisors.add(p);btn.classList.add('selected');btn.setAttribute('aria-pressed','true')}
}
function submitDivisibility(){
  if(!game||game.locked||!game.questionReady||!game.question?.divisibility)return;
  const sec=elapsed(),lv=DISCIPLINES.divisibility.levels[game.level],correct=game.question.divisors,selected=[...game.selectedDivisors];
  const falsePos=selected.filter(p=>!correct.includes(p)),missed=correct.filter(p=>!selected.includes(p)),mistakes=falsePos.length+missed.length;
  const accuracy=Math.max(0,70-30*mistakes),bonus=divisibilitySpeedBonus(sec,lv),points=accuracy+bonus;
  game.locked=true;cancelPendingQuestionStart();stopQuestionClock();clearWarnings();game.responseTimes.push(sec);
  game.divPoints+=points;game.divFalsePos+=falsePos.length;game.divMissed+=missed.length;
  if(mistakes===0)game.correct++;else game.wrong+=mistakes;
  els.visualArea.querySelectorAll('.divisor-chip').forEach(btn=>{
    const p=Number(btn.dataset.divisor),was=selected.includes(p),is=correct.includes(p);
    btn.disabled=true;btn.classList.remove('selected');
    if(was&&is)btn.classList.add('correct-selected');
    else if(was&&!is)btn.classList.add('wrong-selected');
    else if(!was&&is)btn.classList.add('missed');
    else btn.classList.add('neutral');
  });
  const confirm=els.visualArea.querySelector('.divisibility-confirm');if(confirm)confirm.disabled=true;
  const right=correct.length?correct.join(', '):'nessuno';
  const details=[];
  if(missed.length)details.push(`dimenticati: ${missed.join(', ')}`);
  if(falsePos.length)details.push(`segnati per errore: ${falsePos.join(', ')}`);
  els.solutionReveal.textContent=`Divisori corretti: ${right}. +${points} punti (precisione ${accuracy} + velocità ${bonus}).`;
  els.solutionReveal.classList.remove('hidden');
  if(mistakes===0){els.sollyGame.src='assets/solly/vittoria.png';els.gabbyGame.src='assets/gabby/sorpresa.png';els.feedbackLine.textContent=`Perfetto! +${points} punti`;tone('good');say('Perfetto!')}
  else{els.sollyGame.src='assets/solly/triste.png';els.gabbyGame.src='assets/gabby/triste.png';els.feedbackLine.textContent=`${details.join(' · ')} · +${points} punti`;tone('bad');say('Controlla i divisori.')}
  updateHUD();game.index++;
  setTimeout(()=>nextQuestion(),mistakes===0?1500:2400);
}

function togglePrimeNumber(btn){
  if(!game||game.locked||!game.questionReady||!game.question?.primeRecognition)return;
  const n=Number(btn.dataset.number);
  if(game.selectedPrimeNumbers.has(n)){game.selectedPrimeNumbers.delete(n);btn.classList.remove('selected');btn.setAttribute('aria-pressed','false')}
  else{game.selectedPrimeNumbers.add(n);btn.classList.add('selected');btn.setAttribute('aria-pressed','true')}
}
function submitPrimeRecognition(){
  if(!game||game.locked||!game.questionReady||!game.question?.primeRecognition)return;
  const sec=elapsed(),lv=DISCIPLINES.primeRecognition.levels[game.level],correct=game.question.primes,selected=[...game.selectedPrimeNumbers];
  const falsePos=selected.filter(n=>!correct.includes(n)),missed=correct.filter(n=>!selected.includes(n)),mistakes=falsePos.length+missed.length;
  const accuracy=Math.max(0,70-30*mistakes),bonus=divisibilitySpeedBonus(sec,lv),points=accuracy+bonus;
  game.locked=true;cancelPendingQuestionStart();stopQuestionClock();clearWarnings();game.responseTimes.push(sec);
  game.primePoints+=points;game.primeFalsePos+=falsePos.length;game.primeMissed+=missed.length;
  if(mistakes===0)game.correct++;else game.wrong+=mistakes;
  els.visualArea.querySelectorAll('.prime-number-chip').forEach(btn=>{
    const n=Number(btn.dataset.number),was=selected.includes(n),prime=correct.includes(n);
    btn.disabled=true;btn.classList.remove('selected');
    if(was&&prime)btn.classList.add('correct-selected');
    else if(was&&!prime)btn.classList.add('wrong-selected');
    else if(!was&&prime)btn.classList.add('missed');
    else btn.classList.add('neutral');
  });
  const confirm=els.visualArea.querySelector('.prime-confirm');if(confirm)confirm.disabled=true;
  const details=[];
  if(missed.length)details.push(`primi dimenticati: ${missed.join(', ')}`);
  if(falsePos.length)details.push(`composti selezionati: ${falsePos.join(', ')}`);
  els.solutionReveal.textContent=`Numeri primi: ${correct.join(', ')}. +${points} punti (precisione ${accuracy} + velocità ${bonus}).`;
  els.solutionReveal.classList.remove('hidden');
  if(mistakes===0){els.sollyGame.src='assets/solly/vittoria.png';els.gabbyGame.src='assets/gabby/sorpresa.png';els.feedbackLine.textContent=`Perfetto! +${points} punti`;tone('good');say('Perfetto!')}
  else{els.sollyGame.src='assets/solly/triste.png';els.gabbyGame.src='assets/gabby/triste.png';els.feedbackLine.textContent=`${details.join(' · ')} · +${points} punti`;tone('bad');say('Controlla i numeri primi.')}
  updateHUD();game.index++;
  setTimeout(()=>nextQuestion(),mistakes===0?1500:2400);
}

function gradeCurrent(ok,sec){
  if(!game||game.locked||!game.questionReady)return;game.locked=true;cancelPendingQuestionStart();stopQuestionClock();clearWarnings();
  game.responseTimes.push(sec);game.speedPenalty+=speedPenaltyForWarning();
  if(ok){game.correct++;els.sollyGame.src='assets/solly/vittoria.png';els.gabbyGame.src='assets/gabby/sorpresa.png';els.feedbackLine.textContent='Ottimo!';tone('good');say('Ottimo!')}
  else{game.wrong++;els.sollyGame.src='assets/solly/triste.png';els.gabbyGame.src='assets/gabby/triste.png';els.feedbackLine.textContent=`Non è corretto. Risposta: ${game.question.correctText}`;tone('bad');say(game.question.teacherFormula?'Non è corretto.':`Sbagliato. La risposta giusta è ${spokenCorrect(game.question.correctText)}`)}
  updateHUD();game.index++;
  setTimeout(()=>nextQuestion(),ok?650:1200);
}
function spokenCorrect(s){return String(s).replace('√','radice quadrata di ').replace('/',' fratto ')}
function oralAnswered(){
  if(!game||game.locked||!game.questionReady||!game.question.oral)return;
  game.oralFrozen=(performance.now()-game.qStart)/1000;stopQuestionClock();clearWarnings();
  els.oralAnsweredBtn.classList.add('hidden');els.teacherGrade.classList.remove('hidden');
  els.solutionReveal.textContent=`Soluzione: ${game.question.solution}`;els.solutionReveal.classList.remove('hidden');
  els.feedbackLine.textContent='L’insegnante valuta la risposta.';
  if(!game.question.teacherFormula)say(`La risposta giusta era ${spokenCorrect(game.question.correctText)}`);
}

function configureResultMode(pointsMode){
  els.resultScoreMax.textContent=pointsMode?'/1000':'/10';
  els.resultScoreRing.classList.toggle('points-mode',pointsMode);
  els.resultTimeLabel.textContent='Tempo totale';
  els.resultAvgLabel.textContent=pointsMode?'Media / numero':'Media / risposta';
  els.resultSpeedLabel.textContent=pointsMode?'Errori totali':'Velocità';
  els.resultRecordLabel.textContent='Record personale';
}
function finishDivisibility(){
  cancelPendingQuestionStart();stopQuestionClock();clearWarnings();configureResultMode(true);
  const total=game.responseTimes.reduce((a,b)=>a+b,0),avg=total/(game.responseTimes.length||1),points=game.divPoints,errors=game.divFalsePos+game.divMissed;
  const data=athleteData(),key=recKey(game.kind,game.level);let rec=data.records[key]||{bestPoints:0,bestTime:null};
  let newRecord=false;
  if(points>(rec.bestPoints||0)||(points===(rec.bestPoints||0)&&(rec.bestTime==null||total<rec.bestTime))){
    rec.bestPoints=points;rec.bestTime=total;rec.bestAvg=avg;rec.date=new Date().toISOString();newRecord=true;
  }
  data.records[key]=rec;
  data.history.unshift({kind:game.kind,level:game.level,points,perfect:game.correct,falsePos:game.divFalsePos,missed:game.divMissed,total,at:new Date().toISOString()});data.history=data.history.slice(0,80);saveState();
  const passed=points>=850;
  els.resultScore.textContent=points;els.resultTime.textContent=fmtTime(total);els.resultAvg.textContent=fmtTime(avg);els.resultSpeed.textContent=errors;els.resultRecord.textContent=`${rec.bestPoints||0}/1000`;
  els.resultMascot.src=points>=900?'assets/solly/vittoria.png':points>=700?'assets/solly/sorpreso.png':'assets/solly/triste.png';
  els.resultTitle.textContent=newRecord?'Nuovo record!':passed?'Prova superata!':'Continua ad allenarti!';
  els.resultMessage.textContent=`Risposte perfette: ${game.correct}/10 · divisori dimenticati: ${game.divMissed} · divisori segnati per errore: ${game.divFalsePos}.`;
  if(passed)tone('win');
  const hasNext=game.level<DISCIPLINES[game.kind].levels.length-1;
  els.resultNextBtn.classList.toggle('hidden',!(passed&&hasNext));
  els.resultModal.classList.remove('hidden');renderHome();
}
function finishPrimeRecognition(){
  cancelPendingQuestionStart();stopQuestionClock();clearWarnings();configureResultMode(true);
  els.resultAvgLabel.textContent='Media / griglia';
  const total=game.responseTimes.reduce((a,b)=>a+b,0),avg=total/(game.responseTimes.length||1),points=game.primePoints,errors=game.primeFalsePos+game.primeMissed;
  const data=athleteData(),key=recKey(game.kind,game.level);let rec=data.records[key]||{bestPoints:0,bestTime:null};
  let newRecord=false;
  if(points>(rec.bestPoints||0)||(points===(rec.bestPoints||0)&&(rec.bestTime==null||total<rec.bestTime))){
    rec.bestPoints=points;rec.bestTime=total;rec.bestAvg=avg;rec.date=new Date().toISOString();newRecord=true;
  }
  data.records[key]=rec;
  data.history.unshift({kind:game.kind,level:game.level,points,perfect:game.correct,falsePos:game.primeFalsePos,missed:game.primeMissed,total,at:new Date().toISOString()});data.history=data.history.slice(0,80);saveState();
  const passed=points>=850;
  els.resultScore.textContent=points;els.resultTime.textContent=fmtTime(total);els.resultAvg.textContent=fmtTime(avg);els.resultSpeed.textContent=errors;els.resultRecord.textContent=`${rec.bestPoints||0}/1000`;
  els.resultMascot.src=points>=900?'assets/solly/vittoria.png':points>=700?'assets/solly/sorpreso.png':'assets/solly/triste.png';
  els.resultTitle.textContent=newRecord?'Nuovo record!':passed?'Prova superata!':'Continua ad allenarti!';
  els.resultMessage.textContent=`Griglie perfette: ${game.correct}/10 · numeri primi dimenticati: ${game.primeMissed} · numeri composti selezionati: ${game.primeFalsePos}.`;
  if(passed)tone('win');
  const hasNext=game.level<DISCIPLINES[game.kind].levels.length-1;
  els.resultNextBtn.classList.toggle('hidden',!(passed&&hasNext));
  els.resultModal.classList.remove('hidden');renderHome();
}
function finishGame(){
  if(game?.kind==='divisibility'){finishDivisibility();return}
  if(game?.kind==='primeRecognition'){finishPrimeRecognition();return}
  cancelPendingQuestionStart();stopQuestionClock();clearWarnings();configureResultMode(false);
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
function sayAsync(text){
  if(!appState.sound||!('speechSynthesis'in window)||!text)return Promise.resolve();
  return new Promise(resolve=>{
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);u.lang='it-IT';u.rate=1.03;
      const voices=speechSynthesis.getVoices();const it=voices.find(v=>v.lang?.toLowerCase().startsWith('it'));if(it)u.voice=it;
      u.onend=u.onerror=()=>resolve();speechSynthesis.speak(u);
    }catch{resolve()}
  });
}
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

els.grid.addEventListener('click',e=>{if(Date.now()<suppressLevelClickUntil)return;const c=e.target.closest('.criteria-btn');if(c){openCriteriaModal();return}const p=e.target.closest('.prime-list-btn');if(p){openPrimeModal();return}const b=e.target.closest('.level-btn');if(b)startGame(b.dataset.kind,Number(b.dataset.level))});
els.grid.addEventListener('pointerdown',beginLongPress);
els.grid.addEventListener('pointermove',trackLongPress);
els.grid.addEventListener('pointerup',cancelLongPress);
els.grid.addEventListener('pointercancel',cancelLongPress);
els.grid.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')cancelLongPress()});
els.grid.addEventListener('contextmenu',e=>{if(e.target.closest('.discipline-card'))e.preventDefault()});
els.reorderOptions.addEventListener('click',e=>{const b=e.target.closest('.reorder-option');if(b)moveDisciplineBefore(b.dataset.target)});
els.reorderEndBtn.addEventListener('click',()=>moveDisciplineBefore(null));
els.closeReorderBtn.addEventListener('click',closeReorderModal);
els.reorderModal.addEventListener('click',e=>{if(e.target===els.reorderModal)closeReorderModal()});
els.answerForm.addEventListener('submit',e=>{e.preventDefault();submitAutomatic()});
els.visualArea.addEventListener('click',e=>{const chip=e.target.closest('.divisor-chip');if(chip){toggleDivisorButton(chip);return}if(e.target.closest('.divisibility-confirm')){submitDivisibility();return}const prime=e.target.closest('.prime-number-chip');if(prime){togglePrimeNumber(prime);return}if(e.target.closest('.prime-confirm'))submitPrimeRecognition()});
els.oralAnsweredBtn.addEventListener('click',oralAnswered);
els.teacherCorrectBtn.addEventListener('click',()=>gradeCurrent(true,game?.oralFrozen??elapsed()));
els.teacherWrongBtn.addEventListener('click',()=>gradeCurrent(false,game?.oralFrozen??elapsed()));

[els.homeBtn,els.backBtn].forEach(b=>b.addEventListener('click',()=>showScreen('home')));
els.themeBtn.addEventListener('click',toggleTheme);els.soundBtn.addEventListener('click',toggleSound);els.fullscreenBtn.addEventListener('click',toggleFullscreen);
els.infoBtn.addEventListener('click',()=>els.infoModal.classList.remove('hidden'));els.closeInfoBtn.addEventListener('click',()=>els.infoModal.classList.add('hidden'));
els.closeCriteriaBtn.addEventListener('click',closeCriteriaModal);els.criteriaModal.addEventListener('click',e=>{if(e.target===els.criteriaModal)closeCriteriaModal()});
els.closePrimeBtn.addEventListener('click',closePrimeModal);els.primeModal.addEventListener('click',e=>{if(e.target===els.primeModal)closePrimeModal()});
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
