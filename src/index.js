import dva from 'dva';
import { createBrowserHistory } from 'history';
import './global.less';

// 1. Initialize
const app = dva({
    history: createBrowserHistory(),
});

// 2. Plugin
app.use({});

// 3. Model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
