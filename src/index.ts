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

function proxyForTunnel(proxy: Proxy): ProxyForTunnel {
  const proxyAuth = loginPass(proxy);
  const proxyAddress = hostPort(proxy);
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
  proxy: Proxy,
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
