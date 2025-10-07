# Voting System Backend - Документация

Бэкенд для системы голосования за идеи развития продукта LogicLike. Реализовано в рамках тестового задания.

## Описание проекта

Система позволяет пользователям просматривать список идей для развития продукта и голосовать за понравившиеся. Для предотвращения накруток реализовано ограничение: **с одного IP-адреса можно проголосовать максимум за 10 разных идей**.

### Основные возможности:

- Просмотр списка идей с количеством голосов
- Голосование за идеи (с ограничением до 10 голосов на IP)
- Защита от повторного голосования за одну идею
- Корректная обработка прокси (X-Forwarded-For, Cloudflare, Nginx)
- Обновление счетчиков в реальном времени через WebSocket
- Транзакционная безопасность операций

---

## Технологический стек

### Backend
- **Node.js**
- **TypeScript**
- **Express.js**
- **Sequelize**
- **PostgreSQL** 
- **Socket.IO**

### Дополнительные библиотеки
- **axios** - для определения публичного IP
- **cors** - для настройки CORS политики
- **dotenv** - управление переменными окружения
- **sequelize-cli** - миграции и seed-скрипты

### Dev Dependencies
- **ts-node-dev**
- **@types/**

---

## Установка и запуск

### Предварительные требования

- **Node.js** версии 18 или выше
- **PostgreSQL** версии 12 или выше
- **npm** или **yarn**

### Шаг 1: Клонирование репозитория

```bash
git clone <repository-url>
cd back
```

### Шаг 2: Установка зависимостей

```bash
npm install
```

### Шаг 3: Настройка базы данных

Создайте базу данных PostgreSQL:

```bash
createdb voting_system
```

Или через psql:

```sql
CREATE DATABASE voting_system;
```

### Шаг 4: Конфигурация

Отредактируйте файл `config/config.json` под ваши настройки PostgreSQL:

```json
{
  "development": {
    "username": "postgres",
    "password": "ваш_пароль",
    "database": "voting_system",
    "host": "localhost",
    "port": 5432,
    "dialect": "postgres",
    "logging": false
  }
}
```

Создайте файл `.env` (опционально):

```env
PORT=4000
NODE_ENV=development
```

### Шаг 5: Запуск миграций и seed-скриптов

```bash
# Применить миграции (создание таблиц)
npm run db:migrate

# Заполнить БД тестовыми данными
npm run db:seed
```

### Шаг 6: Запуск сервера

**Режим разработки** (с hot reload):

```bash
npm run dev
```

**Production режим**:

```bash
# Сборка проекта
npm run build

# Запуск скомпилированного кода
npm start
```

Сервер запустится на `http://localhost:4000`

### Доступные скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки с hot reload |
| `npm run build` | Компиляция TypeScript в JavaScript |
| `npm start` | Запуск production версии |
| `npm run db:migrate` | Применить миграции БД |
| `npm run db:migrate:undo` | Откатить последнюю миграцию |
| `npm run db:seed` | Заполнить БД seed-данными |
| `npm run db:seed:undo` | Очистить seed-данные |
| `npm run db:reset` | Полный сброс БД (откат всех миграций + миграции + seed) |

---

## Структура базы данных

### Таблица Ideas

Хранит информацию об идеях для голосования.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER | Первичный ключ (auto-increment) |
| `title` | STRING | Название идеи |
| `description` | TEXT | Подробное описание |
| `createdAt` | TIMESTAMP | Дата создания |
| `updatedAt` | TIMESTAMP | Дата последнего обновления |

### Таблица Votes

Хранит информацию о голосах пользователей.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER | Первичный ключ (auto-increment) |
| `ideaId` | INTEGER | Внешний ключ на таблицу Ideas |
| `ipAddress` | STRING | IP-адрес пользователя |
| `createdAt` | TIMESTAMP | Дата голосования |
| `updatedAt` | TIMESTAMP | Дата последнего обновления |

---

## API Endpoints

### Base URL

```
http://localhost:4000/api
```

### 1. Получить список идей

**Endpoint:** `GET /api/ideas`

**Описание:** Возвращает список всех идей с количеством голосов, отсортированный по популярности (убывание). Также указывает, голосовал ли текущий пользователь за каждую идею.

**Headers:**
- `X-Forwarded-For` (опционально) - для определения IP клиента за прокси

**Response:**

```json
[
  {
    "id": 1,
    "title": "Implement Dark Mode",
    "description": "Add a dark mode theme...",
    "votesCount": 5,
    "votedByMe": false
  },
  {
    "id": 2,
    "title": "Add Real-time Notifications",
    "description": "Implement WebSocket-based...",
    "votesCount": 3,
    "votedByMe": true
  }
]
```

**Status Codes:**
- `200 OK` - успешный запрос
- `500 Internal Server Error` - ошибка сервера

**Пример запроса:**

```bash
curl http://localhost:4000/api/ideas
```

---

### 2. Проголосовать за идею

**Endpoint:** `POST /api/ideas/:id/vote`

**Описание:** Добавляет голос за указанную идею от имени текущего IP-адреса.

**Parameters:**
- `id` (в URL) - ID идеи (целое число)

**Headers:**
- `X-Forwarded-For` (опционально) - для определения IP клиента за прокси

**Response (успех):**

```json
{
  "message": "Vote added successfully"
}
```

**Status Codes:**
- `201 Created` - голос успешно добавлен
- `400 Bad Request` - некорректный ID идеи
- `404 Not Found` - идея не найдена
- `409 Conflict` - нарушены ограничения голосования:
  - Пользователь уже голосовал за эту идею
  - Достигнут лимит в 10 голосов
- `500 Internal Server Error` - ошибка сервера

**Примеры ответов с ошибками:**

```json
// 409 - уже голосовал
{
  "error": "You have already voted for this idea"
}

// 409 - достигнут лимит
{
  "error": "You have reached the limit of 10 votes"
}

// 404 - идея не найдена
{
  "error": "Idea not found"
}
```

**Пример запроса:**

```bash
curl -X POST http://localhost:4000/api/ideas/1/vote
```

---

### 3. Health Check

**Endpoint:** `GET /api/health`

**Описание:** Проверка доступности API.

**Response:**

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### 4. Root Endpoint

**Endpoint:** `GET /`

**Описание:** Корневой endpoint с информацией об API.

**Response:**

```json
{
  "message": "Welcome to Voting System API",
  "version": "1.0.0"
}
```

---

## WebSocket события

Сервер использует **Socket.IO** для отправки real-time обновлений клиентам.

### Connection

```javascript
// Frontend подключение
const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});
```

### Событие: `vote_update`

**Триггер:** Срабатывает при успешном добавлении голоса

**Payload:**

```json
{
  "ideaId": 1,
  "newVoteCount": 6
}
```

**Пример использования на клиенте:**

```javascript
socket.on('vote_update', (data) => {
  console.log(`Idea ${data.ideaId} now has ${data.newVoteCount} votes`);
  // Обновить UI без перезагрузки страницы
});
```

---

## Определение IP-адреса клиента

### Алгоритм определения IP

Файл: `src/utils/getClientIp.ts`

Система проверяет заголовки HTTP в следующем порядке приоритета:

1. **Cloudflare** - заголовок `cf-connecting-ip`
2. **Nginx** - заголовок `x-real-ip`
3. **Standard Proxy** - заголовок `x-forwarded-for` (берется первый IP из цепочки)
4. **Direct Connection** - `req.socket.remoteAddress`
5. **Localhost Fallback** - если IP локальный, запрашивается публичный IP через API ipify.org

### Особенности

- IPv6 адреса автоматически нормализуются в IPv4 (например, `::ffff:192.168.1.1` → `192.168.1.1`)
- При локальной разработке система запрашивает публичный IP через внешний сервис ipify.org
- Результат запроса публичного IP кэшируется на 10 секунд для минимизации внешних запросов
- Из заголовка `X-Forwarded-For` берется первый (клиентский) IP, а не последний

---

## Бизнес-логика голосования

Файл: `src/services/votes.service.ts`

При попытке голосования выполняется следующая последовательность проверок внутри транзакции базы данных:

1. **Проверка на повторное голосование** - проверяется, не голосовал ли данный IP за эту идею ранее
2. **Проверка лимита голосов** - подсчитывается количество уникальных идей, за которые проголосовал данный IP (лимит 10)
3. **Проверка существования идеи** - проверяется, что идея с указанным ID существует
4. **Добавление голоса** - если все проверки пройдены, создается запись в таблице Votes

После успешного добавления голоса:

- Транзакция коммитится
- Подсчитывается новое общее количество голосов за идею
- Всем подключенным клиентам отправляется WebSocket событие с обновленным счетчиком

---

## Обработка ошибок

### HTTP Status Codes

| Код | Описание |
|-----|----------|
| `200 OK` | Успешный запрос |
| `201 Created` | Голос успешно добавлен |
| `400 Bad Request` | Некорректный ID идеи |
| `404 Not Found` | Идея не найдена |
| `409 Conflict` | Лимит голосов достигнут или уже голосовали |
| `500 Internal Server Error` | Внутренняя ошибка сервера |


