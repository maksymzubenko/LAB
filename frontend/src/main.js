import { getPasses, createPass, deletePass } from "./apiClient.js";
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

loadPasses();