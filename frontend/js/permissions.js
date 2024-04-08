function fetchPermissions() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/permissions', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(permissions => {
        const permissionsTableBody = document.getElementById('permissionsTable').getElementsByTagName('tbody')[0];
        permissionsTableBody.innerHTML = ''; // Clear existing rows
        permissions.forEach(permission => {
            let row = permissionsTableBody.insertRow();
            let name = row.insertCell(0);
            name.innerHTML = permission.name;

            let actions = row.insertCell(1);
            actions.innerHTML = `<button onclick="deletePermission('${permission.id}')">Delete</button>`;
            // Add more actions as needed
        });
    })
    .catch(error => console.error('Error:', error));
}


document.getElementById('addPermissionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const permissionName = document.getElementById('newPermissionName').value;

    fetch('http://localhost:8000/api/permissions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: permissionName }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Permission added:', data);
        fetchPermissions(); // Refresh the list of permissions
    })
    .catch(error => console.error('Error:', error));
});


function deletePermission(permissionId) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/permissions/${permissionId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            console.log('Permission deleted');
            fetchPermissions(); // Refresh the list of permissions
        }
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showAddPermissionModal').addEventListener('click', function() {
        document.getElementById('addPermissionModal').style.display = 'block';
    });
    // Continue with other initialization code...
    fetchPermissions();
});
