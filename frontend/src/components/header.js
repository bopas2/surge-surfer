import React, { Component } from 'react';

function Header() {
    return (
        <header style={headerStyle}>
            <h1>Trivia Search Engine</h1>
        </header>
    )
}

const headerStyle = {
    background: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px'
}

export default Header