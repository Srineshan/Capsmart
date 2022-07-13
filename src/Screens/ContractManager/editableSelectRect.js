import React, { useState, useEffect } from "react";
import { Group, Line } from "react-konva";
import { Html } from "react-konva-utils";

function getStyle(width, height) {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const baseStyle = {
    width: `${width}px`,
    height: `${height-10}px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    background: "none",
    outline: "none",
    resize: "none",
    colour: "black",
    fontSize: "10px",
    display: 'flex',
    justifyContent:'center',
    fontFamily: "sans-serif",
    alignItem:'center',
    textAlign: 'center'
  };
  if (isFirefox) {
    return baseStyle;
  }
  return {
    ...baseStyle,
    margintop: "-4px"
  };
}

function EditableTextInput({
  x,
  y,
  width,
  height,
  value,
  onChange,
  onKeyDown
}) {
  const style = getStyle(width, height);
  return (
    <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
    <select value={value} onChange={onChange} style={style}>
           <option value="contracted service provider">contracted service provider</option>
           <option value="Designated Reviwer">Designated Reviewer</option>
           <option value="Designated Approver">Designated Approver</option>
         </select>
    </Html>
  );
}

function EditableText({ x, y, onChange, text, width, height }) {
  function handleTextChange(e) {
    onChange(e.currentTarget.value);
  }

  return (
    <EditableTextInput
      x={x}
      y={y}
      width={width}
      height={height}
      value={text}
      onChange={handleTextChange}
    />
  );
}

const  EditableSelectRect = ({
  text,
  x,
  y,
  onTextChange,
  selected,
  name,
  deleteDisplay,
  dragChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  useEffect(() => {
    if (!selected && isEditing) {
      setIsEditing(false);
    } else if (!selected && isTransforming) {
      setIsTransforming(false);
    }
  }, [selected, isEditing, isTransforming]);


  return (
    <Group x={x} y={y} name={name} draggable onClick={deleteDisplay} onDragEnd={dragChange}>
    <Line
        x={20}
        y={20}
        points={[185, 45, 195, 0, 345, 0, 330, 45, 185, 45]}
        closed
        // fill="#d7d5f6"
        fill = 'white'
        stroke="#A39CEB"
        name={name}
        strokeWidth={1}
      />
      <EditableText
        x={220}
        y={32}
        text={text}
        width={130}
        height={30}
        onChange={onTextChange}
        name={name}
      />
    </Group>
  );
}

export default EditableSelectRect;
