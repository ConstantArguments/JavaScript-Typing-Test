const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

var timer = [0,0,0,0]; // baseline array for timer in [min, sec, ds, cs]

var interval // value set in function startTimer, and used to stop timer in function matchText

var timerIsRunning = false // timer is not running at page load, and used in function startTimer to prevent timer restart after test sucessfull.

// Helper finction to add leading zero to numbers 9 or below (to maintain 00:00:00 format):
function addZero(time) {
  if (time <= 9) {
    time = "0" + time;
  }
  return time;
}

// Run a standard min:sec:cs timer:
function typingTimer() {
  let runningTimer = addZero(timer[0]) + ":" + addZero(timer[1]) + ":" + addZero(timer[2]);
  theTimer.innerHTML = runningTimer;
  timer[3]++; // Starts at 0 and increments with interval 1cs
  
  // (cs/100ds/60sec) = min block:
  timer[0] = Math.floor((timer[3]/100)/60);
  
  // (cs/100ds) = sec block:
  // sec - (min*60) will reset sec block to 0 after 59 sec:
  timer[1] = Math.floor((timer[3]/100) - (timer[0]*60));
  
  // cs block:
  // ds - (sec*100) - (min*6000) will reset cs block to 0 after 99cs:
  timer[2] = Math.floor((timer[3]) - (timer[1]*100) - (timer[0]*6000));
}


// Match the text entered with the provided text on the page:
function matchText() {
  let textEntered = testArea.value;
  let originTextMatch = originText.substring(0,textEntered.length);
  
  // Change testWrapper border color for feedback while typing:
  if (textEntered == originText) {
    clearInterval(interval);
    testWrapper.style.borderColor = "gold";
  } else {
    if (textEntered == originTextMatch) {
      testWrapper.style.borderColor = "green";
    } else {
      testWrapper.style.borderColor = "red";
    }
  }
  console.log("keyup: " + textEntered); // console should show "keypress: n" then "keyup: $"
}

// Start the timer:
function startTest() {
  let textEnteredLength = testArea.value.length;
  console.log("key press: " + textEnteredLength); // numbering starts at 0
  if (textEnteredLength === 0 && !timerIsRunning) {
    timerIsRunning = true;
    interval = setInterval(typingTimer, 10); // interval in ms, 10ms is 1cs
  }
}

// Reset everything:
function resetAll() {
  console.log("reset button click");
  
  //Reset Processes
  clearInterval(interval);
  interval = null; // Clears PID. Prevents multiple processes if test restarted
  timer = [0,0,0,0];
  timerIsRunning = false;
  
  // Reset Display
  testArea.value = "";
  theTimer.innerHTML = "00:00:00";
  testWrapper.style.borderColor = "grey";
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", startTest, false);
testArea.addEventListener("keyup", matchText, false);
resetButton.addEventListener("click", resetAll, false);
