import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';

import MovieDragPreview from './Movie/MovieDragPreview';


const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100000
};

function getItemStyles(props) {
    const { initialOffset, currentOffset } = props;
    if (!initialOffset || !currentOffset) {
        return {
        display: 'none'
        };
    }

    let { x, y } = currentOffset;

    const transform = `translate(${x}px, ${y}px)`;
    return {
        WebkitTransform: transform,
        transform
    };
}

class CustomDragLayer extends Component {
    renderItem(type, item) {
        switch (type) {
        case 'movie':
            return (
                <MovieDragPreview movie={item} />
            );
        default:
            return null;
        }
    }

    render() {
        const { item, itemType, isDragging } = this.props;

        if (!isDragging) {
        return null;
        }


        return (
        <div style={layerStyles}>
            <div style={getItemStyles(this.props)}>
            {this.renderItem(itemType, item)}
            </div>
        </div>
        );
    }
}

const propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    initialOffset: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }),
    currentOffset: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired
};

export default DragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
}))(CustomDragLayer)