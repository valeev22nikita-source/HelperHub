document.addEventListener("DOMContentLoaded", function () {

    /* ===== NOTES ===== */
    const noteInput = document.getElementById("note-input");
    const addNoteBtn = document.getElementById("add-note");
    const notesList = document.getElementById("notes-list");
    const progressBar = document.getElementById("progress-bar");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    function saveNotes() {
        localStorage.setItem("notes", JSON.stringify(notes));
        updateProgress();
    }

    function renderNotes() {
        notesList.innerHTML = "";
        notes.forEach((note, index) => {
            const li = document.createElement("li");
            li.textContent = note;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Удалить";
            deleteBtn.className = "delete-btn";
            deleteBtn.addEventListener("click", () => {
                notes.splice(index, 1);
                saveNotes();
                renderNotes();
            });

            li.appendChild(deleteBtn);
            notesList.appendChild(li);
        });
    }

    addNoteBtn.addEventListener("click", function () {
        const value = noteInput.value.trim();
        if (value !== "") {
            notes.push(value);
            noteInput.value = "";
            saveNotes();
            renderNotes();
        }
    });

    function updateProgress() {
        const percent = Math.min(notes.length * 10, 100);
        progressBar.style.width = percent + "%";
    }

    renderNotes();
    updateProgress();

    /* ===== STREAK ===== */
    const streakBtn = document.getElementById("streak-btn");
    streakBtn.addEventListener("click", updateStreak);

    function updateStreak() {
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem("lastVisit");
        let streak = parseInt(localStorage.getItem("streak")) || 0;

        if (!lastVisit) streak = 1;
        else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (today === lastVisit) { }
            else if (yesterday.toDateString() === lastVisit) streak += 1;
            else streak = 1;
        }

        localStorage.setItem("lastVisit", today);
        localStorage.setItem("streak", streak);
        document.getElementById("streak-count").textContent = streak;

        const status = document.getElementById("streak-status");
        if (streak < 3) status.textContent = "Начало пути";
        else if (streak < 7) status.textContent = "На огне 🔥";
        else if (streak < 14) status.textContent = "Непобедим";
        else status.textContent = "Элитная дисциплина";
    }

    updateStreak();

    /* ===== SCHEDULE ===== */
    const scheduleInput = document.getElementById("schedule-input");
    const saveScheduleBtn = document.getElementById("save-schedule");
    const deleteScheduleBtn = document.getElementById("delete-schedule");
    const scheduleDisplay = document.getElementById("schedule-display");

    scheduleInput.value = localStorage.getItem("schedule") || "";
    scheduleDisplay.textContent = scheduleInput.value;

    saveScheduleBtn.addEventListener("click", function () {
        localStorage.setItem("schedule", scheduleInput.value);
        scheduleDisplay.textContent = scheduleInput.value;
    });

    deleteScheduleBtn.addEventListener("click", function () {
        localStorage.removeItem("schedule");
        scheduleInput.value = "";
        scheduleDisplay.textContent = "";
    });

});
