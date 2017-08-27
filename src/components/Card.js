import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'preact-dnd';
import { ItemTypes } from './Constants';

/**
 * Implements the drag source contract.
 */
const cardSource = {
  beginDrag(props) {
    return {
      text: props.text,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    if (monitor.getItemType() === ItemTypes.CARD) {
      hoverCard(props, monitor, component);
    }
  },
  drop(props, monitor, component) {
    if (monitor.getItemType() === ItemTypes.WIDGET) {
      dropWidget(props, monitor, component);
    }
  }
};

@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget([ItemTypes.CARD, ItemTypes.WIDGET], cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
class Card extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    id: PropTypes.any.isRequired,
    moveCard: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    removeWidget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired
  };

  render() {
    const { isDragging, connectDropTarget, connectDragSource, isOver, text } = this.props;
    return connectDropTarget(connectDragSource(
      <div className="Card" style={{ opacity: isDragging ? 0.1 : 1, background: isOver ? '#881' : '#111' }}>
        {text}
      </div>
    ));
  }
}

export default Card;

function hoverCard(props, monitor, component) {
  const dragIndex = monitor.getItem().index;
  const hoverIndex = props.index;

  // Don't replace items with themselves
  if (dragIndex === hoverIndex) {
    return;
  }
  // Determine rectangle on screen
  const hoverBoundingRect = component.base.getBoundingClientRect();

  // Get horizontal middle
  const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

  // Determine mouse position
  const clientOffset = monitor.getClientOffset();

  // Get pixels to the left
  const hoverClientX = clientOffset.x - hoverBoundingRect.left;

  if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
    return;
  }

  if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
    return;
  }


  // Time to actually perform the action
  props.moveCard(dragIndex, hoverIndex);

  // Note: we're mutating the monitor item here!
  // Generally it's better to avoid mutations,
  // but it's good here for the sake of performance
  // to avoid expensive index searches.
  monitor.getItem().index = hoverIndex;
}

function dropWidget(props, monitor, component) {
  console.log('add this widget: ', monitor.getItem());
  console.log('to this card', component);
  props.removeWidget(monitor.getItem().id);
}
