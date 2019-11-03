import React, { Component } from 'react';

export class SearchTrivia extends Component {
    render() {
        return (
            <form>
                <input 
                type="text" 
                name="value_in" 
                placeholder="Enter value of trivia question...">
                </input>
                <input 
                    type="submit" 
                    value="Submit">
                </input>
            </form>
        )
    }
}

export default SearchTrivia