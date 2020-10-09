import React, { Component } from 'react';
import TopMenu from '../TopMenu/';
import './index.css';

// Main React appplication
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TopMenu></TopMenu>      
    );
  }
}

export default App;