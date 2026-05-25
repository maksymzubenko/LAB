export function readForm() {
  return {
    user: document.getElementById("userInput").value.trim(),
    reason: document.getElementById("reasonSelect").value,
    date: document.getElementById("dateInput").value,
    comment: document.getElementById("commentInput").value.trim()
  };
}

export function validate(d) {
  clearErrors();
  let ok = true;

  if (d.user.length < 3) {
    show("userInput", "userError", "Мінімум 3 символи");
    ok = false;
  }

  if (d.reason === "") {
    show("reasonSelect", "reasonError", "Виберіть статус");
    ok = false;
  }

  if (d.date === "") {
    show("dateInput", "dateError", "Виберіть дату");
    ok = false;
  }

  if (d.comment.length < 5) {
    show("commentInput", "commentError", "Мінімум 5 символів");
    ok = false;
  }

  return ok;
}

export function render(items) {

  const tbody = document.getElementById("tableBody");

  tbody.innerHTML = "";

  items.forEach((x, i) => {

    const row = document.createElement("tr");

    const numberTd = document.createElement("td");
    numberTd.textContent = i + 1;

    const userTd = document.createElement("td");
    userTd.textContent = x.user;

    const reasonTd = document.createElement("td");
    reasonTd.textContent = x.reason;

    const dateTd = document.createElement("td");
    dateTd.textContent = x.date;

    const commentTd = document.createElement("td");
    commentTd.textContent = x.comment;

    const buttonTd = document.createElement("td");

    const button = document.createElement("button");

    button.textContent = "Видалити";

    button.dataset.id = x.id;

    buttonTd.appendChild(button);

    row.appendChild(numberTd);
    row.appendChild(userTd);
    row.appendChild(reasonTd);
    row.appendChild(dateTd);
    row.appendChild(commentTd);
    row.appendChild(buttonTd);

    tbody.appendChild(row);

  });

}

function show(inputId, errorId, msg) {
  document.getElementById(inputId).classList.add("invalid");
  document.getElementById(errorId).innerHTML = msg;
}

export function clearErrors() {
  document.getElementById("userInput").classList.remove("invalid");
  document.getElementById("reasonSelect").classList.remove("invalid");
  document.getElementById("dateInput").classList.remove("invalid");
  document.getElementById("commentInput").classList.remove("invalid");

  document.getElementById("userError").innerHTML = "";
  document.getElementById("reasonError").innerHTML = "";
  document.getElementById("dateError").innerHTML = "";
  document.getElementById("commentError").innerHTML = "";
}

export function renderStatus(message){

const status=document.getElementById("status");

switch(message){

case "loading":
status.textContent="Завантаження...";
break;

case "empty":
status.textContent="Немає записів";
break;

case "error":
status.textContent="Сталася помилка";
break;

default:
status.textContent="";
}

}

export function showNotice(message) {
  document.getElementById("notice").innerHTML = message;

  setTimeout(() => {
    document.getElementById("notice").innerHTML = "";
  }, 3000);
}