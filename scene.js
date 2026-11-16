(() => {
  const canvas = document.querySelector('#woodland');
  const c = canvas.getContext('2d');
  const portrait = document.querySelector('#rue-portrait');
  const portraitContext = portrait.getContext('2d');
  const base = document.createElement('canvas');
  base.width = canvas.width; base.height = canvas.height;
  const b = base.getContext('2d');
  const night = document.createElement('canvas');
  night.width = base.width;
  night.height = base.height;
  const n = night.getContext('2d');
  const weatherScenes = Object.fromEntries(['rain', 'snow'].map(id => {
    const layer = document.createElement('canvas');
    layer.width = base.width;
    layer.height = base.height;
    return [id, layer];
  }));
  const rain = weatherScenes.rain.getContext('2d');
  const snow = weatherScenes.snow.getContext('2d');
  const rect=(ctx,col,x,y,w,h)=>{ctx.fillStyle=col;ctx.fillRect(Math.floor(x),Math.floor(y),w,h)};
  const nightColors = new Map();
  const lampColors = new Set(['#f6bb65','#ffdb86','#ffe6a2','#e1a259','#ffe2a0']);
  function nightColor(color) {
    if (lampColors.has(color)) return color;
    if (!nightColors.has(color)) {
      const rgb = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
      nightColors.set(color, `rgb(${Math.round(rgb[0] * .43 + 11)},${Math.round(rgb[1] * .53 + 15)},${Math.round(rgb[2] * .68 + 30)})`);
    }
    return nightColors.get(color);
  }
  let paintingSky = true;
  let snowGround = false;
  const weatherColors = new Map();
  const weatherPalettes = {
    rain: [[.34, 32], [.55, 34], [.62, 48]],
    snow: [[.34, 78], [.43, 87], [.53, 103]],
    snowGround: [[.42, 106], [.53, 119], [.52, 144]]
  };
  function weatherColor(color, palette) {
    if (lampColors.has(color)) return color;
    const key = palette + color;
    if (!weatherColors.has(key)) {
      const rgb = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
      const channels = weatherPalettes[palette].map(([factor, offset], i) => Math.round(rgb[i] * factor + offset));
      weatherColors.set(key, 'rgb(' + channels.join(',') + ')');
    }
    return weatherColors.get(key);
  }
  const R=(col,x,y,w,h)=>{
    rect(b,col,x,y,w,h);
    if (!paintingSky) {
      rect(n,nightColor(col),x,y,w,h);
      rect(rain, weatherColor(col, 'rain'), x,y,w,h);
      rect(snow, weatherColor(col, snowGround ? 'snowGround' : 'snow'), x,y,w,h);
    }
  };
  let seed=77;
  const rnd=()=>((seed=Math.imul(1664525,seed)+1013904223|0)>>>0)/4294967296;
  const pick=a=>a[Math.floor(rnd()*a.length)];
  const palette=['#956b77','#a47776','#b88676','#c9977a','#dca77c','#eab889','#eec596'];
  for(let y=0;y<126;y++)R(palette[Math.min(6,Math.floor(y/14))],0,y,256,1);
  // Sun painted in square steps to keep the low-resolution edges.
  for(let yy=-22;yy<=22;yy++){
    const w=Math.floor(Math.sqrt(22*22-yy*yy)/2)*2;
    R(yy<3?'#fce2ab':'#f7d19b',184-w,64+yy,2*w+1,1);
  }
  [[44,39,42],[116,55,42],[190,83,53],[19,73,40],[126,90,39],[208,51,32],[71,58,17]].forEach(([x,y,w],i)=>{
    const color=i%2?'#e8b798':'#dba58e';
    R(color,x,y,w,2);R(color,x+5,y-2,w-12,2);R(color,x+13,y-4,w-23>0?w-23:4,2);
    R('#f0c39e',x+8,y+3,w-10,1);
  });
  const nightSky = ['#222139','#29263f','#32304e','#423951','#504660','#63536a','#7b6372'];
  for (let y = 0; y < 126; y++) rect(n, nightSky[Math.min(6, Math.floor(y / 15))], 0, y, 256, 1);
  const skyStars = [[33,39],[49,61],[63,46],[81,51],[89,33],[104,47],[118,39],[128,63],[145,34],[155,53],[172,37],[207,55],[221,38],[102,65],[67,73],[161,69],[217,69]];
  skyStars.forEach(([x, y], i) => rect(n, i % 4 === 0 ? '#dcc2ac' : '#997c92', x, y, i % 4 === 0 ? 2 : 1, 1));
  for (let y = -13; y <= 13; y++) {
    const half = Math.floor(Math.sqrt(13 * 13 - y * y));
    rect(n, y < 5 ? '#f0d9ab' : '#d2bca7', 184 - half, 57 + y, half * 2 + 1, 1);
  }
  [[176,55,3,2],[187,50,4,2],[180,63,3,2],[190,59,2,2]].forEach(([x,y,w,h]) => rect(n, '#beacc0', x,y,w,h));
  const rainSky = ['#415765','#485e69','#536c73','#607a7e','#728a89'];
  const snowSky = ['#7e9bb2','#8ba8bd','#9cb7c8','#abc4d2','#bbd1da'];
  for (let y = 0; y < 126; y++) {
    const band = Math.min(4, Math.floor(y / 22));
    rect(rain, rainSky[band], 0, y, 256, 1);
    rect(snow, snowSky[band], 0, y, 256, 1);
  }
  for (const [x, y, w] of [[33,45,57],[98,59,73],[145,43,82],[173,78,68]]) {
    rect(rain, '#526971', x, y, w, 3);
    rect(rain, '#4a606a', x + 7, y - 3, w - 14, 3);
    rect(rain, '#627981', x + 11, y + 3, w - 19, 2);
    rect(snow, '#c1d6df', x, y + 2, w, 2);
    rect(snow, '#c9dce3', x + 10, y, w - 16, 2);
  }
  paintingSky = false;
  const ridge=(col,points)=>{
    const height=(x)=>{let i=0;while(i<points.length-2&&x>points[i+1][0])i++;
      const [[a,ay],[z,zy]]=points.slice(i,i+2);return Math.floor((ay+(zy-ay)*(x-a)/(z-a))/2)*2;};
    for(let x=0;x<256;x+=2){const y=height(x);R(col,x,y,2,135-y);}
  };
  ridge('#bc8d81',[[0,99],[25,82],[46,91],[73,76],[119,106],[155,87],[177,95],[206,82],[255,105]]);
  ridge('#a87e77',[[0,111],[32,97],[56,103],[101,94],[139,110],[174,102],[211,98],[255,91]]);
  const tree=(x,bottom,h,p,details=false)=>{
    const top=bottom-h;
    R(p[0],x-1,top+13,3,h-9);
    for(let y=1;y<h-7;y++){
      let tier=Math.floor(y/(h*.22));
      let local=(y%(h*.22))/(h*.22);
      let w=Math.floor((1+tier*.85+local*4.1)*h/37);
      if(y>h*.78)w+=2;
      R(p[1],x-w,top+y,w*2+1,1);
      if(y%3!==0)R(p[2],x-w,top+y,Math.max(1,Math.round(w*.83)),1);
      if(details&&y%9===2)R(p[3],x-w+1,top+y,Math.max(1,Math.floor(w*.6)),1);
      if (details && y % Math.max(5, Math.round(h * .13)) === 3) {
        rect(snow, '#c6dce2', x - w + 1, top + y, Math.max(1, w - 1), 1);
        rect(snow, '#a2bfcb', x + 1, top + y + 1, Math.max(1, w - 2), 1);
      }
    }
  };
  for(let x=-5;x<263;x+=6+rnd()*6)tree(Math.round(x),122+Math.round(rnd()*5),18+Math.round(rnd()*20),['#88675e','#a47b6e','#ab8574']);
  for(let x=-8;x<270;x+=10+rnd()*9)tree(Math.round(x),127+Math.round(rnd()*6),21+Math.round(rnd()*27),['#785848','#8e6b56','#9a775b']);
  snowGround = true;
  for(let y=124;y<196;y++){
    const inset=Math.ceil(Math.sin(y*.2)*3);
    R(y<137?'#ad8759':y<151?'#a47b4e':y<171?'#936c48':'#805b41',0,y,256,1);
    R(y<149?'#bb945f':y<172?'#a77b50':'#916647',44+inset,y,163-inset*2,1);
  }
  for(let y=131;y<196;y++){
    const t=(y-131)/65, mid=134-Math.sin(t*2.3)*38+t*24,w=5+t*t*52+Math.sin(t*3)*7;
    R(y<156?'#cc9b69':'#bb8b61',mid-w,y,2*w,1);
    if(y%4===0)R('#b98557',mid-w+1,y,2,1);
  }
  for(let i=0;i<1500;i++){
    const x=Math.floor(rnd()*256),y=126+Math.floor(rnd()*70);
    const shade=pick(y<155?['#98744d','#b68b58','#c99b66','#d3a771']:['#775c42','#996d49','#b58559','#a97a50']);
    R(shade,x,y,1+Math.floor(rnd()*4),1);
  }
  // Frame the clearing with layered spruce, stepping stones, and mushrooms.
  [[3,134,94],[20,132,69],[39,129,51],[54,124,36],[246,138,109],[225,137,74],[206,129,47],[255,152,90]].forEach(([x,y,h],i)=>
    tree(x,y,h,i%3===1?['#614936','#626248','#757351','#898057']:['#5b4835','#545941','#686849','#807851'],true));
  const grass=(x,y,s=1)=>{
    R('#756340',x,y,5*s,s);R('#817048',x+2*s,y-2*s,s,2*s);R('#b29353',x,y-s,s,s);R('#a78346',x+4*s,y-2*s,s,2*s);
  };
  for(let i=0;i<140;i++){let x=Math.floor(rnd()*251),y=130+Math.floor(rnd()*60);if(x<73||x>151||rnd()<.16)grass(x,y);}
  const rocks=[[57,146,10],[77,169,9],[201,150,12],[27,155,14],[231,159,12],[149,167,8],[69,139,6],[208,180,14]];
  for(const [x,y,w] of rocks){
    R('#704f3d',x,y+1,w+1,3);R('#a17c65',x+1,y-2,w-2,4);R('#b49875',x+2,y-3,w-4,2);R('#8b8254',x+1,y-1,3,1);
  }
  for(const [x,y] of [[42,150],[46,153],[215,151],[219,154],[66,164],[210,168]]){
    R('#e5bd82',x+1,y,1,3);R('#a44f36',x,y-1,4,1);R('#c66944',x+1,y-2,2,1);R('#f4c588',x+1,y-1,1,1);
  }
  const cabin=()=>{
    R('#75543e',76,130,101,5);R('#846044',81,126,89,9);
    R('#4e3a31',83,89,81,43);
    R('#935d41',85,91,42,39);R('#744836',127,90,35,40);
    for(let y=93;y<130;y+=4){R('#6e4836',85,y,77,1);R('#a9714d',87,y+1,38,1);R('#85523b',129,y+1,31,1);}
    R('#b37d53',86,97,2,33);R('#624132',125,97,3,33);R('#a16949',159,96,3,34);
    // Chimney bricks and broad shingled roof.
    R('#6e4b43',137,58,10,26);R('#9b6c58',137,59,4,21);
    for(let y=61;y<84;y+=4){R('#66483b',137,y,10,1);R('#6d463a',140+(y%8===1?3:0),y,1,3);}
    R('#573c34',135,56,14,3);R('#c08968',135,55,14,1);
    for(let y=64;y<=97;y++){
      const step=Math.floor((y-64)/2)*2;
      const left=106-Math.round(step*.99), right=131+Math.round(step*1.22);
      R(y%5===1?'#6f483d':'#875548',left,y,right-left,1);
      if(y%5===2){R('#a86b51',left+3,y,right-left-6,1);for(let x=left+9;x<right-5;x+=8)R('#6b4438',x,y,1,3);}
      R('#bf8760',left,y,2,1);
      R('#563c34',right-2,y,2,1);
    }
    for(let y=67;y<=97;y++){
      const d=Math.floor((y-67)/2)*2;
      R('#633e32',106-d,y,4,1);
      R('#b57854',108-d,y,2,1);
      R('#9e6547',108+d,y,4,1);
      if(y>72)R('#8e5b40',109-d+3,y,Math.max(1,2*d-5),1);
      if(y%4===0&&y>74)R('#754a36',109-d+3,y,Math.max(1,2*d-5),1);
    }
    R('#4a342c',73,97,101,3);R('#bc8057',75,96,97,1);
    R('#644335',86,100,74,1);
    R('#533728',104,109,16,22);R('#684b36',106,110,12,20);
    R('#9f7347',107,111,10,19);R('#885c3c',110,111,1,19);R('#885c3c',114,111,1,19);R('#edbd73',115,121,2,2);
    R('#624838',101,130,22,2);R('#a37b58',99,132,26,2);R('#bc9167',98,134,28,2);
    const window=(x,y,w,h)=>{
      R('#5a3e31',x-2,y-2,w+4,h+4);R('#d49a58',x-1,y-1,w+2,h+2);
      R('#f6bb65',x,y,w,h);R('#ffdb86',x+1,y+1,w-2,h-2);R('#ffe6a2',x+1,y+1,3,4);
      R('#9c643c',x+Math.floor(w/2),y,1,h);R('#a96b45',x,y+Math.floor(h/2),w,1);
      R('#674633',x-3,y+h+1,w+6,2);R('#c6915d',x-2,y+h,w+4,1);
    };
    window(91,109,8,10);window(138,106,15,13);window(105,84,6,7);
    R('#664333',162,103,1,10);R('#e1a259',161,111,4,5);R('#ffe2a0',162,112,2,3);
    R('#6d4932',160,110,6,1);R('#6d4932',160,116,6,1);
  };
  snowGround = false;
  cabin();
  [[81,137],[89,136],[122,138],[159,137],[167,135]].forEach(([x,y])=>grass(x,y,2));
  function stump(x,y){
    R('#70513e',x-2,y+8,26,4);R('#70513c',x,y,22,9);R('#976447',x+1,y+1,18,8);
    R('#79513b',x+4,y+1,2,9);R('#79513b',x+12,y+1,2,9);R('#c38c57',x+16,y+2,2,6);
    R('#d3a673',x-1,y-3,23,4);R('#e7bb87',x+2,y-4,17,2);R('#af7c53',x+3,y-1,14,1);R('#e6b280',x+5,y-2,9,1);
  }
  stump(188,140);
  const puddles = [[70,153,22],[115,165,32],[155,175,25],[49,180,19],[211,160,22],[110,137,14]];
  for (const [x, y, width] of puddles) {
    rect(rain, '#455d67', x + 2, y, width - 4, 1);
    rect(rain, '#516b75', x, y + 1, width, 2);
    rect(rain, '#607c83', x + 4, y + 3, width - 9, 1);
    rect(rain, '#82999a', x + 5, y + 1, Math.floor(width / 3), 1);
  }
  for (let y = 64; y <= 95; y++) {
    const step = Math.floor((y - 64) / 2) * 2;
    const left = 106 - Math.round(step * .99);
    const right = 131 + Math.round(step * 1.22);
    rect(snow, '#d9e7eb', left, y - 2, 3, 1);
    rect(snow, '#bed3df', right - 3, y - 2, 4, 1);
  }
  [[107,62,25],[77,95,20],[146,95,25],[84,131,11],[140,132,23],[188,136,20],[57,143,8],[28,152,11]].forEach(([x,y,w]) => {
    rect(snow, '#dbe8ec', x + 2, y - 1, w - 4, 1);
    rect(snow, '#d2e3e9', x, y, w, 2);
    rect(snow, '#acccd8', x + 1, y + 2, w - 2, 1);
  });
  const fox = [
    '..........##.......##.......',
    '..........#o#.....#o#.......',
    '..........#oo#...#oo#.......',
    '..........#ooo###ooo#.......',
    '..........#hoooooooh#.......',
    '.........#hoooooooooo#......',
    '.........#hohooohoooo#......',
    '.........#hoohohoooooo#.....',
    '........#ccoooooooooocc#....',
    '.......#cccooooooooocccc#...',
    '.......#cccccoooooccccccc#..',
    '........##cccccnccccccc##...',
    '.........#o##ccccccc###.....',
    '.......##oooo###cc##........',
    '......#ooooooooocc#.........',
    '.....#oooooohhoocc#.........',
    '....#oooooohhhoooc#.........',
    '....#ooooooohhoooc#.........',
    '.....###oooooo#oo##.........',
    '........##########..........'
  ];
  const tail=[
    '...####.......','..#ccoo###....','.#ccoooooo##..','#ccooooooooo#.','#coooohhoooo#.','.#ooooooooo#..','..#########...'
  ];
  const curledFox = [
    '....................##.........',
    '..........#####.....#o#..##....',
    '.......###ooooo###..#oo##o#....',
    '.....##ooohhhhoooo###ooooo#....',
    '....#ooohhhhhhoooohoooohoo#....',
    '...#ooohhhhooooooooooooooo#....',
    '..#ooooooooooooooccooooocc#....',
    '.#ccooooooooooocccccccccccc#...',
    '#ccccoooooooooooccccccccccn#...',
    '#cccooooooo######cccccc###.....',
    '.##########......######........'
  ];
  const heart = ['.##..##.', '########', '########', '.######.', '..####..', '...##...'];
  const colors={'#':'#623a2d',o:'#d17a43',h:'#ef9a55',c:'#ffe4b3',n:'#59382e'};
  function paintSprite(context, matrix, palette, x, y) {
    matrix.forEach((line, row) => [...line].forEach((pixel, col) => {
      if (palette[pixel]) rect(context, palette[pixel], x + col, y + row, 1, 1);
    }));
  }
  const flecks=Array.from({length:17},()=>[rnd()*256,95+rnd()*59,rnd()*5,rnd()]);
  const leaves=[[54,87,.07],[218,75,.44],[23,102,.76]];
  const weatherParticles = Array.from({length: 84}, () => [rnd() * 256, rnd() * 196, rnd()]);
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let frame,t=-1;
  let petStarted=-Infinity,petTimeout;
  const reactionTimes = {wink: 680, wag: 970, hop: 1500, spin: 1250};
  let petReaction = 'hop';
  let treatStarted=-Infinity;
  const getState=()=>document.body.dataset.scene||'idle';
  function paintDecor(seconds, placed) {
    if (placed.includes('flowers')) {
      for (const [x, y, color] of [[136,118,'#f39f88'],[141,116,'#ffcf6d'],[146,119,'#f7ca9e'],[151,116,'#df9ca5'],[155,118,'#f39f88']]) {
        rect(c, '#5f633c', x, y + 2, 1, 123 - y);
        rect(c, '#939261', x + 1, y + 3, 2, 1);
        rect(c, color, x - 1, y + 1, 3, 1);
        rect(c, color, x, y, 1, 3);
        rect(c, '#ffdf9a', x, y + 1, 1, 1);
      }
      rect(c, '#573b2e', 133, 122, 25, 2);
      rect(c, '#a66a44', 134, 123, 23, 3);
      rect(c, '#be8755', 135, 124, 21, 1);
      rect(c, '#5b4530', 134, 126, 23, 1);
    }
    if (placed.includes('bunting')) {
      const colors = ['#e9a477','#df8374','#e8cb82','#9da67a','#d69b86','#df8374','#e8cb82','#9da67a'];
      for (let x = 88; x < 161; x++) {
        const sag = Math.round(5 * Math.sin((x - 88) / 72 * Math.PI));
        rect(c, '#e7c090', x, 98 + sag, 1, 1);
      }
      colors.forEach((color, index) => {
        const x = 91 + index * 9;
        const y = 99 + Math.round(5 * Math.sin((x - 88) / 72 * Math.PI));
        const sway = Math.floor(seconds * 2 + index) % 3 === 0 ? 1 : 0;
        rect(c, color, x - 2, y, 5, 2);
        rect(c, color, x - 1 + sway, y + 2, 3, 1);
        rect(c, color, x + sway, y + 3, 1, 1);
      });
    }
    if (placed.includes('lanterns')) {
      for (const x of [93, 133]) {
        c.globalAlpha = .16 + Math.sin(seconds * 3 + x) * .045;
        rect(c, '#ffd377', x - 6, 126, 17, 12);
        rect(c, '#ffe194', x - 3, 124, 11, 16);
        c.globalAlpha = 1;
        rect(c, '#694e35', x + 2, 127, 2, 13);
        rect(c, '#634532', x, 129, 6, 6);
        rect(c, '#ffc867', x + 1, 130, 4, 4);
        rect(c, '#ffed9f', x + 2, 130, 2, 3);
        rect(c, '#ad7950', x, 128, 6, 1);
      }
    }
  }
  function paintMushroomHat(c, x, y) {
    rect(c, '#713f3d', x + 5, y, 7, 1);
    rect(c, '#713f3d', x + 2, y + 1, 13, 2);
    rect(c, '#713f3d', x, y + 3, 17, 5);
    rect(c, '#c96b56', x + 3, y + 2, 11, 2);
    rect(c, '#d87c62', x + 1, y + 4, 15, 2);
    rect(c, '#b4594c', x + 2, y + 6, 13, 1);
    rect(c, '#edba90', x + 3, y + 7, 11, 1);
    rect(c, '#fae0a8', x + 5, y + 3, 3, 2);
    rect(c, '#fae0a8', x + 11, y + 4, 2, 1);
    rect(c, '#fae0a8', x + 9, y + 2, 2, 1);
  }
  function paintOutfit(c, outfit, x, y, s, sleeping) {
    if (outfit === 'hat') {
      paintMushroomHat(c, x, y);
    } else if (outfit === 'duck') {
      rect(c, '#785130', x + 4, y - 1, 11, 2);
      rect(c, '#785130', x + 1, y + 1, 18, 4);
      rect(c, '#e4aa41', x + 2, y + 2, 16, 3);
      rect(c, '#ffd76d', x + 5, y, 10, 3);
      rect(c, '#f1bd53', x + 1, y + 5, 3, 6);
      rect(c, '#e3a442', x + 15, y + 5, 3, 5);
      rect(c, '#594332', x + 13, y + 2, 2, 2);
      rect(c, '#8b5235', x + 17, y + 4, 5, 4);
      rect(c, '#f0954e', x + 17, y + 4, 5, 2);
      if (!sleeping) {
        rect(c, '#d99b39', x - 3, y + 19, 13, 4);
        rect(c, '#edba50', x - 2, y + 19, 12, 2);
        rect(c, '#ffe18b', x + 1, y + 20, 2, 1);
      }
    } else if (outfit === 'wizard') {
      rect(c, '#4b395c', x + 10, y - 7, 8, 2);
      rect(c, '#735c98', x + 9, y - 6, 6, 2);
      rect(c, '#4b395c', x + 7, y - 4, 7, 3);
      rect(c, '#8e75aa', x + 7, y - 3, 6, 3);
      rect(c, '#4b395c', x + 5, y, 10, 4);
      rect(c, '#937bb3', x + 6, y, 8, 3);
      rect(c, '#d0a557', x + 6, y + 3, 9, 1);
      rect(c, '#534061', x + 1, y + 4, 19, 3);
      rect(c, '#8b70a9', x + 1, y + 4, 18, 1);
      rect(c, '#ffe0a1', x + 10, y + 2, 2, 3);
      if (!sleeping) {
        const shine = Math.floor(s * 3) % 3;
        rect(c, '#d7a46a', x + 21, y + 20, 1, 4);
        rect(c, '#fbd481', x + 20, y + 19, 3, 1);
        rect(c, '#ffe7a1', x + 21, y + 18, 1, 3);
        if (shine === 0) rect(c, '#eed9f4', x + 24, y + 15, 1, 1);
      }
    }
  }
  function paintWeather(sky, seconds) {
    if (sky === 'rain') {
      weatherParticles.forEach(([startX, startY, pace]) => {
        const y = (startY + seconds * (62 + pace * 52)) % 196;
        const x = (startX - y * .22 + 256) % 256;
        c.globalAlpha = .18 + pace * .25;
        rect(c, '#b3d8da', x, y, 1, 3 + Math.floor(pace * 3));
        rect(c, '#b3d8da', x - 1, y + 4, 1, 2);
      });
      puddles.forEach(([x, y, width], i) => {
        const ripple = Math.floor((seconds * 6 + i) % 6);
        c.globalAlpha = .7 - ripple * .09;
        rect(c, '#b1c7c4', x + width / 2 - ripple, y + 1, 2 + ripple * 2, 1);
      });
    } else if (sky === 'snow') {
      weatherParticles.slice(0, 60).forEach(([startX, startY, pace]) => {
        const y = (startY + seconds * (8 + pace * 15)) % 196;
        const x = (startX + Math.sin(seconds * .7 + startY) * 7 + 256) % 256;
        const size = pace > .77 ? 2 : 1;
        c.globalAlpha = .4 + pace * .48;
        rect(c, '#f7f7ee', x, y, size, size);
      });
    }
    c.globalAlpha = 1;
  }
  function paint(s){
    const state = getState();
    const isStill = media.matches;
    const placed = (document.body.dataset.decor || '').split(' ');
    const outfit = placed.find(id => id === 'hat' || id === 'duck' || id === 'wizard');
    if (document.body.dataset.view !== 'cabin') {
      portraitContext.clearRect(0, 0, portrait.width, portrait.height);
      paintFox(portraitContext, 8, 23, s, state, isStill, outfit, true);
      return;
    }
    const sky = document.body.dataset.sky;
    const moonlight = sky === 'night';
    c.drawImage(moonlight ? night : weatherScenes[sky] || base,0,0);
    if (moonlight) {
      for (let i = 0; i < skyStars.length; i += 4) {
        const [x, y] = skyStars[i];
        c.globalAlpha = .55 + Math.sin(s * 2 + i) * .28;
        rect(c, '#ffe4bc', x - 1, y, 4, 1);
        rect(c, '#ffe4bc', x, y - 1, 2, 3);
      }
      c.globalAlpha = 1;
    }
    paintDecor(s, placed);
    for(let j=0;j<5;j++){
      const age=(s*.29+j*.19)%1;
      const x=140+age*21+Math.sin(age*6+j*.3)*4,y=53-age*33,a=.47*(1-age);
      c.globalAlpha=a;rect(c,'#f7d6b9',x,y,4+Math.floor(age*6),2+Math.floor(age*3));rect(c,'#fbe1c6',x+2,y-1,3+Math.floor(age*3),1);
    }
    c.globalAlpha=1;
    for (const [originX, originY, offset] of leaves) {
      const age = (s * .085 + offset) % 1;
      const x = originX + age * 25 + Math.sin(age * 16) * 6;
      const y = originY + age * 60;
      const tilt = Math.floor(age * 18) % 2;
      c.globalAlpha = Math.min(1, age * 7, (1 - age) * 7) * .8;
      rect(c, '#dd9856', x, y, 3, 1);
      rect(c, '#e6ad67', x + tilt, y - 1, 2, 1);
    }
    c.globalAlpha=1;
    for(const [x,y,p,v] of flecks){
      let a=(Math.sin(s*(.85+v)+p*1.8)+1)/2;
      if(a>.26){c.globalAlpha=a*.73;rect(c,'#ffe3a0',x+Math.sin(s*.55+p)*5,y+Math.cos(s*.72+p)*5,v>.75?2:1,1);}
    }
    c.globalAlpha=.18+(Math.sin(s*4)+1)*.08;rect(c,'#ffcc74',159,110,8,8);c.globalAlpha=1;
    rect(c, '#7d573d', 166, 154, 29, 2);
    paintFox(c, 165, 135, s, state, isStill, outfit);
    for(const [x,y] of [[3,181],[12,174],[229,177],[243,172],[251,184]])grassFront(x,y);
    paintWeather(sky, s);
  }
  function paintFox(c, x, y, s, state, isStill, outfit, isPortrait = false) {
    const appearance = window.stillspacePalette;
    const fur = appearance?.fur;
    const eyes = appearance?.eyes;
    const palette = fur ? {...colors, '#': fur.outline, o: fur.color, h: fur.highlight} : colors;
    const now = performance.now();
    const treatAge = now - treatStarted;
    const munching = treatAge < 900;
    const petAge = now - petStarted;
    const reaction = petAge < reactionTimes[petReaction] ? petReaction : null;
    const spinning = reaction === 'spin';
    const spinProgress = spinning && !isStill ? Math.min(1, petAge / 850) : 0;
    const heartAge = Math.min(reaction === 'hop' ? petAge : Infinity, treatAge >= 900 ? treatAge - 900 : Infinity);
    const showHeart = heartAge < reactionTimes.hop;
    const engaged = Boolean(reaction || showHeart || munching);
    const sleepy = state === 'break' && !engaged;
    const blink = s % 4.2 > 3.94 && !engaged;
    const tailDip = reaction === 'wag' ? (isStill ? -3 : -Math.round(Math.abs(Math.sin(petAge / 87)) * 4))
      : isStill ? 0 : isPortrait
      ? Math.round(Math.sin(s * 4) * 1.5)
      : Number(Math.floor(s * (state === 'focus' ? 3.4 : 1.8)) % 4 === 1);
    let bob = 0;
    if (!isStill) {
      if (spinning) bob = Math.round(Math.sin(spinProgress * Math.PI) * 5);
      else if (munching) bob = Math.floor(treatAge / 130) % 2;
      else if (showHeart) bob = Math.round(Math.max(0, Math.sin(heartAge / 130)) * 4);
      else if (reaction) bob = 0;
      else if (state === 'celebrate') bob = Math.round(Math.abs(Math.sin(s * 5)) * 5);
      else if (isPortrait && state === 'idle') {
        const hop = (s + 1.4) % 9;
        if (hop < .65) bob = Math.round(Math.sin(hop / .65 * Math.PI) * 3);
      }
    }
    if (sleepy) {
      const breath = !isStill && Math.sin(s * 2.1) > .5 ? 1 : 0;
      paintSprite(c, curledFox, palette, x - 3, y + 9 - breath);
      rect(c, '#52362d', x + 21, y + 15 - breath, 3, 1);
      paintOutfit(c, outfit, x + 13, y + 4 - breath, s, true);
      for (let i = 0; i < 2; i++) {
        const drift = isStill ? i * 5 : Math.floor((s * 5 + i * 6) % 12);
        const zx = x + 24 + i * 5 + Math.floor(drift / 3);
        const zy = y + 5 - drift;
        c.globalAlpha = 1 - drift / 15;
        rect(c, '#ffe4b3', zx, zy, 3, 1);
        rect(c, '#ffe4b3', zx + 1, zy + 1, 1, 1);
        rect(c, '#ffe4b3', zx, zy + 2, 3, 1);
      }
      c.globalAlpha = 1;
    } else {
      if (spinning && !isStill) {
        const turn = Math.cos(spinProgress * 2 * Math.PI);
        const width = Math.max(.25, Math.round(Math.abs(turn) * 4) / 4);
        c.save();
        c.translate(x + 13, 0);
        c.scale(turn < 0 ? -width : width, 1);
        c.translate(-(x + 13), 0);
      }
      paintSprite(c, tail, palette, x - 4, y + 12 + tailDip - bob);
      paintSprite(c, fox, palette, x, y - bob);
      for (const eye of [13, 19]) {
        if (reaction === 'wink' && eye === 19) {
          rect(c, '#52362d', x + eye - 1, y + 8 - bob, 4, 1);
          rect(c, '#52362d', x + eye + 2, y + 7 - bob, 1, 1);
          continue;
        }
        const smiling = showHeart || munching || spinning;
        rect(c,'#52362d',x+eye,y+7-bob,2,blink||smiling?1:2);
        if (smiling) rect(c,'#52362d',x+eye+1,y+6-bob,1,1);
        else if (!blink) rect(c, eyes?.id === 'brown' || !eyes ? '#fff0d3' : eyes.color, x+eye, y+7-bob, 1, eyes && eyes.id !== 'brown' ? 2 : 1);
      }
      rect(c,'#e69a74',x+10,y+9-bob,2,1);
      rect(c,'#e69a74',x+22,y+9-bob,2,1);
      paintOutfit(c, outfit, x + 8, y - 5 - bob, s, false);
      if (spinning && !isStill) c.restore();
      if (spinning) {
        c.globalAlpha = isStill ? 1 : Math.min(1, (reactionTimes.spin - petAge) / 350);
        for (let i = 0; i < 5; i++) {
          const angle = -Math.PI / 2 + (i / 5 + spinProgress) * 2 * Math.PI;
          const sx = x + 13 + Math.round(Math.cos(angle) * 18);
          const sy = y + 4 + Math.round(Math.sin(angle) * 10) - bob;
          const radius = i % 2 ? 1 : 2;
          const color = i % 2 ? '#ffd782' : '#cf8a36';
          rect(c, color, sx - radius, sy, 2 * radius + 1, 1);
          rect(c, color, sx, sy - radius, 1, 2 * radius + 1);
          rect(c, '#fff0c2', sx, sy, 1, 1);
        }
        c.globalAlpha = 1;
      }
      if (reaction === 'wink') {
        rect(c, '#e7ad55', x + 26, y + 5, 5, 1);
        rect(c, '#e7ad55', x + 28, y + 3, 1, 5);
      }
      if (reaction === 'wag' && !isStill && tailDip < -1) {
        rect(c, '#ce8e66', x - 6, y + 9, 3, 1);
        rect(c, '#ce8e66', x - 7, y + 12, 2, 1);
      }
    }
    if(state==='focus'&&!engaged){
      rect(c,'#745040',x+21,y+17,8,4);
      rect(c,'#f5cf96',x+22,y+17,8,3);
      rect(c,'#824c38',x+26,y+17,1,3);
      rect(c,'#ba835a',x+23,y+18,2,1);
      if (!isStill && s % 5.2 < .42) {
        rect(c, '#ffe2a8', x + 25, y + 15, 3, 1);
        rect(c, '#f5cf96', x + 26, y + 16, 3, 1);
      }
    }
    if(state==='celebrate'){
      const yy=y-7-(isStill?0:Math.floor((s*3)%4));
      rect(c,'#ffe0a1',x+26,yy,5,1);rect(c,'#ffe0a1',x+28,yy-2,1,5);
      rect(c,'#ffc77b',x+34,yy+7,5,1);rect(c,'#ffc77b',x+36,yy+5,1,5);
    }
    if (munching) {
      if (isStill || treatAge < 350) {
        rect(c, '#955a3d', x + 15, y + 13, 7, 4);
        rect(c, '#e1a064', x + 16, y + 13, 5, 3);
        rect(c, '#ae504f', x + 18, y + 14, 1, 1);
      } else {
        for (const [dx, dy] of [[13,2],[18,3],[22,0]]) {
          const fall = Math.floor((treatAge - 350) / 100);
          rect(c, '#f9c489', x + dx, y + 12 - dy + fall, 1, 1);
        }
      }
    } else if (showHeart) {
      const heartY = y - 9 - (isStill ? 0 : Math.floor(heartAge / 120));
      c.globalAlpha = isStill ? 1 : Math.min(1, (reactionTimes.hop - heartAge) / 350);
      heart.forEach((row, dy) => [...row].forEach((pixel, dx) => {
        if (pixel === '#') rect(c, dy < 2 ? '#ffd2ac' : '#e78572', x + 21 + dx, heartY + dy, 1, 1);
      }));
      c.globalAlpha = 1;
    }
  }
  function grassFront(x,y){
    rect(c,'#62553a',x,y,7,2);rect(c,'#746346',x+1,y-3,2,4);rect(c,'#8a7448',x+4,y-4,2,5);
  }
  function loop(ms){
    if(ms-t>82){paint(ms/1000);t=ms;}frame=requestAnimationFrame(loop);
  }
  function sync(){
    cancelAnimationFrame(frame);paint(1.36);
    if(!media.matches&&!document.hidden)frame=requestAnimationFrame(loop);
  }
  media.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  function refreshStillReaction() {
    clearTimeout(petTimeout);
    if (!media.matches) return;
    paint(1.36);
    const now = performance.now();
    const remaining = [petStarted + reactionTimes[petReaction] - now, treatStarted + 2400 - now]
      .filter(time => time > 0);
    if (remaining.length) petTimeout = setTimeout(refreshStillReaction, Math.min(...remaining) + 10);
  }
  document.addEventListener('rue-cheer', event => {
    petReaction = Object.hasOwn(reactionTimes, event.detail) ? event.detail : 'hop';
    petStarted = performance.now();
    refreshStillReaction();
  });
  document.addEventListener('rue-treat', () => {
    treatStarted = performance.now();
    refreshStillReaction();
  });
  new MutationObserver(()=>{if(media.matches)paint(1.36);}).observe(document.body,{attributeFilter:['data-scene','data-decor','data-sky','data-view','data-palette']});
  sync();
})();
