# Система пропусків у комп'ютерний клас 

---

# Запуск

## Backend

### 1. Перейти у папку backend

```bash
cd backend
```

### 2. Встановити залежності

```bash
npm install
```

### 3. Запустити сервер

```bash
npm run dev
```

Сервер працює:

```txt
http://localhost:3000
```

---

## Frontend

### 1. Перейти у папку frontend

```bash
cd frontend
```

### 2. Запустити локальний сервер

```bash
npx http-server -p 5500
```

Frontend працює:

```txt
http://localhost:5500
```

---

# База даних

Використовується SQLite.

Файл бази даних:

```txt
data/lab5.db
```

Схема БД ініціалізується через:

```txt
backend/src/db/schema.sql
```

---

## Таблиці

### users

* id
* name
* email

### passes

* id (**PRIMARY KEY**)
* user
* reason
* date
* comment
* ownerUserId

### pass_logs

* id (**PRIMARY KEY**)
* passId (**FOREIGN KEY → passes.id**)
* action
* createdAt

---

# Архітектура Frontend

## config.js

Містить адресу API:

```js
API_BASE_URL
```

---

## apiClient.js

Робота із backend API:

```js
getPasses()
createPass()
deletePass()
```

---

## ui.js

Функції роботи з інтерфейсом:

```js
readForm()
validate()
render()
renderStatus()
showNotice()
clearErrors()
```

---

## main.js

Містить:

* логіку форми
* обробку подій
* інтеграцію frontend ↔ backend
* оновлення таблиці

---

# API

## Users

### Endpoints

```txt
POST /api/v1/users
GET /api/v1/users/:id
PUT /api/v1/users/:id
DELETE /api/v1/users/:id
```

---

## Passes

### Endpoints

```txt
POST /api/v1/passes
GET /api/v1/passes
GET /api/v1/passes/:id
PUT /api/v1/passes/:id
DELETE /api/v1/passes/:id
```

---

# Реалізовані сценарії безпеки

## Сценарій A — SQL Injection

### Було

Використовувалась конкатенація:

```js
WHERE user='${user}'
```

або:

```js
VALUES ('${user}')
```

### Проблема

Користувач міг змінити SQL-запит через спеціальні символи.

Приклад:

```txt
Максим' OR '1'='1
```

---

### Виправлення

Використано параметризовані запити:

```js
WHERE user=?
```

```js
VALUES (?, ?, ?, ?, ?)
```

---

### Перевірка

Шкідливий ввід більше не впливає на структуру SQL-запиту.

---

## Сценарій Б — XSS

### Було

Використовувався:

```js
innerHTML
```

---

### Проблема

HTML або JavaScript користувача міг виконуватись у браузері.

---

### Виправлення

Використано:

```js
textContent
```

та DOM API:

```js
createElement()
appendChild()
```

---

### Перевірка

HTML-конструкції відображаються як текст.

---

## Сценарій В — Broken Access Control / IDOR

### Було

Будь-який користувач міг змінювати або видаляти чужі записи.

---

### Виправлення

Додано:

```js
X-Demo-UserId
```

та перевірку:

```js
WHERE id=?
AND ownerUserId=?
```

---

### Перевірка

Користувач:

```txt
X-Demo-UserId:1
```

може:

✅ видаляти свої записи

не може:

❌ видаляти чужі записи

---

## Сценарій Г — Security Misconfiguration

### Реалізовано

Безпечні HTTP-заголовки:

```txt
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
```

---

Обмежений CORS:

```txt
http://localhost:5500
http://127.0.0.1:5500
```

---

Є централізована обробка помилок:

```js
{
   code:"INTERNAL_ERROR",
   message:"Internal server error"
}
```

---

# Реалізовані можливості

* CRUD для пропусків
* інтеграція frontend + backend
* fetch API
* SQLite
* клієнтська валідація
* логування дій
* CORS
* безпечні HTTP headers
* SQL параметризація
* XSS захист
* IDOR захист
* централізована обробка помилок
* тестові дані (seed)

---

# Приклади запитів

## Створити пропуск

```bash
curl -X POST http://localhost:3000/api/v1/passes \
-H "Content-Type: application/json" \
-H "X-Demo-UserId: 1" \
-d "{\"user\":\"Ivan\",\"reason\":\"Study\",\"date\":\"2026-03-16\",\"comment\":\"Test\"}"
```

---

## Отримати список

```bash
curl http://localhost:3000/api/v1/passes
```

---

## Отримати один запис

```bash
curl -H "X-Demo-UserId: 1" http://localhost:3000/api/v1/passes/1
```

---

## Видалити запис

```bash
curl -X DELETE \
-H "X-Demo-UserId: 1" \
http://localhost:3000/api/v1/passes/1
```

---

## Seed тестових даних

```txt
http://localhost:3000/seed
```
