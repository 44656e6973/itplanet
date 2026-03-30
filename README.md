# ItPlanet

Фронтенд-приложение на React и TypeScript с картой возможностей, страницами входа и регистрации, а также клиентской авторизацией на `access_token` / `refresh_token`.

## Стек

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- MapLibre GL + `react-map-gl`
- React Router

## Возможности

- Главная страница с картой и списком возможностей
- Поиск, фильтрация и бесконечная подгрузка карточек на главной странице
- Страницы входа и регистрации
- Регистрация для двух ролей: `applicant` и `employer`
- Проверка ИНН работодателя перед регистрацией
- Хранение `access_token` и `refresh_token` в `localStorage`
- Автообновление токенов каждые 60 минут через `/auth/refresh`

## Карта

Карта построена на `MapLibre GL`, а подложка берётся из OpenStreetMap raster tiles. На главной странице маркеры строятся по данным `/api/v1/opportunities`: если backend вернул `location.lat/lng`, используются они, иначе адрес геокодируется на клиенте.

## Авторизация

Авторизация реализована в [`src/stores/authStore.ts`](./src/stores/authStore.ts).

- Логин отправляется на `POST {VITE_API_URL}/auth/login`
- Регистрация отправляется на `POST {VITE_API_URL}/auth/register`
- Обновление токенов отправляется на `POST {VITE_API_URL}/auth/refresh`
- Для refresh-запроса `refresh_token` передаётся в JSON-теле запроса
- Токены сохраняются в `localStorage` через `zustand/persist`
- Ключ хранилища: `auth-storage`
- При неуспешном refresh пользователь разлогинивается

Автообновление токенов запускается из [`src/hooks/useTokenRefresh.ts`](./src/hooks/useTokenRefresh.ts) и подключено в [`src/App.tsx`](./src/App.tsx).

## Переменные окружения

Скопируйте пример и при необходимости настройте значения:

```bash
cp .env.example .env
```

Доступные переменные:

```env
VITE_API_URL=/api/v1
VITE_2GIS_API_KEY=
```

`VITE_API_URL` используется для запросов к backend API. `VITE_2GIS_API_KEY` сейчас зарезервирован в `.env.example`, но в текущем коде не используется.

## Запуск проекта

Установка зависимостей:

```bash
npm install
```

Запуск в режиме разработки:

```bash
npm run dev
```

По умолчанию приложение будет доступно на `http://localhost:5173`.

## Скрипты

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run test:ui
npm run test:coverage
```

## Маршруты

- `/` — главная страница с картой и возможностями
- `/login` — страница входа
- `/register` — страница регистрации

## Структура проекта

```text
src/
├── components/
│   ├── auth/            # Формы входа и регистрации
│   ├── common/          # Header и Footer
│   ├── map/             # Компоненты карты
│   └── ui/              # Базовые UI-компоненты
├── hooks/
│   ├── useMap.ts        # Хуки для mapStore
│   └── useTokenRefresh.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── MapPage.tsx
│   └── RegisterPage.tsx
├── stores/
│   ├── authStore.ts
│   └── mapStore.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── router.tsx
```

## Состояние приложения

### `authStore`

Хранит:

- пользователя
- `accessToken`
- `refreshToken`
- `tokenRefreshedAt`
- флаги `isAuthenticated`, `isLoading`
- текст ошибки авторизации

### `mapStore`

Поддерживает:

- центр карты
- zoom
- список маркеров
- выбранный маркер

## Особенности регистрации

- Для `applicant` регистрация проходит в один шаг
- Для `employer` форма разделена на два шага
- Перед созданием работодателя вызывается `POST {VITE_API_URL}/companies/verify-inn`
- Пароль валидируется на клиенте: минимум 12 символов, заглавная буква, цифра и спецсимвол

## Сборка

```bash
npm run build
```

## Полезные ссылки

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)
- [react-map-gl](https://visgl.github.io/react-map-gl/)
- [Tailwind CSS](https://tailwindcss.com/docs)
