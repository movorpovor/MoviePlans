import React, {Component} from 'react'
import Movie from './Movie';
import $ from 'jquery';

export default class MovieList extends Component{

    constructor(props){
        super(props);

        this.state = {
            movies: []
        };
    }

    componentDidMount() {
        window.ee.on('Movie.add', function(item) {
            var nextMovies = this.state.movies.concat(item);
            this.setState({movies: nextMovies});
        }.bind(this));

        $.ajax({
            url: "http://movorpovor.ru.host1630677.serv63.hostland.pro/movie_api/movie/get_all",
            type : "GET",
            success : function(response) {
                this.setState({
                    movies: response['records']
                });
            }.bind(this),
            error: function(xhr, resp, text){
                // show error to console
                console.log(xhr, resp, text);
            }
        });
    }

    render() {
        var moviesTemplate = this.state.movies.map(function(item, index) {
            return (
              <div key={index}>
                <Movie movie={item} />
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