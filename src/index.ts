import got from 'got';
import splitProxy from 'split-proxy';
import tunnel from 'tunnel';

interface ProxyObject {
  host?: string;
  port?: number | string;
  hostPort?: string;
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
  } else {
    return undefined;
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

function loginPass(proxy: ProxyObject): string {
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

function hostPort(proxy: ProxyObject): { host: string; port: number } {
  if (proxy.hostPort && proxy.hostPort !== '') {
    return {
      host: splitProxy(proxy.hostPort).host,
      port: Number(splitProxy(proxy.hostPort).port)
    };
  }
  if (proxy.host && proxy.host !== '' && proxy.port && proxy.port !== '') {
    return { host: proxy.host, port: Number(proxy.port) };
  }
  return { host: '', port: NaN };
}

interface ProxyForTunnel {
  host: string;
  port: number;
  proxyAuth?: string;
}

function proxyFromString(proxy: ProxyObject | string): ProxyObject {
  if (typeof proxy === 'string') {
    return {
      host: splitProxy(proxy).host,
      port: splitProxy(proxy).port,
      login: splitProxy(proxy).login,
      password: splitProxy(proxy).password
    };
  } else {
    return proxy;
  }
}

function proxyForTunnel(proxy: ProxyObject | string): ProxyForTunnel {
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
  proxy: ProxyObject | string,
  link: string,
  options: Options | string,
  gotLib: any = got
): Promise<boolean> {
  const tunnelingAgent = await tunnel.httpOverHttp({
    proxy: proxyForTunnel(proxy)
  });
  try {
    const req = await gotLib.get(link, {
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
//         host: '146.185.209.255',
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
