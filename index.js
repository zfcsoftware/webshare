const fs = require('fs'),
    axios = require('axios'),
    { HttpsProxyAgent } = require("https-proxy-agent")


class webshare {
    constructor({ url = '', path = '', debug = false }) {
        if (!url) throw new Error('url is required');
        if (!path) path = __dirname;

        this.debug = debug;
        this.path = path;
        this.item_path = path + '/webshare.txt';
        this.url = url;
        this.txt();
    }
    async req() {
        var ts = this
        return await axios({
            method: 'GET',
            url: this.url,
            headers: {
                'Host': 'proxy.webshare.io',
                'Sec-Ch-Ua': '"Chromium";v="123", "Not:A-Brand";v="8"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Linux"',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.122 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Sec-Fetch-Dest': 'document',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Priority': 'u=0, i',
                'Connection': 'close'
            }
        })
            .then(response => {
                response = String(response.data);
                if (response && response.includes(':') && response.includes('.')) {
                    fs.writeFileSync(ts.item_path, response, 'utf8');
                    return response
                }
                if (ts.debug) console.log(response);
                return false;
            })
            .catch(error => {
                console.error(error.message);
                return false;
            });
    }
    clearstr(str) {
        return str
            .replace(/\r/g, '')
            .replace(/\t/g, '')
            .replace(/\n/g, '')
            .replace(/ /g, '')
    }
    parsed(str) {
        try {
            var ts = this;
            return {
                list: str,
                parsed: str.split('\n')
                    .filter(item => item.length > 0 && item.includes(':') && item.includes('.'))
                    .map((item, i) => {
                        return {
                            host: ts.clearstr(item.split(':')[0]),
                            port: ts.clearstr(item.split(':')[1]),
                            username: ts.clearstr(item.split(':')[2]),
                            password: ts.clearstr(item.split(':')[3]),
                            index: i
                        }
                    })
            }
        } catch (e) {
            return {
                list: str
            }
        }
    }

    async checkProxy({ host = '', port = '', username = '', password = '' }) {
        var httpsAgent = new HttpsProxyAgent(`http://${username}:${password}@${host}:${port}`),
            ts = this;
        return await axios({
            method: 'GET',
            url: 'https://api.ipify.org',
            httpsAgent: httpsAgent
        })
            .then(response => {
                if (ts.debug) console.log(response.data);
                return true
            })
            .catch(error => {
                if (ts.debug) console.log(error.message);
                return false
            });
    }

    async getList({ forceNew = false }) {
        var list = fs.readFileSync(this.item_path, 'utf8');
        if (list && list.includes(':') && list.includes('.') && forceNew === false) return this.parsed(list);
        var response = await this.req();
        if (!response) return false;
        return this.parsed(response);
    }

    cron({ ms = 60000 }) {
        var ts = this
        setInterval(async () => {
            if (ts.debug) console.log('Check...');;
            var list = await ts.getList({});
            if (!list) return false;
            var check = await ts.checkProxy(list.parsed[0]);
            if (ts.debug) console.log(check ? 'Proxy is working' : 'Proxy is not working');
            if (!check) await ts.req();
            return true;
        }, ms);
    }

    txt() {
        if (!fs.existsSync(this.item_path)) fs.writeFileSync(this.item_path, '', 'utf8');
        return true;
    }

}

module.exports = webshare;


