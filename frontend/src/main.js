import {
  getPasses,
  createPass,
  deletePass,
  getPassesCount,
  getHealth,
  getPassesWithLogs,
  searchPasses,
  seedData
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

loadPasses();
loadCount();
