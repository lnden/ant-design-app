import './polyfill';
import dva from 'dva';
import createLoading from 'dva-loading';
import createImmer from 'dva-immer';
import { createBrowserHistory } from 'history';
import './global.less';

// 1. Initialize
const app = dva({
    history: createBrowserHistory(),
});

// 2. Plugin
app.use(createLoading());
app.use(createImmer());

// 3. Model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
