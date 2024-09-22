document.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.getElementById('input');
    const outputElement = document.getElementById('output');

    inputElement.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = inputElement.value.trim();
            if (input) {
                displayPrompt(`$ ${input}`);
                shortenUrl(input);
                inputElement.value = '';
            }
        }
    });

    function displayPrompt(text) {
        const newPrompt = document.createElement('pre');
        newPrompt.textContent = text;
        outputElement.appendChild(newPrompt);
        smoothScroll(newPrompt);
    }

    function displayResult(result) {
        const resultBlock = document.createElement('div');
        resultBlock.innerHTML = `
            <pre>Shortened URL: ${result.shortened}</pre>
            <pre>QR Code:</pre>
            <div class="qr-output"></div>
        `;
        outputElement.appendChild(resultBlock);
        displayAnimatedQr(result.qr_code, resultBlock.querySelector('.qr-output'));
    }

    function shortenUrl(url) {
        fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                displayPrompt(`Error: ${data.error}`);
            } else {
                displayResult(data);
            }
        })
        .catch(error => {
            displayPrompt(`Error: ${error}`);
        });
    }

    function smoothScroll(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    function displayAnimatedQr(qrText, qrOutputElement) {
        const qrArray = qrText.split('\n');
        const qrElement = document.createElement('pre');
        qrOutputElement.appendChild(qrElement);

        let currentLine = 0;

        function animateLine() {
            if (currentLine < qrArray.length) {
                qrElement.textContent += qrArray[currentLine] + '\n';
                currentLine++;
                setTimeout(animateLine, 100); // Adjust speed for smoother animation
            }
        }

        animateLine();
    }
});
