// ---------- Sumon Assistente dentro do chat do Sumon Craft ----------
// Carregue DEPOIS de topbar.js. Usa só o que já existe no motor: get/put/putm/M/CH/rebuild/redstone/P/tg/NAMES/N/H.
// Fluxo: chat -> mensagem + contexto do jogador -> backend do Sumon (HTTP, sem chaves aqui) -> texto + ação opcional
//        -> validação -> plano em lote -> aplicação única -> rebuild() uma vez.
(()=>{
const LIM={maxOps:190,maxBlocks:1000000,confirmBlocks:2000,confirmOver:300,maxSide:256,timeout:120000};
// blocos que NÃO podem ser colocados por ação (partes internas, redstone/peças com estado, portas/camas de 2 partes, lava, baú)
const BAD=new Set([65,66,67,68,69,70,71,72,74,75,76,79,80,81,82,83,84,112,140]);
const okId=b=>Number.isInteger(b)&&b>=1&&b<=140&&!BAD.has(b)&&!!NAMES[b];
const SID=Math.random().toString(36).slice(2)+Date.now().toString(36);
let reqN=0,hist=[],pend=null,clip=null,undo=null,sel={a:null,b:null},lastText='';
const say=t=>window.chatSay&&window.chatSay('[Sumon] '+t);
const active=()=>!!(window.sumonActive&&window.sumonActive());
// endereço do backend: /sumon url (salvo) > window.SUMON_URL > mesmo servidor do jogo (/api/craft), quando servido por http(s)
const url=()=>{let u='';try{u=localStorage.getItem('sc.sumon.url')||''}catch(e){}
 return u||window.SUMON_URL||(/^https?:$/.test(location.protocol)?location.origin+'/api/craft':'')};
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const E=(code,extra)=>Object.assign(new Error(code),{code,extra});
const MSG={coord:'Não entendi uma das posições da construção.',bounds:'Não consegui executar essa construção porque a área está fora dos limites do mundo.',
 toobig:'Essa construção é grande demais para eu fazer de uma vez.',block:'Essa construção usa um bloco que não existe no jogo ou que eu não posso colocar.',
 nosel:'Selecione a construção que você quer usar (olhe para um bloco e digite /pos1, depois /pos2 no canto oposto).',noclip:'Ainda não copiei nada. Peça para eu copiar uma construção primeiro.',
 badop:'Essa ação ainda não é suportada pelo Sumon Craft.',badaction:'Recebi uma ação que não consegui validar, então não executei nada.',ops:'Foram pedidas operações demais de uma vez.',
 needpos:'Preciso saber onde você quer colocar a construção.',empty:'Não havia nada para alterar.'};

// ---------- orientação real do jogador ----------
// yaw 0 olha para -z; frente = (sin yaw, -cos yaw); direita = (cos yaw, sin yaw) (mesma convenção do loop.js). Para construir alinhado, a frente é "travada" no eixo mais próximo.
const FN={'1,0':'leste (+x)','-1,0':'oeste (-x)','0,1':'sul (+z)','0,-1':'norte (-z)'};
function frame(){const fx=Math.sin(P.yaw),fz=-Math.cos(P.yaw);
 const F=Math.abs(fx)>Math.abs(fz)?[fx>0?1:-1,0]:[0,fz>0?1:-1];return{F,R:[-F[1],F[0]]}}
function snap(){const{F,R}=frame();return{F,R,base:[Math.floor(P.x),Math.floor(P.y+.01),Math.floor(P.z)],pos:[P.x,P.y,P.z],yaw:P.yaw,pit:P.pit}}
const xyz=a=>a?{x:a[0],y:a[1],z:a[2]}:null;
const selSize=()=>sel.a&&sel.b?[0,1,2].map(i=>Math.abs(sel.a[i]-sel.b[i])+1):null;
function context(s){const pal={};for(let b=1;b<=140;b++)if(okId(b))pal[b]=NAMES[b];
 const t=(typeof tg!=='undefined'&&tg)?tg.b:null;
 return{player:{position:{x:+s.pos[0].toFixed(2),y:+s.pos[1].toFixed(2),z:+s.pos[2].toFixed(2)},block:xyz(s.base),
   rotation:{yaw:+s.yaw.toFixed(3),pitch:+s.pit.toFixed(3)},facing:FN[s.F.join(',')],
   forward:{x:s.F[0],y:0,z:s.F[1]},right:{x:s.R[0],y:0,z:s.R[1]},up:{x:0,y:1,z:0}},
  target_block:t?{x:t[0],y:t[1],z:t[2],id:get(...t),name:NAMES[get(...t)]||null}:null,
  selection:sel.a&&sel.b?{pos1:xyz(sel.a),pos2:xyz(sel.b),size:xyz(selSize())}:(sel.a?{pos1:xyz(sel.a)}:null),
  has_clipboard:!!clip,
  world:{size:{x:N,y:H,z:N},sea_level:SEA,axes:'x cresce para leste, z cresce para sul, y para cima; y=0 é protegido'},
  coordinate_formats:'absoluto [x,y,z] ou relativo ao jogador {"forward":n,"right":n,"up":n} (a partir do bloco dos pés)',
  limits:{max_ops:LIM.maxOps,max_blocks:LIM.maxBlocks,confirm_above_blocks:LIM.confirmBlocks},
  palette:pal}}

// ---------- coordenadas, blocos, regiões ----------
function pt(c,s){let x,y,z;
 if(Array.isArray(c)&&c.length==3)[x,y,z]=c.map(Number);
 else if(c&&typeof c=='object'){
  if('x' in c&&'y' in c&&'z' in c){x=+c.x;y=+c.y;z=+c.z}
  else{const f=+(c.forward??c.f??0),r=+(c.right??c.r??0),u=+(c.up??c.u??0);
   x=s.base[0]+f*s.F[0]+r*s.R[0];y=s.base[1]+u;z=s.base[2]+f*s.F[1]+r*s.R[1]}}
 else throw E('coord');
 if(![x,y,z].every(Number.isFinite))throw E('coord');return[Math.round(x),Math.round(y),Math.round(z)]}
const inB=p=>p[0]>=0&&p[0]<N&&p[1]>=1&&p[1]<H&&p[2]>=0&&p[2]<N;
function bid(b){if(b===0||b==null)return 0;
 if(typeof b=='number'){if(!okId(b))throw E('block');return b}
 const n=norm(b);if(['ar','air','vazio','nada'].includes(n))return 0;
 if(/^\d+$/.test(n)){const v=+n;if(!okId(v))throw E('block');return v}
 for(const k in NAMES)if(norm(NAMES[k])===n){if(!okId(+k))throw E('block');return+k}
 throw E('block')}
const needsMeta=b=>(typeof SLAB_T!=='undefined'&&SLAB_T[b])||(typeof STAIR_T!=='undefined'&&STAIR_T[b]);
function box(a,b){const lo=[0,1,2].map(i=>Math.min(a[i],b[i])),hi=[0,1,2].map(i=>Math.max(a[i],b[i]));
 if(!inB(lo)||!inB(hi))throw E('bounds');const sz=[0,1,2].map(i=>hi[i]-lo[i]+1);
 if(sz.some(v=>v>LIM.maxSide)||sz[0]*sz[1]*sz[2]>LIM.maxBlocks)throw E('toobig');return{lo,hi,sz}}
function region(op,s){if(op.from!=null&&op.to!=null)return box(pt(op.from,s),pt(op.to,s));
 if(sel.a&&sel.b)return box(sel.a,sel.b);throw E('nosel')}
const ix=(x,y,z)=>(x*H+y)*N+z;

// ---------- plano em lote (nada é alterado enquanto o plano é montado) ----------
function Plan(){const m=new Map();
 const api={m,
  set(x,y,z,b,mt,ch){if(!inB([x,y,z]))throw E('bounds');
   if(!m.has(ix(x,y,z))&&m.size>=LIM.maxBlocks)throw E('toobig');
   const o=get(x,y,z);
   // partes de 2 blocos (porta/cama): limpa a outra metade para não sobrar pedaço solto
   const side=(X,Y,Z)=>{if(inB([X,Y,Z])&&!m.has(ix(X,Y,Z)))m.set(ix(X,Y,Z),{x:X,y:Y,z:Z,b:0,m:0})};
   if(o==80&&get(x,y+1,z)==81)side(x,y+1,z);if(o==81&&get(x,y-1,z)==80)side(x,y-1,z);
   if(o==79){const e=HD[(M.get(ix(x,y,z))||0)&3];if(get(x+e[0],y,z+e[2])==84)side(x+e[0],y,z+e[2])}
   if(o==84){const e=HD[(M.get(ix(x,y,z))||0)&3];if(get(x-e[0],y,z-e[2])==79)side(x-e[0],y,z-e[2])}
   m.set(ix(x,y,z),{x,y,z,b,m:mt||0,ch:ch||null})}};
 return api}
function readRegion(r){const cells=[];
 for(let i=0;i<r.sz[0];i++)for(let j=0;j<r.sz[1];j++)for(let l=0;l<r.sz[2];l++){const x=r.lo[0]+i,y=r.lo[1]+j,z=r.lo[2]+l,k=ix(x,y,z),b=get(x,y,z);
  cells.push([b,M.get(k)||0,b==140&&CH.get(k)?CH.get(k).slice():null])}
 return{sz:r.sz.slice(),cells}}
const cellAt=(c,i,j,l)=>c.cells[(i*c.sz[1]+j)*c.sz[2]+l];
// rotação (múltiplos de 90° em torno de y) e espelho aplicados a uma cópia; devolve lista [i,j,l,cell] já nas novas dimensões
function transform(c,rot,mir){let sx=c.sz[0],sy=c.sz[1],sz=c.sz[2],out=[];
 for(let i=0;i<sx;i++)for(let j=0;j<sy;j++)for(let l=0;l<sz;l++){let a=i,b=l;if(mir=='x')a=sx-1-a;if(mir=='z')b=sz-1-b;out.push([a,j,b,cellAt(c,i,j,l)])}
 let w=sx,d=sz;for(let k=0;k<rot;k++){out=out.map(([a,j,b,ce])=>[d-1-b,j,a,ce]);[w,d]=[d,w]}
 return{sz:[w,sy,d],list:out}}
function placeClip(plan,c,at,anchor,o){const rot=((((+o.rotate||0)/90)|0)%4+4)%4,mir=o.mirror||null,t=transform(c,rot,mir);
 const lo=anchor=='min'?at.slice():[at[0]-(t.sz[0]>>1),at[1],at[2]-(t.sz[2]>>1)];
 if(!inB(lo)||!inB([lo[0]+t.sz[0]-1,lo[1]+t.sz[1]-1,lo[2]+t.sz[2]-1]))throw E('bounds');
 for(const[i,j,l,ce]of t.list){if(!ce[0]&&!o.include_air)continue;plan.set(lo[0]+i,lo[1]+j,lo[2]+l,ce[0],ce[1],ce[2])}
 return lo}
function delta(op,s){if(op.offset!=null){const o=op.offset;if(Array.isArray(o))return o.map(Number);
  const f=+(o.forward??o.f??0),r=+(o.right??o.r??0),u=+(o.up??o.u??0);return[f*s.F[0]+r*s.R[0],u,f*s.F[1]+r*s.R[1]]}return null}

// ---------- ações permitidas -> plano ----------
function build(action,s){
 if(!action||typeof action!=='object'||Array.isArray(action))throw E('badaction');
 const ops=Array.isArray(action.ops)?action.ops:null;if(!ops||!ops.length)throw E('badaction');if(ops.length>LIM.maxOps)throw E('ops');
 const plan=Plan();let clipTmp=clip,newClip=null;
 for(const op of ops){if(!op||typeof op!=='object')throw E('badaction');
  switch(op.op){
   case 'set':{const list=Array.isArray(op.blocks)?op.blocks:[op];if(list.length>LIM.maxBlocks)throw E('toobig');
    for(const o of list){const p=pt(o.pos??o.at,s),b=bid(o.block);plan.set(p[0],p[1],p[2],b,needsMeta(b)?(+o.meta||0)&31:0)}break}
   case 'fill':{const r=box(pt(op.from,s),pt(op.to,s)),b=bid(op.block),m=needsMeta(b)?(+op.meta||0)&31:0,hollow=op.mode=='hollow';
    for(let x=r.lo[0];x<=r.hi[0];x++)for(let y=r.lo[1];y<=r.hi[1];y++)for(let z=r.lo[2];z<=r.hi[2];z++){
     if(hollow&&x>r.lo[0]&&x<r.hi[0]&&y>r.lo[1]&&y<r.hi[1]&&z>r.lo[2]&&z<r.hi[2])continue;plan.set(x,y,z,b,m)}break}
   case 'clear':{const r=region(op,s);for(let x=r.lo[0];x<=r.hi[0];x++)for(let y=r.lo[1];y<=r.hi[1];y++)for(let z=r.lo[2];z<=r.hi[2];z++)if(get(x,y,z))plan.set(x,y,z,0);break}
   case 'replace':{const r=region(op,s),f=bid(op.find??op.from_block),b=bid(op.block??op.to_block),m=needsMeta(b)?(+op.meta||0)&31:0;
    for(let x=r.lo[0];x<=r.hi[0];x++)for(let y=r.lo[1];y<=r.hi[1];y++)for(let z=r.lo[2];z<=r.hi[2];z++)if(get(x,y,z)==f)plan.set(x,y,z,b,m);break}
   case 'copy':{newClip=readRegion(region(op,s));clipTmp=newClip;break}
   case 'paste':{if(!clipTmp)throw E('noclip');if(op.at==null)throw E('needpos');placeClip(plan,clipTmp,pt(op.at,s),op.anchor||'center',op);break}
   case 'move':{const r=region(op,s),c=readRegion(r),d=delta(op,s);let lo;
    for(let i=0;i<r.sz[0];i++)for(let j=0;j<r.sz[1];j++)for(let l=0;l<r.sz[2];l++)if(c.cells[(i*r.sz[1]+j)*r.sz[2]+l][0])plan.set(r.lo[0]+i,r.lo[1]+j,r.lo[2]+l,0);
    if(d){lo=[r.lo[0]+d[0],r.lo[1]+d[1],r.lo[2]+d[2]];placeClip(plan,c,lo,'min',{include_air:false})}
    else if(op.at!=null)placeClip(plan,c,pt(op.at,s),op.anchor||'center',{include_air:false});
    else throw E('needpos');break}
   case 'scale':{const r=region(op,s),k=Math.round(+op.factor);if(!(k>=2&&k<=4))throw E('badop');
    if(r.sz.some(v=>v*k>LIM.maxSide)||r.sz[0]*r.sz[1]*r.sz[2]*k*k*k>LIM.maxBlocks)throw E('toobig');
    const c=readRegion(r);if(!inB([r.lo[0],r.lo[1],r.lo[2]])||!inB([r.lo[0]+r.sz[0]*k-1,r.lo[1]+r.sz[1]*k-1,r.lo[2]+r.sz[2]*k-1]))throw E('bounds');
    for(let i=0;i<r.sz[0];i++)for(let j=0;j<r.sz[1];j++)for(let l=0;l<r.sz[2];l++){const ce=cellAt(c,i,j,l);if(!ce[0])continue;
     for(let a=0;a<k;a++)for(let b=0;b<k;b++)for(let d=0;d<k;d++)plan.set(r.lo[0]+i*k+a,r.lo[1]+j*k+b,r.lo[2]+l*k+d,ce[0],ce[1],null)}break}
   default:throw E('badop')}}
 if(!plan.m.size&&!newClip)throw E('empty');
 return{plan,newClip}}

function summary(plan){let over=0,lo=[1e9,1e9,1e9],hi=[-1,-1,-1];
 for(const c of plan.m.values()){const o=get(c.x,c.y,c.z);if(o&&(o!==c.b||(M.get(ix(c.x,c.y,c.z))||0)!==c.m))over++;
  lo=[Math.min(lo[0],c.x),Math.min(lo[1],c.y),Math.min(lo[2],c.z)];hi=[Math.max(hi[0],c.x),Math.max(hi[1],c.y),Math.max(hi[2],c.z)]}
 return{n:plan.m.size,over,dim:plan.m.size?[hi[0]-lo[0]+1,hi[1]-lo[1]+1,hi[2]-lo[2]+1]:[0,0,0]}}

// ---------- aplicação única ----------
function apply(plan){const old=[],wet=[],was=FLOWON;FLOWON=false;
 try{for(const c of plan.m.values()){const k=ix(c.x,c.y,c.z);old.push([c.x,c.y,c.z,get(c.x,c.y,c.z),M.get(k)||0,CH.get(k)||null]);
   if(c.b==0)put(c.x,c.y,c.z,0);else if(c.m)putm(c.x,c.y,c.z,c.b,c.m);else put(c.x,c.y,c.z,c.b);
   if(c.ch)CH.set(k,c.ch);else CH.delete(k);
   if(c.b==78||c.b==112)wet.push(c)}}
 finally{FLOWON=was}
 if(was&&wet.length<2000)for(const c of wet)wake(c.x,c.y,c.z);
 undo=old;
 if(typeof redstone=='function')redstone();
 rebuild();
 let n=0;while(hit(P.x,P.y,P.z)&&n++<60)P.y+=1;   // não deixa o jogador preso dentro da construção
 return old.length}
function revert(){if(!undo){say('Não há nada para desfazer.');return}
 const was=FLOWON;FLOWON=false;
 try{for(let i=undo.length-1;i>=0;i--){const[x,y,z,b,m,ch]=undo[i],k=ix(x,y,z);if(m)putm(x,y,z,b,m);else put(x,y,z,b);if(ch)CH.set(k,ch);else CH.delete(k)}}finally{FLOWON=was}
 const n=undo.length;undo=null;if(typeof redstone=='function')redstone();rebuild();say('Desfeito: '+n+' blocos restaurados.')}

// ---------- executar uma ação (validar -> confirmar? -> aplicar) ----------
function run(action,s,force){
 const{plan,newClip}=build(action,s);const sm=summary(plan);
 const need=!force&&(action.requires_confirmation===true||sm.n>LIM.confirmBlocks||sm.over>LIM.confirmOver);
 if(need){pend={action,s,t:Date.now()};
  if(!action.__asked)say('Essa construção vai alterar '+sm.n+' blocos (área '+sm.dim.join('x')+')'+(sm.over?', substituindo '+sm.over+' blocos existentes':'')+'. Quer que eu construa agora?');
  return'confirm'}
 if(newClip){clip=newClip;if(!plan.m.size){say('Copiei a área ('+newClip.sz.join('x')+'). Agora diga onde colocar.');return'ok'}}
 say('Construindo...');const n=apply(plan);say('Pronto: '+n+' blocos alterados.');return'ok'}
const fail=e=>say(MSG[e&&e.code]||'Não consegui executar essa ação.');
function exec(action,s,force){try{return run(action,s,force)}catch(e){if(!(e&&e.code&&MSG[e.code]))console.warn('sumon:',e);fail(e)}}

// ---------- conversa com o backend ----------
const YES=/^(sim|s|pode|pode sim|claro|confirmo|confirmar|ok|manda|vai|bora|construa|faca|faz|isso)[.! ]*$/,NO=/^(nao|n|cancela|cancelar|para|deixa|esquece|deixa pra la)[.! ]*$/;
const RETRY=/^(tente novamente|tenta novamente|tente de novo|tenta de novo|repetir|retry)[.! ]*$/;
async function ask(text){
 const s=snap(),id=++reqN;hist.push({role:'user',content:text});if(hist.length>16)hist.splice(0,hist.length-16);
 lastText=text;
 const u=url();if(!u){hist.pop();say('Ainda não sei onde está o backend do Sumon Assistente. Digite /sumon url https://seu-endereco para configurar.');return}
 let data;
 let tm;try{const ctl=new AbortController();tm=setTimeout(()=>ctl.abort(),LIM.timeout);
  const r=await fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',signal:ctl.signal,
   body:JSON.stringify({mode:'craft',session_id:SID,request_id:id,craft_context:context(s),messages:hist,
    preferredProvider:/^gemini-/.test(document.getElementById('cmodel')?.value||'')?'gemini':'groq',preferredModel:document.getElementById('cmodel')?.value||'openai/gpt-oss-20b'})});
  if(!r.ok)throw new Error('HTTP '+r.status);data=await r.json()}
 catch(e){if(id===reqN){hist.pop();say(e.name==='AbortError'?'O Sumon demorou mais que o esperado. O pedido não foi executado; envie “tente novamente” para repetir.':'Falha de conexão com o Sumon ('+String(e.message||'rede').slice(0,80)+'). Envie “tente novamente” para repetir.')}return}
 finally{clearTimeout(tm)}
 if(data?.ok===false){if(id===reqN){hist.pop();say('O Sumon não conseguiu atender: '+String(data.error||data.text||'erro do backend').slice(0,180)+'. Envie “tente novamente” para repetir.')}return}
 handle(data,s,id)}
function handle(d,s,id){
 if(id!==reqN||!active())return;                                              // resposta velha ou Sumon desligado
 if(!d||typeof d!=='object'){say('Recebi uma resposta que não consegui entender.');return}
 if(d.session_id&&d.session_id!==SID)return;if(d.request_id!=null&&d.request_id!==id)return;   // só da minha sessão/pedido
 let t=d.text??d.message??d.reply??d.response;t=typeof t=='string'?t.trim():'';
 const action=d.action??d.craft_action??null;
 if(t&&!/^[\[{]/.test(t)){hist.push({role:'assistant',content:t});say(t)}
 if(action&&typeof action==='object'){if(t)action.__asked=true;pend=null;exec(action,s,false)}}

// ---------- comandos locais e entrada do chat ----------
function mark(n){const t=(typeof tg!=='undefined'&&tg)?tg.b:snap().base;sel[n]=t.slice();
 say('Posição '+(n=='a'?1:2)+' definida em '+t.join(', ')+'.');const z=selSize();if(z)say('Seleção: '+z.join('x')+' ('+z[0]*z[1]*z[2]+' blocos).')}
function cmd(v){const p=v.trim().split(/\s+/),c=p[0].toLowerCase();
 if(c=='/pos1'){mark('a');return true}if(c=='/pos2'){mark('b');return true}
 if(c=='/sel'){if(p[1]=='limpar'){sel={a:null,b:null};say('Seleção removida.')}else{const z=selSize();say(z?'Seleção: '+z.join('x')+' de '+sel.a.join(',')+' até '+sel.b.join(',')+'.':'Nenhuma seleção. Use /pos1 e /pos2.')}return true}
 if(c=='/desfazer'){revert();return true}
 if(c=='/sumon'){if(p[1]=='url'&&p[2]){try{localStorage.setItem('sc.sumon.url',p[2])}catch(e){}say('Endereço do backend salvo.')}
  else say(url()?'Backend: '+url()+'. Ative o quadrado SUMON ASSISTENTE e converse.':'Sem backend. Use /sumon url https://seu-endereco/api/craft');return true}
 return false}
window.onSumonToggle=on=>{pend=null;say(on?'Ativado. Pode falar comigo pelo chat. Use /pos1 e /pos2 para selecionar uma construção.':'Desativado.')};
window.onChatSend=v=>{if(v[0]=='/'&&cmd(v))return;if(!active())return;
 const n=norm(v);
 if(RETRY.test(n)&&lastText){ask(lastText);return}
 if(pend&&Date.now()-pend.t<120000){if(YES.test(n)){const p=pend;pend=null;hist.push({role:'user',content:v});exec(p.action,p.s,true);return}
  if(NO.test(n)){pend=null;hist.push({role:'user',content:v});say('Tudo bem, cancelei.');return}pend=null}
 ask(v)};
window.SUMON={context,build,snap,frame,exec,handle,state:()=>({sel,clip,pend,undo:!!undo}),_reset:()=>{sel={a:null,b:null};clip=null;pend=null;undo=null;hist=[];reqN=0;lastText=''}};
})();
