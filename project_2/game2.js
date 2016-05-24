//You should consider using setInterval for the specific use case of counting down a timer.

var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(500, 500, {backgroundColor: 0xffffff});
gameport.appendChild(renderer.view);

PIXI.loader
	.add("assets2.json")
	.load(ready);

var hasWon = false;		// set to true if win, stays false if time runs out
var isRunning = false;	// variable representing the game's state

/*PIXI.loader
	.add("assets2.json")
	.load(ready);
*/
// create the stage for the game
var stage = new PIXI.Container();




// THE TITLE SCREEN OF THE GAME or MAIN MENU
var titleScreen = new PIXI.Container();
var titleScreenSettings = {
	font: '24px georgia'
};
// title screen 'buttons' which are interactive text
var titleScreenStartButton = new PIXI.Text('Begin', titleScreenSettings);
var titleScreenCreditsButton = new PIXI.Text('Credits', titleScreenSettings);
var titleScreenInstructionsButton = new PIXI.Text('Instructions', titleScreenSettings);

var creditsScreen = new PIXI.Container();
var creditsScreenText = new PIXI.Text('Music: John Bassler\n\nArtwork: John Bassler\n\nProgramming: John Bassler\n\n')
var creditsScreenSettings = {
	font: '18px georgia';
}
creditsScreen.addChild(creditsScreenText);

//		INSTRUCTIONS SCREEN CONTAINER
var instructionScreen = new PIXI.Container();
var instructionScreenSettings = {
	font: '12px georgia';
}
var instructionScreenText = new PIXI.Text('Having just tickled all the aliens, you are now stranded on Mars!\n
	You must find fuel for bubble-powered ship.\nYour ship must receive the fuel in the correct order, or you must start over.\n
	And hurry!  Your oxygen level will be dropping, so find the correct order before time runs out!', instructionScreenSettings);
instructionScreen.addChild(instructionScreenText);
//global variables to set as I move the character
var maxBubbles = 6;
var currentBubbles = 6;
var timerCount = 1;				// tells total time
var timer = new PIXI.Text(timerCount);
timer.position.x = 450;
timer.position.y = 10;
stage.addChild(timer);
var time = 1;					// tells time

var right, left, up, down;		// boolean variables to determine the direction the player is going

// create player, bubble array holding the 6 bubbles, the spaceship, and the bubble Icon
var player = new PIXI.Sprite(PIXI.Texture.fromImage("astronaut.png"));
var bubbles = [];			// array holding the six bubbles
var spaceship = new PIXI.Sprite(PIXI.Texture.fromImage("spaceship.png"));
//var bubbleIcon = new PIXI.Sprite(PIXI.Texture.fromImage("bubbletemplate.png"));

// place spaceship, bubbles, and player
var gameScreen = new PIXI.Container();
var gameScreenSettings = {
	font: '18px georgia';
}
spaceship.position.x = 10;
spaceship.position.y = 400;
spaceship.scale.x = 3;
spaceship.scale.y = 3;
player.scale.x = 2;
player.scale.y = 2;

gameScreen.addChild(player);
gameScreen.addChild(spaceship);

for(var i = 0; i < maxBubbles; i++) {
	var bubbles[i] = new PIXI.Sprite(PIXI.Texture.fromImage("bubble"+i+".png"));
	stage.addChild(bubbles[i]);
}

/*loader
	.add("images/sheet.json")
	//.on("progress", loadProgressHandler)
	.load(setup);
	*/

function constructor() {
	count = 1;
	timer.text = count;
	time = 1;

	player.position.x = 100;
	player.position.y = 422;
	isRunning = true;
	var titleScreenBackground = new PIXI.Sprite(new Pixi.Texture.fromImage("background1.png"));  //***MAKE BACKGROUNG IMAGE***
    titleScreenStartButton.position.x = 20;
	titleScreenStartButton.position.y = 20;
    titleScreenInstructionsButton.position.set(30, 60);
    titleScreenCreditsButton.position.set(20, 120);
    // set 'buttons' to be interactive
    titleScreenPlayButton.interactive = true;
    titleScreenCreditsButton.interactive = true;
    titleScreenInstructionsButton.interactive = true;
    // add the children to the title screen
    titleScreen.addChild(titleScreenPlayButton);
    titleScreen.addChild(titleScreenInstructionsButton);
    titleScreen.addChild(titleScreenCreditsButton);
    // click on the buttons
    titleScreenPlayButton.on('click', titleScreenMenuHandler);
    titleScreenInstructionsButton.on('click', titleScreenMenuHandler);
    titleScreenCreditsButton.on('click', titleScreenMenuHandler);
    // add background last so it doesn't overlap other sprites
    titleScreen.addChild(titleScreenBackground);
    stage.addChild(titleScreen);
}

function setupBubbles() {
for (var i = 0; i < maxBubbles; i++) {
	var bubble = new Sprite(id["bubble.png"]);
	bubble.position.x = Math.floor(Math.random() * (350)+15);
	bubble.position.y = Math.floor(Math.random() * (385)+15);
	bubbles.push(bubble);			// push the bubbles into the array, add the bubble to the gameScreen
	gameScreen.addChild(bubble);
	}
}

// checks if we are removing the bubbles in the right order
// if any bubble is selected out of order, the bubbles must be reset/reshuffled
function rightBubble(bubble) {
	if(currentBubbles == 6 && bubble == bubble1) {
		removeBubble();
	}
	else if (currentBubbles == 5 && bubble == bubble2) {
		removeBubble();
	}
	else if (currentBubbles == 4 && bubble == bubble3) {
		removeBubble();
	}
	else if (currentBubbles == 3 && bubble == bubble4) {
		removeBubble();
	}
	else if (currentBubbles == 2 && bubble == bubble5) {
		removeBubble();
	}
	else if (currentBubbles == 1 && bubble == bubble6) {
		removeBubble();
	}
	else {
		player.position.x = 100;		// reset the main character's position
		player.position.y = 422;
		var x = maxBubbles - currentBubbles;
		for (int i = 1; i <= 6; i++) {	// shuffle positions of all the bubbles, even if previously selected
			bubbles[i].position.x = Math.floor(Math.random() * (350)+15);
			bubbles[i].position.y = Math.floor(Math.random() * (385)+15);
			bubbles[i].visible = true;
		}
	}
}

// tween the bubble to the bubble icon, then remove from the stage
function removeBubble(b) {
	if (Collision1(player,b)) {
		moveBubble();
		currentBubbles--;
		b.visible = false;
	}
}

// functions for movement as well as restarting the game
function keydownEventHandler(k) {
	if (key.keyCode == 87) {	// w key
		up = true;
	}
	else if (key.keyCode == 65) {   // a key
		left = true;
	}
	else if (key.keyCode == 83) {	// s key
		down = true;
	}
	else if (key.keyCode == 68) {	// d key
		right = true;
	}
	else if (key.keyCode == 13 && !isRunning) {   // enter key
		constructor();		// restart the game 
	}
}

function keyupEventHandler(k) {
	if (key.keyCode == 87) {   // w key
		up = false;
	}
	else if (key.keyCode == 65) {   // a key
		left = false;
	}
	else if (key.keyCode == 83) {   // s key
		down = false;
	}
	else if (key.keyCode == 68) {   // d key
		right = false;
	}	
}

// the handlers for keyup and keydown events
document.addEventListener('keydown', keydownEventHandler);
document.addEventListener('keyup'), keyupEventHandler);

function Collision1(a, b) {
	return !(b.x > (a.x + a.width) || 
           (b.x + b.width) < a.x || 
           b.y > (a.y + a.height) ||
           (b.y + b.height) < a.y);

function walk() {
	if (player.renderable){			//moving left (animated), display the 
		player.renderable = false;
		player2.renderable = true;
		player3.renderable = false;
	} 
	else if (player2.renderable){ 		//moving right (animated)
		player.renderable = true;
		player2.renderable = false;
		player3.renderable = false;
	}
	else {								//standing still (no animation)
		player.renderable = false;
		player2.renderable = false;
		player3.renderable = true;
	}
}

function buildGame() {
	setupBubbles();
	// The background image
	var MMBackground = new PIXI.Sprite(new Pixi.Texture.fromImage("background1.png"));  //***MAKE BACKGROUNG IMAGE***
	stage.addChild(MMBackground);
	var characters = new PIXI.Container();
}

function displayInstructions() {
	isRunning = false;
}

function moveBubble(a) {
	createjs.Tween.get(a.position).to({x: 450, y: 450}, 500);
}

function gameplay() {
	if (isRunning) {
		if(!start) {
			start = new Date().getTime();
		}
		processInput();
		checkGameOver();
		checkClock();
	}
}

function checkClock() {
	if (new Date().getTime() - time >= 1000){		// start at 1 second
		timer.text = count;
		time = new Date().getTime();
		timerCount++; 								// increment counter
	}
}

function playerMovement() {
	if (left && sprite.position.x > 15) {
			sprite.position.x -= 4;
	}

	if (right && sprite.position.x < 500-64) {
		sprite.position.x += 4;
	}

	if (up && sprite.position.y > 15) {
		sprite.position.y -= 4;
	}

	if (down && sprite.position.y < 500 - 64) {
		sprite.position.y += 4;
	}
}


function checkGameOver() {
	if(currentBubbles == 0 && time > 30) {		// GAME OVER, YOU WON!!!
		hasWon = true;
		isRunning = false;
		gameOverScreen.visible = true;
	}
	else if (currentBubbles != 0 && time == 30) {		// GAME OVER, YOU LOST!!!
		hasWon = false;
		isRunning = false;
		gameOverScreen.visible = true;
		return true;
	}
}


function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
  }
}

function update() {		// the event loop that watches the gameplay
	setInterval(gameplay,25);
}
animate();
update();