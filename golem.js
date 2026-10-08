// ---------- Golem de Ferro do Sumon Craft (modelo do iron_golem.html; usa mob.js — carregue depois de villager.js) ----------
// Ao ser atingido ele levanta os braços. Passeia pela vila como guardião.
(()=>{
const TEX_W=128,TEX_H=128,k=1/16;   // 1 pixel do modelo = 1/16 de bloco (2,7 blocos de altura)
  const PARTS = [
    { name: 'head',  tex: [0, 0],   box: [-4, 33, -0.5, 8, 10, 8],     pivot: [0, 31, 2],    group: 'head' },
    { name: 'nose',  tex: [32, 0],  box: [-1, 32, 7.5, 2, 4, 2],       pivot: [0, 31, 2],    group: 'head' },
    { name: 'body',  tex: [0, 40],  box: [-9, 21, -5, 18, 12, 11],     pivot: [0, 31, 0],    group: 'body' },
    { name: 'waist', tex: [0, 70],  box: [-4.5, 16, -3, 9, 5, 6],      pivot: [0, 31, 0],    group: 'body', inflate: 0.5 },
    { name: 'armR',  tex: [60, 21], box: [-13, 3.5, -3, 4, 30, 6],     pivot: [0, 31, 0],    group: 'armR' },
    { name: 'armL',  tex: [60, 21], box: [9, 3.5, -3, 4, 30, 6],       pivot: [0, 31, 0],    group: 'armL' },
    { name: 'legR',  tex: [40, 0],  box: [-7.5, 0, -2, 6, 16, 5],      pivot: [-4.5, 13, 0], group: 'legR' },
    { name: 'legL',  tex: [40, 0],  box: [1.5, 0, -2, 6, 16, 5],       pivot: [4.5, 13, 0],  group: 'legL' }
  ];


  function faceRects(tu, tv, w, h, d) {
    return {
      front:  [tu + d,         tv + d, w, h],
      back:   [tu + 2 * d + w, tv + d, w, h],
      left:   [tu,             tv + d, d, h],
      right:  [tu + d + w,     tv + d, d, h],
      top:    [tu + d,         tv,     w, d],
      bottom: [tu + d + w,     tv,     w, d]
    };
  }

  function makeRng(seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  function shade(color, f) {
    let R, G, B;
    if (color[0] === 'r') {
      [R, G, B] = color.match(/\d+/g).map(Number);
    } else {
      const n = parseInt(color.slice(1), 16);
      R = (n >> 16) & 255; G = (n >> 8) & 255; B = n & 255;
    }
    const cl = v => Math.max(0, Math.min(255, v)) | 0;
    return 'rgb(' + cl(R * f) + ',' + cl(G * f) + ',' + cl(B * f) + ')';
  }

  function makeTexture() {
    const cv = document.createElement('canvas');
    cv.width = TEX_W; cv.height = TEX_H;
    const ctx = cv.getContext('2d');
    const rnd = makeRng(2718);

    const IRON = '#c9c4bb', IRON_D = '#9f9a92', WAIST = '#8d8880', LEGC = '#aaa59c';
    const NOSE = '#b3a290', VINE_A = '#4f7a3c', VINE_B = '#628f48', EYE = '#26221f';

    const fillRect = (r, base, noise) => {
      for (let y = 0; y < r[3]; y++) for (let x = 0; x < r[2]; x++) {
        ctx.fillStyle = shade(base, 1 - noise / 2 + rnd() * noise);
        ctx.fillRect(r[0] + x, r[1] + y, 1, 1);
      }
    };
    const dot = (r, x, y, c) => { ctx.fillStyle = c; ctx.fillRect(r[0] + x, r[1] + y, 1, 1); };
    const paintBox = (tex, w, h, d, base, noise) => {
      const R = faceRects(tex[0], tex[1], w, h, d);
      for (const k in R) fillRect(R[k], base, noise);
      return R;
    };
    const row = (r, y, f) => { for (let x = 0; x < r[2]; x++) dot(r, x, y, shade(IRON, f)); };
    const vine = (r, x0, len) => {
      for (let y = 0; y < len; y++) dot(r, x0 + (y % 3 === 0 ? 1 : 0), y, y % 2 ? VINE_A : VINE_B);
    };

    // cabeça
    const H = paintBox([0, 0], 8, 10, 8, IRON, 0.14);
    for (let x = 1; x <= 6; x++) dot(H.front, x, 3, '#7a746c');            // sobrancelha (cinza, não preta)
    dot(H.front, 0, 3, shade(IRON, 0.85)); dot(H.front, 7, 3, shade(IRON, 0.85));
    for (const x of [1, 2, 5, 6]) {
      dot(H.front, x, 4, EYE);                                             // olhos escuros 2x1
      dot(H.front, x, 5, shade(IRON, 0.86));                               // sombra embaixo dos olhos
    }
    row(H.front, 9, 0.84);
    fillRect(H.top, shade(IRON, 1.08), 0.1);

    // nariz (cor de ferro envelhecido, mais discreto)
    const N = paintBox([32, 0], 2, 4, 2, NOSE, 0.1);
    for (let x = 0; x < 2; x++) { dot(N.front, x, 3, shade(NOSE, 0.82)); dot(N.front, x, 0, shade(NOSE, 1.08)); }
    fillRect(N.left, shade(NOSE, 0.88), 0.08); fillRect(N.right, shade(NOSE, 0.88), 0.08);

    // corpo
    const B = paintBox([0, 40], 18, 12, 11, IRON, 0.16);
    for (const k of ['front', 'back', 'left', 'right']) {
      row(B[k], 0, 0.9); row(B[k], 5, 0.86); row(B[k], 11, 0.78);
    }
    fillRect(B.top, shade(IRON, 1.1), 0.12);
    for (let x = 0; x < 18; x++) if (x % 5 === 2) for (let y = 1; y < 5; y++) dot(B.front, x, y, shade(IRON, 0.84)); // placas
    vine(B.front, 3, 9); vine(B.front, 13, 6); vine(B.back, 12, 8); vine(B.left, 4, 7);

    // cintura
    paintBox([0, 70], 9, 5, 6, WAIST, 0.14);

    // braços
    const A = paintBox([60, 21], 4, 30, 6, IRON, 0.16);
    for (const k of ['front', 'back', 'left', 'right']) {
      row(A[k], 0, 0.88);
      for (let y = 24; y < 30; y++) for (let x = 0; x < A[k][2]; x++) dot(A[k], x, y, shade(IRON_D, 0.9 + rnd() * 0.12)); // mãos
    }
    fillRect(A.top, shade(IRON, 1.1), 0.12);
    vine(A.front, 1, 14); vine(A.right, 3, 9);

    // pernas
    const L = paintBox([40, 0], 6, 16, 5, LEGC, 0.14);
    for (const k of ['front', 'back', 'left', 'right']) row(L[k], 7, 0.75);   // joelho

    return cv;
  }


const MV={head:{hd:1},nose:{hd:1},armR:{leg:-.8,atk:1},armL:{leg:.8,atk:1},legR:{leg:1},legL:{leg:-1}};
const S=Mob.define({
 name:'golem',count:0,near:0,biomes:[0],
 hw:.7,hh:2.7,hit:[.8,2.7],walk:.8,flee:1.2,turn:2,hp:100,jump:8,legAmp:.6,legSpeed:6,rollY:1.3,idle:3,
 texW:TEX_W,texH:TEX_H,canvas:makeTexture,
 parts:PARTS.map(p=>Mob.boxPart(p,k,MV[p.name]))
});
if(window.VILLAGE){const V=VILLAGE;
 for(const[x,z]of[[0,-6],[-11,0]]){const a=Math.random()*6.28;
  S.mobs.push({x:V.cx+x+.5,y:V.gy+1.001,z:V.cz+z+.5,vx:0,vy:0,vz:0,kx:0,kz:0,yaw:a,tyaw:a,st:0,t:Math.random()*3,gr:false,hp:S.cfg.hp,hurt:0,flee:0,anim:Math.random()*6,flap:0,spd:0,dead:0})}}
})();
