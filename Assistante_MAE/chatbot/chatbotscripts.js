// Récupérer les éléments du DOM

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatHistory = document.getElementById('chat-history');
const fileInput = document.getElementById('file-input');
const newConvoButton = document.getElementById('new-convo');
const microphoneButton = document.getElementById('microphone-button');
const historySection = document.getElementById('history'); // Section d'historique
const profileButton = document.getElementById('profile-button');
const profileDropdown = document.getElementById('profile-dropdown');



let recognition;
let isRecognizing = false;

// Initialisation de la reconnaissance vocale si disponible
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;

    recognition.onstart = () => {
        isRecognizing = true;
        console.log('Reconnaissance vocale activée');
        microphoneButton.textContent = '🔊';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Texte reconnu:', transcript);
        messageInput.value = transcript;
    };

    recognition.onend = () => {
        isRecognizing = false;
        console.log('Reconnaissance vocale désactivée');
        microphoneButton.textContent = '🎤';
    };

    recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        alert("Erreur de reconnaissance vocale. Veuillez réessayer.");
    };
} else {
    console.error('La reconnaissance vocale n\'est pas supportée par ce navigateur.');
    alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
}



function sendMessageToChatbot(message) {
    const staticResponses = {
        'assurance-auto': "Les couvertures d'assurance auto incluent généralement la responsabilité civile, l'assurance collision, et l'assurance tous risques.",
        'assurance-habitation': "L'assurance habitation protège votre maison contre les dommages causés par des incendies, des vols, ou des catastrophes naturelles.",
        'assurance-sante': "L'assurance santé couvre les frais médicaux, les hospitalisations et parfois les soins préventifs.",
        'assurance-vie': "L'assurance vie permet de protéger vos proches financièrement en cas de décès.",
        'assurance-voyage': "L'assurance voyage couvre les annulations, les retards et les urgences médicales pendant vos voyages.",
        'reclamations': "Pour soumettre une réclamation, vous devez fournir des documents justificatifs et suivre les étapes indiquées par votre assureur.",
        'prime-paiements': "Les primes d'assurance sont calculées en fonction de divers facteurs, y compris le type de couverture et le profil de risque.",
        'assurance-entreprises': "Les options d'assurance pour entreprises incluent la responsabilité civile, l'assurance des biens, et la couverture des employés."
    };
    const res = staticResponses[message];
    if (message) {
        respondAndArchive(res); // Static response for predefined questions

    }
}

// Fonction d'envoi de message
sendButton.addEventListener('click', () => {
    sendMessage();
});

async function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessageToChat('Vous', message);
        messageInput.value = '';

        // Vérifier les réponses spécifiques
        handleSpecificResponses(message);
    }
}

// Gérer les réponses spécifiques
function handleSpecificResponses(command) {
    const responses = {
        assistance: "Bonjour, comment puis-je vous aider ?",
        réclamation: "Vous pouvez faire une réclamation en remplissant le formulaire sur notre site.",
        contact: "Vous pouvez nous contacter par téléphone au 123-456-789 ou par email à support@assurance.com."
    };

    if (command.includes('assistance') || command.includes('aide')) {
        respondAndArchive(responses.assistance);
    } else if (command.includes('réclamation')) {
        window.open('https://assistante-mae.onrender.com/reclamation/reclamation.html', '_blank');
        respondAndArchive(responses.réclamation);
    } else if (command.includes('contact')) {
        respondAndArchive(responses.contact);
    } else {
        
        sendMessageToAPI(command).then(response => {
            // Check if response contains "assistance:" and remove it if present
            let cleanedResponse = response.response
            .replace(/^assistance:\s*/, '')
            .replace(/^chatbot:\s*/, '')
            .replace(/^bot:\s*/, '')
            .replace(/^system:\s*/, '')
            .replace(/^assistant:\s*/, '')
            .replace(/^AI:\s*/, '')
            .replace(/^IA:\s*/, '')
    
            
            respondAndArchive(cleanedResponse);
        });
        
    }
}

// Fonction pour envoyer le message à l'API appropriée
async function sendMessageToAPI(command) {
    // Define the body payload with the required structure
    const bodyPayload = { command };
console.log(bodyPayload);

    try {
        const response = await fetch(`https://assistante-mae.onrender.com/api/chatgpt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload)
        });

        // Check if the response is OK; if not, log the status and throw an error
        if (!response.ok) {
            const errorText = await response.text(); // Read response body to get error details if any
            console.error(`Erreur API: ${response.status} - ${errorText}`);
            throw new Error("Erreur lors de la communication avec l'API");
        }

        const data = await response.json();
        console.log(data); // Log the response data to see the actual content
        return data.response;
    } catch (error) {
        console.error("Erreur API:", error); // Log the caught error
        throw error;
    }
}


// Fonction pour ajouter un message au chat
function addMessageToChat(user, message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${user}: ${message}`;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Fonction pour la réponse vocale
function speak(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
}

// Fonction pour archiver la conversation
function archiveConversation(message) {
    const archivedDiv = document.createElement('div');
    archivedDiv.textContent = `Vous: ${message}`;
}

// Fonction combinée de réponse et d'archivage
function respondAndArchive(response) {
    archiveConversation(response);
    speak(response);
    addMessageToChat('Assistant', response);
}

// Gestion de fichiers
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        const fileName = files[0].name;
        addMessageToChat('Vous', `Fichier ajouté : ${fileName}`);
    }
});

// Nouvelle discussion
newConvoButton.addEventListener('click', () => {
    chatHistory.innerHTML = '';
});

// Envoi de message avec "Entrée"
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

// Sélection de modèle


// Activation/désactivation du microphone
microphoneButton.addEventListener('click', () => {
    isRecognizing ? recognition.stop() : recognition.start();
});

// Profil: Afficher une alerte ou un menu déroulant
document.getElementById('profile-button').addEventListener('click', () => {
    const confirmDisconnect = confirm('Voulez-vous vraiment vous déconnecter ?');
    if (confirmDisconnect) {
        alert('Déconnexion réussie.');
    } else {
        alert('Accès à votre profil.');
    }
});
profileButton.addEventListener('click', () => {
    profileDropdown.classList.toggle('show');
});

document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const chatHistory = document.getElementById('chat-history');

    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value;

        if (messageText) {
            // Créer un élément de message utilisateur
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-message user-message';
            userMessage.textContent = messageText;
            chatHistory.appendChild(userMessage);

            // Réponse de l'assistant
            const assistantMessage = document.createElement('div');
            assistantMessage.className = 'chat-message assistant-message';
            assistantMessage.textContent = `Réponse de l'assistant pour: "${messageText}"`;
            chatHistory.appendChild(assistantMessage);

            // Effacer le champ d'entrée
            userInput.value = '';

            // Faire défiler l'historique vers le bas
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    });
});
