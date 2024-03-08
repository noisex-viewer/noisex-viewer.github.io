let yoff = 0.0; // 2nd dimension of Perlin noise
let echoCount = 5; // Number of echoes
let echoSpacing = 2; // Spacing between echoes
let enableEcho = false; // Toggle for echo effect
let enableGlitch = false; // Toggle for glitch effect
let generating = false; // Flag to indicate if generating image

// Color variables
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

  background(backgroundColors[backgroundColorIndex]);

  stroke(waveColors[waveColorIndex]);
  noFill();

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