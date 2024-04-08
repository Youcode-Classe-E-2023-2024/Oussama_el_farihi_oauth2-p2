document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the token and redirect if not found
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch and display users
    fetchUsers(token);

    // Event listener for the form submission
    document.getElementById('updateUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateUser(token);
    });
});

function fetchUsers(token) {
    fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(displayUsers)
    .catch(error => console.error('Error:', error));
}

function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = generateUserRowHTML(user);
        usersList.appendChild(row);
    });

    attachEventListeners();
}

function generateUserRowHTML(user) {
    return `
        <td class="px-4 py-3">${user.id}</td>
        <td class="px-4 py-3">${user.name}</td>
        <td class="px-4 py-3">${user.email}</td>
        <td class="px-4 py-3">${user.roles.map(role => role.name).join(", ")}</td>
        <td class="px-4 py-3">
            <button class="deleteUserBtn" data-user-id="${user.id}">Delete</button>
            <button class="editUserBtn" data-user-id="${user.id}" data-user-name="${user.name}" data-user-email="${user.email}">Edit</button>
        </td>
    `;
}

function attachEventListeners() {
    const token = localStorage.getItem('token');
    document.querySelectorAll('.deleteUserBtn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            deleteUser(userId, token);
        });
    });

    document.querySelectorAll('.editUserBtn').forEach(button => {
        button.addEventListener('click', function() {
            const user = {
                id: this.getAttribute('data-user-id'),
                name: this.getAttribute('data-user-name'),
                email: this.getAttribute('data-user-email')
            };
            showEditForm(user);
        });
    });
}

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

function showEditForm(user) {
    document.getElementById('updateUserId').value = user.id;
    document.getElementById('updateUserName').value = user.name;
    document.getElementById('updateUserEmail').value = user.email;
    // Clear previous roles from the dropdown to avoid duplication
    document.getElementById('updateUserRole').innerHTML = '<option value="">Select Role</option>';
    // Fetch and display roles
    const token = localStorage.getItem('token');
    fetchRoles(token);
    document.getElementById('updateUserModal').style.display = 'block';
}

function updateUser(token) {
    const userId = document.getElementById('updateUserId').value;
    const name = document.getElementById('updateUserName').value;
    const email = document.getElementById('updateUserEmail').value;

    // Update user details
    fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('User updated successfully:', data);
        assignUserRole(token, userId);
    })
    .catch(error => console.error('Error:', error));
}

function fetchRoles(token) {
    fetch('http://localhost:8000/api/roles', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const roleSelect = document.getElementById('updateUserRole');
        data.forEach(role => {
            const option = document.createElement('option');
            option.value = role.name;
            option.innerText = role.name;
            roleSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error:', error));
}


function assignUserRole(token, userId) {
    const role = document.getElementById('updateUserRole').value;
    fetch(`http://localhost:8000/api/users/${userId}/assign-role`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Role assigned successfully:', data);
        location.reload();
    })
    .catch(error => console.error('Error in role assignment:', error));
}
