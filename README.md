Frontend + Backend API для системи пропусків (SQLite)
Запуск
Backend
Перейти у папку backend

cd backend

Встановити залежності

npm install

Запустити сервер

npm run dev

Сервер працює за адресою:

http://localhost:3000

Frontend
Перейти у папку frontend

cd frontend

Запустити локальний сервер

npx http-server -p 5500

Frontend працює за адресою:

http://localhost:5500

База даних

Використовується SQLite.
Файл бази даних створюється автоматично при запуску сервера.

Схема ініціалізується через файл:

schema.sql

Таблиці:

users

id
name
email

passes

id (PRIMARY KEY)
user
reason
date
comment

pass_logs

id (PRIMARY KEY)
passId (FOREIGN KEY → passes.id)
action
createdAt
Архітектура Frontend
Основні файли:

config.js

API_BASE_URL

apiClient.js

getPasses()
getById()
createPass()
updatePass()
deletePass()

ui.js

render()
validate()
renderStatus()
showNotice()

main.js

логіка інтеграції frontend + backend
API
Users

GET /api/v1/users
GET /api/v1/users/:id
POST /api/v1/users
PUT /api/v1/users/:id
DELETE /api/v1/users/:id

Passes

GET /api/v1/passes
GET /api/v1/passes/:id
POST /api/v1/passes
PUT /api/v1/passes/:id
DELETE /api/v1/passes/:id

Додаткові можливості

Фільтрація і сортування:

GET /api/v1/passes?user=Max&sort=date&order=DESC

Пошук (WHERE + ORDER + LIMIT):

GET /api/passes/search?user=Max

JOIN (passes + logs):

GET /api/v1/passes-with-logs

Агрегація (COUNT):

GET /api/v1/passes/count

Seed (тестові дані):

GET /seed

Реалізовано у фронтенді
fetch() інтеграція з API
loading / success / empty / error стани
клієнтська валідація
повідомлення про помилки
створення записів
видалення записів
підтвердження видалення
блокування повторної відправки форми
CORS сумісність
API versioning (/api/v1)
Приклади запитів
Створення пропуску:

curl -X POST http://localhost:3000/api/v1/passes

-H "Content-Type: application/json"
-d '{"user":"Ivan","reason":"Study","date":"2026-03-16","comment":"Test"}'

Отримання списку:

curl http://localhost:3000/api/v1/passes

Отримання одного запису:

curl http://localhost:3000/api/v1/passes/1

Видалення:

curl -X DELETE http://localhost:3000/api/v1/passes/1

Пошук:

curl http://localhost:3000/api/passes/search?user=Ivan

Сценарії перевірки
Успішні:
Завантаження списку
Створення пропуску
Видалення пропуску
Фільтрація
JOIN / COUNT
Неуспішні:
Порожні поля
Некоректні дані
Backend вимкнений
404 / 400 / 500
CORS помилки
