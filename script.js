(() => {
  const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
  const toggle=$('#soundToggle'),icon=$('#soundIcon'),label=$('#soundLabel');
  let soundOn=false,ctx;
  function audio(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx??=new C();if(ctx.state==='suspended')ctx.resume();return ctx}
  function tone(freq,duration,type='sine',gain=.035,delay=0){if(!soundOn)return;const c=audio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,c.currentTime+delay);g.gain.setValueAtTime(.0001,c.currentTime+delay);g.gain.exponentialRampToValueAtTime(gain,c.currentTime+delay+.02);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+delay+duration);o.connect(g).connect(c.destination);o.start(c.currentTime+delay);o.stop(c.currentTime+delay+duration+.04)}
  function chime(){tone(784,.55,'sine',.035);tone(1046,.7,'sine',.025,.12);tone(1318,.8,'sine',.018,.24)}
  function thud(){tone(105,.19,'sine',.12);tone(58,.25,'triangle',.09,.015)}
  toggle.addEventListener('click',()=>{soundOn=!soundOn;toggle.setAttribute('aria-pressed',String(soundOn));icon.textContent=soundOn?'♫':'♪';label.textContent=soundOn?'Звук включён':'Звук выключен';if(soundOn){audio();chime()}});
  document.body.classList.add('motion-ready');
  const revealTargets=$$('.section-heading,.birthday-copy,.letter-card,.gallery-heading,.finale-stars,.finale>p,.finale h2,.finale-age,.finale-button,.reading-footnote');
  revealTargets.forEach((el,i)=>{el.classList.add('reveal');if(i%3===1)el.classList.add('reveal-sharp')});
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver.unobserve(entry.target)}}),{threshold:.14});
  $$('.reveal').forEach(el=>revealObserver.observe(el));
  const cards=$$('.tarot-card');let cardsStarted=false;
  const cardObserver=new IntersectionObserver(entries=>{if(cardsStarted||!entries.some(e=>e.isIntersecting))return;cardsStarted=true;cards.forEach((card,i)=>setTimeout(()=>{card.classList.add('card-ready','card-slam');thud();card.addEventListener('animationend',()=>card.classList.remove('card-slam'),{once:true})},i*520));cardObserver.disconnect()},{threshold:.3});
  const cardsWrap=$('.cards');if(cardsWrap)cardObserver.observe(cardsWrap);
  cards.forEach(card=>card.addEventListener('click',()=>{if(!card.classList.contains('card-ready'))return;const open=card.classList.toggle('is-flipped');card.setAttribute('aria-expanded',String(open));if(open){tone(440,.13,'triangle',.03);tone(660,.3,'sine',.02,.08)}}));
  const layer=$('#confettiLayer'),colors=['#e9c98a','#d85b77','#f5eadb','#9d2349','#f2a65a','#fff0cf'];
  function confetti(amount=85){for(let n=0;n<amount;n++){const bit=document.createElement('i');bit.className='confetto';bit.style.left=(Math.random()*100)+'%';bit.style.background=colors[n%colors.length];bit.style.setProperty('--duration',(2.1+Math.random()*2.5)+'s');bit.style.setProperty('--drift',(Math.random()*180-90)+'px');bit.style.setProperty('--rotation',(Math.random()*180)+'deg');bit.style.animationDelay=(Math.random()*.5)+'s';layer.append(bit);bit.addEventListener('animationend',()=>bit.remove(),{once:true})}}
  function celebrate(){confetti();chime()}
  const candles=$('#blowCandles'),birthdayArt=$('#birthdayArt');let candleTimer;
  candles.addEventListener('click',()=>{birthdayArt.classList.remove('blown');void birthdayArt.offsetWidth;birthdayArt.classList.add('blown');$('#wishMessage').textContent='Желание принято. Вселенная поставила напоминание ✨';candles.innerHTML='Желание загадано <span>✓</span>';celebrate();clearTimeout(candleTimer);candleTimer=setTimeout(()=>{birthdayArt.classList.remove('blown');candles.innerHTML='Задуть свечи <span>✦</span>'},4500)});
  $('#confettiButton').addEventListener('click',celebrate);
  $('.button-gold').addEventListener('click',()=>{tone(523,.14,'triangle',.025);tone(659,.18,'triangle',.025,.1)});
  const photos=[
    {src:'assets/photo-02.jpg',alt:'Таня в осеннем парке',caption:'осенний вайб'},
    {src:'assets/photo-03.jpg',alt:'Портрет Тани',caption:'бордо ей к лицу'},
    {src:'assets/photo-04.jpg',alt:'Таня у зеркала',caption:'главный персонаж'},
    {src:'assets/photo-05.jpg',alt:'Таня вечером',caption:'ночная магия'},
    {src:'assets/photo-06.jpg',alt:'Летний портрет Тани',caption:'солнечный аркан'},
    {src:'assets/photo-07.jpg',alt:'Таня у скалы',caption:'сила стихии'},
    {src:'assets/photo-08.jpg',alt:'Таня в машине',caption:'без фильтров, только звёзды'}
  ];
  let active=0;const stage=$('#galleryStage'),dots=$('#galleryDots'),description=$('#galleryDescription'),count=$('#galleryCount');
  photos.forEach((photo,i)=>{const slide=document.createElement('button');slide.className='gallery-slide';slide.type='button';slide.setAttribute('aria-label',photo.caption);slide.innerHTML='<img src="'+photo.src+'" alt="'+photo.alt+'" loading="lazy"><span class="slide-label">'+photo.caption+'</span>';slide.addEventListener('click',()=>{if(i===active)openPhoto(photo);else showPhoto(i)});stage.append(slide);const dot=document.createElement('button');dot.className='gallery-dot';dot.type='button';dot.setAttribute('aria-label','Фото '+(i+1));dot.addEventListener('click',()=>showPhoto(i));dots.append(dot)});
  const slides=$$('.gallery-slide',stage),dotButtons=$$('.gallery-dot',dots);
  function openPhoto(photo){const box=$('#lightbox'),image=$('#lightboxImage');image.src=photo.src;image.alt=photo.alt;box.showModal();tone(560,.13,'sine',.018)}
  function showPhoto(next){active=(next+photos.length)%photos.length;slides.forEach((slide,i)=>{let offset=i-active;if(offset>photos.length/2)offset-=photos.length;if(offset< -photos.length/2)offset+=photos.length;const abs=Math.abs(offset);slide.classList.toggle('is-active',offset===0);slide.classList.toggle('is-near',abs===1);slide.style.zIndex=String(10-abs);slide.style.opacity=abs>2?'0':'1';slide.style.pointerEvents=abs>2?'none':'auto';slide.style.transform='translate(-50%,-50%) translateX('+(offset*58)+'%) translateY('+(abs*2.5)+'%) rotateY('+(offset*-25)+'deg) rotateZ('+(offset*-5)+'deg) scale('+(offset===0?1:abs===1?.78:.58)+')';slide.style.filter=offset===0?'none':'brightness('+(abs===1?.68:.4)+') blur('+(abs>1?1:0)+'px)'});dotButtons.forEach((dot,i)=>dot.classList.toggle('is-active',i===active));description.textContent=photos[active].caption;count.textContent=String(active+1).padStart(2,'0')+' / '+String(photos.length).padStart(2,'0');$('#galleryPrev').disabled=false;$('#galleryNext').disabled=false}
  $('#galleryPrev').addEventListener('click',()=>showPhoto(active-1));$('#galleryNext').addEventListener('click',()=>showPhoto(active+1));showPhoto(0);
  let touchX=null;stage.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});stage.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)showPhoto(active+(dx<0?1:-1));touchX=null},{passive:true});
  const box=$('#lightbox');box.querySelector('.lightbox-close').addEventListener('click',()=>box.close());box.addEventListener('click',e=>{if(e.target===box)box.close()});
  document.addEventListener('keydown',e=>{if(box.open)return;const album=$('#album').getBoundingClientRect();if(album.top<innerHeight&&album.bottom>0){if(e.key==='ArrowLeft')showPhoto(active-1);if(e.key==='ArrowRight')showPhoto(active+1)}});
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){$$('.reveal').forEach(el=>el.classList.add('revealed'));cards.forEach(card=>card.classList.add('card-ready'))}
})();