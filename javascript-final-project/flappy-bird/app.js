// Created a game variable of a new instance of Phaser.Game to set up the game
let config = { 
  renderer: Phaser.AUTO, // Automatically select the renderer based on device (WebGL or Canvas)
  width: 800, // Set the game width to 800 pixels
  height: 600, // Set the game height to 600 pixels
  physics: {  // Define the physics engine to use
    default: 'arcade', // Use arcade physics for simple gravity and collision
    arcade: {
      gravity: { y: 300 }, // Apply downward gravity to all dynamic objects
      debug: false // Disable debug mode for cleaner visuals
    }
  },
  scene: {  // Define the scene functions
    preload: preload, // Load game assets
    create: create,   // Initialize game objects
    update: update    // Continuously update game objects
  }
};

let game = new Phaser.Game(config); // Instantiate the game with the configuration settings


let bird; // Declare the bird sprite
let hasLanded = false; // Boolean to track if the bird has landed on the ground
let cursors; // Declare the cursor input for controlling the bird
let hasBumped = false; // Boolean to track if the bird has hit a column
let isGameStarted = false; // Boolean to check if the game has started
let messageToPlayer; // Text object to display instructions or game status messages


// A function that brings in images and assets for the game
function preload() {
  this.load.image('background', 'assets/background.png'); // Load the background image
  this.load.image('road', 'assets/road.png'); // Load the road image
  this.load.image('column', 'assets/column.png'); // Load the column image
  this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 }); // Load bird spritesheet with frame size
}

// A function that sets up the game scene, including objects, text, and physics
function create() {
  // Create and position the background at the top-left corner
  const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
  
  // Create static groups for the road and columns (which don't move)
  const roads = this.physics.add.staticGroup(); // Static group for the road

  // Add top columns as obstacles, setting their initial position and spacing
  const topColumns = this.physics.add.staticGroup({
      key: 'column',
      repeat: 1, // Repeat column group once
      setXY: { x: 200, y: 0, stepX: 300 } // Set position of the top columns
  });

  // Add bottom columns near the road as obstacles
  const bottomColumns = this.physics.add.staticGroup({
      key: 'column',
      repeat: 1, // Repeat column group once
      setXY: { x: 350, y: 400, stepX: 300 } // Set position of the bottom columns
  });

  // Create and position the road
  const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

  // Create the bird sprite, set its scale, and apply physics properties like bounce and collision boundaries
  bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
  bird.setBounce(0.2); // Make the bird bounce slightly on impact
  bird.setCollideWorldBounds(true); // Prevent the bird from going outside the game world

  // Add collision detection between the bird and the road
  this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
  this.physics.add.collider(bird, road); // Apply collision between bird and road
  
  // Add collision detection between bird and columns (top and bottom)
  this.physics.add.overlap(bird, topColumns, () => hasBumped = true, null, this); // Detect collision with top columns
  this.physics.add.overlap(bird, bottomColumns, () => hasBumped = true, null, this); // Detect collision with bottom columns
  this.physics.add.collider(bird, topColumns); // Apply physics-based collision with top columns
  this.physics.add.collider(bird, bottomColumns); // Apply physics-based collision with bottom columns

  // Initialize cursors to allow control of the bird using arrow keys
  cursors = this.input.keyboard.createCursorKeys();

  // Display the instructions text for starting the game
  messageToPlayer = this.add.text(0, 0, `Instructions: Press space bar to start`, { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" });
  Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50); // Align the instruction message at the bottom center
}

// A function that will be used to continuously update the game state
function update() {
  // Start the game when the spacebar is pressed for the first time
  if (cursors.space.isDown && !isGameStarted) {
    isGameStarted = true; // Set the game to started
    messageToPlayer.text = 'Instructions: Press the "^" button to stay upright\nAnd don\'t hit the columns or ground'; // Update instructions
  }

  // Prevent the bird from moving unless the game has started
  if (!isGameStarted) {
    bird.setVelocityY(-160); // Move the bird upwards before the game starts
    return; // Exit the update function until the game starts
  }

  // Move the bird upwards when the up arrow is pressed
  if (cursors.up.isDown && !hasLanded && !hasBumped) {
    bird.setVelocityY(-160); // Apply upward force to the bird
  }

  // Continuously move the bird forward if it hasn't landed or hit a column
  if (isGameStarted && (!hasLanded || !hasBumped)) {
    bird.body.velocity.x = 50; // Move the bird to the right
  } else {
    bird.body.velocity.x = 0; // Stop bird movement if it lands or bumps into a column
  }

  // Display a crash message if the bird lands or bumps into a column
  if (hasLanded || hasBumped) {
    messageToPlayer.text = 'Oh no! You crashed!'; // Display crash message
  }

  // If the bird reaches the far right of the screen, display a win message
  if (bird.x > 750) {
    bird.setVelocityY(40); // Apply slight downward velocity as the bird reaches the end
    messageToPlayer.text = 'Congratulations! You won!'; // Display win message
  }
}
