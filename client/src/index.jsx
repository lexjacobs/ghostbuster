import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
// import App from './components/App';
import AppWithoutAuth from './components/AppWithoutAuth';

require('./styles.css');

ReactDOM.render(<AppWithoutAuth />, document.getElementById('app'));
