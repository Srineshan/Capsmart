import React, { useState, useEffect } from "react";
import { Group, Line } from "react-konva";
import { Html } from "react-konva-utils";

function getStyle(width, height) {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const baseStyle = {
    width: `${width}px`,
    height: `${height}px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    background: "none",
    outline: "none",
    resize: "none",
    colour: "black",
    fontSize: "12px",
    fontFamily: "sans-serif",
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
      <textarea
        defaultValue={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={style}
      />
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

const  EditableDiamond = ({
  colour,
  text,
  x,
  y,
  width,
  height,
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
        points={[135, 20, 185, -15, 235, 20, 185, 54, 135, 20]}
        closed
        // fill="#d7d5f6"
        // stroke="#A39CEB"
        fill='white'
        stroke="red"
        name={name}
        strokeWidth={1}
      />
      <EditableText
        x={182}
        y={30}
        text={text}
        width={55}
        height={27}
        onChange={onTextChange}
        name={name}
      />
    </Group>
  );
}

export default EditableDiamond;
