// Export single citation at the index route
function exportSingleCitation(bookInfo) {
	const modal = document.getElementById('exportModal');
	const span = document.getElementsByClassName('close')[0];
	const exportContent = document.getElementById('exportContent');

	// Set the content of the modal
	exportContent.innerHTML = `
    <h2>Citation</h2>
    <table>
        <tr>
            <td>APA</td>
            <td class="citation" id="citation-apa">${generateAPA(bookInfo)}</td>
        </tr>
        <tr>
            <td>MLA</td>
            <td class="citation" id="citation-mla">${generateMLA(bookInfo)}</td>
        </tr>
        <tr>
            <td>Chicago</td>
            <td class="citation" id="citation-chicago">${generateChicago(bookInfo)}</td>
        </tr>
    </table>
  `;
	// Display the modal
	modal.style.display = 'block';

	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		modal.style.display = 'none';
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};

	// Add event listeners to citation fields
	document.querySelectorAll('.citation').forEach(citation => {
		citation.addEventListener('click', async function () {
			const range = document.createRange();
			range.selectNodeContents(this);
			const selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);

			try {
				await navigator.clipboard.write([
					new ClipboardItem({
						'text/html': new Blob([this.innerHTML], { type: 'text/html' }),
						'text/plain': new Blob([this.textContent], { type: 'text/plain' }),
					}),
				]);
				alert('Citation copied to clipboard!');
			} catch (err) {
				console.error('Failed to copy citation: ', err);
			}

			// Deselect the text after copying
			selection.removeAllRanges();
		});
	});
}

// Export group citation at the bookshelf route
function exportGroupCitation(books, style) {
	const citations = books.map(book => {
		switch (style) {
			case 'APA':
				return generateAPA(book);
			case 'MLA':
				return generateMLA(book);
			case 'Chicago':
				return generateChicago(book);
			default:
				return '';
		}
	});

	const citationHtml = citations
		.map(citation => `<p>${citation}</p>`)
		.join('<hr>');

	const citationText = citations.join('\n\n');

	try {
		navigator.clipboard.write([
			new ClipboardItem({
				'text/html': new Blob([citationHtml], { type: 'text/html' }),
				'text/plain': new Blob([citationText], { type: 'text/plain' }),
			}),
		]);
		alert('Citations copied to clipboard!');
	} catch (err) {
		console.error('Failed to copy citations: ', err);
	}
}
