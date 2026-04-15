---
title: JavaScript ES6+ 语法
---

本文面向有其他语言编程经验、但尚未接触 JavaScript 的开发者。内容按照"先会用、再深理解"的顺序编排——前半部分讲最日常的读写语法，后半部分讲 JavaScript 特有的核心机制。每个知识点都配有贴近真实业务的示例。

---

## 1. 数据类型与比较

在学具体语法之前，先了解 JavaScript 的类型系统——它和许多静态类型语言（Java、C#、TypeScript）有本质差异。

### 1.1 动态类型

JavaScript 是**动态类型**语言。变量没有固定类型，同一个变量可以先后存储不同类型的值：

```js
let value = 42;       // 现在是数字
value = 'hello';      // 现在变成字符串——完全合法
value = true;         // 再变成布尔值——仍然合法
```

这与 Java 的 `int value = 42` 形成对比——Java 声明时就锁死了类型，JavaScript 不会。灵活的代价是：运行时的类型错误只能靠测试或 TypeScript 来提前发现。

### 1.2 七种原始类型

JavaScript 有 7 种**原始类型**（Primitive），原始类型的值直接存储在变量里，赋值时产生独立副本：

| 类型 | 示例 | 说明 |
|------|------|------|
| `string` | `'hello'` | 文本。单引号、双引号、反引号均可 |
| `number` | `42`, `3.14` | 整数和浮点数统一为一种类型 |
| `boolean` | `true`, `false` | 逻辑真假 |
| `null` | `null` | 主动表示"此处为空" |
| `undefined` | `undefined` | 变量已声明但未赋值 |
| `symbol` | `Symbol('id')` | 唯一标识符，主要用于避免键名冲突 |
| `bigint` | `9007199254740991n` | 超大整数（尾部加 `n`） |

除此之外的所有值都是**对象类型**（Object）——包括普通对象 `{}`、数组 `[]`、函数，它们存储的是引用（指针），赋值时共享同一块内存。

```js
// 原始类型赋值：产生独立副本
let a = 10;
let b = a;
b = 20;
console.log(a); // 10，a 不受 b 影响

// 对象类型赋值：共享引用
const objA = { count: 10 };
const objB = objA;       // objB 和 objA 指向同一个对象
objB.count = 20;
console.log(objA.count); // 20，objA 被"顺带"修改了
```

### 1.3 typeof 检测类型

```js
typeof 'hello'       // 'string'
typeof 42            // 'number'
typeof true          // 'boolean'
typeof undefined     // 'undefined'
typeof Symbol()      // 'symbol'
typeof 42n           // 'bigint'
typeof {}            // 'object'
typeof []            // 'object'（数组也是 object）
typeof function(){}  // 'function'
typeof null          // 'object'  ← 历史遗留 bug，null 实际不是对象
```

检测数组不能用 `typeof`，应用 `Array.isArray`：

```js
Array.isArray([1, 2, 3]) // true
Array.isArray({})        // false
```

### 1.4 null 与 undefined 的区别

两者都表示"没有值"，但含义不同：

```js
// undefined：变量存在，但还没被赋值
// 就像一个抽屉——抽屉在那里，但是空的，没人放过东西
let userName;
console.log(userName); // undefined

// null：主动赋予"空"语义
// 就像一个抽屉——里面放了一张纸条写着"此处为空"
let currentUser = null; // 用户还未登录，有意为空
```

判断时注意：宽松相等 `==` 认为两者相等，严格相等 `===` 认为不同：

```js
null == undefined  // true（宽松相等，特殊规定）
null === undefined // false（严格相等，类型不同）
```

### 1.5 严格相等（===）与宽松相等（==）

JavaScript 有两套相等运算符。实践中**始终只用 `===`**，不用 `==`：

```js
// === 不做类型转换，类型不同直接返回 false
1 === 1      // true
1 === '1'    // false（一个数字，一个字符串）
0 === false  // false（一个数字，一个布尔值）

// == 会先进行隐式类型转换，结果难以预测
1 == '1'         // true（'1' 被转为数字 1）
0 == false       // true（false 被转为 0）
0 == ''          // true（'' 被转为 0）
null == undefined // true（特殊规定）
[] == false      // true（经过一连串转换后得出）
```

`==` 的转换规则非常复杂，也是 JavaScript 饱受诟病的地方之一。统一用 `===` 可以完全避免这个问题。

### 1.6 Truthy 与 Falsy

在 `if`、`while`、`&&` 等需要布尔值的地方，JavaScript 会自动将任意值转换为 `true` 或 `false`。以下 8 个值转换后为 `false`（falsy），其余所有值均为 `true`（truthy）：

```js
// 全部 falsy 值
false
0       // 数字零
-0      // 负零
0n      // BigInt 零
''      // 空字符串
null
undefined
NaN
```

容易踩坑的 truthy 值：

```js
'0'   // 非空字符串，truthy
[]    // 空数组，truthy
{}    // 空对象，truthy
```

实际应用中，常用 truthy/falsy 做简洁判断：

```js
// 判断用户是否已登录（null 和 undefined 都是 falsy）
if (currentUser) {
  showDashboard();
}

// 用 || 提供后备值——但注意 0 和 '' 也会触发后备
const title = inputTitle || '未命名';

// 只想对 null/undefined 提供后备，用 ??（见第 8 节）
const count = data.count ?? 0; // data.count 为 0 时不触发后备
```

---

## 2. 变量声明

### 2.1 三种关键字

ES6 之前只有 `var`，ES6 引入了 `let` 和 `const`。现代 JavaScript 只用 `let` 和 `const`，不用 `var`：

```js
// const：声明常量，不可重新赋值
// 规则：凡是初始化之后不需要重新赋值的变量，一律用 const
const API_BASE = 'https://api.renthub.cloud';
const user = { name: 'Tom', role: 'admin' };

// const 不可重新赋值，但对象/数组的内容可以改
user.role = 'member'; // 合法——修改的是对象的属性
user = {};            // TypeError——这是重新赋值，不允许

// let：声明可变量，需要后续修改时使用
let retryCount = 0;
retryCount += 1; // 合法
```

> 经验法则：先写 `const`，遇到报错"需要重新赋值"再改成 `let`。这样代码会更清晰——读者看到 `const` 就知道这个值不会变。

### 2.2 块级作用域

`let` 和 `const` 都是**块级作用域**——`{}` 之外访问不到：

```js
{
  let inner = 'inside';
  const also = 'here';
}
console.log(inner); // ReferenceError：inner is not defined

// 典型场景：if/for 块内的变量不会污染外部
for (let i = 0; i < 3; i++) {
  // i 只在这个 for 块内有效
}
console.log(i); // ReferenceError
```

`var` 是函数作用域，这是它的主要问题所在：

```js
for (var i = 0; i < 3; i++) {}
console.log(i); // 3——var 声明的 i 泄露到了 for 块外
```

### 2.3 三者区别速查

| | `var` | `let` | `const` |
|---|---|---|---|
| 作用域 | 函数级 | 块级 | 块级 |
| 重新赋值 | 是 | 是 | 否 |
| 变量提升 | 是（值为 undefined） | 否（暂时性死区） | 否（暂时性死区） |
| 重复声明 | 是 | 否 | 否 |

**暂时性死区（Temporal Dead Zone）**：用 `let`/`const` 声明的变量，从代码块开始到声明语句之间的区域内不可访问，访问会报 `ReferenceError`，而不是像 `var` 一样静默返回 `undefined`。这让潜在的 bug 更容易被发现。

---

## 3. 模板字符串

传统字符串拼接用 `+`，代码很啰嗦。模板字符串（Template Literal）用反引号包裹，用 `${}` 嵌入任意表达式：

```js
const name = '张明';
const orderCount = 3;

// 旧写法
const msg1 = '你好，' + name + '！你有 ' + orderCount + ' 个待处理订单。';

// 模板字符串
const msg2 = `你好，${name}！你有 ${orderCount} 个待处理订单。`;

// ${ } 内可以放任何表达式
const price = 980;
const receipt = `订单金额：${price} 元，含税：${(price * 1.09).toFixed(2)} 元`;
// '订单金额：980 元，含税：1068.20 元'

// 天然支持多行（不需要 \n 拼接）
const notification = `
亲爱的 ${name}，

您的租赁申请已审核通过。
请于 3 日内完成签约。
`;
```

---

## 4. 默认参数

函数参数可以设置默认值，调用时省略该参数（或传入 `undefined`）时使用默认值：

```js
// 旧写法：在函数体内手动判断
function createOrder(assetId, duration, depositRatio) {
  duration = duration !== undefined ? duration : 12;
  depositRatio = depositRatio !== undefined ? depositRatio : 0.3;
  // ...
}

// ES6 默认参数：简洁直观
function createOrder(assetId, duration = 12, depositRatio = 0.3) {
  return { assetId, duration, depositRatio };
}

createOrder('A001');
// { assetId: 'A001', duration: 12, depositRatio: 0.3 }

createOrder('A001', 6);
// { assetId: 'A001', duration: 6, depositRatio: 0.3 }

// 传入 undefined 等同于省略，默认值生效；传入 null 不会触发默认值
createOrder('A001', undefined, 0.5);
// { assetId: 'A001', duration: 12, depositRatio: 0.5 }
```

默认值可以引用前面的参数，也可以是任意表达式：

```js
function makeRange(start, end = start + 10) {
  return [start, end];
}
makeRange(5); // [5, 15]
```

---

## 5. 对象简写

当对象的属性名与变量名相同时，可以省略冒号和重复的名称；对象方法也可以省略 `function` 关键字：

```js
const name = 'Tom';
const age = 25;
const role = 'tenant';

// 旧写法
const user = { name: name, age: age, role: role };

// ES6 属性简写
const user = { name, age, role };

// 方法简写
const orderService = {
  baseUrl: '/api/orders',

  // 旧写法
  fetchOld: function (id) {
    return fetch(this.baseUrl + '/' + id);
  },

  // 新写法
  fetch(id) {
    return fetch(`${this.baseUrl}/${id}`);
  },

  // 计算属性名：用 [] 包裹表达式作为键名
  ['get' + 'All']() {
    return fetch(this.baseUrl);
  },
};
```

---

## 6. 字符串常用方法

字符串在 JavaScript 中是不可变的（immutable）——所有方法都返回新字符串，不修改原字符串。

### 6.1 查找与判断

```js
const desc = 'RentHub 是一个租赁市场平台';

desc.length                    // 14（字符数）
desc.includes('租赁')          // true（是否包含子串）
desc.startsWith('RentHub')     // true（是否以此开头）
desc.endsWith('平台')          // true（是否以此结尾）
desc.indexOf('是')             // 8（首次出现的索引，未找到返回 -1）
desc.lastIndexOf('a')          // -1
```

### 6.2 截取与变换

```js
const str = '  Hello, RentHub!  ';

str.trim()             // 'Hello, RentHub!'（去除两端空白）
str.trimStart()        // 'Hello, RentHub!  '（去除左端）
str.trimEnd()          // '  Hello, RentHub!'（去除右端）

'hello'.toUpperCase()  // 'HELLO'
'HELLO'.toLowerCase()  // 'hello'

// slice(start, end)：截取子串，包含 start 不含 end，支持负数
'abcdef'.slice(1, 4)   // 'bcd'
'abcdef'.slice(2)      // 'cdef'（省略 end 则截到末尾）
'abcdef'.slice(-3)     // 'def'（-3 表示从末尾倒数第 3 个字符起）
```

### 6.3 替换与分割

```js
// replace 只替换第一个匹配，replaceAll 替换全部
'aabbcc'.replace('b', 'x')    // 'axbbcc'
'aabbcc'.replaceAll('b', 'x') // 'aaxxcc'

// 用正则加 g 标志也可以全部替换
'hello'.replace(/l/g, 'r')    // 'herro'

// split 按分隔符拆成数组，join 把数组合成字符串
'2024-01-15'.split('-')       // ['2024', '01', '15']
['2024', '01', '15'].join('/') // '2024/01/15'
```

### 6.4 格式化

```js
// padStart / padEnd：填充到指定长度（常用于格式化编号）
'7'.padStart(3, '0')   // '007'
'7'.padEnd(3, '0')     // '700'

// repeat：重复字符串
'*'.repeat(5)          // '*****'

// at：支持负数索引（ES2022，等同于 str[str.length - 1]）
'hello'.at(0)          // 'h'
'hello'.at(-1)         // 'o'
```

---

## 7. 数值处理

### 7.1 number 类型基础

JavaScript 只有一种数值类型 `number`，整数和浮点数统一使用 IEEE 754 双精度浮点表示：

```js
typeof 42    // 'number'
typeof 3.14  // 'number'——和整数是同一类型

// 特殊值
Infinity    // 正无穷，如 1 / 0
-Infinity   // 负无穷，如 -1 / 0
NaN         // Not a Number，如 0 / 0 或类型转换失败

// 安全整数范围：超出此范围精度可能丢失
Number.MAX_SAFE_INTEGER  // 9007199254740991（约 900 万亿）
```

### 7.2 浮点精度问题

```js
// 所有使用 IEEE 754 的语言都有这个问题，JavaScript 也不例外
0.1 + 0.2  // 0.30000000000000004

// 处理方式一：放大为整数运算再缩回（适合金融计算）
(0.1 * 100 + 0.2 * 100) / 100  // 0.3

// 处理方式二：用 toFixed 格式化展示（返回字符串，注意！）
(0.1 + 0.2).toFixed(2)  // '0.30'

// toFixed 常用于界面展示租金金额
const rent = 3280.5;
`月租金：${rent.toFixed(2)} 元`  // '月租金：3280.50 元'
```

### 7.3 NaN 的注意事项

`NaN` 是一个特殊数值，表示"运算结果不是合法数字"，它有一个反直觉的特性：

```js
NaN === NaN  // false！NaN 不等于自身

// 因此不能用 === 判断 NaN，要用 Number.isNaN
Number.isNaN(NaN)      // true
Number.isNaN(42)       // false
Number.isNaN('hello')  // false（字符串不是 NaN）

// 全局的 isNaN 会先做类型转换，容易误判，不推荐
isNaN('hello')         // true（'hello' 被转为 NaN 后再判断，容易迷惑）
Number.isNaN('hello')  // false（更严格，推荐使用）
```

### 7.4 字符串转数值

```js
// Number()：严格转换
Number('42')      // 42
Number('3.14')    // 3.14
Number('')        // 0（空字符串转为 0，容易踩坑）
Number('42px')    // NaN（含非数字字符）
Number(null)      // 0
Number(undefined) // NaN

// parseInt()：从字符串头部解析整数，遇到非数字字符停止
parseInt('42px')       // 42（常用于解析 CSS 尺寸值）
parseInt('3.14')       // 3（截断小数）
parseInt('0xff', 16)   // 255（第二参数指定进制）
parseInt('abc')        // NaN

// parseFloat()：解析浮点数
parseFloat('3.14rem')  // 3.14
```

### 7.5 Math 对象

```js
Math.floor(3.9)    // 3（向下取整）
Math.ceil(3.1)     // 4（向上取整）
Math.round(3.5)    // 4（四舍五入）
Math.abs(-5)       // 5（绝对值）
Math.max(1, 3, 2)  // 3
Math.min(1, 3, 2)  // 1
Math.pow(2, 10)    // 1024，等同于 2 ** 10
Math.sqrt(9)       // 3
Math.random()      // [0, 1) 之间的随机浮点数

// 常用：生成指定范围的随机整数
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
randomInt(1, 6) // 模拟掷骰子

// 数值格式化
(1234567.89).toLocaleString()  // '1,234,567.89'（本地化格式）
(255).toString(16)             // 'ff'（转十六进制）
Number.isInteger(42)           // true
Number.isFinite(Infinity)      // false
```

---

## 8. 循环与迭代

### 8.1 for...of：遍历集合的值

`for...of` 是 ES6 引入的，专门用于遍历数组、字符串、Map、Set 等**可迭代对象**的值，是现代 JS 遍历集合的首选方式：

```js
const orders = ['ORD-001', 'ORD-002', 'ORD-003'];

// 遍历值
for (const id of orders) {
  console.log(id); // 'ORD-001', 'ORD-002', 'ORD-003'
}

// 同时获取索引：用 .entries()
for (const [index, id] of orders.entries()) {
  console.log(index, id); // 0 'ORD-001', 1 'ORD-002', ...
}

// 遍历字符串的每个字符
for (const char of 'hello') {
  console.log(char); // 'h', 'e', 'l', 'l', 'o'
}

// 遍历 Map 的键值对
const statusMap = new Map([['active', '正常'], ['banned', '封禁']]);
for (const [code, label] of statusMap) {
  console.log(`${code}: ${label}`);
}
```

### 8.2 for...in：遍历对象的键

`for...in` 遍历对象的**可枚举属性键**，注意它会遍历原型链上的属性，通常需要过滤：

```js
const user = { name: 'Tom', age: 20, role: 'admin' };

for (const key in user) {
  // Object.hasOwn 过滤掉原型链上的属性，只处理自身属性
  if (Object.hasOwn(user, key)) {
    console.log(`${key}: ${user[key]}`);
  }
}

// 更推荐的写法：Object.entries 配合 for...of，不会遍历原型链
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}
```

> `for...in` 不适合遍历数组，因为它遍历的是字符串形式的键（`'0'`、`'1'`...），且顺序不可靠。遍历数组用 `for...of`。

### 8.3 其他循环形式

```js
// while：先判断条件，条件为真时执行
let retries = 0;
while (retries < 3) {
  console.log(`第 ${retries + 1} 次重试`);
  retries++;
}

// do...while：先执行一次，再判断条件
// 适合"至少执行一次"的场景，例如提示用户输入直到合法
let input;
do {
  input = prompt('请输入正整数');
} while (Number(input) <= 0);

// break / continue
for (const item of [1, 2, 3, 4, 5]) {
  if (item === 3) continue; // 跳过本次迭代，继续下一个
  if (item === 5) break;    // 终止整个循环
  console.log(item);        // 输出 1 2 4
}
```

---

## 9. 数组常用方法

数组是 JavaScript 中最常用的数据结构。以下方法都是**非破坏性**的——返回新数组，不修改原数组（`sort` 和 `reverse` 例外，会原地修改）。

### 9.1 转换：map

`map` 将数组中每个元素按照规则转换为新值，返回相同长度的新数组。

可以把它理解成一条**流水线**：原数组中的每个元素进入流水线，加工成新的值后出来，组成新数组。

```js
const orders = [
  { id: 1, amount: 100, status: 'paid' },
  { id: 2, amount: 200, status: 'pending' },
  { id: 3, amount: 150, status: 'paid' },
];

// 取出每个订单的金额，组成新数组
const amounts = orders.map(order => order.amount);
// [100, 200, 150]

// 也可以转换成新的结构
const summaries = orders.map(order => ({
  id: order.id,
  label: `#${order.id} - ${order.amount} 元`,
}));
```

### 9.2 过滤：filter

`filter` 按照条件筛选元素，返回满足条件的元素组成的新数组。

```js
// 只保留已支付的订单
const paidOrders = orders.filter(order => order.status === 'paid');
// [{ id: 1, ... }, { id: 3, ... }]

// 过滤掉 null/undefined
const values = [1, null, 2, undefined, 3];
const valid = values.filter(v => v != null); // [1, 2, 3]
```

### 9.3 查找：find / findIndex

`find` 返回第一个满足条件的元素，找不到返回 `undefined`。`findIndex` 返回其索引，找不到返回 `-1`：

```js
// 根据 id 找到指定订单
const order = orders.find(o => o.id === 2);
// { id: 2, amount: 200, status: 'pending' }

const notFound = orders.find(o => o.id === 99);
// undefined

const idx = orders.findIndex(o => o.id === 2); // 1
```

### 9.4 判断：some / every

```js
// some：只要有一个满足条件就返回 true
const hasPending = orders.some(o => o.status === 'pending'); // true

// every：所有元素都满足条件才返回 true
const allPaid = orders.every(o => o.status === 'paid'); // false

// 实际用途：提交前校验表单
const fields = [nameInput, phoneInput, idInput];
const allFilled = fields.every(field => field.value.trim() !== '');
```

### 9.5 归约：reduce

`reduce` 将数组"折叠"成一个值——可以是数字、字符串，甚至另一个对象。

工作方式：从初始值出发，依次"收纳"每一个元素，最终得到一个结果。

```js
// 计算订单总金额
const total = orders.reduce((accumulator, order) => {
  return accumulator + order.amount;
}, 0); // 0 是初始值
// 0 + 100 + 200 + 150 = 450

// 链式：先过滤出已付款，再求和
const paidTotal = orders
  .filter(o => o.status === 'paid')
  .reduce((sum, o) => sum + o.amount, 0);
// 100 + 150 = 250
```

### 9.6 其他常用方法

```js
// includes：是否包含某个值（用 === 比较）
[1, 2, 3].includes(2); // true

// flat：展开嵌套数组
[[1, 2], [3, [4, 5]]].flat();          // [1, 2, 3, [4, 5]]（默认展开一层）
[[1, 2], [3, [4, 5]]].flat(Infinity);  // [1, 2, 3, 4, 5]（完全展开）

// flatMap：map + 展开一层，常用于一对多的转换
const users = [
  { name: 'Alice', tags: ['vip', 'active'] },
  { name: 'Bob',   tags: ['inactive'] },
];
const allTags = users.flatMap(u => u.tags);
// ['vip', 'active', 'inactive']

// Array.from：从可迭代对象或类数组创建数组
Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]
Array.from('hello');                          // ['h', 'e', 'l', 'l', 'o']

// sort：原地排序（会修改原数组）
const nums = [3, 1, 4, 1, 5];
nums.sort((a, b) => a - b);    // 升序 [1, 1, 3, 4, 5]
nums.sort((a, b) => b - a);    // 降序 [5, 4, 3, 1, 1]
```

---

## 10. 对象常用方法

### 10.1 遍历对象

```js
const config = { host: 'localhost', port: 3000, debug: true };

// Object.keys：只取键
Object.keys(config);    // ['host', 'port', 'debug']

// Object.values：只取值
Object.values(config);  // ['localhost', 3000, true]

// Object.entries：取键值对数组（遍历对象的最佳方式）
Object.entries(config);
// [['host', 'localhost'], ['port', 3000], ['debug', true]]

// 结合 for...of 遍历
for (const [key, value] of Object.entries(config)) {
  console.log(`${key} = ${value}`);
}
```

### 10.2 合并与复制对象

```js
const defaults = { theme: 'light', lang: 'zh-Hans', fontSize: 14 };
const userPrefs = { lang: 'en', fontSize: 16 };

// Object.assign：浅合并，将后面的属性合并到第一个参数（会修改第一个参数）
const merged = Object.assign({}, defaults, userPrefs);
// { theme: 'light', lang: 'en', fontSize: 16 }

// 展开运算符合并（更常用，更简洁，见第 12 节）
const merged = { ...defaults, ...userPrefs };
// 相同键时，后面的覆盖前面的，等同于上面的结果
```

### 10.3 其他工具方法

```js
// Object.fromEntries：键值对数组转为对象（entries 的逆操作）
const pairs = [['name', 'Tom'], ['age', 20]];
Object.fromEntries(pairs); // { name: 'Tom', age: 20 }

// 实用场景：对对象的值统一处理后重新组装
const prices = { apple: 3.5, banana: 1.2, cherry: 8.0 };
const discounted = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 0.8])
);
// { apple: 2.8, banana: 0.96, cherry: 6.4 }

// Object.hasOwn：判断属性是否是对象自身的（不含原型链），ES2022
Object.hasOwn({ a: 1 }, 'a')  // true
Object.hasOwn({ a: 1 }, 'b')  // false
```

---

## 11. 箭头函数

箭头函数是函数的简写语法，但它不只是"省几个字"——它在 `this` 的行为上和普通函数有本质区别。

### 11.1 语法

```js
// 普通函数
function add(a, b) { return a + b; }

// 箭头函数等价写法
const add = (a, b) => a + b;           // 单行表达式可省略 return 和大括号
const double = n => n * 2;             // 单参数可省略括号
const greet = () => 'hello';           // 无参数需保留空括号

// 多行函数体需要大括号，并且必须显式 return
const multiply = (a, b) => {
  const result = a * b;
  return result;
};

// 返回对象字面量时，要用括号包裹，否则 {} 会被解析为函数体
const toPoint = (x, y) => ({ x, y }); // 正确
const wrong   = (x, y) => { x, y };   // 错误：被解析为函数体内的逗号表达式
```

### 11.2 this 的绑定：箭头函数与普通函数的核心区别

普通函数的 `this` 由**调用方式**决定，在异步回调中容易丢失。箭头函数**没有自己的 `this`**，它从定义时的外层作用域继承 `this`，因此不会出现丢失问题。

想象普通函数是一个雇员——接到任务的时候，他认的"老板"是谁取决于谁叫他做事（谁调用）。箭头函数则是一个任务贴条——贴条上写的"负责人"在贴的那一刻就固定了，不会因为挪到别处就换了负责人。

```js
const orderService = {
  orderId: 'ORD-001',

  // 普通函数：this 在回调中丢失
  loadWithRegularFn() {
    setTimeout(function () {
      // 这里的 this 不再是 orderService，而是全局对象或 undefined
      console.log(this.orderId); // undefined
    }, 1000);
  },

  // 箭头函数：this 继承自 loadWithArrow，始终是 orderService
  loadWithArrow() {
    setTimeout(() => {
      console.log(this.orderId); // 'ORD-001'，正确
    }, 1000);
  },
};
```

> 在小程序事件回调、云函数的 Promise 链中，this 丢失是高频问题。箭头函数是标准解法。

---

## 12. 解构赋值

解构（Destructuring）是一种从数组或对象中**按结构提取值**并赋给变量的语法，本质上是批量赋值的简写。

### 12.1 数组解构

```js
// 旧写法
const coords = [116.4, 39.9, 50];
const lng = coords[0];
const lat = coords[1];
const alt = coords[2];

// 数组解构：按位置提取
const [lng, lat, alt] = [116.4, 39.9, 50];

// 跳过某个位置（用逗号占位）
const [, lat] = [116.4, 39.9];

// 提供默认值
const [x = 0, y = 0, z = 0] = [5, 10];
console.log(z); // 0（第三个元素不存在，用默认值）

// 交换两个变量（无需临时变量）
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1
```

### 12.2 对象解构

```js
const order = {
  id: 'ORD-001',
  amount: 1200,
  status: 'paid',
  tenant: { name: '李明', phone: '138xxxx' },
};

// 按属性名提取
const { id, amount, status } = order;

// 重命名：冒号左边是属性名，右边是新变量名
const { id: orderId, status: orderStatus } = order;
console.log(orderId); // 'ORD-001'

// 设置默认值（属性不存在或为 undefined 时使用）
const { remark = '无备注' } = order;
console.log(remark); // '无备注'

// 嵌套解构
const { tenant: { name: tenantName, phone } } = order;
console.log(tenantName); // '李明'
```

### 12.3 函数参数中解构

解构在函数参数中最常见——直接说清楚函数需要哪些字段，无需在函数体内逐一取属性：

```js
// 旧写法：接收整个对象，再取属性
function formatOrder(order) {
  return `${order.id} | ${order.tenant.name} | ¥${order.amount}`;
}

// 参数解构：声明即文档，一眼看出函数依赖哪些字段
function formatOrder({ id, amount, tenant: { name } }) {
  return `${id} | ${name} | ¥${amount}`;
}

formatOrder(order); // 'ORD-001 | 李明 | ¥1200'
```

---

## 13. 展开运算符与剩余参数

`...` 在 JavaScript 中有两种相反的用途：**展开**（把集合拆散）和**收集**（把分散的值合拢）。

### 13.1 展开运算符

```js
// 展开数组（把数组的元素拆散开来）
const first = [1, 2, 3];
const second = [4, 5, 6];

// 合并数组
const all = [...first, ...second];  // [1, 2, 3, 4, 5, 6]

// 复制数组（浅拷贝）
const copy = [...first];            // [1, 2, 3]，与 first 独立

// 展开作为函数参数
Math.max(...first);  // 3，等同于 Math.max(1, 2, 3)

// 展开对象（合并属性，相同键后者覆盖前者）
const baseConfig = { host: 'localhost', port: 3000, debug: false };
const devConfig  = { debug: true, port: 8080 };
const config = { ...baseConfig, ...devConfig };
// { host: 'localhost', port: 8080, debug: true }

// 复制对象并修改部分属性（不可变更新的常见写法）
const updatedOrder = { ...order, status: 'shipped' };
```

### 13.2 剩余参数

剩余参数用在函数定义或解构的**最后一个位置**，把剩余的值收集成数组：

```js
// 函数剩余参数：收集调用时传入的多余参数
function log(level, ...messages) {
  console.log(`[${level}]`, ...messages);
}
log('INFO', '用户登录', '来自 192.168.1.1');
// [INFO] 用户登录 来自 192.168.1.1

// 对象剩余：提取部分属性，其余收入 rest 对象
const { id, ...orderWithoutId } = order;
// id = 'ORD-001'
// orderWithoutId = { amount: 1200, status: 'paid', tenant: { ... } }
```

---

## 14. 可选链与空值合并

这两个运算符是为了安全地处理 `null`/`undefined` 而设计的，在 RentHub 的云函数数据处理中极为常见。

### 14.1 可选链（`?.`）

访问深层属性时，如果中间某一层是 `null` 或 `undefined`，传统写法会抛出 `TypeError`。可选链遇到 `null`/`undefined` 时直接短路返回 `undefined`，不报错：

```js
// 假设从数据库取回的订单数据，tenant 字段可能不存在
const order = { id: 'ORD-001' };

// 旧写法：层层判断，繁琐
const phone = order.tenant && order.tenant.profile && order.tenant.profile.phone;

// 可选链：简洁，遇到 null/undefined 直接返回 undefined
const phone = order?.tenant?.profile?.phone; // undefined，不报错

// 用于方法调用
const result = order?.format?.();   // format 方法不存在时返回 undefined

// 用于数组索引
const first = list?.[0];            // list 为 null/undefined 时返回 undefined
```

### 14.2 空值合并（`??`）

`??` 是一个二元运算符，只有左侧为 `null` 或 `undefined` 时，才返回右侧的值。这与 `||` 的区别在于：`||` 把所有 falsy 值（包括 `0`、`''`、`false`）都视为"无效"，而 `??` 只认 `null` 和 `undefined`。

```js
// 配置项中 timeout 为 0 是有意义的值，不应该被默认值覆盖
const config = { timeout: 0, label: '' };

config.timeout || 5000   // 5000（错误！0 被当作 falsy，覆盖了有效值）
config.timeout ?? 5000   // 0（正确！0 不是 null/undefined，保留原值）

config.label || '未命名' // '未命名'（错误！'' 被覆盖）
config.label ?? '未命名' // ''（正确！空字符串是有效值）

// 与可选链组合：既安全访问，又提供默认值
const lang = user?.settings?.lang ?? 'zh-Hans';
const rent = listing?.priceConfig?.monthlyRent ?? 0;
```

---

## 15. 类（Class）

ES6 的 `class` 是对 JavaScript 原型继承的语法包装，让写法更接近 Java/C# 等面向对象语言，但底层机制仍然是原型链。

### 15.1 基本用法

```js
class Asset {
  // 私有字段（ES2022）：只能在类内部访问
  #internalId;

  // constructor：实例化时自动调用
  constructor(id, title, monthlyRent) {
    this.#internalId = id;
    this.title = title;
    this.monthlyRent = monthlyRent;
    this.status = 'available';
  }

  // 实例方法
  describe() {
    return `${this.title}，月租 ${this.monthlyRent} 元，状态：${this.status}`;
  }

  // getter：用属性访问语法触发函数逻辑
  get id() {
    return this.#internalId;
  }

  // setter：拦截赋值
  set rent(value) {
    if (value < 0) throw new RangeError('租金不能为负数');
    this.monthlyRent = value;
  }

  // 静态方法：挂载在类上，不需要实例化
  static fromJSON(json) {
    return new Asset(json.id, json.title, json.monthlyRent);
  }
}

const asset = new Asset('A001', '精品单间', 2800);
asset.describe(); // '精品单间，月租 2800 元，状态：available'
asset.rent = 3000; // 通过 setter 修改
```

### 15.2 继承

```js
class RentalOrder extends Asset {
  constructor(id, title, monthlyRent, tenantId) {
    super(id, title, monthlyRent); // 必须先调用 super() 初始化父类
    this.tenantId = tenantId;
    this.status = 'rented';
  }

  // 覆盖父类方法
  describe() {
    return `${super.describe()}，租客 ID：${this.tenantId}`;
  }
}

const order = new RentalOrder('A002', '南向大两居', 5500, 'U100');
order.describe();
// '南向大两居，月租 5500 元，状态：rented，租客 ID：U100'

order instanceof RentalOrder  // true
order instanceof Asset        // true（子类实例也是父类的实例）
```

---

## 16. 错误处理

程序总会遇到意外情况，错误处理让你的代码在出错时优雅降级，而不是直接崩溃。

### 16.1 try / catch / finally

```js
// 基本结构：try 内放可能出错的代码，catch 接住错误
function parseUserInput(input) {
  try {
    const data = JSON.parse(input);
    return data;
  } catch (err) {
    // err 是 Error 对象，包含 name、message、stack
    console.error(`解析失败：${err.message}`);
    return null;
  } finally {
    // finally 无论是否出错都会执行——常用于关闭资源、清理状态
    console.log('解析流程结束');
  }
}
```

### 16.2 主动抛出错误

```js
// throw 可以抛出任何值，但约定抛出 Error 对象（包含 stack 追踪信息）
function validateRent(amount) {
  if (typeof amount !== 'number') {
    throw new TypeError(`租金必须是数字，收到的是 ${typeof amount}`);
  }
  if (amount <= 0) {
    throw new RangeError(`租金必须大于 0，收到的是 ${amount}`);
  }
}

try {
  validateRent(-500);
} catch (err) {
  console.log(err instanceof RangeError); // true
  console.log(err.message); // '租金必须大于 0，收到的是 -500'
}
```

### 16.3 内置错误类型

| 类型 | 典型触发场景 |
|------|------------|
| `Error` | 通用错误基类，可直接使用 |
| `TypeError` | 调用了 null 的方法，或参数类型错误 |
| `RangeError` | 数值超出合法范围，如 `new Array(-1)` |
| `ReferenceError` | 访问未声明的变量 |
| `SyntaxError` | 代码语法错误，通常由引擎解析时抛出 |

### 16.4 自定义错误类

```js
// 在应用层定义带有业务语义的错误类
class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} 不存在`, 404);
    this.name = 'NotFoundError';
  }
}

// 使用时可以精确区分错误类型
try {
  throw new NotFoundError('订单 ORD-999');
} catch (err) {
  if (err instanceof NotFoundError) {
    // 处理"资源不存在"的情况
    return { code: err.code, message: err.message };
  }
  throw err; // 不认识的错误，继续向上抛，不要吃掉
}
```

---

## 17. Map 与 Set

### 17.1 Map

普通对象 `{}` 只支持字符串（或 Symbol）作为键。`Map` 没有这个限制，键可以是任意类型，且保证按插入顺序遍历：

```js
const cache = new Map();

// set / get / has / delete
cache.set('user:001', { name: 'Tom' });
cache.set(42, '数字作为键');
cache.get('user:001')  // { name: 'Tom' }
cache.has('user:001')  // true
cache.size             // 2
cache.delete('user:001')
cache.clear()          // 清空所有

// 从数组初始化
const statusLabels = new Map([
  ['available', '空置'],
  ['rented', '已租'],
  ['maintenance', '维修中'],
]);

// 遍历（保持插入顺序）
for (const [status, label] of statusLabels) {
  console.log(`${status} → ${label}`);
}

// 转为数组
[...statusLabels.keys()]    // ['available', 'rented', 'maintenance']
[...statusLabels.values()]  // ['空置', '已租', '维修中']
```

**何时选 Map 而非普通对象：**
- 键需要是非字符串类型（数字、对象等）
- 需要安全地使用 `constructor`、`toString` 等名称作为键（普通对象会有原型冲突）
- 需要快速获取数量（`map.size` vs `Object.keys(obj).length`）
- 频繁增删键值对，Map 的性能更好

### 17.2 Set

`Set` 是**不包含重复值**的集合，添加已存在的值会被忽略：

```js
const tags = new Set(['vip', 'active', 'vip']); // 重复的 'vip' 被去掉
tags.size    // 2

tags.add('new')
tags.has('vip')    // true
tags.delete('vip')

// 最实用的场景：数组去重
const ids = [1, 2, 2, 3, 3, 3, 4];
const uniqueIds = [...new Set(ids)]; // [1, 2, 3, 4]

// 集合运算
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

const union        = new Set([...setA, ...setB]);                       // 并集 {1,2,3,4,5,6}
const intersection = new Set([...setA].filter(x => setB.has(x)));       // 交集 {3,4}
const difference   = new Set([...setA].filter(x => !setB.has(x)));      // 差集 {1,2}
```

---

## 18. 模块系统（ES Modules）

将代码拆分为多个文件，各文件通过 `export` 和 `import` 声明对外暴露和引用的内容。

```js
// math.js——导出
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

// 默认导出：每个文件只能有一个，导入时可自定义名称
export default class Calculator { /* ... */ }
```

```js
// main.js——导入
import Calculator from './math.js';          // 导入默认导出
import { PI, add } from './math.js';         // 导入具名导出
import { add as sum } from './math.js';      // 导入并重命名
import * as math from './math.js';           // 导入全部为命名空间

math.add(1, 2); // 2
```

> **注意 RentHub 的两套模块规范：**
> - 微信小程序云函数使用 **CommonJS**（`require` / `module.exports`）
> - Web 管理后台（React + Vite）使用 **ES Modules**（`import` / `export`）
>
> 两者不能混用，按运行环境选择正确的写法。

---

## 19. 闭包

闭包是 JavaScript 中最重要、也最容易让初学者困惑的概念，但它的核心思想并不复杂：**一个函数可以"记住"它被创建时所在作用域里的变量，即使那个作用域已经结束了**。

### 19.1 理解闭包

用一个比喻来理解：工厂生产出了一台咖啡机，咖啡机出厂后工厂就关门了——但咖啡机里还保留着制作配方（内置的变量）。你可以不断用这台咖啡机做咖啡，配方始终在里面，不会因为工厂关了就消失。

```js
// makeAdder 是"工厂"，返回的函数是"咖啡机"，n 是"配方"
function makeAdder(n) {
  // 当 makeAdder 执行完毕后，n 并不会消失
  // 它被返回的函数"记住"了
  return (x) => x + n;
}

const add5  = makeAdder(5);  // 生产一台"每次加 5 的机器"
const add10 = makeAdder(10); // 生产一台"每次加 10 的机器"

add5(3);   // 8——x=3，n=5 还在
add10(3);  // 13——x=3，n=10 还在
add5(7);   // 12——n 始终是 5，不受 add10 影响
```

每次调用 `makeAdder` 都创建了一个独立的"配方 n"，各自的机器互不干扰。

### 19.2 实际应用：封装私有状态

闭包的典型用途是创建带有私有内部状态的对象：

```js
function createOrderCounter() {
  // count 是私有的，外部无法直接访问或篡改
  let count = 0;

  return {
    increment() { count += 1; },
    decrement() { count = Math.max(0, count - 1); },
    reset()     { count = 0; },
    value()     { return count; },
  };
}

const counter = createOrderCounter();
counter.increment();
counter.increment();
counter.value();  // 2

// count 对外完全不可见，只能通过提供的方法操作
console.log(count); // ReferenceError：count is not defined
```

### 19.3 经典陷阱：循环中的闭包

```js
// 问题：var 是函数作用域，所有回调共享同一个 i
// 等到 setTimeout 的回调执行时，循环已经结束，i 已经是 3
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// 输出：3  3  3（预期是 0 1 2）

// 解决方案：改用 let
// let 是块级作用域，每次迭代创建一个全新的独立 i
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// 输出：0  1  2
```

这是 ES6 引入 `let` 后最典型的应用场景之一。

---

## 20. Promise 与 async/await 异步编程

:::danger 这是 RentHub 开发中最重要的概念之一
**所有云函数调用、数据库读写、网络请求，都是异步操作。**

如果你不理解异步，写出来的代码会在最不明显的地方出错——数据还没回来就已经在使用了，变量是 `undefined`，页面渲染出空内容，却不知道为什么。

这一节请务必仔细阅读，反复对照示例。
:::

### 20.1 为什么 JS 需要异步？

JavaScript 运行在**单线程**上——同一时刻只能做一件事，不像 Java 可以开多个线程并行处理。

如果用**同步**方式发起网络请求，线程会卡在那里死等服务器响应，期间什么都做不了：用户点按钮没反应，页面动画卡住，整个程序失去响应。这种体验是不可接受的。

**异步**的解决方案是：发出请求后立刻"放手"，去处理其他事情，等服务器响应了再回来处理结果。

用餐厅点单来比喻：你告诉服务员"我要一份炒饭"，然后就坐回去玩手机了——你不需要站在厨房门口等。厨房做好了，服务员会自动端来。这期间你一直是自由的。

在 RentHub 中，以下操作全部是"需要等服务员端菜"的异步操作：

- `wx.cloud.callFunction(...)` — 调用云函数
- `db.collection('orders').get()` — 读取数据库
- `db.collection('orders').add(...)` — 写入数据库
- `wx.request(...)` — 小程序网络请求
- `fetch(...)` — Web 端 HTTP 请求
- `wx.uploadFile(...)` — 上传文件

---

### 20.2 从回调地狱说起

最早的异步写法是**回调函数**（Callback）——"操作完成后请调用这个函数"。但多层嵌套后代码会变成难以维护的"回调地狱"：

```js
// 回调写法：查询订单，再查询对应的房源，再查询房东信息
// 每一层都嵌套在上一层的成功回调里，横向无限延伸
db.collection('orders').doc(orderId).get({
  success(orderRes) {
    const assetId = orderRes.data.assetId;
    db.collection('assets').doc(assetId).get({
      success(assetRes) {
        const landlordId = assetRes.data.landlordId;
        db.collection('users').doc(landlordId).get({
          success(userRes) {
            // 终于拿到了房东信息，但代码已经深嵌了 3 层
            console.log(userRes.data.name);
          },
          fail(err) { console.error(err); }
        });
      },
      fail(err) { console.error(err); }
    });
  },
  fail(err) { console.error(err); }
});
```

这就是"回调地狱"。错误处理分散在每一层，逻辑顺序也很难从代码结构上看清楚。

---

### 20.3 Promise：对"未来结果"的承诺

`Promise` 是用来表示"尚未完成的异步操作"的对象。它有三种状态：

- **pending（进行中）**：操作还在执行，等待结果
- **fulfilled（已成功）**：操作完成，持有结果值
- **rejected（已失败）**：操作失败，持有错误原因

状态一旦从 pending 变为 fulfilled 或 rejected，就不会再改变。

```js
// 手动创建一个 Promise（云函数底层就是这样工作的）
const fetchOrderPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const ok = true;
    if (ok) {
      resolve({ id: 'ORD-001', status: 'paid' }); // 成功，传入结果
    } else {
      reject(new Error('查询失败'));               // 失败，传入错误
    }
  }, 500);
});

// .then 处理成功结果，.catch 处理失败，.finally 无论如何都执行
fetchOrderPromise
  .then(order  => console.log('订单状态:', order.status))
  .catch(err   => console.error('出错:', err.message))
  .finally(()  => console.log('查询结束'));
```

> 实际开发中你很少需要手动 `new Promise(...)`。云函数 SDK、`fetch` 这些 API 已经返回 Promise 了，你只需要知道如何消费它。

---

### 20.4 async / await：让异步代码写起来像同步

`async/await` 是基于 Promise 的语法"改进"，它让异步代码在视觉上和同步代码一样从上到下顺序执行，极大提升可读性。这是 RentHub 项目中**统一使用的异步写法**。

**两条核心规则：**

1. 函数前加 `async`，该函数就变成了异步函数，它始终返回一个 Promise
2. 在 `async` 函数内部，`await` 关键字放在 Promise 前面，暂停执行并等待 Promise 完成，然后取出其中的值

```js
// 用 async/await 改写上面的三级查询，代码变成线性的
async function getOrderWithLandlord(orderId) {
  // 第一步：查询订单
  const orderRes = await db.collection('orders').doc(orderId).get();
  const assetId  = orderRes.data.assetId;

  // 第二步：查询房源（等第一步完成后才执行）
  const assetRes    = await db.collection('assets').doc(assetId).get();
  const landlordId  = assetRes.data.landlordId;

  // 第三步：查询房东（等第二步完成后才执行）
  const userRes = await db.collection('users').doc(landlordId).get();

  // 三步全部完成，正常返回结果
  return {
    order:    orderRes.data,
    asset:    assetRes.data,
    landlord: userRes.data,
  };
}
```

代码从嵌套 3 层变成了线性的 3 步，逻辑一目了然。

---

### 20.5 最常见的错误：忘记 await

这是新手最常犯的错误，症状是"明明有数据，变量却是 `undefined`"或者拿到的是一个 `Promise` 对象而不是真正的数据。

```js
// 错误写法：忘记 await，order 拿到的是 Promise 对象，不是数据
async function showOrder(orderId) {
  const order = db.collection('orders').doc(orderId).get(); // 忘了 await！
  console.log(order.data); // undefined——order 是 Promise，不是查询结果
}

// 正确写法
async function showOrder(orderId) {
  const order = await db.collection('orders').doc(orderId).get(); // 加上 await
  console.log(order.data); // { id: ..., status: ..., ... }
}
```

判断一个函数调用是否需要 `await` 的方法：**看它的返回值是不是 Promise**。云函数 SDK 的所有数据库操作、`wx.cloud.callFunction`、`fetch` 等，返回值都是 Promise，调用时都需要 `await`。

---

### 20.6 错误处理：try / catch

当 `await` 的 Promise 被 reject 时（即操作失败），它会像同步代码抛出异常一样，可以用 `try/catch` 捕获：

```js
// 云函数调用的标准写法
async function callGetOrder(orderId) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'order',
      data: { action: 'getDetail', orderId },
    });

    // res.result 是云函数 return 的值
    if (res.result.code !== 0) {
      // 云函数返回了业务错误（不是网络错误）
      throw new Error(res.result.message);
    }

    return res.result.data;

  } catch (err) {
    // 网络失败、云函数崩溃、或上面手动 throw 的业务错误，都在这里捕获
    console.error('获取订单失败:', err.message);
    return null; // 失败时返回 null，由调用方决定如何展示
  }
}
```

```js
// 小程序页面中的典型用法
Page({
  data: {
    order: null,
    loading: true,
    error: '',
  },

  async onLoad(options) {
    try {
      const order = await callGetOrder(options.orderId);
      this.setData({ order, loading: false });
    } catch (err) {
      this.setData({ error: '加载失败，请重试', loading: false });
    }
  },
});
```

---

### 20.7 async 函数的传播性

`async/await` 有一个重要特性：**`await` 只能在 `async` 函数内部使用**。如果一个函数调用了 `async` 函数并需要等待其结果，它自己也必须是 `async` 的。这种特性会向上传播：

```js
// 最底层：直接操作数据库（已经是 async）
async function fetchOrder(id) {
  const res = await db.collection('orders').doc(id).get();
  return res.data;
}

// 中间层：调用底层函数，需要等待结果，所以也必须是 async
async function buildOrderView(id) {
  const order = await fetchOrder(id); // 必须 await，所以函数必须是 async
  return { ...order, displayStatus: STATUS_LABELS[order.status] };
}

// 页面层：调用中间层，同样需要 async
Page({
  async onLoad(options) {               // 必须是 async
    const view = await buildOrderView(options.id);
    this.setData({ order: view });
  },
});
```

这不是设计缺陷，而是刻意的——它让代码中所有的异步调用路径都显式可见。

---

### 20.8 并发执行

多个**相互独立**的异步操作，不要串行等待，应该同时发起，节省总耗时：

```js
// 串行写法（慢）：两次查询加起来要花 t1 + t2 的时间
async function loadPageSerial(orderId, userId) {
  const order = await fetchOrder(orderId); // 先等这个完成
  const user  = await fetchUser(userId);   // 再等这个完成
  return { order, user };
}

// 并发写法（快）：两次查询同时发起，总耗时约等于较慢的那一个
async function loadPageParallel(orderId, userId) {
  const [order, user] = await Promise.all([
    fetchOrder(orderId), // 同时发起
    fetchUser(userId),   // 同时发起
  ]);
  return { order, user };
}
```

`Promise.all` 的注意点：只要**任意一个** Promise 失败，整个 `Promise.all` 就会 reject。如果需要"部分失败也照常处理"，用 `Promise.allSettled`：

```js
// Promise.allSettled：等所有 Promise 完成，无论成功还是失败
async function loadMultipleOrders(ids) {
  const results = await Promise.allSettled(
    ids.map(id => fetchOrder(id))
  );

  const orders = [];
  const errors = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      orders.push(result.value);
    } else {
      errors.push(result.reason.message);
    }
  }

  if (errors.length > 0) {
    console.warn('部分订单加载失败:', errors);
  }

  return orders;
}
```

---

### 20.9 云函数中的 async/await

云函数本身的入口函数也必须是 `async` 的（或者 `return` 一个 Promise），否则云函数会在异步操作完成之前就退出：

```js
// 云函数入口文件（正确写法）
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// exports.main 必须是 async，否则数据库操作还没完成，函数就已经返回了
exports.main = async (event, context) => {
  const { orderId } = event;

  // 所有数据库操作都需要 await
  const orderRes = await db.collection('orders').doc(orderId).get();
  const order = orderRes.data;

  if (!order) {
    return { code: 404, message: '订单不存在' };
  }

  // 更新操作同样需要 await
  await db.collection('orders').doc(orderId).update({
    data: { readAt: db.serverDate() },
  });

  return { code: 0, data: order };
};
```

```js
// 云函数中常见的错误：忘记 await 导致返回值是 undefined
exports.main = async (event, context) => {
  const orderRes = db.collection('orders').doc(event.id).get(); // 忘了 await
  return orderRes.data; // undefined！因为 orderRes 是 Promise，不是查询结果
};
```

---

### 20.10 async/await 速查卡

| 场景 | 写法 |
|------|------|
| 声明一个异步函数 | `async function fn() { ... }` 或 `const fn = async () => { ... }` |
| 等待一个异步操作 | `const result = await someAsyncFn()` |
| 处理异步错误 | `try { await ... } catch (err) { ... }` |
| 多个独立操作并发 | `await Promise.all([fn1(), fn2()])` |
| 并发但允许部分失败 | `await Promise.allSettled([fn1(), fn2()])` |
| 云函数入口 | `exports.main = async (event, context) => { ... }` |
| 小程序页面生命周期 | `async onLoad(options) { ... }` |

---

## 21. 常见模式速查

积累了前面的语法知识后，这些是日常业务代码中反复出现的高频写法。

### 21.1 深拷贝

```js
// 方案一：JSON 序列化（快，但不支持 Date、函数、循环引用、undefined）
const deep = JSON.parse(JSON.stringify(obj));

// 方案二：structuredClone（原生深拷贝，支持 Date、Map、Set 等，Node 17+/现代浏览器）
const deep = structuredClone(obj);
```

### 21.2 不可变更新对象

在 React 等响应式框架中，更新对象需要返回新对象而不是直接修改原对象：

```js
const order = { id: 1, status: 'pending', amount: 500 };

// 更新单个字段（浅拷贝 + 覆盖）
const updated = { ...order, status: 'paid' };

// 更新嵌套字段
const order2 = {
  id: 1,
  tenant: { name: '李明', phone: '138xxxx' },
};
const updated2 = {
  ...order2,
  tenant: { ...order2.tenant, phone: '139xxxx' }, // 只更新 phone
};
```

### 21.3 防抖（Debounce）

防抖用于"高频触发，只执行最后一次"的场景，例如搜索框输入：

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// 用户停止输入 300ms 后才发起搜索请求
const handleSearch = debounce(async (keyword) => {
  const results = await searchAssets(keyword);
  renderResults(results);
}, 300);
```

### 21.4 对象数组去重与分组

```js
const orders = [
  { id: 1, status: 'paid',    amount: 100 },
  { id: 2, status: 'pending', amount: 200 },
  { id: 1, status: 'paid',    amount: 100 }, // 重复
  { id: 3, status: 'paid',    amount: 150 },
];

// 按 id 去重：用 Map 保证唯一性，后出现的覆盖先出现的
const unique = [...new Map(orders.map(o => [o.id, o])).values()];
// [{ id: 1 }, { id: 2 }, { id: 3 }]

// 按 status 分组（reduce 实现）
const grouped = orders.reduce((acc, o) => {
  (acc[o.status] ??= []).push(o);
  return acc;
}, {});
// { paid: [{ id: 1 }, { id: 3 }], pending: [{ id: 2 }] }
```

### 21.5 安全访问 + 默认值（综合示例）

```js
// 假设从 API 拿到的数据结构不稳定，需要防御性编程
function getDisplayInfo(order) {
  return {
    title: order?.asset?.title ?? '未知房源',
    tenantName: order?.tenant?.name ?? '未知租客',
    monthlyRent: order?.priceConfig?.monthlyRent?.toFixed(2) ?? '0.00',
    statusLabel: STATUS_MAP[order?.status] ?? '未知状态',
  };
}
```
