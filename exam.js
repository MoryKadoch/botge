let isProcessing = false; // Flag pour empêcher les exécutions multiples

function executeScript() {
    // Vérifier si une exécution est déjà en cours
    if (isProcessing) {
        updateStatus("Un processus est déjà en cours, attente...");
        return;
    }

    isProcessing = true; // Marquer le début du processus

    function ensureCountdownElement() {
        // Vérifier et créer l'élément countdown s'il n'existe pas
        let countdownElement = document.getElementById('countdown');
        if (!countdownElement) {
            countdownElement = document.createElement('div');
            countdownElement.id = 'countdown';
            countdownElement.style.position = 'fixed';
            countdownElement.style.bottom = '10px';
            countdownElement.style.left = '10px';
            countdownElement.style.fontSize = '20px';
            countdownElement.style.backgroundColor = '#fff';
            countdownElement.style.padding = '10px';
            document.body.appendChild(countdownElement);
        }
        return countdownElement;
    }

    function updateStatus(message) {
        const countdownElement = ensureCountdownElement(); // S'assurer que countdownElement existe toujours
        if (countdownElement) {
            console.log(message);
            countdownElement.innerText = message;
        }
    }

    function formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }

    function waitFor(ms) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                ms -= 1000;
                if (ms <= 0) {
                    clearInterval(interval);
                    resolve();
                } else {
                    updateStatus('Attendre ' + formatTime(ms) + ' avant de continuer');
                }
            }, 1000);
        });
    }

    function removeIrrelevantActivities() {
        // Sélectionner tous les boutons d'activité potentiels
        const activityButtons = document.querySelectorAll('button.flex.flex-col.items-center.group.col-span-4.lg\\:col-span-3.card-hover[type="button"]');

        activityButtons.forEach(button => {
            // Vérifier si l'activité semble être une leçon non pertinente
            const img = button.querySelector('img');
            const classList = button.classList.toString();
            if (
                (img && (img.src.includes('vocabulary') || img.src.includes('grammar') || img.src.includes('language-functions'))) || 
                classList.includes('bg-vocabulary') || 
                classList.includes('bg-grammar') || 
                classList.includes('bg-language-functions')
            ) {
                updateStatus("Suppression d'une leçon non pertinente");
                button.remove(); // Supprimer la leçon non pertinente
            }
        });
    }

    async function handleQuestions() {
        // Chercher toutes les questions sur la page
        const questions = document.querySelectorAll('div.card.mb-4, div.card.mb-6');
        const questionCount = questions.length;

        if (questionCount > 0) {
            updateStatus(`Détecté ${questionCount} question(s).`);

            // Répondre à chaque question détectée
            for (let question of questions) {
                const questionRadios = question.querySelectorAll('input[type="radio"].hidden');
                if (questionRadios.length > 0) {
                    // Sélectionner une réponse aléatoire pour chaque question
                    const randomRadio = questionRadios[Math.floor(Math.random() * questionRadios.length)];
                    const span = randomRadio.parentElement.querySelector('span.text-neutral-80, span.font-bold');
                    if (span) {
                        updateStatus("Sélectionner une réponse aléatoire pour la question");
                        span.click();
                    } else {
                        updateStatus("Échec de la sélection, réessayer...");
                        isProcessing = false; // Libérer le flag en cas d'erreur
                        setTimeout(executeScript, 2000); // Réessayer après 2 secondes si aucune réponse sélectionnée
                        return;
                    }
                }
            }

            // Attendre un temps aléatoire après la sélection des réponses
            const waitTime = Math.random() * 30 * 1000 + 60 * 1000; // Entre 1 minute et 1 minute 30 secondes
            console.log('Attente:', waitTime);
            await waitFor(waitTime);

            // Chercher et cliquer sur les boutons pertinents après le timer
            const nextButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Suivant') || btn.textContent.includes('Passer'));
            if (nextButton) {
                updateStatus("Cliquer sur 'Suivant' ou 'Passer'");
                nextButton.click();
                isProcessing = false; // Libérer le flag après avoir cliqué
                setTimeout(executeScript, 2000);  // Attendre 2 secondes pour charger la prochaine page de questions
                return;
            }

            const validateButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Valider'));
            if (validateButton) {
                updateStatus("Cliquer sur 'Valider'");
                validateButton.click();
                isProcessing = false; // Libérer le flag après avoir cliqué
                setTimeout(executeScript, 2000);  // Attendre 2 secondes pour charger la prochaine page de questions
                return;
            }

            const finishButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Terminer'));
            if (finishButton) {
                updateStatus("Cliquer sur 'Terminer'");
                finishButton.click();
                isProcessing = false; // Libérer le flag après avoir cliqué
                setTimeout(executeScript, 2000);  // Attendre 2 secondes pour terminer l'activité
                return;
            }
        } else {
            // Si aucune question n'est détectée, essayer à nouveau
            updateStatus("Aucune réponse détectée, réessayer...");
            isProcessing = false; // Libérer le flag pour permettre une nouvelle tentative
            setTimeout(executeScript, 2000);
        }
    }

    // Cliquer sur le lien "Continuer"
    const continueLink = document.querySelector('a.button-solid-primary-medium.text-size-20[href*="/user-plannings"]');
    if (continueLink) {
        updateStatus("Cliquer sur 'Continuer'");
        continueLink.click();
        isProcessing = false; // Libérer le flag après avoir cliqué
        setTimeout(executeScript, 2000);  // Attendre 2 secondes pour charger la prochaine page
        return;
    }

    // Supprimer les leçons non pertinentes avant de cliquer sur les activités
    removeIrrelevantActivities();

    // Cliquer sur la première activité non terminée
    const activityButtons = document.querySelectorAll('button.flex.flex-col.items-center.group.col-span-4.lg\\:col-span-3.card-hover[type="button"]');
    for (let button of activityButtons) {
        if (!button.querySelector('.fa-check')) {
            updateStatus("Cliquer sur une activité non terminée");
            button.click();
            isProcessing = false; // Libérer le flag après avoir cliqué
            setTimeout(executeScript, 2000);  // Attendre 2 secondes pour charger l'activité
            return;
        }
    }

    // Cliquer sur le bouton "Démarrer"
    const startButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Démarrer'));
    if (startButton) {
        updateStatus("Cliquer sur 'Démarrer'");
        startButton.click();
        isProcessing = false; // Libérer le flag après avoir cliqué
        setTimeout(executeScript, 2000);  // Attendre 2 secondes pour démarrer l'activité
        return;
    }

    // Répondre aux questions
    handleQuestions().then(() => {
        // Retourner à la liste des activités
        const backToListLink = document.querySelector('a.group.flex.items-center.mb-8[href*="/user-plannings"]');
        if (backToListLink) {
            updateStatus("Retour à la liste des activités");
            backToListLink.click();
            isProcessing = false; // Libérer le flag après avoir cliqué
            setTimeout(executeScript, 2000);  // Attendre 2 secondes pour charger la liste
            return;
        }

        updateStatus("Aucune action trouvée, réessayer...");
        isProcessing = false; // Libérer le flag pour permettre une nouvelle tentative
        setTimeout(executeScript, 2000);  // Attendre 2 secondes et réessayer
    });
}

executeScript();