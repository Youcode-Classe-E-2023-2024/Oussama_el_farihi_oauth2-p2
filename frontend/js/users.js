document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; // Redirection if not authenticated
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
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-3">${user.id}</td>
                <td class="px-4 py-3">${user.name}</td>
                <td class="px-4 py-3">${user.email}</td>
                <td class="px-4 py-3">${user.role}</td>
            `;
            usersList.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
});
