function openFeature() {
  let allElems = document.querySelectorAll(".elem");
  let fullElemPage = document.querySelectorAll(".fullElem");
  let fullElemPageBackBtn = document.querySelectorAll(".fullElem .back");

  //querySelectorAll gives a Node just like an array but not exactly

  allElems.forEach((elem) => {
    elem.addEventListener("click", () => {
      fullElemPage[elem.id].style.display = "block";
    });
  });

  fullElemPageBackBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      fullElemPage[btn.id].style.display = "none";
    });
  });
}
openFeature();

///
function todoMechanics() {
  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form input");
  let taskDescription = document.querySelector(".addTask form textarea");
  let taskCheckbox = document.querySelector(".addTask form #check");

  let currentTask = [];

  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    console.log("Task List is Empty");
  }

  let allTaskList = localStorage.getItem("allTaskList");

  function renderTask() {
    let allTask = document.querySelector(".allTask");

    let mess = "";

    currentTask.forEach((elem, idx) => {
      mess += `
          <div class="task">
          <details>
          <summary><p class="${elem.complete}">${elem.task}</p><span class="${elem.imp}">Imp</span></summary>
          <p>${elem.details}</p>
          </details>
          <div class="action-btns">
          <button id="${idx}" class="mark-completed-task"><i class="ri-check-line"></i></button>
          <button id="${idx}" class="edit-task"><i class="ri-pencil-line"></i></button>
          <button id="${idx}" class="delete-task"><i class="ri-close-line"></i></button>
          </div>
          </div>
          `;
    });

    allTask.innerHTML = mess;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    document.querySelectorAll(".task button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        let delBtn = btn.classList.contains("delete-task");
        let editBtn = btn.classList.contains("edit-task");
        let markCompleteBtn = btn.classList.contains("mark-completed-task");
        if (delBtn && btn.id) {
          currentTask.splice(btn.id, 1);
          renderTask();
        } else if (editBtn && btn.id) {
          let editPanel = prompt(`before: ${currentTask[btn.id].task}`);
          if (editPanel === "" || editPanel === null) return;
          currentTask[btn.id].task = editPanel;
          renderTask();
        } else if (markCompleteBtn && btn.id) {
          if (currentTask[btn.id].complete === true) {
            currentTask[btn.id].complete = false;
            renderTask();
            return;
          }
          if (currentTask[btn.id].complete === false) {
            currentTask[btn.id].complete = true;
            renderTask();
            return;
          }
        }
      });
    });
  }

  renderTask();

  form.addEventListener("submit", (e) => {
    e.preventDefault(); //form ke default behavior ko rok diya
    currentTask.push({
      task: taskInput.value,
      details: taskDescription.value,
      imp: taskCheckbox.checked,
      complete: false,
    });
    renderTask();
    taskCheckbox.checked = false;
    taskInput.value = "";
    taskDescription.value = "";
  });

  // document.querySelector(".empty-list-note").style.opacity = 1;
}
todoMechanics();

///
function dailyPlannerMechanics() {
  let dayPlanner = document.querySelector(".day-planner");
  let dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};
  //explanation: agar localStorage me dayPlanData hai to use parse kar ke lelo warna ek empty object lelo.

  let hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`
  );

  // "_" means useme kuch bhi nahi hai

  let clutter = "";

  hours.forEach((hour, idx) => {
    let savedData = dayPlanData[idx] || "";
    clutter += `
    <div class="day-planner-time">
      <h2>${hour}</h2>
      <input id="${idx}" type="text" placeholder="..." value="${savedData}">
    </div>
  `;
  });
  dayPlanner.innerHTML = clutter;

  // ⬇️ NOW inputs exist
  let dayPlannerInput = document.querySelectorAll(".day-planner input"); //ya pe inputs create ho chuke hai isliye hame ise yaha call karna pada.

  dayPlannerInput.forEach((elem) => {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;
      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
      //explanation: jab bhi koi input hoga to us input ka id aur value leke dayPlanData object me store kar do fir ise localStorage me save kar do.
    });
  });
}
dailyPlannerMechanics();

///

function motivationMechanics() {
  let url = "https://quotes-api-self.vercel.app/quote";
  async function rnQuotes() {
    try {
      let response = await fetch(url);
      let data = await response.json();
      document.querySelector(".motivation-two h1").textContent = data.quote;
      document.querySelector(".motivation-two .author").textContent =
        "-" + data.author;
    } catch (error) {
      console.log(error.message);
    }
  }

  rnQuotes();

  document.querySelector(".reload").addEventListener("click", rnQuotes);
}
motivationMechanics();

///

function pomodoroMechanics() {
  let timer = document.querySelector(".pomo-timer .time");
  let actionBtn = document.querySelectorAll(".pomo-timer button");
  let statusNote = document.querySelectorAll(".pomo-timer .status");

  let isWorkSession = true;
  let timerInterval = null;
  let totalSeconds = 25 * 60;

  function updateTime() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  actionBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("start-timer")) {
        // ⛔ already running? do nothing
        if (timerInterval) return;

        timerInterval = setInterval(() => {
          if (totalSeconds > 0) {
            totalSeconds--;
            updateTime();
          } else {
            clearInterval(timerInterval);
            timerInterval = null;
            isWorkSession = !isWorkSession;
            totalSeconds = isWorkSession ? 25 * 60 : 5 * 60;
            updateTime();
          }
        }, 1000); // also fixed your 3ms madness
      } else if (btn.classList.contains("pause-timer")) {
        clearInterval(timerInterval);
        timerInterval = null;
      } else if (btn.classList.contains("reset-timer")) {
        clearInterval(timerInterval);
        timerInterval = null;
        isWorkSession = true;
        totalSeconds = 25 * 60;
        updateTime();
      }
    });
  });

  function updateStatus() {
    statusNote.textContent = isWorkSession ? "Work Session" : "Break Time";
  }

  updateStatus();
}
pomodoroMechanics();

///Dashboard

// const currentTimeString = new Date().toLocaleTimeString();
// console.log(currentTimeString);
// Example output (varies by browser/locale): "11:30:01 AM" or "11:30:01"
function dashboard() {
  async function weatherAPICall() {
    let API_Key = "a44f28b2ca74443c89a155218252910";
    let response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_Key}&q=nanded`
    );
    let data = await response.json();
    document.querySelector(".celcius span").textContent = Math.floor(
      data.current.temp_c
    );
    document.querySelector(".location").textContent =
      data.location.name + ", " + data.location.region;
    document.querySelector(".condition").textContent =
      data.current.condition.text;
  }

  weatherAPICall();

  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function dataDay() {
    let date = new Date();
    document.querySelector(".mmddyyyy").textContent =
      date.getDate() +
      " " +
      months[date.getMonth()] +
      ", " +
      date.getFullYear();
    document.querySelector(".day-time").textContent =
      weekDays[date.getDay()] +
      ", " +
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0") +
      ":" +
      String(date.getSeconds()).padStart(2, "0");
  }

  setInterval(() => {
    dataDay();
  }, 1000);

  let headerImg = document.querySelector("header");

  function slideShow() {
    let hours = new Date().getHours();
    if (hours >= 0 && hours < 6) {
      headerImg.style.backgroundImage = `url("./Images/night.jpg")`;
    } else if (hours >= 6 && hours < 12) {
      headerImg.style.backgroundImage = `url("./Images/morning.jpg")`;
    } else if (hours >= 12 && hours < 18) {
      headerImg.style.backgroundImage = `url("./Images/afternoon.jpg")`;
    } else {
      headerImg.style.backgroundImage = `url("./Images/evening.jpg")`;
    }
  }
  setInterval(slideShow(), 60 * 1000); //checks every minute
}
dashboard();

let rootElement = document.documentElement;
let theme = document.querySelector(".change-theme");
let flag = 0;
theme.addEventListener("click", function () {
  if (flag == 0) {
    rootElement.style.setProperty("--pri", "red");
    rootElement.style.setProperty("--sec", "green");
    rootElement.style.setProperty("--ter", "blue");
    rootElement.style.setProperty("--qua", "yellow");
    flag = 1;
  }else if(flag ==1){
    rootElement.style.setProperty("--pri", "#f5f7f8");
    rootElement.style.setProperty("--sec", "#f4ce14");
    rootElement.style.setProperty("--ter", "#495e57");
    rootElement.style.setProperty("--qua", "#45474b");
    flag = 0;
  }
});
