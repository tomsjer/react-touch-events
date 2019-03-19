/**
 * Created by jerry on 16/9/5.
 */


const React = require("react");
const PropTypes = require('prop-types');


function touchX(event) {
  return event.touches [0].clientX;
}

function touchY(event) {
  return event.touches [0].clientY;
}


class ReactTouchEvents extends React.Component {


  handleTouchStart = (event) => {

    if (this.touchStarted) {
      return;
    }

    this.touchStarted = true;

    this.touchMoved = false;
    this.swipeOutBounded = false;

    this.startX = touchX(event);
    this.startY = touchY(event);

    this.currentX = 0;
    this.currentY = 0;

    this.initTime = Date.now();
  };


  handleTouchMove = (event) => {
    this.currentX = touchX(event);
    this.currentY = touchY(event);

    if (!this.touchMoved) {
      const tapTolerance = this.props.tapTolerance;

      this.touchMoved = Math.abs(this.startX - this.currentX) > tapTolerance ||
        Math.abs(this.startY - this.currentY) > tapTolerance;

    } else if (!this.swipeOutBounded) {
      const swipeOutBounded = this.props.swipeTolerance;

      this.swipeOutBounded = Math.abs(this.startX - this.currentX) > swipeOutBounded &&
        Math.abs(this.startY - this.currentY) > swipeOutBounded;

    }
  };

  handleTouchCancel = () => {
    this.touchStarted = this.touchMoved = false;
    this.startX = this.startY = 0;
    this.initTime = null;
  };

  handleTouchEnd = (event) => {
    this.touchStarted = false;
    const now = Date.now();
    if (!this.touchMoved) {
      if (this.props.onTap && this.initTime - now < this.props.longTapTimer) {
        this.props.onTap(event);
      } else if (this.props.onTap && this.initTime - now >= this.props.longTapTimer) {
        this.props.onLongTap(event);
      }

    } else if (!this.swipeOutBounded) {
      if (this.props.onSwipe) {
        let swipeOutBounded = this.props.swipeTolerance,
          direction;

        if (Math.abs(this.startX - this.currentX) < swipeOutBounded) {
          direction = this.startY > this.currentY ? "top" : "bottom";

        } else {
          direction = this.startX > this.currentX ? "left" : "right";
        }

        this.props.onSwipe(direction, event);
      }
    }
  };


  render() {
    const children = this.props.children;
    const element = children ? React.Children.only(children) : React.createElement("button", null);

    return React.cloneElement(element, {
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchCancel: this.handleTouchCancel,
      onTouchEnd: this.handleTouchEnd,
    });
  }
}


ReactTouchEvents.defaultProps = {
  tapTolerance: 10,
  swipeTolerance: 30,
  longTapTimer: 500
};


ReactTouchEvents.propTypes = {
  children: PropTypes.node,
  tapTolerance: PropTypes.number,
  swipeTolerance: PropTypes.number,
  longTapTimer: PropTypes.number,
  onTap: PropTypes.func,
  onSwipe: PropTypes.func,
  onLongTap: PropTypes.func,
};


module.exports = ReactTouchEvents;