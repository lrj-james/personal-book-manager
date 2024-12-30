// Function to show toast notification
function showToast(message) {
	const toastBody = document.getElementById('toastBody');
	toastBody.textContent = message;
	const toast = new bootstrap.Toast(document.getElementById('liveToast'));
	toast.show();
}

function addBook(bookInfo) {
	// Send a POST request to the server
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
			showToast('Book added successfully!');
		} else {
			alert('Error: ' + result.message);
		}
	})();
}
