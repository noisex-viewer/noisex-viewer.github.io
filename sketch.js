let yoff = 0.0; // 2nd dimension of Perlin noise
let generating = false; // Flag to indicate if generating image

// Add event listener for the "Generate" button
document.getElementById("generateButton").addEventListener("click", function() {
  generating = true;
});

function preload() {
  // Load CSV file
  data = loadTable('test.csv', 'csv', 'header');
  console.log(data)
}

function setup() {
  createCanvas(710, 400);
}

function draw() {
  if (generating) {
    let row = data[Math.floor(random(data.getRowCount()))]; // Get random row from CSV

    let backgroundColor = row.get('background_color'); // Get background color
    let waveColor = row.get('wave_color'); // Get wave color
    let echoEnabled = (row.get('echo_enabled') === 'true'); // Check if echo is enabled
    let echoCount = parseInt(row.get('echo_count')); // Get echo count
    let echoSpacing = parseInt(row.get('echo_spacing')); // Get echo spacing
    let glitchEnabled = (row.get('glitch_enabled') === 'true'); // Check if glitch is enabled

    generateImage(backgroundColor, waveColor, echoEnabled, echoCount, echoSpacing, glitchEnabled);
    generating = false; // Reset flag
  }
}

function generateImage(backgroundColor, waveColor, echoEnabled, echoCount, echoSpacing, glitchEnabled) {
  background(backgroundColor);

  stroke(waveColor);
  noFill();

  let frequency = 0.1; // Controls the frequency of the wave
  let amplitude = 100; // Controls the amplitude of the wave

  if (glitchEnabled) {
    applyGlitch(0.1); // Apply glitch effect with a probability of 10%
  }

  // Draw the main wave
  drawWave(0, amplitude);

  // Draw echoes if enabled
  if (echoEnabled) {
    for (let i = 1; i <= echoCount; i++) {
      let echoAmplitude = amplitude * 0.5 / i; // Decrease amplitude for each echo
      let echoAlpha = 255 / i; // Decrease opacity for each echo
      stroke(waveColor);
      drawWave(i * echoSpacing, echoAmplitude);
    }
  }
}

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
  if (random(1) < probability) {
    let x1 = int(random(width));
    let x2 = int(random(width));
    let y1 = int(random(height));
    let y2 = int(random(height));
    let c = get(x1, y1);
    set(x1, y1, get(x2, y2));
    set(x2, y2, c);
    updatePixels();
  }
}
