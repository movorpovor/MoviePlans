import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd';

const cardSource = {
    beginDrag(props) {
    return {
            
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

const propTypes = {
    movie: PropTypes.object.isRequired,
  
    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
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
        return connectDragSource(
          <div className='movie'>
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
    }
}
Movie.propTypes = propTypes;

export default DragSource('movie', cardSource, collect)(Movie);