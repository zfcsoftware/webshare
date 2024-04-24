# Webshare

This library is unofficial. It allows you to detect and automatically update the proxy list every certain period of time. Continuously requesting the proxy list link may cause your account to be disapproved. For this reason, it allows you to check if the first proxy in the existing proxy list is working and get the list if not.  No responsibility is accepted for any problems that may arise.


```js
const webshare = require('webshare');

var check = new webshare({
    url: 'https://proxy.webshare.io/api/v2/proxy/list/download/<your-hash>/-/any/username/direct/-/',
    debug: true,
    path: __dirname
})
    .cron({ ms: 30000 })
//    .getList({ forceNew: false }).then(console.log).catch(console.error)
//    .txt()
//    .checkProxy({ host: '<host>', port: '<port>', username: '<username>', password: '<password>' }).then(console.log).catch(console.error)
//    .parsed('<response-list>')
//    .req().then(console.log).catch(console.error); 

```

**url** When you click on the proxy download button in your Webshare panel, you should type the download link given to you.

**debug** If true, it logs the results and errors of each operation.

**path** Only the directory should be sent. You can send __dirname. Opens a txt file called webshare.txt at the path you send.


**.cron** The first proxy in a proxy list is checked every ms millisecond you send. If the proxy is down, the current list is retrieved and saved.

**.getList** Returns you the proxy list. If the txt is empty or there is no txt, it gets the current proxy list and returns it to you.  If the txt exists, it reads its contents and returns it. forceNew If true, it ignores the contents of the txt and sends a new request to get the current list.

**.txt** Generates if there is no txt file in the path sent. path should not be sent with the name of the txt file. runs when you start a process with new. There is no need to run extra.

**.checkProxy** Checks the proxy information sent.

**.parsed** Converts the given proxy string into jsons with host, port, username and password variables and returns array.

**.req** It sends a request to the url that returns the proxy list. Both the txt is updated and the new list is returned to you.
