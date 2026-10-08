// ---------- Shaders: sombras do sol, AO, bloom, raios de luz, tonemap ----------
const PP={ok:false,on:0,w:0,h:0,fc:0,sS:0};
(()=>{const ext=gl.getExtension('WEBGL_depth_texture');
const prog=(vs,fs,at)=>{const p=gl.createProgram(),s=(t,c)=>{const o=gl.createShader(t);gl.shaderSource(o,c);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.warn(gl.getShaderInfoLog(o));return o};
 gl.attachShader(p,s(gl.VERTEX_SHADER,vs));gl.attachShader(p,s(gl.FRAGMENT_SHADER,fs));at.forEach((a,i)=>gl.bindAttribLocation(p,i,a));gl.linkProgram(p);return p};
const FV='attribute vec2 a;varying vec2 uv;void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
const sp=prog('attribute vec3 p;attribute vec2 t;uniform mat4 m;varying vec2 v;void main(){gl_Position=m*vec4(p,1.);v=t;}','precision mediump float;uniform sampler2D u;varying vec2 v;void main(){if(texture2D(u,v).a<.1)discard;gl_FragColor=vec4(1.);}',['p','t']);
const pB=prog(FV,'precision mediump float;uniform sampler2D uC,uD;varying vec2 uv;void main(){vec3 c=texture2D(uC,uv).rgb;if(texture2D(uD,uv).r>.99999)c=vec3(0.);float l=dot(c,vec3(.333));gl_FragColor=vec4(c*smoothstep(.55,.9,l),1.);}',['a']);
const pK=prog(FV,'precision mediump float;uniform sampler2D uC;uniform vec2 uD;varying vec2 uv;void main(){vec3 s=texture2D(uC,uv).rgb*.227;s+=(texture2D(uC,uv+uD*1.3846).rgb+texture2D(uC,uv-uD*1.3846).rgb)*.3162;s+=(texture2D(uC,uv+uD*3.2308).rgb+texture2D(uC,uv-uD*3.2308).rgb)*.0703;gl_FragColor=vec4(s,1.);}',['a']);
const pF=prog(FV,`precision highp float;uniform sampler2D uC,uD,uB,uA;uniform vec2 uR;uniform vec3 uSun;uniform float uL,uAO,uAN,uBL,uGR,uNS,uEx,uSat,uVg,uP;varying vec2 uv;
float lin(float d){return 20./(100.1-(2.*d-1.)*99.9);}
void main(){vec2 px=1./uR;float asp=uR.x/uR.y;vec3 c=texture2D(uC,uv).rgb;float d=texture2D(uD,uv).r;bool sky=d>.99999;vec3 W=vec3(.299,.587,.114);
 if(uL>1.5){vec3 a=texture2D(uC,uv+vec2(px.x,0.)).rgb,b=texture2D(uC,uv-vec2(px.x,0.)).rgb,e=texture2D(uC,uv+vec2(0.,px.y)).rgb,f=texture2D(uC,uv-vec2(0.,px.y)).rgb;
  c=mix(c,(a+b+e+f+c)*.2,clamp((abs(dot(a-b,W))+abs(dot(e-f,W)))*3.,0.,.7));}
 if(uAO>0.&&!sky)c*=mix(1.,texture2D(uA,uv).r,uAO);
 c+=texture2D(uB,uv).rgb*uBL;
 if(uSun.z>0.){float sd=length((uv-uSun.xy)*vec2(asp,1.));float gw=exp(-sd*6.)*.5+exp(-sd*28.)*.5;
  if(sky)c+=vec3(1.,.88,.6)*(gw*.55+smoothstep(.045,.035,sd)*1.5);else c+=vec3(1.,.9,.7)*gw*.07;
  if(uGR>0.){vec2 dl=(uSun.xy-uv)/uNS*.9,p=uv;float il=0.,dc=1.;for(int i=0;i<40;i++){if(float(i)>=uNS)break;p+=dl;il+=(texture2D(uD,p).r>.99999?1.:0.)*dc;dc*=.965;}
   c+=vec3(1.,.85,.6)*il/uNS*uGR*(1.-clamp(sd*1.2,0.,1.));}}
 c*=uEx;c=(c*(2.51*c+.03))/(c*(2.43*c+.59)+.14);c=mix(vec3(dot(c,W)),c,uSat);vec2 q=uv-.5;c*=1.-dot(q,q)*uVg;gl_FragColor=vec4(c,1.);}`,['a']);
const pA=prog(FV,`precision highp float;uniform sampler2D uD;uniform vec2 uR;uniform float uAN,uP;varying vec2 uv;
float lin(float d){return 20./(100.1-(2.*d-1.)*99.9);}
void main(){float d=texture2D(uD,uv).r;if(d>.99999){gl_FragColor=vec4(1.);return;}
 float asp=uR.x/uR.y,zc=lin(d),R=.6,oc=0.;vec2 rad=vec2(R*uP/(zc*asp),R*uP/zc)*.5;vec2 g=mod(gl_FragCoord.xy,4.);float n=fract((g.x*4.+g.y)*.618034)*6.2832;
 for(int i=0;i<16;i++){if(float(i)>=uAN)break;float a=float(i)*2.39996+n,r=sqrt((float(i)+.5)/uAN);float dz=zc-lin(texture2D(uD,uv+vec2(cos(a),sin(a))*r*rad).r);if(dz>.06&&dz<R*2.)oc+=1.-dz/(R*3.);}
 gl_FragColor=vec4(vec3(clamp(1.-oc/uAN*1.3,.4,1.)),1.);}`,['a']);
const pAB=prog(FV,`precision highp float;uniform sampler2D uA,uD;uniform vec2 uR;varying vec2 uv;
float lin(float d){return 20./(100.1-(2.*d-1.)*99.9);}
void main(){vec2 px=1./uR;float zc=lin(texture2D(uD,uv).r),s=0.,w=0.;
 for(int i=-2;i<2;i++)for(int j=-2;j<2;j++){vec2 o=uv+vec2(float(i),float(j))*px;float k=abs(lin(texture2D(uD,o).r)-zc)<.25+zc*.02?1.:0.;s+=texture2D(uA,o).r*k;w+=k;}
 gl_FragColor=vec4(vec3(s/max(w,1.)),1.);}`,['a']);
const FB=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,FB);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const T=(w,h,f,ty,fl)=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,f,w,h,0,f,ty,null);
 for(const k of[gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,k,fl);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t};
const F=(c,d)=>{const f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,c,0);if(d)gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,d,0);return f};
const bt=(u,t)=>{gl.activeTexture(gl.TEXTURE0+u);gl.bindTexture(gl.TEXTURE_2D,t)};
const U1=(p,n,v)=>gl.uniform1f(gl.getUniformLocation(p,n),v),U2=(p,n,a,b)=>gl.uniform2f(gl.getUniformLocation(p,n),a,b);
const fs=p=>{gl.useProgram(p);gl.bindBuffer(gl.ARRAY_BUFFER,FB);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,3)};
// luz do sol
const Ld=[.45,.8,.35],ll=Math.hypot(...Ld),Ls=Ld.map(v=>v/ll);
const z0=Ls,x0=(()=>{const a=[z0[2],0,-z0[0]],l=Math.hypot(a[0],a[2]);return[a[0]/l,0,a[2]/l]})(),y0=[z0[1]*x0[2]-z0[2]*x0[1],z0[2]*x0[0]-z0[0]*x0[2],z0[0]*x0[1]-z0[1]*x0[0]],dt=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const R=68,fN=1,fF=170;let LM,lc=[-1e9,-1e9];
// a matriz de luz é recentrada ao redor do jogador (mundo grande)
function setLM(cx,cz){const cn=[cx,14,cz],ey=cn.map((v,i)=>v+Ls[i]*75);
 const LV=[x0[0],y0[0],z0[0],0,x0[1],y0[1],z0[1],0,x0[2],y0[2],z0[2],0,-dt(x0,ey),-dt(y0,ey),-dt(z0,ey),1];
 LM=mul2([1/R,0,0,0,0,1/R,0,0,0,0,-2/(fF-fN),0,0,0,-(fF+fN)/(fF-fN),1],LV)}
setLM(N/2,N/2);
function mul2(A,B){const o=[];for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=A[r]*B[c*4]+A[4+r]*B[c*4+1]+A[8+r]*B[c*4+2]+A[12+r]*B[c*4+3];return o}
if(!ext||!pF)return;
gl.useProgram(pg);gl.uniform1i(gl.getUniformLocation(pg,'uSM'),1);
// textura de sombra "vazia" até o primeiro uso
gl.activeTexture(gl.TEXTURE1);const dummy=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,dummy);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));gl.activeTexture(gl.TEXTURE0);
let sT,sF,sR,bT=[],bF=[],cT,dT,sceneF,aT=[],aF=[];
function size(w,h){if(PP.w==w&&PP.h==h)return;PP.w=w;PP.h=h;gl.activeTexture(gl.TEXTURE7);[cT,dT,...bT,...aT].forEach(t=>t&&gl.deleteTexture(t));
 cT=T(w,h,gl.RGBA,gl.UNSIGNED_BYTE,gl.LINEAR);dT=T(w,h,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,gl.NEAREST);sceneF=F(cT,dT);
 const hw=Math.max(1,w>>1),hh=Math.max(1,h>>1);bT=[T(hw,hh,gl.RGBA,gl.UNSIGNED_BYTE,gl.LINEAR),T(hw,hh,gl.RGBA,gl.UNSIGNED_BYTE,gl.LINEAR)];bF=bT.map(t=>F(t));aT=[T(w,h,gl.RGBA,gl.UNSIGNED_BYTE,gl.NEAREST),T(w,h,gl.RGBA,gl.UNSIGNED_BYTE,gl.NEAREST)];aF=aT.map(t=>F(t));gl.activeTexture(gl.TEXTURE0)}
function shadowTex(S){if(PP.sS==S)return;PP.sS=S;if(sT)gl.deleteTexture(sT);gl.activeTexture(gl.TEXTURE1);
 sT=T(S,S,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,gl.NEAREST);sR=sR||gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,sR);gl.renderbufferStorage(gl.RENDERBUFFER,gl.RGBA4,S,S);
 sF=sF||gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,sF);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.RENDERBUFFER,sR);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,sT,0);
 gl.bindTexture(gl.TEXTURE_2D,sT);gl.activeTexture(gl.TEXTURE0);PP.fc=0}
function shadowPass(S){shadowTex(S);if(PP.fc++%6)return;
 {const sx=Math.round(P.x/16)*16,sz=Math.round(P.z/16)*16;if(sx!=lc[0]||sz!=lc[1]){lc=[sx,sz];setLM(sx,sz)}}
 gl.bindFramebuffer(gl.FRAMEBUFFER,sF);gl.viewport(0,0,S,S);gl.clear(gl.DEPTH_BUFFER_BIT);gl.colorMask(false,false,false,false);
 gl.useProgram(sp);gl.uniformMatrix4fv(gl.getUniformLocation(sp,'m'),false,LM);gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1.5,3);
 for(const[b,n]of[[SB,sn],[PB,pn]]){gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(1,2,gl.FLOAT,false,24,12);gl.drawArrays(gl.TRIANGLES,0,n)}
 gl.disable(gl.POLYGON_OFFSET_FILL);gl.colorMask(true,true,true,true)}
window.PPbegin=(w,h)=>{const L=CFG.sh>0?CFG.sh:0;PP.on=L;gl.useProgram(pg);
 if(!L){gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.uniform1f(gl.getUniformLocation(pg,'uSO'),0);return}
 size(w,h);const S=L==3?4096:2048;
 if(L>=2){shadowPass(S);gl.useProgram(pg);gl.uniformMatrix4fv(gl.getUniformLocation(pg,'uL'),false,LM);U1(pg,'uSO',1);U1(pg,'uSZ',S);U1(pg,'uPC',L==3?2:1)}else U1(pg,'uSO',0);
 gl.bindFramebuffer(gl.FRAMEBUFFER,sceneF);gl.useProgram(pg)};
window.PPend=(MV,e,w,h)=>{const L=PP.on;if(!L)return;gl.disable(gl.DEPTH_TEST);
 const q=[[0,0,0,.22,0,0,1,1.1,.5],[0,8,.8,.4,.25,24,1.08,1.18,.6],[0,16,1,.6,.5,40,1.15,1.25,.7]][L-1];
 const hw=Math.max(1,w>>1),hh=Math.max(1,h>>1);
 if(q[2]>0){const fo=1/Math.tan(CFG.fov*Math.PI/360);gl.bindFramebuffer(gl.FRAMEBUFFER,aF[0]);gl.viewport(0,0,w,h);bt(3,dT);
  gl.useProgram(pA);gl.uniform1i(gl.getUniformLocation(pA,'uD'),3);U2(pA,'uR',w,h);U1(pA,'uAN',q[1]);U1(pA,'uP',fo);fs(pA);
  gl.bindFramebuffer(gl.FRAMEBUFFER,aF[1]);bt(5,aT[0]);gl.useProgram(pAB);gl.uniform1i(gl.getUniformLocation(pAB,'uA'),5);gl.uniform1i(gl.getUniformLocation(pAB,'uD'),3);U2(pAB,'uR',w,h);fs(pAB)}
 gl.bindFramebuffer(gl.FRAMEBUFFER,bF[0]);gl.viewport(0,0,hw,hh);bt(2,cT);bt(3,dT);
 gl.useProgram(pB);gl.uniform1i(gl.getUniformLocation(pB,'uC'),2);gl.uniform1i(gl.getUniformLocation(pB,'uD'),3);fs(pB);
 for(let k=0;k<(L==3?2:1);k++){gl.useProgram(pK);gl.uniform1i(gl.getUniformLocation(pK,'uC'),4);
  gl.bindFramebuffer(gl.FRAMEBUFFER,bF[1]);bt(4,bT[0]);U2(pK,'uD',1.5/hw,0);fs(pK);
  gl.bindFramebuffer(gl.FRAMEBUFFER,bF[0]);bt(4,bT[1]);U2(pK,'uD',0,1.5/hh);fs(pK)}
 gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,w,h);bt(2,cT);bt(3,dT);bt(4,bT[0]);bt(5,aT[1]);
 const P=pF;gl.useProgram(P);gl.uniform1i(gl.getUniformLocation(P,'uA'),5);['uC','uD','uB'].forEach((n,i)=>gl.uniform1i(gl.getUniformLocation(P,n),2+i));
 const sx=e[0]+Ls[0]*50,sy=e[1]+Ls[1]*50,sz=e[2]+Ls[2]*50,cl=r=>MV[r]*sx+MV[4+r]*sy+MV[8+r]*sz+MV[12+r],cw=cl(3);
 gl.uniform3f(gl.getUniformLocation(P,'uSun'),cw>0?cl(0)/cw*.5+.5:0,cw>0?cl(1)/cw*.5+.5:0,cw>0?1:0);
 U2(P,'uR',w,h);U1(P,'uL',L);U1(P,'uP',1/Math.tan(CFG.fov*Math.PI/360));
 [['uAO',q[2]],['uAN',q[1]||8],['uBL',q[3]],['uGR',q[4]],['uNS',q[5]||1],['uEx',q[6]],['uSat',q[7]],['uVg',q[8]]].forEach(([n,v])=>U1(P,n,v));
 fs(P);gl.enable(gl.DEPTH_TEST);gl.activeTexture(gl.TEXTURE0);gl.useProgram(pg);PP.ok=true};
PP.ok=true;
})();
if(!PP.ok)window.PPbegin=window.PPend=()=>{};
