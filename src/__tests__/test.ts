// import proxySimpleTest from '../index';
const bodyCheck = require('../index').__get__('bodyCheck');
const proxyForTunnel = require('../index').__get__('proxyForTunnel');
const proxyFromString = require('../index').__get__('proxyFromString');
const optionFromString = require('../index').__get__('optionFromString');

/* eslint-disable @typescript-eslint/explicit-function-return-type */

describe('optionFromString', () => {
  test('optionFromString string', () => {
    expect(optionFromString('test text')).toEqual({ inBody: 'test text' });
  });
  test('optionFromString obj', () => {
    expect(optionFromString({ inBody: 'test text' })).toEqual({
      inBody: 'test text'
    });
  });
  test('optionFromString undefined', () => {
    expect(optionFromString(undefined)).toBe(undefined);
  });
});

describe('proxyFromString', () => {
  test('proxyFromString string', () => {
    expect(
      proxyFromString('123.123.2.42:8080@superLogin:superPassword')
    ).toEqual({
      host: '123.123.2.42',
      port: '8080',
      login: 'superLogin',
      password: 'superPassword'
    });
  });
  test('proxyFromString object', () => {
    expect(
      proxyFromString({
        host: '123.123.2.42',
        port: '8080',
        login: 'superLogin',
        password: 'superPassword'
      })
    ).toEqual({
      host: '123.123.2.42',
      port: '8080',
      login: 'superLogin',
      password: 'superPassword'
    });
  });
});

describe('Function bodyCheck', () => {
  test('bodyCheck inBody true', () => {
    expect(
      bodyCheck('<body><h1>Example Domain</h1></body>', {
        inBody: 'Example Domain'
      })
    ).toBe(true);
  });
  test('bodyCheck inBody false', () => {
    expect(
      bodyCheck('<body><h1>Example Domain</h1></body>', {
        inBody: '404'
      })
    ).toBe(false);
  });
  test('bodyCheck notInBody false', () => {
    expect(
      bodyCheck('<body><h1>Example Domain</h1></body>', {
        notInBody: 'Example Domain'
      })
    ).toBe(false);
  });
  test('bodyCheck notInBody true', () => {
    expect(
      bodyCheck('<body><h1>Example Domain</h1></body>', {
        notInBody: '404'
      })
    ).toBe(true);
  });
  test('bodyCheck inBody notInBody false - notInBody in priority', () => {
    expect(
      bodyCheck('<body><h1>Example Domain</h1></body>', {
        notInBody: 'Example Domain',
        inBody: 'Example Domain'
      })
    ).toBe(false);
  });
});

describe('Function proxyForTunnel - Object', () => {
  test('proxyForTunnel login password', () => {
    expect(
      proxyForTunnel({
        host: '146.185.209.244',
        port: 9999,
        login: 'myLogin',
        password: 'myPass'
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999,
      proxyAuth: 'myLogin:myPass'
    });
  });
  test('proxyForTunnel loginPass', () => {
    expect(
      proxyForTunnel({
        host: '146.185.209.244',
        port: 9999,
        loginPass: 'myLogin:myPass'
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999,
      proxyAuth: 'myLogin:myPass'
    });
  });
  test('proxyForTunnel loginPass login password', () => {
    expect(
      proxyForTunnel({
        host: '146.185.209.244',
        port: 9999,
        loginPass: 'myLogin:myPass',
        login: 'someMyLogin',
        password: 'someMyPass'
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999,
      proxyAuth: 'myLogin:myPass'
    });
  });
  test('proxyForTunnel NO login password', () => {
    expect(
      proxyForTunnel({
        host: '146.185.209.244',
        port: 9999
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999
    });
  });
  test('proxyForTunnel, NO login password, hostPort in priority', () => {
    expect(
      proxyForTunnel({
        host: '999.185.209.244',
        port: 1111,
        hostPort: '146.185.209.244:9999'
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999
    });
  });
  test('proxyForTunnel ALL, hostPort and loginPass in priority', () => {
    expect(
      proxyForTunnel({
        host: '999.185.209.244',
        port: 1111,
        hostPort: '146.185.209.244:9999',
        loginPass: 'myLogin:myPass',
        login: 'someMyLogin',
        password: 'someMyPass'
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999,
      proxyAuth: 'myLogin:myPass'
    });
  });
});

describe('Function proxyForTunnel - String', () => {
  test('proxyForTunnel login password', () => {
    expect(proxyForTunnel('146.185.209.244:9999@myLogin:myPass')).toEqual({
      host: '146.185.209.244',
      port: 9999,
      proxyAuth: 'myLogin:myPass'
    });
  });
  test('proxyForTunnel loginPass', () => {
    expect(
      proxyForTunnel({
        host: '146.185.209.244',
        port: 9999,
        loginPass: 'myLogin:myPass'
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999,
      proxyAuth: 'myLogin:myPass'
    });
  });
  test('proxyForTunnel loginPass login password', () => {
    expect(
      proxyForTunnel({
        host: '146.185.209.244',
        port: 9999,
        loginPass: 'myLogin:myPass',
        login: 'someMyLogin',
        password: 'someMyPass'
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999,
      proxyAuth: 'myLogin:myPass'
    });
  });
  test('proxyForTunnel NO login password', () => {
    expect(
      proxyForTunnel({
        host: '146.185.209.244',
        port: 9999
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999
    });
  });
  test('proxyForTunnel, NO login password, hostPort in priority', () => {
    expect(
      proxyForTunnel({
        host: '999.185.209.244',
        port: 1111,
        hostPort: '146.185.209.244:9999'
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999
    });
  });
  test('proxyForTunnel ALL, hostPort and loginPass in priority', () => {
    expect(
      proxyForTunnel({
        host: '999.185.209.244',
        port: 1111,
        hostPort: '146.185.209.244:9999',
        loginPass: 'myLogin:myPass',
        login: 'someMyLogin',
        password: 'someMyPass'
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999,
      proxyAuth: 'myLogin:myPass'
    });
  });
});

describe('Function proxyForTunnel - Object wish empty', () => {
  test('proxyForTunnel empty login password', () => {
    expect(
      proxyForTunnel({
        host: '146.185.209.244',
        port: 9999,
        login: '',
        password: ''
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999
    });
  });
  test('proxyForTunnel empty loginPass', () => {
    expect(
      proxyForTunnel({
        host: '146.185.209.244',
        port: 9999,
        loginPass: ''
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999
    });
  });
  test('proxyForTunnel empty loginPass login password', () => {
    expect(
      proxyForTunnel({
        host: '146.185.209.244',
        port: 9999,
        loginPass: '',
        login: '',
        password: ''
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999
    });
  });
  test('proxyForTunnel ALL, hostPort and loginPass in priority, empty login and pass', () => {
    expect(
      proxyForTunnel({
        host: '999.185.209.244',
        port: 1111,
        hostPort: '146.185.209.244:9999',
        loginPass: '',
        login: '',
        password: ''
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999
    });
  });
});
