import '../gblconfig.js';
import Home from './pages/home';
import Status from './pages/status';
import Page from './pages/page';
import Fetch from './pages/fetch';
import { isObject } from 'lodash';
import Debug from 'debug';
import FourZeroFour from './pages/404.js';
import App from './render.js';

let debug = Debug('lodge:app:routes');

let Routes = [];

// add each page
Routes.push({ path: 'status', component: Status });
Routes.push({ path: 'page', component: Page });
Routes.push({ path: 'fetch', component: Fetch });
Routes.push({ path: 'json', component: Fetch });
Routes.push({ path: 'markdown', component: Fetch });
Routes.push({ path: 'status', component: Fetch });
Routes.push({ path: 'home', component: Home });
Routes.push({ path: '404', component: FourZeroFour });

// redirects
function sendTo404(nextState, replaceState) {
	replaceState({ nextPathname: nextState.location.pathname }, '/404')
}
Routes.push({ path: 'lost', onEnter: sendTo404 });

function sendToStatus(nextState, replaceState) {
	replaceState({ nextPathname: nextState.location.pathname }, '/status')
}
Routes.push({ path: 'disconnected', onEnter: sendToStatus })

function sendToHome(nextState, replaceState) {
	replaceState({ nextPathname: nextState.location.pathname }, '/home')
}

Routes.push({ path: '/', onEnter: sendToHome })

Routes.push({ path: '*', component: FourZeroFour })

// export
export const routeConfig = [
  { path: '/',
    component: App,
    indexRoute: { component: Home },
    catchAll: { component: FourZeroFour },
    childRoutes: Routes
  }
]

export const staticConfig = [
  { path: '/noscript/',
    component: App,
    indexRoute: { component: Home },
    catchAll: { component: FourZeroFour },
    childRoutes: Routes
  }
]

export default routeConfig

