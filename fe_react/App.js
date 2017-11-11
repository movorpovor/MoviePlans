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
      <div className='main-div'>
        <div className='list-of-lists'>
          <MovieList user_id={1} />
          <MovieList user_id={2} />
        </div>
        <MovieInput/>
      </div>
    );
  }
}

export default App