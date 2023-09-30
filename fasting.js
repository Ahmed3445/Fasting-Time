// Get the elements from the HTML document
const startBtn = document.getElementById("start-btn");
const endBtn = document.getElementById("end-btn");
const timer = document.getElementById("timer");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const message = document.getElementById("message");
const bmiBtn = document.getElementById("bmi-btn");
const bmiModal = document.getElementById("bmi-modal");
const closeBtn = document.getElementsByClassName("close")[0];
const bmiForm = document.getElementById("bmi-form");
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const calculateBtn = document.getElementById("calculate-btn");
const bmiResult = document.getElementById("bmi-result");

// Declare some variables to store the timer data
let startTime;
let endTime;
let duration;
let interval;

// Define a function to format the time
function formatTime(time) {
  // Pad the time with leading zeros if needed
  return time.toString().padStart(2, "0");
}

// Define a function to update the timer display
function updateTimer() {
  // Calculate the elapsed time in seconds
  let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  // Check if the elapsed time is equal to or greater than the duration
  if (elapsedTime >= duration) {
    // Stop the timer and clear the interval
    stopTimer();
    // Display a message that the fasting is completed
    message.textContent = "You have completed your fasting!";
    // Add the fasting data to the history and display it
    addFastingHistory(startTime, endTime);
    displayFastingHistory();
    // Return from the function
    return;
  }
  // Calculate the remaining time in hours, minutes and seconds
  let remainingTime = duration - elapsedTime;
  let hoursLeft = Math.floor(remainingTime / 3600);
  let minutesLeft = Math.floor((remainingTime % 3600) / 60);
  let secondsLeft = remainingTime % 60;
  // Update the timer display with the formatted time
  hours.textContent = formatTime(hoursLeft);
  minutes.textContent = formatTime(minutesLeft);
  seconds.textContent = formatTime(secondsLeft);
}

// Define a function to start the timer
function startTimer() {
  // Set the start time to the current time
  startTime = Date.now();
  // Set the end time to 16 hours later
  endTime = startTime + duration * 1000;
  // Store the start and end time in the local storage
  localStorage.setItem("startTime", startTime);
  localStorage.setItem("endTime", endTime);
  // Update the timer display
  updateTimer();
  // Set an interval to update the timer every second
  interval = setInterval(updateTimer, 1000);
}

// Define a function to stop the timer
function stopTimer() {
  // Clear the interval and reset the timer display
  clearInterval(interval);
  hours.textContent = "00";
  minutes.textContent = "00";
  seconds.textContent = "00";
  // Remove the start and end time from the local storage
  localStorage.removeItem("startTime");
  localStorage.removeItem("endTime");
}

// Define a function to resume the timer
function resumeTimer() {
// Get the start and end time from the local storage
startTime = parseInt(localStorage.getItem("startTime"));
endTime = parseInt(localStorage.getItem("endTime"));
// Check if the current time is before or after the end time
if (Date.now() < endTime) {
    // Update the timer display and set an interval to update it every second
    updateTimer();
    interval = setInterval(updateTimer, 1000);
    // Display a message that the fasting is resumed and when it will end
    message.textContent =
      "You have resumed your fasting! You will break your fast at " +
      new Date(endTime).toLocaleTimeString();
    return true;
} else {
    // Stop the timer and clear the local storage
    stopTimer();
    localStorage.clear();
    // Display a message that the fasting is completed
    message.textContent =
      "You have completed your fasting! You can start a new one.";
    return false;
}
}

// Define a function to open the BMI modal window
function openBmiModal() {
// Display the modal window by changing its style property
bmiModal.style.display = "block";
}

// Define a function to close the BMI modal window
function closeBmiModal() {
// Hide the modal window by changing its style property
bmiModal.style.display = "none";
}

// Define a function to calculate and display BMI result and progress towards goal
function calculateBmi(e) {
// Prevent the default behavior of form submission
e.preventDefault();
// Get the input values from the form elements
let weight = parseFloat(weightInput.value);
let height = parseFloat(heightInput.value) / 100; // Convert cm to m
let age = parseInt(ageInput.value);
let gender = genderInput.value;
// Check if the input values are valid
if (weight > 0 && height > 0 && age > 0 && gender) {
  // Calculate the BMI value using the formula
  let bmi = weight / (height * height);
  // Round the BMI value to two decimal places
  bmi = bmi.toFixed(2);
  // Declare a variable to store the BMI category
  let category;
  // Assign the category based on the BMI value
  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi < 25) {
    category = "Normal";
  } else if (bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obese";
  }
  // Declare a variable to store the ideal weight range
  let idealWeight;
  // Calculate the ideal weight range based on the height and the normal BMI range
  let lowerWeight = Math.round(18.5 * height * height);
  let upperWeight = Math.round(24.9 * height * height);
  // Assign the ideal weight range as a string
  idealWeight = `${lowerWeight} - ${upperWeight} kg`;
  // Declare a variable to store the weight difference
  let weightDiff;
  // Calculate the weight difference based on the current weight and the ideal weight range
if (weight < lowerWeight) {
    weightDiff = lowerWeight - weight;
    weightDiff = `You need to gain ${weightDiff} kg to reach a normal BMI.`;
} else if (weight > upperWeight) {
    weightDiff = weight - upperWeight;
    weightDiff = `You need to lose ${weightDiff} kg to reach a normal BMI.`;
} else {
    weightDiff = "You are within the normal BMI range.";
}
// Display the BMI result in the paragraph element
bmiResult.textContent = `Your BMI is ${bmi}, which is ${category}. Your ideal weight range is ${idealWeight}. ${weightDiff}`;
// Add the BMI data to the history and display it
addBmiHistory(bmi, category, new Date());
displayBmiHistory();
// Get the BMI goal from the local storage or set it to null if it does not exist
let bmiGoal = localStorage.getItem("bmiGoal") || null;
// Check if there is a BMI goal or not
if (bmiGoal) {
    // Display the progress towards the goal in a progress bar element
    displayBmiProgress(bmi, bmiGoal);
} else {
    // Ask the user to set a goal in an input element
    askBmiGoal();
}
} else {
// Display an error message if the input values are invalid
bmiResult.textContent = "Please enter valid values.";
}
}

// Define a function to add a BMI data to the history array and store it in the local storage
function addBmiHistory(bmi, category, date) {
// Get the history array from the local storage or create an empty array if it does not exist
let history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
// Create an object to store the BMI data with bmi, category and date properties
let bmiData = { bmi, category, date };
// Push the BMI data object to the history array
history.push(bmiData);
// Store the history array in the local storage as a JSON string
localStorage.setItem("bmiHistory", JSON.stringify(history));
}

// Define a function to display the BMI history in a table element
function displayBmiHistory() {
// Get the history array from the local storage or create an empty array if it does not exist
let history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
// Get or create a table element to display the history data
let table =
document.getElementById("bmi-history-table") ||
document.createElement("table");
// Set an id attribute to the table element
table.id = "bmi-history-table";
// Clear any previous content in the table element
table.innerHTML = "";
// Check if the history array is empty or not
if (history.length > 0) {
    // Create a table header row with three cells for date, bmi and category
    let headerRow = document.createElement("tr");
    let dateHeader = document.createElement("th");
    let bmiHeader = document.createElement("th");
    let categoryHeader = document.createElement("th");
    dateHeader.textContent = "Date";
    bmiHeader.textContent = "BMI";
    categoryHeader.textContent = "Category";
    headerRow.appendChild(dateHeader);
    headerRow.appendChild(bmiHeader);
    headerRow.appendChild(categoryHeader);
        // Append the header row to the table element
        table.appendChild(headerRow);
        // Loop through each BMI data object in the history array
    for (let bmiData of history) {
          // Create a table data row with three cells for date, bmi and category
          let dataRow = document.createElement("tr");
          let dateCell = document.createElement("td");
          let bmiCell = document.createElement("td");
          let categoryCell = document.createElement("td");
          // Format the date as a string using locale options
          let date = new Date(bmiData.date).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          // Set the text content of the cells to the BMI data
          dateCell.textContent = date;
          bmiCell.textContent = bmiData.bmi;
          categoryCell.textContent = bmiData.category;
          // Append the cells to the data row
          dataRow.appendChild(dateCell);
          dataRow.appendChild(bmiCell);
          dataRow.appendChild(categoryCell);
          // Append the data row to the table element
          table.appendChild(dataRow);
        }
      } else {
        // Create a paragraph element to display a message that there is no history data
        let noData = document.createElement("p");
        noData.textContent = "You have no BMI history yet.";
        // Append the paragraph element to the table element
        table.appendChild(noData);
      }
      // Append the table element to the body element
      document.body.appendChild(table);
    }
    
    // Define a function to display the progress towards the BMI goal in a progress bar element
    function displayBmiProgress(bmi, goal) {
    // Get or create a progress bar element to display the progress
    let progressBar =
    document.getElementById("bmi-progress-bar") ||
    document.createElement("progress");
    // Set an id attribute to the progress bar element
    progressBar.id = "bmi-progress-bar";
    // Set the max attribute of the progress bar to 100
    progressBar.max = 100;
    // Calculate the percentage of progress based on the current BMI and the goal BMI
    let progress = ((goal - bmi) / (goal - 18.5)) * 100;
    // Round the progress to two decimal places
    progress = progress.toFixed(2);
    // Set the value attribute of the progress bar to the progress percentage
    progressBar.value = progress;
    // Display the progress percentage in a span element next to the progress bar
    let progressSpan =
    document.getElementById("bmi-progress-span") ||
    document.createElement("span");
    // Set an id attribute to the span element
    progressSpan.id = "bmi-progress-span";
    // Set the text content of the span element to the progress percentage with a % sign
    progressSpan.textContent = `${progress}%`;
    // Append the progress bar and the span element to the body element
    document.body.appendChild(progressBar);
    document.body.appendChild(progressSpan);
    }
    
    // Define a function to ask the user to set a BMI goal in an input element
    function askBmiGoal() {
    // Create an input element to get the BMI goal from the user
    let input = document.createElement("input");
    // Set some attributes to the input element such as id, type, placeholder and min
    input.id = "bmi-goal-input";
    input.type = "number";
    input.placeholder = "Enter your BMI goal";
    input.min = 18.5;
    // Create a button element to submit the BMI goal from the user
    let button = document.createElement("button");
    // Set some attributes and text content to the button element such as id, type and innerHTML
    button.id = "bmi-goal-button";
    button.type = "button";
    button.innerHTML = "Set Goal";
    // Add an event listener to the button element to store and display the BMI goal when clicked
    button.addEventListener("click", function () {
      // Get the input value from the input element and parse it as a float
      let inputVal = parseFloat(input.value);
      // Check if the input value is valid and within range
      if (inputVal >= 18.5 && inputVal <= 24.9) {
        // Store the input value in the local storage as a string with a key of bmiGoal
        localStorage.setItem("bmiGoal", inputVal.toString());
        // Display a message that the goal is set in a paragraph element below the button element
        let message =
          document.getElementById("bmi-goal-message") ||
          document.createElement("p");
        message.id = "bmi-goal-message";
        message.textContent = `Your BMI goal is set to ${inputVal}.`;
        button.parentNode.insertBefore(message, button.nextSibling);
        // Display the progress towards the goal in a progress bar element below the message element
        displayBmiProgress(bmi, inputVal);
      } else {
        // Display an error message that the input value is invalid or out of range in a paragraph element below the button element
        let error =
          document.getElementById("bmi-goal-error") ||
          document.createElement("p");
        error.id = "bmi-goal-error";
        error.textContent =
          "Please enter a valid BMI goal between 18.5 and 24.9.";
        button.parentNode.insertBefore(error, button.nextSibling);
      }
    });
    // Append the input element and the button element to the body element
    document.body.appendChild(input);
    document.body.appendChild(button);
    }
    
    // Set the duration of fasting to 16 hours in seconds
    duration = 16 * 3600;
    
    // Check if there is any previous timer data in the local storage
    if (localStorage.getItem("startTime") && localStorage.getItem("endTime")) {
    // Resume the timer with the previous data
    resumeTimer();
    } else {
    // Display a message that there is no fasting in progress
    message.textContent = "You have not started fasting yet.";
    }
    
    // Add an event listener to the start button to start the timer
    startBtn.addEventListener("click", function () {
    // Check if there is any previous timer data in the local storage
    if (localStorage.getItem("startTime") && localStorage.getItem("endTime")) {
      // Display a message that there is already a fasting in progress
    message.textContent =
        "You have already started fasting. You can end it or wait until it finishes.";
    } else {
    // Start a new timer and display a message and when it will end
    startTimer();
    message.textContent =
        "You have started your fasting! You will break your fast at " +
        new Date(endTime).toLocaleTimeString();
    }
    });
    
    // Add an event listener to the end button to stop the timer
    endBtn.addEventListener("click", function () {
    // Check if there is any previous timer data in the local storage
    if (localStorage.getItem("startTime") && localStorage.getItem("endTime")) {
    // Stop the timer and display a message
    stopTimer();
    message.textContent =
        "You have ended your fasting. You can start a new one.";
    } else {
    // Display a message that there is no fasting in progress
    message.textContent = "You have not started fasting yet.";
    }
    });
    // Define a function to display the fasting history in a table element
function displayFastingHistory() {
  // Get the history array from the local storage or create an empty array if it does not exist
  let history = JSON.parse(localStorage.getItem("history")) || [];
  // Get or create a table element to display the history data
  let table = document.getElementById("history-table") || document.createElement("table");
  // Set an id attribute to the table element
  table.id = "history-table";
  // Clear any previous content in the table element
  table.innerHTML = "";
  // Check if the history array is empty or not
  if (history.length > 0) {
      // Create a table header row with two cells for start and end dates
      let headerRow = document.createElement("tr");
      let startHeader = document.createElement("th");
      let endHeader = document.createElement("th");
      startHeader.textContent = "Start Date";
      endHeader.textContent = "End Date";
      headerRow.appendChild(startHeader);
      headerRow.appendChild(endHeader);
      // Append the header row to the table element
      table.appendChild(headerRow);
      // Loop through each fasting data object in the history array
      for (let fastingData of history) {
        // Create a table data row with two cells for start and end dates
        let dataRow = document.createElement("tr");
        let startCell = document.createElement("td");
        let endCell = document.createElement("td");
        // Format the start and end dates as strings using locale options
        let startDate = new Date(fastingData.start).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        let endDate = new Date(fastingData.end).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        // Set the text content of the cells to the formatted dates
        startCell.textContent = startDate;
        endCell.textContent = endDate;
        // Append the cells to the data row
        dataRow.appendChild(startCell);
        dataRow.appendChild(endCell);
        // Append the data row to the table element
        table.appendChild(dataRow);
      }
    } else {
      // Create a paragraph element to display a message that there is no history data
      let noData = document.createElement("p");
      noData.textContent = "You have no fasting history yet.";
      // Append the paragraph element to the table element
      table.appendChild(noData);
    }
    // Append the table element to the body element
    document.body.appendChild(table);
  }
  
    
    // Add an event listener to the BMI button to open the BMI modal window
    bmiBtn.addEventListener("click", openBmiModal);
    
    // Add an event listener to the close button to close the BMI modal window
    closeBtn.addEventListener("click", closeBmiModal);
    
    // Add an event listener to the window to close the BMI modal window when clicked outside of it
    window.addEventListener("click", function (e) {
    if (e.target == bmiModal) {
    closeBmiModal();
    }
    });
    
    // Add an event listener to the calculate button to calculate and display BMI result and progress towards goal
    calculateBtn.addEventListener("click", calculateBmi);
    
    // Display the fasting history when the page loads
    displayFastingHistory();
    
    // Display the BMI history when the page loads
    displayBmiHistory();
    