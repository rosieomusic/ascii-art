const string =
	'$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`';

function reverseString(str) {
	const reversed = str.split('').reverse().join('');
	console.log(reversed);
	return reversed;
}

reverseString(string);
