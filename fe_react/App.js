import React, {Component} from 'react';
import EventEmitter from 'EventEmitter';
import MovieList from './components/Movie/MovieList';
import MovieInput from './components/Movie/MovieInput';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import $ from 'jquery';

class App extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      users: [],
      movies: []
    };
    window.ee = new EventEmitter();
  }

  componentWillMount(){
    $.ajax({
      url: "http://movorpovor.ru.host1630677.serv63.hostland.pro/movie_api/base/get_init_state",
      type : "GET",
      success : function(response) {
        this.setState({
          users: response.response.users,
          movies: response.response.movies
        });
        window.ee.emit('Users.Recieved', response.response.users);
      }.bind(this),
      error: function(xhr, resp, text){
          // show error to console
          console.log(xhr, resp, text);
      }
    });
  }

  handleDrop(user, item){
    var allMovies = this.state.movies;
    var i = 0;
    while (i < allMovies.length){
      if (allMovies[i].id == item.movieId){
        allMovies[i].user_id = user.id;
        break;
      }
      i++;
    }

    this.setState({
      movies: allMovies
    })
  }

  grabMoviesOfUser(userId) {
    var allMovies = this.state.movies;
    var userMovies = [];
    allMovies.forEach(function(item, i, allMovies) {
      if (item.user_id == userId)
        userMovies.push(item);
    });

    console.log(userMovies);
    return userMovies;
  }
  
  render() {
    var template = this.state.users.map((user) => (
        <MovieList 
          user={user}
          movies={this.grabMoviesOfUser(user.id)} 
          key={"user_" + user.id} 
          onDrop={item => this.handleDrop(user, item)}
        />
      )
    )
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

export default DragDropContext(HTML5Backend)(App);