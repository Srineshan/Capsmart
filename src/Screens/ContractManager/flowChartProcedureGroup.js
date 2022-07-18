import React, {useState} from 'react';
import { Group, Rect } from "react-konva";
import EditableRect from "./editableRect";
import EditableSlantingRect from "./editableSelectRect";
import EditableDiamond from "./editableDiamond";

const FlowChartProcedureGroup = ({x,y,fill,name}) => {
  
  return(
    <>
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
