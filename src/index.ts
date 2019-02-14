import got from 'got';
import tunnel from 'tunnel';
import splitProxy from 'split-proxy';

interface Proxy {
  ipAddress?: string;
  port?: number | string;
  ipAddressPort?: string;
  login?: string;
  password?: string;
  loginPass?: string;
}

function bodyCheck(
  reqBody: string,
  options?: { inBody?: string; notInBody?: string }
): boolean {
  if (options) {
    if (options.notInBody && reqBody.includes(options.notInBody)) {
      return false;
    }
    if (options.inBody && !reqBody.includes(options.inBody)) {
      return false;
    }
    return true;
  } else {
    return true;
  }
}

function loginPass(proxy: Proxy): string {
  if (
    proxy.loginPass &&
    proxy.loginPass !== '' &&
    proxy.loginPass.includes(':')
  ) {
    return proxy.loginPass;
  }
  if (
    proxy.login &&
    proxy.login !== '' &&
    proxy.password &&
    proxy.password !== ''
  ) {
    return proxy.login + ':' + proxy.password;
  }
  return '';
}

function hostPort(proxy: Proxy): { host: string; port: number } {
  if (proxy.ipAddressPort && proxy.ipAddressPort !== '') {
    return {
      host: splitProxy(proxy.ipAddressPort).ipAddress,
      port: Number(splitProxy(proxy.ipAddressPort).port)
    };
  }
  if (
    proxy.ipAddress &&
    proxy.ipAddress !== '' &&
    proxy.port &&
    proxy.port !== ''
  ) {
    return { host: proxy.ipAddress, port: Number(proxy.port) };
  }
  return { host: '', port: NaN };
}

interface ProxyForTunnel {
  host: string;
  port: number;
  proxyAuth?: string;
}

function proxyFromString(proxy: Proxy | string): Proxy {
  if (typeof proxy === 'string') {
    return {
      ipAddress: splitProxy(proxy).ipAddress,
      port: splitProxy(proxy).port,
      login: splitProxy(proxy).login,
      password: splitProxy(proxy).password
    };
  } else {
    return proxy;
  }
}

function proxyForTunnel(proxy: Proxy | string): ProxyForTunnel {
  const proxyAuth = loginPass(proxyFromString(proxy));
  const proxyAddress = hostPort(proxyFromString(proxy));

  if (proxyAuth && proxyAuth !== '') {
    return {
      host: proxyAddress.host,
      port: proxyAddress.port,
      proxyAuth: proxyAuth
    };
  } else {
    return {
      host: proxyAddress.host,
      port: proxyAddress.port
    };
  }
}

async function simpleProxyTest(
  proxy: Proxy | string,
  link: string,
  options?: { inBody?: string; notInBody?: string }
): Promise<boolean> {
  const tunnelingAgent = await tunnel.httpOverHttp({
    proxy: proxyForTunnel(proxy)
  });
  try {
    const req = await got(link, {
      agent: tunnelingAgent
    });
    if (req.statusCode === 200) {
      return bodyCheck(req.body, options);
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
  //
}
// (async () => {
//   console.log(
//     await simpleProxyTest(
//       {
//         ipAddress: '146.185.209.244',
//         port: 10290,
//         login: 'myLogin',
//         password: 'myPass'
//       },
//       'example.com'
//     )
//   );
// })();

module.exports = simpleProxyTest;
export default simpleProxyTest;
