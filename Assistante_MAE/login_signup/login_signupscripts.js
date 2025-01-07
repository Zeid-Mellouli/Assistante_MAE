// Switch entre le formulaire de connexion et celui d'inscription
document.getElementById('switch-to-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
});

document.getElementById('switch-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

// Gestion de l'inscription
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const firstname = document.getElementById('signup-firstname').value;
    const lastname = document.getElementById('signup-lastname').value;
    const phone = document.getElementById('signup-phone').value;
    const situation = document.getElementById('signup-situation').value;

    // Validation du numéro de téléphone (exactement 8 chiffres)
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(phone)) {
        alert('Le numéro de téléphone doit comporter exactement 8 chiffres.');
        return;
    }

    // Vérifier que les mots de passe correspondent
    if (password === confirmPassword) {
        // Envoi des données au serveur pour la création de l'utilisateur
        fetch('https://assistante-mae.onrender.com/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, firstname, lastname, phone, situation })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log(data);
                // Stocker les informations de l'utilisateur dans le localStorage
                localStorage.setItem("data", JSON.stringify(data.user));
                
                // Rediriger vers la page principale
                window.location.href = '../main.html';
            } else {
                alert('Échec de l\'inscription : ' + data.message);
            }
        })
        .catch(err => {
            console.error('Erreur:', err);
            alert('Échec de l\'inscription.');
        });
    } else {
        alert('Les mots de passe ne correspondent pas.');
    }
});

// Gestion de la connexion
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Envoi des données au serveur pour la connexion de l'utilisateur
    fetch('https://assistante-mae.onrender.com/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Connexion réussie !');
            
            // Stocker l'état de connexion
            localStorage.setItem('isLoggedIn', 'true');
            
            // Stocker les informations de l'utilisateur
            localStorage.setItem('data', JSON.stringify(data.user)); // Sauvegarder les infos utilisateur
            
            // Rediriger vers la page principale
            window.location.href = '../main.html';
        } else {
            alert('Échec de la connexion : ' + data.message);
        }
    })
    .catch(err => {
        console.error('Erreur:', err);
        alert('Erreur de connexion.');
    });
});
