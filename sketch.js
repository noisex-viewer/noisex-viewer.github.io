let generating = false; // Flag to indicate if generating image
// Attributes
let yoff = 0.0; // 2nd dimension of Perlin noise
let echoCount = 0; // Number of echoes
let echoSpacing = 2; // Spacing between echoes
let enableEcho = false; // Toggle for echo effect
let enableGlitch = false; // Toggle for glitch effect
let backgroundc;
let wavec;
let have_echos;
let is_glitch;

let backgroundColors = ['#00FFFF', '#008080', '#FFA500', '#ADFF2F', '#9370DB', '#CC0033', '#555555', '#edebeb']; // Choose background colors
let waveColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF6600', '#9900FF', '#00CCFF', '#FF0066']; // Choose wave colors

let backgroundColorIndex = 0; // Index to select background color
let waveColorIndex = 0; // Index to select wave color
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

// Used for looping
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

    // Toggle glitch effect based on transaction count
    enableGlitch = txs >= 1 && txs <= 100;

    // Background color
    backgroundColorIndex = calculateBackgroundColorIndex(nonce);

    // Wave color
    waveColorIndex = calculateWaveColorIndex(fee);

    // Echo
    enableEcho = txs >= 0 && txs <= 2000;
    if (enableEcho) {
      echoCount = calculateEchoCount(txs);
    }
    else {have_echos=false}

    background(backgroundColors[backgroundColorIndex]);
    backgroundc = backgroundColors[backgroundColorIndex];
    stroke(waveColors[waveColorIndex]);
    wavec = waveColors[waveColorIndex];
    noFill();

    let amplitude = 100; // Controls the amplitude of the wave

    // Apply glitch effect
    if (enableGlitch) {
      is_glitch = true;
      applyGlitch(0.2, 3);; // Apply glitch effect with a probability of 10%
    }
    else { is_glitch=false}

    // Draw the main wave
    drawWave(0, amplitude);

    // Draw echoes if enabled
    if (enableEcho) {
      have_echos = true;
      for (let i = 1; i <= echoCount; i++) {
        let echoAmplitude = amplitude * 1 / i; // Decrease amplitude for each echo
        stroke(waveColors[waveColorIndex]);
        drawWave(i * echoSpacing, echoAmplitude);
      }
    }

    let containerDiv = document.getElementById('generatedImageContainer');
    containerDiv.innerHTML = ''; // Clear previous content
    containerDiv.appendChild(canvas.elt);
    canvas.show();
    updateStats();
  }
}

function drawWave(phaseOffset, amplitude) {
  beginShape();

  let xoff = 0;
  for (let x = -100; x <= width + 100; x += 5) { // Adjusted range to include extra points off the canvas
    // Calculate a y value according to Perlin noise
    let y = map(noise(xoff, yoff), 0, 1, -amplitude, amplitude);

    // Set the vertex if within canvas boundaries
    if (x >= 0 && x <= width) {
      vertex(x, height / 2 + y); // Center the wave vertically
    }

    // Increment x dimension for Perlin noise
    xoff += 0.05; // Adjust this value for different frequencies
  }
  yoff += 0.01; // Increment y dimension for Perlin noise

  endShape();
}

function applyGlitch(probability, blockSize) {
  loadPixels();
  for (let x = 0; x < width; x += blockSize) {
    for (let y = 0; y < height; y += blockSize) {
      if (random(1) < probability) {
        let r = int(random(255)); // Red
        let g = int(random(255)); // Green
        let b = int(random(255)); // Blue
        // Modify block of pixels
        for (let i = x; i < x + blockSize && i < width; i++) {
          for (let j = y; j < y + blockSize && j < height; j++) {
            let index = (i + j * width) * 4;
            pixels[index] = r;
            pixels[index + 1] = g;
            pixels[index + 2] = b;
          }
        }
      }
    }
  }
  updatePixels();
}


function updateStats() {
  let statsHTML = `
    <p><b>Background color:</b> ${backgroundc}</p>
    <p><b>Wave color:</b> ${wavec}</p>
    <p><b>Is glitch:</b> ${is_glitch}</p>
    <p><b>Has echo:</b> ${have_echos}</p>
    <p><b>Echo count:</b> ${echoCount}</p>
  `;
  document.getElementById('statsContainer').innerHTML = statsHTML;
}

function calculateBackgroundColorIndex(nonce) {
  if (nonce >= 226570 && nonce <= 537057658) {
    return 7;
  } else if (nonce > 537057658 && nonce <= 1073888746) {
    return 6;
  } else if (nonce >= 1073888747 && nonce <= 1610719836) {
    return 5;
  } else if (nonce >= 1610719837 && nonce <= 2147550925) {
    return 4;
  } else if (nonce >= 2147550926 && nonce <= 2684382014) {
    return 3;
  } else if (nonce >= 2684382015 && nonce <= 3221213103) {
    return 2;
  } else if (nonce >= 3221213104 && nonce <= 3758044192) {
    return 1;
  } else if (nonce >= 3758044193 && nonce <= 4294875281) {
    return 0;
  }
}

function calculateWaveColorIndex(fee) {
  if (fee >= 0 && fee <= 10817082) {
    return 7;
  } else if (fee > 10817083 && fee <= 21634164) {
    return 6;
  } else if (fee >= 21634164 && fee <= 32451246) {
    return 5;
  } else if (fee >= 32451247 && fee <= 43268328) {
    return 4;
  } else if (fee >= 43268329 && fee <= 54085410) {
    return 3;
  } else if (fee >= 54085411 && fee <= 64902492) {
    return 2;
  } else if (fee >= 64902493 && fee <= 75719574) {
    return 1;
  } else if (fee >= 75719574 && fee <= 86536657) {
    return 0;
  }
}

function calculateEchoCount(txs) {
  if (txs >= 0 && txs <= 400) {
    return 6;
  } else if (txs > 400 && txs <= 800) {
    return 5;
  } else if (txs >= 801 && txs <= 1500) {
    return 4;
  } else if (txs >= 1501 && txs <= 2000) {
    return 3;}
    else {
      have_echos = false
    return 0;}
  }


// Add event listener for the "Generate" button
document.getElementById("generateButton").addEventListener("click", function () {
  generating = true;
  // Scroll to the stats container
  document.getElementById('statsContainer').scrollIntoView({ behavior: 'smooth' });
});

// Add event listener for the "Save Image" button
document.getElementById("saveButton").addEventListener("click", saveImage);

function saveImage() {
  // Save canvas as PNG file
  saveCanvas(canvas, 'generated_image', 'png');
}