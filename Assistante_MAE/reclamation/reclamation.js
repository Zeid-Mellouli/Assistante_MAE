document.getElementById('reclamation-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;
    const description = document.getElementById('description').value;

    // Envoi de la réclamation au serveur
    try {
        const response = await fetch('/api/reclamations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nom, email, description }),
        });

        if (response.ok) {
            document.getElementById('message').textContent = 'Réclamation soumise avec succès !';
            document.getElementById('reclamation-form').reset(); // Réinitialise le formulaire
        } else {
            throw new Error('Erreur lors de la soumission de la réclamation');
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Échec de la soumission de la réclamation. Veuillez réessayer.';
        console.error(error);
    }
});
