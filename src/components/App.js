import { h, Component } from 'preact';
import { DragDropContext } from 'preact-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import CardSet from './CardSet';
import WidgetSet from './WidgetSet';

@DragDropContext(HTML5Backend)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.removeWidget = this.removeWidget.bind(this);
    this.moveWidget = this.moveWidget.bind(this);
    this.state = {
      widgets: [{
        id: 1,
        text: 'Widget 1',
      }, {
        id: 2,
        text: 'Widget 2',
      }, {
        id: 3,
        text: 'Widget 3',
      }],
    };
  }
  removeWidget(id) {
    this.setState({
      widgets: this.state.widgets.filter(widget => widget.id !== id)
    });
  }
  moveWidget(dragIndex, hoverIndex) {
    const { widgets } = this.state;
    this.setState({ widgets: swapArrayElements(widgets, dragIndex, hoverIndex) });
  }
  render() {
    return (
      <div className="App">
        <div className="App-intro">
          <CardSet removeWidget={this.removeWidget}/>
          <WidgetSet widgets={this.state.widgets} moveWidget={this.moveWidget}/>
        </div>
      </div>
    );
  }
}

function swapArrayElements(arr, indexA, indexB) {
  const dest = arr.slice();
  const temp = dest[indexA];
  dest[indexA] = dest[indexB];
  dest[indexB] = temp;
  return dest;
};
