import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
// 处理异步状态
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import BossInfo from './container/bossinfo/bossinfo'
import GeniusInfo from './container/geniusinfo/geniusinfo'
import reducers from './reducer'
import AuthRoute from './component/authroute/authroute'
import Dashboard from './component/dashboard/dashboard'
import Login from './container/login/login'
import Register from './container/register/register'
import Chat from './component/chat/chat'
import './config'
import './index.css'

const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))

// boss genius me msg 4个页面
ReactDOM.render(
  (
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <AuthRoute></AuthRoute>
          <Switch>
            <Route path='/bossinfo' component={BossInfo}></Route>
            <Route path='/geniusinfo' component={GeniusInfo}></Route>
            <Route path='/login' component={Login}></Route>
            <Route path='/register' component={Register}></Route>
            <Route path='/chat/:user' component={Chat}></Route>
            <Route component={Dashboard}></Route>
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  ),
  document.getElementById('root')
)