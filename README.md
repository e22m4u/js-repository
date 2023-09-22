## @e22m4u/js-repository

Абстракция для работы с базами данных для Node.js

| адаптер | описание                                                                                                                                        |
|---------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| memory  | виртуальная база в памяти процесса (для разработки и тестирования)                                                                              |
| mongodb | MongoDB - система управления NoSQL базами данных (*[требует установки](https://www.npmjs.com/package/@e22m4u/js-repository-mongodb-adapter))* |

## Установка

```bash
npm install @e22m4u/js-repository
```

Опционально устанавливаем адаптер, например [mongodb](https://www.npmjs.com/package/@e22m4u/js-repository-mongodb-adapter)

```bash
npm install @e22m4u/js-repository-mongodb-adapter
```

## Пример

Создаем экземпляр класса `Schema`

```js
import {Schema} from '@e22m4u/js-repository';

const schema = new Schema();
```

Создаем источник данных `myMemory`

```js
schema.defineDatasource({
  name: 'myMemory', // название источника
  adapter: 'memory', // выбранный адаптер
});
```

Создаем модель `user`

```js
schema.defineModel({
  name: 'user', // название модели
  adapter: 'myMemory', // выбранный источник
  properties: { // поля модели
    name: 'string',
    age: 'number',
  },
});
```

Получаем репозиторий модели `user`

```js
const userRep = schema.getRepository('user');
```

Добавляем новую запись методом `create`

```js
const fedor = await userRep.create({
  name: 'Fedor',
  age: 24,
});

console.log(fedor);
// {
//   id: 1,
//   name: 'Fedor',
//   age: 24,
// }
```

Изменяем данные методом `patchById`

```js
const result = await userRep.patchById(
  fedor.id,
  {age: 30},
);

console.log(result);
// {
//   id: 1,
//   name: 'Fedor',
//   age: 30,
// }
```

Удаляем по идентификатору методом `deleteById`

```js
await userRep.deleteById(fedor.id); // true
```

## Репозиторий

Выполняет операции чтения и записи определенной коллекции.

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
import {Schema} from '@e22m4u/js-repository';

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

## Источник данных

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

## Модель

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

## Поля

Параметр `properties` описывает набор полей и их настройки.

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

## Тесты

```bash
npm run test
```

## Лицензия

MIT
