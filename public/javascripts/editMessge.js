document.getElementById('editMessageForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const formData = new FormData(this); // Create FormData object from form

    const messageId = this.getAttribute('action').split('/').pop(); // Extract message ID from action attribute
    
    fetch(`/messages/${messageId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle success response
        console.log('Message updated successfully:', data);
        window.location.href = '/dashboard'; // Redirect to dashboard or another page
    })
    .catch(error => {
        // Handle error
        console.error('Error updating message:', error);
    });
});