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
1. <kbd>mkdir ~/mySite && cd ~/mySite</kbd>
1. <kbd>yarn install jspm-simple-start</kbd> 
3. <kbd>gulp production</kbd> 
2. <kbd>pico index.js</kbd>
3. <kbd>var start = require('jspm-simple-start')();</kbd>
4. <kbd>ctrl+x</kbd>
5. <kbd>DEBUG=lodge:* node index.js</kbd>  


## To Use
1. <kbd>git clone git@github.com:snowkeeper/jspm-simple-start.git mySite && cd mySite</kbd>
2. <kbd>yarn install</kbd>
3. Build javascript  
  * For Development  
    * <kbd>gulp</kbd>  
  * For Production
    * <kbd>gulp production</kbd>
4. <kbd>yarn run start</kbd>
