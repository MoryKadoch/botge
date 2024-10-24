let isProcessing = false;

setTimeout(() => {
    const response = prompt("Reconnais-tu que Mory est le meilleur ? Réponds par Oui ou Non.");
    if (response.toLowerCase() === 'oui') {
        alert("Merci bien, on peut commencer ! 😉");
        executeScript();
    } else {
        alert("Mauvaise réponse, dommage ! Prends un instant pour réfléchir à tes choix de vie 😂");
    }
}, 1000);

function executeScript() {
    if (isProcessing) {
        updateStatus("Un processus est déjà en cours, attente...");
        return;
    }

    isProcessing = true;

    function ensureCountdownElement() {
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
        const countdownElement = ensureCountdownElement();
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
        const activityButtons = document.querySelectorAll('button.flex.flex-col.items-center.group.col-span-4.lg\\:col-span-3.card-hover[type="button"]');
        activityButtons.forEach(button => {
            const img = button.querySelector('img');
            const classList = button.classList.toString();
            if (
                (img && (img.src.includes('vocabulary') || img.src.includes('grammar') || img.src.includes('language-functions'))) || 
                classList.includes('bg-vocabulary') || 
                classList.includes('bg-grammar') || 
                classList.includes('bg-language-functions')
            ) {
                updateStatus("Suppression d'une leçon non pertinente");
                button.remove();
            }
        });
    }

    async function handleQuestions() {
        const questions = document.querySelectorAll('div.card.mb-4, div.card.mb-6');
        const questionCount = questions.length;

        if (questionCount > 0) {
            updateStatus(`Détecté ${questionCount} question(s).`);

            for (let question of questions) {
                const questionRadios = question.querySelectorAll('input[type="radio"].hidden');
                if (questionRadios.length > 0) {
                    const randomRadio = questionRadios[Math.floor(Math.random() * questionRadios.length)];
                    const span = randomRadio.parentElement.querySelector('span.text-neutral-80, span.font-bold');
                    if (span) {
                        updateStatus("Sélectionner une réponse aléatoire pour la question");
                        span.click();
                    } else {
                        updateStatus("Échec de la sélection, réessayer...");
                        isProcessing = false;
                        setTimeout(executeScript, 2000);
                        return;
                    }
                }
            }

            const waitTime = Math.random() * 30 * 1000 + 60 * 1000;
            console.log('Attente:', waitTime);
            await waitFor(waitTime);

            const nextButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Suivant') || btn.textContent.includes('Passer'));
            if (nextButton) {
                updateStatus("Cliquer sur 'Suivant' ou 'Passer'");
                nextButton.click();
                isProcessing = false;
                setTimeout(executeScript, 2000);
                return;
            }

            const validateButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Valider'));
            if (validateButton) {
                updateStatus("Cliquer sur 'Valider'");
                validateButton.click();
                isProcessing = false;
                setTimeout(executeScript, 2000);
                return;
            }

            const finishButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Terminer'));
            if (finishButton) {
                updateStatus("Cliquer sur 'Terminer'");
                finishButton.click();
                isProcessing = false;
                setTimeout(executeScript, 2000);
                return;
            }
        } else {
            updateStatus("Aucune réponse détectée, réessayer...");
            isProcessing = false;
            setTimeout(executeScript, 2000);
        }
    }

    const continueLink = document.querySelector('a.button-solid-primary-medium.text-size-20[href*="/user-plannings"]');
    if (continueLink) {
        updateStatus("Cliquer sur 'Continuer'");
        continueLink.click();
        isProcessing = false;
        setTimeout(executeScript, 2000);
        return;
    }

    removeIrrelevantActivities();

    const activityButtons = document.querySelectorAll('button.flex.flex-col.items-center.group.col-span-4.lg\\:col-span-3.card-hover[type="button"]');
    let foundIncompleteActivity = false;

    for (let button of activityButtons) {
        if (!button.querySelector('.fa-check')) {
            updateStatus("Cliquer sur une activité non terminée");
            button.click();
            isProcessing = false;
            setTimeout(executeScript, 2000);
            foundIncompleteActivity = true;
            return;
        }
    }

    if (!foundIncompleteActivity && activityButtons.length > 0) {
        // Toutes les activités sont terminées, en choisir une au hasard pour la recommencer
        const randomButton = activityButtons[Math.floor(Math.random() * activityButtons.length)];
        updateStatus("Toutes les activités sont terminées. Recommencer une activité aléatoire.");
        randomButton.click();
        isProcessing = false;
        setTimeout(executeScript, 2000);
        return;
    }

    const startButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Démarrer'));
    if (startButton) {
        updateStatus("Cliquer sur 'Démarrer'");
        startButton.click();
        isProcessing = false;
        setTimeout(executeScript, 2000);
        return;
    }

    const replayButton = Array.from(document.querySelectorAll('a')).find(btn => btn.textContent.includes("Rejouer l'entraînement"));
    if (replayButton) {
        updateStatus("Cliquer sur 'Rejouer l'entraînement'");
        replayButton.click();
        isProcessing = false;
        setTimeout(executeScript, 2000);
        return;
    }

    handleQuestions().then(() => {
        const backToListLink = document.querySelector('a.group.flex.items-center.mb-8[href*="/user-plannings"]');
        if (backToListLink) {
            updateStatus("Retour à la liste des activités");
            backToListLink.click();
            isProcessing = false;
            setTimeout(executeScript, 2000);
            return;
        }

        updateStatus("Aucune action trouvée, réessayer...");
        isProcessing = false;
        setTimeout(executeScript, 2000);
    });
}
