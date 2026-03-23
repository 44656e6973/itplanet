# ItPlanet — React приложение с картами

Приложение на React с использованием карт OpenStreetMap, стейт-менеджментом Zustand и стилизацией Tailwind CSS.

## 🚀 Стек технологий

- **React 19** — UI библиотека
- **TypeScript** — типизация
- **Tailwind CSS** — утилитарные стили
- **React-Leaflet** — работа с картами
- **Zustand** — управление состоянием
- **Vite** — сборщик

## 📦 Установка

```bash
npm install
```

## 🛠 Разработка

```bash
npm run dev
```

Приложение запустится на `http://localhost:5173`

## 🏗 Архитектура проекта

```
src/
├── components/          # React компоненты
│   ├── map/           # Компоненты карты
│   │   ├── Map.tsx              # Основной компонент карты
│   │   └── AddMarkerForm.tsx    # Форма добавления маркера
│   └── ui/            # UI компоненты (кнопки, инпуты и т.д.)
├── hooks/             # Кастомные хуки
│   └── useMap.ts      # Хуки для работы с картой
├── pages/             # Страницы приложения
│   └── MapPage.tsx    # Страница с картой
├── stores/            # Zustand сторы
│   └── mapStore.ts    # Стор для состояния карты
├── types/             # TypeScript типы
│   └── index.ts       # Основные типы приложения
├── App.tsx            # Корневой компонент
└── index.css          # Глобальные стили
```

## 📝 Основные возможности

### Работа с картой

- **Просмотр карты** — перемещение и масштабирование
- **Добавление маркеров** — клик по карте открывает форму добавления
- **Удаление маркеров** — через popup маркера
- **Информационная панель** — отображает текущее состояние карты

### Управление состоянием (Zustand)

Состояние карты включает:

```typescript
interface MapState {
  center: Coordinates;      // Центр карты
  zoom: number;             // Уровень зума
  markers: MapMarker[];     // Список маркеров
  selectedMarkerId: string | null;  // Выбранный маркер
}
```

Действия:

- `setCenter` — установить центр карты
- `setZoom` — установить зум
- `addMarker` — добавить маркер
- `removeMarker` — удалить маркер
- `updateMarker` — обновить маркер
- `selectMarker` — выбрать маркер
- `resetMap` — сбросить карту к начальным значениям

## 🎯 Использование хуков

### useMapView

```typescript
const { center, zoom, setCenter, setZoom, resetMap } = useMapView();
```

### useMarkers

```typescript
const { markers, addMarker, removeMarker, updateMarker } = useMarkers();
```

### useSelectedMarker

```typescript
const { selectedMarkerId, selectedMarker, selectMarker } = useSelectedMarker();
```

## 🧩 Компоненты

### Map

Основной компонент карты:

```tsx
<Map 
  className="h-full w-full" 
  onMarkerClick={(id) => console.log(id)}
  onMapClick={(coords) => console.log(coords)}
/>
```

### AddMarkerForm

Форма добавления маркера:

```tsx
<AddMarkerForm 
  position={{ lat: 55.7558, lng: 37.6173 }} 
  onClose={() => setShowForm(false)} 
/>
```

## 📄 Сборка

```bash
npm run build
```

## ▶️ Предпросмотр сборки

```bash
npm run preview
```

## 🔧 Линтинг

```bash
npm run lint
```

## 📚 Структура типов

```typescript
interface Coordinates {
  lat: number;
  lng: number;
}

interface MapMarker {
  id: string;
  position: Coordinates;
  title: string;
  description?: string;
}
```

## 🎨 Стилизация

Проект использует Tailwind CSS с поддержкой темной темы через `prefers-color-scheme`.

Основные утилиты:

- `h-screen`, `w-screen` — полная высота/ширина экрана
- `absolute`, `relative` — позиционирование
- `z-[1000]` — слои поверх карты
- `bg-white/90 backdrop-blur` — полупрозрачные панели

## 🔗 Полезные ссылки

- [React документация](https://react.dev/)
- [Zustand документация](https://zustand-demo.pmnd.rs/)
- [React-Leaflet документация](https://react-leaflet.js.org/)
- [Tailwind CSS документация](https://tailwindcss.com/docs)
- [OpenStreetMap](https://www.openstreetmap.org/)
