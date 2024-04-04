document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; // Redirection si non authentifié
    }

    fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(users => {
        const usersList = document.getElementById('usersList');
        users.forEach(user => {
            const userElement = document.createElement('p');
            userElement.textContent = `Name: ${user.name}, Email: ${user.email}`;
            usersList.appendChild(userElement);
        });
    })
    .catch(error => console.error('Error:', error));
});
