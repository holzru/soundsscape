const PlayerActions = require('../../actions/player_actions');
const PlayerStore = require('../../stores/player_store');
const TrackActions = require('../../actions/track_actions');
const SessionStore = require('../../stores/session_store');
const ErrorActions = require('../../actions/error_actions');
const ModalActions = require('../../actions/modal_actions');

module.exports = React.createClass({
  getInitialState () {
    return {hover: false, loading: false, adding: false};
  },
  componentWillReceiveProps (newProps) {
    this.setState({loading: false});
  },
  _highlightPlay () {
    $('.play-circle-bg').addClass('highlighted');
  },
  _unhighlightPlay () {
    $('.play-circle-bg').removeClass('highlighted');
  },
  _highlightLike () {
    $('.like-icon-bg').addClass('highlighted');
  },
  _unhighlightLike () {
    $('.like-icon-bg').removeClass('highlighted');
  },
  _highlightPlus () {
    $('.plus-icon-bg').addClass('highlighted');
  },
  _unhighlightPlus () {
    $('.plus-icon-bg').removeClass('highlighted');
  },
  _highlightUpdate () {
    $('.update-icon-bg').addClass('highlighted');
  },
  _unhighlightUpdate () {
    $('.update-icon-bg').removeClass('highlighted');
  },
  _onMouseEnter () {
    this.setState({hover: true}, function () {
      $(`#overlay-${this.props.track.id}`).addClass('active');
    });
  },
  _onMouseLeave () {
    this.setState({hover: false}, function () {
      $(`#overlay-${this.props.track.id}`).removeClass('active');
    });
  },
  _playTrack () {
    PlayerActions.playTrack(this.props.track);
  },
  _likeTrack () {
    if (!SessionStore.loggedIn()) {
      ErrorActions.removeErrors();
      ModalActions.show("USER", "SIGNUP");
    } else {
      this.setState({loading: true});
      if (this.props.track.liked) {
        if (this.props.indexType === "MY_LIKES") {
          TrackActions.unlikeAndRemoveTrack(this.props.track);
        } else {
          TrackActions.unlikeTrack(this.props.track);
        }
      } else {
        if (typeof this.props.track.id === 'string') {
          TrackActions.postAndLikeTrack(this.props.track);
        } else {
          TrackActions.likeTrack(this.props.track);
        }
      }
    }
  },
  _updateTrack () {
    this.props.updateTrack(this.props.track);
  },
  _appendTrack () {
    this.setState({adding: true}, function () {
      setTimeout(function () {
        this.setState({adding: false});
      }.bind(this), 100);
    }.bind(this));
    if (PlayerStore.tracks().length) {
      PlayerActions.appendTrack(this.props.track);
    } else {
      PlayerActions.playTrack(this.props.track);
    }
  },
  render () {
    return (
      <div className="track-index-item">
        <div className="track-image"
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}>
          <img src={this.props.track.image_url} width="225" height="225"></img>
          <span className="track-image-overlay" id={`overlay-${this.props.track.id}`}></span>
          {this.state.hover ?
            <div>
              <span className="play-circle-bg"></span>
              <i className="glyphicon glyphicon-play-circle play-circle-icon"
                 onClick={this._playTrack}
                 onMouseEnter={this._highlightPlay}
                 onMouseLeave={this._unhighlightPlay}/>
              {this.props.indexType === "MY_TRACKS" ?
               <div>
                 <span className="update-icon-bg"></span>
                 <i className="glyphicon glyphicon-cog update-icon"
                    onClick={this._updateTrack}
                    onMouseEnter={this._highlightUpdate}
                    onMouseLeave={this._unhighlightUpdate}/>
               </div> : ""}
              <div>
                <span className="like-icon-bg"></span>
                {this.state.loading ?
                  <div className="sk-fading-circle">
                    <div className="sk-circle1 sk-circle"></div>
                    <div className="sk-circle2 sk-circle"></div>
                    <div className="sk-circle3 sk-circle"></div>
                    <div className="sk-circle4 sk-circle"></div>
                    <div className="sk-circle5 sk-circle"></div>
                    <div className="sk-circle6 sk-circle"></div>
                    <div className="sk-circle7 sk-circle"></div>
                    <div className="sk-circle8 sk-circle"></div>
                    <div className="sk-circle9 sk-circle"></div>
                    <div className="sk-circle10 sk-circle"></div>
                    <div className="sk-circle11 sk-circle"></div>
                    <div className="sk-circle12 sk-circle"></div>
                  </div> :
                  <div>
                    <i className={"glyphicon glyphicon-heart like-icon" + (this.props.track.liked ? " liked" : "")}/>
                    <span className="like-count"
                          onClick={this._likeTrack}
                          onMouseEnter={this._highlightLike}
                          onMouseLeave={this._unhighlightLike}>
                      {this.props.track.like_count || "0"}
                    </span>
                  </div>}
                </div>
                <div>
                  <span className="plus-icon-bg"></span>
                  <i className={`glyphicon glyphicon-plus plus-icon${this.state.adding ? ' active' : ''}`}
                                onMouseEnter={this._highlightPlus}
                                onMouseLeave={this._unhighlightPlus}
                                onClick={this._appendTrack}/>
                </div>
            </div> : ""}
        </div>
        <div className="track-text">
          <p>{this.props.track.title}</p>
        </div>
      </div>
    );
  }
});
