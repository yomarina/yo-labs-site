/* Фон из гексагонов: каждый свой, вместе покрывают всё. Тонкая векторная сетка, тонированные кластеры у краёв,
   под курсором соты подсвечиваются и гаснут шлейфом. Цвета задаются data-атрибутами канваса. */
(function(){var c=document.getElementById('hex');if(!c)return;var g=c.getContext('2d'),bg=document.createElement('canvas'),b=bg.getContext('2d');
 var D=c.dataset,LINE=D.line,FILL=D.fill,GLOW=D.glow;
 var W,H,R,dpr,cols,rows,heat={},mx=-1e4,my=-1e4,run=false,
  fine=matchMedia('(pointer:fine)').matches,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function center(i,j){return[i*1.5*R,j*Math.sqrt(3)*R+(i&1?Math.sqrt(3)*R/2:0)]}
 function path(x,y,r,ctx){ctx.beginPath();for(var k=0;k<6;k++){var a=Math.PI/3*k;ctx[k?'lineTo':'moveTo'](x+r*Math.cos(a),y+r*Math.sin(a))}ctx.closePath()}
 function rnd(s){var x=Math.sin(s*9301+49297)*233280;return x-Math.floor(x)}
 function size(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;R=Math.max(22,W/42);
  cols=Math.ceil(W/(1.5*R))+2;rows=Math.ceil(H/(Math.sqrt(3)*R))+2;
  [c,bg].forEach(function(x){x.width=W*dpr;x.height=H*dpr});g.setTransform(dpr,0,0,dpr,0,0);b.setTransform(dpr,0,0,dpr,0,0);
  b.clearRect(0,0,W,H);b.lineWidth=1;
  for(var i=-1;i<cols;i++)for(var j=-1;j<rows;j++){var p=center(i,j),edge=Math.abs(p[0]/W-.5)*2,r=rnd(i*131+j*7);
   if(r<edge*edge*.38){path(p[0],p[1],R-1.5,b);b.fillStyle=FILL.replace('A',(.04+rnd(i*17+j*3)*.12).toFixed(3));b.fill()}
   path(p[0],p[1],R,b);b.strokeStyle=LINE;b.stroke()}
  draw()}
 function draw(){g.clearRect(0,0,W,H);g.drawImage(bg,0,0,W,H);var alive=false;
  for(var k in heat){var v=heat[k]*=.92;if(v<.02){delete heat[k];continue}alive=true;var q=k.split(','),p=center(+q[0],+q[1]);
   path(p[0],p[1],R-1.5,g);g.fillStyle=GLOW.replace('A',(v*.16).toFixed(3));g.fill();g.lineWidth=1.3;g.strokeStyle=GLOW.replace('A',(v*.55).toFixed(3));g.stroke()}
  return alive}
 function tick(){if(mx>-1e3){var i0=Math.round(mx/(1.5*R)),j0=Math.round(my/(Math.sqrt(3)*R));
   for(var i=i0-3;i<=i0+3;i++)for(var j=j0-3;j<=j0+3;j++){var p=center(i,j),d=Math.hypot(p[0]-mx,p[1]-my)/R;if(d<3.2){var v=1-d/3.2;v*=v;var k=i+','+j;if(!heat[k]||heat[k]<v)heat[k]=v}}}
  var alive=draw();if(alive||mx>-1e3)requestAnimationFrame(tick);else run=false}
 size();addEventListener('resize',size);
 if(fine&&!reduce){addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;if(!run){run=true;requestAnimationFrame(tick)}},{passive:true});
  document.addEventListener('mouseleave',function(){mx=my=-1e4})}
})();
