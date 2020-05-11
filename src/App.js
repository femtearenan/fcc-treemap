import React from 'react';
import { connect } from 'react-redux';
import './App.css';

import TreeMap from './components/TreeMap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.consoleLogData = this.consoleLogData.bind(this);
  }

  consoleLogData() {
    console.log(this.props.appReducer.isOK);
    if (this.props.appReducer.isOK) {
      console.log(this.props.appReducer.kickstarterData);
      console.log(this.props.appReducer.movieData);
      console.log(this.props.appReducer.gameData);
    }
  }
  render() {
    return (
      <div className="App">
        <header>
          <h1 id="title">Tree Map for movie revenues</h1>
          <p id="description">A visualization of the budget revenues of different movies, clustered by genre</p>
        </header>
        <article>
          <TreeMap />
        </article>
      </div>
    );
  }
  
}

const mapStateToProps = state => ({
  ...state
});


// const mapDispatchToProps = ({
//   pressedKey: (keycode) => dispatch(pressedKey(keycode))
// });

export default connect(mapStateToProps)(App);
