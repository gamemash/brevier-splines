let Splines = require('./src/splines.js');


function addPoint(event){
  let x = event.offsetX;
  let y = event.offsetY;
  clear();

  splines.addPoint(x, y);
  draw();
}

function clear(){
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function reset(){
  splines = new Splines();
  clear();
}

function draw(){
  splines.draw(context);
  splines.generateBreviers().forEach(function(brevier){
    brevier.draw(context);
  });

}


let canvas = document.getElementById("brezier");
canvas.width = 768;
canvas.height= 512;

canvas.addEventListener('click', addPoint, false);
let context = canvas.getContext("2d");
let splines = new Splines();

document.getElementById("clearBtn").addEventListener("click", reset, false);
