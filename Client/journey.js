// Get the global variables
const startGameContainer = document.querySelector('.start-game-cta-container');
const instructionsContainer = document.querySelector('.instruction-container');
const recordingContainer = document.querySelector('.recording-container');
const demoInputContainer = document.querySelector('.demo-input-container');

// User will click on the "start game" button
document.querySelector('#next-start-button').addEventListener('click', () => {
    startGameContainer.style.display = 'none';
    instructionsContainer.style.display = 'flex';
    document.querySelector('#next-record-button').addEventListener('click', () => {
        instructionsContainer.style.display = 'none';
        recordingContainer.style.display = 'flex';
        document.querySelector('#next-demo-button').addEventListener('click', () => {
            recordingContainer.style.display = 'none';
            demoInputContainer.style.display = 'flex';
        });
    });
});

