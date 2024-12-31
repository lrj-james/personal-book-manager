function handleNames(names, style) {
	// If there are no authors, return an empty string
	if (!names) {
		return '';
	}

	let result = [];
	let count = 0;

	for (let name of names) {
		let nameArray = name.split(' ');

		switch (style) {
			case 'APA':
				if (nameArray.length === 1) {
					result.push(nameArray[0]);
				} else if (nameArray.length === 2) {
					result.push(`${nameArray[1]}, ${nameArray[0][0].toUpperCase()}.`);
				} else if (nameArray.length === 3) {
					result.push(
						`${nameArray[2]}, ${nameArray[0][0].toUpperCase()}. ${nameArray[1][0].toUpperCase()}.`
					);
				} else {
					result.push(name);
				}
				break;
			case 'MLA':
				if (nameArray.length === 1) {
					result.push(nameArray[0]);
				} else if (nameArray.length === 2) {
					result.push(`${nameArray[1]}, ${nameArray[0]}`);
				} else if (nameArray.length === 3) {
					result.push(
						`${nameArray[2]}, ${nameArray[0]} ${nameArray[1][0].toUpperCase()}.`
					);
				} else {
					result.push(name);
				}
				break;
			case 'Chicago':
				if (count === 0) {
					if (nameArray.length === 1) {
						result.push(nameArray[0]);
					} else if (nameArray.length === 2) {
						result.push(`${nameArray[1]}, ${nameArray[0]}`);
					} else if (nameArray.length === 3) {
						result.push(`${nameArray[2]}, ${nameArray[0]} ${nameArray[1]}`);
					} else {
						result.push(name);
					}
				} else {
					result.push(name);
				}
				count++;
				break;
		}
	}

	// If there are more than 20 authors, return the first 20 authors and the last author
	if (style === 'APA' && names.length >= 20) {
		return result.slice(0, 20).join(', ') + '...' + result.slice(-1);
	} else if (style === 'Chicago' && names.length >= 2) {
		let lastElement = result.pop();
		return result.join(', ') + ' and ' + lastElement + '. ';
	} else {
		return result.join(', ') + '. ';
	}
}

function turnDateToYear(dates) {
	if (!dates) {
		return '';
	}
	return dates.toString().slice(0, 4);
}

function sanitizeCitationString(str) {
	let prevStr;
	do {
		prevStr = str;
		str = str
			.replace('(). ', '')
			.replace('. .', '.')
			.replace(', .', '.')
			.replace(' , ', '.')
			.replace('..', '.')
			.replace(',.', '.');
	} while (str !== prevStr);
	return str;
}

// Function to generate APA citation
function generateAPA(bookInfo) {
	return sanitizeCitationString(
		`${handleNames(bookInfo.authors, 'APA')} (${turnDateToYear(bookInfo.publishedDate)}). <i>${bookInfo.title || ''}</i>. ${bookInfo.publisher || ''}.`
	);
}

// Function to generate MLA citation
function generateMLA(bookInfo) {
	return sanitizeCitationString(
		`${handleNames(bookInfo.authors, 'MLA')}<i>${bookInfo.title || ''}</i>. ${bookInfo.publisher || ''}, ${turnDateToYear(bookInfo.publishedDate)}.`
	);
}

// Function to generate Chicago citation
function generateChicago(bookInfo) {
	return sanitizeCitationString(
		`${handleNames(bookInfo.authors, 'Chicago')}<i>${bookInfo.title || ''}</i>. ${bookInfo.publisher || ''}, ${turnDateToYear(bookInfo.publishedDate)}.`
	);
}
