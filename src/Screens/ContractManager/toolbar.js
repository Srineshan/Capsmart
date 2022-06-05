import React, { Component } from 'react';
import Konva from 'konva';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Shape, Ellipse, Rect, Text, Arrow } from 'react-konva';
import style from './index.module.scss';

const ToolBar = () => {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
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
        </Layer>
      </Stage>
    );
  }

export default ToolBar;