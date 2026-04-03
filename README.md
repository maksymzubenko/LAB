# Backend API для системи пропусків (SQLite)

## Запуск

1. Встановити залежності

npm install

2. Запустити сервер

npm run dev

Сервер працює за адресою:
http://localhost:3000

---

## База даних

Використовується SQLite.
Файл бази даних створюється автоматично при першому запуску сервера (наприклад: data/app.db).

Схема ініціалізується через файл schema.sql.

### Таблиці:

**users**

* id 
* name

**passes**

* id (PRIMARY KEY)
* user
* reason
* date
* comment

**pass_logs**

* id (PRIMARY KEY)
* passId (FOREIGN KEY → passes.id)
* action
* createdAt


---

## API

### Users

GET /api/users
GET /api/users/:id
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

---

### Passes

GET /api/passes
GET /api/passes/:id
POST /api/passes
PUT /api/passes/:id
DELETE /api/passes/:id

---

### Додаткові можливості

Фільтрація і сортування:

GET /api/passes?user=Max&sort=date&order=DESC

Пошук (WHERE + ORDER + LIMIT):

GET /api/passes/search?user=Max

JOIN (passes + logs):

GET /api/passes-with-logs

Агрегація (COUNT):

GET /api/passes/count

Seed (тестові дані):

GET /seed

---

## Приклади запитів

Створення пропуску:

curl -X POST http://localhost:3000/api/passes 
-H "Content-Type: application/json" 
-d '{"user":"Ivan","reason":"Study","date":"2026-03-16","comment":"Test"}'

Отримання списку:

curl http://localhost:3000/api/passes

Пошук:

curl http://localhost:3000/api/passes/search?user=Ivan

---
