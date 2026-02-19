const STORAGE_KEY = "passes";

let items = load();
let nextId = computeNextId(items);

const form = document.getElementById("createForm");
const tbody = document.getElementById("tableBody");
const resetBtn = document.getElementById("resetBtn");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const dto = readForm();
  if (!validate(dto)) return;

  items.push({ id: nextId++, ...dto });

  save();
  render();

  form.reset();
  clearErrors();
});

resetBtn.addEventListener("click", function() {
  form.reset();
  clearErrors();
});

tbody.addEventListener("click", function(e) {
  if (!e.target.dataset.id) return;

  const id = Number(e.target.dataset.id);
  items = items.filter(x => x.id !== id);

  save();
  render();
});

function readForm() {
  return {
    user: document.getElementById("userInput").value.trim(),
    reason: document.getElementById("reasonSelect").value,
    date: document.getElementById("dateInput").value,
    comment: document.getElementById("commentInput").value.trim()
  };
}

function validate(d) {
  clearErrors();
  let ok = true;

  if (d.user.length < 3) {
    show("userInput","userError","Мінімум 3 символи");
    ok = false;
  }

  if (d.reason === "") {
    show("reasonSelect","reasonError","Виберіть статус");
    ok = false;
  }

  if (d.date === "") {
    show("dateInput","dateError","Виберіть дату");
    ok = false;
  }

  if (d.comment.length < 5) {
    show("commentInput","commentError","Мінімум 5 символів");
    ok = false;
  }

  return ok;
}

function render() {
  tbody.innerHTML = items.map(function(x,i){
    return `
      <tr>
        <td>${i+1}</td>
        <td>${x.user}</td>
        <td>${x.reason}</td>
        <td>${x.date}</td>
        <td>${x.comment}</td>
        <td><button data-id="${x.id}">Видалити</button></td>
      </tr>
    `;
  }).join("");
}

function show(inputId,errorId,msg){
  document.getElementById(inputId).classList.add("invalid");
  document.getElementById(errorId).innerHTML = msg;
}

function clearErrors(){
  document.getElementById("userInput").classList.remove("invalid");
  document.getElementById("reasonSelect").classList.remove("invalid");
  document.getElementById("dateInput").classList.remove("invalid");
  document.getElementById("commentInput").classList.remove("invalid");

  document.getElementById("userError").innerHTML="";
  document.getElementById("reasonError").innerHTML="";
  document.getElementById("dateError").innerHTML="";
  document.getElementById("commentError").innerHTML="";
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function load(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }catch{
    return [];
  }
}

function computeNextId(arr){
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}

render();
