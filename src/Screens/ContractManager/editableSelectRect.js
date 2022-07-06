import React, { useState, useEffect } from "react";
import { Group, Line } from "react-konva";
import { Html } from "react-konva-utils";

function getStyle(width, height) {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const baseStyle = {
    width: `${width-8}px`,
    height: `${height-10}px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    background: "none",
    outline: "none",
    resize: "none",
    colour: "black",
    fontSize: "5px",
    fontFamily: "sans-serif",
    align:'center',
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
  deleteDisplay
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
    <Group x={x} y={y} name={name} draggable onClick={deleteDisplay}>
    <Line
        x={20}
        y={20}
        points={[485, 30, 492, 10, 540, 10, 532, 30, 485, 30]}
        closed
        fill="#d7d5f6"
        stroke="#A39CEB"
        name={name}
        strokeWidth={1}
      />
      <EditableText
        x={513}
        y={27}
        text={text}
        width={50-2}
        height={20-2}
        onChange={onTextChange}
        name={name}
      />
    </Group>
  );
}

export default EditableSelectRect;
