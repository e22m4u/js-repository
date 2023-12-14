## @e22m4u/js-repository

Модуль для работы с базами данных для Node.js

[API](https://e22m4u.github.io/js-repository/modules.html)

- [Установка](#Установка)
- [Пример](#Пример)
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
import {Schema} from '@e22m4u/js-repository';
import {DataType} from '@e22m4u/js-repository';

// создание экземпляра Schema
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

## Схема

Экземпляр класса `Schema` хранит определения для источников данных и моделей.

**Методы**

- `defineDatasource(datasourceDef: object): this` - добавить источник
- `defineModel(modelDef: object): this` - добавить модель
- `getRepository(modelName: string): Repository` - получить репозиторий

**Пример**

```js
import {Schema} from '@e22m4u/js-repository'

// создание экземпляра
const schema = new Schema();
```

## Источник данных

Хранит название выбранного адаптера и его настройки. Определяется
методом `defineDatasource` экземпляра схемы.

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

Описывает структуру документа коллекции и связи к другим моделям. Определяется
методом `defineModel` экземпляра схемы.

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

Выполняет операции чтения и записи данных определенной модели. Получить
репозиторий можно методом `getRepository` экземпляра схемы.

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

- `id: number|string` идентификатор (первичный ключ)
- `data: object` объект отражающий состав документа
- `where: object` параметры выборки (см. Фильтрация)
- `filter: object` параметры возвращаемого результата (см. Фильтрация)

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
