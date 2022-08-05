import React, {useState,useRef} from 'react';
import { Group, Text, Arrow } from "react-konva";
import EditableRect from "./editableRect";
import EditableSelectRect from "./editableSelectRect";
import EditableDiamond from "./editableDiamond";

const FlowChartProcedureGroup = ({
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
  const [selected,setSelected] = useState(false);
  return(

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
        x={70}
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
        x={150}
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
         fontFamily="Proxima Nova"
         fill="#FEC106"
         x={400}
         y={210}
       />
      <Text
          fontSize={12}
          text="REJECT"
          fontFamily="Proxima Nova"
          fill="#FF6F3B"
          x={260}
          y={210}
      />
      <Text
          fontSize={12}
          text="YES"
          fontFamily="Proxima Nova"
          fill="#00C07F"
          x={320}
          y={280}
      />
      <Arrow
          x={55}
          y={40}
          points={[100, 100, 225, 100]}
          fill="#ECEDEE"
          stroke="#A39CEB"
      />
      <Arrow
          x={255}
          y={70}
          points={[100, 100, 100, 135]}
          fill="#ECEDEE"
          stroke="#A39CEB"
      />
      <Arrow
          x={255}
          y={175}
          points={[100, 100, 100, 135]}
          fill="#ECEDEE"
          stroke="#A39CEB"
      />
    </Group>

  )
}

export default FlowChartProcedureGroup;
