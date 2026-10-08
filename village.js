// ---------- Vila do Sumon Craft ----------
// Carregue DEPOIS de game.js e chest.js e ANTES de mob.js.
// Acha um terreno firme perto do nascimento, aplaina, constrói a vila e leva o jogador até ela.
(()=>{
const OK=[0,1,2,3,7];let best=null;
for(let r=44;r<=120;r+=6)for(let a=0;a<24;a++){
 const ang=a/24*6.2832+r*.37,cx=Math.round(SPX+Math.cos(ang)*r),cz=Math.round(SPZ+Math.sin(ang)*r);
 if(cx<40||cz<40||cx>N-41||cz>N-41)continue;
 const hs=[];let bad=0;
 for(let dx=-30;dx<=30;dx+=5)for(let dz=-30;dz<=30;dz+=5){const x=cx+dx,z=cz+dz,h=HM[x][z];
  if(h<=SEA+1||!OK.includes(BM[x][z])||get(x,h+1,z)==78)bad++;hs.push(h)}
 const s=[...hs].sort((p,q)=>p-q),md=s[s.length>>1],dev=hs.reduce((t,h)=>t+Math.abs(h-md),0)/hs.length,
  sc=bad*50+dev*4+Math.max(0,md-26)*5+r*.05;
 if(!best||sc<best.sc)best={cx,cz,gy:Math.min(H-22,Math.max(SEA+2,md)),sc}}
if(!best)return;
const{cx,cz,gy}=best;window.VILLAGE={cx,cz,gy};
const wasFlow=FLOWON;FLOWON=false;

// ---------- 1) aplainar o terreno (núcleo plano + borda suave) e limpar árvores ----------
const R0=24,R1=31;
for(let dx=-R1;dx<=R1;dx++)for(let dz=-R1;dz<=R1;dz++){
 const x=cx+dx,z=cz+dz,d=Math.max(Math.abs(dx),Math.abs(dz)),h=HM[x][z],
  t=d<=R0?gy:Math.round(gy+(h-gy)*(d-R0)/(R1-R0));
 for(let y=t+1,top=Math.min(H-1,Math.max(h,t)+18);y<=top;y++){const q=get(x,y,z);if(q&&q!=78)put(x,y,z,0)}
 for(let y=h+1;y<t-3;y++)put(x,y,z,2);
 put(x,t,z,1);for(let k=1;k<=3;k++)put(x,t-k,z,2);
 HM[x][z]=t}

// ---------- 2) ferramentas de construção (coordenadas relativas ao centro; y=0 é o chão) ----------
const B=(x,y,z,b)=>put(cx+x,gy+y,cz+z,b),Bm=(x,y,z,b,m)=>putm(cx+x,gy+y,cz+z,b,m),
 F=(x0,y0,z0,x1,y1,z1,b)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)for(let z=Math.min(z0,z1);z<=Math.max(z0,z1);z++)B(x,y,z,b)};
const MAT={oak:{p:5,l:8,s:88,sl:85},birch:{p:92,l:93,s:99,sl:97},acacia:{p:95,l:96,s:100,sl:98},cherry:{p:105,l:104,s:107,sl:106},
 stone:{p:6,l:8,s:89,sl:86},cobble:{p:7,l:8,s:90,sl:87}};
const road=(x0,z0,x1,z1)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)for(let z=Math.min(z0,z1);z<=Math.max(z0,z1);z++)B(x,0,z,wHash(cx+x,cz+z)<.12?7:128)};
const lamp=(x,z)=>{F(x,1,z,x,3,z,8);B(x,4,z,123)};
const putDoor=(x,z,side)=>{const f={N:0,S:1,E:3,W:2}[side];B(x,1,z,0);B(x,2,z,0);Bm(x,1,z,80,f);Bm(x,2,z,81,f)};
const bed=(x,z,f)=>{const e=HD[f];Bm(x,1,z,79,f);Bm(x+e[0],1,z+e[2],84,f)};
const LOOT=[5,8,7,127,126,123,117,138,139,128,92,95,105,93,11,12,13,16,30,114];
const chest=(x,z,f)=>{Bm(x,1,z,140,f);const a=Array(27).fill(0);for(let i=0;i<9;i++)a[Math.random()*27|0]=LOOT[Math.random()*LOOT.length|0];CH.set(((cx+x)*H+gy+1)*N+cz+z,a)};

// telhado de duas águas (cumeeira ao longo de z), maciço por dentro
function roof(x0,z0,w,d,h,m){
 for(let k=0;;k++){const l=x0-1+k,r=x0+w-k;if(l>r)break;const y=h+1+k;
  for(let x=l+1;x<=r-1;x++)for(let z=z0;z<z0+d;z++)B(x,y,z,m.p);
  for(let z=z0-1;z<=z0+d;z++){if(l==r)B(l,y,z,m.p);else{Bm(l,y,z,m.s,2);Bm(r,y,z,m.s,3)}}}}
function house(o){const{x0,z0,w,d,h,m,door,inside}=o,wall=o.wall||m.p,x1=x0+w-1,z1=z0+d-1;
 F(x0,0,z0,x1,0,z1,o.floor||m.p);
 for(let y=1;y<=h;y++)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)if(x==x0||x==x1||z==z0||z==z1)B(x,y,z,wall);
 for(const[x,z]of[[x0,z0],[x1,z0],[x0,z1],[x1,z1]])F(x,1,z,x,h,z,m.l);
 F(x0,0,z0,x1,0,z0,7);F(x0,0,z1,x1,0,z1,7);F(x0,0,z0,x0,0,z1,7);F(x1,0,z0,x1,0,z1,7);
 for(let y=2;y<=h-1;y++){for(const x of[x0+1,x1-1])for(const z of[z0,z1])B(x,y,z,15);for(const z of[z0+2,z1-2])for(const x of[x0,x1])B(x,y,z,15)}
 putDoor(door=='N'||door=='S'?x0+(w>>1):door=='E'?x1:x0,door=='N'?z0:door=='S'?z1:z0+(d>>1),door);
 roof(x0,z0,w,d,h,m);
 if(inside)inside({x0,z0,x1,z1,h})}

// ---------- 3) ruas, praça e poço ----------
road(-20,-1,20,1);road(-1,-13,1,18);road(-3,-3,3,3);
F(-1,0,-1,1,0,1,7);B(0,0,0,78);B(0,-1,0,78);                 // base do poço + água
for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)if(x||z)B(x,1,z,7);   // murinho
for(const[x,z]of[[-1,-1],[1,-1],[-1,1],[1,1]])F(x,2,z,x,3,z,8);   // postes
F(-1,4,-1,1,4,1,85);                                              // telhadinho
for(const[x,z]of[[-3,-3],[3,-3],[-3,3],[3,3],[-9,2],[9,2],[-17,2],[17,2],[-2,-13],[2,-13],[-2,12],[2,12]])lamp(x,z);

// ---------- 4) casas ----------
house({x0:-15,z0:-12,w:7,d:8,h:4,m:MAT.birch,door:'S',inside:o=>{bed(o.x0+1,o.z0+1,0);B(o.x1-1,1,o.z0+1,10);chest(o.x1-1,o.z0+2,3);B(o.x0+3,o.h+1,o.z0+3,123)}});
road(-12,-4,-12,-2);
house({x0:7,z0:-13,w:7,d:9,h:4,m:MAT.cherry,door:'S',inside:o=>{bed(o.x0+1,o.z0+1,0);bed(o.x1-1,o.z0+1,0);chest(o.x0+1,o.z0+4,2);B(o.x1-1,1,o.z0+4,10);B(o.x1-1,1,o.z0+5,9);B(o.x0+3,o.h+1,o.z0+4,123)}});
road(10,-4,10,-2);
house({x0:-14,z0:5,w:7,d:7,h:4,m:MAT.acacia,door:'N',inside:o=>{bed(o.x0+1,o.z1-1,1);F(o.x1-1,1,o.z1-1,o.x1-1,2,o.z1-1,126);F(o.x1-1,1,o.z1-2,o.x1-1,2,o.z1-2,126);chest(o.x0+1,o.z0+2,2);B(o.x0+3,o.h+1,o.z0+3,123)}});
road(-11,2,-11,4);
house({x0:8,z0:5,w:5,d:6,h:3,m:MAT.oak,door:'N',inside:o=>{bed(o.x0+1,o.z1-1,1);chest(o.x1-1,o.z1-1,3);B(o.x1-1,1,o.z0+1,10);B(o.x0+2,o.h+1,o.z0+2,123)}});
road(10,2,10,4);
// ferreiro
house({x0:14,z0:4,w:6,d:7,h:4,m:MAT.cobble,wall:7,door:'N',inside:o=>{B(o.x0+1,1,o.z1-1,9);B(o.x0+2,1,o.z1-1,9);B(o.x1-1,1,o.z1-1,10);chest(o.x1-1,o.z1-3,3);B(o.x0+2,o.h+1,o.z0+3,123)}});
road(17,2,17,3);
// prefeitura/biblioteca
house({x0:-4,z0:-22,w:9,d:9,h:5,m:MAT.stone,wall:114,floor:5,door:'S',inside:o=>{F(0,0,o.z0+1,0,0,o.z1-1,30);F(o.x0+1,1,o.z0+1,o.x1-1,3,o.z0+1,126);
  chest(o.x1-1,o.z0+3,3);chest(o.x1-1,o.z0+4,3);B(o.x0+1,1,o.z0+3,10);B(o.x0+1,1,o.z0+4,10);B(0,o.h+1,o.z0+3,123);B(0,o.h+1,o.z1-2,123)}});

// ---------- 5) hortas ----------
for(const xa of[-7,3]){
 for(let z=8;z<=15;z++){B(xa,0,z,2);B(xa+1,0,z,2);B(xa+2,0,z,78);B(xa+3,0,z,2);B(xa+4,0,z,2);
  B(xa,1,z,138);B(xa+4,1,z,139);B(xa+1,1,z,11+(wHash(xa,z)*3|0));B(xa+3,1,z,11+(wHash(z,xa)*3|0))}
 F(xa,0,7,xa+4,0,7,7);F(xa,0,16,xa+4,0,16,7);B(xa+2,0,7,7);B(xa+2,0,16,7)}
F(-9,1,17,-8,2,17,127);B(-9,1,18,127);F(8,1,17,9,1,17,127);

// ---------- 6) barraca de feira ----------
for(const[x,z]of[[15,-5],[18,-5],[15,-3],[18,-3]])F(x,1,z,x,3,z,8);
for(let x=15;x<=18;x++)for(let z=-5;z<=-3;z++)B(x,4,z,x%2?30:16);
F(16,1,-3,17,1,-3,5);B(16,2,-3,139);B(17,2,-3,138);chest(16,-5,0);road(15,-2,18,-2);

// ---------- 7) flores soltas na grama ----------
for(let dx=-R0;dx<=R0;dx++)for(let dz=-R0;dz<=R0;dz++){const x=cx+dx,z=cz+dz;
 if(get(x,gy,z)==1&&!get(x,gy+1,z)&&wHash(x*7+3,z*13+5)<.05)put(x,gy+1,z,11+(wHash(x,z)*3|0))}

// ---------- 8) nascer na vila ----------
FLOWON=wasFlow;
SPX=cx+.5;SPZ=cz+5.5;P.x=SPX;P.z=SPZ;P.y=gy+1.001;P.vy=0;P.yaw=0;P.pit=-.1;
rebuild();
})();
