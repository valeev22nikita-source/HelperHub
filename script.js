document.addEventListener("DOMContentLoaded", function () {

    /* ===== TO-DO ===== */
    const todoInput = document.getElementById("todo-input");
    const todoAddBtn = document.getElementById("todo-add-btn");
    const todoList = document.querySelector("#todo-section .todo-list");
    const todoProgressText = document.getElementById("todo-progress-text");
    const todoProgressBar = document.getElementById("todo-progress-bar");
    const todoCompleteMessage = document.getElementById("todo-complete-message");

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    function saveTodos() {
        localStorage.setItem("todos", JSON.stringify(todos));
        updateTodoProgress();
    }

    function renderTodos() {
        todoList.innerHTML = "";
        todos.forEach((todo, index) => {
            const li = document.createElement("li");
            li.classList.toggle("completed", todo.completed);

            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.completed;

            checkbox.addEventListener("change", () => {
                todos[index].completed = checkbox.checked;
                li.classList.toggle("completed", checkbox.checked);
                saveTodos();
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(todo.text));
            li.appendChild(label);
            todoList.appendChild(li);
        });
    }

    function updateTodoProgress() {
        const completed = todos.filter(t => t.completed).length;
        const total = todos.length || 1;
        todoProgressText.textContent = `Выполнено: ${completed} из ${todos.length}`;
        const percent = (completed / total) * 100;
        todoProgressBar.style.width = percent + "%";

        if (completed === todos.length && todos.length > 0) {
            todoCompleteMessage.classList.add("show");
            setTimeout(() => todoCompleteMessage.classList.remove("show"), 1500);
        }
    }

    todoAddBtn.addEventListener("click", () => {
        const text = todoInput.value.trim();
        if (!text) return;
        todos.push({ text, completed: false });
        todoInput.value = "";
        saveTodos();
        renderTodos();
    });

    renderTodos();
    updateTodoProgress();

    /* ===== NOTES ===== */
    const noteInput = document.getElementById("note-input");
    const addNoteBtn = document.getElementById("add-note");
    const notesList = document.getElementById("notes-list");
    const progressBar = document.getElementById("progress-bar");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    function saveNotes() {
        localStorage.setItem("notes", JSON.stringify(notes));
        updateNotesProgress();
    }

    function renderNotes() {
        notesList.innerHTML = "";
        notes.forEach((note, index) => {
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.textContent = note;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "✕";
            deleteBtn.className = "delete-note";
            deleteBtn.addEventListener("click", () => {
                notes.splice(index, 1);
                saveNotes();
                renderNotes();
            });

            li.appendChild(span);
            li.appendChild(deleteBtn);
            notesList.appendChild(li);
        });
    }

    addNoteBtn.addEventListener("click", () => {
        const value = noteInput.value.trim();
        if (!value) return;
        notes.push(value);
        noteInput.value = "";
        saveNotes();
        renderNotes();
    });

    function updateNotesProgress() {
        const percent = Math.min(notes.length * 10, 100);
        progressBar.style.width = percent + "%";
    }

    renderNotes();
    updateNotesProgress();

    /* ===== STREAK ===== */
    const streakBtn = document.getElementById("streak-btn");
    const streakCount = document.getElementById("streak-count");
    const streakStatus = document.getElementById("streak-status");

    function loadStreak() {
        let streak = parseInt(localStorage.getItem("streak")) || 0;
        streakCount.textContent = streak;
        updateStatus(streak);
    }

    function updateStatus(streak) {
        if (streak < 3) streakStatus.textContent = "Начало пути";
        else if (streak < 7) streakStatus.textContent = "На огне 🔥";
        else if (streak < 14) streakStatus.textContent = "Непобедим";
        else streakStatus.textContent = "Элитная дисциплина";
    }

    streakBtn.addEventListener("click", () => {
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

        streakCount.textContent = streak;
        streakCount.classList.add("streak-glow");
        setTimeout(() => streakCount.classList.remove("streak-glow"), 800);

        updateStatus(streak);
    });

    loadStreak();

    /* ===== CALENDAR ===== */
    const calendarInput = document.getElementById("calendar-input");
    const savedDate = localStorage.getItem("selectedDate");
    if (savedDate) calendarInput.value = savedDate;
    calendarInput.addEventListener("change", () => {
        localStorage.setItem("selectedDate", calendarInput.value);
    });

});
