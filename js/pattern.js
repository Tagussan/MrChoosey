var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var running = false;
var COLS = 16, ROWS = 16;
var W = 296, H = 296, MARGIN = 10;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
var TIMESCALE = 1;
var MOUSESIZE;
var TOR = 5;
var imagedata = [255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,
  0,255,79,0,255,79,0,255,196,215,255,153,79,255,79,0,255,79,0,255,79,0,255,79,79,255,223,215,255,200,220,255,244,238,255,240,233,255,232,229,255,236,
  233,255,240,238,255,236,210,255,90,0,255,79,0,255,223,247,255,170,92,255,79,0,255,79,0,255,79,0,255,79,92,255,251,247,255,137,112,255,146,121,255,133,
  145,255,251,247,255,159,121,255,140,121,255,146,121,255,79,0,255,79,0,255,219,242,255,170,92,255,79,0,255,79,0,255,79,0,255,79,92,255,247,242,255,109,
  0,255,79,0,255,79,79,255,247,242,255,109,0,255,79,0,255,79,0,255,79,0,255,79,0,255,219,242,255,170,92,255,79,0,255,79,0,255,79,0,255,79,92,255,247,242,
  255,109,0,255,79,0,255,79,92,255,247,242,255,109,0,255,79,0,255,79,0,255,79,0,255,79,0,255,219,242,255,170,92,255,79,0,255,79,0,255,79,0,255,79,92,255,247,
  242,255,109,0,255,79,0,255,79,92,255,247,242,255,109,0,255,79,0,255,79,0,255,79,0,255,79,0,255,223,247,255,170,92,255,79,0,255,79,0,255,79,0,255,79,92,255,251,247,
  255,118,0,255,79,0,255,79,92,255,247,242,255,109,0,255,79,0,255,79,0,255,79,0,255,79,0,255,176,210,255,255,255,255,251,251,255,251,251,255,251,251,255,251,255,255,236,
  200,255,79,0,255,79,0,255,79,92,255,247,242,255,109,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,
  255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,210,215,255,118,0,255,186,220,255,255,242,255,124,152,255,255,255,255,
  255,255,255,255,255,255,255,255,255,255,255,255,244,205,255,79,0,255,79,0,255,79,0,255,79,0,255,79,92,255,251,242,255,180,210,255,255,255,255,255,242,255,124,152,255,
  255,247,255,100,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,100,65,255,79,92,255,247,242,255,130,159,255,255,255,
  255,236,229,255,232,229,255,232,229,255,236,229,255,181,130,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,92,255,247,242,255,117,79,255,165,
  159,255,176,165,255,176,165,255,176,165,255,186,210,255,255,215,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,92,255,247,242,255,124,121,255,
  210,183,255,100,46,255,90,46,255,90,0,255,118,165,255,251,215,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,92,255,247,242,255,109,79,255,240,
  255,255,255,255,255,255,255,255,255,255,255,255,255,255,223,177,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,
  255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0,255,79,0];
var color_ori = [], color_cur = [], imagenum = 1; // Drawing
var mx, my, mbx, mby, click = false, manual, active, restore; // Mouse

var MS = false, MSOVER = false, MINE_N = 20;
var mine = [], mine_around = [], mine_open = [];

/*
  PREPARATION
*/
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame ||window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
  window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
  window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame;
})();

function drawBlock(x, y){
  if(color_cur[y][x]) {
    ctx.fillStyle = "rgb(" + color_cur[y][x][0] + "," + color_cur[y][x][1] + "," + color_cur[y][x][2] + ")";
    ctx.fillRect(BLOCK_W * x + 1, BLOCK_H * y + 1, BLOCK_W - 2 , BLOCK_H - 2);
  }
}

function drawFrame(x, y){
  if(color_cur[y][x]) {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
  }
}

function checkClick(e){
  if(running){
    if(MS && !MSOVER){
      checkMine(mbx+1, mby+1);
      //mine_open[mby+1][mbx+1] = true;
    } else if(MS && MSOVER){
      init();
    }
  }
}

/*
  PATTERN FORMATION
*/
function init(){
  // Image initialization
  for (var y = 0; y < ROWS; y++) {
    color_ori[y] = [];
    color_cur[y] = [];
    for (var x = 0; x < COLS; x++) {
      color_ori[y][x] = [imagedata[(y * COLS + x) * 3], imagedata[(y * COLS + x) * 3 + 1], imagedata[(y * COLS + x) * 3 + 2]];
      color_cur[y][x] = [Math.floor(255 - Math.random() * 100), Math.floor(79 + Math.random() * 100), Math.floor(Math.random() * 100)];
      drawBlock(x, y);
    }
  }
  // Init;
  manual = true;
  restore = true;
  MOUSESIZE = 5;
  MS = false;
  // MOUSE EVENT
  canvas.addEventListener('mousemove', function(e) {
    bounds = canvas.getBoundingClientRect();
    mx = e.clientX - bounds.left;
    my = e.clientY - bounds.top;
    mby = Math.floor(my / BLOCK_H);
    mbx = Math.floor(mx / BLOCK_W);
    active = true;
    manual = true;
  });
  canvas.addEventListener('mouseout', function(e) {
    $('.canvas-stats').css('display','none');
    active = false;
    //manual = false;
  });
  canvas.addEventListener('mouseover', function(e) {
    $('.canvas-stats').css('display','block');
  });
  canvas.addEventListener('click', checkClick);
}

function patternform(){
  ctx.clearRect(0, 0, W, H);
  for(var y = 0; y < ROWS; y++) {
    for(var x = 0; x < COLS; x++) {
      // Mouse Motion
      if((x - MOUSESIZE / 2) < mbx && (x + MOUSESIZE / 2) > mbx
          && (y - MOUSESIZE / 2) < mby && (y + MOUSESIZE / 2) > mby
          && (active || !manual)){
        if(!MS){
          //color_cur[y][x] = [255, 255, 255];
        } else if(MS) {
          drawFrame(x, y);
        }
      }
      // Pattern Restoration
      if(restore){
        for(var i = 0; i < 3; i++){
          if(color_ori[y][x][i] > color_cur[y][x][i] + TOR ){
            color_cur[y][x][i] += TIMESCALE;
          } else if(color_ori[y][x][i] < color_cur[y][x][i] - TOR){
            color_cur[y][x][i] -= TIMESCALE;
          }
        }
      }
      // Draw
      drawBlock(x, y);
      // mineSweeper
      if(MS){
        // for debug
        mineSweeper(x+1,y+1);
      }
    }
  }
  // AUTO
  if(!manual || !active){
    t = +new Date() * 0.001;
    mx = W / 2 * Math.sin(t * 3 + 2) + W / 2;
    my = W / 2 * Math.cos(t * 4) + W / 2;
  }
  // DEBUG
  /*
  if(document.getElementById){
    document.getElementById('debug').innerHTML = 'DEBUG<br>MS:' + MS + '<br>MOUSE-X: ' + mbx +' MOUSE-Y: ' + mby
    +'<br>MANUAL: ' + manual + ' ACTIVE: ' + active + '<br>MSOVER:' + MSOVER;
  }
  */
  // ANIMATION
  if(running){
    requestAnimationFrame(patternform);
  } else {
    cancelAnimationFrame(patternform);
  }
}

function flush(){
  if(running){
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      color_cur[y][x] = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    }
  }
  }
}

/*
    MINESWEEPER
*/
function msINIT(){
  // Prepare 2 more blank array
  for (var y = 0; y < ROWS + 2; y++) {
    mine[y] = [];
    mine_around[y] = [];
    mine_open[y] = [];
    for (var x = 0; x < COLS + 2; x++) {
      mine[y][x] = false;
      mine_around[y][x] = 0;
      mine_open[y][x] = false;
    }
  }
  for (var i = 0; i < MINE_N; i++){
    var iy = Math.floor(Math.random() * ROWS);
    var ix = Math.floor(Math.random() * COLS);
    // Avoid Overlapping
    while(mine[iy+1][ix+1]){
      iy = Math.floor(Math.random() * ROWS), ix = Math.floor(Math.random() * COLS);
    }
    // Update Map
    mine[iy+1][ix+1] = true;
    mine_around[iy][ix]++;
    mine_around[iy+1][ix]++;
    mine_around[iy][ix+1]++;
    mine_around[iy+2][ix]++;
    mine_around[iy+2][ix+1]++;
    mine_around[iy][ix+2]++;
    mine_around[iy+1][ix+2]++;
    mine_around[iy+2][ix+2]++;
  }
  MOUSESIZE = 1;
  MSOVER = false;
  TIMESCALE = 2;
  MS = true;
}

function mineSweeper(x, y){
      if(mine_open[y][x]){
        color_ori[y-1][x-1] = [255 - 32 * mine_around[y][x], 255 - 32 * mine_around[y][x], 255 - 32 * mine_around[y][x]];
        color_cur[y-1][x-1] = [255 - 32 * mine_around[y][x], 255 - 32 * mine_around[y][x], 255 - 32 * mine_around[y][x]];
      }
}

function checkMine(x, y){
  if(x < 1 || x > COLS || y < 1 || y > ROWS){
    return;
  }
  if(mine_open[y][x]){
    return;
  }
  mine_open[y][x] = true;
  if(!mine[y][x] && mine_around[y][x] == 0){
    checkMine(x-1, y-1);
    checkMine(x+1,y);
    checkMine(x,y-1);
    checkMine(x+1,y-1);
    checkMine(x-1,y);
    checkMine(x-1,y+1);
    checkMine(x,y+1);
    checkMine(x+1,y+1);
  } else if (mine[y][x]){
    msOVER();
  }
}

function msOVER(){
  MSOVER = true;
  window.alert('GAMEOVER.')
  for (var y = 1; y < ROWS + 1; y++) {
    for (var x = 1; x < COLS + 1; x++) {
      if(!mine[y][x]){
        color_ori[y-1][x-1] = [255 - 32 * mine_around[y][x], 255 - 32 * mine_around[y][x], 255 - 32 * mine_around[y][x]];
      }
    }
  }
}

init();

function onoff(){
  if(!running){
    $('.onoff').addClass('on');
    running = true;
    $('.canvas-control').css('display','none');
    //$('.canvas-stats .onoff').css('background-color','green');
    $('.canvas-stats .reset').css('display','inline-block');
    $('.canvas-stats .msonoff').css('display','inline-block');
    requestAnimationFrame(patternform);
  } else {
    $('.onoff').removeClass('on');
    running = false;
    //$('.canvas-stats .onoff').css('background-color','red');
    $('.canvas-stats .reset').css('display','none');
    $('.canvas-stats .msonoff').css('display','none');
  }
}

function msOnoff(){
  if(running && !MS){
    $('.msonoff').addClass('on');
    msINIT();
  } else if(running && MS){
    $('.msonoff').removeClass('on');
    init();
  }
}
