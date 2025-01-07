function checkUserSession() {
  // Check if "use" exists in localStorage
  if (!localStorage.getItem("data")) {
    // If "use" does not exist, redirect to the login interface
    window.location.href = "./login_signup/login_signup.html";
  }
}

// Call the function to perform the check when the script runs
checkUserSession();






// Vérifier si l'utilisateur est connecté au profil
fetch('/profile')
  .then(response => {
    // Si la réponse est 401 (non autorisé), rediriger l'utilisateur vers la page de connexion
    if (response.status === 401) {
      window.location.href = './login_signup.html';
    }
    // Vous pouvez aussi ajouter un autre code pour gérer des réponses valides
    else if (response.status === 200) {
      // Réponse valide, l'utilisateur est authentifié
      response.json().then(data => {
        // Utilisez les données du profil, par exemple pour afficher le nom de l'utilisateur
        console.log(data);
        // Par exemple, vous pouvez afficher le nom de l'utilisateur dans un élément de la page
        document.getElementById('user-name').innerText = `Bonjour, ${data.firstname} ${data.lastname}`;
      });
    }
  })
  .catch(error => {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
  });


// Gérer le clic sur le bouton profil avec vérification de connexion
document.getElementById('profile-button').addEventListener('click', (e) => {
  e.preventDefault(); // Empêche le lien par défaut
  const isUserLoggedIn = true; // Exemple : remplacer par une vérification réelle
  if (isUserLoggedIn) {
    window.location.href = './profil/profil.html';
  } else {
    alert('Veuillez vous connecter pour accéder à votre profil.');
    window.location.href = './login_signup/login_signup.html';
  }
});

// Rendre le menu circulaire déplaçable
const circleMenu = document.querySelector('.logo-container');

let isDragging = false;
let offsetX, offsetY;

circleMenu.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - circleMenu.getBoundingClientRect().left;
  offsetY = e.clientY - circleMenu.getBoundingClientRect().top;
  circleMenu.classList.add('draggable'); // Ajout de classe pour style éventuel
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    circleMenu.style.left = `${x}px`;
    circleMenu.style.top = `${y}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  circleMenu.classList.remove('draggable');
});

// Basculer le menu de gauche à droite au clic sur le logo
circleMenu.addEventListener('click', function(e) {
  // Éviter de déclencher le basculement si en mode drag
  if (!isDragging) {
    if (this.classList.contains('left')) {
      this.classList.remove('left');
      this.classList.add('right');
      this.style.left = 'auto';
      this.style.right = '20px';
    } else {
      this.classList.remove('right');
      this.classList.add('left');
      this.style.right = 'auto';
      this.style.left = '20px';
    }
  }
});
