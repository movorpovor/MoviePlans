import React, {Component} from 'react'
import Movie from './Movie/DraggableMovie';
import $ from 'jquery';

export default class MovieList extends Component{

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
    }

    render() {
        var moviesTemplate = this.state.movies.map(function(item, index) {
            return (
              <div key={index}>
                <Movie movie={item}/>
              </div>
            )
        })

        return (
            <div className='block'>
                {moviesTemplate}
            </div>
        );
    }
}