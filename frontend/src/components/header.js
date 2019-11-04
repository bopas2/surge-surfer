import React, { Component } from 'react';


// Component to hold website name, description and important links
function Header() {
    return (
        <header style={headerStyle}>
            <div style={Name}>
                <h2>TrivialSearch</h2>
                <p>A search engine for Jeopardy trivia!</p>
            </div>
            <div style={logos}>
                <a href="https://github.com/bopas2/trivia-webapp">
                    <i className="fa fa-github fa-2x"></i>
                </a>
                <a href="https://www.linkedin.com/in/thomas-lang-01/">
                    <i className="fa fa-linkedin fa-2x"></i>
                </a>
            </div>
        </header>
    )
}

const headerStyle = {
    background: '#0F3F76',
    color: '#fff',
    textAlign: 'center',
    padding: '5px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
}

const logos = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingRight: '30px'
}

const Name = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: '10px',
    paddingTop: '5px'
}

export default Header