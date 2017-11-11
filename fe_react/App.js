import React, {Component} from 'react';
import EventEmitter from 'EventEmitter';
import MovieList from './components/Movie/MovieList';
import MovieInput from './components/Movie/MovieInput';
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
      url: "http://movorpovor.ru.host1630677.serv63.hostland.pro/movie_api/base/get_init_state",
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
    response.response.users.forEach(function(user){
      var usersMovies = [];
      var i = 0;
      while(i < moviesArr.length){
        if (moviesArr[i].user_id == user.id)
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

    return usersAndTheirMovies;
  }
  
  render() {
    var template = this.state.users.map(function(item){
      return <MovieList user_and_movies={item} key={"user_" + item.user.id} />;
    });
    return (
      <div className='main-div'>
        <div className='list-of-lists'>
          {template}
        </div>
        <MovieInput users={this.state.users}/>
      </div>
    );
  }
}

export default App