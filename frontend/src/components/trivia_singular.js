import React, {Component} from 'react'
import PropTypes from 'prop-types'


export class Trivia_singular extends Component {
    render() {
        return (
            <div style={container}>
                <div style={itemStyle}>
                    <div>
                        <p style={title}>Clue: {this.props.info.question}</p>
                        <p style={ans}>Answer: {this.props.info.answer}</p>
                    </div>
                    <div>
                        <p style={title}>Value: {this.props.info.value}$</p>
                        <p style={title}>Category: {this.props.info.category.title}</p>
                        <p style={title}>Airdate: {this.props.info.airdate.substring(0,10)}</p>
                    </div>
                </div>
            </div>
        )
    }
}

Trivia_singular.propTypes = {
    info: PropTypes.object.isRequired
}

const container = {
    padding: '5px',
}

const itemStyle = {
    backgroundColor: '#89BFFF',
    borderRadius: '15px',
    padding: '0px',
    border: 'solid black 3px',
    display: 'flex',
    justifyContent: 'space-between', 
    width: '100%'
}

const title = {
    fontSize: '20px',
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingTop: '5px',
    fontWeight: 'bold'
}

const ans = {
    fontSize: '20px',
    paddingLeft: '15px',
}

export default Trivia_singular