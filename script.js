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

    var buttons = document.querySelectorAll('.button-solid-primary-large, .button-solid-primary-medium, .button-outline-primary-large');
    var nextModuleLinks = document.querySelectorAll('a.text-default-90.leading-none.pb-1.border-b.border-default-90');
    var feedbackParagraphs = Array.from(document.querySelectorAll('p'));

    for (let button of buttons) {
        if (button.textContent === 'Suivant' || button.textContent === 'Commencer' || button.textContent === 'Terminer' || button.textContent === 'Quitter' || button.textContent === 'Continuer') {
            var waitTime;
            if (button.textContent === 'Suivant') {
                var checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"].hidden'));
                var total = checkboxes.length;
                if (total > 0) {
                    var limit = Math.floor(Math.random() * (total - 1)) + 1;
                    var shuffled = checkboxes.sort(() => 0.5 - Math.random());
                    var selected = shuffled.slice(0, limit);
                    selected.forEach(function (checkbox) {
                        var span = checkbox.parentElement.querySelector('span.text-size-6.leading-none');
                        if (span) {
                            span.click();
                        }
                    });
                }

                var radios = Array.from(document.querySelectorAll('input[type="radio"].hidden'));
                if (radios.length > 0) {
                    var selected = radios.sort(() => 0.5 - Math.random())[0];
                    var span = selected.parentElement.querySelector('span.text-size-6.leading-none');
                    if (span) {
                        span.click();
                    }
                }

                var reconDivs = Array.from(document.querySelectorAll('div[data-row-name^="recon"]'));
                var spans = Array.from(document.querySelectorAll('div[data-row-name="answers_list"] span'));

                var shuffledSpans = spans.sort(() => 0.5 - Math.random());

                reconDivs.forEach(function (div, index) {
                    if (shuffledSpans[index]) {
                        div.appendChild(shuffledSpans[index]);
                        var event = new Event('dragend', {
                            'bubbles': true,
                            'cancelable': true
                        });
                        shuffledSpans[index].dispatchEvent(event);
                        shuffledSpans[index].click();
                    }
                });

                function handleSequentiallyRevealedItems() {
                    var items = Array.from(document.querySelectorAll('ul[data-row-name="answersList"] li'));
                    var visibleItems = items.filter(item => !item.classList.contains('hidden'));

                    if (visibleItems.length > 0) {
                        visibleItems[0].click();
                        setTimeout(handleSequentiallyRevealedItems, 2000);
                    }
                }

                handleSequentiallyRevealedItems();

                var feedbackExists = feedbackParagraphs.some(p => p.innerText === "Good job!" || p.innerText === "Oooooops!");
                if (feedbackExists) {
                    waitTime = 10 * 1000;
                } else {
                    waitTime = Math.ceil(Math.random() * ((60 - 10 + 1) * 1000)) + (10 * 1000);
                }

                countdownElement.innerText = 'Next click in ' + Math.ceil(waitTime / 1000) + ' seconds';
                var countdownInterval = setInterval(function () {
                    waitTime -= 1000;
                    if (waitTime < 0) {
                        clearInterval(countdownInterval);
                        button.click();
                        setTimeout(executeScript, 1000);
                    } else {
                        countdownElement.innerText = 'Next click in ' + Math.ceil(waitTime / 1000) + ' seconds';
                    }
                }, 1000);
                return;
            } else {
                setTimeout(function () {
                    button.click();
                    setTimeout(executeScript, 1000);
                }, 1000);
                return;
            }
        }
    }

    for (let link of nextModuleLinks) {
        if (link.textContent === 'Prochain module') {
            link.click();
        }
    }

    setTimeout(executeScript, 1000);
}

executeScript();
