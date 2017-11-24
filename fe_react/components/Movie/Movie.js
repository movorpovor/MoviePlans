import React from 'react';
import PropTypes from 'prop-types'

const propTypes = {
    movie: PropTypes.object.isRequired,
    isDragging: PropTypes.bool,
    isDragPreview: PropTypes.bool
};

const Movie = (props) => {
    var {movie, isDragging, isDragPreview} = props;
    return (
        <div className={
            'movie ' + 
            (isDragging?'invisible':'') +
            (isDragPreview?'dragging-movie':'')} 
            id={movie.id}
        >
            <img src={movie.cover} className='cover'/>
            <div className='movie-info'>
            <div className='titles'>
                <a href={movie.km_ref} target="_blank">{movie.title}</a>
                <a className='original-title'>{movie.original_title}</a>
            </div>
            <p className='about-movie'>{movie.description}</p>
            </div>
        </div>
    );
};

Movie.propTypes = propTypes;

export default Movie;
