// import simpleProxyTest from '../index';
const bodyCheck = require('../index').__get__('bodyCheck');
const proxyForTunnel = require('../index').__get__('proxyForTunnel');

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

describe('Function proxyForTunnel', () => {
  test('proxyForTunnel login password', () => {
    expect(
      proxyForTunnel({
        ipAddress: '146.185.209.244',
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
        ipAddress: '146.185.209.244',
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
        ipAddress: '146.185.209.244',
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
        ipAddress: '146.185.209.244',
        port: 9999
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999
    });
  });
  test('proxyForTunnel, NO login password, ipAddressPort in priority', () => {
    expect(
      proxyForTunnel({
        ipAddress: '999.185.209.244',
        port: 1111,
        ipAddressPort: '146.185.209.244:9999'
      })
    ).toEqual({
      host: '146.185.209.244',
      port: 9999
    });
  });
  test('proxyForTunnel ALL, ipAddressPort and loginPass in priority', () => {
    expect(
      proxyForTunnel({
        ipAddress: '999.185.209.244',
        port: 1111,
        ipAddressPort: '146.185.209.244:9999',
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

// test('simpleProxyTest - www.example.com', async () => {
//   expect(
//     await simpleProxyTest(
//       {
//         ipAddress: '146.185.209.240',
//         port: 9999,
//         login: 'myLogin',
//         password: 'myPass'
//       },
//       'www.example.com'
//     )
//   ).toBe(true);
// });
