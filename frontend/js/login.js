document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        localStorage.setItem('token', data.access_token); // Stockez le token pour les requêtes futures
        window.location.href = 'users.html'; // Redirection vers la page des utilisateurs
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
