addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// 存储拼接后的字符串，用于去重（每个请求独立）
async function handleRequest(request) {
  // 动态导入 js-yaml（从CDN加载，如果未捆绑）
  const jsyaml = await import('https://unpkg.com/js-yaml@4.1.0/dist/js-yaml.mjs');

  // 定义要发送请求的地址数组，每个元素包含一个 url 和一个类型
  const sites = [
    // Hysteria
    { url: "https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria/1/config.json", type: "hysteria" },
    { url: "https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria/config.json", type: "hysteria" },
    { url: "https://www.githubip.xyz/Alvin9999/pac2/master/hysteria/config.json", type: "hysteria" },
    { url: "https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria/config.json", type: "hysteria" },
    { url: "https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria/13/config.json", type: "hysteria" },
    { url: "https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria/2/config.json", type: "hysteria" },
    { url: "https://www.githubip.xyz/Alvin9999/pac2/master/hysteria/2/config.json", type: "hysteria" },
    { url: "https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria/2/config.json", type: "hysteria" },

    // Hysteria2
    { url: 'https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria2/1/config.json', type: "hysteria2" },
    { url: 'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria2/config.json', type: "hysteria2" },
    { url: 'https://www.githubip.xyz/Alvin9999/pac2/master/hysteria2/config.json', type: "hysteria2" },
    { url: 'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria2/config.json', type: "hysteria2" },
    { url: 'https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria2/13/config.json', type: "hysteria2" },
    { url: 'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria2/2/config.json', type: "hysteria2" },
    { url: 'https://www.githubip.xyz/Alvin9999/pac2/master/hysteria2/2/config.json', type: "hysteria2" },
    { url: 'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria2/2/config.json', type: "hysteria2" },

    // Xray
    { url: 'https://www.gitlabip.xyz/Alvin9999/pac2/master/xray/1/config.json', type: "xray" },
    { url: 'https://gitlab.com/free9999/ipupdate/-/raw/master/xray/config.json', type: "xray" },
    { url: 'https://www.githubip.xyz/Alvin9999/pac2/master/xray/config.json', type: "xray" },
    { url: 'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/xray/config.json', type: "xray" },
    { url: 'https://www.gitlabip.xyz/Alvin9999/pac2/master/xray/3/config.json', type: "xray" },
    { url: 'https://gitlab.com/free9999/ipupdate/-/raw/master/xray/2/config.json', type: "xray" },
    { url: 'https://www.githubip.xyz/Alvin9999/pac2/master/xray/2/config.json', type: "xray" },

    // Singbox
    { url: "https://gitlab.com/free9999/ipupdate/-/raw/master/singbox/config.json", type: "singbox" },
    { url: "https://www.githubip.xyz/Alvin9999/pac2/master/singbox/config.json", type: "singbox" },
    { url: "https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/singbox/config.json", type: "singbox" },
    { url: "https://www.gitlabip.xyz/Alvin9999/pac2/master/singbox/1/config.json", type: "singbox" },

    // Clash (去重后)
    { url: "https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta2/config.yaml", type: "clash" },
    { url: "https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta2/config.yaml", type: "clash" },
    { url: "https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/clash.meta2/config.yaml", type: "clash" },
    { url: "https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta2/13/config.yaml", type: "clash" },
    { url: "https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta2/2/config.yaml", type: "clash" },
    { url: "https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta2/2/config.yaml", type: "clash" },
    { url: "https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/clash.meta2/2/config.yaml", type: "clash" },
    { url: "https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta2/15/config.yaml", type: "clash" },
    { url: "https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta2/3/config.yaml", type: "clash" },
    { url: "https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta2/3/config.yaml", type: "clash" },
    { url: "https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/clash.meta2/3/config.yaml", type: "clash" },
    { url: "https://raw.githubusercontent.com/Alvin9999/pac2/master/quick/4/config.yaml", type: "clash" },
    { url: "https://raw.githubusercontent.com/Alvin9999/pac2/master/quick/1/config.yaml", type: "clash" },
    { url: "https://raw.githubusercontent.com/Alvin9999/pac2/master/quick/config.yaml", type: "clash" },
    { url: "https://raw.githubusercontent.com/Alvin9999/pac2/master/quick/3/config.yaml", type: "clash" },

    // Naive
    { url: "https://www.gitlabip.xyz/Alvin9999/PAC/master/naiveproxy/1/config.json", type: "naive" },
    { url: "https://gitlab.com/free9999/ipupdate/-/raw/master/naiveproxy/config.json", type: "naive" },
    { url: "https://www.githubip.xyz/Alvin9999/PAC/master/naiveproxy/config.json", type: "naive" },
    { url: "https://fastly.jsdelivr.net/gh/Alvin9999/PAC@latest/naiveproxy/config.json", type: "naive" },
  ];

  const uniqueStrings = new Set();

  // 遍历所有地址并发送请求
  const promises = sites.map(site => fetchData(site, uniqueStrings));
  await Promise.all(promises);

  const mergedContent = Array.from(uniqueStrings).join("\n");

  const encoder = new TextEncoder();
  const bufferFromStr = encoder.encode(mergedContent);

  // 使用 btoa 将二进制数据转为 Base64 编码的字符串
  const base64Str = btoa(String.fromCharCode(...new Uint8Array(bufferFromStr)));

  return new Response(base64Str, {
    headers: { 'Content-Type': 'text/plain' },
  });
}

// 发送请求并处理响应
async function fetchData(site, uniqueStrings) {
  try {
    const response = await fetch(site.url);
    if (!response.ok) {
      console.error(`Failed to fetch ${site.url}: ${response.status}`);
      return;
    }

    let data;
    if (site.type === 'clash') {
      data = await response.text();
    } else {
      data = await response.json();
    }

    // 根据类型选择对应的处理函数
    if (site.type === "hysteria") {
      processHysteria(data, uniqueStrings);
    } else if (site.type === "hysteria2") {
      processHysteria2(data, uniqueStrings);
    } else if (site.type === "xray") {
      processXray(data, uniqueStrings);
    } else if (site.type === 'singbox') {
      processSingbox(data, uniqueStrings);
    } else if (site.type === 'clash') {
      processClash(data, uniqueStrings);
    } else if (site.type === 'naive') {
      processNaive(data, uniqueStrings);
    }
  } catch (error) {
    console.error(`Error fetching data from ${site.url}: ${error}`);
  }
}

// 处理 Hysteria 数据
function processHysteria(data, uniqueStrings) {
  const up_mbps = data.up_mbps || 50;
  const down_mbps = data.down_mbps || 80;
  const auth_str = data.auth_str || '';
  const server_name = data.server_name || '';
  const alpn = data.alpn || 'h3';
  const server = data.server || '';

  const formattedString = `hysteria://${server}?upmbps=${up_mbps}&downmbps=${down_mbps}&auth=${auth_str}&insecure=1&peer=${server_name}&alpn=${alpn}`;
  uniqueStrings.add(formattedString);
}

// 处理 Hysteria2 数据
function processHysteria2(data, uniqueStrings) {
  const auth = data.auth || '';
  const server = data.server || '';
  const insecure = data.tls?.insecure ? 1 : 0;
  const sni = data.tls?.sni || '';

  const formattedString = `hysteria2://${auth}@${server}?insecure=${insecure}&sni=${sni}`;
  uniqueStrings.add(formattedString);
}

// 处理 Xray 数据
function processXray(data, uniqueStrings) {
  const outboundConfig = data.outbounds?.[0] || {};
  const protocol = outboundConfig.protocol || 'vless';
  const id = outboundConfig.settings?.vnext?.[0]?.users?.[0]?.id || '';
  const address = outboundConfig.settings?.vnext?.[0]?.address || '';
  const port = outboundConfig.settings?.vnext?.[0]?.port || 443;
  const encryption = outboundConfig.settings?.vnext?.[0]?.users?.[0]?.encryption || 'none';
  const type = outboundConfig.streamSettings?.network || 'tcp';
  const security = outboundConfig.streamSettings?.security || 'tls';
  let sni = outboundConfig.streamSettings?.tlsSettings?.serverName || '';
  let fp = outboundConfig.streamSettings?.tlsSettings?.fingerprint || 'chrome';
  const path = outboundConfig.streamSettings?.wsSettings?.path || '';
  const host = outboundConfig.streamSettings?.wsSettings?.headers?.Host || '';

  const formattedString = `${protocol}://${id}@${address}:${port}?security=${security}&sni=${sni}&fp=${fp}&type=${type}&path=${path}&host=${host}`;
  uniqueStrings.add(formattedString);
}

// 处理 Singbox 数据
function processSingbox(data, uniqueStrings) {
  const outbounds = data.outbounds?.[0] || {};
  const up_mbps = outbounds.up_mbps || 50;
  const down_mbps = outbounds.down_mbps || 80;
  const auth_str = outbounds.auth_str || '';
  const server_name = outbounds.tls?.server_name || '';
  const alpn = outbounds.tls?.alpn?.[0] || 'h3';
  const server = outbounds.server || '';
  const port = outbounds.server_port || 443;

  const formattedString = `hysteria://${server}:${port}?upmbps=${up_mbps}&downmbps=${down_mbps}&auth=${auth_str}&insecure=1&peer=${server_name}&alpn=${alpn}`;
  uniqueStrings.add(formattedString);
}

// 处理 Clash 数据
function processClash(data, uniqueStrings) {
  // 解析 YAML 内容（使用动态导入的 jsyaml）
  const content = jsyaml.load(data);
  const proxies = content.proxies || [];

  proxies.forEach(proxy => {
    const type = proxy.type;
    const name = proxy.name || type;

    if (type === 'hysteria') {
      const server = proxy.server || '';
      const port = proxy.port || 443;
      const protocol = proxy.protocol || 'udp';
      let up = proxy.up;
      if (typeof up === 'string') up = parseInt(up.match(/\d+/)?.[0] || 50, 10);
      let down = proxy.down;
      if (typeof down === 'string') down = parseInt(down.match(/\d+/)?.[0] || 80, 10);
      const ports = proxy.ports || '';
      const obfs = proxy.obfs || '';
      const fast_open = proxy['fast-open'] ?? 1;
      const auth = proxy['auth-str'] || proxy['auth_str'] || '';
      const insecure = 1;
      const alpn = proxy.alpn?.[0] || 'h3';
      const sni = proxy.sni || '';

      const formattedString = `hysteria://${server}:${port}?peer=${sni}&upmbps=${up}&downmbps=${down}&auth=${auth}&obfs=${obfs}&mport=${ports}&protocol=${protocol}&fastopen=${fast_open}&insecure=${insecure}&alpn=${alpn}#${name}`;
      uniqueStrings.add(formattedString);
    } else if (type === 'hysteria2') {
      const server = proxy.server || '';
      const port = proxy.port || 443;
      const auth = proxy.password || '';
      const obfs = proxy.obfs || '';
      const obfs_password = proxy['obfs-password'] || '';
      const sni = proxy.sni || '';
      const insecure = proxy['skip-cert-verify'] ? 1 : 0;
      const protocol = proxy.protocol || 'udp';

      const formattedString = `hysteria2://${auth}@${server}:${port}?insecure=${insecure}&sni=${sni}&obfs=${obfs}&obfs-password=${obfs_password}#${name}`;
      uniqueStrings.add(formattedString);
    } else if (type === 'vless') {
      const server = proxy.server || '';
      const port = proxy.port || 443;
      const uuid = proxy.uuid || '';
      const network = proxy.network || 'tcp';
      const tls = proxy.tls ? 'tls' : 'none';
      const sni = proxy.servername || '';
      const flow = proxy.flow || '';
      const realityOpts = proxy['reality-opts'] || {};
      const publicKey = realityOpts['public-key'] || '';
      const short_id = realityOpts['short-id'] || '';
      const fp = proxy['client-fingerprint'] || '';
      const insecure = proxy['skip-cert-verify'] ? 1 : 0;
      const grpcOpts = proxy['grpc-opts'] || {};
      const grpc_serviceName = grpcOpts['grpc-service-name'] || '';
      const ws_opts = proxy['ws-opts'] || {};
      const ws_path = ws_opts.path || '';
      const ws_headers = ws_opts.headers || {};
      const ws_headers_host = ws_headers.Host || '';
      let security = tls;
      if (tls === 'tls' && publicKey) security = 'reality';

      const formattedString = `vless://${uuid}@${server}:${port}?security=${security}&allowInsecure=${insecure}&flow=${flow}&type=${network}&fp=${fp}&pbk=${publicKey}&sid=${short_id}&sni=${sni}&serviceName=${grpc_serviceName}&path=${ws_path}&host=${ws_headers_host}#${name}`;
      uniqueStrings.add(formattedString);
    } else if (type === 'vmess') {
      const server = proxy.server || '';
      const port = proxy.port || 443;
      const uuid = proxy.uuid || '';
      const network = proxy.network || 'tcp';
      const alterId = proxy.alterId || 0;
      const tls = proxy.tls ? 'tls' : 'none';
      const sni = proxy.servername || '';
      const fp = proxy['client-fingerprint'] || '';
      const insecure = proxy['skip-cert-verify'] ? 1 : 0;
      const ws_opts = proxy['ws-opts'] || {};
      const ws_path = ws_opts.path || '';
      const ws_headers = ws_opts.headers || {};
      const ws_headers_host = ws_headers.Host || '';

      const formattedString = `vmess://${uuid}@${server}:${port}?security=${tls}&allowInsecure=${insecure}&type=${network}&fp=${fp}&sni=${sni}&path=${ws_path}&host=${ws_headers_host}&alterId=${alterId}#${name}`;
      uniqueStrings.add(formattedString);
    } else if (type === 'tuic') {
      const server = proxy.server || '';
      const port = proxy.port || 443;
      const uuid = proxy.uuid || '';
      const password = proxy.password || '';
      const sni = proxy.sni || '';
      const insecure = 1;
      const congestion = proxy['congestion-controller'] || 'bbr';
      const udp_relay_mode = proxy['udp-relay-mode'] || 'native';
      const alpn = proxy.alpn?.[0] || 'h3';

      const formattedString = `tuic://${uuid}:${password}@${server}:${port}?sni=${sni}&congestion_control=${congestion}&udp_relay_mode=${udp_relay_mode}&alpn=${alpn}&allow_insecure=${insecure}#${name}`;
      uniqueStrings.add(formattedString);
    } else if (type === 'ss') {
      const server = proxy.server || '';
      const port = proxy.port || 443;
      const password = proxy.password || '';
      const cipher = proxy.cipher || 'aes-128-gcm';

      const ss_config = `${cipher}:${password}`;
      const base64_config = btoa(ss_config);
      const formattedString = `ss://${base64_config}@${server}:${port}#${name}`;
      uniqueStrings.add(formattedString);
    } else if (type === 'ssr') {
      const server = proxy.server || '';
      const port = proxy.port || 443;
      const password = btoa(proxy.password || '');
      const cipher = proxy.cipher || 'aes-128-gcm';
      const obfs = proxy.obfs || 'plain';
      const protocol = proxy.protocol || 'origin';
      const protocol_param = btoa(proxy['protocol-param'] || '');
      const obfs_param = btoa(proxy['obfs-param'] || '');

      const ssr_source = `${server}:${port}:${protocol}:${cipher}:${obfs}:${password}/?obfsparam=${obfs_param}&protoparam=${protocol_param}&remarks=${name}`;
      const base64_ssr = btoa(ssr_source);
      const formattedString = `ssr://${base64_ssr}`;
      uniqueStrings.add(formattedString);
    }
  });
}

// 处理 Naive 数据
function processNaive(data, uniqueStrings) {
  const proxy_str = data.proxy || ''; // 假设是如 "https://user:pass@host:port"
  // 生成标准 Naive URL，例如 naive+https://...
  const naive_url = `naive+${proxy_str}`;
  const base64_naive = btoa(naive_url);
  uniqueStrings.add(base64_naive);
}
