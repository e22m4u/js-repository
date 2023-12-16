## @e22m4u/js-repository

Модуль для работы с базами данных для Node.js

[API](https://e22m4u.github.io/js-repository/modules.html)

- [Установка](#Установка)
- [Пример](#Пример)
- [Источник данных](#Источник-данных)
- [Модель](#Модель)
- [Репозиторий](#Репозиторий)
- [Свойства](#Свойства)
- [Связи](#Связи)
- [Фильтрация](#Фильтрация)
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
  properties: { // свойства модели
    name: DataType.STRING, // тип "string"
    population: DataType.NUMBER, // тип "number"
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

Экземпляр класса `Schema` хранит определения источников данных и моделей.

**Методы**

- `defineDatasource(datasourceDef: object): this` - добавить источник
- `defineModel(modelDef: object): this` - добавить модель
- `getRepository(modelName: string): Repository` - получить репозиторий

**Примеры**

Импорт класса и создание экземпляра схемы.

```js
import {Schema} from '@e22m4u/js-repository';

const schema = new Schema();
```

Определение нового источника.

```js
schema.defineDatasource({
  name: 'myMemory', // название нового источника
  adapter: 'memory', // выбранный адаптер
});
```

Определение новой модели.

```js
schema.defineModel({
  name: 'product', // название новой модели
  datasource: 'myMemory', // выбранный источник
  properties: { // свойства модели
    name: DataType.STRING,
    weight: DataType.NUMBER,
  },
});
```

Получение репозитория по названию модели.

```js
const productRep = schema.getRepository('product');
```

## Источник данных

Источник хранит название выбранного адаптера и его настройки. Определить
новый источник можно методом `defineDatasource` экземпляра схемы.

**Параметры**

- `name: string` уникальное название
- `adapter: string` выбранный адаптер
- параметры адаптера (если имеются)

**Примеры**

Определение нового источника.

```js
schema.defineDatasource({
  name: 'myMemory', // название нового источника
  adapter: 'memory', // выбранный адаптер
});
```

Передача дополнительных параметров адаптера.

```js
schema.defineDatasource({
  name: 'myMongodb',
  adapter: 'mongodb',
  // параметры адаптера "mongodb"
  host: '127.0.0.1',
  port: 27017,
  database: 'myDatabase',
});
```

## Модель

Описывает структуру документа коллекции и связи к другим моделям. Определить
новую модель можно методом `defineModel` экземпляра схемы.

**Параметры**

- `name: string` название модели (обязательно)
- `base: string` название наследуемой модели
- `tableName: string` название коллекции в базе
- `datasource: string` выбранный источник данных
- `properties: object` определения свойств (см. [Свойства](#Свойства))
- `relations: object` определения связей (см. [Связи](#Связи))

**Примеры**

Определение модели со свойствами указанного типа.

```js
schema.defineModel({
  name: 'user', // название новой модели
  properties: { // свойства модели
    name: DataType.STRING,
    age: DataType.NUMBER,
  },
});
```

## Репозиторий

Выполняет операции чтения и записи документов определенной модели.
Получить репозиторий можно методом `getRepository` экземпляра схемы.

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

**Примеры**

Получение репозитория по названию модели.

```js
const countryRep = schema.getRepository('country');
```

Добавление нового документа в коллекцию.

```js
const res = await countryRep.create({
  name: 'Russia',
  population: 143400000,
});

console.log(res);
// {
//   "id": 1,
//   "name": "Russia",
//   "population": 143400000,
// }
```

Поиск документа по идентификатору.

```js
const res = await countryRep.findById(1);

console.log(res);
// {
//   "id": 1,
//   "name": "Russia",
//   "population": 143400000,
// }
```

Удаление документа по идентификатору.

```js
const res = await countryRep.deleteById(1);

console.log(res); // true
```

## Свойства

Параметр `properties` находится в составе модели и принимает объект, ключи
которого являются свойствами этой модели, а значением тип свойства или объект
с дополнительными параметрами.

**Тип данных**

- `DataType.ANY` разрешено любое значение
- `DataType.STRING` только значение типа `string`
- `DataType.NUMBER` только значение типа `number`
- `DataType.BOOLEAN` только значение типа `boolean`
- `DataType.ARRAY` только значение типа `array`
- `DataType.OBJECT` только значение типа `object`

**Параметры**

- `type: string` тип допустимого значения (обязательно)
- `itemType: string` тип элемента массива (для `type: 'array'`)
- `model: string` модель объекта (для `type: 'object'`)
- `primaryKey: boolean` объявить свойство первичным ключом
- `columnName: string` переопределение названия колонки
- `columnType: string` тип колонки (определяется адаптером)
- `required: boolean` объявить свойство обязательным
- `default: any` значение по умолчанию

**Примеры**

Краткое определение свойств модели.

```js
schema.defineModel({
  name: 'city',
  properties: { // свойства модели
    name: DataType.STRING, // тип свойства "string"
    population: DataType.NUMBER, // тип свойства "number"
  },
});
```

Расширенное определение свойств модели.

```js
schema.defineModel({
  name: 'city',
  properties: { // свойства модели
    name: {
      type: DataType.STRING, // тип свойства "string" (обязательно)
      required: true, // исключение значений undefined и null
    },
    population: {
      type: DataType.NUMBER, // тип свойства "number" (обязательно)
      default: 0, // значение по умолчанию
    },
  },
});
```

Фабричное значение по умолчанию. Возвращаемое значение функции будет
определено в момент записи документа.

```js
schema.defineModel({
  name: 'article',
  properties: { // свойства модели
    tags: {
      type: DataType.ARRAY, // тип свойства "array" (обязательно)
      itemType: DataType.STRING, // тип элемента "string"
      default: () => [], // фабричное значение
    },
    createdAt: {
      type: DataType.STRING, // тип свойства "string" (обязательно)
      default: () => new Date().toISOString(), // фабричное значение
    },
  },
});
```

## Связи

Параметр `relations` находится в составе определения модели и принимает
объект, ключ которого является названием связи, а значением объект
с параметрами.

**Параметры**

- `type: string` тип связи
- `model: string` название целевой модели
- `foreignKey: string` свойство текущей модели для идентификатора цели
- `polymorphic: boolean|string` объявить связь полиморфной*
- `discriminator: string` свойство текущей модели для названия целевой*

*i. Полиморфный режим позволяет динамически определять целевую модель
по ее названию, которое хранит документ в свойстве-дискриминаторе.*

**Тип связи**

- `belongsTo` - текущая модель содержит свойство для идентификатора цели
- `hasOne` - обратная сторона `belongsTo` по принципу "один к одному"
- `hasMany` - обратная сторона `belongsTo` по принципу "один ко многим"
- `referencesMany` - документ содержит массив с идентификаторами целевой модели

**Примеры**

Определение моделей связанных через `belongsTo` по идентификатору.

```js
// модель "role"
schema.defineModel({
  name: 'role',
  datasource: 'myMemory',
  properties: {
    name: DataType.STRING,
  },
});

// модель "user"
schema.defineModel({
  name: 'user',
  datasource: 'myMemory',
  properties: {
    name: DataType.STRING,
  },
  relations: {
    role: { // название связи
      type: RelationType.BELONGS_TO, // текущая модель ссылается на целевую
      model: 'role', // название целевой модели
      foreignKey: 'roleId', // свойство для идентификатора (необязательно)
    },
  },
});
```

## Фильтрация

Некоторые методы репозитория принимают объект настроек влияющий
на возвращаемый результат. Максимально широкий набор таких настроек
имеет первый параметр метода `find`, где ожидается объект содержащий
набор опций указанных ниже.

- `where: object` объект выборки
- `order: string[]` указание порядка
- `limit: number` ограничение количества документов
- `skip: number` пропуск документов
- `fields: string[]` выбор необходимых свойств модели
- `include: object` включение связанных данных в результат

### where

Параметр принимает объект с условиями выборки и поддерживает широкий
набор операторов сравнения.

`{foo: 'bar'}` поиск по значению свойства `foo`  
`{foo: {eq: 'bar'}}` оператор равенства `eq`  
`{foo: {neq: 'bar'}}` оператор неравенства `neq`  
`{foo: {gt: 5}}` оператор "больше" `gt`  
`{foo: {lt: 10}}` оператор "меньше" `lt`  
`{foo: {gte: 5}}` оператор "больше или равно" `gte`  
`{foo: {lte: 10}}` оператор "меньше или равно" `lte`  
`{foo: {inq: ['bar', 'baz']}}` равенство одного из значений `inq`  
`{foo: {nin: ['bar', 'baz']}}` исключение значений массива `nin`  
`{foo: {between: [5, 10]}}` оператор диапазона `between`  
`{foo: {exists: true}}` оператор наличия значения `exists`  
`{foo: {like: 'bar'}}` оператор поиска подстроки `like`  
`{foo: {ilike: 'BaR'}}` регистронезависимая версия `ilike`  
`{foo: {nlike: 'bar'}}` оператор исключения подстроки `nlike`  
`{foo: {nilike: 'BaR'}}` регистронезависимая версия `nilike`  
`{foo: {regexp: 'ba.+'}}` оператор регулярного выражения `regexp`  
`{foo: {regexp: 'ba.+', flags: 'i'}}` флаги регулярного выражения

*i. Условия можно объединять операторами `and`, `or` и `nor`.*

**Примеры**

Применение условий выборки при подсчете документов.

```js
const res = await rep.count({
  authorId: 251,
  publishedAt: {
    lte: '2023-12-02T14:00:00.000Z',
  },
});
```

Применение оператора `or` при удалении документов.

```js
const res = await rep.delete({
  or: [
    {draft: true},
    {title: {like: 'draft'}},
  ],
});
```

### order

Параметр упорядочивает выборку по указанным свойствам модели. Обратное
направление порядка можно задать постфиксом `DESC` в названии свойства.

**Примеры**

Упорядочить по полю `createdAt`

```js
const res = await rep.find({
  order: 'createdAt',
});
```

Упорядочить по полю `createdAt` в обратном порядке.

```js
const res = await rep.find({
  order: 'createdAt DESC',
});
```

Упорядочить по нескольким свойствам в разных направлениях.

```js
const res = await rep.find({
  order: [
    'title',
    'price ASC',
    'featured DESC',
  ],
});
```

*i. Направление порядка `ASC` указывать необязательно.*

## Тесты

```bash
npm run test
```

## Лицензия

MIT
