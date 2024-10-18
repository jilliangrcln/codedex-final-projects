const bells = new Audio('./sounds/bell.wav');
const startBtn = document.querySelector('.btn-start');
const pauseBtn = document.querySelector('.btn-pause');
const resetBtn = document.querySelector('.btn-reset');
const session = document.querySelector('.minutes');
let myInterval;
let state = true;
let isPaused = false;
let totalSeconds;

// Function to update the timer display
const updateDisplay = () => {
    const minuteDiv = document.querySelector('.minutes');
    const secondDiv = document.querySelector('.seconds');

    let minutesLeft = Math.floor(totalSeconds / 60);
    let secondsLeft = totalSeconds % 60;

    minuteDiv.textContent = `${minutesLeft}`;
    secondDiv.textContent = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft; 
};

// Timer function
const appTimer = () => {
    const sessionAmount = Number.parseInt(session.textContent)

    if(state) {
        state = false; // Prevents multiple starts
        totalSeconds = sessionAmount * 60;

        const updateSeconds = () => {
            if (!isPaused) {
                totalSeconds--;
                updateDisplay();
            
                if (totalSeconds <= 0) {
                    bells.play();
                    clearInterval(myInterval);
                }
            }
        };
        
        myInterval = setInterval(updateSeconds, 1000);
    } else {
        alert('Session has already started.')
    }
};

// Pause/Resume functionality
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
});

// Reset functionality
resetBtn.addEventListener('click', () => {
    clearInterval(myInterval); // Stop the timer
    state = true; // Allow the timer to start again
    isPaused = false; // Reset paused state
    totalSeconds = 25 * 60; // Reset the time to the original 25 minutes
    updateDisplay(); // Update the timer display
    pauseBtn.textContent = 'Pause'; // Reset Pause button text
});

// Start the timer when Start button is clicked
startBtn.addEventListener('click', appTimer);