const inputSlider = document.getElementById('resolution');
const inputLabel = document.getElementById('resolutionLabel');
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const image1 = new Image();
image1.src = 'img/emilyJane.png';
inputSlider.addEventListener('change', handleSlider);

class Cell {
	constructor(x, y, symbol, color, size) {
		this.x = x;
		this.y = y;
		this.symbol = symbol;
		this.color = color;
		this.size = size;
	}
	draw(ctx) {
		ctx.font = `${this.size}px 'Courier New'`;
		ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
		ctx.fillText(this.symbol, this.x + 1, this.y + 1);

		ctx.fillStyle = this.color;
		ctx.fillText(this.symbol, this.x, this.y);
	}
}
class AsciiEffect {
	#imageCellArray = [];
	#pixels = [];
	#ctx;
	#width;
	#height;
	constructor(ctx, width, height) {
		this.#ctx = ctx;
		this.#width = width;
		this.#height = height;
		this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
		this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
		console.log(this.#pixels.data);
	}
	#convertToSymbol(g) {
		if (g > 255) return '$';
		else if (g > 250) return '@';
		else if (g > 245) return 'B';
		else if (g > 240) return '%';
		else if (g > 235) return '8';
		else if (g > 230) return '&';
		else if (g > 225) return 'W';
		else if (g > 220) return 'M';
		else if (g > 200) return '#';
		else if (g > 180) return '*';
		else if (g > 160) return 'o';
		else if (g > 140) return 'a';
		else if (g > 120) return 'h';
		else if (g > 100) return 'k';
		else if (g > 80) return 'b';
		else if (g > 60) return 'd';
		else if (g > 40) return 'p';
		else if (g > 20) return 'q';
		else return '';
	}
	#scanImage(cellSize) {
		this.#imageCellArray = [];
		for (let y = 0; y < this.#pixels.height; y += cellSize) {
			for (let x = 0; x < this.#pixels.width; x += cellSize / 1.5) {
				const posX = x * 4;
				const posY = y * 4;
				const pos = (y * this.#pixels.width + x) * 4;

				if (this.#pixels.data[pos + 3] > 128) {
					const red = this.#pixels.data[pos];
					const green = this.#pixels.data[pos + 1];
					const blue = this.#pixels.data[pos + 2];
					const total = red + green + blue;
					const averageColorValue = total / 3;
					const color = `rgb(${red}, ${green}, ${blue})`;
					const symbol = this.#convertToSymbol(averageColorValue);
					if (symbol)
						this.#imageCellArray.push(new Cell(x, y, symbol, color, cellSize));
				}
			}
		}
		console.log(this.#imageCellArray);
	}
	#drawAscii() {
		this.#ctx.clearRect(0, 0, this.#width, this.#height);
		for (let i = 0; i < this.#imageCellArray.length; i++) {
			this.#imageCellArray[i].draw(this.#ctx);
		}
	}
	draw(cellSize) {
		this.#scanImage(cellSize);
		this.#drawAscii();
	}
}
let effect;
function handleSlider() {
	console.log('Slider value: ', inputSlider.value);
	if (inputSlider.value == 1) {
		inputLabel.innerHTML = 'Original Image';
		ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
	} else {
		inputLabel.innerHTML = 'Resolution: ' + inputSlider.value + ' px';
		ctx.font = parseInt(inputSlider.value) + 'px Courier New';
		effect.draw(parseInt(inputSlider.value));
	}
}
image1.onload = function initialize() {
	console.log('Image loaded: ', image1.src);
	console.log('Image dimiensions: ', image1.width, image1.height);

	canvas.width = image1.width;
	canvas.height = image1.height;
	ctx.drawImage(image1, 0, 0);

	const base64Image = canvas.toDataURL('img/emilyJane.png');
	console.log('Base64 image:', base64Image);

	effect = new AsciiEffect(ctx, image1.width, image1.height);
	//effect.draw(parseInt(inputSlider.value));
	handleSlider();
};
