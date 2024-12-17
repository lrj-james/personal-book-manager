// This script fetches book data from the Google Books API and displays it in a list.
// With a little help from GitHub Copilot.

const url = 'https://www.googleapis.com/books/v1/volumes';
const fields = 'items(volumeInfo(title,authors,publisher,publishedDate))';

let input = document.getElementById('indexSearchBar');
let timeout = null;

input.addEventListener('input', function () {
	clearTimeout(timeout);
	timeout = setTimeout(async function () {
		const query = input.value.trim();
		if (query === '') {
			document.querySelector('ul').innerHTML = '';
			return;
		}

		try {
			let response = await fetch(url + `?fields=${fields}&q=${query}`);
			let books = await response.json();
			let html = '';

			if (books.items) {
				books.items.forEach(item => {
					let title = item.volumeInfo.title
						.replace('<', '&lt;')
						.replace('&', '&amp;');
					let authors = item.volumeInfo.authors
						? item.volumeInfo.authors.join(', ')
						: 'Unknown author';
					let year = item.volumeInfo.publishedDate
						? item.volumeInfo.publishedDate.substr(0, 4)
						: 'Unknown year';
					let publisher = item.volumeInfo.publisher
						? item.volumeInfo.publisher
						: 'Unknown publisher';
					html +=
						'<li>' +
						title +
						' | ' +
						authors +
						' | ' +
						year +
						' | ' +
						publisher +
						'</li>';
				});
			}
			document.querySelector('ul').innerHTML = html;
		} catch (error) {
			console.error('Error fetching books:', error);
		}
	}, 300); // 300ms debounce
});
