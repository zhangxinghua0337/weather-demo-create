import React from 'react';
import Weather from './components/Weather/index';
import { Provider } from 'react-redux';
import { store } from './store/index';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Weather />
      </div>
    </Provider>
  );
}

export default App;
