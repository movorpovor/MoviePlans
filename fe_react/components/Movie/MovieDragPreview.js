import React from 'react';
import PropTypes from 'prop-types';
import Movie from './Movie';

const propTypes = {
    movie: PropTypes.object
};

const MovieDragPreview = (props) => {
    return (
        <div>
            <Movie isDragPreview={true} movie={props.movie.movie} />
        </div>
    );
};

MovieDragPreview.propTypes = propTypes;

export default MovieDragPreview;
