// ---------- Aldeão do Sumon Craft (modelo do villager.html; usa mob.js — carregue depois de chicken.js) ----------
(()=>{
const TEX_W=64,TEX_H=128,k=.9375/16;   // 1 pixel do modelo = 0,9375/16 de bloco
  const PARTS = [
    { name: 'head',  tex: [0, 0],   box: [-4, 24, -4, 8, 10, 8],  pivot: [0, 24, 0],   group: 'head' },
    { name: 'nose',  tex: [32, 0],  box: [-1, 25, 4, 2, 4, 2],    pivot: [0, 24, 0],   group: 'head' },
    { name: 'body',  tex: [16, 20], box: [-4, 12, -3, 8, 12, 6],  pivot: [0, 12, 0],   group: 'body' },
    { name: 'robe',  tex: [0, 38],  box: [-4, 4, -3, 8, 20, 6],   pivot: [0, 12, 0],   group: 'body', inflate: 0.5 },
    { name: 'armR',  tex: [44, 22], box: [-8, 15, -1, 4, 8, 4],   pivot: [0, 21, 1],   group: 'arms' },
    { name: 'armL',  tex: [44, 22], box: [4, 15, -1, 4, 8, 4],    pivot: [0, 21, 1],   group: 'arms' },
    { name: 'arms',  tex: [32, 40], box: [-4, 15, -1, 8, 4, 4],   pivot: [0, 21, 1],   group: 'arms' },
    { name: 'legR',  tex: [0, 22],  box: [-4, 0, -2, 4, 12, 4],   pivot: [-2, 12, 0],  group: 'legR' },
    { name: 'legL',  tex: [0, 22],  box: [0, 0, -2, 4, 12, 4],    pivot: [2, 12, 0],   group: 'legL' },
    { name: 'brim',  tex: [0, 64],  box: [-8, 33.5, -8, 16, 1, 16], pivot: [0, 24, 0], group: 'head' },
    { name: 'crown', tex: [0, 82],  box: [-4.5, 34, -4.5, 9, 4, 9], pivot: [0, 24, 0], group: 'head' }
  ];


  function faceRects(tu, tv, w, h, d) {
    return {
      front:  [tu + d,         tv + d, w, h],
      back:   [tu + 2 * d + w, tv + d, w, h],
      left:   [tu,             tv + d, d, h],   // face -X
      right:  [tu + d + w,     tv + d, d, h],   // face +X
      top:    [tu + d,         tv,     w, d],
      bottom: [tu + d + w,     tv,     w, d]
    };
  }

  function makeRng(seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  function shade(color, f) {
    // aceita '#rrggbb' ou 'rgb(r,g,b)' (o resultado de shade() pode ser reaproveitado)
    let R, G, B;
    if (color[0] === 'r') {
      [R, G, B] = color.match(/\d+/g).map(Number);
    } else {
      const n = parseInt(color.slice(1), 16);
      R = (n >> 16) & 255; G = (n >> 8) & 255; B = n & 255;
    }
    const r = Math.max(0, Math.min(255, R * f)) | 0;
    const g = Math.max(0, Math.min(255, G * f)) | 0;
    const b = Math.max(0, Math.min(255, B * f)) | 0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function makeTexture() {
    const cv = document.createElement('canvas');
    cv.width = TEX_W; cv.height = TEX_H;
    const ctx = cv.getContext('2d');
    const rnd = makeRng(1337);

    const SKIN = '#b98a67', SKIN_D = '#a07250', INNER = '#8a6b47';
    const ROBE = '#6f4e2e', ROBE_D = '#563b22', LEG = '#4c3620', SLEEVE = '#654528';

    const fillRect = (r, base, noise) => {
      for (let y = 0; y < r[3]; y++) for (let x = 0; x < r[2]; x++) {
        ctx.fillStyle = shade(base, 1 - noise / 2 + rnd() * noise);
        ctx.fillRect(r[0] + x, r[1] + y, 1, 1);
      }
    };
    const dot = (r, x, y, color) => {
      ctx.fillStyle = color; ctx.fillRect(r[0] + x, r[1] + y, 1, 1);
    };
    const paintBox = (tex, w, h, d, base, noise) => {
      const R = faceRects(tex[0], tex[1], w, h, d);
      for (const k in R) fillRect(R[k], base, noise);
      return R;
    };

    // cabeça
    const H = paintBox([0, 0], 8, 10, 8, SKIN, 0.12);
    for (let x = 1; x <= 6; x++) dot(H.front, x, 3, '#35261a');          // monocelha
    dot(H.front, 0, 3, '#4a3523'); dot(H.front, 7, 3, '#4a3523');
    dot(H.front, 1, 4, '#ffffff'); dot(H.front, 2, 4, '#3f7a3a');        // olho esquerdo
    dot(H.front, 5, 4, '#3f7a3a'); dot(H.front, 6, 4, '#ffffff');        // olho direito
    dot(H.front, 1, 5, SKIN_D);    dot(H.front, 6, 5, SKIN_D);
    dot(H.front, 3, 8, '#8a5c43'); dot(H.front, 4, 8, '#8a5c43');        // boca

    // nariz
    paintBox([32, 0], 2, 4, 2, SKIN_D, 0.1);

    // corpo por baixo da túnica
    paintBox([16, 20], 8, 12, 6, INNER, 0.1);

    // túnica
    const T = paintBox([0, 38], 8, 20, 6, ROBE, 0.14);
    for (const k of ['front', 'back']) {
      for (let y = 0; y < 20; y++) { dot(T[k], 3, y, ROBE_D); dot(T[k], 4, y, ROBE_D); }
    }
    for (const k in T) {
      const r = T[k];
      for (let x = 0; x < r[2]; x++) {
        dot(r, x, r[3] - 1, ROBE_D); dot(r, x, r[3] - 2, ROBE_D);        // barra
        dot(r, x, 8, shade(ROBE, 0.85)); dot(r, x, 14, shade(ROBE, 0.85)); // dobras
      }
    }

    // pernas
    paintBox([0, 22], 4, 12, 4, LEG, 0.1);

    // braços cruzados: mangas nos dois ombros + antebraços na frente
    const AU = paintBox([44, 22], 4, 8, 4, SLEEVE, 0.14);
    fillRect(AU.top, shade(SLEEVE, 1.12), 0.1);
    for (const k of ['front', 'back', 'left', 'right']) for (let x = 0; x < AU[k][2]; x++) dot(AU[k], x, 7, shade(SLEEVE, 0.78)); // punho
    const A = paintBox([32, 40], 8, 4, 4, SLEEVE, 0.14);
    fillRect(A.top, shade(SLEEVE, 1.12), 0.1);
    for (let y = 0; y < 4; y++) { dot(A.front, 3, y, ROBE_D); dot(A.front, 4, y, ROBE_D); }   // onde os braços se cruzam
    for (let x = 0; x < 8; x++) { dot(A.front, x, 0, shade(SLEEVE, 0.85)); dot(A.front, x, 3, shade(SLEEVE, 0.8)); }

    // chapéu de palha (fazendeiro)
    const STRAW = '#d8b85e', BAND = '#6b4a24';
    const B = paintBox([0, 64], 16, 1, 16, STRAW, 0.1);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      if ((x + y) % 2 === 0) dot(B.top, x, y, shade(STRAW, 0.88));
      dot(B.bottom, x, y, shade(STRAW, ((x + y) % 2 ? 0.72 : 0.64)));
    }
    for (let x = 0; x < 16; x++) { dot(B.top, x, 0, shade(STRAW, 0.8)); dot(B.top, x, 15, shade(STRAW, 0.8)); }
    const C = paintBox([0, 82], 9, 4, 9, STRAW, 0.1);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) if ((x + y) % 2 === 0) dot(C.top, x, y, shade(STRAW, 0.88));
    for (const k of ['front', 'back', 'left', 'right']) {
      for (let x = 0; x < C[k][2]; x++) { dot(C[k], x, 3, BAND); dot(C[k], x, 2, BAND); }   // fita escura
    }

    return cv;
  }


const MV={head:{hd:1},nose:{hd:1},brim:{hd:1},crown:{hd:1},armR:{rx:-.75},armL:{rx:-.75},arms:{rx:-.75},legR:{leg:1},legL:{leg:-1}};
const S=Mob.define({
 name:'aldeao',count:0,near:0,biomes:[0],
 hw:.3,hh:1.95,hit:[.35,2.1],walk:.9,flee:2.4,turn:2.6,hp:20,jump:7,legAmp:.5,legSpeed:8,rollY:.9,idle:2.5,
 texW:TEX_W,texH:TEX_H,canvas:makeTexture,
 parts:PARTS.map(p=>Mob.boxPart(p,k,MV[p.name]))
});
// aldeões já nascem andando pelas ruas da vila
if(window.VILLAGE){const V=VILLAGE;
 for(const[x,z]of[[-6,0],[7,0],[0,-8],[0,10],[-15,0],[15,0],[3,-2]]){const a=Math.random()*6.28;
  S.mobs.push({x:V.cx+x+.5,y:V.gy+1.001,z:V.cz+z+.5,vx:0,vy:0,vz:0,kx:0,kz:0,yaw:a,tyaw:a,st:0,t:Math.random()*3,gr:false,hp:S.cfg.hp,hurt:0,flee:0,anim:Math.random()*6,flap:0,spd:0,dead:0})}}
})();
