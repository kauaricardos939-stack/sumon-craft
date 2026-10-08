// ---------- Laço ----------
const mul=(A,B)=>{const o=[];for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=A[r]*B[c*4]+A[4+r]*B[c*4+1]+A[8+r]*B[c*4+2]+A[12+r]*B[c*4+3];return o};
let last=performance.now();
function frame(now){if(now-last<1000/CFG.fps-2){requestAnimationFrame(frame);return}
 const dt=PAUSED()?0:Math.min(.05,(now-last)/1000);last=now;
 const w=cv.clientWidth*Math.min(devicePixelRatio||1,2)*CFG.scale|0,h=cv.clientHeight*Math.min(devicePixelRatio||1,2)*CFG.scale|0;
 if(cv.width!=w||cv.height!=h){cv.width=w;cv.height=h}
 const LQ=b=>b==78||b==112,fb=get(Math.floor(P.x),Math.floor(P.y+.4),Math.floor(P.z)),wat=LQ(fb),lav=!P.fly&&(fb==112||get(Math.floor(P.x),Math.floor(P.y+.1),Math.floor(P.z))==112||get(Math.floor(P.x),Math.floor(P.y+1.2),Math.floor(P.z))==112);
 if(locked){const f=(K.KeyW?1:0)-(K.KeyS?1:0),r=(K.KeyD?1:0)-(K.KeyA?1:0),sp=P.fly?10:fb==112?1.6:wat?2.6:4.3,sy=Math.sin(P.yaw),cy=Math.cos(P.yaw);
  P.vx=(sy*f+cy*r)*sp;P.vz=(-cy*f+sy*r)*sp;
  if(P.fly)P.vy=((K.Space?1:0)-(K.ShiftLeft?1:0))*sp;else if(wat){const ho=get(Math.floor(P.x),Math.floor(P.y+1.6),Math.floor(P.z))!=fb;P.vy+=((K.Space?(ho?6.5:3.4):-2.2)-P.vy)*Math.min(1,6*dt)}else{P.vy-=26*dt;if(K.Space&&P.gr)P.vy=8.4}}
 else{P.vx=P.vz=0}
 const gr0=P.gr;P.gr=false;
 for(const a of['x','y','z']){const o=P[a],v=P['v'+a];P[a]+=v*dt;if(hit(P.x,P.y,P.z)){if(a!='y'&&gr0&&!P.fly&&!hit(P.x,P.y+.5626,P.z)){P.y+=.5626;continue}const ny=P.y;P[a]=o;P['v'+a]=0;
  if(a=='y'&&v<0){P.gr=true;
   // física do slime: quica ao cair em cima (Shift = pousar sem quicar)
   if(v<-3&&!K.ShiftLeft&&[-.3,.3].some(dx=>[-.3,.3].some(dz=>get(Math.floor(P.x+dx),Math.floor(ny),Math.floor(P.z+dz))==64))){P.vy=-v*.85;P.gr=false}}}}
 if(P.y<-20){P.x=SPX;P.z=SPZ;P.y=H;P.vy=0}
 P.fire=lav?4:fb==78?0:Math.max(0,(P.fire||0)-dt);FIRE.set(P.fire>0);P.burn=lav?(P.burn||0)+dt:0;if(P.burn>2.5){P.burn=0;P.fire=0;P.x=SPX;P.z=SPZ;P.y=H;P.vy=0;const n_=$('nm');n_.textContent='Você queimou na lava!';clearTimeout(nmT);nmT=setTimeout(()=>n_.textContent='',2200)}
 P.x=Math.min(N-.4,Math.max(.4,P.x));P.z=Math.min(N-.4,Math.max(.4,P.z));
 ray();
 const ey_=P.y+1.62,ecx=Math.floor(P.x),ecy=Math.floor(ey_),ecz=Math.floor(P.z),eb_=get(ecx,ecy,ecz),uw=LQ(eb_)&&(get(ecx,ecy+1,ecz)==eb_||ey_-ecy<.875),FCc=uw?(eb_==112?[.62,.16,.02]:[.07,.2,.42]):[.56,.77,.94];
 PPbegin(w,h);gl.viewport(0,0,w,h);{const fe=CFG.rd*3.83;if(uw)gl.uniform2f(uF,eb_==112?.1:.5,eb_==112?3:16);else gl.uniform2f(uF,Math.max(1,fe-18),fe);gl.uniform3f(uFC,FCc[0],FCc[1],FCc[2]);gl.uniform2f(uR,w,h);gl.uniform1f(uB,CFG.bri);gl.uniform1f(uS,CFG.sh);gl.uniform1f(uT,now/1000);gl.uniform1f(uW,[0,1,1.8][CFG.wind])}
 gl.clearColor(FCc[0],FCc[1],FCc[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 const e=[P.x,P.y+1.62,P.z],d=dirv(),z0=[-d[0],-d[1],-d[2]];
 let x0=[z0[2],0,-z0[0]];const l=Math.hypot(x0[0],x0[2])||1;x0=[x0[0]/l,0,x0[2]/l];
 const y0=[z0[1]*x0[2]-z0[2]*x0[1],z0[2]*x0[0]-z0[0]*x0[2],z0[0]*x0[1]-z0[1]*x0[0]],dt3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 const V=[x0[0],y0[0],z0[0],0,x0[1],y0[1],z0[1],0,x0[2],y0[2],z0[2],0,-dt3(x0,e),-dt3(y0,e),-dt3(z0,e),1];
 const a=w/h,f=1/Math.tan(CFG.fov*Math.PI/360),n=.1,fa=100,Pm=[f/a,0,0,0,0,f,0,0,0,0,(fa+n)/(n-fa),-1,0,0,2*fa*n/(n-fa),0];
 const MV=mul(Pm,V);gl.uniformMatrix4fv(mL,false,MV);
 gl.enable(gl.CULL_FACE);bind(SB);gl.drawArrays(gl.TRIANGLES,0,sn);
 gl.disable(gl.CULL_FACE);bind(PB);gl.drawArrays(gl.TRIANGLES,0,pn);
 gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ZERO,gl.ONE);gl.depthMask(false);
 bind(TB);gl.drawArrays(gl.TRIANGLES,0,tn);gl.depthMask(true);gl.disable(gl.BLEND);
 if(CFG.clouds&&!uw)drawClouds(MV,now/1000);
 CO.style.display=CFG.coords?'block':'none';if(CFG.coords)CO.textContent='XYZ: '+P.x.toFixed(1)+' / '+P.y.toFixed(1)+' / '+P.z.toFixed(1)+'  ·  '+(BN[(BM[P.x|0]||[])[P.z|0]]||'');
 if(tg){const[bx,by,bz]=tg.b,o=-.005,c=[[0,0,0],[1,0,0],[1,0,1],[0,0,1],[0,1,0],[1,1,0],[1,1,1],[0,1,1]],E=[0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7],D=[];
  for(const i of E){const v=c[i];D.push(bx+v[0]+(v[0]?-o:o),by+v[1]+(v[1]?-o:o),bz+v[2]+(v[2]?-o:o),16.5/NT,.5,1)}
  bind(LB);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(D),gl.DYNAMIC_DRAW);gl.drawArrays(gl.LINES,0,24)}
 PPend(MV,e,w,h);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
