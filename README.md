````md
# Frontend + Backend API для системи пропусків (SQLite)

---

# Запуск

## Backend

### 1. Перейти у папку backend

```bash
cd backend
````

### 2. Встановити залежності

```bash
npm install
```

### 3. Запустити сервер

```bash
npm run dev
```

### Сервер працює за адресою:

`http://localhost:3000`

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

### Frontend працює за адресою:

`http://localhost:5500`

---

# База даних

Використовується **SQLite**.
Файл бази даних створюється автоматично при першому запуску сервера (`data/app.db`).

Схема ініціалізується через файл `schema.sql`.

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

### pass_logs

* id (**PRIMARY KEY**)
* passId (**FOREIGN KEY → passes.id**)
* action
* createdAt

---

# Архітектура Frontend

## Основні модулі

### config.js

* API_BASE_URL

### apiClient.js

* getPasses()
* getById()
* createPass()
* updatePass()
* deletePass()

### ui.js

* render()
* validate()
* renderStatus()
* showNotice()

### main.js

* логіка роботи інтерфейсу
* інтеграція frontend + backend

---

# API

## Users

### Доступні endpoints:

* `GET /api/v1/users`
* `GET /api/v1/users/:id`
* `POST /api/v1/users`
* `PUT /api/v1/users/:id`
* `DELETE /api/v1/users/:id`

---

## Passes

### Доступні endpoints:

* `GET /api/v1/passes`
* `GET /api/v1/passes/:id`
* `POST /api/v1/passes`
* `PUT /api/v1/passes/:id`
* `DELETE /api/v1/passes/:id`

---

# Додаткові можливості

## Фільтрація і сортування

`GET /api/v1/passes?user=Max&sort=date&order=DESC`

## Пошук (WHERE + ORDER + LIMIT)

`GET /api/passes/search?user=Max`

## JOIN (passes + logs)

`GET /api/v1/passes-with-logs`

## Агрегація (COUNT)

`GET /api/v1/passes/count`

## Seed (тестові дані)

`GET /seed`

---

# Реалізовано у фронтенді

* fetch() інтеграція з backend API
* loading / success / empty / error стани
* клієнтська валідація форми
* створення пропусків
* видалення пропусків
* автоматичне оновлення таблиці
* повідомлення про помилки
* API_BASE_URL конфігурація
* CORS інтеграція
* версійність API (/api/v1)

---

# Приклади запитів

## Створення пропуску

```bash
curl -X POST http://localhost:3000/api/v1/passes \
-H "Content-Type: application/json" \
-d '{"user":"Ivan","reason":"Study","date":"2026-03-16","comment":"Test"}'
```

## Отримання списку

```bash
curl http://localhost:3000/api/v1/passes
```

## Отримання одного запису

```bash
curl http://localhost:3000/api/v1/passes/1
```

## Видалення

```bash
curl -X DELETE http://localhost:3000/api/v1/passes/1
```


