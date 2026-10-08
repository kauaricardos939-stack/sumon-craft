// ---------- HUD criativo: barra de baixo + inventário com abas ----------
const hotb=Array(9).fill(0);let sel=0;
// ícones renderizados em 96x96 (fator 3 sobre o desenho original de 32x32) para ficarem nítidos
const IK=3;
function icon(b){const c=document.createElement('canvas');c.width=c.height=32*IK;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
 const st=(a,b2,c2,d,e,f)=>x.setTransform(a*IK,b2*IK,c2*IK,d*IK,e*IK,f*IK);
 const tl=t=>{x.drawImage(AT,t*16,0,16,16,0,0,16,16)},sh=a=>{x.fillStyle=`rgba(0,0,0,${a})`;x.fillRect(0,0,16,16)};
 if(b==67){st(1,0,0,1,0,0);x.fillStyle='#8a8a8e';x.fillRect(9,18,14,10);x.fillStyle='#5c5c60';x.fillRect(9,25,14,3);for(let k=0;k<12;k++){x.fillStyle=k>9?'#d03030':'#7c5c34';x.fillRect(14+(k*.7|0),19-k,3,2)}return c}
 if(SLAB_T[b]||STAIR_T[b]){const t=SLAB_T[b]||STAIR_T[b],ib=B=>{const[X0,Y0,Z0,X1,Y1,Z1]=B,u0=X0*16,uw=(X1-X0)*16,w0=Z0*16,ww=(Z1-Z0)*16,v0=(1-Y1)*16,vh=(Y1-Y0)*16,ru=(1-Z1)*16,fr=(a,xx,yy,w2,h2)=>{x.fillStyle=`rgba(0,0,0,${a})`;x.fillRect(xx,yy,w2,h2)};
  st(14/16,7/16,-14/16,7/16,16,2+(1-Y1)*14);x.drawImage(AT,t*16+u0,w0,uw,ww,u0,w0,uw,ww);
  st(14/16,7/16,0,14/16,2+14*(1-Z1),2+7*Z1);x.drawImage(AT,t*16+u0,v0,uw,vh,u0,v0,uw,vh);fr(.2,u0,v0,uw,vh);
  st(14/16,-7/16,0,14/16,2+14*X1,9+7*X1);x.drawImage(AT,t*16+ru,v0,ww,vh,ru,v0,ww,vh);fr(.4,ru,v0,ww,vh)};
  ib([0,0,0,1,.5,1]);if(STAIR_T[b])ib([0,.5,0,1,1,.5]);return c}
 if(b==79){st(1,0,0,1,0,0);x.fillStyle='#5c4020';x.fillRect(3,24,3,5);x.fillRect(26,24,3,5);x.fillStyle='#8a6a3c';x.fillRect(3,18,26,7);x.fillStyle='#a88250';x.fillRect(3,18,26,2);x.fillStyle='#d03030';x.fillRect(12,12,17,8);x.fillStyle='#a02020';x.fillRect(12,18,17,2);x.fillStyle='#f4f4f4';x.fillRect(4,12,9,8);x.fillStyle='#c4c4c4';x.fillRect(4,18,9,2);x.fillStyle='#6b4c26';x.fillRect(2,8,3,17);return c}
 if(b==80){st(1,0,0,1,0,0);x.drawImage(AT,90*16,0,16,16,9,1,14,15);x.drawImage(AT,89*16,0,16,16,9,15,14,15);return c}
 if(b==74||b==75){st(14/16,7/16,-14/16,7/16,16,10);tl(b==74?79:81);
  st(14/16,7/16,0,14/16/4,2,17);tl(83);sh(.2);st(14/16,-7/16,0,14/16/4,16,24);tl(83);sh(.4);return c}
 if(b==72){st(1,0,0,1,0,0);for(let j=-5;j<=5;j++)for(let i=-6;i<=6;i++){const d=(i*i)/36+(j*j)/25;if(d<=1){x.fillStyle=d>.78?'#7a0a0a':(i*3+j*5)%4?'#d01818':'#ff4a3a';x.fillRect(16+i*2-1,17+j*2-1,2,2)}}return c}
 if(b>=11&&b<=13){st(2,0,0,2,0,0);tl(b+2);return c}
 if(b==15){st(2,0,0,2,0,0);tl(18);return c}
 const tt=TT[b],sd=b==9?10:b==10?12:b==76?84:tt[2];
 st(14/16,7/16,-14/16,7/16,16,2);tl(tt[0]);
 st(14/16,7/16,0,14/16,2,9);tl(sd);sh(.2);
 st(14/16,-7/16,0,14/16,16,16);tl(tt[2]);sh(.4);return c}
const IC={};for(let b=1;b<=140;b++)if(b!=68&&b!=69&&b!=70&&b!=71&&!(b>=81&&b<=84))IC[b]=icon(b);
const cp=b=>{const c=document.createElement('canvas');c.width=c.height=32*IK;if(IC[b])c.getContext('2d').drawImage(IC[b],0,0);return c};
const mk=(b,fn)=>{const d=document.createElement('div');d.className='s';d.appendChild(cp(b));if(fn)d.onclick=fn;return d};
const tip=$('tip');
const tipOn=(d,t)=>{d.onpointerenter=()=>{if(!t)return;tip.textContent=t;tip.style.display='block'};d.onpointerleave=()=>tip.style.display='none'};
document.addEventListener('pointermove',e=>{tip.style.transform=`translate(${Math.min(e.clientX+14,innerWidth-tip.offsetWidth-8)}px,${e.clientY+18}px)`});
let nmT;
function hud(){tip.style.display='none';
 const h=$('hbar'),c=$('chot');h.replaceChildren();c.replaceChildren();
 hotb.forEach((b,i)=>{
  const a=document.createElement('div');a.className='hs'+(i==sel?' sel':'');a.appendChild(cp(b));a.onclick=()=>{sel=i;hud()};h.appendChild(a);
  const d=document.createElement('div');d.className='slot'+(i==sel?' sel':'');d.appendChild(cp(b));d.onclick=()=>{sel=i;hud()};tipOn(d,NAMES[b]);d.oncontextmenu=e=>{e.preventDefault();hotb[i]=0;hud()};c.appendChild(d)});
 $('nm').textContent=NAMES[hotb[sel]]||'';clearTimeout(nmT);nmT=setTimeout(()=>$('nm').textContent='',1800)}
const R = (p, x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) p(x+i, y+j, c); };
const disc = (p, cx, cy, rx, ry, f) => { for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { const d = Math.hypot((i-cx)/rx, (j-cy)/ry); if (d <= 1) p(i, j, f(i, j, d)); } };
const ICON = {
  construcao: p => { R(p,1,2,14,12,'#9a8f86'); for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) { const o = r % 2 ? 3 : 0, x = 1 + o + k * 6 - (r % 2 ? 6 : 0);
    for (let q = 0; q < 3; q++) for (let w = 0; w < 5; w++) { const i = x + w; if (i >= 1 && i < 15) p(i, 2 + r*4 + q, q === 0 ? '#c4583f' : '#a8452f'); } } },
  coloridos: p => { R(p,1,1,7,7,'#d93636'); R(p,8,1,7,7,'#3b6fe0'); R(p,1,8,7,7,'#f2c230'); R(p,8,8,7,7,'#3fae3f'); R(p,1,1,7,1,'#f06a6a'); R(p,8,1,7,1,'#7ba2f0'); R(p,1,8,7,1,'#f8dc70'); R(p,8,8,7,1,'#80d080'); },
  naturais: p => { R(p,7,9,2,6,'#6b4a24'); disc(p,8,6,6,5.5,(i,j,d) => d > .8 ? '#2e7a22' : (i+j)%3 ? '#3f9a2f' : '#55b640'); },
  funcionais: p => { R(p,7,9,2,6,'#6b4a24'); R(p,1,2,14,8,'#4e3419'); R(p,2,3,12,6,'#c9a066'); R(p,4,5,8,1,'#8a6a3c'); R(p,4,7,6,1,'#8a6a3c'); },
  redstone: p => { disc(p,8,9,6.5,5,(i,j,d) => (i*5+j*3)%7 === 0 ? '#ff5a5a' : d > .8 ? '#8a0e0e' : (i+j)%2 ? '#c01818' : '#e03030'); p(6,4,'#ff7a7a'); p(10,5,'#ff7a7a'); },
  pesquisar: p => { disc(p,8,8,7,7,(i,j,d) => d > .82 ? '#6a6a72' : '#2a2a30');
    for (let k = 0; k < 5; k++) { p(8+k, 8-k, '#e84a4a'); p(8-k, 8+k, '#f0f0f0'); p(9+k, 8-k, '#b02828'); } p(8,8,'#ffd84a'); },
  ferramentas: p => { for (let k = 0; k < 10; k++) p(2+k, 14-k, '#6b4a24');
    [[3,6],[4,4],[5,3],[7,2],[9,2],[11,3],[12,4],[13,6],[13,8],[4,5],[6,2],[8,2],[10,2],[12,5],[13,7]].forEach(([i,j]) => { p(i,j,'#d4d4d8'); p(i,j+1,'#8c8c94'); }); },
  combate: p => { for (let k = 5; k <= 14; k++) { p(k,15-k,'#d4d4d8'); p(k+1,15-k,'#f0f0f4'); } p(15,0,'#f0f0f4');
    for (let k = 1; k <= 3; k++) p(k,15-k,'#6b4a24'); p(0,15,'#4e3419'); for (let t = -2; t <= 2; t++) p(4+t,11+t,'#7a7a82'); },
  comidas: p => { disc(p,7.5,9.5,5.2,5.2,(i,j,d) => d > .78 ? '#a01c1c' : (i < 6 && j < 9 ? '#e8504a' : '#cf2a2a')); p(8,3,'#6b4a24'); p(8,4,'#6b4a24'); p(9,3,'#3f9a2f'); p(10,3,'#3f9a2f'); p(10,4,'#2f7a22'); p(5,7,'#fff'); },
  ingredientes: p => { for (let j = 5; j < 12; j++) for (let i = 2; i < 14; i++) p(i, j, j < 8 ? '#f0f0f4' : j === 11 ? '#8c8c94' : '#d0d0d6'); for (let j = 5; j < 12; j++) p(13, j, '#a8a8b0'); },
  ovos: p => { disc(p,8,9,4.6,6.2,(i,j,d) => d > .85 ? '#4a8a38' : '#6aa84f'); [[6,6],[9,8],[7,11],[10,5],[5,9]].forEach(([i,j]) => R(p,i,j,2,2,'#7a4a2a')); },
  sobrevivencia: p => { R(p,2,4,12,10,'#2a1a08'); R(p,3,5,10,8,'#a87c3e'); R(p,3,5,10,1,'#c99a58'); R(p,3,8,10,1,'#6a4a1e'); R(p,7,7,2,3,'#c8c8c0'); R(p,7,9,2,1,'#3a3a3c'); },
};

const TABS={top:[['construcao','Blocos de Construção'],['coloridos','Blocos Coloridos'],['naturais','Blocos Naturais'],['funcionais','Blocos Funcionais'],['redstone','Blocos de Redstone'],['pesquisar','Pesquisar Itens']],
 bot:[['ferramentas','Ferramentas e Utilidades'],['combate','Combate'],['comidas','Comidas e Bebidas'],['ingredientes','Ingredientes'],['ovos','Ovos de Geração'],['sobrevivencia','Inventário de Sobrevivência']]};
// blocos de cada aba (a de pesquisa mostra todos)
const CAT=[[5,92,95,105,6,7,3,14,15,77,85,86,87,88,89,90,97,98,99,100,106,107],Array.from({length:48},(_,i)=>16+i),[1,2,3,4,8,93,96,91,94,11,12,13,78,101,102,103,104,108,109,110,111,112],[9,10,79,80],[67,72,73,74,75,76,65,66,64],null,[],[],[],[],[],[]];
CAT[0].push(113,114,115,116,125,131,132,130,129);CAT[2].push(117,118,119,120,121,122,124,128,133,134,135,136,138,139);CAT[3].push(140,126,123,127,137);
const tabEls=[];let curTab=0,off=0,offMax=0;
function fillGrid(){const g=$('grid');g.replaceChildren();
 const q=$('q').value.trim().toLowerCase();
 const list=curTab==5?Object.keys(NAMES).map(Number).filter(b=>NAMES[b].toLowerCase().includes(q)):CAT[curTab];
 offMax=Math.max(0,Math.ceil((list.length-54)/9)*9);off=Math.min(off,offMax);
 $('thumb').style.top=`calc(2px + (100% - var(--slot)*.6 - 4px) * ${offMax?off/offMax:0})`;
 for(let i=0;i<54;i++){const d=document.createElement('div');d.className='slot';const b=list[off+i];
  if(b){d.appendChild(cp(b));d.onpointerdown=e=>{e.preventDefault();holdPick(b,e)};tipOn(d,NAMES[b])}g.appendChild(d)}}
$('grid').parentElement.addEventListener('wheel',e=>{if(!offMax)return;off=Math.max(0,Math.min(offMax,off+(e.deltaY>0?9:-9)));fillGrid()},{passive:true});
function select(t){curTab=tabEls.indexOf(t);off=0;tabEls.forEach(e=>e.classList.toggle('on',e===t));
 $('title').textContent=t.dataset.name;$('q').style.display=curTab==5?'block':'none';fillGrid();if(curTab==5)$('q').focus()}
for(const row of['top','bot'])TABS[row].forEach(([k,name])=>{
 const t=document.createElement('div');t.className='tab';const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');
 ICON[k]((i,j,col)=>{x.fillStyle=col;x.fillRect(i,j,1,1)});t.appendChild(c);t.dataset.name=name;t.onclick=()=>select(t);tipOn(t,name);$(row).appendChild(t);tabEls.push(t)});
$('q').addEventListener('input',fillGrid);
select(tabEls[0]);
const inv=$('cri');
function togInv(){holdSet(0);const o=!inv.classList.contains('open');inv.classList.toggle('open',o);
 if(o){document.exitPointerLock();$('st').style.display='none'}else{tip.style.display='none';cv.requestPointerLock()}}
$('invSq').onclick=togInv;
inv.addEventListener('click',e=>{if(e.target==inv)togInv()});

// ---------- Arrastar item do inventário até a barra ----------
let held=0,heldEl=null,fresh=false,hx=0,hy=0;
function holdSet(b,e){held=b;if(heldEl){heldEl.remove();heldEl=null}
 if(b){heldEl=cp(b);heldEl.style.cssText='position:fixed;left:0;top:0;width:44px;height:44px;pointer-events:none;z-index:40;image-rendering:pixelated';document.body.appendChild(heldEl);if(e)moveHeld(e)}}
function moveHeld(e){if(heldEl)heldEl.style.transform=`translate(${e.clientX-22}px,${e.clientY-22}px)`}
function holdPick(b,e){holdSet(b,e);fresh=true;hx=e.clientX;hy=e.clientY;tip.style.display='none'}
addEventListener('pointermove',moveHeld);
addEventListener('pointerup',e=>{if(!held)return;
 if(fresh){fresh=false;if(Math.hypot(e.clientX-hx,e.clientY-hy)<8)return}
 const el=document.elementFromPoint(e.clientX,e.clientY),s=el&&el.closest('#chot .slot'),i=s?[...$('chot').children].indexOf(s):-1;
 if(i>=0){hotb[i]=held;sel=i;hud()}holdSet(0)});
hud();

// ---------- Mesa de trabalho (crafting 3x3) ----------
const crEl=$('cr'),crG=$('crg'),crR=$('crr'),cr=Array(9).fill(0);
function recipe(){const it=cr.map((b,i)=>[b,i]).filter(a=>a[0]);
 if(it.length==1&&it[0][0]==8)return 5;
 if(it.length==1&&it[0][0]==93)return 92;
 if(it.length==1&&it[0][0]==104)return 105;
 if(it.length==1&&it[0][0]==96)return 95;
 if(it.length==4&&it.every(a=>a[0]==5||a[0]==92||a[0]==95)){const p=it.map(a=>a[1]),r=p.map(i=>i/3|0),c=p.map(i=>i%3);
  if(Math.max(...r)-Math.min(...r)==1&&Math.max(...c)-Math.min(...c)==1)return 10}
 if(it.length==8&&it.every(a=>a[0]==7)&&!cr[4])return 9;
 return 0}
function drawCr(){crG.replaceChildren();cr.forEach((b,i)=>{const d=b?mk(b):document.createElement('div');d.className='s';
  d.onclick=()=>{cr[i]=hotb[sel];drawCr()};d.oncontextmenu=e=>{e.preventDefault();cr[i]=0;drawCr()};crG.appendChild(d)});
 crR.replaceChildren();const r=recipe();const d=r?mk(r,()=>{hotb[sel]=r;cr.fill(0);hud();drawCr()}):document.createElement('div');d.className='s';crR.appendChild(d)}
function togCr(o){crEl.classList.toggle('open',o);
 if(o){document.exitPointerLock();$('st').style.display='none';drawCr()}else cv.requestPointerLock()}
crEl.addEventListener('click',e=>{if(e.target==crEl)togCr(false)});
