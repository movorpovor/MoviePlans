import React, {Component} from 'react'
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types'
import Movie from './Movie/DraggableMovie';
import $ from 'jquery';

const listTarget = {
    canDrop(props) {
        return props.user_and_movies.user.id == 8532;
    },
  
    drop(props, monitor) {
        var movie = monitor.getItem().movie;
        if (movie.state_id != 2)
            updateMovieState(movie);
    },

    hover(props, monitor) {
        //тут код на перекрытие фильмом листа
    }
};

function updateMovieState(movie) {
    var simpleMovieInfo = {
        'movie_id': movie.id,
        'state_id': 2
    };

    $.ajax({
        url: "http://movorpovor.ru.host1630677.serv63.hostland.pro/movie_api/movie/update_state",
        type : "POST",
        contentType : 'application/json',
        data : JSON.stringify(simpleMovieInfo),
        success : function(response) {
            if (response.status == 'ok')
            {
                movie.state_id = 2;
                window.ee.emit('Movie.stateUpdate', movie);
            }
            else
                console.log('ooops');
        },
        error: function(xhr, resp, text){
            // show error to console
            console.log(xhr, resp, text);
        }
    });
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

class MovieList extends Component{

    constructor(props){
        super(props);

        this.state = {
            movies: props.user_and_movies.movies,
            user: props.user_and_movies.user
        };
    }

    componentDidMount() {
        window.ee.on('Movie.add', function(item) {
            if (item.user_id == this.state.user.id){
                var nextMovies = this.state.movies.concat(item);
                this.setState({movies: nextMovies});
            }
        }.bind(this));

        window.ee.on('Movie.stateUpdate', function(item) {
            var listOfMovies = this.state.movies;
            if (this.state.user.id == 8532 && item.state_id == 2)
                this.setState({
                    movies: this.state.movies.concat(item)
                });
            else if (this.state.user.id == item.user_id && item.state_id == 2){
                var i = 0;
                while(listOfMovies.length > i){
                    if (listOfMovies[i].id == item.id){
                        listOfMovies.splice(i, 1);
                        this.setState({
                            movies:listOfMovies
                        });
                        break;
                    }
                    i++;
                }
            }
        }.bind(this));
    }

    render() {
        var moviesTemplate = this.state.movies.map(function(item, index) {
            return (
              <div key={index}>
                <Movie movie={item}/>
              </div>
            )
        })

        const { connectDropTarget, isOver, canDrop } = this.props;

        return connectDropTarget(
            <div className='block'>
                {moviesTemplate}
            </div>
        );
    }
}

MovieList.propTypes = {
    user_and_movies: PropTypes.object.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
};

export default DropTarget('movie', listTarget, collect)(MovieList);