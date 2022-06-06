import React, { Component, useState, useRef } from 'react';
import Konva from 'konva';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Shape, Ellipse, Rect, Text, Arrow } from 'react-konva';
import style from './index.module.scss';

const ToolBar = () => {
  const [ellipse,setEllipse] = useState([]);
  const [rect,setRect] = useState([]);
  const [diamond,setDiamond] = useState([]);
  const [slantingRect,setSlantingRect] = useState([]);
  const [arrow,setArrow] = useState([]);
  const [yes,setYes] = useState([]);
  const stageRef = useRef(null);
    return (
      <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
        <Layer>
            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={315}
              y={5}
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
                y={20}
            />
            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={370}
              y={5}
            />
            <Rect
                width={40}
                height={20}
                fill="#fff"
                stroke="#A39CEB"
                strokeWidth={1}
                x={375}
                y={10}
                />
            <Rect
                width={40}
                height={20}
                fill="#fff"
                stroke="#A39CEB"
                strokeWidth={1}
                x={375}
                y={10}
                name='draggableRect'
                draggable
                 onDragEnd={(e) => {
                   // push new circle to view
                   // note that we must push circle first before returning draggable circle
                   // because e.target.x returns draggable circle's positions
                   setRect((prevRect) => [
                     ...prevRect,
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
                   var draggable = stage.findOne(".draggableRect");
                   draggable.position({ x: 375, y: 10 });
                 }}
            />
            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={425}
              y={5}
            />
            <Shape
            sceneFunc={(context, shape) => {
            context.beginPath();
            context.moveTo(435, 20);
            context.lineTo(450, 10);
            context.lineTo(465, 20);
            context.lineTo(450, 30);
            context.closePath();
            context.fillStrokeShape(shape);
            }}
            fill="#fff"
            stroke="#A39CEB"
            strokeWidth={1}
            className={style.shapeBackground}
            />
            <Shape
            //Diamond
                sceneFunc={(context, shape) => {
                context.beginPath();
                context.moveTo(435, 20);
                context.lineTo(450, 10);
                context.lineTo(465, 20);
                context.lineTo(450, 30);
                context.closePath();
                context.fillStrokeShape(shape);
                }}
                fill="#fff"
                stroke="#A39CEB"
                strokeWidth={1}
                className={style.shapeBackground}
                name='draggableDiamond'
                draggable
               onDragEnd={(e) => {
                 // push new circle to view
                 // note that we must push circle first before returning draggable circle
                 // because e.target.x returns draggable circle's positions
                 setDiamond((prevDiamond) => [
                   ...prevDiamond,

                     <Shape
                     sceneFunc={(context, shape) => {
                     context.beginPath();
                     context.moveTo(e.target.x(), e.target.y());
                     context.lineTo(450, 10);
                     context.lineTo(465, 20);
                     context.lineTo(450, 30);
                     context.closePath();
                     context.fillStrokeShape(shape);
                     }}
                     // fill: e.target.fill(),
                     // stroke: e.target.stroke(),
                     // strokeWidth: e.target.strokeWidth()
                   />
                 ]);

                 // return draggable circle to original position
                 // notice the dot (.) before "draggableCircle"
                 var stage = stageRef.current;
                 var draggable = stage.findOne(".draggableDiamond");
                 draggable.position({ x: 435, y: 20 });
               }}
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
                y={20}
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
                   draggable.position({ x: 340, y: 20 });
                 }}
            />
            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={480}
              y={5}
            />
            <Shape
                sceneFunc={(context, shape) => {
                context.beginPath();
                //change this line for x and y
                context.moveTo(485, 30);
                context.lineTo(490,10);
                context.lineTo(525,10);
                context.lineTo(520,30);
                context.closePath();
                // (!) Konva specific method, it is very important
                context.fillStrokeShape(shape);
                }}
                fill="#fff"
                stroke="#A39CEB"
                strokeWidth={1}
            />
            <Shape
                sceneFunc={(context, shape) => {
                context.beginPath();
                //change this line for x and y
                context.moveTo(485, 30);
                context.lineTo(490,10);
                context.lineTo(525,10);
                context.lineTo(520,30);
                context.closePath();
                // (!) Konva specific method, it is very important
                context.fillStrokeShape(shape);
                }}
                fill="#fff"
                stroke="#A39CEB"
                strokeWidth={1}
                draggable
                name="draggableSlantingRect"
                onDragEnd={(e) => {
                  // push new circle to view
                  // note that we must push circle first before returning draggable circle
                  // because e.target.x returns draggable circle's positions
                  setSlantingRect((slantingRect) => [
                    ...slantingRect,
                    <Shape
                    sceneFunc={(context, shape) => {
                    context.beginPath();
                    context.moveTo(e.target.x(), e.target.y());
                    context.lineTo(490,10);
                    context.lineTo(525,10);
                    context.lineTo(520,30);
                    context.closePath();
                    context.fillStrokeShape(shape);
                    }}
                    // fill: e.target.fill(),
                    // stroke: e.target.stroke(),
                    // strokeWidth: e.target.strokeWidth()
                  />
                  ]);

                  // return draggable circle to original position
                  // notice the dot (.) before "draggableCircle"
                  var stage = stageRef.current;
                  var draggable = stage.findOne(".draggableEllipse");
                  draggable.position({ x: 340, y: 20 });
                }}

            />
            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={480}
              y={40}
            />
            <Arrow
                points={[520, 55, 490, 55]}
                fill="#ECEDEE"
                stroke="#A39CEB"
                />
            <Arrow
                points={[520, 55, 490, 55]}
                fill="#ECEDEE"
                stroke="#A39CEB"
                name='draggableArrow'
                draggable
                 onDragEnd={(e) => {
                   // push new circle to view
                   // note that we must push circle first before returning draggable circle
                   // because e.target.x returns draggable circle's positions
                   setArrow((prevArrow) => [
                     ...prevArrow,
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
                   var draggable = stage.findOne(".draggableArrow");
                   draggable.position({ x: 520, y: 55 });
                 }}
            />
            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={480}
              y={75}
            />
            <Text
              fontSize={12}
              text="YES"
              fontFamily="Proxima Nova"
              fill="#00C07F"
              x={494}
              y={85}
              />
            <Text
              fontSize={12}
              text="YES"
              fontFamily="Proxima Nova"
              fill="#00C07F"
              x={494}
              y={85}
              name="draggableYes"
              draggable
               onDragEnd={(e) => {
                 // push new circle to view
                 // note that we must push circle first before returning draggable circle
                 // because e.target.x returns draggable circle's positions
                 setYes((prevYes) => [
                   ...prevYes,
                   {
                     x: e.target.x(),
                     y: e.target.y(),
                     fill: e.target.fill(),
                   }
                 ]);

                 // return draggable circle to original position
                 // notice the dot (.) before "draggableCircle"
                 var stage = stageRef.current;
                 var draggable = stage.findOne(".draggableYes");
                 draggable.position({ x: 494, y: 85 });
               }}
            />
            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={480}
              y={110}
            />
            <Text
              fontSize={12}
              text="HOLD"
              fontFamily="Proxima Nova"
              fill="#FEC106"
              x={488}
              y={120}
            />
            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={480}
              y={145}
            />
            <Text
              fontSize={12}
              text="REJECT"
              fontFamily="Proxima Nova"
              fill="#FF6F3B"
              x={484}
              y={155}
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
        {rect.map((eachRect, index) => (
          <Rect
            x={eachRect.x}
            y={eachRect.y}
            width={eachRect.width}
            height={eachRect.height}
            fill={eachRect.fill}
            stroke={eachRect.stroke}
            strokeWidth={eachRect.strokeWidth}
          />
    ))}
    {yes.map((eachYes, index) => (
      <Rect
        x={eachYes.x}
        y={eachYes.y}
        fill={eachYes.fill}
      />
))}
        </Layer>
      </Stage>
    );
  }

export default ToolBar;
