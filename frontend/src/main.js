import {
  getPasses,
  createPass,
  deletePass,
  getPassesCount,
  getHealth,
  getPassesWithLogs,
  searchPasses,
  seedData,
  getPassById,
  updatePass,
  createUser,
  getUser,
  getTopUsers
} from "./apiClient.js";

import { API_BASE_URL } from "./config.js";
import {
  readForm,
  validate,
  render,
  clearErrors,
  renderStatus,
  showNotice
} from "./ui.js";

let items = [];

const form = document.getElementById("createForm");
const tbody = document.getElementById("tableBody");
const resetBtn = document.getElementById("resetBtn");

function setActiveButton(buttonId) {

  document
    .querySelectorAll(".api-btn")
    .forEach(btn => btn.classList.remove("active"));

  document
    .getElementById(buttonId)
    .classList.add("active");

}

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  const dto = readForm();

  if (!validate(dto)) {
    submitBtn.disabled = false;
    return;
  }

  try {
    renderStatus("loading");

    await createPass(dto);

    form.reset();
    clearErrors();

    showNotice("Пропуск створено");

    await loadPasses();
    await loadCount();
  } catch (err) {
    console.error(err);
    showNotice("Помилка створення пропуску");
  } finally {
    submitBtn.disabled = false;
  }
});

resetBtn.addEventListener("click", function() {
  form.reset();
  clearErrors();
});

tbody.addEventListener("click", async function(e) {
  if (!e.target.dataset.id) return;

  if (!confirm("Видалити пропуск?")) return;

  const id = e.target.dataset.id;

  try {
    await deletePass(id);
    showNotice("Пропуск видалено");
    await loadPasses();
    await loadCount();
  } catch (err) {
    console.error(err);
    showNotice("Помилка видалення");
  }
});

async function loadPasses() {
  try {
    renderStatus("loading");

    items = await getPasses();

    if (!items.length) {
      render([]);
      renderStatus("empty");
      return;
    }

    render(items);
    renderStatus("success");
  } catch (err) {
    console.error(err);
    render([]);
    renderStatus("error");
    showNotice("Помилка завантаження");
  }
}

async function loadCount() {

  try {

    const data = await getPassesCount();

    console.log(data);

    document.getElementById("passesCount").textContent =
      `Всього пропусків: ${data.total}`;

  } catch (err) {

    console.error(err);

  }

}

const apiOutput = document.getElementById("apiOutput");

document
  .getElementById("healthBtn")
  .addEventListener("click", async () => {

    setActiveButton("healthBtn");

    const data = await getHealth();

    apiOutput.textContent =
       data.ok
    ? "Сервер працює"
    : "Сервер недоступний";

});

document
  .getElementById("countBtn")
  .addEventListener("click", async () => {

    setActiveButton("countBtn");

    const data = await getPassesCount();

    apiOutput.textContent =
      `Кількість пропусків: ${data.total}`;

});

document
  .getElementById("logsBtn")
  .addEventListener("click", async () => {

    setActiveButton("logsBtn");

    const data = await getPassesWithLogs();

    apiOutput.innerHTML = data.map((item, index) =>`
      <b>Запис №${index + 1}

      Ім'я: ${item.user}
      Статус: ${item.reason}
      Дата: ${item.date}
      Примітка: ${item.comment}
      ----------------------`
          ).join("\n");

});

document
  .getElementById("searchBtn")
  .addEventListener("click", async () => {

    setActiveButton("searchBtn");

    const name =
      document.getElementById("searchInput").value.trim();

    if (!name) {
      alert("Введіть ім'я");
      return;
    }

    const data =
      await searchPasses(name);

    apiOutput.textContent =
      `Знайдено пропусків: ${data.length}`;

});

document
  .getElementById("seedBtn")
  .addEventListener("click", async () => {
    
    setActiveButton("seedBtn");

    const data = await seedData();

    apiOutput.textContent =
      "Тестові дані успішно додані";

});

document
  .getElementById("passByIdBtn")
  .addEventListener("click", async () => {

    setActiveButton("passByIdBtn");

    const id =
  document.getElementById("passIdInput").value;

if (!id) {
  apiOutput.textContent =
    "Введіть ID пропуску";
  return;
}

const data = await getPassById(id);

apiOutput.innerHTML = `
<div class="api-card">

<h3>Пропуск</h3>

<p><b>ID:</b> ${data.id}</p>
<p><b>Ім'я:</b> ${data.user}</p>
<p><b>Статус:</b> ${data.reason}</p>
<p><b>Дата:</b> ${data.date}</p>
<p><b>Примітка:</b> ${data.comment}</p>

</div>
`;

    apiOutput.innerHTML = `
      <div class="api-card">
        <b>ID:</b> ${data.id}<br>
        <b>Ім'я:</b> ${data.user}<br>
        <b>Статус:</b> ${data.reason}<br>
        <b>Дата:</b> ${data.date}<br>
        <b>Примітка:</b> ${data.comment}
      </div>
    `;

});

document
  .getElementById("updatePassBtn")
  .addEventListener("click", async () => {

    setActiveButton("updatePassBtn");

    const id =
  document.getElementById("passIdInput").value;

if (!id) {
  apiOutput.textContent =
    "Введіть ID пропуску";
  return;
}

await updatePass(id);

apiOutput.innerHTML = `
<div class="api-card success">
Пропуск №${id} успішно оновлено
</div>
`;

await loadPasses();

    apiOutput.textContent =
      "Пропуск №1 успішно оновлено";

    await loadPasses();

});

document
  .getElementById("createUserBtn")
  .addEventListener("click", async () => {

    setActiveButton("createUserBtn");

    const data = await createUser();

    apiOutput.innerHTML = `
<div class="api-card success">

<h3>Користувача створено</h3>

<p><b>ID:</b> ${data.id}</p>
<p><b>Ім'я:</b> ${data.name}</p>
<p><b>Email:</b> ${data.email}</p>

</div>
`;

});

document
  .getElementById("getUserBtn")
  .addEventListener("click", async () => {

    setActiveButton("getUserBtn");

    const id =
  document.getElementById("userIdInput").value;

if (!id) {
  apiOutput.textContent =
    "Введіть ID користувача";
  return;
}

const data = await getUser(id);

apiOutput.innerHTML = `
<div class="api-card">
<h3>Користувач</h3>

<p><b>ID:</b> ${data.id}</p>
<p><b>Ім'я:</b> ${data.name}</p>
<p><b>Email:</b> ${data.email}</p>

</div>
`;

    apiOutput.innerHTML = `
      <div class="api-card">
        <b>ID:</b> ${data.id}<br>
        <b>Ім'я:</b> ${data.name}<br>
        <b>Email:</b> ${data.email}
      </div>
    `;

});

document
  .getElementById("topUsersBtn")
  .addEventListener("click", async () => {

    setActiveButton("topUsersBtn");

    const data = await getTopUsers();

    apiOutput.innerHTML = `
      <div class="api-card">

        ${data.map((item, index) => `
          <div class="top-user">
            <b>${index + 1} місце</b>
            Ім'я: ${item.user}
            Пропусків: ${item.total}
          </div>
        `).join("")}
      </div>
    `;

});

loadPasses();
loadCount();
