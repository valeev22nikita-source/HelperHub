document.addEventListener("DOMContentLoaded", function () {

    /* ===== SCROLL ANIMATION ===== */
    const sections = document.querySelectorAll("section");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add("visible");
            });
        }, { threshold: 0.15 });
        sections.forEach(section => observer.observe(section));
    } else {
        sections.forEach(section => section.classList.add("visible"));
    }

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
            animateProgress();
        });
    }

    function updateProgress() {
        if (!progressBar) return;
        const percent = Math.min(notes.length * 10, 100);
        progressBar.style.width = percent + "%";
    }

    function animateProgress() {
        if (!progressBar) return;
        progressBar.classList.add("animate");
        setTimeout(() => progressBar.classList.remove("animate"), 800);
    }

    renderNotes();
    updateProgress();

    /* ===== STREAK SYSTEM ===== */
    const streakBtn = document.getElementById("streak-btn");
    const streakCount = document.getElementById("streak-count");
    const streakStatus = document.getElementById("streak-status");

    function loadStreak() {
        const streak = parseInt(localStorage.getItem("streak")) || 0;
        if (streakCount) streakCount.textContent = streak;
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

        if (lastVisit === yesterday.toDateString()) streak += 1;
        else streak = 1;

        localStorage.setItem("lastVisit", today);
        localStorage.setItem("streak", streak);

        if (streakCount) {
            streakCount.textContent = streak;
            streakCount.classList.add("streak-glow");
            setTimeout(() => streakCount.classList.remove("streak-glow"), 800);
        }

        updateStatus(streak);
    }

    if (streakBtn) streakBtn.addEventListener("click", confirmStudyToday);
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

    /* ===== TO-DO LIST ===== */
    const todoInput = document.getElementById("todo-input");
    const addTodoBtn = document.getElementById("add-todo");
    const todoList = document.getElementById("todo-list");
    const todoProgressBar = document.getElementById("todo-progress-bar");
    const todoProgressText = document.getElementById("todo-progress-text");
    const todoCompleteMsg = document.getElementById("todo-complete-message");

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    function saveTodos() {
        localStorage.setItem("todos", JSON.stringify(todos));
        updateTodoProgress();
    }

    function renderTodos() {
        if (!todoList) return;
        todoList.innerHTML = "";

        todos.forEach((task, index) => {
            const li = document.createElement("li");
            const label = document.createElement("label");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", function () {
                task.completed = checkbox.checked;
                saveTodos();
            });

            const span = document.createElement("span");
            span.textContent = task.text;

            label.appendChild(checkbox);
            label.appendChild(span);
            li.appendChild(label);
            todoList.appendChild(li);
        });
    }

    function updateTodoProgress() {
        if (!todoProgressBar || !todoProgressText) return;
        const completed = todos.filter(t => t.completed).length;
        const total = todos.length;
        todoProgressText.textContent = Выполнено: ${completed} из ${total};
        const percent = total ? (completed / total) * 100 : 0;
        todoProgressBar.style.width = percent + "%";

        if (completed === total && total > 0) todoCompleteMsg.classList.add("show");
        else todoCompleteMsg.classList.remove("show");
    }

    if (addTodoBtn && todoInput) {
        addTodoBtn.addEventListener("click", function () {
            const text = todoInput.value.trim();
            if (!text) return;
            todos.push({ text, completed: false });
            todoInput.value = "";
            saveTodos();
            renderTodos();
        });
    }

    renderTodos();
    updateTodoProgress();

});
