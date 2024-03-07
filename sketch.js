// reference https://tympanus.net/codrops/2018/03/06/creative-audio-visualizers/


var songs = [ "sawsquarenoise_-_05_-_Rito_Oculto.mp3", "pumkin_spice_edit.mp3", "lobo_loco_edit.mp3"];
var colorPalette = ["#FAA275", "#19C4D1", "#ED688B", "#973BF9"];
var sliderRate;

function setup() {
  createCanvas(windowWidth, windowHeight-60);
	song = loadSound(songs[Math.floor(random(songs.length))]);
	fft = new p5.FFT();
  button = createButton("play");
  button.addClass("playbutton");
  button.mousePressed(togglePlaying);
  sliderRate = createSlider(0, 3, 1, 0.1)
  sliderRate.addClass("slider");
}


function draw() {
  background('#351025');
  song.rate(sliderRate.value());
  var pieces = 48;
  var radius = 200;
  var spectrum = fft.analyze();
  var bass = fft.getEnergy("bass");
  var mid = fft.getEnergy("mid");
  var treble = fft.getEnergy("treble");
  var mapMid = map(mid, 0, 255, -radius, radius);
	var scaleMid = map(mid, 0, 255, -1.5, 1.5);
	var mapTreble = map(treble, 0, 255, -radius, radius);
	var scaleTreble = map(treble, 0, 255, 1, 1.5);
	var mapbass = map(bass, 0, 255, -100, 800);
	var scalebass = map(bass, 0, 255, 0.5, 2);
  translate( width/2, height/2 );
  noFill();
  stroke( colorPalette[3] );
  strokeWeight(mapbass);
  scale(scalebass);
	rotate(frameCount/mouseX+mouseY*10);
  ellipse( 0, 0, (radius-100));
  stroke( colorPalette[1] );
  ellipse( 0, 0, radius-150 );
  for( i = 0; i < pieces; i++ ) {
    strokeWeight(1);
  stroke(colorPalette[1]);
  ellipse( 50, radius-50, 50, radius );
    stroke(colorPalette[0]);
    strokeWeight(3);
    point (radius+20, radius+20);
    strokeWeight(1.5);
    rotate(mapTreble/10);
    stroke( colorPalette[3] );
    line( 0, radius/2, 0, radius*2 );
    stroke( colorPalette[2] );
    push;
    line(mapMid, radius / 2, radius, radius);
    stroke(colorPalette[0]);
    pop;
  }
}


function mousePressed(){
 shuffle(colorPalette, true); 
}


function togglePlaying(){
 if (!song.isPlaying()){
   song.play();
  button.html("pause");
} else{ 
  song.pause();
  button.html("play")
}
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight-60);
}

