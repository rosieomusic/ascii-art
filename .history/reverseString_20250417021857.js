const string =
	'$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`';
const charArray = string.split('');

function reverseString(string) {
	for (let i = 0; i > charArray.length - 1; i--) {
		let newString = charArray[i];
		console.log(newString);
	}
}
reverseString(string);
