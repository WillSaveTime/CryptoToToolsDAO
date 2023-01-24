import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {MyRouter} from 'Router'
import { store } from './app/store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MyRouter />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
