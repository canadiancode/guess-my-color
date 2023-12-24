// Create variables for DOM elements //
const startRecordingBtn = document.querySelector('#start-recording');
const currentRecordingLength = document.querySelector('#current-recording-duration');
const audioPlayerControls = document.querySelector('#audio-player-controls');

// Global recording variable //
let mediaRecorder;
let chunks = [];
let startTime;
let isRecording = false;

// Start & Stop the Recording //
startRecordingBtn.addEventListener('click', async (event) => { 

    // Clear the old recording
    chunks = [];

    try {
        ////////////////////////////
        // STARTING THE RECORDING //
        ////////////////////////////

        // Set the value of the duration back to 0
        currentRecordingLength.textContent = '0';

        // Display the next button to get the demo question
        document.querySelector('#next-demo-button').style.display = 'none';
        
        // Asking the user's permission to use mic
        let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
        // Create a new instance for the MediaRecorder method
        mediaRecorder  = new MediaRecorder(stream);
    
        // Starting the recording
        mediaRecorder.start();

        // State that we are recording
        isRecording = true;
    
        // Change the style of buttons
        startRecordingBtn.disabled = true;

        // Start the timer when recording begins
        startTime = new Date();
        const timerInterval = setInterval(updateTimer, 1000);
    
        // Push the collected data into the global recording varaible
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            };
        };
    
        ////////////////////////////////////
        // STOPPING THE RECORDING - TIMER //
        ////////////////////////////////////           
        setTimeout(() => {
            mediaRecorder.stop();
            mediaRecorder.onstop = (event) => {

                // Change the style of buttons
                startRecordingBtn.disabled = false;

                // Stop the timer when recording stops
                clearInterval(timerInterval);

                // Create blob from the chucks of recording
                const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                const audioURL = URL.createObjectURL(audioBlob);

                // Add the URL onto the audio player
                audioPlayerControls.src = audioURL;
                audioPlayerControls.controls = true;

                // Display the next button to get the demo question
                document.querySelector('#next-demo-button').style.display = 'flex';
            
                // Stop recording
                isRecording = false;
            };
        }, 3300);

    } catch (error) {
        console.log('Error recording the user: ', error);
    };
});

////////////////////////////////////////////
// Submitting the recording to the server //
////////////////////////////////////////////
const submitButton = document.querySelector('#submit-button');
submitButton.addEventListener('click', (e) => {

     // Prevent the default form submission behavior
    e.preventDefault();

    // Check if there are recorded audio chunks to send
    if (chunks.length === 0) {
        console.log('No recorded audio to submit.');
        alert('Please recording something to submit!');
        return;
    };

    // Ensure that the demo input is selected
    if (document.querySelector('.demo-input-container select').value === 'placeholder') {
        console.log('you need to pick one');
        alert('You need to pick a demographic input');
        return;
    };

    // Create a FormData object and append the audio chunks as a Blob
    const formData = new FormData();
    const audioBlob = new Blob(chunks, { type: 'audio/wav' });
    formData.append('audio', audioBlob, 'recording.wav');

    // Send the recorded audio data to the server using a POST request
    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
    })
    .then((response) => {
        if (response.ok) {
            console.log('Audio data sent successfully.');
            // You can reset the recording or perform any other actions here
        } else {
            console.error('Failed to send audio data.');
        };
    })
    .catch((error) => {
        console.error('Error sending audio data:', error);
    });
});

//////////////////////////////////////////////
// Callback Functions -- Callback Functions //
//////////////////////////////////////////////
function updateTimer() {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    currentRecordingLength.textContent = elapsedSeconds;
};
