// ---------- Fogo na tela (efeito "Doom fire" em baixa resolução) ----------
window.FIRE=(()=>{
const W=64,Hh=36,cv=document.createElement('canvas');cv.width=W;cv.height=Hh;
cv.style.cssText='position:fixed;left:0;right:0;bottom:0;width:100%;height:64%;z-index:4;pointer-events:none;image-rendering:pixelated;display:none';
const tint=document.createElement('div');
tint.style.cssText='position:fixed;inset:0;z-index:4;pointer-events:none;opacity:0;transition:opacity .35s;box-shadow:inset 0 0 14vmin 5vmin rgba(255,60,0,.6);background:rgba(255,70,0,.12)';
document.body.append(tint,cv);
const x=cv.getContext('2d'),img=x.createImageData(W,Hh),f=new Uint8Array(W*Hh);
const pal=[[7,7,7],[31,7,7],[47,15,7],[71,15,7],[87,23,7],[103,31,7],[119,31,7],[143,39,7],[159,47,7],[175,63,7],[191,71,7],[199,71,7],[223,79,7],[223,87,7],[223,87,7],[215,95,7],[215,103,15],[207,111,15],[207,119,15],[207,127,15],[207,135,23],[199,135,23],[199,143,23],[199,151,31],[191,159,31],[191,159,31],[191,167,39],[191,167,39],[191,175,47],[183,175,47],[183,183,47],[183,183,55],[207,207,111],[223,223,159],[239,239,199],[255,255,255]],MX=pal.length-1;
let on=false;
setInterval(()=>{
 const base=(Hh-1)*W;for(let i=0;i<W;i++)f[base+i]=on?MX:Math.max(0,f[base+i]-2);
 for(let i=0;i<W;i++)for(let j=0;j<Hh-1;j++){const s=j*W+i,d=(Math.random()*3)|0,v=f[s+W]-d;f[Math.max(0,s-d)]=v>0?v:0}
 let any=false;
 for(let i=0;i<W*Hh;i++){const v=f[i],o=i*4;if(v){any=true;const c=pal[v];img.data[o]=c[0];img.data[o+1]=c[1];img.data[o+2]=c[2];img.data[o+3]=Math.min(255,v*24)}else img.data[o+3]=0}
 cv.style.display=any||on?'block':'none';if(any||on)x.putImageData(img,0,0)},55);
return{set(v){if(v!==on){on=v;tint.style.opacity=v?1:0}}}
})();
