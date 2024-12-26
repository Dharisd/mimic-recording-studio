import React, { Component } from "react";
// import { history } from "react-router-dom";
import { getName, saveName } from "./api/localstorage";

class Intro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: undefined
    };
  }

  componentDidMount() {
    const name = getName();
    if (name) {
      this.setState({ name });
    }
  }

  render() {
    return (
      <div className="page-intro">
        <div id="PageIntro">
          <h2 style={{ color: "#FD9E66" }}>Recording Studio</h2>
          <p>
            Welcome to our recording studio interface. Here you can record your voice
            to create high-quality audio samples. Follow the guidelines below for the
            best results.
          </p>
  
          <div className="instructions">
            <i className="fas fa-book-open" />
            <h2>Recording Guidelines</h2>
  
            <ul className="recording-guidelines">
              <li>
                <span className="li-title">
                  Choose the Right Equipment
                </span>
                <br />
                Use a good quality microphone for clear audio capture. Avoid built-in 
                laptop microphones when possible. Test your mic before starting a full 
                recording session.
              </li>
              <li>
                <span className="li-title">
                  Speak Clearly and Consistently
                </span>
                <br />
                Maintain a steady pace and clear pronunciation. Speak naturally but
                ensure each word is distinct and well-articulated.
              </li>
              <li>
                <span className="li-title">
                  Show Enthusiasm
                </span>
                <br />
                Let your energy come through in your voice. An engaged, enthusiastic
                tone helps create more engaging recordings.
              </li>
            </ul>
  
            <hr />
            <p>
              Ready to start? Click the Record button below when you're prepared.
            </p>
  
          </div>
          {getName() ? this.renderWelcomeBackMsg() : this.renderInput()}
          <div className="btn_PageIntro">
            <button
              id="btn_PageIntro"
              className="btn"
              onClick={this.handleTrainMimicBtn}
            >
              Record
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderInput = () => {
    return (
      <div>
        <p>To get started, enter your name and hit the Record button.</p>
        <input
          type="text"
          id="yourname"
          placeholder="Your Name"
          onChange={this.handleInput}
        />
      </div>
    );
  };

  renderWelcomeBackMsg = () => {
    return (
      <div>
        <p>Welcome back {this.state.name}!</p>
        <p>Hit Train Mimic to continue recording</p>
      </div>
    );
  };

  handleInput = e => {
    this.setState({ name: e.target.value });
  };

  handleTrainMimicBtn = () => {
    if (this.state.name === undefined) {
      alert("Please input a name before proceeding!");
    } else {
	  saveName(this.state.name);
	  this.props.history.push('/record')
    }
  };
}

export default Intro;
