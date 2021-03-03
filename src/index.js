import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createStore} from 'redux'
//STORE

//ACTION -> dodaj u kosaru
const dodajUredaj = (id_uredaj) => {
  return{
    type: 'DODAJ',
    uredaj_id: id_uredaj
  }
}
const ukloniUredaj = (id_uredaj) => {
  return{
    type: 'UKLONI',
    uredaj_id: id_uredaj
  }
}
//REDUCER
const kosaricaCounter = (state = [], action) => {
     switch(action.type){
       case 'DODAJ':
         return state.push(action.uredaj_id)
        case 'UKLONI':
          let removed_index = state.indexOf(action.uredaj_id)
          if (removed_index > -1) {
            return state.splice(removed_index, 1);
          }
          
     }
}

let store = createStore(kosaricaCounter)
store.subscribe(() => console.log(store.getState()))
//DISPATCH

store.dispatch(dodajUredaj(1))


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    ReactDOM.render(
      <NextApp />,
      document.getElementById('root')
    )
  })
}