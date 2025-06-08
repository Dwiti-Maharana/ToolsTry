document.addEventListener('DOMContentLoaded', function() {
    const pdfInput = document.getElementById('pdf-input');
    const pdfFileList = document.getElementById('pdf-file-list');
    const mergePdfBtn = document.getElementById('merge-pdf-btn');
    const clearPdfFilesBtn = document.getElementById('clear-pdf-files-btn');
    const pdfMergeStatus = document.getElementById('pdf-merge-status');
    const pdfMergeLoading = document.getElementById('pdf-merge-loading');
    const downloadMergedPdf = document.getElementById('download-merged-pdf');
    const fileListSection = document.querySelector('.file-list-section');
    const uploadSection = document.querySelector('.upload-section');

    let selectedPdfs = []; // Store File objects

    // Handle file selection via input or drag-and-drop
    pdfInput.addEventListener('change', handleFiles);
    uploadSection.addEventListener('dragover', (e) => {
        e.preventDefault(); // Prevent default to allow drop
        uploadSection.classList.add('drag-over'); // Add visual feedback
    });
    uploadSection.addEventListener('dragleave', () => {
        uploadSection.classList.remove('drag-over'); // Remove visual feedback
    });
    uploadSection.addEventListener('drop', (e) => {
        e.preventDefault(); // Prevent default behavior (prevent file from opening)
        uploadSection.classList.remove('drag-over');
        handleFiles(e); // Process dropped files
    });

    function handleFiles(event) {
        const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        for (const file of files) {
            if (file.type === 'application/pdf') {
                // Check for duplicates before adding
                if (!selectedPdfs.some(pdf => pdf.name === file.name && pdf.size === file.size)) {
                    selectedPdfs.push(file);
                } else {
                    pdfMergeStatus.textContent = `File already added: ${file.name}`;
                    pdfMergeStatus.style.color = 'orange';
                    setTimeout(() => { pdfMergeStatus.textContent = ''; pdfMergeStatus.style.color = 'var(--accent-cyan-glow)'; }, 3000);
                }
            } else {
                pdfMergeStatus.textContent = `Skipped non-PDF file: ${file.name}`;
                pdfMergeStatus.style.color = 'orange';
                setTimeout(() => { pdfMergeStatus.textContent = ''; pdfMergeStatus.style.color = 'var(--accent-cyan-glow)'; }, 3000);
            }
        }
        renderPdfFileList();
        pdfInput.value = ''; // Clear input to allow re-selection of same file (browser behavior)
    }

    // Render selected PDF files in the list with reordering capabilities
    function renderPdfFileList() {
        pdfFileList.innerHTML = ''; // Clear current list display
        if (selectedPdfs.length > 0) {
            fileListSection.style.display = 'block';
            clearPdfFilesBtn.style.display = 'inline-block';
            selectedPdfs.forEach((file, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('file-list-item');
                listItem.draggable = true; // Enable drag functionality
                listItem.dataset.originalIndex = index; // Store its current index in the selectedPdfs array

                listItem.innerHTML = `
                    <span class="file-name">${file.name}</span>
                    <button class="remove-file-btn" data-index="${index}">&#x2715;</button>
                `;
                pdfFileList.appendChild(listItem);
            });
            mergePdfBtn.disabled = selectedPdfs.length < 2; // Enable merge button only if 2+ files
            pdfMergeStatus.textContent = `${selectedPdfs.length} PDF(s) selected.`;
            pdfMergeStatus.style.color = 'var(--accent-cyan-glow)';
            downloadMergedPdf.style.display = 'none'; // Hide download button if new files are added
        } else {
            fileListSection.style.display = 'none';
            clearPdfFilesBtn.style.display = 'none';
            mergePdfBtn.disabled = true;
            pdfMergeStatus.textContent = 'Select PDF files to merge.';
            pdfMergeStatus.style.color = 'var(--accent-cyan-glow)';
            downloadMergedPdf.style.display = 'none';
        }
    }

    // Remove file from list
    pdfFileList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-file-btn')) {
            const indexToRemove = parseInt(event.target.dataset.index);
            // Splice directly from the selectedPdfs array using its current index
            selectedPdfs.splice(indexToRemove, 1);
            renderPdfFileList(); // Re-render the list
        }
    });

    // Clear all files
    clearPdfFilesBtn.addEventListener('click', () => {
        selectedPdfs = []; // Empty the array
        renderPdfFileList(); // Re-render (will hide list)
        pdfMergeStatus.textContent = 'All files cleared.';
        pdfMergeStatus.style.color = 'gray';
        downloadMergedPdf.style.display = 'none';
        setTimeout(() => { pdfMergeStatus.textContent = 'Select PDF files to merge.'; pdfMergeStatus.style.color = 'var(--accent-cyan-glow)'; }, 2000);
    });

    // --- Drag and Drop Reordering Logic ---
    let draggedItem = null;

    pdfFileList.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        // Store the actual file object associated with the dragged DOM element
        const originalIndex = parseInt(draggedItem.dataset.originalIndex);
        e.dataTransfer.setData('text/plain', originalIndex); // Set data to be transferred
        draggedItem.classList.add('dragging');
    });

    pdfFileList.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
        const afterElement = getDragAfterElement(pdfFileList, e.clientY);
        const currentDraggable = document.querySelector('.dragging');
        if (currentDraggable === null) return; // Guard against dragleave before drop

        if (afterElement == null) {
            pdfFileList.appendChild(currentDraggable);
        } else {
            pdfFileList.insertBefore(currentDraggable, afterElement);
        }
    });

    pdfFileList.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            draggedItem.classList.remove('dragging');

            // Reorder the actual selectedPdfs array based on the new DOM order
            const reorderedPdfs = [];
            Array.from(pdfFileList.children).forEach(item => {
                const originalIndexInSelectedPdfs = parseInt(item.dataset.originalIndex);
                reorderedPdfs.push(selectedPdfs[originalIndexInSelectedPdfs]);
            });
            selectedPdfs = reorderedPdfs;

            // Re-render to update the dataset.originalIndex for all items
            // This is crucial because array indices change after reordering
            renderPdfFileList();
            draggedItem = null; // Reset dragged item
        }
    });

    pdfFileList.addEventListener('dragend', (e) => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
        }
    });


    // Helper function to find the element to insert after for drag-and-drop
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.file-list-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            // Calculate offset from the center of the child
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: -Infinity }).element;
    }


    // --- PDF Merging Logic ---
    mergePdfBtn.addEventListener('click', async () => {
        if (selectedPdfs.length < 2) {
            pdfMergeStatus.textContent = 'Please select at least two PDF files to merge.';
            pdfMergeStatus.style.color = 'orange';
            setTimeout(() => { pdfMergeStatus.textContent = ''; pdfMergeStatus.style.color = 'var(--accent-cyan-glow)'; }, 3000);
            return;
        }

        pdfMergeLoading.style.display = 'block';
        pdfMergeStatus.textContent = 'Merging PDFs... This may take a moment.';
        pdfMergeStatus.style.color = 'var(--accent-cyan-glow)';
        mergePdfBtn.disabled = true;
        clearPdfFilesBtn.disabled = true;
        downloadMergedPdf.style.display = 'none';

        try {
            // PDFDocument is globally available from the unpkg CDN link in pdfmerger.html
            const { PDFDocument } = PDFLib;
            const mergedPdf = await PDFDocument.create();

            for (const file of selectedPdfs) {
                const arrayBuffer = await file.arrayBuffer(); // Read file as ArrayBuffer
                const pdfDoc = await PDFDocument.load(arrayBuffer); // Load PDF from ArrayBuffer
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices()); // Copy all pages
                copiedPages.forEach((page) => mergedPdf.addPage(page)); // Add copied pages to the new PDF
            }

            const mergedPdfBytes = await mergedPdf.save(); // Save the new PDF as bytes
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' }); // Create a Blob
            const url = URL.createObjectURL(blob); // Create a URL for the Blob

            downloadMergedPdf.href = url; // Set download link
            downloadMergedPdf.download = 'merged_document.pdf'; // Set default filename for download
            downloadMergedPdf.style.display = 'inline-block'; // Show download button
            pdfMergeStatus.textContent = 'PDFs merged successfully! Click download button.';
            pdfMergeStatus.style.color = 'lightgreen'; // Success message color

            // Clean up the URL object after a short delay to free memory
            setTimeout(() => URL.revokeObjectURL(url), 60000); // Revoke after 1 minute

        } catch (error) {
            console.error('Error merging PDFs:', error);
            pdfMergeStatus.textContent = 'Error merging PDFs. Please ensure all files are valid PDFs and try again.';
            pdfMergeStatus.style.color = 'red';
        } finally {
            pdfMergeLoading.style.display = 'none';
            mergePdfBtn.disabled = false;
            clearPdfFilesBtn.disabled = false;
        }
    });

    // Initial render call to set up the file list area properly on page load
    renderPdfFileList();
});