# quiz-electron-app

Это кроссплатформенное приложение на Electron для проведения тестов прямо на компьютерах студентов.

## Установка

### 1. Требования

- **Node.js** (версия 16+): [https://nodejs.org](https://nodejs.org)
- **npm** (идёт с Node.js)

### 2. Клонировать/скачать проект

```bash
git clone <URL-проекта>
cd quiz-electron-app
```

### 3. Установить зависимости

```bash
npm install
```

## Запуск приложения

### Режим разработки

```bash
npm start
```

Приложение откроется в окне Electron.

### Сборка для распространения

**Для Windows:**
```bash
npm run build-win
```
Создаст файл `.exe` в папке `dist/`

**Для Linux:**
```bash
npm run build-linux
```
Создаст файлы `.deb` и `.rpm` в папке `dist/`

## Как создать тест

### Файл `src/data/questions.json`

Отредактируй файл `questions.json` согласно структуре ниже:

#### Вопрос типа "text" (текстовый ввод)

```json
{
  "id": 1,
  "type": "text",
  "text": "Какой протокол используется для передачи почты?",
  "pattern": "^SMTP$"
}
```

**Пояснение:**
- `id` — уникальный номер вопроса
- `type` — тип вопроса (`text` или `radio`)
- `text` — текст вопроса
- `pattern` — регулярное выражение для проверки ответа

#### Вопрос типа "radio" (выбор одного ответа)

```json
{
  "id": 2,
  "type": "radio",
  "text": "Выберите правильный IP адрес:",
  "options": [
    "192.168.1.1",
    "256.256.256.256",
    "10.0.0.1"
  ],
  "correctAnswer": "192.168.1.1"
}
```

**Пояснение:**
- `options` — массив вариантов ответа
- `correctAnswer` — правильный ответ (ДОЛЖЕН СОВПАДАТЬ с одним из option!)

## Результаты

Результаты автоматически сохраняются в папку:

**Windows:** `C:\Users\[USER]\Documents\Олимпиада\results\`

**Linux:** `~/Documents/Олимпиада/results/`

### Структура файла результатов

```json
{
  "surname": "Иванов",
  "name": "Иван",
  "group": "ПО-101",
  "results": [
    {
      "id": 1,
      "userAnswer": "SMTP",
      "isCorrect": true
    },
    {
      "id": 2,
      "userAnswer": "192.168.1.1",
      "isCorrect": true
    },
    {
      "id": 3,
      "userAnswer": "8",
      "isCorrect": true
    }
  ],
  "timestamp": "22.11.2025, 01:30:00"
}
```

## Безопасность

Приложение защищено от случайного закрытия/перезагрузки:

-  Отключена перезагрузка
- Отключены DevTools

## Переменные среды

Если нужно изменить путь сохранения результатов, отредактируй строку в `src/index.js`:

```javascript
const resultsDir = path.join(app.getPath('documents'), 'Олимпиада');
```
