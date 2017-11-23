import React, {Component} from 'react'
import PropTypes from 'prop-types'

const propTypes = {
    movie: PropTypes.object.isRequired,
};

class Movie extends Component{
    constructor(props){
        super(props);

        this.state = {
            dragging: false
        };
    }   

    render() {
        const { isDragging, connectDragSource, movie } = this.props;
        return(
            <div className='movie'>
                <img className='cover' src={movie.cover} />
                <div className='movie-info'>
                    <div className='titles'>
                        <a href={movie.km_ref} target="_blank">{movie.title}</a>
                        <a className='original-title'>{movie.original_title}</a>
                    </div>
                    <p className='about-movie'>{movie.description}</p>
                </div>
            </div>
        );
    }
}
Movie.propTypes = propTypes;

export default Movie;