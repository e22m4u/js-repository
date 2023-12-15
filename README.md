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

Экземпляр класса `Schema` хранит определения источников данных и моделей.

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

Источник хранит название выбранного адаптера и его настройки. Определяется
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
- `properties: object` определения свойств (см. [Свойства](#Свойства))
- `relations: object` определения связей (см. Связи)

**Пример**

```js
schema.defineModel({
  name: 'user', // название новой модели
  properties: { // свойства модели
    name: DataType.STRING,
    age: DataType.NUMBER,
  },
});

// пример документа модели "user"
// {
//   "name": "Fedor",
//   "age": 24
// }
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

**Пример**

```js
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

## Свойства

Параметр `properties` находится в составе определения модели и принимает
объект, ключи которого являются полями документа, а значением тип поля
или объект с дополнительными параметрами.

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
- `primaryKey: boolean` объявить поле первичным ключом
- `columnName: string` переопределение названия колонки
- `columnType: string` тип колонки (определяется адаптером)
- `required: boolean` объявить поле обязательным
- `default: any` значение по умолчанию

**Пример**

```js
schema.defineModel({
  name: 'city',
  properties: { // свойства модели
    name: DataType.STRING, // краткое определение поля "name"
    population: { // расширенное определение поля "population"
      type: DataType.NUMBER, // тип поля (обязательно)
      default: 0, // значение по умолчанию
    },
  },
});

// пример документа модели "city"
// {
//   "name": "Moscow",
//   "population": 11980000
// }
```

## Связи

Параметр `relations` находится в составе определения модели и принимает
объект, ключ которого является названием связи, а значением объект
с параметрами.

**Параметры**

- `type: string` тип связи
- `model: string` целевая модель
- `foreignKey: string` поле для идентификатора цели
- `polymorphic: boolean|string` объявить связь полиморфной*
- `discriminator: string` поле для названия целевой модели (для `polymorphic: true`)

*i. Полиморфный режим позволяет динамически определять целевую модель
по ее названию, которое хранит документ в поле-дискриминаторе.*

**Тип связи**

- `belongsTo` - документ содержит поле с идентификатором целевой модели
- `hasOne` - обратная сторона `belongsTo` по принципу "один к одному"
- `hasMany` - обратная сторона `belongsTo` по принципу "один ко многим"
- `referencesMany` - документ содержит массив с идентификаторами целевой модели

## Фильтрация

Некоторые методы репозитория принимают объект настроек влияющий
на возвращаемый результат. Максимально широкий набор таких настроек
имеет первый параметр метода `find`, где ожидается объект содержащий
набор опций указанных ниже.

- `where: object` объект выборки
- `order: string[]` указание порядка
- `limit: number` ограничение количества документов
- `skip: number` пропуск документов
- `fields: string[]` выбор необходимых полей документа
- `include: object` включение связанных данных в результат (см. Связи)

### where

Параметр принимает объект с условиями выборки и поддерживает широкий
набор операторов сравнения.

`{prop: 'bar'}` поиск по значению поля `prop`  
`{prop: {eq: 'bar'}}` оператор равенства `eq`  
`{prop: {neq: 'bar'}}` оператор неравенства `neq`  
`{prop: {gt: 5}}` оператор "больше" `gt`  
`{prop: {lt: 10}}` оператор "меньше" `lt`  
`{prop: {gte: 5}}` оператор "больше или равно" `gte`  
`{prop: {lte: 10}}` оператор "меньше или равно" `lte`  
`{prop: {inq: ['bar', 'baz']}}` равенство одного из значений `inq`  
`{prop: {nin: ['bar', 'baz']}}` исключение значений массива `nin`  
`{prop: {between: [5, 10]}}` оператор диапазона `between`  
`{prop: {exists: true}}` оператор наличия значения `exists`  
`{prop: {like: 'bar'}}` оператор поиска подстроки `like`  
`{prop: {ilike: 'BaR'}}` регистронезависимая версия `ilike`  
`{prop: {nlike: 'bar'}}` оператор исключения подстроки `nlike`  
`{prop: {nilike: 'BaR'}}` регистронезависимая версия `nilike`  
`{prop: {regexp: 'ba.+'}}` оператор регулярного выражения `regexp`  
`{prop: {regexp: 'ba.+', flags: 'i'}}` флаги регулярного выражения

*i. Условия можно объединять операторами `and`, `or` и `nor`.*

**Примеры**

Подсчет документов методом `count` согласно условиям выборки.

```js
// count(where)
const res = await rep.count({
  authorId: 251,
  publishedAt: {
    lte: '2023-12-02T14:00:00.000Z',
  },
});
```

Удаление документов методом `delete` с применением оператора `or`

```js
// delete(where)
const res = await rep.delete({
  or: [
    {sent: false},
    {title: {like: 'draft'}},
  ],
});
```

### order

Параметр упорядочивает выборку по указанным свойствам документа. Обратное
направление порядка можно задать постфиксом `DESC` в названии свойства.

**Пример**

```js
// упорядочить по свойству "featured"
const res1 = await rep.find({
  order: 'featured',
});

// по свойству "featured" в обратном порядке
const res2 = await rep.find({
  order: 'featured DESC',
});

// по двум свойствам в разных направлениях
const res3 = await rep.find({
  order: [
    'featured',
    'publishedAt DESC',
  ],
});
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
