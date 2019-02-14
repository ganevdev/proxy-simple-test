# Simple Proxy Test

[![Build Status](https://travis-ci.com/Ganevru/simple-proxy-test.svg?branch=master)](https://travis-ci.com/Ganevru/simple-proxy-test)
[![npm](https://img.shields.io/npm/v/simple-proxy-test.svg?style=flat-square)](http://npm.im/simple-proxy-test)

Очень простой тест прокси который возвращает true если тест пройден или false если нет.

Всю работу делает [node-tunnel](https://github.com/koichik/node-tunnel) и [got](https://github.com/sindresorhus/got) - это великолепная библиотека которая способна на очень многое, используете ее если вам нужно больше.

`simple-proxy-test` всегда возвращает true если тест пройден или false если не пройден.
Первый аргумент это прокси в виде строки или объекта
Второй - страница для проверки

условия для прохождения теста, по дефолту если get ответ 200 - то тест пройден

TODO нужно сделать regex - inBodyRegex

inBody - если в body ответа есть этот текст то тест пройден
notInBody - если в body ответа есть этот текст то тест НЕ пройден
notInBody всегда в приоритете так как идет последним

```bash
npm i simple-proxy-test
```

Examples:

```js
const simpleProxyTest = require('simple-proxy-test');

simpleProxyTest(
  '123.123.2.42:8080@superLogin:superPassword',
  'www.example.com',
  { inBody: '<h1>Example Domain</h1>', notInBody: '<h1>404</h1>' }
);

// return true
```
