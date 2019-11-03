import React, {Component} from 'react'
import PropTypes from 'prop-types'


export class Error extends Component {
    render() {
        return (
            <div style={container}>
                <div style={itemStyle}>
                    <div>
                        <p style={title}>Invalid input or no results</p> 
                    </div>
                </div>
            </div>
        )
    }
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

export default Error