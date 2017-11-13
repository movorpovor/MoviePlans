import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { ItemTypes } from '../../core/ItemTypes';
import { DragSource } from 'react-dnd';

const movieSource = {
    beginDrag(props) {
        return {
            movieId: props.movie.id
      };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class Movie extends Component{
    constructor(props){
        super(props);
    }   

    render() {
        var movie = this.props.movie;
        const { connectDragSource, isDragging } = this.props;
        return connectDragSource(
          <div className={'movie ' + (isDragging?'dragging':'')}>
              <img src={movie.cover} className='cover'/>
              <div className='movie-info'>
                <div className='titles'>
                    <a href={movie.km_ref} target="_blank">{movie.title}</a>
                    <a className='original-title'>{movie.original_title}</a>
                </div>
                <p className='about-movie'>{movie.description}</p>
              </div>
          </div>
        )
    }
}

Movie.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    movie: PropTypes.object.isRequired
};

export default DragSource(ItemTypes.MOVIE, movieSource, collect)(Movie);