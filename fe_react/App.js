import React, {Component} from 'react';
import EventEmitter from 'EventEmitter';
import MovieList from './components/MovieList';
import MovieInput from './components/Movie/MovieInput';
import CustomDragLayer from './components/CustomDragLayer'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import $ from 'jquery';

class App extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      users: []
    };
    window.ee = new EventEmitter();
  }

  componentWillMount(){
    $.ajax({
      url: "http://api.movorpovor.ru/movie/base/get_init_state",
      type : "GET",
      success : function(response) {
        this.setState({
          users: this.parseInitState(response)
        });
        window.ee.emit('Users.Recieved', response.response.users);
      }.bind(this),
      error: function(xhr, resp, text){
          // show error to console
          console.log(xhr, resp, text);
      }
    });
  }

  parseInitState(response){
    var moviesArr = response.response.movies;
    var usersAndTheirMovies = [];
    var watchedMovies = [];

    response.response.users.forEach(function(user){
      var usersMovies = [];
      var i = 0;
      while(i < moviesArr.length){
        if (moviesArr[i].state_id == 2) //пока будет магическое число, потом придумаю как покрасивше сделать
          watchedMovies.push(moviesArr.splice(i, 1)[0]);
        else if (moviesArr[i].user_id == user.id)
          usersMovies.push(moviesArr.splice(i, 1)[0]);
        else
          i++;
      }
      var info = {
        'user': user,
        'movies': usersMovies
      };

      usersAndTheirMovies.push(info);
    });

    var watchedInfo = {
      'user': {
        'id':8532,
        'nickname':'watched'
      },
      'movies': watchedMovies
    };

    usersAndTheirMovies.push(watchedInfo);

    return usersAndTheirMovies;
  }
  
  render() {
    var template = this.state.users.map(function(item){
      return <MovieList user_and_movies={item} key={"user_" + item.user.id} />;
    });
    return (
      <div className='main-div'>
        <CustomDragLayer />
        <div className='list-of-lists'>
          {template}
          <MovieInput users={this.state.users}/>
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App)