# Backend API для системи пропусків

Це backend частина лабораторної роботи №2.  
API написано на Node.js з використанням Express.

## Запуск

1. Встановити залежності

npm install

2. Запустити сервер

npm run dev

Після запуску сервер працює за адресою:

http://localhost:3000

---

## Сутності

### Users
Користувачі системи.

Поля:
- id
- name
- email

### Passes
Пропуски у комп'ютерний клас.

Поля:
- id
- user
- reason
- date
- comment

---

## API

Users:

GET /api/users  
GET /api/users/:id  
POST /api/users  
PUT /api/users/:id  
DELETE /api/users/:id  

Passes:

GET /api/passes  
GET /api/passes/:id  
POST /api/passes  
PUT /api/passes/:id  
DELETE /api/passes/:id  

---

## Приклад запиту

Створення пропуску:

curl -X POST http://localhost:3000/api/passes \
-H "Content-Type: application/json" \
-d '{"user":"Ivan","reason":"Study","date":"2026-03-16","comment":"Test"}'
