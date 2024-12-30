function handleNames(names, style) {
	// If there are no authors, return an empty string
	if (!names) {
		return '';
	}

	let result = [];

	for (let name of names) {
		let nameArray = name.split(' ');

		if (nameArray.length === 1) {
			result.push(nameArray[0]);
		} else if (nameArray.length === 2) {
			switch (style) {
				case 'APA':
					result.push(`${nameArray[1]}, ${nameArray[0][0].toUpperCase()}.`);
					break;
				case 'MLA':
					result.push(`${nameArray[1]}, ${nameArray[0]}`);
					break;
				case 'Chicago':
					result.push(`${nameArray[1]}, ${nameArray[0]}`);
					break;
			}
		} else if (nameArray.length === 3) {
			switch (style) {
				case 'APA':
					result.push(
						`${nameArray[2]}, ${nameArray[0][0].toUpperCase()}. ${nameArray[1][0].toUpperCase()}.`
					);
					break;
				case 'MLA':
					result.push(
						`${nameArray[2]}, ${nameArray[0]} ${nameArray[1][0].toUpperCase()}.`
					);
					break;
				case 'Chicago':
					result.push(`${nameArray[2]}, ${nameArray[0]} ${nameArray[1]}`);
					break;
			}
		} else {
			result.push(name);
		}
	}

	// If there are more than 20 authors, return the first 20 authors and the last author
	if (names.length >= 20 && style === 'APA') {
		return result.slice(0, 20).join(', ') + '...' + result.slice(-1);
	} else {
		return (result.join(', ') + '. ').replace('..', '.');
	}
}

// Function to generate APA citation
function generateAPA(bookInfo) {
	return `${handleNames(bookInfo.authors, 'APA')} (${bookInfo.publishedDate?.slice(0, 4) || ''}). <i>${bookInfo.title || ''}</i>. ${bookInfo.publisher || ''}.`;
}

// Function to generate MLA citation
function generateMLA(bookInfo) {
	return `${handleNames(bookInfo.authors, 'MLA')}<i>${bookInfo.title || ''}</i>. ${bookInfo.publisher || ''}, ${bookInfo.publishedDate?.slice(0, 4) || ''}.`;
}

// Function to generate Chicago citation
function generateChicago(bookInfo) {
	return `${handleNames(bookInfo.authors, 'Chicago')}<i>${bookInfo.title || ''}</i>. ${bookInfo.publisher || ''}, ${bookInfo.publishedDate?.slice(0, 4) || ''}.`;
}
