class Sprite {
	constructor() {
		this.width = 30;
		this.height = 32;
		this.posX = canvas.width / 2 - this.width / 2;
		this.posY = canvas.height - 100;
		this.speed = 5.5;
		this.img = new Image();
		this.img.src = "images/galaga_n.png";
	}

	tick() {
		if (this.img.complete) {
			if (leftPushed) {
				this.posX -= this.speed;

				if (this.posX <= blockSize) {
					this.posX = blockSize;
				}
			}

			else if (rightPushed) {
				this.posX += this.speed;

				if (this.posX >= canvas.width - blockSize - this.width) {
					this.posX = canvas.width - blockSize - this.width;
				}
			}

			else if (upPushed) {
				this.posY -= this.speed;

				if (this.posY <= 0) {
					this.posY = 0;
				}
			}

			else if (downPushed) {
				this.posY += this.speed;

				if (this.posY >= canvas.height - this.height) {
					this.posY = canvas.height - this.height;
				}
			}

			ctx.drawImage(this.img, this.posX, this.posY);

		}
	}

	draw() {
		ctx.drawImage(this.img, this.posX, this.posY);
	}

	fire() {
		const x = this.posX + (this.width / 2) - 2;
		const y = this.posY + (this.height / 2);

		return (new Laser(x, y));
	}

	alive() {
		for (let i = 0; i < obstacles.length; ++i) {
			const left = obstacles[i].posX;
			const right = obstacles[i].posX + blockSize;
			const top = obstacles[i].posY;
			const bottom = obstacles[i].posY + blockSize;

			const spriteRight = this.posX + this.width;
			const spriteBottom = this.posY + this.height;

			if ((this.posX - 2 > left && this.posX + 2 < right) ||
				(spriteRight - 2 > left && spriteRight + 2 < right)) {
				if ((this.posY - 2 > top && this.posY + 5 < bottom) ||
					(spriteBottom - 2 > top && spriteBottom + 2 < bottom)) {
					return false;
				}
			}
		}

		return true;
	}

	crash() {
		this.img.src = "images/galaga_d.png";
		ctx.drawImage(this.img, this.posX, this.posY);
	}
}