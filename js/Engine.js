// NAME: Space Walls
// VERSION: 1.0
// BY: Danick Massicotte
// DATE: 2019-02-12
// NOTES: Have fun. :D

// GLOBAL VARIABLES
let transition = 0;

const blockSize = 40;
let blockList;
let obstacles;
let BLOCK_RAND;

let laserList;
let sprite = null;
let shipCrash = null;

let bgList;
const BG_MAX = 2;

let ctx = null;
let canvas = null;
let bgm = new Audio("audio/BWings_StageTheme.mp3");				// Stage Music from NES game B-Wings;
let laserSFX = new Audio("audio/Galaga_LaserSFX.mp3")			// Laser SFX from NES Galaga
let crashSFX = new Audio("audio/RoadWarrior_CrashSFX.mp3");		// Crash SFX from NES Road Warrior
let gameOverBGM = new Audio("audio/DonkeyKong_GameOver.mp3");	// Game Over BGM from NES Donkey Kong

let rightPushed = false;
let leftPushed = false;
let upPushed = false;
let downPushed = false;
let enterPushed = false;
let spacePushed = false;
let rPushed = false;

let score;
let wallPassed = false;
let recharge = false;
let lasersShot;
let titleTicks;
let gameTicks;
let readyTicks;
let gameOverTicks;
let blockades;
let difficulty;

// PLAYER INPUTS
document.onkeydown = (e) => {
	if (e.which == 65) { leftPushed = true; }
	else if (e.which == 68) { rightPushed = true; }
	else if (e.which == 87) { upPushed = true; }
	else if (e.which == 83) { downPushed = true; }
	else if (e.which == 13) { enterPushed = true; }
	else if (e.which == 32) { spacePushed = true; }
	else if (e.which == 82) { rPushed = true; }
}

document.onkeyup = (e) => {
	if (e.which == 65) { leftPushed = false; }
	else if (e.which == 68) { rightPushed = false; }
	else if (e.which == 87) { upPushed = false; }
	else if (e.which == 83) { downPushed = false; }
	else if (e.which == 13) { enterPushed = false; }
	else if (e.which == 32) { spacePushed = false; }
	else if (e.which == 82) { rPushed = false; }
}

// RUN PROGRAM
window.onload = () => {
	canvas = document.querySelector("#canvas");
	ctx = canvas.getContext("2d");

	tick();
}

// ENGINE
tick = () => {
	switch(transition) {
		case 0:	init();
			break;
		case 1: title();
			break;
		case 2:	ready();
			break;
		case 3: inGame();
			break;
		case 4: gameOver();
			break;
	}

	window.requestAnimationFrame(tick);
}

// INITIALIZE OBJECTS AND VARIABLES STATE
init = () => {
	// INIT VARIABLES
	bgList = [];
	laserList = [];
	blockList = [];
	obstacles = [];
	score = 0;
	titleTicks = 0;
	gameTicks = 0;
	readyTicks = 0;
	gameOverTicks = 0;
	difficulty = 0;
	blockades = 0;
	BLOCK_RAND = 0.4;
	lasersShot = 0;
	recharge = false;

	// INIT BACKGROUND
	for (let i = 0; i < BG_MAX; ++i) {
		bgList.push(new Background(i * -canvas.height));
	}

	background = new Background();
	background.tick();

	// INIT SPRITE
	sprite = new Sprite();

	// INIT WALLS
	for (let i = 0; i < 175; i++) {
		blockList.push(new Block(i * blockSize));
	}

	// INIT CRASH ANIMATION
	shipCrash = new TiledImage("images/crash_sheet2.png", 4, 1, 100, true, 1.0, null);
	shipCrash.changeRow(0);
	shipCrash.changeMinMaxInterval(0, 3);
	shipCrash.setLooped(true);

	transition++;
}

// TITLE STATE
title = () => {
	titleTicks++;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	bgList[0].draw();

	const titleTxt = "SPACE WALLS";		// #Originality
	const enterTxt = "PRESS ENTER TO START";
	const asdwTxt = "A, S, D, W TO MOVE SPACESHIP";
	const spaceTxt = "SPACEBAR TO FIRE LASERS";
	const rechargeTxt = "R TO RECHARGE LASERS";

	ctx.font = "42px PixelEmulator";
	ctx.fillStyle = "darkorange";
	ctx.shadowColor = "white";

	if (titleTicks % 30 < 15) {
		ctx.shadowBlur = 8;
	}

	else {
		ctx.shadowBlur = 6;
	}

	const titlePos = (canvas.width / 2) - (ctx.measureText(titleTxt).width / 2);
	ctx.fillText(titleTxt, titlePos, (canvas.height / 4));

	ctx.beginPath();
	ctx.lineWidth = 5;
	ctx.strokeStyle = "white";
	ctx.rect(25, (canvas.height / 4) - 90, canvas.width - 50, canvas.height / 4 - 10);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 7;
	ctx.strokeStyle = "orange";
	ctx.rect(20, (canvas.height / 4) - 95, canvas.width - 40, canvas.height / 4);
	ctx.stroke();

	ctx.font = "16px PixelEmulator";
	ctx.fillStyle = "white";
	ctx.shadowBlur = 0;

	const enterPos = (canvas.width / 2) - (ctx.measureText(enterTxt).width / 2);
	const asdwPos = (canvas.width / 2) - (ctx.measureText(asdwTxt).width / 2);
	const spacePos = (canvas.width / 2) - (ctx.measureText(spaceTxt).width / 2);
	const rechargePos = (canvas.width / 2) - (ctx.measureText(rechargeTxt).width / 2);
	ctx.fillText(enterTxt, enterPos, (canvas.height / 10) * 5.5);
	ctx.fillText(asdwTxt, asdwPos, (canvas.height / 10) * 7.5);
	ctx.fillText(spaceTxt, spacePos, (canvas.height / 10) * 8);
	ctx.fillText(rechargeTxt, rechargePos, (canvas.height / 10) * 8.5);


	if (enterPushed && titleTicks > 30) {
		transition++;
	}
}

// READY STATE
ready = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	readyTicks++;

	for (let i = 0; i < bgList.length; ++i) {
		bgList[i].draw();
	}

	for (let i = 0; i < blockList.length; ++i) {
		blockList[i].draw();
	}

	// READY "TIMER"
	if (readyTicks < 90) {
		// FLASH [ READY ]
		let readyTxt = "[ READY ]";
		const readyPos = (canvas.width / 2) - (ctx.measureText(readyTxt).width / 2);

		if (readyTicks % 10 < 7) {
			ctx.fillStyle = "white";
		}

		else {
			ctx.fillStyle = "black";
		}

		ctx.fillText(readyTxt, readyPos, canvas.height / 2);
	}

	else {
		transition++;
	}
}

// IN-GAME STATE
inGame = () => {
	gameTicks++;

	// GAME LOOP
	if (sprite.alive()) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// STAGE MUSIC
		bgm.play();

		// DRAW BACKGROUND
		for (let i = 0; i < bgList.length; ++i) {
			const onscreen = bgList[i].tick();

			if (!onscreen) {
				bgList.splice(i, 1);
				i--;
				bgList.push(new Background(-canvas.height));
			}
		}

		// FIRE LASERS + RECHARGE
		if (lasersShot < 100 && !recharge) {
			if (spacePushed && laserList.length < 12) {
				laserList.push(sprite.fire());
				laserSFX.play();
				lasersShot++;
			}
		}

		else {
			recharge = true;

			if (lasersShot > 0) {
				if (gameTicks % 2 == 0) {
					lasersShot--;
				}
			}

			else {
				recharge = false;
			}
		}

		if (laserList.length > 0) {
			for (let i = 0; i < laserList.length; ++i) {
				const onscreen = laserList[i].tick();

				if (!onscreen) {
					laserList.splice(i, 1);
					i--;
				}
			}
		}

		if (rPushed) {
			recharge = true;
		}

		// DRAW SPRITE
		sprite.tick();

		// CREATE AND DRAW WALLS
		for (let i = 0; i < blockList.length; ++i) {
			const onscreen = blockList[i].tick();

			if (!onscreen) {
				blockList.splice(i, 1);
				i--;
				blockList.push(new Block(0));
			}
		}

		// CREATE AND DRAW OBSTACLES
		let blockSpaces = 0;

		if (difficulty < 3) {
			blockSpaces = difficulty + 6;
		}

		else {
			blockSpaces = 9;
		}

		if (gameTicks > 180 && obstacles.length == 0) {
			// INIT OBSTACLES
			for (let i = 0; i < 10; ++i) {
				if (Math.random() > BLOCK_RAND) {
					// Failsafe vs. full obstacles
					if (obstacles.length != 6) {
						obstacles.push(new Obstacle(i * blockSize));
					}
				}
			}
		}

		for (let i = 0; i < obstacles.length; ++i) {
			const onscreen = obstacles[i].tick();

			if (!onscreen) {
				obstacles.splice(0, obstacles.length)

				for (let i = 0; i < 10; ++i) {
					if (Math.random() > BLOCK_RAND) {
						// Failsafe vs. full obstacles
						if (obstacles.length != blockSpaces) {
							obstacles.push(new Obstacle(i * blockSize));
							wallPassed = true;
						}
					}
				}
			}
		}

		// CALCULATE SCORE + SPEED UP
		if (wallPassed) {
			score += 150;
			wallPassed = false;
			blockades++;
		}

		if (gameTicks % 10 == 0) {
			score += 10;
		}

		// DIFFICULTY UP
		const curDifficulty = (2 * difficulty) + 3;

		if (blockades == curDifficulty) {
			if (BLOCK_RAND > 0.15) {
				BLOCK_RAND -= 0.1;
				difficulty++;
			}

			blockades = 0;
			console.log("difficulty up")
		}

		// SCORE TEXT + RECHARGE
		let scoreText = "SCORE - " + score;
		ctx.fillStyle = "white";
		ctx.fillText(scoreText, blockSize + 10, 20);

		let rechTxt = "LASERS - " + lasersShot + "%";
		let rechPos = canvas.width - blockSize - ctx.measureText(rechTxt).width - 10;

		if (recharge) {
			if (gameTicks % 10 < 5) {
				ctx.fillStyle = "red";
			}

			else {
				ctx.fillStyle = "white";
			}
		}

		ctx.fillText(rechTxt, rechPos, 20);
	}

	else {
		transition++;
	}
}

// GAME OVER STATE
gameOver = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	gameOverTicks++;

	for (let i = 0; i < bgList.length; ++i) {
		bgList[i].draw();
	}

	for (let i = 0; i < obstacles.length; ++i) {
		obstacles[i].draw();
	}

	for (let i = 0; i < blockList.length; ++i) {
		blockList[i].draw();
	}

	// SCORE TEXT
	let scoreText = "SCORE - " + score;
	ctx.fillStyle = "white";
	ctx.fillText(scoreText, blockSize + 10, 20);

	bgm.pause();
	bgm.currentTime = 0;
	sprite.crash();

	if (gameOverTicks < 100) {
		crashSFX.play();
		shipCrash.tick(sprite.posX + 15, sprite.posY + 40, ctx);
	}

	else if (gameOverTicks > 120) {
		// GAME OVER SCREEN
		if (gameOverTicks < 240) {
			gameOverBGM.play();
		}

		const gameOver = "GAME OVER";
		const goLength = ctx.measureText(gameOver).width / 2;
		const playAgain = "PRESS ENTER TO CONTINUE";
		const paLength = ctx.measureText(playAgain).width / 2;
		ctx.fillText(gameOver, canvas.width / 2 - goLength, (canvas.height / 3));
		ctx.fillText(playAgain, canvas.width / 2 - paLength, (canvas.height / 3) + 20);

		if (enterPushed) {
			transition = 0;
		}
	}
}
