function executeScript() {
    var countdownElement = document.getElementById('countdown');
    if (!countdownElement) {
        countdownElement = document.createElement('div');
        countdownElement.id = 'countdown';
        countdownElement.style.position = 'fixed';
        countdownElement.style.bottom = '10px';
        countdownElement.style.right = '10px';
        countdownElement.style.fontSize = '20px';
        countdownElement.style.backgroundColor = '#fff';
        countdownElement.style.padding = '10px';
        document.body.appendChild(countdownElement);
    }

    function updateStatus(message) {
        console.log(message);
        countdownElement.innerText = message;
    }

    function formatTime(ms) {
        var minutes = Math.floor(ms / 60000);
        var seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }

    function waitFor(ms) {
        return new Promise(resolve => {
            var interval = setInterval(() => {
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

    async function handleQuestions() {
        var questions = document.querySelectorAll('div.card.mb-4, div.card.mb-6, div.custom-scrollbar > div');
        if (questions.length > 0) {
            questions.forEach(question => {
                var questionRadios = question.querySelectorAll('input[type="radio"].hidden');
                if (questionRadios.length > 0) {
                    var selected = questionRadios[Math.floor(Math.random() * questionRadios.length)];
                    var span = selected.parentElement.querySelector('span.text-neutral-80, span.font-bold');
                    if (span) {
                        updateStatus("Sélectionner une réponse aléatoire pour la question");
                        span.click();
                    }
                }
            });

            var waitTime = questions.length * (Math.random() * 30 * 1000 + 60 * 1000); // Entre 1 minute et 1 minute 30 secondes par question
            await waitFor(waitTime);

            // Vérifier si on a un bouton "Suivant"
            var nextButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Suivant'));
            if (nextButton) {
                updateStatus("Cliquer sur 'Suivant'");
                nextButton.click();
                setTimeout(executeScript, 2000);  // Attendre 2 secondes pour charger la prochaine page de questions
                return;
            }

            // Vérifier si on a un bouton "Valider"
            var validateButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Valider'));
            if (validateButton) {
                updateStatus("Cliquer sur 'Valider'");
                validateButton.click();
                setTimeout(executeScript, 2000);  // Attendre 2 secondes pour charger la prochaine page de questions
                return;
            }

            // Vérifier si on a un bouton "Terminer"
            var finishButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Terminer'));
            if (finishButton) {
                updateStatus("Cliquer sur 'Terminer'");
                finishButton.click();
                setTimeout(executeScript, 2000);  // Attendre 2 secondes pour terminer l'activité
                return;
            }
        }
    }

    // Cliquer sur le lien "Continuer"
    var continueLink = document.querySelector('a.button-solid-primary-medium.text-size-20[href*="/user-plannings"]');
    if (continueLink) {
        updateStatus("Cliquer sur 'Continuer'");
        continueLink.click();
        setTimeout(executeScript, 2000);  // Attendre 2 secondes pour charger la prochaine page
        return;
    }

    // Cliquer sur la première activité non terminée
    var activityButtons = document.querySelectorAll('button.flex.flex-col.items-center.group.col-span-4.lg\\:col-span-3.card-hover[type="button"]');
    for (let button of activityButtons) {
        if (!button.querySelector('.fa-check')) {
            updateStatus("Cliquer sur une activité non terminée");
            button.click();
            setTimeout(executeScript, 2000);  // Attendre 2 secondes pour charger l'activité
            return;
        }
    }

    // Cliquer sur le bouton "Démarrer"
    var startButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Démarrer'));
    if (startButton) {
        updateStatus("Cliquer sur 'Démarrer'");
        startButton.click();
        setTimeout(executeScript, 2000);  // Attendre 2 secondes pour démarrer l'activité
        return;
    }

    // Répondre aux questions
    handleQuestions().then(() => {
        // Retourner à la liste des activités
        var backToListLink = document.querySelector('a.group.flex.items-center.mb-8[href*="/user-plannings"]');
        if (backToListLink) {
            updateStatus("Retour à la liste des activités");
            backToListLink.click();
            setTimeout(executeScript, 2000);  // Attendre 2 secondes pour charger la liste
            return;
        }

        updateStatus("Aucune action trouvée, réessayer...");
        setTimeout(executeScript, 2000);  // Attendre 2 secondes et réessayer
    });
}

executeScript();
