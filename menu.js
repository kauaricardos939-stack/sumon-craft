// ---------- Menu de pausa Sumon Craft ----------
const CFG={fov:63,sens:.5,bri:1,rd:16,sh:0,clouds:true,fps:1e9,scale:1,coords:false,wind:1};
const PAUSED=()=>document.getElementById('st').style.display!=='none';
(()=>{const E=id=>document.getElementById(id),set=E('set');
const cfg={
jogo:[
 {t:'slider',l:'Campo de visão',min:30,max:110,v:63,f:v=>v==63?'Normal':v,on:v=>CFG.fov=v},
 {t:'slider',l:'Sensibilidade',min:1,max:100,v:50,f:v=>v+'%',on:v=>CFG.sens=v/100},
 {t:'cycle',l:'Coordenadas',o:['NÃO','SIM'],v:0,on:v=>CFG.coords=!!v}],
grafico:[
 {t:'slider',l:'Renderização',min:2,max:32,v:16,f:v=>v+' chunks',on:v=>CFG.rd=v},
 {t:'slider',l:'Brilho',min:0,max:100,v:50,f:v=>v==0?'Sombrio':v==100?'Brilhante':v+'%',on:v=>CFG.bri=.5+v/100},
 {t:'cycle',l:'Gráficos',o:['Rápido','Detalhado'],v:1,on:v=>CFG.scale=v?1:.6},
 {t:'cycle',l:'Shaders',o:['Desligado','Leve','Normal','Pesado'],v:0,on:v=>CFG.sh=v},
 {t:'cycle',l:'Vento nas folhas',o:['NÃO','Suave','Forte'],v:1,on:v=>CFG.wind=v},
 {t:'cycle',l:'Nuvens',o:['NÃO','SIM'],v:1,on:v=>CFG.clouds=!!v},
 {t:'cycle',l:'Limite de FPS',o:['30','60','120','Ilimitado'],v:3,on:v=>CFG.fps=[30,60,120,1e9][v]}]};
for(const k in cfg){const pane=E(k);cfg[k].forEach(c=>{
 if(c.t=='cycle'){const b=document.createElement('button'),up=()=>{b.textContent=c.l+': '+c.o[c.v];if(c.on)c.on(c.v)};b.onclick=()=>{c.v=(c.v+1)%c.o.length;up()};up();pane.append(b)}
 else{const d=document.createElement('div');d.className='sl';d.innerHTML='<i></i><span></span><input type="range">';
  const r=d.querySelector('input'),kn=d.querySelector('i'),sp=d.querySelector('span');r.min=c.min;r.max=c.max;r.value=c.v;
  const up=()=>{c.v=+r.value;kn.style.left=`calc((100% - 14px)*${(r.value-c.min)/(c.max-c.min)})`;sp.textContent=c.l+': '+c.f(c.v);if(c.on)c.on(c.v)};
  r.oninput=up;up();pane.append(d)}})}
document.querySelectorAll('#set .stabs button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('#set .stabs button').forEach(x=>x.classList.toggle('act',x==b));
 document.querySelectorAll('#set .pane').forEach(p=>p.classList.toggle('hidden',p.id!=b.dataset.p))});
const open=o=>set.classList.toggle('hidden',!o);
E('mResume').onclick=()=>cv.requestPointerLock();
E('mOpts').onclick=()=>open(true);E('mDone').onclick=()=>open(false);
addEventListener('keydown',e=>{if(e.code=='Escape')open(false)});
})();
