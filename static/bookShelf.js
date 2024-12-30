document.addEventListener('DOMContentLoaded', function () {
	const selectAllCheckbox = document.getElementById('selectAll');
	const bookCheckboxes = document.querySelectorAll('input[name="book"]');
	const exportButton = document.getElementById('exportSelected');
	const deleteButton = document.getElementById('deleteSelected');

	// Handle select all checkbox
	if (selectAllCheckbox) {
		selectAllCheckbox.addEventListener('change', function () {
			bookCheckboxes.forEach(checkbox => {
				checkbox.checked = selectAllCheckbox.checked;
			});
		});
	}

	// Handle export selected books
	if (exportButton) {
		exportButton.addEventListener('click', function () {
			const selectedBooks = Array.from(bookCheckboxes)
				.filter(checkbox => checkbox.checked)
				.map(checkbox => checkbox.value);

			console.log(selectedBooks);

			if (selectedBooks.length > 0) {
				// Implement export functionality here
				alert('Exporting books: ' + selectedBooks.join(', '));
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
