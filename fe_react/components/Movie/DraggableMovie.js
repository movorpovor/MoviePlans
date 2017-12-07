import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import Movie from './Movie';

function getStyles(isDragging) {
    return {
        display: isDragging ? 0.5 : 1
    };
}

const movieSource = {
    beginDrag(props, monitor, component) {
        const { movie } = props;
        const { id, title } = movie;
        const { clientWidth, clientHeight } = findDOMNode(component);

        return { id, title, movie, clientWidth, clientHeight };
    },
    endDrag(props, monitor) {
        document.getElementById(monitor.getItem().id).style.display = 'block';
    },
    isDragging(props, monitor) {
        const isDragging = props.movie && props.movie.id === monitor.getItem().id;
        return isDragging;
    }
};

const OPTIONS = {
    arePropsEqual: function arePropsEqual(props, otherProps) {
        let isEqual = true;
        if (props.movie.id === otherProps.movie.id
        ) {
            isEqual = true;
        } else {
            isEqual = false;
        }
        return isEqual;
    }
};

function collectDragSource(connectDragSource, monitor) {
    return {
        connectDragSource: connectDragSource.dragSource(),
        connectDragPreview: connectDragSource.dragPreview(),
        isDragging: monitor.isDragging()
    };
}

class MovieComponent extends Component {

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    });
  }

  render() {
    const { isDragging, connectDragSource, movie } = this.props;

    return connectDragSource(
        <div>
            <Movie 
                isDragging={isDragging} 
                movie={movie} 
            />
        </div>
    );
  }
}

const propTypes = {
    movie: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
};

MovieComponent.propTypes = propTypes;

export default DragSource('movie', movieSource, collectDragSource, OPTIONS)(MovieComponent)