document.addEventListener('DOMContentLoaded', function () {
	const selectAllCheckbox = document.getElementById('selectAll');
	const bookCheckboxes = document.querySelectorAll('input[name="book"]');
	const exportAPAButton = document.getElementById('exportAPA');
	const exportMLAButton = document.getElementById('exportMLA');
	const exportChicagoButton = document.getElementById('exportChicago');
	const deleteButton = document.getElementById('deleteSelected');

	// Handle select all checkbox
	if (selectAllCheckbox) {
		selectAllCheckbox.addEventListener('change', function () {
			bookCheckboxes.forEach(checkbox => {
				checkbox.checked = selectAllCheckbox.checked;
			});
		});
	}

	// Handle export selected books as APA
	if (exportAPAButton) {
		exportAPAButton.addEventListener('click', function () {
			const selectedBooks = Array.from(bookCheckboxes)
				.filter(checkbox => checkbox.checked)
				.map(checkbox => books.find(book => book.id == checkbox.value));

			if (selectedBooks.length > 0) {
				exportGroupCitation(selectedBooks, 'APA');
			} else {
				alert('No books selected for export.');
			}
		});
	}

	// Handle export selected books as MLA
	if (exportMLAButton) {
		exportMLAButton.addEventListener('click', function () {
			const selectedBooks = Array.from(bookCheckboxes)
				.filter(checkbox => checkbox.checked)
				.map(checkbox => books.find(book => book.id == checkbox.value));

			if (selectedBooks.length > 0) {
				exportGroupCitation(selectedBooks, 'MLA');
			} else {
				alert('No books selected for export.');
			}
		});
	}

	// Handle export selected books as Chicago
	if (exportChicagoButton) {
		exportChicagoButton.addEventListener('click', function () {
			const selectedBooks = Array.from(bookCheckboxes)
				.filter(checkbox => checkbox.checked)
				.map(checkbox => books.find(book => book.id == checkbox.value));

			if (selectedBooks.length > 0) {
				exportGroupCitation(selectedBooks, 'Chicago');
			} else {
				alert('No books selected for export.');
			}
		});
	}

	// Handle delete selected books
	if (deleteButton) {
		deleteButton.addEventListener('click', function () {
			const selectedBooks = Array.from(bookCheckboxes)
				.filter(checkbox => checkbox.checked)
				.map(checkbox => checkbox.value);

			if (selectedBooks.length > 0) {
				fetch('/bookshelf', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ books: selectedBooks }),
				})
					.then(response => response.json())
					.then(data => {
						if (data.success) {
							alert('Books deleted successfully.');
							location.reload(); // Reload the page to update the book list
						} else {
							alert('Failed to delete books.');
						}
					})
					.catch(error => {
						console.error('Error:', error);
						alert('An error occurred while deleting books.');
					});
			} else {
				alert('No books selected for deletion.');
			}
		});
	}
});
