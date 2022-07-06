import React, { Component } from "react";
import { Stage, Layer, Arrow, Line } from "react-konva";
import ReactDOM from "react-dom";
import "./styles.css";

class Drawable {
  constructor(startx, starty) {
    this.startx = startx;
    this.starty = starty;
  }
}

class ArrowDrawable extends Drawable {
  constructor(startx, starty) {
    super(startx, starty);
    this.x = startx;
    this.y = starty;
  }
  registerMovement(x, y) {
    this.x = x;
    this.y = y;
  }
  render() {
    const points = [this.startx, this.starty, this.x, this.y];
    return <Arrow points={points} fill="black" stroke="black" />;
  }
}

class LineDrawable extends Drawable {
  constructor(startx, starty) {
    super(startx, starty);
    this.x = startx;
    this.y = starty;
  }
  registerMovement(x, y) {
    this.x = x;
    this.y = y;
  }
  render() {
    const points = [this.startx, this.starty, this.x, this.y];
    return <Line points={points} fill="black" stroke="black" />;
  }
}

class SceneWithDrawables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawables: [],
      newDrawable: [],
      newDrawableType: "ArrowDrawable"
    };
  }

  getNewDrawableBasedOnType = (x, y, type) => {
    const drawableClasses = {
      LineDrawable,
      ArrowDrawable
      // CircleDrawable
    };
    return new drawableClasses[type](x, y);
  };

  handleMouseDown = (e) => {
    const { newDrawable } = this.state;
    if (newDrawable.length === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const newDrawable = this.getNewDrawableBasedOnType(
        x,
        y,
        this.state.newDrawableType
      );
      this.setState({
        newDrawable: [newDrawable]
      });
    }
  };

  handleMouseUp = (e) => {
    const { newDrawable, drawables } = this.state;
    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const drawableToAdd = newDrawable[0];
      drawableToAdd.registerMovement(x, y);
      drawables.push(drawableToAdd);
      this.setState({
        newDrawable: [],
        drawables
      });
    }
  };

  handleMouseMove = (e) => {
    const { newDrawable } = this.state;
    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const updatedNewDrawable = newDrawable[0];
      updatedNewDrawable.registerMovement(x, y);
      this.setState({
        newDrawable: [updatedNewDrawable]
      });
    }
  };

  render() {
    const drawables = [...this.state.drawables, ...this.state.newDrawable];
    return (
      <div>
        <button
          onClick={(e) => {
            this.setState({ newDrawableType: "ArrowDrawable" });
          }}
        >
          Draw Arrows
        </button>
        <button
          onClick={(e) => {
            this.setState({ newDrawableType: "LineDrawable" });
          }}
        >
          Draw Line
        </button>

        <Stage
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          width={900}
          height={700}
        >
          <Layer>
            {drawables.map((drawable) => {
              return drawable.render();
            })}
          </Layer>
        </Stage>
      </div>
    );
  }
}

function App() {
  return <SceneWithDrawables />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
