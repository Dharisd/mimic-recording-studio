import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from './AuthContext';

class Intro extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AuthContext.Consumer>
        {({ user, loading }) => (
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
              {this.renderWelcomeBackMsg(user, loading)}
              <div className="btn_PageIntro">
                <Link
                  id="btn_PageIntro"
                  className="btn"
                  to="/record"
                >
                  Record
                </Link>
              </div>
            </div>
          </div>
        )}
      </AuthContext.Consumer>
    );
  }

  renderWelcomeBackMsg = (user, loading) => {
    if(!user || loading) return null
    return (
      <div>
        <p>Welcome back {user.user_name}!</p>
        <p>Hit Train Mimic to continue recording</p>
      </div>
    );
  };

  handleTrainMimicBtn = () => {
	  this.props.history.push('/record')
  };
}

export default Intro;
