document.addEventListener("DOMContentLoaded", function () {

    /* ===== SCROLL ANIMATION ===== */
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.15 });
    sections.forEach(section => observer.observe(section));

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
            li.classList.add("note-item");

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "✕";
            deleteBtn.className = "delete-note";
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
            animateProgress();
            updateStreak();
        }
    });

    function updateProgress() {
        const percent = Math.min(notes.length * 10, 100);
        progressBar.style.width = percent + "%";
    }

    function animateProgress() {
        progressBar.classList.add("animate");
        setTimeout(() => progressBar.classList.remove("animate"), 800);
    }

    renderNotes();
    updateProgress();

    /* ===== STREAK SYSTEM ===== */
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
            else if (yesterday.toDateString() === lastVisit) {
                streak += 1;
                document.getElementById("streak-count").classList.add("streak-glow");
                setTimeout(() => document.getElementById("streak-count").classList.remove("streak-glow"), 1000);
            } else streak = 1;
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

    /* ===== CALENDAR ===== */
    const calendarInput = document.getElementById("calendar-input");
    const savedDate = localStorage.getItem("selectedDate");
    if (savedDate) calendarInput.value = savedDate;

    calendarInput.addEventListener("change", () => {
        localStorage.setItem("selectedDate", calendarInput.value);
    });

});
