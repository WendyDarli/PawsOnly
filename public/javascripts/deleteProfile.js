document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('#deleteProfile');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const profileId = this.getAttribute('data-id');
            const url = `/api/profile/${profileId}`;
            
            fetch(url, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

            })
            .then(data => {
                console.log('Message deleted successfully');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error deleting message:', error);
                
            });
        });
    });
});
