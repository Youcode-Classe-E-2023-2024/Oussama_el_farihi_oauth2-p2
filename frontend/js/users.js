document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
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
                <td class="px-4 py-3">${user.roles.map(role => role.name).join(", ")}</td>
                <td class="px-4 py-3">
                <button
                class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray deleteUserBtn"
                data-user-id="${user.id}"
              >
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
                </td>
                
            `;
            usersList.appendChild(row);
        });
    
        document.querySelectorAll('.deleteUserBtn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                deleteUser(userId, token);
            });
        });
    })
    
    .catch(error => console.error('Error:', error));

    function deleteUser(userId, token) {
        fetch(`http://localhost:8000/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                console.log('User deleted successfully');
                location.reload();
            } else {
                console.error('Failed to delete user');
            }
        })
        .catch(error => console.error('Error:', error));
    }
    
});


