import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';

// import i18n (needs to be bundled ;))
import './i18n';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
