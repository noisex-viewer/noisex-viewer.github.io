
let generating = false; // Flag to indicate if generating image
//attirubutes
let yoff = 0.0; // 2nd dimension of Perlin noise
let echoCount = [0,1,2,3,4,5 ]; // Number of echoes
let echoSpacing = 2; // Spacing between echoes
let enableEcho = false; // Toggle for echo effect
let enableGlitch = false; // Toggle for glitch effect

let backgroundColors = ['#333333', '#555555', '#777777', '#999999', '#CC6600', '#990099', '#0099CC', '#CC0033']; // Choose background colors
let waveColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF6600', '#9900FF', '#00CCFF', '#FF0066']; // Choose wave colors

let backgroundColorIndex = 5; // Index to select background color
let waveColorIndex = 5; // Index to select wave color
let table; // variable to store the CSV data
let blockNumberInput;
let canvas;

function preload() {
  // Load the CSV file using the raw URL
  let csvUrl = 'https://raw.githubusercontent.com/noisex-viewer/noisex-viewer.github.io/main/noisex.csv';
  table = loadTable(csvUrl, 'csv', 'header');
}

function setup() {
  // Get the input and button from the HTML file
  blockNumberInput = select('#blockNumberInput');
  let generateButton = select('#generateButton');
  generateButton.mousePressed(generateFromInput);

  // Create canvas but hide it initially
  canvas = createCanvas(710, 400);
  canvas.hide();

}

// used for looping
function draw() {
  if (generating) {
    generateFromInput();
  }
}




function generateFromInput() {
  let blockNumber = int(blockNumberInput.value());
  let row = table.findRow(String(blockNumber), 'number');
  if (row) {

    let weight = row.get('weight');
    let fee = row.get('fee_reward_btc');
    let nonce = (row.get('nonce'));
    let txs = parseInt(row.get('total_transactions'));

    if (txs >= 1 && txs <= 100) {enableGlitch = true};
    //background, should need to recode this shit, but it works so it's fine
    if (nonce >= 226570 && nonce <= 537057658) {backgroundColorIndex=7}
    else if (nonce> 537057658 && nonce <= 1073888746) {backgroundColorIndex=6}
    else if (nonce>= 1073888747 && nonce <= 1610719836) {backgroundColorIndex=5}
    else if (nonce>= 1610719837 && nonce <= 2147550925) {backgroundColorIndex=4}
    else if (nonce>= 2147550926 && nonce <= 2684382014) {backgroundColorIndex=3}
    else if (nonce>= 2684382015 && nonce <= 3221213103) {backgroundColorIndex=2}
    else if (nonce>= 3221213104 && nonce <= 3758044192) {backgroundColorIndex=1}
    else if (nonce>= 3758044193 && nonce <= 4294875281) {backgroundColorIndex=0}
    // line color
    if (fee >= 0 && fee <= 10817082) {waveColors=7}
    else if (fee> 10817083 && fee <= 21634164) {waveColors=6}
    else if (fee>= 21634164 && fee <= 32451246) {waveColors=5}
    else if (fee>= 32451247 && fee <= 43268328) {waveColors=4}
    else if (fee>= 43268329 && fee <= 54085410) {waveColors=3}
    else if (fee>= 54085411 && fee <= 64902492) {waveColors=2}
    else if (fee>= 64902493 && fee <= 75719574) {waveColors=1}
    else if (fee>= 75719574 && fee <= 86536657) {waveColors=0}



  background(backgroundColors[backgroundColorIndex]);
  stroke(waveColors[waveColorIndex]);
  //noFill();

  let amplitude = 100; // Controls the amplitude of the wave

  if (enableGlitch) {
    applyGlitch(1); // Apply glitch effect with a probability of 10%
  }

  // Draw the main wave
  drawWave(0, amplitude);

  // Draw echoes if enabled
  if (enableEcho) {
    for (let i = 1; i <= echoCount; i++) {
      let echoAmplitude = amplitude * 1 / i; // Decrease amplitude for each echo
      stroke(waveColors[waveColorIndex]);
      drawWave(i * echoSpacing, echoAmplitude);
    }
  }
  canvas.show();
}}

function drawWave(phaseOffset, amplitude) {
  beginShape();

  let xoff = 0;
  for (let x = 0; x <= width; x += 10) {
    // Calculate a y value according to Perlin noise
    let y = map(noise(xoff, yoff), 0, 1, -amplitude, amplitude);

    // Set the vertex
    vertex(x, height / 2 + y); // Center the wave vertically

    // Increment x dimension for Perlin noise
    xoff += 0.1; // Adjust this value for different frequencies
  }
  yoff += 0.01; // Increment y dimension for Perlin noise

  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function applyGlitch(probability) {
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    if (random(1) < probability) {
      // Modify the color channels randomly
      pixels[i] = int(random(255)); // Red
      pixels[i + 1] = int(random(255)); // Green
      pixels[i + 2] = int(random(255)); // Blue
    }
  }
  updatePixels();
}

// Add event listener for the "Generate" button
document.getElementById("generateButton").addEventListener("click", function() {
  generating = true;
});