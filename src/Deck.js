import React, { Component } from 'react';
import Card from './Card';
import './Deck.css';
import axios from 'axios';

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

class Deck extends Component {
	constructor(props) {
		super(props);
		this.state = { deck: null, drawn: [] };
		this.getCards = this.getCards.bind(this);
	}

	async componentDidMount() {
		let deck = await axios.get(`${API_BASE_URL}/new/shuffle`);
		//console.log(deck);
		this.setState({ deck: deck.data });
	}

	async getCards() {
		//make request using deck id
		let id = this.state.deck.deck_id;
		try {
			let cardUrl = `${API_BASE_URL}/${id}/draw`;
			let cardRes = await axios.get(cardUrl);
			if (!cardRes.data.success) {
				throw new Error('No card remaining');
			}
			let card = cardRes.data.cards[0];
			//set state using new card info from api
			this.setState((st) => ({
				drawn: [
					...st.drawn,
					{
						id: card.code,
						image: card.image,
						name: `${card.value} of ${card.suit}`
					}
				]
			}));
		} catch (err) {
			alert(err);
		}
	}

	render() {
		const cards = this.state.drawn.map((c) => <Card key={c.id} name={c.name} image={c.image} />);
		console.log(cards);
		return (
			<div>
				<h1>Card Dealer</h1>
				<button onClick={this.getCards}>Get Card</button>
				<div className="Deck-cardarea">{cards}</div>
			</div>
		);
	}
}

export default Deck;
