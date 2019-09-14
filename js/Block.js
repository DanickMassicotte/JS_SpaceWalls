class Block {
	constructor(startPos) {
		this.pos = startPos - blockSize;
		this.speed = 8;
		this.color = "gray";
		this.img = new Image();
		this.img.src = "images/asteroid_g.png"
	}

	tick() {
		if (this.img.complete) {
			this.pos += this.speed;
			ctx.drawImage(this.img, 0, this.pos);
			ctx.drawImage(this.img, canvas.width - blockSize, this.pos);
		}

		return this.pos < (canvas.height + blockSize + 5) ? true : false;
	}

	draw() {
		ctx.drawImage(this.img, 0, this.pos);
		ctx.drawImage(this.img, canvas.width - blockSize, this.pos);
	}
}