document.addEventListener("DOMContentLoaded", () => {

/* ===== TODOS ===== */
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("todo-add-btn");
const list = document.getElementById("todo-list");
const progressText = document.getElementById("todo-progress-text");
const progressBar = document.getElementById("todo-progress-bar");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function save(){
localStorage.setItem("todos", JSON.stringify(todos));
render();
}

function render(){
list.innerHTML="";

todos.forEach((t,i)=>{
const li=document.createElement("li");

const cb=document.createElement("input");
cb.type="checkbox";
cb.checked=t.done;

cb.onchange=()=>{
todos[i].done=cb.checked;
save();
};

li.append(cb, document.createTextNode(t.text));
list.append(li);
});

const done=todos.filter(t=>t.done).length;
progressText.textContent=`Выполнено: ${done} из ${todos.length}`;
progressBar.style.width=(todos.length?done/todos.length*100:0)+"%";
}

addBtn.onclick=()=>{
const v=input.value.trim();
if(!v) return;
todos.push({text:v,done:false});
input.value="";
save();
};

render();

/* ===== NOTES ===== */
const nInput=document.getElementById("note-input");
const nBtn=document.getElementById("add-note");
const nList=document.getElementById("notes-list");
const nBar=document.getElementById("progress-bar");

let notes=JSON.parse(localStorage.getItem("notes"))||[];

function saveNotes(){
localStorage.setItem("notes",JSON.stringify(notes));
drawNotes();
}

function drawNotes(){
nList.innerHTML="";
notes.forEach((n,i)=>{
const li=document.createElement("li");
li.textContent=n;

li.onclick=()=>{
notes.splice(i,1);
saveNotes();
};

nList.append(li);
});

nBar.style.width=Math.min(notes.length*10,100)+"%";
}

nBtn.onclick=()=>{
const v=nInput.value.trim();
if(!v) return;
notes.push(v);
nInput.value="";
saveNotes();
};

drawNotes();

/* ===== STREAK ===== */
const streakBtn=document.getElementById("streak-btn");
const streakCount=document.getElementById("streak-count");

let streak=parseInt(localStorage.getItem("streak"))||0;
streakCount.textContent=streak;

streakBtn.onclick=()=>{
streak++;
localStorage.setItem("streak",streak);
streakCount.textContent=streak;
};

});
