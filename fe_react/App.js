import React, {Component} from 'react';
import EventEmitter from 'EventEmitter';
import MovieList from './components/Movie/MovieList';
import MovieInput from './components/Movie/MovieInput';

class App extends Component{
  
  constructor(props){
    super(props);
    window.ee = new EventEmitter();
  }
  
  render() {
    return (
      <div>
        <MovieList/>
        <MovieInput/>
      </div>
    );
  }
}

export default App