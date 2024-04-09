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
    .then(permissions => displayPermissions(permissions)) // Update this line to call displayPermissions
    .catch(error => console.error('Error:', error));
}

function displayPermissions(permissions) {
    const permissionsTableBody = document.getElementById('permissionsTable').getElementsByTagName('tbody')[0];
    permissionsTableBody.innerHTML = ''; // Clear existing rows
    permissions.forEach(permission => {
        let row = permissionsTableBody.insertRow();
        let name = row.insertCell(0);
        name.innerHTML = permission.name;

        let actions = row.insertCell(1);
        actions.innerHTML = `<button class="editPermissionBtn" data-permission-id="${permission.id}" data-permission-name="${permission.name}">Edit</button> 
                             <button class="deletePermissionBtn" data-permission-id="${permission.id}">Delete</button>`;
    });

    attachPermissionEventListeners(); // We'll define this function next
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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showAddPermissionModal').addEventListener('click', function() {
        document.getElementById('addPermissionModal').style.display = 'block';
    });
    fetchPermissions();
});


function attachPermissionEventListeners() {
    document.querySelectorAll('.deletePermissionBtn').forEach(button => {
        button.addEventListener('click', function() {
            const permissionId = this.getAttribute('data-permission-id');
            deletePermission(permissionId);
        });
    });
}

function deletePermission(permissionId) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/permissions/${permissionId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            console.log('Permission deleted successfully');
            fetchPermissions(); // Refresh the permissions list
        } else {
            console.error('Failed to delete permission');
        }
    })
    .catch(error => console.error('Error:', error));
}


function attachPermissionEventListeners() {
    document.querySelectorAll('.editPermissionBtn').forEach(button => {
        button.addEventListener('click', function() {
            const permissionId = this.getAttribute('data-permission-id');
            const permissionName = this.getAttribute('data-permission-name');
            document.getElementById('editPermissionId').value = permissionId;
            document.getElementById('editPermissionName').value = permissionName;
            // Show your modal here
        });
    });
}


document.getElementById('editPermissionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const permissionId = document.getElementById('editPermissionId').value;
    const permissionName = document.getElementById('editPermissionName').value;
    updatePermission(permissionId, permissionName);
});

function updatePermission(permissionId, permissionName) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/permissions/${permissionId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: permissionName }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Permission updated:', data);
        fetchPermissions(); // Refresh the permissions list
    })
    .catch(error => console.error('Error:', error));
}

function showEditModal() {
    document.getElementById('editPermissionModal').style.display = 'block';
}


function attachPermissionEventListeners() {
    document.querySelectorAll('.editPermissionBtn').forEach(button => {
        button.addEventListener('click', function() {
            const permissionId = this.getAttribute('data-permission-id');
            const permissionName = this.getAttribute('data-permission-name');
            document.getElementById('editPermissionId').value = permissionId;
            document.getElementById('editPermissionName').value = permissionName;
            showEditModal();
        });
    });

    // Close modal functionality
    document.querySelector('.close-button').addEventListener('click', function() {
        document.getElementById('editPermissionModal').style.display = 'none';
    });
}



document.getElementById('editPermissionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const permissionId = document.getElementById('editPermissionId').value;
    const permissionName = document.getElementById('editPermissionName').value;
    updatePermission(permissionId, permissionName);
    document.getElementById('editPermissionModal').style.display = 'none'; // Hide modal after submission
});
