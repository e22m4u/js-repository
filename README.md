## @e22m4u/js-repository

Реализация паттерна «Репозиторий» для работы с базами данных в Node.js

- [Установка](#установка)
- [Импорт](#импорт)
- [Описание](#описание)
- [Пример](#пример)
- [Схема базы данных](#схема-базы-данных)
- [Источник данных](#источник-данных)
- [Модель](#модель)
- [Свойства](#свойства)
- [Валидаторы](#валидаторы)
- [Трансформеры](#трансформеры)
- [Пустые значения](#пустые-значения)
- [Репозиторий](#репозиторий)
- [Фильтрация](#фильтрация)
- [Связи](#связи)
- [Расширение](#расширение)
- [TypeScript](#typescript)
- [Тесты](#тесты)
- [Лицензия](#лицензия)

## Установка

```bash
npm install @e22m4u/js-repository
```

Опционально устанавливаем адаптер.

|           | описание                                                                                                                       |
|-----------|--------------------------------------------------------------------------------------------------------------------------------|
| `memory`  | виртуальная база в памяти процесса (не требует установки)                                                                      |
| `mongodb` | MongoDB - система управления NoSQL базами (*[установка](https://www.npmjs.com/package/@e22m4u/js-repository-mongodb-adapter))* |

## Импорт

Модуль поддерживает ESM и CommonJS стандарты.

*ESM*

```js
import {DatabaseSchema} from '@e22m4u/js-repository';
```

*CommonJS*

```js
const {DatabaseSchema} = require('@e22m4u/js-repository');
```

## Описание

Модуль позволяет абстрагироваться от различных интерфейсов баз данных,
представляя их как именованные *источники данных*, подключаемые к *моделям*.
*Модель* же описывает таблицу базы, колонки которой являются свойствами
модели. Свойства модели могут иметь определенный *тип* допустимого значения,
набор *валидаторов* и *трансформеров*, через которые проходят данные перед
записью в базу. Кроме того, *модель* может определять классические связи
«один к одному», «один ко многим» и другие типы отношений между моделями.

Непосредственно чтение и запись данных производится с помощью *репозитория*,
который имеет каждая модель с объявленным *источником данных*. Репозиторий
может фильтровать запрашиваемые документы, выполнять валидацию свойств
согласно определению модели, и встраивать связанные данные в результат
выборки.

- *Источник данных* - определяет способ подключения к базе
- *Модель* - описывает структуру документа и связи к другим моделям
- *Репозиторий* - выполняет операции чтения и записи документов модели

```mermaid
flowchart TD

  A[Схема]
  subgraph Базы данных
    B[Источник данных 1]
    C[Источник данных 2]
  end
  A-->B
  A-->C

  subgraph Коллекции
    D[Модель A]
    E[Модель Б]
    F[Модель В]
    G[Модель Г]
  end
  B-->D
  B-->E
  C-->F
  C-->G

  H[Репозиторий A]
  I[Репозиторий Б]
  J[Репозиторий В]
  K[Репозиторий Г]
  D-->H
  E-->I
  F-->J
  G-->K
```

## Пример

Объявление источника данных, модели и добавление нового документа в коллекцию.

```js
import {DataType} from '@e22m4u/js-repository';
import {DatabaseSchema} from '@e22m4u/js-repository';

// создание экземпляра DatabaseSchema
const dbs = new DatabaseSchema();

// объявление источника "myMemory"
dbs.defineDatasource({
  name: 'myMemory', // название нового источника
  adapter: 'memory', // выбранный адаптер
});

// объявление модели "country"
dbs.defineModel({
  name: 'country', // название новой модели
  datasource: 'myMemory', // выбранный источник
  properties: { // свойства модели
    name: DataType.STRING, // тип "string"
    population: DataType.NUMBER, // тип "number"
  },
})

// получение репозитория модели "country"
const countryRep = dbs.getRepository('country');

// добавление нового документа в коллекцию "country"
const country = await countryRep.create({
  name: 'Russia',
  population: 143400000,
});

// вывод нового документа
console.log(country);
// {
//   "id": 1,
//   "name": "Russia",
//   "population": 143400000,
// }
```

## Схема базы данных

Экземпляр класса `DatabaseSchema` хранит определения источников и моделей
данных.

**Методы**

- `defineDatasource(datasourceDef: object): this` - добавить источник
- `defineModel(modelDef: object): this` - добавить модель
- `getRepository(modelName: string): Repository` - получить репозиторий

**Примеры**

Импорт класса и создание экземпляра схемы.

```js
import {DatabaseSchema} from '@e22m4u/js-repository';

const dbs = new DatabaseSchema();
```

Определение нового источника.

```js
dbs.defineDatasource({
  name: 'myMemory', // название нового источника
  adapter: 'memory', // выбранный адаптер
});
```

Определение новой модели.

```js
dbs.defineModel({
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
const productRep = dbs.getRepository('product');
```

## Источник данных

Источник хранит название выбранного адаптера и его настройки. Определение
нового источника выполняется методом `defineDatasource` экземпляра
`DatabaseSchema`.

**Параметры**

- `name: string` уникальное название
- `adapter: string` выбранный адаптер
- параметры адаптера (если имеются)

**Примеры**

Определение нового источника.

```js
dbs.defineDatasource({
  name: 'myMemory', // название нового источника
  adapter: 'memory', // выбранный адаптер
});
```

Передача дополнительных параметров адаптера.

```js
dbs.defineDatasource({
  name: 'myMongodb',
  adapter: 'mongodb',
  // параметры адаптера "mongodb"
  host: '127.0.0.1',
  port: 27017,
  database: 'myDatabase',
});
```

## Модель

Описывает структуру документа коллекции и связи к другим моделям. Определение
новой модели выполняется методом `defineModel` экземпляра `DatabaseSchema`.

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
dbs.defineModel({
  name: 'user', // название новой модели
  properties: { // свойства модели
    name: DataType.STRING,
    age: DataType.NUMBER,
  },
});
```

## Свойства

Параметр `properties` находится в определении модели и принимает объект, ключи
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
- `validate: string | array | object` см. [Валидаторы](#Валидаторы)
- `unique: boolean | string` проверять значение на уникальность

**Параметр `unique`**

Если значением параметра `unique` является `true` или `'strict'`, то выполняется
строгая проверка на уникальность. В этом режиме [пустые значения](#Пустые-значения)
так же подлежат проверке, где `null` и `undefined` не могут повторяться более одного
раза.

Режим `'sparse'` проверяет только значения с полезной нагрузкой, исключая
[пустые значения](#Пустые-значения), список которых отличается в зависимости
от типа свойства. Например, для типа `string` пустым значением будет `undefined`,
`null` и `''` (пустая строка).

- `unique: true | 'strict'` строгая проверка на уникальность
- `unique: 'sparse'` исключить из проверки [пустые значения](#Пустые-значения)
- `unique: false | 'nonUnique'` не проверять на уникальность (по умолчанию)

В качестве значений параметра `unique` можно использовать предопределенные
константы как эквивалент строковых значений `strict`, `sparse` и `nonUnique`.

- `PropertyUniqueness.STRICT`
- `PropertyUniqueness.SPARSE`
- `PropertyUniqueness.NON_UNIQUE`

**Примеры**

Краткое определение свойств модели.

```js
dbs.defineModel({
  name: 'city',
  properties: { // свойства модели
    name: DataType.STRING, // тип свойства "string"
    population: DataType.NUMBER, // тип свойства "number"
  },
});
```

Расширенное определение свойств модели.

```js
dbs.defineModel({
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
    code: {
      type: DataType.NUMBER, // тип свойства "number" (обязательно)
      unique: PropertyUniqueness.UNIQUE, // проверять уникальность
    },
  },
});
```

Фабричное значение по умолчанию. Возвращаемое значение функции будет
определено в момент записи документа.

```js
dbs.defineModel({
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

## Валидаторы

Кроме проверки типа, дополнительные условия можно задать с помощью
валидаторов, через которые будет проходить значение свойства перед
записью в базу. Исключением являются [пустые значения](#Пустые-значения),
которые не подлежат проверке.

- `minLength: number` минимальная длинна строки или массива
- `maxLength: number` максимальная длинна строки или массива
- `regexp: string | RegExp` проверка по регулярному выражению

**Пример**

Валидаторы указываются в объявлении свойства модели параметром
`validate`, который принимает объект с их названиями и настройками.

```js
dbs.defineModel({
  name: 'user',
  properties: {
    name: {
      type: DataType.STRING,
      validate: { // валидаторы свойства "name"
        minLength: 2, // минимальная длинна строки
        maxLength: 24, // максимальная длинна строки
      },
    },
  },
});
```

### Пользовательские валидаторы

Валидатором является функция, в которую передается значение соответствующего
поля перед записью в базу. Если во время проверки функция возвращает `false`,
то выбрасывается стандартная ошибка. Подмена стандартной ошибки возможна
с помощью выброса пользовательской ошибки непосредственно внутри функции.

Регистрация пользовательского валидатора выполняется методом `addValidator`
сервиса `PropertyValidatorRegistry`, который принимает новое название
и функцию для проверки значения.

**Пример**

```js
// создание валидатора для запрета
// всех символов кроме чисел
const numericValidator = (input) => {
  return /^[0-9]+$/.test(String(input));
}

// регистрация валидатора "numeric"
dbs.get(PropertyValidatorRegistry).addValidator('numeric', numericValidator);

// использование валидатора в определении
// свойства "code" для новой модели
dbs.defineModel({
  name: 'document',
  properties: {
    code: {
      type: DataType.STRING,
      validate: 'numeric',
    },
  },
});
```

## Трансформеры

С помощью трансформеров производится модификация значений определенных
полей перед записью в базу. Трансформеры позволяют указать какие изменения
нужно производить с входящими данными. Исключением являются
[пустые значения](#Пустые-значения), которые не подлежат трансформации.

- `trim` удаление пробельных символов с начала и конца строки
- `toUpperCase` перевод строки в верхний регистр
- `toLowerCase` перевод строки в нижний регистр
- `toTitleCase` перевод строки в регистр заголовка

**Пример**

Трансформеры указываются в объявлении свойства модели параметром
`transform`, который принимает название трансформера. Если требуется
указать несколько названий, то используется массив. Если трансформер
имеет настройки, то используется объект, где ключом является название
трансформера, а значением его параметры.

```js
dbs.defineModel({
  name: 'user',
  properties: {
    name: {
      type: DataType.STRING,
      transform: [ // трансформеры свойства "name"
        'trim', // удалить пробелы в начале и конце строки
        'toTitleCase', // перевод строки в регистр заголовка
      ],
    },
  },
});
```

## Пустые значения

Разные типы свойств имеют свои наборы пустых значений. Эти наборы
используются для определения наличия полезной нагрузки в значении
свойства. Например, параметр `default` в определении свойства
устанавливает значение по умолчанию, только если входящее значение
является пустым. Параметр `required` исключает пустые значения
выбрасывая ошибку. А параметр `unique` в режиме `sparse` наоборот
допускает дублирование пустых значений уникального свойства.

| тип         | пустые значения           |
|-------------|---------------------------|
| `'any'`     | `undefined`, `null`       |
| `'string'`  | `undefined`, `null`, `''` |
| `'number'`  | `undefined`, `null`, `0`  |
| `'boolean'` | `undefined`, `null`       |
| `'array'`   | `undefined`, `null`, `[]` |
| `'object'`  | `undefined`, `null`, `{}` |

## Репозиторий

Выполняет операции чтения и записи документов определенной модели.
Получить репозиторий можно методом `getRepository` экземпляра `DatabaseSchema`.

**Методы**

- `create(data, filter = undefined)` добавить новый документ
- `replaceById(id, data, filter = undefined)` заменить весь документ
- `replaceOrCreate(data, filter = undefined)` заменить или создать новый
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
- `where: object` параметры выборки (см. [Фильтрация](#Фильтрация))
- `filter: object` параметры возвращаемого результата (см. [Фильтрация](#Фильтрация))

**Примеры**

Получение репозитория по названию модели.

```js
const countryRep = dbs.getRepository('country');
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

### include

Параметр включает связанные документы в результат вызываемого метода.
Названия включаемых связей должны быть определены в текущей модели.
(см. [Связи](#Связи))

**Примеры**

Включение связи по названию.

```js
const res = await rep.find({
  include: 'city',
});
```

Включение вложенных связей.

```js
const res = await rep.find({
  include: {
    city: 'country',
  },
});
```

Включение нескольких связей массивом.

```js
const res = await rep.find({
  include: [
    'city',
    'address',
    'employees'
  ],
});
```

Использование фильтрации включаемых документов.

```js
const res = await rep.find({
  include: {
    relation: 'employees', // название связи
    scope: { // фильтрация документов "employees"
      where: {hidden: false}, // условия выборки
      order: 'id', // порядок документов
      limit: 10, // ограничение количества
      skip: 5, // пропуск документов
      fields: ['name', 'surname'], // только указанные поля
      include: 'city', // включение связей для "employees"
    },
  },
});
```

## Связи

Параметр `relations` находится в определении модели и принимает
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

Объявление связи `belongsTo`

```js
dbs.defineModel({
  name: 'user',
  relations: {
    role: { // название связи
      type: RelationType.BELONGS_TO, // текущая модель ссылается на целевую
      model: 'role', // название целевой модели
      foreignKey: 'roleId', // внешний ключ (необязательно)
      // если "foreignKey" не указан, то свойство внешнего
      // ключа формируется согласно названию связи
      // с добавлением постфикса "Id"
    },
  },
});
```

Объявление связи `hasMany`

```js
dbs.defineModel({
  name: 'role',
  relations: {
    users: { // название связи
      type: RelationType.HAS_MANY, // целевая модель ссылается на текущую
      model: 'user', // название целевой модели
      foreignKey: 'roleId', // внешний ключ из целевой модели на текущую
    },
  },
});
```

Объявление связи `referencesMany`

```js
dbs.defineModel({
  name: 'article',
  relations: {
    categories: { // название связи
      type: RelationType.REFERENCES_MANY, // связь через массив идентификаторов
      model: 'category', // название целевой модели
      foreignKey: 'categoryIds', // внешний ключ (необязательно)
      // если "foreignKey" не указан, то свойство внешнего
      // ключа формируется согласно названию связи
      // с добавлением постфикса "Ids"
    },
  },
});
```

Полиморфная версия `belongsTo`

```js
dbs.defineModel({
  name: 'file',
  relations: {
    reference: { // название связи
      type: RelationType.BELONGS_TO, // текущая модель ссылается на целевую
      // полиморфный режим позволяет хранить название целевой модели
      // в свойстве-дискриминаторе, которое формируется согласно
      // названию связи с постфиксом "Type", и в данном случае
      // название целевой модели хранит "referenceType",
      // а идентификатор документа "referenceId"
      polymorphic: true,
    },
  },
});
```

Полиморфная версия `belongsTo` с указанием свойств.

```js
dbs.defineModel({
  name: 'file',
  relations: {
    reference: { // название связи
      type: RelationType.BELONGS_TO, // текущая модель ссылается на целевую
      polymorphic: true, // название целевой модели хранит дискриминатор
      foreignKey: 'referenceId', // свойство для идентификатора цели
      discriminator: 'referenceType', // свойство для названия целевой модели
    },
  },
});
```

Полиморфная версия `hasMany` с указанием названия связи целевой модели.

```js
dbs.defineModel({
  name: 'letter',
  relations: {
    attachments: { // название связи
      type: RelationType.HAS_MANY, // целевая модель ссылается на текущую
      model: 'file', // название целевой модели
      polymorphic: 'reference', // название полиморфной связи целевой модели
    },
  },
});
```

Полиморфная версия `hasMany` с указанием свойств целевой модели.

```js
dbs.defineModel({
  name: 'letter',
  relations: {
    attachments: { // название связи
      type: RelationType.HAS_MANY, // целевая модель ссылается на текущую
      model: 'file', // название целевой модели
      polymorphic: true, // название текущей модели находится в дискриминаторе
      foreignKey: 'referenceId', // свойство целевой модели для идентификатора
      discriminator: 'referenceType', // свойство целевой модели для названия текущей
    },
  },
});
```

## Расширение

Метод `getRepository` экземпляра `DatabaseSchema` проверяет наличие
существующего  репозитория для указанной модели и возвращает его.
В противном случае создается новый экземпляр, который будет сохранен
для последующих обращений к методу.

```js
import {Repository} from '@e22m4u/js-repository';
import {DatabaseSchema} from '@e22m4u/js-repository';

// const dbs = new DatabaseSchema();
// dbs.defineDatasource ...
// dbs.defineModel ...

const rep1 = dbs.getRepository('model');
const rep2 = dbs.getRepository('model');
console.log(rep1 === rep2); // true
```

Подмена стандартного конструктора репозитория выполняется методом
`setRepositoryCtor` сервиса `RepositoryRegistry`, который находится
в сервис-контейнере экземпляра `DatabaseSchema`. После чего все новые
репозитории будут создаваться указанным конструктором вместо стандартного.

```js
import {Repository} from '@e22m4u/js-repository';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {RepositoryRegistry} from '@e22m4u/js-repository';

class MyRepository extends Repository {
  /*...*/
}

// const dbs = new DatabaseSchema();
// dbs.defineDatasource ...
// dbs.defineModel ...

dbs.get(RepositoryRegistry).setRepositoryCtor(MyRepository);
const rep = dbs.getRepository('model');
console.log(rep instanceof MyRepository); // true
```

*i. Так как экземпляры репозитория кэшируется, то замену конструктора
следует выполнять до обращения к методу `getRepository`.*

## TypeScript

Получение типизированного репозитория с указанием интерфейса модели.

```ts
import {DataType} from '@e22m4u/js-repository';
import {RelationType} from '@e22m4u/js-repository';
import {DatabaseSchema} from '@e22m4u/js-repository';

// const dbs = new DatabaseSchema();
// dbs.defineDatasource ...
// dbs.defineModel ...

// определение модели "city"
dbs.defineModel({
  name: 'city',
  datasource: 'myDatasource',
  properties: {
    title: DataType.STRING,
    timeZone: DataType.STRING,
  },
  relations: {
    country: {
      type: RelationType.BELONGS_TO,
      model: 'country',
    },
  },
});

// определение интерфейса "city"
interface City {
  id: number;
  title?: string;
  timeZone?: string;
  countryId?: number;
  country?: Country;
}

// получаем репозиторий по названию модели
// указывая ее тип и тип идентификатора
const cityRep = dbs.getRepository<City, number>('city');
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
