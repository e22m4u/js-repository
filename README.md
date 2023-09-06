## @e22m4u/repository

Абстракция для работы с базами данных для Node.js  
  
  
| адаптер | описание                                                                                                                                     |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------|
| memory  | хранение данных в памяти процесса Node.js для разработки и тестирования                                                                      |
| mongodb | MongoDB - система управления NoSQL базами данных (*[требует установки](https://www.npmjs.com/package/@e22m4u/repository-mongodb-adapter))* |

## Установка

```bash
npm install @e22m4u/repository
```

Опционально устанавливаем адаптер, например [mongodb](https://www.npmjs.com/package/@e22m4u/repository-mongodb-adapter)

```bash
npm install @e22m4u/repository-mongodb-adapter
```

## Пример

Создаем экземпляр класса `Schema`

```js
import {Schema} from '@e22m4u/repository';

const schema = new Schema();
```

Объявляем источник данных `myDatasource`

```js
schema.defineDatasource({
  name: 'myDatasource', // название источника
  adapter: 'memory', // выбранный адаптер
});
```

Объявляем модель заказа `order`

```js
schema.defineModel({
  name: 'order', // название модели
  datasource: 'myDatasource', // используемый источник
  properties: { // поля модели
    cost: 'number', // поле типа "number"
  },
  relations: { // связи с другими моделями
    customer: { // название связи
      type: 'belongsTo', // хранить идентификатор цели у себя
      model: 'customer', // название целевой модели
      foreignKey: 'customerId', // в каком поле хранить идентификатор цели
    },
  },
});
```

Объявляем модель покупателя `customer`

```js
schema.defineModel({
  name: 'customer', // название модели
  datasource: 'myDatasource', // используемый источник
  properties: { // поля модели
    name: { // название поля
      type: 'string', // тип поля
      required: true, // сделать поле обязательным
    },
  },
  relations: { // связи с другими моделями
    orders: { // название связи
      type: 'hasMany', // искать свой идентификатор в целевой модели
      model: 'order', // целевая модель
      foreignKey: 'customerId', // в каком поле искать идентификатор
    },
  },
});
```

Получаем репозитории для моделей `customer` и `order`

```js
const customerRep = schema.getRepository('customer');
const orderRep = schema.getRepository('order')
```

Создаем покупателя `fedor` и его заказы

```js
// создаем покупателя
const fedor = await customerRep.create({name: 'Fedor'});

// и заказы
await orderRep.create({cost: 150, customerId: fedor.id});
await orderRep.create({cost: 250, customerId: fedor.id});
```

Получаем покупателя методом `findById`, включая связь с заказами

```js
const fedorWithOrders = await customerRep.findById(
  fedor.id, // искомый идентификатор
  {include: ['orders']}, // имена включаемых связей
);
// {
//   id: 1,
//   name: 'Fedor',
//   orders: [
//     {id: 1: cost: 150, customerId: 1},
//     {id: 2: cost: 250, customerId: 1},
//   ],
// }
```

Получаем заказы и их покупателей методом `find`

```js
const ordersWithCustomers = await orderRep.find({
  // опциональные параметры
  where: {customerId: fedor.id}, // фильтрация
  order: ['id DESC'], // сортировка результата
  limit: 10, // ограничение количества
  skip: 0, // пропуск записей
  fields: ['cost', 'customerId'], // запрашиваемые поля
  include: ['customer'], // включаемые связи
});
console.log(ordersWithCustomers);
// [
//   {
//     id: 1,
//     cost: 150,
//     customerId: 1,
//     customer: {
//       id: 1,
//       name: 'Fedor',
//     },
//   },
//   {
//     id: 2,
//     cost: 250,
//     customerId: 1,
//     customer: {
//       id: 1,
//       name: 'Fedor',
//     },
//   },
// ]
```

Удаляем данные методами `deleteById` и `delete`

```js
// удаляем покупателя по идентификатору
await customerRep.deleteById(fedor.id); // true

// удаляем заказы по условию
await orderRep.delete({customerId: fedor.id}); // 2
```

## Datasource

Определяет настройки и способ подключения к базе.

Параметры:

- `name: string` название нового источника
- `adapter: string` выбранный адаптер базы данных

Пример:

```js
schema.defineDatasource({
  name: 'myDatasource',
  adapter: 'memory',
});
```

Адаптер может иметь параметры, которые передаются
при определении источника.

Пример:

```js
schema.defineDatasource({
  name: 'myDatasource',
  adapter: 'mongodb',
  // параметры адаптера:
  host: '127.0.0.1',
  port: 27017,
});
```

## Model

Описывает набор полей и связей к другим моделям.

Параметры:

- `name: string` название новой модели
- `datasource: string` выбранный источник данных
- `properties: object` определения полей модели
- `relations: object` определения связей модели

Пример:

```js
schema.defineModel({
  name: 'myModel',
  datasource: 'myDatasource',
  properties: {...}, // см. ниже
  relations: {...}, // см. ниже
});
```

## Properties

Описывает набор полей и их настройки.

Типы:

- `string`  
- `number`  
- `boolean`  
- `array`  
- `object`  
- `any`  

Пример:

```js
schema.defineModel({
  // ...
  properties: {
    prop1: 'string',
    prop2: 'number',
    prop3: 'boolean',
    prop4: 'array',
    prop5: 'object',
    prop6: 'any',
  },
});
```

Расширенные параметры:

- `type: string` тип хранимого значения
- `itemType: string` тип элемента массива (для `type: 'array'`)
- `model: string` модель объекта (для `type: 'object'`)
- `primaryKey: boolean` объявить поле первичным ключом 
- `columnName: string` переопределение названия колонки
- `columnType: string` тип колонки (определяется адаптером)
- `required: boolean` объявить поле обязательным
- `default: any` значение по умолчанию для `undefined`

Пример:

```js
schema.defineModel({
  // ...
  properties: {
    prop1: {
      type: 'string',
      primaryKey: true,
    },
    prop2: {
      type: 'boolean',
      required: true,
    },
    prop3: {
      type: 'number',
      default: 100,
    },
    prop3: {
      type: 'string',
      // фабричное значение
      default: () => new Date().toISOString(),
    },
    prop4: {
      type: 'array',
      itemType: 'string',
    },
    prop5: {
      type: 'object',
      model: 'objectModel',
    },
  },
});
```

## Relations

Описывает набор связей к другим моделям.

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
      foreignKey: 'customerId', // опционально
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
      foreignKey: 'customerId', // опционально
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

## Repository

Выполняет операции чтения и записи определенной модели.

Методы:

- `create(data, filter = undefined)`
- `replaceById(id, data, filter = undefined)`
- `replaceOrCreate(data, filter = undefined)`
- `patchById(id, data, filter = undefined)`
- `find(filter = undefined)`
- `findOne(filter = undefined)`
- `findById(id, filter = undefined)`
- `delete(where = undefined)`
- `deleteById(id)`
- `exists(id)`
- `count(where = undefined)`

Получение репозитория модели:

```js
import {Schema} from '@e22m4u/repository';

const schema = new Schema();
// создаем источник
schema.defineDatasource({name: 'myDatasource', adapter: 'memory'});
// создаем модель
schema.defineModel({name: 'myModel', datasource: 'myDatasource'});
// получаем репозиторий по названию модели
const repositorty = schema.getRepository('myModel');
```

Переопределение конструктора:

```js
import {Schema} from '@e22m4u/repository';
import {Repository} from '@e22m4u/repository';
import {RepositoryRegistry} from '@e22m4u/repository';

class MyRepository extends Repository {
  /*...*/
}

const schema = new Schema();
schema.get(RepositoryRegistry).setRepositoryCtor(MyRepository);
// теперь schema.getRepository(modelName) будет возвращать
// экземпляр класса MyRepository
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
