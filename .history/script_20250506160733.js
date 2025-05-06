const inputSlider = document.getElementById('resolution');
const inputLabel = document.getElementById('resolutionLabel');
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const image1 = new Image();
image1.src = 'img/roseomalleyheadshotblack.png';
inputSlider.addEventListener('change', handleSlider);

const imageUpload = document.getElementById('imageUpload');

imageUpload.addEventListener('change', function (event) {
	const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = function (e) {
		image1.src = e.target.result; // This re-triggers image1.onload
	};
	reader.readAsDataURL(file);
});

class Cell {
	constructor(x, y, symbol, color, size) {
		this.x = x;
		this.y = y;
		this.symbol = symbol;
		this.color = color;
		this.size = size;
		//this.padding = this.size * 0.2;
	}
	draw(ctx) {
		ctx.font = `${this.size * 2}px Courier New`;
		//ctx.fillStyle = 'yellow';
		ctx.fillText(this.symbol, this.x + 1, this.y + 1, +this.size);

		ctx.fillStyle = this.color;
		ctx.fillText(this.symbol, this.x, this.y, this.size);
		ctx.textBaseline = 'top';
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
		//console.log(this.#pixels.data);
	}
	#convertToSymbol(g) {
		// @#W$9876543210?!abc;:+=-,._
		// .,:ilwW"
		// '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`'
		//`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$

		const asciiGradient =
			' .`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

		const index = Math.floor((g / 255) * (asciiGradient.length - 1));
		return asciiGradient[index];
	}

	#scanImage(cellSize) {
		this.#imageCellArray = [];
		const stepX = Math.floor(cellSize * 0.6);
		const stepY = cellSize;
		for (let y = 0; y < this.#pixels.height; y += stepY) {
			for (let x = 0; x < this.#pixels.width; x += stepX) {
				if (x >= this.#pixels.width || y >= this.#pixels.height) continue;
				const posX = x * 4;
				const posY = y * 4;
				const pos = (y * this.#pixels.width + x) * 4;

				if (this.#pixels.data[pos + 3] > 128) {
					const red = this.#pixels.data[pos];
					const green = this.#pixels.data[pos + 1];
					const blue = this.#pixels.data[pos + 2];
					const grayscale = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

					//const color = 'yellow';
					//const color = grayscale > 110 ? 'white' : 'black';
					const total = red + green + blue;
					const averageColorValue = total / 3;
					const color = `rgb(${red}, ${green}, ${blue})`;
					const symbol = this.#convertToSymbol(averageColorValue);
					if (symbol)
						this.#imageCellArray.push(new Cell(x, y, symbol, color, cellSize));
				}
			}
		}
		//console.log(this.#imageCellArray);
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
	//console.log('Slider value: ', inputSlider.value);
	if (inputSlider.value == 1) {
		inputLabel.innerHTML = 'Original Image';
		ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
	} else {
		inputLabel.innerHTML = 'Resolution: ' + inputSlider.value + ' px';
		ctx.font = parseInt(inputSlider.value) * 2 + 'px Courier New';
		effect.draw(parseInt(inputSlider.value));
	}
}
image1.onload = function initialize() {
	//console.log('Image loaded: ', image1.src);
	//console.log('Image dimiensions: ', image1.width, image1.height);
	const maxDimension = 600;

	let scale = Math.min(
		maxDimension / image1.width,
		maxDimension / image1.height,
		1
	);

	const scaledWidth = image1.width * scale;
	const scaledHeight = image1.height * scale;
	canvas.width = scaledWidth;
	canvas.height = scaledHeight;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(image1, 0, 0, scaledWidth, scaledHeight);

	effect = new AsciiEffect(ctx, scaledWidth, scaledHeight);
	//effect.draw(parseInt(inputSlider.value));

	const base64Image = canvas.toDataURL(image1);
	//console.log('Base64 image:', base64Image);

	handleSlider();
};
const string =
	'$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`';

function reverseString(str) {
	const reversed = str.split('').reverse().join('');
	console.log(reversed);
	return reversed;
}

reverseString(string);
