import { h, Component } from 'preact';
import Widget from './Widget';
class WidgetSet extends Component {
  render() {
    const { widgets, moveWidget } = this.props;
    return (
      <div className="WidgetSet">
        {widgets.map((widget, i) => (
          <Widget
            key={widget.id}
            index={i}
            id={widget.id}
            text={widget.text}
            moveWidget={moveWidget}
          />
        ))}
        <div class="instructions">You can reorder widgets or add widgets to cards</div>
      </div>
    );
  }
}

export default WidgetSet;
