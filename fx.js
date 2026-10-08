// ---------- Efeitos: coordenadas e nuvens ----------
const CO=document.createElement('div');
CO.style.cssText='position:fixed;left:8px;top:calc(env(safe-area-inset-top,0px) + 8px);z-index:6;color:#fff;font:20px "VT323",monospace;text-shadow:2px 2px #000;display:none;pointer-events:none';
document.body.append(CO);
const uT=gl.getUniformLocation(pg,'uT'),uW=gl.getUniformLocation(pg,'uW'),uF=gl.getUniformLocation(pg,'uF'),uR=gl.getUniformLocation(pg,'uR'),uB=gl.getUniformLocation(pg,'uB'),uS=gl.getUniformLocation(pg,'uS'),uFC=gl.getUniformLocation(pg,'uFC');
const cpg=gl.createProgram(),csh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
gl.attachShader(cpg,csh(gl.VERTEX_SHADER,'attribute vec3 p;attribute float s;uniform mat4 m;uniform vec3 o;varying float k;void main(){gl_Position=m*vec4(p+o,1.);k=s;}'));
gl.attachShader(cpg,csh(gl.FRAGMENT_SHADER,'precision mediump float;varying float k;void main(){gl_FragColor=vec4(vec3(k),.85);}'));
gl.bindAttribLocation(cpg,0,'p');gl.bindAttribLocation(cpg,1,'s');gl.linkProgram(cpg);
const cM=gl.getUniformLocation(cpg,'m'),cO=gl.getUniformLocation(cpg,'o');
const CB=gl.createBuffer();let cn=0;
(()=>{const G=64,S=8,Y=H+10,T=3,on=(i,j)=>{i=(i+G)%G;j=(j+G)%G;return Math.abs(Math.sin(i*12.9898+j*78.233)*43758.5453%1)<.38},D=[];
 const q=(a,s)=>{for(const v of a)D.push(v[0],v[1],v[2],s)};
 for(let i=0;i<G;i++)for(let j=0;j<G;j++){if(!on(i,j))continue;const x0=i*S,x1=x0+S,z0=j*S,z1=z0+S,y0=Y,y1=Y+T;
  q([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z0],[x1,y1,z1],[x0,y1,z1]],1);
  q([[x0,y0,z0],[x1,y0,z1],[x1,y0,z0],[x0,y0,z0],[x0,y0,z1],[x1,y0,z1]],.74);
  if(!on(i-1,j))q([[x0,y0,z0],[x0,y1,z1],[x0,y1,z0],[x0,y0,z0],[x0,y0,z1],[x0,y1,z1]],.86);
  if(!on(i+1,j))q([[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z0],[x1,y1,z1],[x1,y0,z1]],.86);
  if(!on(i,j-1))q([[x0,y0,z0],[x1,y1,z0],[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0]],.92);
  if(!on(i,j+1))q([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y0,z1],[x1,y1,z1],[x0,y1,z1]],.92)}
 gl.bindBuffer(gl.ARRAY_BUFFER,CB);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(D),gl.STATIC_DRAW);cn=D.length/4})();
function drawClouds(MV,t){gl.useProgram(cpg);gl.uniformMatrix4fv(cM,false,MV);gl.bindBuffer(gl.ARRAY_BUFFER,CB);
 gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(0,3,gl.FLOAT,false,16,0);gl.vertexAttribPointer(1,1,gl.FLOAT,false,16,12);
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
 const ox=-40+(t*.7)%512;for(const dx of[0,-512]){gl.uniform3f(cO,ox+dx,0,-64);gl.drawArrays(gl.TRIANGLES,0,cn)}
 gl.depthMask(true);gl.disable(gl.BLEND);gl.useProgram(pg)}
