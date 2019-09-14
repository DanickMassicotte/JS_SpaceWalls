class Obstacle {
	constructor(startPos) {
		this.posX = startPos + blockSize;
		this.posY = 0 - blockSize;
		this.speed = 8;
		this.hp = 5;
		this.img = new Image();
		this.img.src = "images/asteroid_b.png";
	}

	tick() {
		if (this.img.complete) {
			this.posY += this.speed;
			ctx.drawImage(this.img, this.posX, this.posY)
		}

		return this.posY < (canvas.height + blockSize + 5) ? true : false;
	}

	draw() {
		ctx.drawImage(this.img, this.posX, this.posY);
	}
}