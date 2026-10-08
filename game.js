const SCW=(()=>{try{return JSON.parse(sessionStorage.getItem('sc.play'))||{}}catch(e){return{}}})(),FLAT=SCW.type==1;
const cv=document.getElementById('c'),gl=cv.getContext('webgl'),$=i=>document.getElementById(i);
let sd=3;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
// ---------- Atlas 17 tiles ----------
const NT=151,AT=document.createElement('canvas');AT.width=NT*16;AT.height=16;
const ax=AT.getContext('2d'),im=ax.createImageData(NT*16,16);
const set=(t,i,j,r,g,b,a=255)=>{if(i<0||j<0||i>15||j>15)return;const o=(j*NT*16+t*16+i)*4;im.data.set([r,g,b,a],o)};
const T=(t,f)=>{for(let j=0;j<16;j++)for(let i=0;i<16;i++)set(t,i,j,...f(i,j))};
const sc=(c,k)=>c.map(v=>Math.min(255,v*k|0));
const rc=(t,x,y,w,h,c)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)set(t,x+i,y+j,...c)};
const dirt=()=>{const k=.8+rnd()*.4;return rnd()<.05?[120,118,112]:sc([134,96,67],k)};
const offs=[5,12,2,9];
const planks=(i,j)=>(j%4==3||i==offs[j>>2])?[118,90,50]:sc([184,148,92],.85+rnd()*.25);
const cob=(i,j)=>(j%5==4||(i+((j/5|0)%2)*4)%8==7)?[78,78,80]:(g=>[g,g,g+1])(112+rnd()*44|0);
T(0,()=>sc([96,160,48],.85+rnd()*.3));
T(1,(i,j)=>j<2+(i*7%3)?sc([96,160,48],.85+rnd()*.3):dirt());
T(2,dirt);T(3,()=>sc([214,202,158],.9+rnd()*.15));
T(4,()=>rnd()<.12?[0,0,0,0]:sc([62,125,36],.7+rnd()*.6));
T(5,planks);T(6,()=>sc([158,158,160],.93+rnd()*.1));T(7,cob);
T(8,(i)=>sc([102,81,50],.7+(i*37%5)/10+rnd()*.1));
T(9,(i,j)=>{const d=Math.max(Math.abs(i-7.5),Math.abs(j-7.5));return d>=7?[86,68,40]:sc(((d/2|0)%2)?[156,125,76]:[184,148,92],.95+rnd()*.1)});
T(10,cob);rc(10,3,2,10,3,[32,32,34]);for(let i=3;i<13;i+=2)rc(10,i,2,1,3,[86,86,90]);rc(10,2,6,12,8,[58,58,62]);rc(10,3,7,10,7,[24,24,26]);
T(11,(i,j)=>(i%15==0||j%15==0)?[96,66,36]:(i==5||i==10||j==5||j==10)?[112,82,46]:sc([196,160,102],.9+rnd()*.15));
rc(11,2,2,2,1,[158,158,164]);rc(11,7,2,1,2,[128,92,52]);rc(11,12,7,2,1,[104,104,112]);rc(11,8,12,2,1,[158,158,164]);
T(12,planks);rc(12,0,0,16,3,[96,66,36]);for(let k=0;k<6;k++)set(12,3+k,5+k,158,158,164);rc(12,9,5,4,2,[158,158,164]);rc(12,10,8,2,5,[128,92,52]);
const flower=(t,c,m)=>{T(t,()=>[0,0,0,0]);const rows={1:[6,9],2:[5,10],3:[4,11],4:[3,12],5:[3,12],6:[4,11],7:[5,10],8:[6,9]};
for(const j in rows)for(let i=rows[j][0];i<=rows[j][1];i++)set(t,i,+j,...sc(c,.85+rnd()*.3));
rc(t,7,4,2,3,m);for(let j=9;j<16;j++){set(t,7,j,46,106,30);set(t,8,j,66,140,42)}rc(t,5,12,2,1,[74,150,46]);rc(t,9,13,2,1,[74,150,46])};
flower(13,[200,30,30],[58,10,16]);flower(14,[248,214,36],[196,128,12]);flower(15,[44,150,214],[214,236,250]);
T(16,()=>[0,0,0]);
T(17,planks);rc(17,0,0,16,2,[96,66,36]);rc(17,0,2,16,1,[110,80,44]);rc(17,4,5,2,7,[158,158,164]);rc(17,5,5,1,7,[104,104,112]);rc(17,4,12,2,2,[128,92,52]);rc(17,10,5,3,2,[158,158,164]);rc(17,11,7,1,6,[128,92,52]);
T(18,(i,j)=>{if(i==0||j==0||i==15||j==15)return[206,230,236,255];
 if((i==j&&i>=3&&i<=6)||(i==j-1&&i>=3&&i<=5)||(i==12&&j>=11&&j<=12))return[255,255,255,255];return[0,0,0,0]});
const WOOL=[[233,236,236],[240,118,19],[189,68,179],[58,175,217],[248,198,39],[112,185,25],[237,141,172],[62,68,71],[142,142,134],[21,137,145],[121,42,172],[53,57,157],[114,71,40],[84,109,27],[160,39,34],[20,21,25]];
WOOL.forEach((c,k)=>T(19+k,(i,j)=>sc(c,.9+rnd()*.12-((i+j)%4==0?.06:0))));
// novos tiles (a semente é restaurada para o mundo gerado continuar igual)
{const s0=sd,ed=(i,j)=>i==0||j==0||i==15||j==15,dc=(i,j)=>Math.max(Math.abs(i-7.5),Math.abs(j-7.5));
 // 35 painel (só as bordas de cima/baixo e a coluna central), 36 borda sólida
 T(35,(i,j)=>{if(j==0||j==15||i==7||i==8)return[190,214,222,255];
  if((i==j&&i>=3&&i<=6)||(i==j-1&&i>=3&&i<=5)||(i==12&&j>=11&&j<=12))return[255,255,255,255];return[0,0,0,0]});
 T(36,()=>[190,214,222,255]);
 // 37 lateral do pistão, 38 face de madeira, 39 face de slime, 40 fundo, 41 haste da alavanca
 T(37,(i,j)=>ed(i,j)?[104,104,108]:sc([150,150,154],.9+rnd()*.2));
 T(38,(i,j)=>{const d=dc(i,j);return d>=7?[96,66,36]:d>=5?sc([196,160,102],.9+rnd()*.15):sc([160,126,76],.9+rnd()*.15)});
 T(39,(i,j)=>{const d=dc(i,j);return d>=7?[96,66,36]:d>=5?sc([196,160,102],.9+rnd()*.15):sc([104,190,76],.85+rnd()*.25)});
 T(40,(i,j)=>ed(i,j)?[70,70,74]:sc([96,96,100],.85+rnd()*.2));
 T(41,()=>sc([130,96,56],.85+rnd()*.25));
 // 42 slime externo (translúcido), 43 slime interno
 T(42,(i,j)=>ed(i,j)?[96,180,66,220]:[124,206,92,140+(rnd()*30|0)]);
 T(43,()=>sc([110,190,80],.8+rnd()*.3));
 // 44-59 concreto liso, 60-75 pó de concreto granulado
 WOOL.forEach((c,k)=>{T(44+k,()=>sc(c,.96+rnd()*.07));T(60+k,()=>sc(c.map(v=>Math.min(255,v*1.1+14)),.86+rnd()*.24))});
 // 76 pó de redstone (a luz do vértice escurece/acende), 77 bloco de redstone
 T(76,()=>sc([255,40,30],.92+rnd()*.08));
 T(77,(i,j)=>{const e=i==0||j==0||i==15||j==15,d=(i*7+j*11)%9==0;return e?[120,8,8]:d?[255,70,50]:sc([196,18,14],.85+rnd()*.3)});
 // 78 obsidiana · 79/80 repetidor (desl./lig.) · 81/82 comparador · 83 lateral de lajota · 84-87 observador (rosto, lado, costas, costas ativas)
 T(78,()=>rnd()<.12?[72,40,112]:sc([24,14,36],.8+rnd()*.5));
 const slab=(on,cmp)=>(i,j)=>{if(ed(i,j))return[110,110,114];const c=cmp?(i>=3&&i<=12&&j>=6&&j<=9):(i>=5&&i<=10&&j>=5&&j<=10);
  return c?(on?[225,50,40]:[96,96,100]):sc([172,172,176],.92+rnd()*.12)};
 T(79,slab(0,0));T(80,slab(1,0));T(81,slab(0,1));T(82,slab(1,1));
 T(83,()=>sc([150,150,154],.9+rnd()*.15));
 T(84,(i,j)=>ed(i,j)?[78,78,82]:sc([128,128,132],.9+rnd()*.2));rc(84,2,5,12,6,[40,40,44]);rc(84,3,6,3,4,[240,240,240]);rc(84,10,6,3,4,[240,240,240]);rc(84,4,7,1,2,[0,0,0]);rc(84,11,7,1,2,[0,0,0]);
 T(85,(i,j)=>ed(i,j)?[78,78,82]:sc([128,128,132],.9+rnd()*.2));
 T(86,(i,j)=>ed(i,j)?[78,78,82]:(i>=5&&i<=10&&j>=5&&j<=10)?[56,56,60]:sc([128,128,132],.9+rnd()*.2));
 T(87,(i,j)=>ed(i,j)?[78,78,82]:(i>=5&&i<=10&&j>=5&&j<=10)?[230,60,50]:sc([128,128,132],.9+rnd()*.2));
 // 89/90 porta de madeira (metade de baixo com maçaneta / metade de cima)
 const dp=(i,j)=>{if(i==0||i==15||j==0||j==15)return[92,62,30];const pn=i>=3&&i<=12&&((j>=2&&j<=6)||(j>=9&&j<=13));
  if(pn){const e=(i==3||j==2||j==9)?.78:(i==12||j==6||j==13)?1.08:.92;return sc([176,138,82],e*(.95+rnd()*.1))}
  return sc([196,160,102],(.92+((i*7)%3)*.05)*(.96+rnd()*.08))};
 T(89,(i,j)=>(i==12&&(j==3||j==4))?[70,70,78]:(i==13&&(j==3||j==4))?[214,214,222]:dp(i,j));T(90,dp);T(91,()=>sc([112,80,42],.82+rnd()*.3));
 // 92-95 bétula: folhas, tábuas, tronco (lado e topo)
 T(92,()=>rnd()<.12?[0,0,0,0]:sc([128,167,85],.7+rnd()*.6));
 T(93,(i,j)=>(j%4==3||i==offs[j>>2])?[150,134,86]:sc([216,200,140],.88+rnd()*.2));
 T(94,(i,j)=>(((i>>2)*37+j*17)%7==0&&i%4<3)?sc([44,42,40],.9+rnd()*.3):sc([228,225,214],.9+rnd()*.12));
 T(95,(i,j)=>{const d=dc(i,j);return d>=7?[222,218,204]:sc(((d/2|0)%2)?[196,176,120]:[216,196,140],.95+rnd()*.1)});
 // 96-99 acácia: folhas, tábuas, tronco (lado e topo)
 T(96,()=>rnd()<.12?[0,0,0,0]:sc([106,146,48],.7+rnd()*.6));
 T(97,(i,j)=>(j%4==3||i==offs[j>>2])?[140,70,42]:sc([186,102,60],.88+rnd()*.2));
 T(98,(i,j)=>sc([108,100,90],.78+((i*29)%5)/12+rnd()*.12));
 T(99,(i,j)=>{const d=dc(i,j);return d>=7?[108,100,90]:sc(((d/2|0)%2)?[160,86,50]:[186,102,60],.95+rnd()*.1)});
 // 88 água (translúcida)
 T(88,(i,j)=>{const k=.86+rnd()*.16+(((i*3+j*5)%11)==0?.14:0);return[...sc([46,108,214],k),175]});
 // 100-103 bioma: neve (topo/lateral) e grama seca da savana (topo/lateral)
 T(100,()=>sc([244,248,252],.93+rnd()*.07));
 T(101,(i,j)=>j<3+(i*5%2)?sc([244,248,252],.93+rnd()*.07):dirt());
 T(102,()=>sc([172,164,72],.85+rnd()*.3));
 T(103,(i,j)=>j<2+(i*7%3)?sc([172,164,72],.85+rnd()*.3):dirt());
 // 104-107 cerejeira: folhas, tábuas, casca (rosa bem escuro por fora), topo do tronco (rosa por dentro)
 T(104,(i,j)=>rnd()<.12?[0,0,0,0]:(((i*7+j*13)%9==0)?sc([255,205,222],.9+rnd()*.1):sc([244,160,196],.82+rnd()*.3)));
 T(105,(i,j)=>(j%4==3||i==offs[j>>2])?[176,108,124]:sc([232,176,182],.88+rnd()*.2));
 T(106,(i,j)=>(((i*5+(j>>2)*3)%7)==0)?sc([112,34,72],.9+rnd()*.2):sc([150,52,100],.78+((i*29)%5)/12+rnd()*.12));
 T(107,(i,j)=>{const d=dc(i,j);return d>=7?[150,52,100]:sc(((d/2|0)%2)?[240,176,198]:[224,150,178],.95+rnd()*.1)});
 // 108/109 grama de pântano (topo/lateral) · 110/111 grama de selva · 112/113 tronco de selva (lado/topo) · 114 folhas de selva
 T(108,()=>sc([86,106,52],.82+rnd()*.3));
 T(109,(i,j)=>j<2+(i*7%3)?sc([86,106,52],.82+rnd()*.3):dirt());
 T(110,()=>sc([54,154,34],.85+rnd()*.3));
 T(111,(i,j)=>j<2+(i*7%3)?sc([54,154,34],.85+rnd()*.3):dirt());
 T(112,(i,j)=>(((i*11+j*5)%13)<2)?sc([62,96,40],.9+rnd()*.2):sc([92,72,40],.7+((i*37)%5)/10+rnd()*.1));
 T(113,(i,j)=>{const d=dc(i,j);return d>=7?[84,66,36]:sc(((d/2|0)%2)?[168,138,86]:[148,120,72],.95+rnd()*.1)});
 T(114,()=>rnd()<.1?[0,0,0,0]:sc([34,118,24],.7+rnd()*.6));
 // 115 lava
 T(115,(i,j)=>{const w=Math.sin(i*.9+j*.4)*.5+Math.sin(j*1.1-i*.5)*.5,k=.5+.5*w+rnd()*.25;return k>.82?[255,222,84]:k>.55?[255,140,22]:k>.3?[226,72,10]:[150,30,6]});
 // 116-150: tijolos, minerais, blocos decorativos e baú
 const bricks=(t,base,mort,rh,bw,of)=>T(t,(i,j)=>(j%rh==rh-1||(i+((j/rh|0)%2)*of)%bw==bw-1)?sc(mort,.92+rnd()*.12):sc(base,.82+rnd()*.3));
 bricks(116,[150,72,56],[188,178,166],4,8,4);
 const sb=(i,j)=>(j%8==7||(i+((j>>3)%2)*4)%8==7)?sc([84,84,88],.92+rnd()*.12):sc([128,128,130],.88+rnd()*.2);
 T(117,sb);
 T(118,(i,j)=>(((i*5+j*3)%13==0&&(i+j)%3)||(i==j&&i>3&&i<9))?[58,58,62]:sb(i,j));
 T(119,(i,j)=>(Math.sin(i*1.3+j*.7)+Math.sin(j*2.1-i*.6)>.6)?sc([84,124,52],.8+rnd()*.35):sb(i,j));
 const mn=(t,b,hi,lo)=>T(t,(i,j)=>(i==0||j==0||i==15||j==15)?lo:((i+j)%8==2&&i>1&&j>1&&i<14&&j<14)?hi:sc(b,.9+rnd()*.15));
 mn(120,[252,214,64],[255,248,170],[196,146,24]);mn(121,[222,222,224],[250,250,252],[150,150,156]);
 mn(122,[92,226,214],[196,255,250],[36,150,160]);mn(123,[62,204,102],[160,252,178],[22,120,52]);
 mn(124,[30,30,32],[78,78,82],[10,10,12]);mn(125,[40,76,176],[100,140,236],[18,38,112]);
 T(126,()=>{const v=rnd();return v<.18?[255,246,170]:v<.4?[214,150,50]:sc([246,196,84],.9+rnd()*.14)});
 T(127,()=>rnd()<.15?[70,20,22]:sc([112,42,42],.8+rnd()*.4));
 T(128,(i,j)=>(j%4==3||(i+((j>>2)%2)*4)%8==7)?[24,10,14]:sc([66,30,38],.85+rnd()*.25));
 const bc=[[150,40,30],[40,90,150],[60,130,60],[180,140,60],[110,60,140],[210,210,210]];
 T(129,(i,j)=>{if(j<2||j>13||j==7||j==8)return sc([184,148,92],.8+rnd()*.2);return sc(bc[((i>>1)*3+(j>8?2:0))%6],(i%2?.82:1)*(.9+rnd()*.15))});
 T(130,(i,j)=>{const d=dc(i,j);return d>=7?[140,108,36]:sc(((d/2|0)%2)?[212,180,64]:[190,158,52],.95+rnd()*.1)});
 T(131,(i,j)=>(j==6||j==9)?[132,100,32]:sc(i%2?[214,182,66]:[196,164,56],.9+rnd()*.15));
 T(132,()=>{const v=rnd();return v<.2?sc([96,92,90],.9+rnd()*.2):v<.35?sc([150,130,110],.9+rnd()*.2):sc([136,132,130],.85+rnd()*.3)});
 T(133,()=>sc([160,166,180],.93+rnd()*.12));T(134,()=>sc([152,94,67],.92+rnd()*.12));
 T(135,(i,j)=>j<3?sc([204,190,140],.95+rnd()*.06):j==15?sc([196,182,134],1):sc([224,210,160],.95+rnd()*.07));
 T(136,()=>sc([238,232,224],.97+rnd()*.05));T(137,(i,j)=>(i==0||i==15)?[222,216,208]:sc([238,232,224],.97+rnd()*.05));
 const sp=(t,b,a,c)=>T(t,()=>{const v=rnd();return v<.16?sc(a,.9+rnd()*.15):v<.3?sc(c,.9+rnd()*.15):sc(b,.93+rnd()*.12)});
 sp(138,[156,102,88],[196,136,116],[112,70,60]);sp(139,[190,190,190],[238,238,238],[120,120,122]);sp(140,[136,136,132],[168,168,164],[96,96,94]);
 T(141,()=>rnd()<.1?[148,142,44]:sc([206,200,84],.9+rnd()*.16));[[3,3],[10,2],[6,9],[12,11],[2,12],[8,5]].forEach(([a,b])=>rc(141,a,b,2,2,[120,116,34]));
 T(142,(i,j)=>{const d=dc(i,j);return d<2.2?[44,44,44]:d>=7?[170,138,100]:sc([208,174,128],.95+rnd()*.07)});
 T(143,(i,j)=>(j<3||j>12)?sc([204,44,34],.9+rnd()*.1):sc([232,228,222],.95+rnd()*.05));
 [[2,6,3,1],[3,7,1,3],[6,6,1,4],[8,6,1,4],[7,7,1,1],[10,6,3,1],[11,7,1,3]].forEach(a=>rc(143,a[0],a[1],a[2],a[3],[30,30,30]));
 T(144,(i,j)=>{const d=dc(i,j);return d<1.8?[104,140,44]:d>=7?[150,80,10]:sc([214,126,24],.92+rnd()*.12)});
 T(145,(i,j)=>(i%4==0)?[168,86,12]:sc([220,130,26],.92+rnd()*.12));
 T(146,(i,j)=>(((i>>1)+(j>>1))%3==0)?sc([76,120,34],1):sc([112,156,44],.9+rnd()*.12));
 T(147,(i,j)=>(i%5<2)?sc([56,110,30],.9+rnd()*.15):sc([108,150,40],.9+rnd()*.15));
 const plk=()=>sc([164,124,62],.88+rnd()*.2);
 T(148,(i,j)=>(i==1||i==14||j==1||j==14)?[96,64,30]:plk());
 const cs=(i,j)=>(i==0||i==15||j==2||j==15||j==6)?[96,64,30]:plk();
 T(149,cs);T(150,cs);rc(150,7,5,2,4,[198,198,206]);rc(150,7,7,2,1,[48,48,54]);
 sd=s0}
ax.putImageData(im,0,0);
// ---------- Blocos ----------
const NAMES={1:'Bloco de grama',2:'Bloco de terra',3:'Bloco de areia',4:'Bloco de folhas',5:'Bloco de madeira',6:'Bloco de pedra lisa',7:'Bloco de pedregulho',8:'Tronco de madeira',9:'Fornalha',10:'Mesa de trabalho',11:'Flor vermelha',12:'Flor amarela',13:'Flor azul',14:'Bloco de vidro',15:'Painel de vidro'};
const WN=['branca','laranja','magenta','azul-clara','amarela','verde-limão','rosa','cinza','cinza-clara','ciano','roxa','azul','marrom','verde','vermelha','preta'];
WN.forEach((n,k)=>NAMES[16+k]='Lã '+n);
const WM=['branco','laranja','magenta','azul-claro','amarelo','verde-limão','rosa','cinza','cinza-claro','ciano','roxo','azul','marrom','verde','vermelho','preto'];
WM.forEach((n,k)=>{NAMES[32+k]='Concreto '+n;NAMES[48+k]='Pó de concreto '+n});
Object.assign(NAMES,{64:'Bloco de slime',65:'Pistão',66:'Pistão com slime',67:'Alavanca',72:'Redstone',73:'Bloco de redstone',74:'Repetidor de redstone',75:'Comparador de redstone',76:'Observador',77:'Obsidiana',78:'Água',79:'Cama',80:'Porta de madeira',85:'Laje de madeira',86:'Laje de pedra',87:'Laje de pedregulho',88:'Escada de madeira',89:'Escada de pedra',90:'Escada de pedregulho',91:'Bloco de folhas de bétula',92:'Bloco de madeira de bétula',93:'Tronco de bétula',94:'Bloco de folhas de acácia',95:'Bloco de madeira de acácia',96:'Tronco de acácia',97:'Laje de bétula',98:'Laje de acácia',99:'Escada de bétula',100:'Escada de acácia',101:'Bloco de neve',102:'Bloco de grama seca',103:'Folhas de cerejeira',104:'Tronco de cerejeira',105:'Bloco de madeira de cerejeira',106:'Laje de cerejeira',107:'Escada de cerejeira',108:'Bloco de grama de pântano',109:'Bloco de grama de selva',110:'Tronco de selva',111:'Folhas de selva',112:'Lava',113:'Tijolos',114:'Tijolos de pedra',115:'Tijolos de pedra rachados',116:'Tijolos de pedra musgosos',117:'Bloco de ouro',118:'Bloco de ferro',119:'Bloco de diamante',120:'Bloco de esmeralda',121:'Bloco de carvão',122:'Bloco de lápis-lazúli',123:'Pedra luminosa',124:'Netherrack',125:'Tijolos do Nether',126:'Estante de livros',127:'Fardo de feno',128:'Cascalho',129:'Argila',130:'Terracota',131:'Arenito',132:'Bloco de quartzo',133:'Granito',134:'Diorito',135:'Andesito',136:'Esponja',137:'TNT',138:'Abóbora',139:'Melancia',140:'Baú'});
// ids: 32-47 concreto · 48-63 pó · 64 slime · 65/66 pistão/pistão slime · 67 alavanca · 68/69 base estendida · 70/71 cabeça · 72 pó de redstone · 73 bloco de redstone
const TT={1:[0,2,1],2:[2,2,2],3:[3,3,3],4:[4,4,4],5:[5,5,5],6:[6,6,6],7:[7,7,7],8:[9,9,8],9:[7,7,7],10:[11,5,17],14:[18,18,18],64:[43,43,43],65:[38,37,37],66:[39,37,37],73:[77,77,77],76:[85,85,85],77:[78,78,78],78:[88,88,88],91:[92,92,92],92:[93,93,93],93:[95,95,94],94:[96,96,96],95:[97,97,97],96:[99,99,98]};
for(let k=0;k<16;k++){TT[16+k]=[19+k,19+k,19+k];TT[32+k]=[44+k,44+k,44+k];TT[48+k]=[60+k,60+k,60+k]}
TT[101]=[100,2,101];TT[102]=[102,2,103];TT[103]=[104,104,104];TT[104]=[107,107,106];TT[105]=[105,105,105];TT[108]=[108,2,109];TT[109]=[110,2,111];TT[110]=[113,113,112];TT[111]=[114,114,114];TT[112]=[115,115,115];TT[113]=[116,116,116];TT[114]=[117,117,117];TT[115]=[118,118,118];TT[116]=[119,119,119];TT[117]=[120,120,120];TT[118]=[121,121,121];TT[119]=[122,122,122];TT[120]=[123,123,123];TT[121]=[124,124,124];TT[122]=[125,125,125];TT[123]=[126,126,126];TT[124]=[127,127,127];TT[125]=[128,128,128];TT[126]=[5,5,129];TT[127]=[130,130,131];TT[128]=[132,132,132];TT[129]=[133,133,133];TT[130]=[134,134,134];TT[131]=[3,3,135];TT[132]=[136,136,137];TT[133]=[138,138,138];TT[134]=[139,139,139];TT[135]=[140,140,140];TT[136]=[141,141,141];TT[137]=[142,142,143];TT[138]=[144,144,145];TT[139]=[146,146,147];TT[140]=[148,148,150];
const LEAF=b=>b==4||b==91||b==94||b==103||b==111;
const plant=b=>b>=11&&b<=13,solid=b=>((b>0&&b<11)||b==14||b==15||b>=16)&&b!=67&&b!=72&&b!=74&&b!=75&&b!=78&&b!=112&&b!=82&&b!=83,trans=b=>b==0||b==78||b==112||b==140||(b>=79&&b<=90)||(b>=97&&b<=100)||b==106||b==107||LEAF(b)||plant(b)||b==14||b==15||(b>=64&&b<=72)||b==74||b==75;
const N=256,H=100,SEA=9,W=new Uint8Array(N*H*N);let gd=1;
// malha por pedaços (chunks 16x16): só os pedaços alterados são refeitos
const NC=N>>4,DIRTY=new Set();
const markC=(x,z)=>{const cx=x>>4,cz=z>>4;DIRTY.add(cx*NC+cz);const lx=x&15,lz=z&15;
 if(lx==0&&cx>0)DIRTY.add((cx-1)*NC+cz);if(lx==15&&cx<NC-1)DIRTY.add((cx+1)*NC+cz);
 if(lz==0&&cz>0)DIRTY.add(cx*NC+cz-1);if(lz==15&&cz<NC-1)DIRTY.add(cx*NC+cz+1)};
class DMap extends Map{set(k,v){markC((k/(H*N))|0,k%N);return super.set(k,v)}delete(k){markC((k/(H*N))|0,k%N);return super.delete(k)}clear(){for(const k of this.keys())markC((k/(H*N))|0,k%N);super.clear()}}
const M=new DMap(),PW=new DMap();
const HD=[[0,0,1],[0,0,-1],[1,0,0],[-1,0,0]];
// vizinho de fio conectado na direção HD[i] (mesmo nível, degrau acima ou abaixo) ou null
function conn(x,y,z,i){const e=HD[i],nx=x+e[0],nz=z+e[2];
 if(get(nx,y,nz)==72)return[nx,y,nz];
 if(get(nx,y+1,nz)==72&&!solid(get(x,y+1,z)))return[nx,y+1,nz];
 if(get(nx,y-1,nz)==72&&!solid(get(nx,y,nz)))return[nx,y-1,nz];
 return null}
const get=(x,y,z)=>x<0||y<0||z<0||x>=N||y>=H||z>=N?0:W[(x*H+y)*N+z];
let FLOWON=false;const put=(x,y,z,b)=>{if(x>=0&&y>=0&&z>=0&&x<N&&y<H&&z<N){const k=(x*H+y)*N+z;W[k]=b;markC(x,z);M.delete(k);gd=1;if(FLOWON)wake(x,y,z)}};
const putm=(x,y,z,b,m)=>{put(x,y,z,b);if(x>=0&&y>=0&&z>=0&&x<N&&y<H&&z<N)M.set((x*H+y)*N+z,m)};
const HM=[],wHash=(i,j)=>{let n=(i*374761393+j*668265263+1013904223)|0;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295},
 wSm=t=>t*t*(3-2*t),
 wVn=(x,z)=>{const i=Math.floor(x),j=Math.floor(z),fx=wSm(x-i),fz=wSm(z-j),a=wHash(i,j),b=wHash(i+1,j),c=wHash(i,j+1),d=wHash(i+1,j+1);return a+(b-a)*fx+(c-a)*fz+(a-b-c+d)*fx*fz},
 wFb=(x,z)=>wVn(x*.03,z*.03)*.55+wVn(x*.07+50,z*.07+50)*.3+wVn(x*.16+99,z*.16+99)*.15;
// ---------- Mundo grande com biomas ----------
// biomas: 0 planície · 1 floresta · 2 floresta de bétulas · 3 savana (acácias) · 4 deserto · 5 tundra nevada · 6 montanhas · 7 cerejeiras · 8 pântano · 9 selva
const BM=[],BN=['Planície','Floresta','Floresta de bétulas','Savana','Deserto','Tundra nevada','Montanhas','Bosque de cerejeiras','Pântano','Selva'],
 cl=(v,a,b)=>Math.min(b,Math.max(a,v)),sst=(a,b,v)=>{const t=cl((v-a)/(b-a),0,1);return t*t*(3-2*t)},
 nz=(x,z,f,o)=>wVn(x*f+o,z*f+o*.7+13);
for(let x=0;x<N;x++){HM[x]=[];BM[x]=[];for(let z=0;z<N;z++){
 const ed=Math.max(Math.abs(x-N/2),Math.abs(z-N/2))/(N/2),
  tp=nz(x,z,.012,400)*.7+nz(x,z,.04,31)*.3,hu=nz(x,z,.012,900)*.7+nz(x,z,.04,77)*.3,
  mt=nz(x,z,.014,1500)*.7+nz(x,z,.045,9)*.3,ct=nz(x,z,.009,2000)*.75+nz(x,z,.03,55)*.25,
  mn=sst(.56,.72,mt)*sst(.3,.42,ct),rv=Math.abs(nz(x,z,.017,3100)-.5),cn_=nz(x,z,.02,5200)*.75+nz(x,z,.06,41)*.25,swn=nz(x,z,.018,6100)*.75+nz(x,z,.055,17)*.25;
 let h=14+(wFb(x+7,z+13)-.5)*20+(ct-.5)*10;
 h+=mn*(14+wVn(x*.09+5,z*.09+8)*18);        // montanhas
 h-=Math.max(0,.33-ct)*90;                    // oceanos
 h-=Math.max(0,ed-.82)*110;                  // borda do mundo afunda
 const rr=1-sst(0,.04,rv);                   // rios sinuosos
 if(rr>0&&h>SEA-3)h-=rr*(h-(SEA-2))*cl(1-mn*2,0,1);
 const sw=mn<.2?sst(.57,.65,swn):0;           // pântano: terreno baixo e encharcado
 if(sw>0&&h>SEA-2)h+=(SEA+(nz(x,z,.09,8)-.45)*7-h)*sw;
 h=cl(Math.round(h),1,H-6);
 let bi=0;if(mn>.45)bi=6;else if(tp>.57)bi=hu<.54?4:hu<.64?3:9;else if(tp<.34)bi=5;else if(hu>.58)bi=tp<.46?2:1;
 if(bi==9)h+=Math.round((nz(x,z,.1,66)-.5)*8);
 if(bi<3){if(sw>.5)bi=8;else if(cn_>.57)bi=7}
 h=cl(h,1,H-6);
 if(FLAT){h=SEA+3;bi=0}const beach=h<=SEA+1&&bi!=8;let top=1,sub=2;
 if(beach||bi==4){top=3;sub=3}
 else if(bi==5)top=101;
 else if(bi==3)top=102;
 else if(bi==9)top=109;
 else if(bi==8)top=h>SEA?108:2;
 else if(bi==6){if(h>=30){top=101;sub=6}else if(h>=19){top=6;sub=6}}
 HM[x][z]=h;BM[x][z]=bi;
 for(let y=0;y<=h;y++)put(x,y,z,y==h?top:y>=h-3?sub:6);
 for(let y=h+1;y<=SEA;y++)put(x,y,z,78)}}
// ---------- Lava: poças nas montanhas e nos desertos ----------
for(let x=2;x<N-2;x++)for(let z=2;z<N-2;z++){const bi=BM[x][z],h=HM[x][z];
 if((bi!=6&&bi!=4)||h<SEA+3||Math.max(Math.abs(x-N/2),Math.abs(z-N/2))/(N/2)>.74||Math.hypot(x-N/2,z-N/2)<28)continue;
 if(nz(x,z,.045,7300)*.7+nz(x,z,.13,411)*.3<.64)continue;
 for(let y=h-3;y<h;y++)put(x,y,z,112);put(x,h,z,0);HM[x][z]=h-1}
// árvores: 0 carvalho · 1 bétula · 2 acácia · 3 cerejeira · 4 carvalho de pântano · 5 selva alta · 6 arbusto de selva
const tree=(kind,x,h,z)=>{const t=4+(rnd()*2|0),lf=(a,b,c,id)=>{if(!get(a,b,c))put(a,b,c,id)};
 if(kind==3){const tt=4+(rnd()*3|0),ox=rnd()<.5?(rnd()<.5?1:-1):0,oz=ox?0:(rnd()<.6?(rnd()<.5?1:-1):0),cx=x+ox,cz=z+oz,cy=h+tt+1;
  for(let k=1;k<=tt;k++)put(x,h+k,z,104);
  if(ox||oz){put(x+ox,h+tt-1,z+oz,104);put(cx,h+tt,cz,104);put(cx,h+tt+1,cz,104)}
  for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)for(let dy=-2;dy<=2;dy++){if((dx*dx+dz*dz)/10.5+dy*dy/5.5<=1&&rnd()>.07)lf(cx+dx,cy+dy,cz+dz,103)}
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)lf(x+dx,h+tt+1,z+dz,103)}
 else if(kind==4){tree(0,x,h,z);const tt=t;
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){if(Math.max(Math.abs(dx),Math.abs(dz))==2||(Math.abs(dx)==2&&Math.abs(dz)==2))if(get(x+dx,h+tt-1,z+dz)==4&&rnd()<.55){const n=1+(rnd()*3|0);for(let k=1;k<=n;k++)lf(x+dx,h+tt-1-k,z+dz,4)}}}
 else if(kind==5){const tt=9+(rnd()*5|0),big=rnd()<.25&&x<N-4&&z<N-4,r=big?3:2;
  for(let k=1;k<=tt;k++){put(x,h+k,z,110);if(big){put(x+1,h+k,z,110);put(x,h+k,z+1,110);put(x+1,h+k,z+1,110)}}
  for(let dy=-2;dy<=2;dy++){const rr=dy==-2?r-1:dy==2?r-1:r;for(let dx=-rr-1;dx<=rr+(big?2:1);dx++)for(let dz=-rr-1;dz<=rr+(big?2:1);dz++){const cxx=big?dx-.5:dx,czz=big?dz-.5:dz;if(cxx*cxx+czz*czz<=rr*rr+.8&&rnd()>.06)lf(x+dx,h+tt+dy,z+dz,111)}}}
 else if(kind==6){const tt=1+(rnd()*2|0);for(let k=1;k<=tt;k++)put(x,h+k,z,110);
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=-1;dy<=1;dy++){if(dx*dx+dz*dz+dy*dy*2<=5&&rnd()>.05)lf(x+dx,h+tt+1+dy,z+dz,111)}}
 else if(kind==2){const ox=wHash(x+1,z)<.5?1:-1,bx=x+ox;for(let k=1;k<=t;k++)put(x,h+k,z,96);put(bx,h+t,z,96);put(bx,h+t+1,z,96);
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=2;dy<=3;dy++){if(Math.abs(dx)+Math.abs(dz)<=(dy==2?3:2)&&!get(bx+dx,h+t+dy,z+dz))put(bx+dx,h+t+dy,z+dz,94)}}
 else{const bi=kind==1;for(let k=1;k<=t;k++)put(x,h+k,z,bi?93:8);
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=t-1;dy<=t+1;dy++){if(Math.abs(dx)+Math.abs(dz)+(dy>t?1:0)<=3&&!get(x+dx,h+dy,z+dz))put(x+dx,h+dy,z+dz,bi?91:4)}}};
for(let x=3;x<N-3;x++)for(let z=3;z<N-3;z++){if(FLAT)continue;const h=HM[x][z],g=get(x,h,z),bi=BM[x][z];if(g!=1&&g!=102&&g!=101&&g!=108&&g!=109)continue;const r=rnd();let k=-1;
 if(bi==1)k=r<.045?(rnd()<.18?1:0):-1;
 else if(bi==2)k=r<.04?1:-1;
 else if(bi==0)k=r<.004?(rnd()<.3?1:0):-1;
 else if(bi==3)k=r<.011?2:-1;
 else if(bi==5)k=r<.003?1:-1;
 else if(bi==6)k=(g==1&&r<.012)?(rnd()<.4?1:0):-1;
 else if(bi==7)k=r<.032?3:-1;
 else if(bi==8)k=(g==108&&r<.035)?4:-1;
 else if(bi==9)k=r<.07?(rnd()<.33?5:6):-1;
 if(k>=0){tree(k,x,h,z);continue}
 if(g==1&&(bi<3||bi==7)&&rnd()<(bi==0?.06:.025))put(x,h+1,z,11+(rnd()*3|0))}
// ---------- Far Lands: o ruído "estoura" e vira paredes esticadas no fim do mapa ----------
BN[10]='Far Lands';
{const BAND=.78,C=N/2;
 for(let x=0;x<N;x++)for(let z=0;z<N;z++){
  const dx=x-C,dz=z-C,ed=Math.max(Math.abs(dx),Math.abs(dz))/C;if(ed<=BAND)continue;
  const q=Math.min(1,(ed-BAND)/(.99-BAND)),xa=Math.abs(dx)>=Math.abs(dz),u=xa?Math.abs(dx):Math.abs(dz),t=(xa?z:x)+(xa?0:57);
  BM[x][z]=10;
  const ws=wVn(t*.05+9,u*.05)*3;
  for(let y=1;y<=H-3;y++){
   const d=wVn(t*.17+7,y*.15+u*.012+3)*.8+wVn(t*.5+31,y*.38+u*.03)*.35;
   if(!(q>.94||d+(1-y/H)*.45>1.12-q*.62))continue;
   let b=6;const st=Math.floor(y/2.2+ws)%6;
   if(st==2)b=7;else if(st==4)b=2;else if(st==5&&wVn(t*.3,y*.4)>.55)b=77;
   if(y<=12&&wVn(t*.35+3,y*.45+u*.04)>.78)b=112;
   put(x,y,z,b)}
  let top=0;
  for(let y=H-3;y>=1;y--){const b=get(x,y,z);
   if(b&&b!=78&&!LEAF(b)&&!plant(b)){if(!top)top=y;
    if(!get(x,y+1,z)&&y>SEA&&(b==6||b==7||b==2||b==77))put(x,y,z,1)}}
  if(top)HM[x][z]=top}}
// ponto de nascimento: terra firme mais próxima do centro
let SPX=N/2,SPZ=N/2;
{let best=null;for(let r=0;r<N/2&&!best;r++)for(let a=-r;a<=r&&!best;a++)for(let c=-r;c<=r;c++){if(Math.max(Math.abs(a),Math.abs(c))!=r)continue;const x=N/2+a,z=N/2+c;
 if(HM[x][z]>SEA+1&&get(x,HM[x][z],z)==1&&get(x,HM[x][z]+1,z)==0){best=[x,z];break}}
 if(best){SPX=best[0]+.5;SPZ=best[1]+.5}}
// ---------- GL ----------
const vs=`attribute vec3 p;attribute vec2 t;attribute float l;uniform mat4 m,uL;uniform float uT,uW;varying vec2 v;varying float s,d;varying vec4 sc;void main(){float wt=step(25.,l),lf=step(5.,l)*(1.-wt);s=l-lf*10.-wt*30.;vec3 q=p;float w=lf*uW;
 q.x+=w*(sin(uT*1.6+p.x*.7+p.z*.5)*.05+sin(uT*3.1+p.y*1.3+p.z)*.02);q.z+=w*(sin(uT*1.3+p.z*.6+p.x*.4)*.045+sin(uT*2.7+p.y+p.x*1.1)*.015);q.y+=w*sin(uT*2.2+p.x+p.z)*.03;q.y+=wt*step(.8,fract(p.y))*(sin(uT*1.7+p.x*1.3+p.z*.9)*.035+sin(uT*2.9-p.x*.8+p.z*1.7)*.02);
 gl_Position=m*vec4(q,1.);v=t;d=gl_Position.w;sc=uL*vec4(p,1.);}`;
const fs=`precision highp float;uniform sampler2D u,uSM;uniform vec2 uF;uniform vec3 uFC;uniform float uB,uSO,uSZ,uPC;varying vec2 v;varying float s,d;varying vec4 sc;
void main(){vec4 c=texture2D(u,v);if(c.a<.1)discard;vec3 col=c.rgb*s*uB;
if(uSO>.5){float sh=1.;vec3 sp=sc.xyz/sc.w*.5+.5;
 if(sp.x>0.&&sp.x<1.&&sp.y>0.&&sp.y<1.&&sp.z<1.){float t=1./uSZ,lit=0.,cn=0.;
  for(int i=-2;i<=2;i++)for(int j=-2;j<=2;j++){if(abs(float(i))>uPC||abs(float(j))>uPC)continue;
   float dd=texture2D(uSM,sp.xy+vec2(float(i),float(j))*t).r;lit+=(sp.z-.0008>dd)?0.:1.;cn+=1.;}
  sh=lit/cn;}
 col*=mix(vec3(.5,.58,.8),vec3(1.06,1.02,.94),sh);}
gl_FragColor=vec4(mix(col,uFC,clamp((d-uF.x)/(uF.y-uF.x),0.,1.)),c.a);}`;
const sh=(ty,s)=>{const o=gl.createShader(ty);gl.shaderSource(o,s);gl.compileShader(o);return o};
const pg=gl.createProgram();gl.attachShader(pg,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pg);gl.useProgram(pg);
const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,AT);
for(const[k,v]of[[gl.TEXTURE_MIN_FILTER,gl.NEAREST],[gl.TEXTURE_MAG_FILTER,gl.NEAREST],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,k,v);
gl.uniform1i(gl.getUniformLocation(pg,'u'),0);gl.enable(gl.DEPTH_TEST);
const mL=gl.getUniformLocation(pg,'m'),AL=['p','t','l'].map(n=>gl.getAttribLocation(pg,n));
const bind=b=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);[[0,3,0],[1,2,12],[2,1,20]].forEach(([i,s,o])=>{gl.enableVertexAttribArray(AL[i]);gl.vertexAttribPointer(AL[i],s,gl.FLOAT,false,24,o)})};
const FC=[[[0,0,1],.85,[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]],[[0,0,-1],.65,[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]],[[0,1,0],1,[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]],[[0,-1,0],.5,[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]],[[1,0,0],.75,[[1,0,1],[1,0,0],[1,1,0],[1,1,1]]],[[-1,0,0],.75,[[0,0,0],[0,0,1],[0,1,1],[0,1,0]]]];
const UV=[[0,1],[1,1],[1,0],[0,0]],QI=[0,1,2,0,2,3];
const quad=(a,vs,tile,s)=>{for(const q of QI)a.push(...vs[q],(tile+UV[q][0])/NT,UV[q][1],s)};
// painel de vidro: poste central + braços até os vizinhos
const D=FC.map(f=>f[0]);
// caixa B=[x0,y0,z0,x1,y1,z1] (coords locais 0..1) com UV contínuo pela posição, face fi, tile e luz s
const bq=(a,x,y,z,B,fi,tile,s)=>{for(const q of QI){const v=FC[fi][2][q],l=[v[0]?B[3]:B[0],v[1]?B[4]:B[1],v[2]?B[5]:B[2]];
 const uv=[[l[0],1-l[1]],[1-l[0],1-l[1]],[l[0],l[2]],[l[0],1-l[2]],[1-l[2],1-l[1]],[l[2],1-l[1]]][fi];
 a.push(x+l[0],y+l[1],z+l[2],(tile+uv[0])/NT,uv[1],s)}};
const bxs=(a,x,y,z,B,tl,skip=[])=>{for(let fi=0;fi<6;fi++)if(!skip.includes(fi))bq(a,x,y,z,B,fi,tl[fi],FC[fi][1])};
// gira uma caixa "canônica" (frente = +z) para a direção f
const rot=(f,[x,y,z])=>{x-=.5;y-=.5;z-=.5;return[[x,y,z],[-x,y,-z],[x,z,-y],[x,-z,y],[z,y,-x],[-z,y,x]][f].map(v=>v+.5)};
// lajes/escadas: id -> textura do material; FULL = bloco inteiro formado por duas lajes
const SLAB_T={85:5,86:6,87:7,97:93,98:97,106:105},STAIR_T={88:5,89:6,90:7,99:93,100:97,107:105},FULL={85:5,86:6,87:7,97:92,98:95,106:105};
const rb=(f,B)=>{const a=rot(f,B.slice(0,3)),b=rot(f,B.slice(3));return[0,1,2].map(i=>Math.min(a[i],b[i])).concat([0,1,2].map(i=>Math.max(a[i],b[i])))};
// escadas: junção em quina (interna/externa) como no Minecraft, conforme as escadas vizinhas
const stairBoxes=(m,x,y,z)=>{const F=HD[m&3],fl=m&16,hf=(a,i)=>a[i]>0?[.5,1]:a[i]<0?[0,.5]:null,
 rr=vs=>{let X=[0,1],Z=[0,1];for(const v of vs){if(v[0])X=hf(v,0);if(v[2])Z=hf(v,2)}return[X[0],Z[0],X[1],Z[1]]},
 st=(dx,dz)=>{const q=get(x+dx,y,z+dz);return STAIR_T[q]?M.get(((x+dx)*H+y)*N+z+dz)||0:-1},
 half=n=>n>=0&&(n&16)==fl,perp=n=>(HD[n&3][0]*F[0]+HD[n&3][2]*F[2])==0,same=n=>n>=0&&(n&19)==(m&19),
 nF=-F[0],nZ=-F[2];let up;
 const f=st(F[0],F[2]),bk=st(-F[0],-F[2]);
 if(half(f)&&perp(f)){const G=HD[f&3];if(!same(st(-G[0],-G[2])))up=[rr([F,G])]}
 if(!up&&half(bk)&&perp(bk)){const G=HD[bk&3];if(!same(st(G[0],G[2])))up=[rr([F]),rr([G,[nF,0,nZ]])]}
 if(!up)up=[rr([F])];
 const yl=fl?0:.5,yh=fl?.5:1;
 return[fl?[0,.5,0,1,1,1]:[0,0,0,1,.5,1]].concat(up.map(r=>[r[0],yl,r[1],r[2],yh,r[3]]))};
// caixas de colisão/desenho de blocos parciais (lajes, escadas, cama, porta fechada)
const bbox=(b,m,x,y,z)=>{const r=B=>rb([0,1,4,5][m&3],B);
 if(SLAB_T[b])return[(m&1)?[0,.5,0,1,1,1]:[0,0,0,1,.5,1]];
 if(STAIR_T[b]){if(x!==undefined)return stairBoxes(m,x,y,z);return(m&16?[[0,.5,0,1,1,1],[0,0,.5,1,.5,1]]:[[0,0,0,1,.5,1],[0,.5,.5,1,1,1]]).map(B=>r(B))}
 if(b==79||b==84)return[[0,0,0,1,.5625,1]];
 if(b==80||b==81)return[r([0,0,0,1,1,.1875])];
 if(b==140)return[[.0625,0,.0625,.9375,.875,.9375]];
 return null};
// painel de vidro: poste central + braços até os vizinhos (sem faces internas)
function paneGeom(a,x,y,z){const hc=b=>b==15||solid(b),lo=.4375,hi=.5625;
 const n=hc(get(x,y,z-1)),s=hc(get(x,y,z+1)),w=hc(get(x-1,y,z)),e=hc(get(x+1,y,z)),none=!(n||s||w||e);
 const tl=[35,35,36,36,35,35];
 const pn_=n||none,ps=s||none,pw=w||none,pe=e||none,sk=[];
 if(pn_)sk.push(1);if(ps)sk.push(0);if(pw)sk.push(5);if(pe)sk.push(4);
 bxs(a,x,y,z,[lo,0,lo,hi,1,hi],tl,sk);
 if(pn_)bxs(a,x,y,z,[lo,0,0,hi,1,lo],tl,[0,1]);
 if(ps)bxs(a,x,y,z,[lo,0,hi,hi,1,1],tl,[0,1]);
 if(pw)bxs(a,x,y,z,[0,0,lo,lo,1,hi],tl,[4,5]);
 if(pe)bxs(a,x,y,z,[hi,0,lo,1,1,hi],tl,[4,5])}
let SB=gl.createBuffer(),PB=gl.createBuffer(),TB=gl.createBuffer(),sn=0,pn=0,tn=0;
const CHK=[];
function meshChunk(ci){const S=[],P=[],Tr=[],cx0=((ci/NC)|0)<<4,cz0=(ci%NC)<<4;
 for(let x=cx0;x<cx0+16;x++)for(let y=0;y<H;y++)for(let z=cz0;z<cz0+16;z++){const b=W[(x*H+y)*N+z];if(!b)continue;
  const k=(x*H+y)*N+z;
  if(b==15){paneGeom(P,x,y,z);continue}
  if(b==140){const fr=[0,1,4,5][(M.get(k)||0)&3],tl=[0,1,2,3,4,5].map(i=>i==fr?150:(i==2||i==3)?148:149);bxs(S,x,y,z,[.0625,0,.0625,.9375,.875,.9375],tl);continue}
  if(b==64){bxs(S,x,y,z,[.25,.25,.25,.75,.75,.75],Array(6).fill(43));
   FC.forEach(([n,s],fi)=>{const nb=get(x+n[0],y+n[1],z+n[2]);if(nb==64||!trans(nb))return;bq(Tr,x,y,z,[0,0,0,1,1,1],fi,42,s)});continue}
  if(b==65||b==66||(b>=68&&b<=71)){const f=M.get(k)||0,st=b==66||b==69||b==71,tp=st?39:38,bk=f^1;
   const tl=(F,Bk,Sd)=>[0,1,2,3,4,5].map(i=>i==f?F:i==bk?Bk:Sd),pr=B=>rb(f,B);
   if(b<68)bxs(S,x,y,z,[0,0,0,1,1,1],tl(tp,40,37));
   else if(b<70){bxs(S,x,y,z,pr([0,0,0,1,1,.75]),tl(40,40,37));bxs(S,x,y,z,pr([.375,.375,.75,.625,.625,1]),tl(5,5,5))}
   else{bxs(S,x,y,z,pr([0,0,.75,1,1,1]),tl(tp,5,5));bxs(S,x,y,z,pr([.375,.375,0,.625,.625,.75]),tl(5,5,5))}continue}
  if(b==67){const m=M.get(k)||0,f=(m&7)^1,sg=m&8?1:-1;
   bxs(P,x,y,z,rb(f,[.3125,.25,0,.6875,.75,.125]),Array(6).fill(7));
   for(let q=0;q<4;q++){const cy=.5+sg*(.05+q*.1);bxs(P,x,y,z,rb(f,[.4375,cy-.0625,.1+q*.07,.5625,cy+.0625,.2+q*.07]),Array(6).fill(41))}continue}
  if(b==72){const p=PW.get(k)||0,s=p?.5+.5*p/15:.38,h=.03,cn=[0,1,2,3].map(i=>conn(x,y,z,i)),n=cn.filter(Boolean).length;
   const arm=[[.4375,0,.6875,.5625,h,1],[.4375,0,0,.5625,h,.3125],[.6875,0,.4375,1,h,.5625],[0,0,.4375,.3125,h,.5625]];
   bq(P,x,y,z,[.3125,0,.3125,.6875,h,.6875],2,76,s);
   arm.forEach((B,i)=>{if(n==0||cn[i]||(n==1&&cn[i^1]))bq(P,x,y,z,B,2,76,s)});continue}
  if(b==74||b==75){const m=M.get(k)||0,f=m&3,pr=B=>rb([0,1,4,5][f],B),rp=b==74,on=rp?(m>>4)&1:((m>>3)&15)>0,cm=(m>>2)&1;
   bxs(S,x,y,z,[0,0,0,1,.125,1],[83,83,rp?(on?80:79):(on?82:81),83,83,83]);
   const tor=(tx,tz,lit)=>{const B=pr([tx-.0625,.125,tz-.0625,tx+.0625,.4375,tz+.0625]);for(let fi=0;fi<6;fi++)bq(P,x,y,z,B,fi,76,(lit?1:.35)*FC[fi][1])};
   if(rp){tor(.5,.2,on);tor(.5,.45+.12*((m>>2)&3),on)}else{tor(.5,.2,on);tor(.25,.7,cm);tor(.75,.7,cm)}continue}
  if(b==76){const m=M.get(k)||0,f=m&7,on=(m>>3)&1;
   bxs(S,x,y,z,[0,0,0,1,1,1],[0,1,2,3,4,5].map(i=>i==f?84:i==(f^1)?(on?87:86):85));continue}
  if(b==79||b==84){const m=M.get(k)||0,pr=B=>rb([0,1,4,5][m&3],B),hd=b==84,ad=(B,t)=>bxs(S,x,y,z,pr(B),Array(6).fill(t));
   ad([0,.1875,0,1,.3125,1],5);
   if(!hd){ad([0,0,0,.1875,.1875,.1875],5);ad([.8125,0,0,1,.1875,.1875],5);ad([0,.3125,0,1,.5625,1],33);ad([0,.1875,0,1,.5,.0625],5)}
   else{ad([0,0,.8125,.1875,.1875,1],5);ad([.8125,0,.8125,1,.1875,1],5);ad([0,.3125,0,1,.5625,.45],33);ad([0,.3125,.45,1,.5625,1],19);ad([.08,.5625,.6,.92,.6875,.95],19);ad([0,.1875,.9375,1,.8,1],5)}
   continue}
  if(b>=80&&b<=83){const m=M.get(k)||0,open=b>=82,up=b==81||b==83,pr=B=>rb([0,1,4,5][m&3],B),
    B=pr(open?[0,0,0,.1875,1,1]:[0,0,0,1,1,.1875]),thx=B[3]-B[0]<.3,e=91,Dt=up?90:89;
   bxs(P,x,y,z,B,thx?[e,e,e,e,Dt,Dt]:[Dt,Dt,e,e,e,e]);continue}
  if(SLAB_T[b]||STAIR_T[b]){const m=M.get(k)||0,tl=Array(6).fill(SLAB_T[b]||STAIR_T[b]);for(const B of bbox(b,m,x,y,z))bxs(S,x,y,z,B,tl);continue}
  if(b==78||b==112){const lava=b==112,top=get(x,y+1,z)!=b,fh=(X,Z)=>{const l=M.get((X*H+y)*N+Z)||0;return get(X,y+1,Z)==b?1:(l>0&&l<8?.875-l*(lava?.2:.105):.875)},hh=top?fh(x,z):1;
   FC.forEach(([n,s,vv])=>{const nx=x+n[0],nz=z+n[2];if(nx<0||nz<0||nx>=N||nz>=N)return;const nb=get(nx,y+n[1],nz);let lo=0;if(nb==b){if(n[1])return;lo=fh(nx,nz);if(lo>=hh-.001)return}else if(!trans(nb))return;
    quad(Tr,vv.map(v=>[x+v[0],y+(v[1]?hh:(n[1]?0:lo)),z+v[2]]),lava?115:88,(lava?1:s)+30)});continue}
  if(plant(b)){const t=b+2,d=.38,cx=x+.5,cz=z+.5;
   quad(P,[[cx-d,y,cz-d],[cx+d,y,cz+d],[cx+d,y+1,cz+d],[cx-d,y+1,cz-d]],t,1);
   quad(P,[[cx-d,y,cz+d],[cx+d,y,cz-d],[cx+d,y+1,cz-d],[cx-d,y+1,cz+d]],t,.88);continue}
  FC.forEach(([n,s,vv],fi)=>{const nb=get(x+n[0],y+n[1],z+n[2]);if(!(trans(nb)&&!(b==nb&&(LEAF(b)||b==14))))return;
   const tt=TT[b];const tile=b==9&&fi==0?10:b==10&&fi==0?12:fi==2?tt[0]:fi==3?tt[1]:tt[2];
   quad(S,vv.map(v=>[x+v[0],y+v[1],z+v[2]]),tile,LEAF(b)?s+10:s)})}
 CHK[ci]=[new Float32Array(S),new Float32Array(P),new Float32Array(Tr)]}
function rebuild(){for(const ci of DIRTY)meshChunk(ci);DIRTY.clear();
 const up=(i,B)=>{let t=0;for(const c of CHK)t+=c[i].length;const a=new Float32Array(t);let o=0;for(const c of CHK){a.set(c[i],o);o+=c[i].length}
  gl.bindBuffer(gl.ARRAY_BUFFER,B);gl.bufferData(gl.ARRAY_BUFFER,a,gl.STATIC_DRAW);return t/6};
 sn=up(0,SB);pn=up(1,PB);tn=up(2,TB)}
rebuild();
const LB=gl.createBuffer();
// ---------- Jogador ----------
const P={x:SPX,y:HM[SPX|0][SPZ|0]+3,z:SPZ,vx:0,vy:0,vz:0,yaw:0,pit:-.2,fly:false,gr:false};
const hit=(x,y,z)=>{for(let a=Math.floor(x-.3);a<=Math.floor(x+.3);a++)for(let b=Math.floor(y);b<=Math.floor(y+1.8);b++)for(let c=Math.floor(z-.3);c<=Math.floor(z+.3);c++){const q=get(a,b,c);if(!solid(q))continue;const bs=bbox(q,M.get((a*H+b)*N+c)||0,a,b,c);if(!bs)return true;
 for(const B of bs)if(x+.3>a+B[0]&&x-.3<a+B[3]&&y+1.8>b+B[1]&&y<b+B[4]&&z+.3>c+B[2]&&z-.3<c+B[5])return true}return false};
const K={};addEventListener('keydown',e=>{if(e.target.id=='q')return;K[e.code]=1;
 if(e.code=='KeyF')P.fly=!P.fly;if(e.code=='KeyE'){if($('chs').classList.contains('open'))togCh(false);else if(crEl.classList.contains('open'))togCr(false);else togInv()}
 if(e.key>='1'&&e.key<='9'){sel=+e.key-1;hud()}});
addEventListener('keyup',e=>K[e.code]=0);
let locked=false;
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement==cv;$('st').style.display=locked||inv.classList.contains('open')||crEl.classList.contains('open')||$('chs').classList.contains('open')?'none':'flex'});

addEventListener('mousemove',e=>{if(!locked)return;P.yaw+=e.movementX*.005*CFG.sens;P.pit=Math.max(-1.55,Math.min(1.55,P.pit-e.movementY*.005*CFG.sens))});
addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('wheel',e=>{if(locked){sel=(sel+(e.deltaY>0?1:8))%9;hud()}},{passive:true});
const dirv=()=>{const cp=Math.cos(P.pit);return[Math.sin(P.yaw)*cp,Math.sin(P.pit),-Math.cos(P.yaw)*cp]};
let tg=null;
function ray(){const d=dirv(),e=[P.x,P.y+1.62,P.z];let pv=null;
 for(let t=0;t<6;t+=.03){const b=[Math.floor(e[0]+d[0]*t),Math.floor(e[1]+d[1]*t),Math.floor(e[2]+d[2]*t)];
  {const q=get(...b);if(q&&q!=78&&q!=112){tg={b,pv,fy:e[1]+d[1]*t-b[1]};return}}
  if(!pv||pv[0]!=b[0]||pv[1]!=b[1]||pv[2]!=b[2])pv=b}tg=null}
addEventListener('mousedown',e=>{if(!locked||!tg)return;ray();if(!tg)return;
 if(e.button==0){brk(...tg.b)}
 else if(e.button==2&&get(...tg.b)==10){togCr(true)}
 else if(e.button==2&&get(...tg.b)==67){const[x,y,z]=tg.b,k=(x*H+y)*N+z;M.set(k,(M.get(k)||0)^8);redstone();rebuild()}
 else if(e.button==2&&(get(...tg.b)==74||get(...tg.b)==75)){const[x,y,z]=tg.b,k=(x*H+y)*N+z,m=M.get(k)||0;
  M.set(k,get(x,y,z)==74?(m&~12)|((((m>>2)&3)+1&3)<<2):m^4);redstone();rebuild()}
 else if(e.button==2&&!K.ShiftLeft&&get(...tg.b)>=80&&get(...tg.b)<=83){toggleDoor(...tg.b)}
 else if(e.button==2&&!K.ShiftLeft&&get(...tg.b)==79){sleepBed(tg.b[0],tg.b[2])}
 else if(e.button==2&&!K.ShiftLeft&&get(...tg.b)==140){openChest(...tg.b)}
 else if(e.button==2&&tg.pv){place(tg.pv,tg.b)}});
// ---------- Colocar / quebrar ----------
function place(q,sup){const b=hotb[sel],d=dirv();if(!b)return;
 if(b==67){const s=D.findIndex(v=>sup[0]-q[0]==v[0]&&sup[1]-q[1]==v[1]&&sup[2]-q[2]==v[2]);if(s<0)return;putm(...q,67,s)}
 else if(b==72){if(!solid(get(q[0],q[1]-1,q[2])))return;put(...q,72)}
 else if(b==74||b==75){if(!solid(get(q[0],q[1]-1,q[2])))return;let f=0,bv=-9;HD.forEach((v,i)=>{const s=v[0]*d[0]+v[2]*d[2];if(s>bv){bv=s;f=i}});putm(...q,b,f)}
 else if(b==65||b==66||b==76){let f=0,bv=-9;D.forEach((v,i)=>{const s=-(v[0]*d[0]+v[1]*d[1]+v[2]*d[2]);if(s>bv){bv=s;f=i}});putm(...q,b,f)}
 else if(b==79||b==80){if(!solid(get(q[0],q[1]-1,q[2])))return;let f=0,bv=-9;HD.forEach((v,i)=>{const s=v[0]*d[0]+v[2]*d[2];if(s>bv){bv=s;f=i}});
  if(b==80){const ub=get(q[0],q[1]+1,q[2]);if(q[1]+1>=H||ub&&ub!=78&&!plant(ub))return;putm(...q,80,f);putm(q[0],q[1]+1,q[2],81,f)}else{const e=HD[f],hx=q[0]+e[0],hz=q[2]+e[2],hb=get(hx,q[1],hz);if(hb&&hb!=78&&!plant(hb)||!solid(get(hx,q[1]-1,hz)))return;putm(...q,79,f);putm(hx,q[1],hz,84,f)}}
 else if(SLAB_T[b]){const sm=M.get((sup[0]*H+sup[1])*N+sup[2])||0;
  if(get(...sup)==b&&((q[1]>sup[1]&&!(sm&1))||(q[1]<sup[1]&&(sm&1)))){put(...sup,FULL[b]);if(hit(P.x,P.y,P.z))putm(...sup,b,sm);redstone();rebuild();return}
  putm(...q,b,(q[1]<sup[1]||(q[1]==sup[1]&&tg&&tg.fy>.5))?1:0)}
 else if(STAIR_T[b]){let f=0,bv=-9;HD.forEach((v,i)=>{const s=v[0]*d[0]+v[2]*d[2];if(s>bv){bv=s;f=i}});
  putm(...q,b,f|((q[1]<sup[1]||(q[1]==sup[1]&&tg&&tg.fy>.5))?16:0))}
 else if(b==140){let f=0,bv=-9;HD.forEach((v,i)=>{const s=-(v[0]*d[0]+v[2]*d[2]);if(s>bv){bv=s;f=i}});putm(...q,140,f)}
 else if(b==136){put(...q,b);for(let a=-3;a<=3;a++)for(let c=-3;c<=3;c++)for(let e=-3;e<=3;e++)if(get(q[0]+a,q[1]+c,q[2]+e)==78)put(q[0]+a,q[1]+c,q[2]+e,0)}
 else put(...q,b);
 if(hit(P.x,P.y,P.z)){const mf=M.get((q[0]*H+q[1])*N+q[2])||0;put(...q,0);if(b==80)put(q[0],q[1]+1,q[2],0);if(b==79){const e=HD[mf&3];put(q[0]+e[0],q[1],q[2]+e[2],0)}}else{redstone();rebuild()}}
// porta: alterna aberta/fechada (as duas metades); cama: define o ponto de renascimento
function toggleDoor(x,y,z){const lo=(get(x,y,z)==80||get(x,y,z)==82)?y:y-1,f=M.get((x*H+lo)*N+z)||0,open=get(x,lo,z)==80;
 putm(x,lo,z,open?82:80,f);putm(x,lo+1,z,open?83:81,f);
 if(!open&&hit(P.x,P.y,P.z)){putm(x,lo,z,82,f);putm(x,lo+1,z,83,f)}rebuild()}
function sleepBed(x,z){SPX=x+.5;SPZ=z+.5;const n=$('nm');n.textContent='Ponto de renascimento definido';clearTimeout(nmT);nmT=setTimeout(()=>n.textContent='',1800)}
function brk(x,y,z){const b=get(x,y,z);if(b==140)CH.delete((x*H+y)*N+z);const f=M.get((x*H+y)*N+z)||0,d=D[f];
 if(b==70||b==71){const a=x-d[0],c=y-d[1],e=z-d[2];if(get(a,c,e)==b-2)putm(a,c,e,b==70?65:66,f)}
 else if((b==68||b==69)&&get(x+d[0],y+d[1],z+d[2])==b+2)put(x+d[0],y+d[1],z+d[2],0);
 if(b==79){const e=HD[f&3];if(get(x+e[0],y,z+e[2])==84)put(x+e[0],y,z+e[2],0)}if(b==84){const e=HD[f&3];if(get(x-e[0],y,z-e[2])==79)put(x-e[0],y,z-e[2],0)}if(b==80||b==82)put(x,y+1,z,0);if(b==81||b==83)put(x,y-1,z,0);
 put(x,y,z,0);redstone();rebuild()}
// ---------- Redstone simples: alavanca ligada alimenta pistões encostados nela ou no bloco onde está presa ----------
// conjunto de blocos a mover (máx. 12); slime arrasta vizinhos; null = bloqueado
function mset(sx,sy,sz,d,skip){const seen=new Set(),L=[],inb=(x,y,z)=>x>=0&&y>=0&&z>=0&&x<N&&y<H&&z<N;
 const add=(x,y,z)=>{if(!inb(x,y,z))return false;const b=get(x,y,z),k=(x*H+y)*N+z;
  if(k==skip||!b||plant(b)||b==72||b==78||b==112||seen.has(k))return true;
  if((b>=68&&b<=71)||b==77||(b>=79&&b<=84))return false;
  seen.add(k);L.push([x,y,z,b]);if(L.length>12)return false;
  if(!add(x+d[0],y+d[1],z+d[2]))return false;
  if(b==64)for(const e of D)if(inb(x+e[0],y+e[1],z+e[2])&&!add(x+e[0],y+e[1],z+e[2]))return false;
  return true};
 return add(sx,sy,sz)?L:null}
function moveSet(L,d){const mv=L.map(([a,c,e,bb])=>[a,c,e,bb,M.get((a*H+c)*N+e)]);
 mv.forEach(([a,c,e])=>put(a,c,e,0));
 mv.forEach(([a,c,e,bb,m])=>{const nx=a+d[0],ny=c+d[1],nz=e+d[2];if(m===undefined)put(nx,ny,nz,bb);else putm(nx,ny,nz,bb,m)});
 if(hit(P.x,P.y,P.z)){P.x+=d[0];P.y+=d[1];P.z+=d[2];if(hit(P.x,P.y,P.z))P.y+=1;
  if(d[1]&&L.some(q=>q[3]==64))P.vy=d[1]*14}}
function extend(x,y,z,b,f){const d=D[f],L=mset(x+d[0],y+d[1],z+d[2],d,(x*H+y)*N+z);if(!L)return false;
 moveSet(L,d);putm(x,y,z,b+3,f);putm(x+d[0],y+d[1],z+d[2],b==65?70:71,f);return true}
function retract(x,y,z,b,f){const d=D[f];
 if(get(x+d[0],y+d[1],z+d[2])==b+2)put(x+d[0],y+d[1],z+d[2],0);
 putm(x,y,z,b-3,f);
 if(b==69){const m=[-d[0],-d[1],-d[2]],L=mset(x+2*d[0],y+2*d[1],z+2*d[2],m,-1);if(L&&L.length)moveSet(L,m)}}
// fontes de sinal [Lx,Ly,Lz,Sx,Sy,Sz,nível] da última passada, usadas pelo repetidor/comparador/observador
let ON=[],RC={r:[],c:[],o:[]};
const ix=(x,y,z)=>(x*H+y)*N+z;
function lv(x,y,z){let m=get(x,y,z)==72?(PW.get(ix(x,y,z))||0):0;
 for(const l of ON)if(Math.abs(l[0]-x)+Math.abs(l[1]-y)+Math.abs(l[2]-z)<=1||Math.abs(l[3]-x)+Math.abs(l[4]-y)+Math.abs(l[5]-z)<=1)m=Math.max(m,l[6]||15);return m}
// entrada lateral do comparador: fio, ou repetidor/comparador ao lado apontando para ele
function slv(x,y,z,tx,ty,tz){const b=get(x,y,z),m=M.get(ix(x,y,z))||0;
 if(b==72)return PW.get(ix(x,y,z))||0;
 if(b==74||b==75){const e=HD[m&3];if(x+e[0]==tx&&y==ty&&z+e[2]==tz)return b==74?((m>>4)&1?15:0):((m>>3)&15)}return 0}
function redstone(){let ch=1,it=0;
 while(ch&&it++<4){ch=0;const on=[],ps=[],ds=[],rr=[],rcm=[],ro=[];
  for(let x=0;x<N;x++)for(let y=0;y<H;y++)for(let z=0;z<N;z++){const k=(x*H+y)*N+z,b=W[k];
   if(b==67){const m=M.get(k)||0,d=D[m&7];if(!get(x+d[0],y+d[1],z+d[2])){put(x,y,z,0);ch=1;continue}if(m&8)on.push([x,y,z,x+d[0],y+d[1],z+d[2]])}
   else if(b==74||b==75){if(!solid(get(x,y-1,z))){put(x,y,z,0);ch=1;continue}
    const m=M.get(k)||0,e=HD[m&3],out=b==74?((m>>4)&1?15:0):((m>>3)&15);(b==74?rr:rcm).push([x,y,z]);
    if(out)on.push([x+e[0],y,z+e[2],x+e[0],y,z+e[2],out])}
   else if(b==76){const m=M.get(k)||0,e=D[m&7];ro.push([x,y,z]);if((m>>3)&1){const a=x-e[0],c=y-e[1],d=z-e[2];on.push([a,c,d,a,c,d,15])}}
   else if(b==73)on.push([x,y,z,x,y,z]);
   else if(b==72){if(!solid(get(x,y-1,z))){put(x,y,z,0);ch=1;continue}ds.push([x,y,z])}
   else if(b==65||b==66||b==68||b==69)ps.push([x,y,z,b,M.get(k)||0])}
  const near=(a,c,e,p)=>Math.abs(a-p[0])+Math.abs(c-p[1])+Math.abs(e-p[2]);
  // propagação do sinal pelo fio: 15 na fonte, -1 a cada bloco
  PW.clear();const q=[],dk=p=>(p[0]*H+p[1])*N+p[2];
  ON=on;RC={r:rr,c:rcm,o:ro};
  for(const d of ds){let lvl=0;for(const l of on)if(near(l[0],l[1],l[2],d)==1||near(l[3],l[4],l[5],d)<=1)lvl=Math.max(lvl,l[6]||15);
   if(lvl){PW.set(dk(d),lvl);q.push(d)}}
  for(let qi=0;qi<q.length;qi++){const c=q[qi],pv=PW.get(dk(c));if(pv<=1)continue;
   for(let i=0;i<4;i++){const n=conn(c[0],c[1],c[2],i);if(n&&(PW.get(dk(n))||0)<pv-1){PW.set(dk(n),pv-1);q.push(n)}}}
  for(const p of ps){const[x,y,z,b,f]=p;if(get(x,y,z)!=b)continue;
   const pw=on.some(l=>near(l[0],l[1],l[2],p)==1||near(l[3],l[4],l[5],p)<=1)||ds.some(d=>(PW.get(dk(d))||0)>0&&near(d[0],d[1],d[2],p)==1);
   if(pw&&b<68){if(extend(x,y,z,b,f))ch=1}else if(!pw&&b>=68){retract(x,y,z,b,f);ch=1}}}}
// ---------- Fluidos que escorrem (água e lava) ----------
// nível guardado em M: 0 = fonte · 1..7 = escorrendo na horizontal (água até 7, lava até 3) · 8 = caindo
const FMX={78:7,112:3},FS={78:new Set(),112:new Set()},NB6=[[0,1,0],[0,-1,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]];
const frepl=b=>b==0||(b>=11&&b<=13);
function wake(x,y,z){for(let i=-1;i<6;i++){const e=i<0?[0,0,0]:NB6[i],X=x+e[0],Y=y+e[1],Z=z+e[2];
 if(X>=0&&Y>=0&&Z>=0&&X<N&&Y<H&&Z<N){const k=(X*H+Y)*N+Z;FS[78].add(k);FS[112].add(k)}}}
function evalFl(F,k){
 const z=k%N,r=(k-z)/N,y=r%H,x=(r-y)/H,b=get(x,y,z),mx=FMX[F],lm=(X,Y,Z)=>M.get((X*H+Y)*N+Z)||0;
 // água + lava: fonte de lava vira obsidiana, lava corrente vira pedregulho
 if(b==78){for(const e of NB6){const X=x+e[0],Y=y+e[1],Z=z+e[2];if(get(X,Y,Z)==112)put(X,Y,Z,lm(X,Y,Z)?7:77)}}
 else if(b==112&&NB6.some(e=>get(x+e[0],y+e[1],z+e[2])==78)){put(x,y,z,lm(x,y,z)?7:77);return}
 if(b!=F&&!frepl(b))return;
 const cur=b==F?lm(x,y,z):-1;if(cur==0)return;
 // água infinita: dois lados com fonte e chão firme
 if(F==78){let s=0;for(let i=2;i<6;i++){const e=NB6[i];if(get(x+e[0],y,z+e[2])==78&&!lm(x+e[0],y,z+e[2]))s++}
  if(s>=2){const bl=get(x,y-1,z);if(y==0||solid(bl)||(bl==78&&!lm(x,y-1,z))){put(x,y,z,78);return}}}
 let nl=99;
 if(get(x,y+1,z)==F)nl=8;
 else for(let i=2;i<6;i++){const e=NB6[i],X=x+e[0],Z=z+e[2];if(get(X,y,Z)!=F)continue;
  const l=lm(X,y,Z),bl=get(X,y-1,Z),sup=l==0||y==0||(!frepl(bl)&&bl!=F)||(bl==F&&lm(X,y-1,Z)==0);
  if(!sup)continue;const v=(l==8?0:l)+1;if(v<=mx&&v<nl)nl=v}
 if(nl==99){if(cur>=0)put(x,y,z,0);return}
 if(cur!=nl)putm(x,y,z,F,nl)}
function fluidTick(F){const S=FS[F];if(!S.size||PAUSED())return;
 const ks=[...S].slice(0,3000);for(const k of ks)S.delete(k);for(const k of ks)evalFl(F,k);if(DIRTY.size)rebuild()}
setInterval(()=>fluidTick(78),250);setInterval(()=>fluidTick(112),1000);
FLOWON=true;
// ---------- Gravidade do pó de concreto ----------
setInterval(()=>{if(!gd)return;gd=0;let mv=false;
 for(let x=0;x<N;x++)for(let z=0;z<N;z++)for(let y=1;y<H;y++){const b=W[(x*H+y)*N+z];
  if(b>=48&&b<=63){const o=get(x,y-1,z);if(!o||plant(o)||o==78){put(x,y-1,z,b);put(x,y,z,0);mv=true}}}
 if(mv){redstone();rebuild()}},80);
// ---------- Tick de redstone (100 ms): atrasos do repetidor/comparador e pulso do observador ----------
const OBS=new Map(),RT=new Map();
const sig=(x,y,z)=>{const k=ix(x,y,z);return get(x,y,z)*1e6+(M.get(k)||0)*100+(PW.get(k)||0)};
function rtick(){let ch=false;const live=new Set();
 const step=(k,v,n,apply)=>{const t=RT.get(k);if(!t||t.v!=v)RT.set(k,{v,n});else if(--t.n<=0){RT.delete(k);apply();ch=true}};
 for(const[x,y,z]of RC.r){const k=ix(x,y,z),m=M.get(k)||0,f=m&3,e=HD[f],on=(m>>4)&1,inp=lv(x-e[0],y,z-e[2])>0?1:0;
  if(inp!=on)step(k,inp,((m>>2)&3)+1,()=>M.set(k,(m&~16)|(inp<<4)));else RT.delete(k)}
 for(const[x,y,z]of RC.c){const k=ix(x,y,z),m=M.get(k)||0,f=m&3,e=HD[f],mode=(m>>2)&1,out=(m>>3)&15;
  const sd=f<2?[[1,0,0],[-1,0,0]]:[[0,0,1],[0,0,-1]],side=Math.max(...sd.map(s=>slv(x+s[0],y,z+s[2],x,y,z))),back=lv(x-e[0],y,z-e[2]);
  const nv=mode?Math.max(back-side,0):(back>=side?back:0);
  if(nv!=out)step(k,nv,1,()=>M.set(k,(m&~120)|(nv<<3)));else RT.delete(k)}
 for(const[x,y,z]of RC.o){const k=ix(x,y,z),m=M.get(k)||0,e=D[m&7],sg=sig(x+e[0],y+e[1],z+e[2]);live.add(k);
  if((m>>3)&1){M.set(k,m&~8);OBS.set(k,sg);ch=true}
  else if(OBS.has(k)&&OBS.get(k)!=sg){M.set(k,m|8);OBS.set(k,sg);ch=true}
  else if(!OBS.has(k))OBS.set(k,sg)}
 for(const k of OBS.keys())if(!live.has(k))OBS.delete(k);
 if(ch){redstone();rebuild()}}
setInterval(rtick,100);
