import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'preact-dnd';
import { ItemTypes } from './Constants';

/**
 * Implements the drag source contract.
 */
const widgetSource = {
  beginDrag(props) {
    return {
      text: props.text,
      id: props.id,
      index: props.index
    };
  }
};

const widgetTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = component.base.getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    // Time to actually perform the action
    props.moveWidget(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

@DragSource(ItemTypes.WIDGET, widgetSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget(ItemTypes.WIDGET, widgetTarget, collect)
class Widget extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    id: PropTypes.any.isRequired,
    moveWidget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  render() {
    const { isDragging, connectDropTarget, connectDragSource, text } = this.props;
    return connectDragSource(connectDropTarget(
      <div className="Widget" style={{ opacity: isDragging ? 0.1 : 1 }}>
        {text}
      </div>
    ));
  }
}

export default Widget;
