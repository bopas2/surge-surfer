import React, { Component } from 'react';
import Trivia_singular from './trivia_singular'
import PropTypes from 'prop-types'

class Trivia extends Component {
    render() {
        return this.props.trivia.map((clue) => (
            <Trivia_singular key={clue.id} info={clue}/>
        ));
    }
}

Trivia.propTypes = {
    trivia: PropTypes.array.isRequired
}

export default Trivia;