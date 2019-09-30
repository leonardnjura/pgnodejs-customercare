import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AppNavbar from './components/AppNavbar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import { Container } from 'reactstrap';
import { loadUser } from './actions/authActions';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <AppNavbar />
          <Container>
            <TaskModal />
            <TaskList />
          </Container>
        </div>
      </Provider>
    );
  }
}

export default App;
