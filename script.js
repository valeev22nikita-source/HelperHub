document.addEventListener("DOMContentLoaded", function () {

    /* ===== SCROLL ANIMATION ===== */
    const sections = document.querySelectorAll("section");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.15 });

        sections.forEach(section => observer.observe(section));
    }


    /* ===== NOTES ===== */
    const noteInput = document.getElementById("note-input");
    const addNoteBtn = document.getElementById("add-note");
    const notesList = document.getElementById("notes-list");
    const notesProgressBar = document.getElementById("progress-bar");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    function saveNotes() {
        localStorage.setItem("notes", JSON.stringify(notes));
        updateNotesProgress();
    }

    function renderNotes() {
        if (!notesList) return;

        notesList.innerHTML = "";

        notes.forEach((note, index) => {
            const li = document.createElement("li");
            li.classList.add("note-item");

            const text = document.createElement("span");
            text.textContent = note;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "✕";
            deleteBtn.className = "delete-note";

            deleteBtn.addEventListener("click", function () {
                notes.splice(index, 1);
                saveNotes();
                renderNotes();
            });

            li.appendChild(text);
            li.appendChild(deleteBtn);
            notesList.appendChild(li);
        });
    }

    if (addNoteBtn && noteInput) {
        addNoteBtn.addEventListener("click", function () {
            const value = noteInput.value.trim();
            if (!value) return;

            notes.push(value);
            noteInput.value = "";
            saveNotes();
            renderNotes();
            animateNotesProgress();
        });
    }

    function updateNotesProgress() {
        if (!notesProgressBar) return;
        const percent = Math.min(notes.length * 10, 100);
        notesProgressBar.style.width = percent + "%";
    }

    function animateNotesProgress() {
        if (!notesProgressBar) return;
        notesProgressBar.classList.add("animate");
        setTimeout(() => {
            notesProgressBar.classList.remove("animate");
        }, 800);
    }

    renderNotes();
    updateNotesProgress();


    /* ===== STREAK SYSTEM ===== */
    const streakBtn = document.getElementById("streak-btn");
    const streakCount = document.getElementById("streak-count");
    const streakStatus = document.getElementById("streak-status");

    function loadStreak() {
        if (!streakCount) return;
        const streak = parseInt(localStorage.getItem("streak")) || 0;
        streakCount.textContent = streak;
        updateStatus(streak);
    }

    function updateStatus(streak) {
        if (!streakStatus) return;

        if (streak < 3) streakStatus.textContent = "Начало пути";
        else if (streak < 7) streakStatus.textContent = "На огне 🔥";
        else if (streak < 14) streakStatus.textContent = "Непобедим";
        else streakStatus.textContent = "Элитная дисциплина";
    }

    function confirmStudyToday() {
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem("lastVisit");
        let streak = parseInt(localStorage.getItem("streak")) || 0;

        if (lastVisit === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastVisit === yesterday.toDateString()) {
            streak += 1;
        } else {
            streak = 1;
        }

        localStorage.setItem("lastVisit", today);
        localStorage.setItem("streak", streak);

        if (streakCount) {
            streakCount.textContent = streak;
          streakCount.classList.add("streak-glow");
            setTimeout(() => {
                streakCount.classList.remove("streak-glow");
            }, 800);
        }

        updateStatus(streak);
    }

    if (streakBtn) {
        streakBtn.addEventListener("click", confirmStudyToday);
    }

    loadStreak();


    /* ===== CALENDAR ===== */
    const calendarInput = document.getElementById("calendar-input");

    if (calendarInput) {
        const savedDate = localStorage.getItem("selectedDate");
        if (savedDate) calendarInput.value = savedDate;

        calendarInput.addEventListener("change", function () {
            localStorage.setItem("selectedDate", calendarInput.value);
        });
    }


    /* ===== TODO PROGRESS SYSTEM ===== */
    const todoSection = document.getElementById("todo-section");

    if (todoSection) {
        const checkboxes = todoSection.querySelectorAll("input[type='checkbox']");
        const todoProgressBar = document.getElementById("todo-progress-bar");
        const todoProgressText = document.getElementById("todo-progress-text");
        const completeMessage = document.getElementById("todo-complete-message");

        function updateTodoProgress() {
            const total = checkboxes.length;
            const checked = todoSection.querySelectorAll("input[type='checkbox']:checked").length;

            const percent = total > 0 ? (checked / total) * 100 : 0;

            if (todoProgressBar) {
                todoProgressBar.style.width = percent + "%";
                todoProgressBar.classList.toggle("full", checked === total && total > 0);
            }

            if (todoProgressText) {
                todoProgressText.textContent = Выполнено: ${checked} из ${total};
            }

            if (completeMessage) {
                completeMessage.classList.toggle("show", checked === total && total > 0);
            }

            if (checked === total && total > 0) {
                launchConfetti();
            }
        }

        function launchConfetti() {
            for (let i = 0; i < 15; i++) {
                const confetti = document.createElement("div");
                confetti.classList.add("confetti");
                confetti.style.left = Math.random() * 100 + "%";
                confetti.style.top = "0px";
                todoSection.appendChild(confetti);

                setTimeout(() => confetti.remove(), 800);
            }
        }

        checkboxes.forEach(cb => {
            cb.addEventListener("change", function () {
                const li = this.closest("li");
                if (li) li.classList.toggle("completed", this.checked);
                updateTodoProgress();
            });
        });

        updateTodoProgress();
    }

});
