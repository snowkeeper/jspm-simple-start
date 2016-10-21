# jspm-simple-start
### Foundation for a SPA application with SystemJS
* Yarn
* JSPM
* React
  * server rendering
  * hot reload in dev mode
  * material-ui
* Events, Socket.io and fetch for data exchange

## To Sample
1. `mkdir ~/mySite && cd ~/mySite`
1. `yarn install jspm-simple-start`  
2. <kbd>pico index.js</kbd>
3. <kbd>var start = require('jspm-simple-start')();</kbd>
4. <kbd>ctrl+x</kbd>
5. `DEBUG=lodge:* node index.js`  


## To Use
1. `git clone git@github.com:snowkeeper/jspm-simple-start.git mySite && cd mySite`
2. `yarn install`
3. Build javascript  
  * For Development  
    * `gulp`  
  * For Production
    * `gulp production`
4. `yarn run start`
