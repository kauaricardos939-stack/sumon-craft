// ---------- Botões Chat + Menu no meio do topo (arrastáveis) e chat estilo Minecraft ----------
// Carregue DEPOIS de title.js (já está na lista do index.html).
(()=>{
const css=document.createElement('style');
css.textContent=`
#tb{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);transform:translateX(-50%);z-index:8;display:flex;gap:6px;touch-action:none;cursor:grab}
#tb.drag{cursor:grabbing}
body.title #tb,body.title #chat,body.title #chi{display:none!important}
#tb button{width:42px;height:38px;padding:0;display:grid;place-items:center;cursor:inherit;background:rgba(60,60,60,.72);border:2px solid #111;box-shadow:inset 2px 2px 0 rgba(255,255,255,.35),inset -2px -2px 0 rgba(0,0,0,.45)}
#tb button:active{background:rgba(110,110,110,.85)}
#tb svg{width:24px;height:24px;fill:#fff;pointer-events:none}
#chat{position:fixed;left:8px;bottom:calc(var(--u)*30 + env(safe-area-inset-bottom,0px));z-index:9;width:min(460px,calc(100vw - 16px));font:20px "VT323",monospace;color:#fff;text-shadow:2px 2px #000;pointer-events:none}
#chat.open{bottom:calc(46px + var(--kb,0px) + env(safe-area-inset-bottom,0px))}
#chat .m{background:rgba(0,0,0,.5);padding:1px 6px;margin-top:1px;word-break:break-word;transition:opacity .6s}
#chat.open .m{opacity:1!important}
#chat .b{display:inline-block;vertical-align:middle;margin-right:6px;padding:3px 4px;min-width:64px;text-align:center;font:6px/1.5 "Press Start 2P",monospace;color:#fff;text-shadow:1px 1px #333;background:#7d7d7d;border:2px solid #1b1b1b;box-shadow:inset 2px 2px 0 #b4b4b4,inset -2px -2px 0 #4a4a4a;user-select:none}
#chat .b i{display:none;font-style:normal;color:#ffee55}
#chat.open .b{pointer-events:auto;cursor:pointer}
#chat.open .b:hover{outline:2px solid #fff;outline-offset:-2px}
#chat.on .b{background:#5b9a35;box-shadow:inset 2px 2px 0 #94cf6b,inset -2px -2px 0 #35611d}
#chat.on .b i{display:block}
#chi{display:none;position:fixed;left:124px;right:60px;bottom:calc(8px + var(--kb,0px) + env(safe-area-inset-bottom,0px));z-index:9;box-sizing:border-box;height:32px;background:rgba(0,0,0,.65);color:#fff;border:2px solid #aaa;font:20px "VT323",monospace;padding:0 8px;outline:none;user-select:text}
#chi.open,#cse.open,#cbd.open{display:block}
#cmodel{display:none;position:fixed;left:8px;bottom:calc(44px + var(--kb,0px) + env(safe-area-inset-bottom,0px));z-index:11;width:112px;height:30px;padding:0 3px;box-sizing:border-box;font:6px "Press Start 2P",monospace;color:#fff;background:#383838;border:2px solid #111;text-shadow:1px 1px #222;pointer-events:auto;touch-action:manipulation}
#cmodel.open{display:block}
#cbd.open~#cmodel.open{bottom:calc(44px + var(--kb,0px) + env(safe-area-inset-bottom,0px))}
#cmodel:focus{outline:2px solid #fff}
#cbd{display:none;position:fixed;left:8px;bottom:calc(8px + var(--kb,0px) + env(safe-area-inset-bottom,0px));z-index:9;width:112px;height:32px;padding:0;cursor:pointer;text-align:center;font:6px/1.6 "Press Start 2P",monospace;color:#fff;text-shadow:1px 1px #333;background:#7d7d7d;border:2px solid #1b1b1b;box-shadow:inset 2px 2px 0 #b4b4b4,inset -2px -2px 0 #4a4a4a}
#cbd i{display:none;font-style:normal;color:#ffee55}
#cbd:hover{outline:2px solid #fff;outline-offset:-2px}
#cbd.on{background:#5b9a35;box-shadow:inset 2px 2px 0 #94cf6b,inset -2px -2px 0 #35611d}
#cbd.on i{display:block}
#cse{display:none;position:fixed;right:8px;bottom:calc(8px + var(--kb,0px) + env(safe-area-inset-bottom,0px));z-index:9;width:44px;height:32px;padding:0;cursor:pointer;font:8px "Press Start 2P",monospace;color:#fff;text-shadow:1px 1px #333;background:#5b9a35;border:2px solid #1b1b1b;box-shadow:inset 2px 2px 0 #94cf6b,inset -2px -2px 0 #35611d}
`;
document.head.append(css);

const bar=document.createElement('div');bar.id='tb';
bar.innerHTML=
 '<button id="tbChat" title="Chat (T)"><svg viewBox="0 0 24 24"><path d="M3 4h18v13H11l-5 4v-4H3z"/><path d="M6 8h12v2H6zm0 4h8v2H6z" fill="#555"/></svg></button>'+
 '<button id="tbMenu" title="Menu (Esc)"><svg viewBox="0 0 24 24"><path d="M4 5h16v3H4zm0 5.5h16v3H4zM4 16h16v3H4z"/></svg></button>';
document.body.append(bar);

const chat=document.createElement('div');chat.id='chat';chat.innerHTML='<div id="chl"></div>';document.body.append(chat);
const chi=document.createElement('input');chi.id='chi';chi.maxLength=100;chi.autocomplete='off';chi.placeholder='Digite uma mensagem';document.body.append(chi);
const cse=document.createElement('button');cse.id='cse';cse.textContent='OK';document.body.append(cse);
const cbd=document.createElement('button');cbd.id='cbd';cbd.innerHTML='SUMON ASSISTENTE<i>ATIVADO</i>';cbd.title='Sumon Assistente';document.body.append(cbd);
const cmodel=document.createElement('select');cmodel.id='cmodel';cmodel.title='Modelo do Sumon Assistente';
[['gemini-3.8-flash','Gemini 3.8'],['gemini-3.7-flash','Gemini 3.7'],['gemini-3.6-flash','Gemini 3.6'],['openai/gpt-oss-120b','GPT OSS 120B'],['openai/gpt-oss-20b','GPT OSS 20B']].forEach(([value,label])=>{const o=document.createElement('option');o.value=value;o.textContent=label;cmodel.append(o)});
try{cmodel.value=localStorage.getItem('sc.sumon.model')||'openai/gpt-oss-20b'}catch(e){cmodel.value='openai/gpt-oss-20b'}
cmodel.onchange=()=>{try{localStorage.setItem('sc.sumon.model',cmodel.value)}catch(e){}};document.body.append(cmodel);
cbd.onpointerdown=e=>e.preventDefault();window.sumonActive=()=>cbd.classList.contains('on');
cbd.onclick=()=>{cbd.classList.toggle('on');chi.focus();try{window.onSumonToggle&&window.onSumonToggle(cbd.classList.contains('on'))}catch(e){}};
const syncModelVisibility=()=>cmodel.classList.toggle('open',cbd.classList.contains('open'));
const chl=chat.firstChild;
const vv=window.visualViewport;if(vv){const kb=()=>document.documentElement.style.setProperty('--kb',Math.max(0,innerHeight-vv.height-vv.offsetTop)+'px');vv.addEventListener('resize',kb);vv.addEventListener('scroll',kb)}
const isOpen=()=>chi.classList.contains('open');

// ---------- arrastar a barra ----------
const clamp=()=>{const r=bar.getBoundingClientRect();
 bar.style.left=Math.min(innerWidth-r.width,Math.max(0,r.left))+'px';bar.style.top=Math.min(innerHeight-r.height,Math.max(0,r.top))+'px';bar.style.transform='none'};
try{const p=JSON.parse(localStorage.getItem('sc.tbpos'));if(p){bar.style.left=p[0]+'px';bar.style.top=p[1]+'px';bar.style.transform='none';clamp()}}catch(e){}
let dr=null,moved=false;
bar.addEventListener('pointerdown',e=>{if(e.target.closest('select'))return;const r=bar.getBoundingClientRect();dr={x:e.clientX,y:e.clientY,l:r.left,t:r.top};moved=false;bar.setPointerCapture(e.pointerId)});
bar.addEventListener('pointermove',e=>{if(!dr)return;const dx=e.clientX-dr.x,dy=e.clientY-dr.y;
 if(!moved&&Math.hypot(dx,dy)<6)return;moved=true;bar.classList.add('drag');
 bar.style.transform='none';bar.style.left=dr.l+dx+'px';bar.style.top=dr.t+dy+'px';clamp()});
const endDrag=()=>{if(!dr)return;dr=null;bar.classList.remove('drag');
 if(moved){const r=bar.getBoundingClientRect();try{localStorage.setItem('sc.tbpos',JSON.stringify([r.left|0,r.top|0]))}catch(e){}}};
bar.addEventListener('pointerup',endDrag);bar.addEventListener('pointercancel',endDrag);
bar.addEventListener('click',e=>{if(moved){e.stopImmediatePropagation();e.preventDefault();moved=false}},true);
addEventListener('resize',()=>{if(bar.style.transform=='none')clamp()});

// ---------- chat ----------
const say=(t,badge)=>{const d=document.createElement('div');d.className='m';
 if(badge){const b=document.createElement('span');b.className='b';b.innerHTML='SUMON<br>ASSISTENTE<i>ATIVADO</i>';b.title='Sumon Assistente';
  b.onclick=()=>chat.classList.toggle('on');d.append(b)}
 d.append(document.createTextNode(t));chl.append(d);
 while(chl.children.length>10)chl.firstChild.remove();
 setTimeout(()=>{d.style.opacity=0},8000);setTimeout(()=>d.remove(),8700)};
window.chatSay=say;
let hadLock=false;
const openChat=o=>{if(o)hadLock=!!document.pointerLockElement;
 chat.classList.toggle('open',o);chi.classList.toggle('open',o);cse.classList.toggle('open',o);cbd.classList.toggle('open',o);syncModelVisibility();
 if(o){document.exitPointerLock();$('st').style.display='none';chi.value='';setTimeout(()=>chi.focus(),0)}
 else{chi.blur();if(hadLock)cv.requestPointerLock();hadLock=false}};
const send=()=>{const v=chi.value.trim();if(v){say('<Jogador> '+v);try{window.onChatSend&&window.onChatSend(v)}catch(e){console.warn('chat:',e)}}openChat(false)};
cse.onclick=send;
document.addEventListener('pointerlockchange',()=>{if(isOpen())$('st').style.display='none'});
chi.addEventListener('keydown',e=>{
 if(e.key=='Enter'||e.code=='Enter'||e.keyCode==13){e.preventDefault();send()}
 else if(e.key=='Escape'||e.code=='Escape')openChat(false)});

// botão do chat = tecla T; botão do menu = tecla Esc (menu de pausa normal)
$('tbChat').onclick=()=>openChat(!isOpen());
$('tbMenu').onclick=()=>{if(isOpen())openChat(false);document.exitPointerLock();$('st').style.display='flex'};

addEventListener('keydown',e=>{
 if(document.activeElement===chi){if(e.key!=='Escape'&&e.key!=='Enter'&&e.code!=='Escape'&&e.code!=='Enter')e.stopImmediatePropagation();return}
 if(e.code=='KeyT'&&!document.body.classList.contains('title')&&!PAUSED()&&document.pointerLockElement){e.preventDefault();e.stopImmediatePropagation();openChat(true)}
},true);
})();
