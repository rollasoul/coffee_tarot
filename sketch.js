//not so serious coffee ground tarot engine to give you early morning joys :) 
// tarot explanations taken from https://github.com/dariusk/corpora/blob/master/data/divination/tarot_interpretations.json

let video;
let button;
let snapshot;
let text_counter = 0;

let rank; // king: rank 25, queen: rank 24, knight: rank 23, page: rank 22;
let brightness;
let fortune_array = [];
let data;
let fortunes;

function preload() {
  title = loadImage("etch.png");
  data = loadJSON("https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json")
}

function setup(){
  video = createCapture(VIDEO);
  video.position(windowWidth/2 - video.width/2, windowHeight/2  - video.height/2);
  video.size(320, 240); 
  button = createButton('snap !');
  button.position(windowWidth/2 - 20, windowHeight/2 + 35);
  button.mousePressed(takesnap);
}

function takesnap() {
  snapshot = video.get();
  text_counter = 0;
  createCanvas(windowWidth, windowHeight);
  push();
  imageMode(CENTER);
  translate(windowWidth / 2, windowHeight / 2 - title.height/64 - 30);
  scale(0.4);
  image(title, 0, 0);
  pop();
}

function getBrightness() {
  snapshot.loadPixels();
  // Begin loop for columns
  let r, g, b;
  let colorSum = 0;
  for (let x = 0, len = snapshot.pixels.length; x < len; x += 4) { // noprotect.
    r = snapshot.pixels[x];
    g = snapshot.pixels[x + 1];
    b = snapshot.pixels[x + 2];
    avg = Math.floor((r + g + b) / 3);
    colorSum += avg;
  }
  brightness = Math.floor(colorSum / (snapshot.width * snapshot.height));
  print(brightness);
  //map & round brightness to 0 - 10 value of Tarot cards
  brightness = round(map(brightness, 0, 255, 0, 25), 0);
  //console.log(brightness)
  rank = brightness;
  print("brightness: " + rank);
}

// append all entries into array for ranks
function find_ranks(key) {
  for (i = 0; i < data.tarot_interpretations.length; i++) {
    if (data.tarot_interpretations[i].rank == key) {
      console.log('found matching rank in array ' + i);
      fortune_array.push(i);
    }
  }
  console.log('found matching rank in arrays ' + fortune_array)
  rank = fortune_array[round((random(fortune_array.length - 1)), 0)];
  console.log('selected rank in array ' + rank)
}

function draw() {
  if (snapshot && text_counter == 0) {
    video.hide();
    button.hide();
    imageMode(CENTER);
    translate(windowWidth / 2, windowHeight / 2);
    scale(0.6);
    image(snapshot, 0, 0);
    snapshot.loadPixels();
    //get average brightness of image and match it to card rank in tarot set;
    getBrightness();
    console.log("rank yoy yo yo: " + rank); //can somehow not access "rank" as a global variable ...???
    // search as well for king, queen, knight and page ranks
    if (rank > 21) {
      extra_ranks = ['page', 'knight', 'queen', 'knight'];
      rank = extra_ranks[rank - 22];
      console.log(rank);
      find_ranks(rank);
      fortunes = data.tarot_interpretations[rank].fortune_telling[data.tarot_interpretations[rank].fortune_telling.length - 1];
    } 
    else {
      find_ranks(rank);
        print("mny")
        fortunes = data.tarot_interpretations[rank].fortune_telling[data.tarot_interpretations[rank].fortune_telling.length - 1];
    }
    print("rank late" + rank);
    console.log(fortunes);
    push();
    textAlign(CENTER);
    textSize(22);
    textFont("Cutive Mono")
    text(fortunes + ".", 0, windowHeight / 3 + snapshot.height * 0.1 / 2 + 100);
    pop();
    fortunes = data.tarot_interpretations[0].fortune_telling[0];
    text_counter = 1;
  }
}

// // go fullscreen and resize if necessary
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
