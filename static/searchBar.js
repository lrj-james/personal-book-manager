// Using Google Books API https://developers.google.com/books/docs/v1/getting_started
const url = 'https://www.googleapis.com/books/v1/volumes';
// Fields to fetch from the API
const fields =
	'items(id,volumeInfo(title,authors,publisher,publishedDate,language,imageLinks/smallThumbnail))';

let input = document.getElementById('indexSearchBar');
let timeout = null;

input.addEventListener('input', function () {
	clearTimeout(timeout);
	timeout = setTimeout(async function () {
		const query = input.value.trim();
		const resultDiv = document.getElementById('indexSearchResult');
		resultDiv.innerHTML = '';
		if (query === '') {
			return;
		}

		try {
			let response = await fetch(url + `?fields=${fields}&q=${query}`);
			let books = await response.json();

			if (books.items) {
				books.items.forEach(book => {
					const bookId = book.id;
					const bookInfo = book.volumeInfo;
					const div = document.createElement('div');
					div.className = 'book-item';

					div.innerHTML = `
											<div class="book-title">${bookInfo.title}</div>
											<div class="book-authors">${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown author'}</div>
											<div class="book-details row">
													<div class="col-md-4">
															<img src="${bookInfo.imageLinks?.smallThumbnail || 'https://via.placeholder.com/128'}" alt="Book cover" class="img-fluid">
													</div>
													<div class="col-md-8">
															<p>Published at: ${bookInfo.publishedDate || 'Unknown'}</p>
															<p>Publisher: ${bookInfo.publisher || 'Unknown'}</p>
															<p>Language: ${bookInfo.language.toUpperCase() || 'Unknown'}</p>
															<button class="btn btn-success btn-sm mt-2" id="addButton-${bookId}">Add to Shelf</button>
														</div>
											</div>
									`;

					// Toggle active class on click
					div.addEventListener('click', function () {
						document.querySelectorAll('.book-item').forEach(item => {
							if (item !== div) item.classList.remove('active');
						});
						div.classList.toggle('active');
					});

					resultDiv.appendChild(div);

					// Implement the function 'addBook' to the button
					document
						.getElementById(`addButton-${bookId}`)
						.addEventListener('click', () => {
							addBook(bookInfo);
						});
				});
			}
		} catch (error) {
			console.error('Error fetching books:', error);
		}
	}, 300); // 300ms debounce
});
