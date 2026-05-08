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

  tbody.innerHTML = items.map((x, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${x.user}</td>
      <td>${x.reason}</td>
      <td>${x.date}</td>
      <td>${x.comment}</td>
      <td><button data-id="${x.id}">Видалити</button></td>
    </tr>
  `).join("");
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

export function renderStatus(message) {
  document.getElementById("status").innerHTML = message;
}

export function showNotice(message) {
  document.getElementById("notice").innerHTML = message;

  setTimeout(() => {
    document.getElementById("notice").innerHTML = "";
  }, 3000);
}