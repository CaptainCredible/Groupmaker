//test

let inputNames;
// peter, emma, stephen, mary, dinner, bone
let inputGroupSize;
let names = [];
let groups = [];
let button;
let groupSize;
let shuffledNames = [];
let topOffset = 120;
let startY = 130;
function preload() {
  // Load a custom font before the sketch starts
  myFont = loadFont('Quicksand.ttf');
}

function positionCanvas(x, y) {
  let centerScreenX = (windowWidth - width) / 2;
  let centerScreenY = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(600, 600); // Start with a canvas height of 600px
  cnv.style('background-color', 'transparent'); // Make the canvas transparent

  // Input for names
  inputNames = createInput();
  inputNames.position(20, 70 + topOffset);
  inputNames.size(300);
  inputNames.attribute('placeholder', 'Enter comma-separated names');

  // Input for group size, defaulting to 2
  inputGroupSize = createInput('2');
  inputGroupSize.position(400, 70 + topOffset);
  inputGroupSize.size(50);
  inputGroupSize.attribute('placeholder', 'Group Size');

  // Button to generate groups
  button = createButton('Generate Groups');
  button.position(460, 70 + topOffset);
  button.mousePressed(generateGroups);

  textSize(16);
  textAlign(LEFT);
  textFont(myFont);
  textStyle(BOLD);
  positionCanvas(windowWidth / 2 - width / 2, 50);
  repositionButtons();
}

function repositionButtons() {
  inputNames.position(cnv.x + 20, cnv.y + topOffset);
  inputGroupSize.position(cnv.x + 400, cnv.y + topOffset);
  button.position(cnv.x + width - 140, cnv.y + topOffset);
}

function windowResized() {
  positionCanvas(windowWidth / 2 - width / 2, 50);
  repositionButtons();
}

function drawTitle(){
  fill(255);
  strokeWeight(2);
  rect(10, 25, width - 20, 125, 30, 30, 10, 10);
  push();
  fill(0);
  textSize(40);
  text('Groupmaker PRO MAX', width/2-270, 75);
  pop();
  push();
  fill(0);
  textSize(12);
  text('Names:', 20, topOffset - 3);
  text('Group Size:', 400, topOffset - 3);
  pop();
}

function draw() {
  clear(); // Clear the canvas and maintain transparency

  // Set up drop shadow for all text and shapes
  drawingContext.shadowOffsetX = 4;
  drawingContext.shadowOffsetY = 4;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';

  fill(255);
  strokeWeight(2);
  rect(10, 25, width - 20, 125, 30, 30, 10, 10);

  // Draw some explanatory text and visuals
  fill(0);
  

  // Display generated groups
  
  push();
  for (let i = groups.length-1; i >= 0; i--) {
    
    let easedProgress = animProgress * animProgress * (3 - 2 * animProgress);
    //console.log("animProgress = " + animProgress)
    //console.log("Eased = " + easedProgress)
    currentStartY = startY + 45*easedProgress 
    let currentY = currentStartY + i* (40 * easedProgress);
    fill(255);
    rect(20, currentY - 15, width - 40, 30, 5); // Rectangle with shadow
    fill(0);
    textAlign(LEFT);
    text(`Group ${i + 1}: `, 30, currentY + 5); // Group text with shadow
    textAlign(RIGHT);
    text(` ${groups[i].join(", ")}`, width - 30, currentY + 5); // Names text with shadow
    if (animProgress < 1){
      animProgress+=0.002;
    }
  }
  pop();
  drawTitle();

  
}
let endYTarget = 300;
let endY = 200;
let animProgress = 0;

function generateGroups() {
  animProgress = 0;
  let nameStr = inputNames.value();
  groupSize = int(inputGroupSize.value());
  // Split names by comma and remove extra spaces
  names = nameStr.split(',').map(name => name.trim());

  if (names.length === 0 || groupSize <= 0) {
    alert('Please enter valid names and group size.');
    return;
  }

  if (groupSize > names.length) {
    alert('Group size cannot be larger than the number of names.');
    return;
  }

  shuffledNames = shuffle(names);
  groups = [];

  // Generate groups
  for (let i = 0; i < shuffledNames.length; i += groupSize) {
    groups.push(shuffledNames.slice(i, i + groupSize));
  }

  // Check if there's a group with fewer members, and distribute the remaining members
  let lastGroup = groups[groups.length - 1];
  if (lastGroup.length < groupSize && groups.length > 1) {
    let remainingMembers = lastGroup;
    groups.pop(); // Remove the last group
    for (let i = 0; i < remainingMembers.length; i++) {
      groups[i % groups.length].push(remainingMembers[i]);
    }
  }
  endY = startY + groups.length * 40;
  // Resize the canvas based on the number of groups
  let requiredHeight = 200 + groups.length * 40;
  if (requiredHeight > 600) {
    resizeCanvas(600, requiredHeight); // Increase canvas height if necessary
  } else {
    resizeCanvas(600, 600); // Reset to default height if not many groups
  }
}