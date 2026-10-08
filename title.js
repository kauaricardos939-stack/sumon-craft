// ---------- Tela inicial do Sumon Craft ----------
// Carregue DEPOIS de menu.js e loop.js. O mundo real continua sendo desenhado atrás (desfocado por CSS)
// e a câmera gira devagar. "Opções" reaproveita a tela de configurações do jogo.
(()=>{
const ts=$('ts'),st=$('st'),B=document.body,q=s=>ts.querySelector(s),isT=()=>B.classList.contains('title');
const sp=['Feito no Brasil!','100% cúbico!','Cuidado com o Rastejante!','Agora com mais blocos!','Cava, cava, cava!','Também no celular!','Pule o dia!'];
q('#t-splash').textContent=sp[Math.random()*sp.length|0];
const view=v=>{ts.querySelectorAll('.view').forEach(e=>e.hidden=e.id!=='v-'+v);q('.lg').hidden=v!=='main';ts.scrollTop=0};
let tt;const toast=t=>{const e=q('#t-toast');e.textContent=t;e.hidden=false;clearTimeout(tt);tt=setTimeout(()=>e.hidden=true,2600)};
const openT=()=>{sessionStorage.removeItem('sc.play');if(document.pointerLockElement)document.exitPointerLock();B.classList.add('title');ts.hidden=false;st.style.display='none';view('main')};
const play=()=>{sessionStorage.setItem('sc.play',JSON.stringify(cur));location.reload()};
ts.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>view(b.dataset.go));
q('[data-act=opts]').onclick=()=>$('mOpts').click();
q('[data-act=quit]').onclick=()=>toast('Feche a aba para sair. Os blocos esperam por você!');
$('mQuit').onclick=openT;                       // "Salvar e Sair" do menu de pausa volta para a tela inicial

// lista selecionável
const list=(box,items,render,onSel,empty)=>{box.innerHTML='';if(!items.length){box.innerHTML='<div class="empty">'+empty+'</div>';return}
 items.forEach(it=>{const b=document.createElement('button');b.className='item';b.setAttribute('aria-pressed','false');b.innerHTML=render(it);
  b.onclick=()=>{box.querySelectorAll('.item').forEach(x=>x.setAttribute('aria-pressed',x===b));onSel(it)};box.appendChild(b)})};

// mundos
let worlds=[];try{worlds=JSON.parse(localStorage.getItem('sc.worlds'))||[]}catch(e){}let cur=null;
const drawW=()=>{list(q('#t-worlds'),worlds,w=>'<span class="ico"></span><span><b>'+w.n+'</b><small>'+w.m+'</small></span>',w=>{cur=w;q('#t-play').disabled=false},'Nenhum mundo ainda.<br>Clique em Criar mundo.');cur=null;q('#t-play').disabled=true};
drawW();
q('#t-play').onclick=play;
// criar mundo
const O={mode:['Sobrevivência','Criativo','Aventura'],diff:['Pacífico','Fácil','Normal','Difícil'],type:['Padrão','Plano','Grande bioma','Amplificado'],struct:['SIM','NÃO'],bonus:['NÃO','SIM'],cheats:['NÃO','SIM']},
 L={mode:'Modo de jogo',diff:'Dificuldade',type:'Tipo de mundo',struct:'Gerar estruturas',bonus:'Baú de bônus',cheats:'Permitir trapaças'},I={mode:0,diff:2,type:0,struct:0,bonus:0,cheats:0};
Object.keys(O).forEach(k=>{const b=document.createElement('button');b.className='btn';const up=()=>b.textContent=L[k]+': '+O[k][I[k]];up();b.onclick=()=>{I[k]=(I[k]+1)%O[k].length;up()};q('#t-cfg').appendChild(b)});
q('#t-new').onclick=()=>{q('#t-name').value='Novo mundo '+(worlds.length+1);q('#t-seed').value='';view('create')};
q('#t-do').onclick=()=>{const n=q('#t-name').value.trim()||'Novo mundo '+(worlds.length+1);worlds.unshift({n,mode:I.mode,type:I.type,m:O.mode[I.mode]+' · '+O.type[I.type]+' · '+O.diff[I.diff]});try{localStorage.setItem('sc.worlds',JSON.stringify(worlds))}catch(e){}drawW();view('single');toast('Mundo "'+n+'" criado.')};
// multijogador: lista vazia
list(q('#t-servers'),[],()=>'',()=>{},'Nenhum servidor na lista.<br>Use a conexão direta abaixo.');
q('#t-ip').onclick=()=>{const v=q('#t-addr').value.trim();if(!v){toast('Digite o endereço do servidor.');q('#t-addr').focus();return}toast('O multijogador ainda não existe.')};

// teclas do jogo ficam desligadas enquanto a tela inicial está aberta (Esc continua fechando as opções)
addEventListener('keydown',e=>{if(isT()&&e.code!=='Escape')e.stopImmediatePropagation()},true);
// se o navegador negar o bloqueio do mouse, mostra o menu de pausa (Continuar Jogo tenta de novo)
document.addEventListener('pointerlockerror',()=>{if(!isT())st.style.display='flex'});
// câmera girando devagar sobre o mundo real
let lt=performance.now();
(function spin(n){const dt=Math.min(.1,(n-lt)/1000);lt=n;if(isT()){P.yaw+=dt*.06;P.pit=-.14}requestAnimationFrame(spin)})(lt);
// corações do modo sobrevivência
{const c=document.createElement('canvas');c.width=c.height=9;const x=c.getContext('2d'),m=['.##...##.','#########','#########','#########','.#######.','..#####..','...###...','....#....'];
 m.forEach((r,j)=>[...r].forEach((k,i)=>{if(k=='#'){x.fillStyle=(i<3&&j<3)?'#ff8a8a':j>4?'#a00e0e':'#e02020';x.fillRect(i,j+0,1,1)}}));
 document.documentElement.style.setProperty('--heart','url('+c.toDataURL()+')');
 const hp=document.createElement('div');hp.id='hp';for(let k=0;k<10;k++)hp.append(document.createElement('i'));document.querySelector('.hotwrap').append(hp)}
let W=null;try{W=JSON.parse(sessionStorage.getItem('sc.play'))}catch(e){}
if(W){B.classList.toggle('surv',W.mode==0)}else openT();   // com mundo escolhido entra direto; senão, tela inicial
})();
