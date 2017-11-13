import React, {Component} from 'react'
import Movie from './Movie';
import { ItemTypes } from '../../core/ItemTypes';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd'
import $ from 'jquery';

const movieListTarget = {
	drop(props, monitor) {
		props.onDrop(monitor.getItem())
	},
}

function collect (connect, monitor){
	return {
        connectDropTarget: connect.dropTarget()
    }
}

class MovieList extends Component{
    constructor(props){
        super(props);
        this.state = {
            movies: props.movies,
            user: props.user
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.movies !== this.state.movies || nextProps.user !== this.state.user){
            this.setState({ 
                movies: nextProps.movies,
                user: nextProps.user
            });
        }
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
                <Movie 
                    movie={item} 
                />
              </div>
            )
        });

        return this.props.connectDropTarget(
            <div className='block'>
                {moviesTemplate}
            </div>
        );
    }
}

MovieList.propTypes = {
    user: PropTypes.object.isRequired,
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
}

export default DropTarget(ItemTypes.MOVIE, movieListTarget, collect)(MovieList)