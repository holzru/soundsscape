const SessionActions = require('../actions/session_actions');
const ModalActions = require('../actions/modal_actions');
const UserActions = require('../actions/user_actions');
const SessionStore = require('../stores/session_store');
const ErrorStore = require('../stores/error_store');
const CLOUDINARY_IMAGE_OPTIONS = require('../constants/cloudinary').IMAGE_OPTIONS;

const _listeners = [];

module.exports = React.createClass({
  getInitialState () {
    if (this.props.action === "UPDATE") {
      const user = SessionStore.currentUser();
      return {errors: undefined, user: {id: user.id,
                                        username: user.username,
                                        old_password: "",
                                        password: "",
                                        picture_url: user.picture_url}};
    } else {
      return {errors: undefined, user: {username: "", password: "",
              picture_url: "http://res.cloudinary.com/dcwxxqs4l/image/upload/v1469825821/nobody_wix2c9.jpg"}};
    }
  },
  componentDidMount () {
    _listeners.push(ErrorStore.addListener(this._receiveErrors));
  },
  componentWillUnmount () {
    _listeners.forEach(listener => listener.remove());
  },
  _onChange (e) {
    const newUser = this.state.user;
    newUser[e.target.id] = e.target.value;
    this.setState({user: newUser});
  },
  _receiveErrors () {
    // clear password
    this.setState({errors: ErrorStore.errors(),
      user: {id: this.state.user.id,
            username: this.state.user.username,
            old_password: "",
            password: "",
            picture_url: this.state.user.picture_url}});
  },
  _uploadImage (e) {
    e.preventDefault();
    window.cloudinary.openUploadWidget(
      CLOUDINARY_IMAGE_OPTIONS,
      function (error, results) {
        if (!error) {
          const newUser = this.state.user;
          newUser.picture_url = results[0].secure_url;
          this.setState({user: newUser});
        }
      }.bind(this)
    );
  },
  _onSubmit (e) {
    e.preventDefault();
    if (this.props.action === 'LOGIN') {
      SessionActions.login(this.state.user);
    } else if (this.props.action === 'SIGNUP') {
      SessionActions.signup(this.state.user);
    } else {
      UserActions.updateUser(this.state.user);
    }
  },
  _demoLogin (e) {
    e.preventDefault();
    SessionActions.login({username: 'guest123', password: 'mrqhkl71'});
  },
  _closeModal () {
    ModalActions.hide();
  },
  render () {
    let formTitle;
    if (this.props.action === 'LOGIN') {
      formTitle = 'Log In';
    } else if (this.props.action === 'SIGNUP') {
      formTitle = 'Sign Up';
    } else {
      formTitle = 'Update Profile';
    }

    return (
      <div id={`${this.props.action}-USER-MODAL`} className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content cf">
            <div className="form-header cf">
              <button className="close" onClick={this._closeModal}>&times;</button>
              <p className="modal-title">{formTitle}</p>
            </div>
            <form className="user-form">
              <div className="form-field cf">
                <label for="username">Username:</label>
                <input type="text" id="username"
                       value={this.state.user.username}
                       onChange={this._onChange} />
              </div>

              { this.props.action === "UPDATE" ?
                <div className="form-field cf">
                  <label for="old_password">Old Password:</label>
                  <input type="password" id="old_password"
                         value={this.state.user.old_password}
                         onChange={this._onChange} />
                </div> : ""}

              <div className="form-field cf">
                <label for="password">
                  {this.props.action === "UPDATE" ? "New " : ""}Password:
                </label>
                <input type="password" id="password"
                       value={this.state.user.password}
                       onChange={this._onChange} />
              </div>

              {this.props.action !== "LOGIN" ?
                <div className="cf">
                  <div className="my-col-2 cf">
                    {this.state.user.picture_url ?
                      <div className="image-upload-thumbnail">
                        <img src={this.state.user.picture_url} width="225" height="225"/>
                      </div> :
                      <div className="image-upload-placeholder">
                        Upload an Image
                      </div>}
                  </div>
                  <div className="my-col-1 cf">
                    <div className="upload-buttons">
                      <button className="btn btn-primary"
                        onClick={this._uploadImage}>Select Image</button>
                    </div>
                  </div>
                </div> : ""}

               {this.state.errors ?
                 <ul className="error-messages">{
                   this.state.errors.map(errorMsg => {
                     return (<li key={errorMsg}>
                              <i className="glyphicon glyphicon-remove" />
                              {errorMsg}
                            </li>);
                   })
                 }</ul> : ""
               }
              <button onClick={this._onSubmit} className="btn btn-success">{formTitle}</button>
              {this.props.action !== "UPDATE" ?
                <button onClick={this._demoLogin} className="btn btn-success">Demo</button> :
                ""}
            </form>
          </div>
        </div>
      </div>
    );
  }
});
