import React, {useState} from 'react';
import { Group, Rect } from "react-konva";
import EditableRect from "./editableRect";
import EditableSlantingRect from "./editableSelectRect";
import EditableDiamond from "./editableDiamond";

const FlowChartProcedureGroup = ({x,y,fill,name}) => {
  return(
    <>
    {
      // <Group x={x} y={y} name={name} draggable >
      //   <Rect
      //     x={20}
      //     y={20}
      //     width={100}
      //     height={50}
      //     fill="#d7d5f6"
      //     stroke="#A39CEB"
      //     perfectDrawEnabled={false}
      //     strokeWidth={1}
      //     name="Rect"
      //   />
      //
      // </Group>
    }
    <Rect
      x={x}
      y={y}
      width={100}
      height={50}
      fill="#fff"
      stroke="#A39CEB"
      strokeWidth={1}
      name={name}
    />
    </>
  )
}

export default FlowChartProcedureGroup;
