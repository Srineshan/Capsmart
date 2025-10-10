import React, { useState, useRef } from 'react';
import { Group, Text, Arrow } from "react-konva";
import EditableRect from "./editableRect";
import EditableSelectRect from "./editableSelectRect";
import EditableDiamond from "./editableDiamond";

const FlowChartProcedureGroupTwo = ({
  colour,
  text,
  x,
  y,
  fill,
  width,
  height,
  onTextChange,
  name,
  deleteDisplay,
  dragChange,
}) => {
  const shapeRef = useRef();
  const [selected, setSelected] = useState(false);

  return (

    <Group x={x} y={y} name={name} draggable onClick={deleteDisplay} onDragEnd={dragChange}>

      <EditableRect
        x={35}
        y={100}
        width={100}
        height={50}
        name={name}
        selected={selected}
        onTextClick={(newSelected) => {
          setSelected(newSelected);
        }}
        ref={shapeRef}
      />
      <EditableSelectRect
        x={-430}
        y={105}
        text={text}
        closed
        name={name}
        selected={selected}
        onTextClick={(newSelected) => {
          setSelected(newSelected);
        }}
      />

      <EditableDiamond
        x={-355}
        y={200}
        text={text}
        points={[135, 20, 150, 10, 165, 20, 150, 30, 135, 20]}
        closed
        name={name}
        selected={selected}
        onTextClick={(newSelected) => {
          setSelected(newSelected);
        }}
      />
      <Text
        fontSize={12}
        text="HOLD"
        fontFamily="var(--font-style)"
        fill="#FFCA27"
        x={-100}
        y={210}
      />
      <Text
        fontSize={12}
        text="REJECT"
        fontFamily="var(--font-style)"
        fill="#FF6F3B"
        x={-230}
        y={210}
      />
      <Text
        fontSize={12}
        text="YES"
        fontFamily="var(--font-style)"
        fill="#14B15A"
        x={-190}
        y={280}
      />
      <Arrow
        x={-170}
        y={45}
        points={[225, 100, 100, 100]}
        fill="#ECEDEE"
        stroke="#A39CEB"
      />
      <Arrow
        x={-250}
        y={70}
        points={[100, 100, 100, 135]}
        fill="#ECEDEE"
        stroke="#A39CEB"
      />
      <Arrow
        x={-250}
        y={175}
        points={[100, 100, 100, 135]}
        fill="#ECEDEE"
        stroke="#A39CEB"
      />
    </Group>

  )
}

export default FlowChartProcedureGroupTwo;
