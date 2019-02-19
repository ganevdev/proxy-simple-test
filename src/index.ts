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

interface Options {
  inBody?: string;
  notInBody?: string;
}

function optionFromString(options?: Options | string): Options | undefined {
  if (options) {
    if (typeof options === 'string') {
      return {
        inBody: options
      };
    } else {
      return options;
    }
  }
}

function bodyCheck(reqBody: string, options?: Options): boolean {
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

async function proxySimpleTest(
  proxy: Proxy | string,
  link: string,
  options?: Options | string
): Promise<boolean> {
  const tunnelingAgent = await tunnel.httpOverHttp({
    proxy: proxyForTunnel(proxy)
  });
  try {
    const req = await got(link, {
      agent: tunnelingAgent,
      timeout: 5000
    });
    if (req.statusCode === 200) {
      return bodyCheck(req.body, optionFromString(options));
    } else {
      return false;
    }
  } catch (error) {
    // console.error('error: ' + error);
    return false;
  }
  //
}
// (async () => {
//   await console.log(
//     await proxySimpleTest(
//       {
//         ipAddress: '146.185.209.255',
//         port: 8080,
//         login: 'myLogin',
//         password: 'myPass'
//       },
//       'example.com'
//     )
//   );
// })();
// (async () => {
//   await console.log(
//     await proxySimpleTest(
//       '146.185.209.255:8080@myLogin:myPass',
//       'example.com'
//     )
//   );
// })();

module.exports = proxySimpleTest;
export default proxySimpleTest;
