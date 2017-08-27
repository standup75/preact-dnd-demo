import { h, Component } from 'preact';
import Card from './Card';
const swapArrayElements = function(arr, indexA, indexB) {
  const dest = arr.slice();
  const temp = dest[indexA];
  dest[indexA] = dest[indexB];
  dest[indexB] = temp;
  return dest;
};
class CardSet extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      cards: [{
        id: 1,
        text: 'Card 1',
      }, {
        id: 2,
        text: 'Make it generic enough',
      }, {
        id: 3,
        text: 'Card 3',
      }],
    };
  }
  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    this.setState({ cards: swapArrayElements(cards, dragIndex, hoverIndex) });
  }
  render() {
    const { cards } = this.state;
    const { removeWidget } = this.props;
    return (
      <div className="CardSet">
        {cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            id={card.id}
            text={card.text}
            moveCard={this.moveCard}
            removeWidget={removeWidget}
          />
        ))}
        <div class="instructions">You can reorder cards or add widgets to cards</div>
      </div>
    );
  }
}

export default CardSet;
