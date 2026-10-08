// ---------- Motor de animais do Sumon Craft ----------
// Carregue DEPOIS de post.js e ANTES de loop.js; cada bicho (cow.js, chicken.js...) é um arquivo que chama Mob.define({...}).
// O motor se encaixa sozinho no laço (envolve PPend) e não altera nenhum outro arquivo.
window.Mob=(()=>{
const PROG=pg,VIEW=90,species=[];

// ---------- shader (mesma névoa e brilho do mundo) ----------
const mkS=(ty,src)=>{const o=gl.createShader(ty);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.warn('mob shader:',gl.getShaderInfoLog(o));return o};
const pp=gl.createProgram();
gl.attachShader(pp,mkS(gl.VERTEX_SHADER,'attribute vec3 p;attribute vec2 t;attribute float s;attribute float k;uniform mat4 m;varying vec2 v;varying float sh,hk,d;void main(){gl_Position=m*vec4(p,1.);v=t;sh=s;hk=k;d=gl_Position.w;}'));
gl.attachShader(pp,mkS(gl.FRAGMENT_SHADER,'precision mediump float;uniform sampler2D u;uniform vec2 uF;uniform vec3 uFC;uniform float uB;varying vec2 v;varying float sh,hk,d;void main(){vec4 c=texture2D(u,v);vec3 col=c.rgb*sh*uB;col=mix(col,vec3(1.,.2,.2),hk*.55);gl_FragColor=vec4(mix(col,uFC,clamp((d-uF.x)/(uF.y-uF.x),0.,1.)),1.);}'));
['p','t','s','k'].forEach((n,i)=>gl.bindAttribLocation(pp,i,n));gl.linkProgram(pp);
const uM=gl.getUniformLocation(pp,'m'),uU=gl.getUniformLocation(pp,'u'),uF2=gl.getUniformLocation(pp,'uF'),uFC2=gl.getUniformLocation(pp,'uFC'),uB2=gl.getUniformLocation(pp,'uB');

const FSH=[.85,.65,1,.5,.75,.75],UVQ=[[0,1],[1,1],[1,0],[0,0]],QI=[0,1,2,0,2,3];
const faces=B=>{const[x0,y0,z0,x1,y1,z1]=B;return[
 [[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],[[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0]],
 [[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]],[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],
 [[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1]],[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]]]};
const wrap=a=>{while(a>Math.PI)a-=6.2832;while(a<-Math.PI)a+=6.2832;return a};

function define(cfg){
 const S={cfg,mobs:[],buf:[]};species.push(S);
 const HW=cfg.hw,HH=cfg.hh,NTL=cfg.tiles,TW=cfg.texW||NTL*16,TH=cfg.texH||16;
 // ---------- textura do bicho ----------
 let cvp;
 if(cfg.canvas)cvp=cfg.canvas();else{cvp=document.createElement('canvas');cvp.width=TW;cvp.height=16;
 const pcx=cvp.getContext('2d'),pim=pcx.createImageData(TW,16);
 const tx={
  set(t,i,j,c){if(i<0||j<0||i>15||j>15)return;const o=(j*TW+t*16+i)*4;pim.data[o]=c[0];pim.data[o+1]=c[1];pim.data[o+2]=c[2];pim.data[o+3]=255},
  fill(t,c,v=.06){for(let j=0;j<16;j++)for(let i=0;i<16;i++)tx.set(t,i,j,c.map(q=>Math.min(255,q*(1-v+Math.random()*v*2)|0)))},
  rect(t,x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)tx.set(t,x+i,y+j,c)}};
 cfg.draw(tx);pcx.putImageData(pim,0,0)}
 S.tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,S.tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,cvp);
 for(const[k,v]of[[gl.TEXTURE_MIN_FILTER,gl.NEAREST],[gl.TEXTURE_MAG_FILTER,gl.NEAREST],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,k,v);
 gl.bindTexture(gl.TEXTURE_2D,tex);
 S.vb=gl.createBuffer();

 // ---------- malha: partes em coordenadas locais (frente = +z, chão = y 0) ----------
 function emit(out,m){
  const sy=Math.sin(m.yaw),cy=Math.cos(m.yaw),hk=m.hurt>0?Math.min(1,m.hurt*3):0,
   roll=m.dead?Math.min(1,(.5-m.dead)/.5)*Math.PI/2:0,sr=Math.sin(roll),cr=Math.cos(roll),
   ang=Math.sin(m.anim)*(cfg.legAmp||.7)*Math.min(1,m.spd/cfg.walk),
   wingA=m.gr?(m.spd>0?.12:0):.55+Math.abs(Math.sin(m.flap))*.9,
   tm=performance.now()/1000,idle=1-Math.min(1,m.spd/cfg.walk),hY=Math.sin(tm*.7+m.x*3.1)*.25*idle,hX=Math.sin(tm*.5+1+m.z)*.05,
   hsy=Math.sin(hY),hcy=Math.cos(hY),hsx=Math.sin(hX),hcx=Math.cos(hX),at=m.hurt>0?-1.9+Math.sin(tm*7)*.7:0;
  for(const P_ of cfg.parts){
   let sa=0,ca=1,wsa=0,wca=1;
   const rl=P_.leg||P_.rx||P_.atk,la=(P_.leg?ang*P_.leg:0)+(P_.rx||0)+(P_.atk&&m.hurt>0?at:0);
   if(rl){sa=Math.sin(la);ca=Math.cos(la)}
   if(P_.wing){const w=wingA*P_.wing;wsa=Math.sin(w);wca=Math.cos(w)}
   faces(P_.B).forEach((f,fi)=>{const tl=P_.t?P_.t[fi]:0,rc=P_.uv&&P_.uv[fi];
    for(const q of QI){
     let[x,y,z]=f[q];
     if(rl){const dy=y-P_.py,dz=z-P_.pz;y=P_.py+dy*ca-dz*sa;z=P_.pz+dy*sa+dz*ca}
     if(P_.hd){const dy=y-P_.py,dz=z-P_.pz;y=P_.py+dy*hcx-dz*hsx;z=P_.pz+dy*hsx+dz*hcx;const dz2=z-P_.pz,dx=x;x=dx*hcy+dz2*hsy;z=P_.pz-dx*hsy+dz2*hcy}
     if(P_.wing){const dx=x-P_.px,dy=y-P_.py;x=P_.px+dx*wca-dy*wsa;y=P_.py+dx*wsa+dy*wca}
     if(roll){const ry=cfg.rollY,dy=y-ry,nx=x*cr-dy*sr,ny=ry+x*sr+dy*cr;x=nx;y=ny-cfg.rollY*.27*(roll/1.5708)}
     out.push(m.x+x*cy+z*sy,m.y+y,m.z-x*sy+z*cy,rc?(rc[0]+UVQ[q][0]*rc[2])/TW:(tl+UVQ[q][0])/NTL,rc?(rc[1]+UVQ[q][1]*rc[3])/TH:UVQ[q][1],FSH[fi],hk)}})}}
 S.emit=emit;

 // ---------- colisão ----------
 const hitW=(x,y,z)=>{for(let a=Math.floor(x-HW);a<=Math.floor(x+HW);a++)for(let b=Math.floor(y);b<=Math.floor(y+HH);b++)for(let c=Math.floor(z-HW);c<=Math.floor(z+HW);c++){
  const q=get(a,b,c);if(!solid(q))continue;const bs=bbox(q,M.get((a*H+b)*N+c)||0,a,b,c);if(!bs)return true;
  for(const B of bs)if(x+HW>a+B[0]&&x-HW<a+B[3]&&y+HH>b+B[1]&&y<b+B[4]&&z+HW>c+B[2]&&z-HW<c+B[5])return true}return false};

 function add(x,z){const h=HM[x|0][z|0];if(h<=SEA+1)return false;const g=get(x|0,h,z|0);if(g!=1&&g!=102&&g!=109)return false;
  const m={x,y:h+1.001,z,vx:0,vy:0,vz:0,kx:0,kz:0,yaw:Math.random()*6.28,tyaw:0,st:0,t:Math.random()*3,gr:false,hp:cfg.hp,hurt:0,flee:0,anim:Math.random()*6,flap:0,spd:0,dead:0};
  m.tyaw=m.yaw;if(hitW(m.x,m.y,m.z))return false;S.mobs.push(m);return true}
 // alguns perto do ponto de nascimento + grupos espalhados pelos biomas certos
 {let tries=0;
  for(let k=0;k<(cfg.near==null?4:cfg.near)&&tries++<4000;){const a=Math.random()*6.28,r=8+Math.random()*26;if(add(SPX+Math.cos(a)*r,SPZ+Math.sin(a)*r))k++}
  const g=cfg.group||[1,3];
  while(S.mobs.length<cfg.count&&tries++<40000){const x=8+Math.random()*(N-16),z=8+Math.random()*(N-16);
   if(!cfg.biomes.includes(BM[x|0][z|0]))continue;
   const n=g[0]+(Math.random()*(g[1]-g[0]+1)|0);for(let k=0;k<n;k++)add(x+(Math.random()-.5)*5,z+(Math.random()-.5)*5)}}

 // ---------- IA e física ----------
 S.think=(m,dt)=>{
  const fr=m.flee>0;m.flee=Math.max(0,m.flee-dt);m.hurt=Math.max(0,m.hurt-dt);
  if(m.dead){m.dead-=dt;m.vx=m.vz=0;m.spd=0}
  else{
   m.t-=dt;
   if(m.t<=0){if(m.st==0){m.st=1;m.tyaw=Math.random()*6.2832;m.t=2+Math.random()*3}else{m.st=0;m.t=(cfg.idle||1.5)+Math.random()*3.5}}
   if(m.st==1&&!fr){const fx=m.x+Math.sin(m.yaw)*(HW+.5),fz=m.z+Math.cos(m.yaw)*(HW+.5),by=Math.floor(m.y-.1);
    let ground=false;for(let d=0;d<=3;d++){const q=get(Math.floor(fx),by-d,Math.floor(fz));if(q&&q!=78&&solid(q)){ground=true;break}}
    if(get(Math.floor(fx),by,Math.floor(fz))==78||get(Math.floor(fx),by,Math.floor(fz))==112||!ground){m.tyaw=m.yaw+Math.PI*(.6+Math.random()*.8);m.t=Math.max(m.t,1)}}
   const turn=(fr?2.4:1)*(cfg.turn||3.2)*dt;m.yaw+=Math.max(-turn,Math.min(turn,wrap(m.tyaw-m.yaw)));
   const go=(m.st==1||fr)&&Math.abs(wrap(m.tyaw-m.yaw))<.7,wat=[78,112].includes(get(Math.floor(m.x),Math.floor(m.y+.3),Math.floor(m.z))),
    sp=(fr?cfg.flee:cfg.walk)*(wat?.6:1)*(go?1:0);
   m.vx=Math.sin(m.yaw)*sp+m.kx;m.vz=Math.cos(m.yaw)*sp+m.kz;m.spd=sp;
   const kd=Math.exp(-5*dt);m.kx*=kd;m.kz*=kd;
   if(wat)m.vy+=(1.8-m.vy)*Math.min(1,5*dt);else{m.vy-=26*dt;if(cfg.flutter&&m.vy<-1.6)m.vy=-1.6}
   if(!m.gr)m.flap+=dt*(cfg.flutter?32:0);
   const dx=m.x-P.x,dz=m.z-P.z,dd=Math.hypot(dx,dz);
   if(dd<HW+.5&&Math.abs(m.y-P.y)<1.6&&dd>.001){m.vx+=dx/dd*2.2;m.vz+=dz/dd*2.2}}
  const gr0=m.gr;m.gr=false;let blocked=false;
  for(const a of['x','y','z']){const o=m[a],v=m['v'+a];m[a]+=v*dt;
   if(hitW(m.x,m.y,m.z)){
    if(a!='y'&&gr0&&!hitW(m.x,m.y+.5626,m.z)){m.y+=.5626;continue}
    m[a]=o;m['v'+a]=0;if(a=='y'){if(v<0)m.gr=true}else blocked=true}}
  if(blocked&&m.gr&&!m.dead){m.vy=cfg.jump;if(m.st==1&&!fr&&Math.random()<.2)m.tyaw=Math.random()*6.2832}
  m.anim+=m.spd*dt*(cfg.legSpeed||5);
  if(m.y<-20){m.x=SPX;m.z=SPZ;m.y=H;m.vy=0}
  m.x=Math.min(N-.5,Math.max(.5,m.x));m.z=Math.min(N-.5,Math.max(.5,m.z))};
 S.step=dt=>{for(let i=S.mobs.length-1;i>=0;i--){const m=S.mobs[i];
  if(Math.abs(m.x-P.x)>VIEW||Math.abs(m.z-P.z)>VIEW)continue;
  S.think(m,dt);if(m.dead&&m.dead<=0)S.mobs.splice(i,1)}};
 window['MOBS_'+cfg.name]=S.mobs;
 return S}

// ---------- desenho: um laço para todas as espécies ----------
let lastT=performance.now();
function drawAll(MV,e,now){
 const dt=PAUSED()?0:Math.min(.05,(now-lastT)/1000);lastT=now;
 const d=dirv(),far=Math.min(CFG.rd*16,VIEW);let used=false;
 for(const S of species){if(dt)S.step(dt);
  S.buf.length=0;
  for(const m of S.mobs){const dx=m.x-e[0],dy=m.y+.5-e[1],dz=m.z-e[2],dist=Math.hypot(dx,dy,dz);
   if(dist>far)continue;if(dist>2&&(dx*d[0]+dy*d[1]+dz*d[2])/dist<-.35)continue;S.emit(S.buf,m)}}
 if(!species.some(S=>S.buf.length))return;
 gl.useProgram(pp);gl.uniformMatrix4fv(uM,false,MV);
 const f=gl.getUniform(PROG,uF),c=gl.getUniform(PROG,uFC);gl.uniform2f(uF2,f[0],f[1]);gl.uniform3f(uFC2,c[0],c[1],c[2]);gl.uniform1f(uB2,CFG.bri);
 gl.activeTexture(gl.TEXTURE0);gl.uniform1i(uU,0);
 gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);gl.depthMask(true);gl.enable(gl.DEPTH_TEST);
 for(let i=0;i<4;i++)gl.enableVertexAttribArray(i);
 for(const S of species){if(!S.buf.length)continue;
  gl.bindTexture(gl.TEXTURE_2D,S.tex);gl.bindBuffer(gl.ARRAY_BUFFER,S.vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(S.buf),gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(0,3,gl.FLOAT,false,28,0);gl.vertexAttribPointer(1,2,gl.FLOAT,false,28,12);gl.vertexAttribPointer(2,1,gl.FLOAT,false,28,20);gl.vertexAttribPointer(3,1,gl.FLOAT,false,28,24);
  gl.drawArrays(gl.TRIANGLES,0,S.buf.length/7)}
 gl.disableVertexAttribArray(3);
 gl.bindTexture(gl.TEXTURE_2D,tex);gl.useProgram(PROG)}

const oldEnd=window.PPend;
window.PPend=function(MV,e,w,h){try{drawAll(MV,e,performance.now())}catch(err){console.warn('animais:',err)}return oldEnd(MV,e,w,h)};

// ---------- bater nos animais (captura o clique antes de quebrar bloco) ----------
addEventListener('mousedown',ev=>{
 if(ev.button!=0||!locked||PAUSED())return;
 const o=[P.x,P.y+1.62,P.z],d=dirv();let best=null,bt=3.6,bS=null;
 for(const S of species){const hb=S.cfg.hit;
  for(const m of S.mobs){if(m.dead)continue;
   const mn=[m.x-hb[0],m.y,m.z-hb[0]],mx=[m.x+hb[0],m.y+hb[1],m.z+hb[0]];let t0=0,t1=bt,ok=true;
   for(let i=0;i<3;i++){if(Math.abs(d[i])<1e-6){if(o[i]<mn[i]||o[i]>mx[i]){ok=false;break}}
    else{let a=(mn[i]-o[i])/d[i],b=(mx[i]-o[i])/d[i];if(a>b)[a,b]=[b,a];t0=Math.max(t0,a);t1=Math.min(t1,b);if(t0>t1){ok=false;break}}}
   if(ok&&t0<bt){bt=t0;best=m;bS=S}}}
 if(!best)return;
 if(tg){const bx=tg.b[0]+.5-o[0],by=tg.b[1]+.5-o[1],bz=tg.b[2]+.5-o[2];if(Math.hypot(bx,by,bz)-.7<bt)return}
 ev.stopImmediatePropagation();ev.preventDefault();
 const dx=best.x-P.x,dz=best.z-P.z,dd=Math.hypot(dx,dz)||1;
 best.hp-=3;best.hurt=.4;best.flee=4;best.st=1;best.tyaw=Math.atan2(dx,dz);best.kx=dx/dd*5;best.kz=dz/dd*5;best.vy=5;best.gr=false;
 if(best.hp<=0)best.dead=.5},true);

// converte uma caixa [x,y,z,larg,alt,prof] em pixels (como nos arquivos villager.html/iron_golem.html) numa parte do motor; mv = animação (leg/rx/hd/atk)
const boxPart=(p,k,mv)=>{const g=p.inflate||0,[bx,by,bz,w,h,d]=p.box,[tu,tv]=p.tex;
 return Object.assign({B:[(bx-g)*k,(by-g)*k,(bz-g)*k,(bx+w+g)*k,(by+h+g)*k,(bz+d+g)*k],py:p.pivot[1]*k,pz:p.pivot[2]*k,
  uv:[[tu+d,tv+d,w,h],[tu+2*d+w,tv+d,w,h],[tu+d,tv,w,d],[tu+d+w,tv,w,d],[tu+d+w,tv+d,d,h],[tu,tv+d,d,h]]},mv||{})};
return{define,species,boxPart}
})();
