## @e22m4u/js-repository

Абстракция для работы с базами данных для Node.js

## Установка

```bash
npm install @e22m4u/js-repository
```

Опционально устанавливаем адаптер. Например, если используется
*MongoDB*, то для подключения потребуется установить
[адаптер mongodb](https://www.npmjs.com/package/@e22m4u/js-repository-mongodb-adapter)
как отдельную зависимость.

```bash
npm install @e22m4u/js-repository-mongodb-adapter
```

**Список доступных адаптеров:**

| адаптер   | описание                                                                                                                                        |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `memory`  | виртуальная база в памяти процесса (для разработки и тестирования)                                                                              |
| `mongodb` | MongoDB - система управления NoSQL базами (*[требует установки](https://www.npmjs.com/package/@e22m4u/js-repository-mongodb-adapter))* |

## Концепция

Модуль позволяет спроектировать систему связанных данных, доступ к которым
осуществляется посредством репозиториев. Каждый репозиторий имеет собственную
модель данных, которая описывает структуру определенной коллекции в базе,
а так же определяет связи к другим коллекциям.

```mermaid
flowchart LR

A[Datasource]-->B[Data Model]-->С[Repository];
```

## Использование

Определения источников и моделей хранятся в экземпляре класса `Schema`,
и первым шагом будет создание данного экземпляра.

```js
import {Schema} from '@e22m4u/js-repository';

const schema = new Schema();
```

Интерфейс `Schema` содержит три основных метода:

- `defineDatasource(datasourceDef: object): this` - добавить источник
- `defineModel(modelDef: object): this` - добавить модель
- `getRepository(modelName: string): Repository` - получить репозиторий

### Источник данных

Источник описывает способ подключения к базе и используемый адаптер.
Если адаптер имеет настройки, то они передаются вместе с объектом
определения источника методом `defineDatasource`, как это показано
ниже.

```js
schema.defineDatasource({
  name: 'myMongo', // название нового источника
  adapter: 'mongodb', // название выбранного адаптера
  // настройки адаптера mongodb
  host: '127.0.0.1',
  port: 27017,
  database: 'data'
});
```

**Параметры источника:**

- `name: string` уникальное название
- `adapter: string` выбранный адаптер

При желании можно использовать встроенный адаптер `memory`, который хранит
данные в памяти процесса. У него нет специальных настроек, и он отлично
подходит для тестов и прототипирования.

```js
schema.defineDatasource({
  name: 'myMemory', // название источника
  adapter: 'memory', // выбранный адаптер
});
```

### Модель данных

Когда источники определены, можно перейти к описанию моделей данных.
Модель может определять как структуру какого-либо объекта,
так и являться отражением реальной коллекции базы.

Представьте себе коллекцию торговых точек, у каждой из которых имеются
координаты `lat` и `lng`. Мы можем заранее определить модель для
объекта координат методом `defineModel` и использовать ее в других
коллекциях.

```js
schema.defineModel({
  name: 'latLng', // название новой модели
  properties: { // поля модели
    lat: DataType.NUMBER, // поле широты
    lng: DataType.NUMBER, // поле долготы
  },
});
```

**Параметры модели:**

- `name: string` уникальное название (обязательно)
- `datasource: string` выбранный источник данных
- `properties: object` определения полей модели
- `relations: object` определения связанных коллекций

Параметр `properties` принимает объект, ключи которого являются именами
полей, а значением тип поля или объект с дополнительными параметрами.

```js
schema.defineModel({
  name: 'latLng',
  properties: {
    lat: DataType.NUMBER, // краткое определение поля "lat"
    lng: { // расширенное определение поля "lng"
      type: DataType.NUMBER, // тип допустимого значения
      required: true, // исключает null и undefined
    },
  },
});
```

**Типы данных:**

- `DataType.ANY`
- `DataType.STRING`
- `DataType.NUMBER`
- `DataType.BOOLEAN`
- `DataType.ARRAY`
- `DataType.OBJECT`

Модель `latLng` всего лишь описывает структуру объекта координат, тогда
как торговая точка должна иметь реальную таблицу в базе. По аналогии с
предыдущим примером, добавим модель `place`, но дополнительно укажем
источник данных в параметре `datasource`

```js
schema.defineModel({
  name: 'place',
  datasource: 'myMemory', // выбранный источник данных
  properties: {
    name: DataType.STRING, // поле для названия торговой точки
    location: { // поле для объекта координат
      type: DataType.OBJECT, // допускать только объекты
      model: 'latLng', // определение модели объекта координат
    },
  },
});
```

В примере выше мы использовали модель `latLng` как структуру допустимого
значения поля `location`. Возможный документ данной коллекции может
выглядеть так:

```json
{
  "id": 1,
  "name": "Burger King",
  "location": {
    "lat": 32.412891,
    "lng": 34.7660061
  }
}
```

Стоит обратить внимание, что мы могли бы не объявлять параметр `properties`,
при этом теряя возможность проверки данных перед записью в базу.

```js
schema.defineModel({
  name: 'place',
  adapter: 'myMemory',
  // параметр "properties" не указан
});
```

**Параметры поля:**

- `type: string` тип допустимого значения (обязательно)
- `itemType: string` тип элемента массива (для `type: 'array'`)
- `model: string` модель объекта (для `type: 'object'`)
- `primaryKey: boolean` объявить поле первичным ключом
- `columnName: string` переопределение названия колонки
- `columnType: string` тип колонки (определяется адаптером)
- `required: boolean` объявить поле обязательным
- `default: any` значение по умолчанию

### Репозиторий

В отличие от `latLng`, модель `place` имеет источник данных с названием
`myMemory`, который был объявлен ранее. Наличие источника позволяет получить
репозиторий по названию модели.

```js
const rep = schema.getRepository('place');
```

**Методы:**

- `create(data, filter = undefined)`
- `replaceById(id, data, filter = undefined)`
- `patchById(id, data, filter = undefined)`
- `patch(data, where = undefined)`
- `find(filter = undefined)`
- `findOne(filter = undefined)`
- `findById(id, filter = undefined)`
- `delete(where = undefined)`
- `deleteById(id)`
- `exists(id)`
- `count(where = undefined)`

#### create(data, filter = undefined)

Добавляет новый документ в коллекцию и возвращает его.

```js
// вызов метода `create` с передачей состава
// нового документа первым параметром
const result = await rep.create({
  name: 'Rick Sanchez',
  dimension: 'C-137',
  age: 67,
});

// вывод результата
console.log(result);
// {
//   id: 1, <= определено базой данных
//   name: 'Rick Sanchez',
//   dimension: 'C-137',
//   age: 67
// }
```

Использование параметра `filter` (опционально).

```js
// подготовка состава для нового документа
const data = {
  name: 'Rick Sanchez',
  dimension: 'C-137',
  age: 67,
  pictureId: 345,
  biographyId: 59 
}

// подготовка параметра "filter"
const filter = {
  // "fields" - если определено, то результат
  // будут включать только указанные поля
  fields: [
    'name',
    'pictureId',
    'biographyId'
  ],
  // "include" - включение в результат
  // связанных документов (см. Связи)
  include: [
    'picture',
    'biography',
  ],
}

// вызов метода `create` и вывод результата
const result = await rep.create(data, filter);
console.log(result);
// {
//   "name": "Rick Sanchez",
//   "pictureId": 345,
//   "picture": {
//     "id": 345,
//     "mime": "image/jpeg",
//     "file": "/uploads/rick.jpg"
//   },
//   "biographyId": 59,
//   "biography": {
//      "id": 59,
//      "annotation": "This article is about Rick Sanchez",
//      "body": "He is a genius scientist whose ..."
//   }
// }
//
// поля "age" и "dimension"
// исключены опцией "fields"
//
// документы "picture" и "biography"
// встроены опцией "include" (см. Связи)
```

#### replaceById(id, data, filter = undefined)

Заменяет существующий документ по идентификатору и возвращает его. Если
идентификатор не найден, то выбрасывает исключение.

```js
// документ с идентификатором 12
// имеет следующую структуру
// {
//   id: 12,
//   name: 'Rick Sanchez',
//   dimension: 'C-137',
//   age: 67
// }

// вызов метода `replaceById` с передачей
// идентификатора и нового состава
const result = await rep.replaceById(12, {
  name: 'Morty Smith',
  kind: 'a young teenage boy',
  age: 14,
});

// вывод результата
console.log(result);
// {
//   id: 12,
//   name: 'Morty Smith', <= значение обновлено
//   kind: 'a young teenage boy', <= добавлено новое поле
//   age: 14 <= значение обновлено
// }
// поле "dimension" удалено, так как
// не передавалось с новым составом
```

Использование параметра `filter` (опционально).

```js
// подготовка состава для заменяемого документа
const data = {
  name: 'Morty Smith',
  kind: 'a young teenage boy',
  age: 14,
  pictureId: 347,
  biographyId: 61
}

// подготовка параметра "filter"
const filter = {
  // "fields" - если определено, то результат
  // будут включать только указанные поля
  fields: [
    'name',
    'pictureId',
    'biographyId'
  ],
  // "include" - включение в результат
  // связанных документов (см. Связи)
  include: [
    'picture',
    'biography',
  ],
}

// вызов метода `replaceById` и вывод результата
const result = await rep.replaceById(12, data, filter);
console.log(result);
// {
//   "name": "Morty Smith",
//   "pictureId": 347,
//   "picture": {
//     "id": 347,
//     "mime": "image/jpeg",
//     "file": "/uploads/morty.jpg"
//   },
//   "biographyId": 61,
//   "biography": {
//      "id": 61,
//      "annotation": "This article is about Morty Smith",
//      "body": "Currently, Morty is 14 years old ..."
//   }
// }
//
// поля "age" и "dimension"
// исключены опцией "fields"
//
// документы "picture" и "biography"
// встроены опцией "include" (см. Связи)
```

#### patchById(id, data, filter = undefined)

Частично обновляет существующий документ по идентификатору и возвращает его.
Если идентификатор не найден, то выбрасывает исключение.

```js
// документ с идентификатором 24
// имеет следующую структуру
// {
//   "id": 24,
//   "type": "airport",
//   "name": "Domodedovo Airport",
//   "code": "DME"
// }

// вызов метода `patchById` с передачей идентификатора
// и новых значений обновляемых полей
const result = await rep.patchById(24, {
  name: 'Sheremetyevo Airport',
  code: 'SVO',
  featured: true,
});

// вывод результата
console.log(result);
// {
//   "id": 24,
//   "type": "airport",
//   "name": "Sheremetyevo Airport", <= значение обновлено
//   "code": "SVO", <= значение обновлено
//   "featured": true <= добавлено новое поле
// }
```

Использование параметра `filter` (опционально).

```js
// третий параметр метода `patchById` принимает
// объект настроек возвращаемого результата 
const result = await rep.patchById(24, data, {
  // "fields" - если определено, то результат
  // будут включать только указанные поля
  fields: 'name',
  fields: ['name', 'code'],

  // "include" - включить в результат связанные
  // документы (см. Связи)
  include: 'city',
  include: {city: 'country'},
  include: ['city', 'companies'],
});
```

#### patch(data, where = undefined)

Обновляет документы и возвращает их число. Используется для
обновления нескольких документов согласно условиям выборки,
или всей коллекции сразу.

```js
// коллекция имеет два документа
// [
//   {
//     "id": 1,
//     "type": null,
//     "name": "Bangkok"
//   },
//   {
//     "id": 2,
//     "type": null,
//     "name": "Moscow"
//   }
// ]

// вызов метода `patch` с передачей
// значений для обновляемых полей
const result = await rep.patch({
  type: 'city',
  updatedAt: new Date().toISOString(),
});

// вывод количество затронутых документов
console.log(result);
// 2

// просмотр коллекции методом `find`
// для проверки изменений
const docs = await rep.find();
console.log(docs);
// [
//   {
//     "id": 1,
//     "type": "city", <= значение обновлено
//     "name": "Bangkok",
//     "updatedAt": "2023-12-02T14:13:27.649Z" <= добавлено новое поле
//   },
//   {
//     "id": 2,
//     "type": "city", <= значение обновлено
//     "name": "Moscow",
//     "updatedAt": "2023-12-02T14:13:27.649Z" <= добавлено новое поле
//   }
// ]
```

Условия выборки (опционально).

```js
// второй параметр метода `patch`
// принимает условия выборки
const result = await rep.patch(data, {
  name: 'Moscow',                   // поле "name" должно иметь значение "Moscow"
  updatedAt: {
    lt: '2023-12-02T21:00:00.000Z', // оператор "lt" проверяет поле "updatedAt"
  },                                // на наличие более ранней даты
  // см. Фильтрация
});

// вывод результата
console.log(result);
// 2
```

#### find(filter = undefined)

Возвращает все документы коллекции или согласно условию.

```js
// вызов метода `find` без аргументов
// возвращает все документы коллекции
const result = await rep.find();
console.log(result);
// [
//   {
//     "id": 1,
//     "type": "article",
//     "title": "The Forgotten Ship",
//     "publishedAt": "2023-12-02T08:00:00.000Z",
//     "featured": true
//   },
//   {
//     "id": 2,
//     "type": "article",
//     "title": "A Giant Bellows",
//     "publishedAt": "2023-12-02T12:00:00.000Z",
//     "featured": false
//   },
//   {
//     "id": 3,
//     "type": "letter",
//     "title": "Hundreds of bottles",
//     "publishedAt": null,
//     "featured": false
//   }
// ]
```

Фильтрация результата (опционально).

```js
// первый параметр может принимать
// объект cо следующими настройками
const result = await rep.find({
  // "where" - фильтрация выборки по условию, где
  // указанные поля должны содержать определенные
  // значения (см. Фильтрация)
  where: {type: 'article', featured: true},
  where: {title: {like: 'the forgotten'}},
  where: {publishedAt: {lte: '2023-12-02T21:00:00.000Z'}},

  // "order" - сортировка по указанному полю может
  // принимать постфикс DESC для обратного порядка
  order: 'featured',
  order: 'publishedAt DESC',
  order: ['publishedAt DESC', 'featured ASC', 'id'],

  // "limit" - ограничение результата
  // "skip" - пропуск документов
  limit: 10,
  skip: 10,

  // "fields" - если определено, то результат
  // будет включать только указанные поля
  fields: 'title',
  fields: ['title', 'featured'],

  // "include" - включить в результат связанные
  // документы (см. Связи)
  include: 'author',
  include: {author: 'role'},
  include: ['author', 'categories'],
});
```

#### findOne(filter = undefined)

Возвращает первый найденный документ или `undefined`  

```js
// коллекция имеет три документа
// [
//   {
//     "id": 1,
//     "type": "article",
//     "title": "The Forgotten Ship",
//     "publishedAt": "2023-12-02T08:00:00.000Z",
//     "featured": true
//   },
//   {
//     "id": 2,
//     "type": "article",
//     "title": "A Giant Bellows",
//     "publishedAt": "2023-12-02T12:00:00.000Z",
//     "featured": false
//   },
//   {
//     "id": 3,
//     "type": "letter",
//     "title": "Hundreds of bottles",
//     "publishedAt": null,
//     "featured": false
//   }
// ]

// вызов метода `findOne` без аргументов
// возвращает первый документ коллекции
const result = await rep.findOne();
console.log(result);
// {
//   "id": 1,
//   "type": "article",
//   "title": "The Forgotten Ship",
//   "publishedAt": "2023-12-02T08:00:00.000Z",
//   "featured": true
// }
```

Фильтрация результата (опционально).

```js
// первый параметр метода `find` принимает
// объект настроек возвращаемого результата
const result = await rep.findOne({
  // "where" - фильтрация выборки по условию, где
  // указанные поля должны содержать определенные
  // значения (см. Фильтрация)
  where: {type: 'article', featured: true},
  where: {title: {like: 'the forgotten'}},
  where: {publishedAt: {lte: '2023-12-02T21:00:00.000Z'}},

  // "order" - сортировка по указанному полю может
  // принимать постфикс DESC для обратного порядка
  order: 'featured',
  order: 'publishedAt DESC',
  order: ['publishedAt DESC', 'featured ASC', 'id'],

  // "skip" - пропуск документов
  skip: 10,

  // "fields" - если определено, то результат
  // будет включать только указанные поля
  fields: 'title',
  fields: ['title', 'featured'],

  // "include" - включить в результат связанные
  // документы (см. Связи)
  include: 'author',
  include: {author: 'role'},
  include: ['author', 'categories'],
});
```

#### findById(id, filter = undefined)

Поиск документа по идентификатору. Возвращает найденный документ
или выбрасывает исключение.

```js
// коллекция содержит три документа
// [
//   {
//     "id": 1,
//     "title": "The Forgotten Ship",
//     "featured": true
//   },
//   {
//     "id": 2,
//     "title": "A Giant Bellows",
//     "featured": false
//   },
//   {
//     "id": 3,
//     "title": "Hundreds of bottles",
//     "featured": false
//   }
// ]

// вызов метода `findById` с передачей
// идентификатора искомого документа
const result = await rep.findById(2);
console.log(result);
// {
//   "id": 2,
//   "title": "A Giant Bellows",
//   "featured": false
// }
```

Использование параметра `filter` (опционально).

```js
// второй параметр метода `findById` принимает
// объект настроек возвращаемого результата
const result = await rep.findById(2, {
  // "fields" - если определено, то результат
  // будут включать только указанные поля
  fields: 'title',
  fields: ['title', 'featured'],

  // "include" - включить в результат связанные
  // документы (см. Связи)
  include: 'author',
  include: {author: 'role'},
  include: ['author', 'categories'],
});
```

#### delete(where = undefined)

Удаляет все документы коллекции или согласно условию. Возвращает количество
удаленных документов.

```js
// коллекция имеет три документа
// [
//   {
//     "id": 1,
//     "title": "The Forgotten Ship",
//     "featured": true
//   },
//   {
//     "id": 2,
//     "title": "A Giant Bellows",
//     "featured": false
//   },
//   {
//     "id": 3,
//     "title": "Hundreds of bottles",
//     "featured": false
//   }
// ]

// вызов метода `delete` без аргументов
// удалит все содержимое коллекции
const result = await rep.delete();
console.log(result);
// 3

// просмотр коллекции методом `find`
// для проверки изменений
const docs = await rep.find();
console.log(docs);
// []
```

Условия выборки (опционально).

```js
// первый параметр метода `delete`
// принимает условия выборки 
const result = await rep.delete({
  title: {
    like: 'bellows', // оператор "like" проверяет поле "title"
  },                 // на содержание подстроки "bellows"
  featured: false,   // значение поля "featured" должно быть false
  // см. Фильтрация
});

// вывод результата
console.log(result);
// 1
```

#### deleteById(id)

Удаляет документ по идентификатору. Возвращает `true` в случае успеха
или `false` если не найден.

```js
// коллекция имеет три документа
// [
//   {
//     "id": 1,
//     "title": "The Forgotten Ship"
//   },
//   {
//     "id": 2,
//     "title": "A Giant Bellows"
//   },
//   {
//     "id": 3,
//     "title": "Hundreds of bottles"
//   }
// ]

// вызов метода `deleteById` с передачей
// идентификатора удаляемого документа
const result = await rep.deleteById(2);

// вывод результата
console.log(result);
// true

// просмотр коллекции методом `find`
// для проверки изменений
const docs = await rep.find();
console.log(docs);
// [
//   {
//     "id": 1,
//     "title": "The Forgotten Ship"
//   },
//   {
//     "id": 3,
//     "title": "Hundreds of bottles"
//   }
// ]
```

#### exists(id)

Проверка существования документа по идентификатору. Возвращает `true`
если найден, в противном случае `false`.  

```js
// коллекция имеет три документа
// [
//   {
//     "id": 1,
//     "title": "The Forgotten Ship"
//   },
//   {
//     "id": 2,
//     "title": "A Giant Bellows"
//   },
//   {
//     "id": 3,
//     "title": "Hundreds of bottles"
//   }
// ]

// вызов метода `exists` с передачей
// существующего идентификатора
const result1 = await rep.exists(2);
console.log(result1);
// true

// результат проверки несуществующего
// идентификатора
const result2 = await rep.exists(10);
console.log(result2);
// false
```

#### count(where = undefined)

Подсчет количества документов и возврат их числа.  

```js
// коллекция имеет три документа
// [
//   {
//     "id": 1,
//     "title": "The Forgotten Ship",
//     "featured": true
//   },
//   {
//     "id": 2,
//     "title": "A Giant Bellows",
//     "featured": false
//   },
//   {
//     "id": 3,
//     "title": "Hundreds of bottles",
//     "featured": false
//   }
// ]

// вызов метода `count` без аргументов
// возвращает общее число документов
const result = await rep.count();
console.log(result);
// 3
```

Условия выборки (опционально).

```js
// первый параметр метода `count`
// принимает условия выборки 
const result = await rep.count({
  featured: {  // оператор "neq" проверяет поле "featured"
    neq: true, // на неравенство значению true
  }
  // см. Фильтрация
});

// вывод результата
console.log(result);
// 2
```

## Расширение

При использовании метода `getRepository` выполняется проверка на
наличие существующего экземпляра репозитория для нужной модели.
При первичном запросе создается новый экземпляр, который будет
сохранен для повторных обращений к методу.

```js
import {Schema} from '@e22m4u/js-repository';
import {Repository} from '@e22m4u/js-repository';

// const schema = new Schema();
// schema.defineDatasource ...
// schema.defineModel ...

const rep1 = schema.getRepository('myModel');
const rep2 = schema.getRepository('myModel');
console.log(rep1 === rep2); // true
```

Если требуется изменить или расширить поведение репозитория, то
перед его созданием можно переопределить его конструктор методом
`setRepositoryCtor`. После чего, все создаваемые репозитории будут
использовать уже пользовательский конструктор вместо стандартного.

```js
import {Schema} from '@e22m4u/js-repository';
import {Repository} from '@e22m4u/js-repository';
import {RepositoryRegistry} from '@e22m4u/js-repository';

class MyRepository extends Repository {
  /*...*/
}

const schema = new Schema();
schema.get(RepositoryRegistry).setRepositoryCtor(MyRepository);
// теперь schema.getRepository(modelName) будет возвращать
// экземпляр класса MyRepository
```

<!--
### Filter

Большинство методов репозитория принимают объект `filter` для
фильтрации возвращаемого ответа. Описание параметров объекта:

- **where** *(условия выборки данных из базы)*  
  примеры:  
  `where: {foo: 'bar'}` поиск по значению поля `foo`  
  `where: {foo: {eq: 'bar'}}` оператор равенства `eq`  
  `where: {foo: {neq: 'bar'}}` оператор неравенства `neq`  
  `where: {foo: {gt: 5}}` оператор "больше" `gt`  
  `where: {foo: {lt: 10}}` оператор "меньше" `lt`  
  `where: {foo: {gte: 5}}` оператор "больше или равно" `gte`  
  `where: {foo: {lte: 10}}` оператор "меньше или равно" `lte`  
  `where: {foo: {inq: ['bar', 'baz']}}` равенство одного из значений `inq`  
  `where: {foo: {nin: ['bar', 'baz']}}` исключение значений массива `nin`  
  `where: {foo: {between: [5, 10]}}` оператор диапазона `between`  
  `where: {foo: {exists: true}}` оператор наличия значения `exists`  
  `where: {foo: {like: 'bar'}}` оператор поиска подстроки `like`  
  `where: {foo: {ilike: 'BaR'}}` регистронезависимая версия `ilike`  
  `where: {foo: {nlike: 'bar'}}` оператор исключения подстроки `nlike`  
  `where: {foo: {nilike: 'BaR'}}` регистронезависимая версия `nilike`  
  `where: {foo: {regexp: 'ba.+'}}` оператор регулярного выражения `regexp`  
  `where: {foo: {regexp: 'ba.+', flags: 'i'}}` флаги регулярного выражения


- **order** *(упорядочить записи по полю)*  
  примеры:  
  `order: 'foo'` порядок по полю `foo`  
  `order: 'foo ASC'` явное указание порядка  
  `order: 'foo DESC'` инвертировать порядок  
  `order: ['foo', 'bar ASC', 'baz DESC']` по нескольким полям


- **limit** *(не более N записей)*  
  примеры:  
  `limit: 0` не ограничивать  
  `limit: 14` не более 14-и


- **skip** *(пропуск первых N записей)*  
  примеры:  
  `skip: 0` выборка без пропуска  
  `skip: 10` пропустить 10 объектов выборки


- **include** *(включение связанных данных в результат)*  
  примеры:  
  `include: 'foo'` включение связи `foo`  
  `include: ['foo', 'bar']` включение `foo` и `bar`  
  `include: {foo: 'bar'}` включение вложенной связи `foo`

## Связи

Параметр `relations` описывает набор связей к другим моделям.

Понятия:

- источник связи  
*- модель в которой определена данная связь*  
- целевая модель  
*- модель на которую ссылается источник связи*  

Типы:

- `belongsTo` - ссылка на целевую модель находится в источнике
- `hasOne` - ссылка на источник находится в целевой модели (one-to-one)
- `hasMany` - ссылка на источник находится в целевой модели (one-to-many)
- `referencesMany` - массив ссылок на целевую модель находится в источнике

Параметры:

- `type: string` тип связи
- `model: string` целевая модель
- `foreignKey: string` поле для идентификатора цели
- `polymorphic: boolean|string` объявить связь полиморфной*
- `discriminator: string` поле для названия целевой модели (для `polymorphic: true`)

*i. Полиморфный режим `belongsTo` позволяет динамически определять цель связи,
где имя целевой модели хранится в отдельном поле, рядом с `foreignKey`*

#### BelongsTo

Связь заказа к покупателю через поле `customerId`

```js
schema.defineModel({
  // ...
  relations: {
    // ...
    customer: {
      type: 'belongsTo',
      model: 'customer',
      foreignKey: 'customerId', // опционально
    },
  },
});
```

Полиморфная версия

```js
schema.defineModel({
  // ...
  relations: {
    // ...
    customer: {
      type: 'belongsTo',
      polymorphic: true,
      foreignKey: 'customerId', // опционально
      discriminator: 'customerType', // опционально
    },
  },
});
```

#### HasOne (one-to-one)

Связь покупателя к заказу, как обратная сторона `belongsTo`

```js
schema.defineModel({
  // ...
  relations: {
    // ...
    order: {
      type: 'hasOne',
      model: 'order',
      foreignKey: 'customerId', // поле целевой модели
    },
  },
});
```

Обратная сторона полиморфной версии `belongsTo`

```js
schema.defineModel({
  // ...
  relations: {
    // ...
    order: {
      type: 'hasOne',
      model: 'order',
      polymorphic: 'customer', // имя связи целевой модели
    },
  },
});
```

Явное указание `foreignKey` и `discriminator`

```js
schema.defineModel({
  // ...
  relations: {
    // ...
    order: {
      type: 'hasOne',
      model: 'order',
      polymorphic: true, // true вместо имени модели
      foreignKey: 'customerId', // поле целевой модели 
      discriminator: 'customerType', // поле целевой модели
    },
  },
});
```

#### HasMany (one-to-many)

Связь покупателя к заказам, как обратная сторона `belongsTo`

```js
schema.defineModel({
  // ...
  relations: {
    // ...
    orders: {
      type: 'hasMany',
      model: 'order',
      foreignKey: 'customerId', // поле целевой модели
    },
  },
});
```

Обратная сторона полиморфной версии `belongsTo`

```js
schema.defineModel({
  // ...
  relations: {
    // ...
    orders: {
      type: 'hasMany',
      model: 'order',
      polymorphic: 'customer', // имя связи целевой модели
    },
  },
});
```

Явное указание `foreignKey` и `discriminator`

```js
schema.defineModel({
  // ...
  relations: {
    // ...
    orders: {
      type: 'hasMany',
      model: 'order',
      polymorphic: true, // true вместо имени модели
      foreignKey: 'customerId', // поле целевой модели 
      discriminator: 'customerType', // поле целевой модели
    },
  },
});
```

#### ReferencesMany

Связь покупателя к заказам через поле `orderIds`

```js
schema.defineModel({
  // ...
  relations: {
    // ...
    orders: {
      type: 'referencesMany',
      model: 'order',
      foreignKey: 'orderIds', // опционально
    },
  },
});
```

-->

## Тесты

```bash
npm run test
```

## Лицензия

MIT
