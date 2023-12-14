## @e22m4u/js-repository

Модуль для работы с базами данных для Node.js

[API](https://e22m4u.github.io/js-repository/modules.html)

- [Установка](#Установка)
- [Пример](#Пример)
- [Использование](#Использование)
- [Источник данных](#Источник-данных)
- [Модель](#Модель)
- [Репозиторий](#Репозиторий)
- [Тесты](#Тесты)
- [Лицензия](#Лицензия)

## Установка

```bash
npm install @e22m4u/js-repository
```

Опционально устанавливаем адаптер.

|           | описание                                                                                                                       |
|-----------|--------------------------------------------------------------------------------------------------------------------------------|
| `memory`  | виртуальная база в памяти процесса (не требует установки)                                                                      |
| `mongodb` | MongoDB - система управления NoSQL базами (*[установка](https://www.npmjs.com/package/@e22m4u/js-repository-mongodb-adapter))* |

## Пример

Определение источника данных, модели и добавление нового документа в коллекцию.

```js
import {Schema} from '@e22m4u/js-repository'

// создание экземпляра схемы
const schema = new Schema();

// определение источника "myMemory"
schema.defineDatasource({
  name: 'myMemory', // название нового источника
  adapter: 'memory', // выбранный адаптер
});

// определение модели "country"
schema.defineModel({
  name: 'country', // название новой модели
  datasource: 'myMemory', // выбранный источник
  properties: { // поля модели
    name: DataType.STRING, // поле "name" типа "string"
    population: DataType.NUMBER, // поле "population" типа "number"
  },
})

// получение репозитория для модели "country"
const countryRep = schema.getRepository('country');

// добавление нового документа в коллекцию "country"
const country = await countryRep.create({
  name: 'Russia',
  population: 143400000,
});

// вывод результата
console.log(country);
// {
//   "id": 1,
//   "name": "Russia",
//   "population": 143400000,
// }
```

## Использование

Экземпляр класса `Schema` хранит информацию об источниках данных, моделей
и предоставляет методы для их определения.

```js
import {Schema} from '@e22m4u/js-repository';

const schema = new Schema();
```

С помощью метода `defineDatasource` определяются источники данных. Источник
данных хранит название адаптера и его настройки.

```js
schema.defineDatasource({
  name: 'myMemory', // название нового источника
  adapter: 'memory', // выбранный адаптер
});
```

Когда источник определен, можно добавить модель методом `defineModel`.
Модель описывает структуру документа коллекции и связи к другим моделям.

```js
schema.defineModel({
  name: 'country', // название новой модели
  datasource: 'myMemory', // выбранный источник
  properties: { // поля модели
    name: DataType.STRING, // поле "name" типа "string"
    population: DataType.NUMBER, // поле "population" типа "number"
  },
});
```

Наличие источника данных в модели позволяет получить репозиторий по
ее названию.

```js
// получение репозитория для модели "country"
const countryRep = schema.getRepository('country');
```

Репозиторий является инструментом для чтения и записи документов
определенной модели.

```js
// добавление нового документа в коллекцию "country"
const country = await countryRep.create({
  name: 'Russia',
  population: 143400000,
});

// вывод результата
console.log(country);
// {
//   "id": 1,
//   "name": "Russia",
//   "population": 143400000,
// }
```

## Источник данных

Определяется методом `schema.defineDatasource`

**Параметры**

- `name: string` уникальное название
- `adapter: string` выбранный адаптер
- параметры адаптера (если имеются)

**Пример**

```js
schema.defineDatasource({
  name: 'myMemory', // название нового источника
  adapter: 'memory', // выбранный адаптер
});
```

## Модель

Определяется методом `schema.defineModel`

**Параметры**

- `name: string` название модели (обязательно)
- `base: string` название наследуемой модели
- `tableName: string` название коллекции в базе
- `datasource: string` выбранный источник данных
- `properties: object` определения полей модели
- `relations: object` определения связей (см. Связи)

**Пример**

```js
schema.defineModel({
  name: 'country', // название новой модели
  datasource: 'myMemory', // выбранный источник
  properties: { // поля модели
    name: DataType.STRING, // поле "name" типа "string"
    population: DataType.NUMBER, // поле "population" типа "number"
  },
});
```

## Репозиторий

Получить репозиторий методом `schema.getRepository`

**Методы**

- `create(data, filter = undefined)` добавить новый документ
- `replaceById(id, data, filter = undefined)` заменить весь документ
- `patchById(id, data, filter = undefined)` частично обновить документ
- `patch(data, where = undefined)` обновить все документы или по условию
- `find(filter = undefined)` найти все документы или по условию
- `findOne(filter = undefined)` найти первый документ или по условию
- `findById(id, filter = undefined)` найти документ по идентификатору
- `delete(where = undefined)` удалить все документы или по условию
- `deleteById(id)` удалить документ по идентификатору
- `exists(id)` проверить существование по идентификатору
- `count(where = undefined)` подсчет всех документов или по условию

**Аргументы**

- `id` идентификатор (первичный ключ)
- `data` объект отражающий состав документа
- `where` параметры выборки (см. Фильтрация)
- `filter` параметры возвращаемого результата (см. Фильтрация)

**Пример**

```js
// добавление нового документа в коллекцию "country"
const country = await countryRep.create({
  name: 'Russia',
  population: 143400000,
});

// вывод результата
console.log(country);
// {
//   "id": 1,
//   "name": "Russia",
//   "population": 143400000,
// }
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
