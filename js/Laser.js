class Laser {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.speed = 30;
		this.width = 3;
		this.img = new Image();
		this.img.src = "images/laser.png";
	}

	tick() {
		let onscreen = true;

		if (this.img.complete) {
			this.y -= this.speed;
			ctx.drawImage(this.img, this.x, this.y);
		}

		if (this.y < 0) {
			onscreen = false;
		}

		for (let i = 0; i < obstacles.length; ++i) {
			if (this.x > obstacles[i].posX && this.x < obstacles[i].posX + blockSize) {
				if (this.y <= obstacles[i].posY) {
					obstacles[i].hp--;

					if (obstacles[i].hp == 0) {
						obstacles.splice(i, 1);
					}

					onscreen = false;
				}
			}
		}

		return onscreen;
	}
}