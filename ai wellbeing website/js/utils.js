// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function toggleParentMode() {
    const password = prompt("Enter parent password:");
    if (password === "1234") { // In a real app, use proper authentication
        alert("Parent mode activated!");
        // Add parent mode functionality
    }
}

function navigate(section) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(section).style.display = 'block';
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const container = document.getElementById('notification-container');
    container.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toISOString().replace('T', ' ').substr(0, 19);
}

setInterval(updateDateTime, 1000);

// More utility functions...