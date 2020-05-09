import React from "react";

import "./App.css";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: [],
      selectedBreed: "all",
      selectedSex: "female",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }))
      .catch((err) => err);
  }

  async componentDidMount() {
    const res = await axios.get("http://localhost:9000/api");
    res.data.map((pet) =>
      this.setState({
        pets: [...this.state.pets, pet],
        // selectedPets: [...this.state.selectedPets, pet]
      })
    );
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({ selectedBreed: event.target.value });
  }

  async handleSubmit(event) {
    console.log(this.state.selectedBreed);
    const res = await axios.get(
      `http://localhost:9000/api/${this.state.selectedBreed}`
    );
    res.data.map((pet) =>
      this.setState({
        pets: [...this.state.pets, pet],
      })
    );
    console.log(res.data);
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={"./logo.png"} className="App-logo" alt="logo" />
          <h1>
            NYC <br />
            Doggos
          </h1>
        </header>
        <h3 className="App-intro">Doggos needing a home:</h3>
        <div id="search">
          <h4>Refine your search</h4>
          <div id="forms">
            <form id="form1" onSubmit={this.handleSubmit}>
              <label htmlFor="breed">
                Breed:
                <select
                  value={this.state.selectedpets}
                  onChange={this.handleChange}
                >
                  <option value="all">all</option>
                  <option value="purebred">purebred</option>
                  <option value="mixed">mixed</option>
                </select>
              </label>
              <label htmlFor="sex">
                Sex:
                <select onChange={this.handleChange}>
                  <option value="female">female</option>
                  <option value="male"> male</option>
                </select>
              </label>
              <button type="submit">Submit</button>
            </form>
            <button type="button">Save your Search</button>
            <form>
              Get notified of new additions to your search!
              <label>
                email: <input type="text" name="email" />
              </label>
              <button type="submit">Send me updates</button>
            </form>
          </div>
        </div>
        <div className="spacer-container">
          <div className="spacer"></div>
          <div className="pets">
            {this.state.pets.map((pet) => {
              return (
                <div key={pet.link} className="single-pets">
                  <img src={pet.image} alt="dog-pic" />
                  <h3>Name: {pet.name}</h3>
                  <ul className="list">
                    <li>Breed: {pet.breed}</li>
                    <li>Sex: {pet.sex}</li>
                    <li>Age: {pet.age}</li>
                    <li>Color: {pet.color}</li>
                    <a href={pet.link}>Adopt Me!</a>
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="spacer"></div>
        </div>
      </div>
    );
  }
}

export default App;
