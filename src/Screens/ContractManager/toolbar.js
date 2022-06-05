import React, { Component, useState, useRef } from 'react';
import Konva from 'konva';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Shape, Ellipse, Rect, Text, Arrow } from 'react-konva';
import style from './index.module.scss';

const ToolBar = () => {
  const [ellipse,setEllipse] = useState([]);
  const stageRef = useRef(null);
    return (
      <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
        <Layer>
            <Shape
                sceneFunc={(context, shape) => {
                context.beginPath();
                context.moveTo(435, 25);
                context.lineTo(450, 15);
                context.lineTo(465, 25);
                context.lineTo(450, 35);
                // context.moveTo(10, 60);
                // context.lineTo(60, 10);
                // context.lineTo(110, 50);
                // context.lineTo(60, 100);

                // context.quadraticCurveTo(150, 100, 260, 170);
                context.closePath();
                // (!) Konva specific method, it is very important
                context.fillStrokeShape(shape);
                }}
                fill="#fff"
                stroke="#A39CEB"
                strokeWidth={1}
                className={style.shapeBackground}
            />
            <Rect
                width={50}
                height={30}
                fill="#A39CEB"
                strokeWidth={1}
                x={315}
                y={10}
            />
            <Ellipse
                radiusX={20}
                radiusY={20}
                height={20}
                width={40}
                fill="#fff"
                stroke="#A39CEB"
                strokeWidth={1}
                x={340}
                y={25}
            />
            <Ellipse
                name="draggableEllipse"
                radiusX={20}
                radiusY={20}
                height={20}
                width={40}
                fill="#fff"
                stroke="#A39CEB"
                strokeWidth={1}
                x={340}
                y={25}
                draggable
                 onDragEnd={(e) => {
                   // push new circle to view
                   // note that we must push circle first before returning draggable circle
                   // because e.target.x returns draggable circle's positions
                   setEllipse((prevEllipse) => [
                     ...prevEllipse,
                     {
                       x: e.target.x(),
                       y: e.target.y(),
                       width: e.target.width(),
                       height: e.target.height(),
                       fill: e.target.fill(),
                       stroke: e.target.stroke(),
                       strokeWidth: e.target.strokeWidth()
                     }
                   ]);

                   // return draggable circle to original position
                   // notice the dot (.) before "draggableCircle"
                   var stage = stageRef.current;
                   var draggable = stage.findOne(".draggableEllipse");
                   draggable.position({ x: 340, y: 25 });
                 }}
            />
            <Rect
                width={40}
                height={20}
                fill="#fff"
                stroke="#A39CEB"
                strokeWidth={1}
                x={380}
                y={15}
            />
            <Shape
                sceneFunc={(context, shape) => {
                context.beginPath();
                //change this line for x and y
                context.moveTo(485, 35);
                context.lineTo(490,15);
                context.lineTo(525,15);
                context.lineTo(520,35);
                context.closePath();
                // (!) Konva specific method, it is very important
                context.fillStrokeShape(shape);
                }}
                fill="#fff"
                stroke="#A39CEB"
                strokeWidth={1}
            />
            <Arrow
                points={[510, 65, 480, 65]}
                fill="#ECEDEE"
                stroke="#A39CEB"
            />
            <Text
              fontSize={15}
              text="YES"
              fontFamily="Proxima Nova"
              fill="#00C07F"
              x={480}
              y={90}
            />
            <Text
              fontSize={15}
              text="HOLD"
              fontFamily="Proxima Nova"
              fill="#FEC106"
              x={475}
              y={120}
            />
            <Text
              fontSize={15}
              text="REJECT"
              fontFamily="Proxima Nova"
              fill="#FF6F3B"
              x={470}
              y={150}
            />
            {ellipse.map((eachEllipse, index) => (
              <Ellipse
                x={eachEllipse.x}
                y={eachEllipse.y}
                width={eachEllipse.width}
                height={eachEllipse.height}
                fill={eachEllipse.fill}
                stroke={eachEllipse.stroke}
                strokeWidth={eachEllipse.strokeWidth}
              />
        ))}
        </Layer>
      </Stage>
    );
  }

export default ToolBar;
