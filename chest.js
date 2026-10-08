// ---------- Baú: 27 espaços por baú, guardados pela posição do bloco ----------
const CH=new Map();
(()=>{
const ov=document.createElement('div');ov.id='chs';ov.className='ov';
ov.innerHTML='<div class="pn"><h2>Baú</h2><div id="chg"></div><p class="lb">Sua barra de itens</p><div id="chh"></div><p>Clique num espaço do baú: troca com o item selecionado da barra · botão direito esvazia o espaço · E ou Esc fecha.</p></div>';
document.body.append(ov);
const g=$('chg'),h=$('chh');let cur=null;
function draw(){const a=CH.get(cur);if(!a)return;g.replaceChildren();h.replaceChildren();
 a.forEach((b,i)=>{const d=mk(b);d.title=NAMES[b]||'';
  d.onclick=()=>{const t=hotb[sel];hotb[sel]=a[i];a[i]=t;hud();draw()};
  d.oncontextmenu=e=>{e.preventDefault();a[i]=0;draw()};g.appendChild(d)});
 hotb.forEach((b,i)=>{const d=mk(b);d.title=NAMES[b]||'';if(i==sel)d.classList.add('sel');
  d.onclick=()=>{sel=i;hud();draw()};h.appendChild(d)})}
window.openChest=(x,y,z)=>{cur=(x*H+y)*N+z;if(!CH.has(cur))CH.set(cur,Array(27).fill(0));draw();
 ov.classList.add('open');document.exitPointerLock();$('st').style.display='none'};
window.togCh=o=>{ov.classList.toggle('open',o);if(!o){cur=null;cv.requestPointerLock()}};
ov.addEventListener('click',e=>{if(e.target==ov)togCh(false)});
addEventListener('keydown',e=>{if(e.code=='Escape'&&ov.classList.contains('open'))togCh(false)});
})();
