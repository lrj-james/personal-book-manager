function addBook(bookInfo) {
	// Send a POST request to the server
	console.log('addBook', bookInfo);
	(async () => {
		let response = await fetch('/add-book', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(bookInfo),
		});
		let result = await response.json();
		if (result.success) {
			alert('Book added successfully!');
		} else {
			alert('Error adding book!' + result.message);
		}
	})();
}
