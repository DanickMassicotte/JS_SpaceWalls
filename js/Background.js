class Background {
	constructor(y) {
		this.y = y;
		this.speed = 3;
		this.img = new Image();
		this.img.src = "images/space_bg.png";
	}

	tick() {
		if (this.img.complete) {
			this.y += this.speed;
			ctx.drawImage(this.img, 0, this.y);
		}

		return this.y < (canvas.height) ? true : false;
	}

	draw() {
		ctx.drawImage(this.img, 0, this.y);
	}
}