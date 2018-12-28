import React, { Component } from 'react';
import EditorBasic from './containers';

class App extends Component {
  render() {
    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <EditorBasic />
      </div>
    );
  }
}

export default App;
