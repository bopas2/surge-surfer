import React, { Component } from 'react';
import Trivia from './components/Trivia';
import Header from './components/header';
import Background from './resources/background.jpg'
import './App.css';
import Error from './components/error';

const API_ENDPOINT = "http://localhost:5000/search/?";

class App extends Component {

  state = {
    trivias: []
  }

  randomTrivia = (e) => {
    e.preventDefault();
    
    fetch(API_ENDPOINT)
      .then(response => response.json())
      .then(data => { 
        this.setState({
          trivias: [JSON.parse(data)[0]],
        })
      });
  }

  specificTrivia = (e) => {
    var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
    e.preventDefault();

    let url = API_ENDPOINT;
    
    if (this.refs.valDropdown) {
      let val = this.refs.valDropdown.value;
      if (String(val) !== "any") {
        url += 'difficulty=' + String(this.refs.valDropdown.value) + '&';
      }
    }

    if (this.refs.cagEntry) {
      console.log(this.refs.cagEntry.value);
    }

    if (this.refs.calStart) {
      let startDate = String(this.refs.calStart.value);
      if (date_regex.test(startDate)) {
        url += 'date_start=' + String(startDate) + '&';
      }
    }

    if (this.refs.calEnd) {
      let endDate = this.refs.calEnd.value;
      if (date_regex.test(endDate)) {
        url += 'date_end=' + String(endDate) + '&';
      }
    }

    if (this.refs.cagEntry) {
      let cagEntry = this.refs.cagEntry.value;
      if (cagEntry !== "") {
        url += 'category=' + String(cagEntry) + '&';
      }
    }

    console.log(url);

    fetch(url)
      .then(response => response.json())
      .then(data => { 
        console.log(JSON.parse(data));
        this.setState({
          trivias: JSON.parse(data),
        })
      });
  }

  render() {
    return (
      <div className="App" style={screen}>
        <Header/>
        <div style={content}>
          <div style={offset}>
            <form style={search}>
              <input
              ref="cagEntry"
              style = {textEntry}
              type="text" 
              name="value_in" 
              placeholder="Trivia category">
              </input>
              <div style={dates}>
                <div style={dates_p}>
                  <input 
                    ref="calStart"
                    style = {textEntry}
                    type="text" 
                    name="value_in" 
                    placeholder="Start date mm/dd/yyyy">
                  </input>
                </div>
                <div style={butt}>
                  <input 
                    ref="calEnd"
                    style = {textEntry}
                    type="text" 
                    name="value_in" 
                    placeholder="End date mm/dd/yyyy">
                  </input>
                </div>
              </div>
              <div style={drop}>
                <select ref="valDropdown" style={dropdown}>
                  <option selected value="any">Value: ANY</option>
                  <option value="100">Value: 100</option>
                  <option value="200">Value: 200</option>
                  <option value="300">Value: 300</option>
                  <option value="400">Value: 400</option>
                  <option value="500">Value: 500</option>
                  <option value="600">Value: 600</option>
                  <option value="800">Value: 800</option>
                  <option value="1000">Value: 1000</option>
                </select>
              </div>
              <div style={buttons}>
                <button 
                    style= {button}
                    type="submit"
                    onmousedown={this.specificTrivia}>
                      Search
                </button>
                <button
                    style= {button}
                    type="submit" 
                    onClick={this.randomTrivia}>
                    Random Trivia
                </button>
              </div>
            </form>
          </div>
          {this.state.trivias.length !== 0 &&
              <Trivia trivia={this.state.trivias} />
            }
          {this.state.trivias.length === 0 &&
              <Error />
            }
        </div>
      </div>
    )
  }
}

const offset = {
  paddingBottom: "10px"
}

const dates = {
  display: "flex",
  flexDirection: "row"
}

const textEntry = {
  borderRadius: "5px",
  backgroundColor: '#f1f1f1',
  width: "100%"
}

const buttons = {
  display: "flex",
  flexDirection: "row",
  paddingTop: "10px",
  paddingBottom: "10px"
}

const drop = {
  
}

const dates_p = {
  paddingTop: '10px',
  paddingLeft: '10px',
  paddingRight: '10px'
}

const butt = {
  padding: '3px',
  marginLeft: '10px'
}

const search = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingLeft: '50px',
  paddingRight: '50px',
  paddingTop: '10px',
  paddingBottom: '0px',
  background: "rgba(15,63,118,.9)",
  borderRadius: "10px",
}

const dropdown = {
  borderRadius: "4px",
  backgroundColor: '#f1f1f1',
  border: 'none',
  padding: '5px'
}

const button = {
  borderRadius: "4px",
  backgroundColor: '#7e98bf',
  padding: '5px',
  fontWeight: 'bold',
  border: 'solid gray 1px',
}

const content = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "50px",
}

const screen = {
  backgroundImage: `url(${ Background })`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepear: 'no-repeat',
  overflow: 'hidden',
  height: '100vh',
  overflow: 'scroll',
}

export default App;
