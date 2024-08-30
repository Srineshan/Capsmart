import React, { Component, useState, useRef, useEffect } from 'react';
import Konva from 'konva';
import { EditableText } from '@blueprintjs/core';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Shape, Ellipse, Rect, Text, Arrow, Line, Group } from 'react-konva';
import style from './index.module.scss';
import { TransformerComponent } from "./transformer";
import EditableRect from "./editableRect";
import EditableEllipse from "./editableEllipse";
import EditableDiamond from "./editableDiamond";
import EditableSelectRect from "./editableSelectRect";
import FlowChartProcedureGroup from "./flowChartProcedureGroup";
import FlowChartProcedureGroupTwo from "./flowChartProcedureGroupTwo";


const ToolBar = () => {
  const [ellipse, setEllipse] = useState([]);
  const [rect, setRect] = useState([]);
  const [diamond, setDiamond] = useState([]);
  const [slantingRect, setSlantingRect] = useState([]);
  const [arrow, setArrow] = useState([]);
  const [lineConnector, setLineConnector] = useState([]);
  const [group, setGroup] = useState([]);
  const [groupTwo, setGroupTwo] = useState([]);
  const [selectedShapeName, setSelectedShapeName] = useState('')
  const stageRef = useRef(null);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [arrowIndex, setArrowIndex] = useState(null);
  const [yes, setYes] = useState([]);
  const [hold, setHold] = useState([]);
  const [reject, setReject] = useState([]);
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const [deleteValue, setDeleteValue] = useState(null);
  const [startPos, setStartPos] = useState({ startX: null, startY: null });
  const [pos, setPos] = useState({ x: null, y: null });
  const [drawable, setDrawable] = useState('');
  const shapeRef = useRef();
  const trRef = useRef();

  const [selected, setSelected] = useState(false);

  const handleStageOnClick = (e) => {
    // if(!e.target.attrs.name.includes('arrow') && !e.target.attrs.name.includes('line')){
    setSelectedShapeName(e.target.attrs.name)
    // trRef.current.nodes([shapeRef.current]);
    // trRef.current.getLayer().batchDraw();
    // }
    if (!e.target.attrs.name) {
      setDeleteValue({ bool: false, name: '', shape: '', x: 0, y: 0 })
    }
  }

  const displayDelete = (x, y, name, index) => {
    setDeleteValue({ ...deleteValue, bool: true, x: x, y: y, name: name, index: index })
  }

  const onDelete = () => {
    let type = deleteValue?.name;
    if (type === 'yes') {
      setYes(yes?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    } else if (type === 'hold') {
      setHold(hold?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    } else if (type === 'reject') {
      setReject(reject?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    } else if (type === 'rect') {
      setRect(rect?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    } else if (type === 'ellipse') {
      setEllipse(ellipse?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    } else if (type === 'slantingRect') {
      setSlantingRect(slantingRect?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    } else if (type === 'diamond') {
      setDiamond(diamond?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    } else if (type === 'arrow') {
      setArrow(arrow?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    } else if (type === 'group') {
      setGroup(group?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    } else if (type === 'groupTwo') {
      setGroupTwo(groupTwo?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    }
    else {
      setLineConnector(lineConnector?.filter((data, i) => i !== deleteValue.index)?.map(data => data));
    }
    setDeleteValue({ bool: false, x: 0, y: 0, name: '', index: null })
  }

  const handleMouseDown = (e) => {
    if (drawable !== '') {
      const { x, y } = e.target.getStage().getPointerPosition();
      setStartPos({ startX: x, startY: y });
    }
  }

  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    setPos({ x: x, y: y });
  }

  const handleMouseUp = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    if (drawable === 'Arrow') {
      setArrow((prevArrow) => [
        ...prevArrow,
        {
          x: e.target.x(),
          y: e.target.y(),
          points: [startPos.startX, startPos.startY, pos.x, pos.y],
          fill: "#ECEDEE",
          stroke: "#A39CEB",
          strokeWidth: "2",
          name: `arrow${arrow?.length}`
        }
      ]);
    }
    if (drawable === 'Line') {
      setLineConnector((prevLine) => [
        ...prevLine,
        {
          x: e.target.x(),
          y: e.target.y(),
          points: [startPos.startX, startPos.startY, pos.x, pos.y],
          fill: "#ECEDEE",
          stroke: "#A39CEB",
          strokeWidth: "2",
          name: `line${lineConnector?.length}`
        }
      ]);
    }
    setDrawable('');
  }

  const textChangeEllipse = (index, value) => {
    let temp = ellipse;
    temp
      .filter((data, indexValue) => indexValue === index)
      .map((data) => {
        data.text = value;
      });
    setEllipse(temp);
  };

  const textChangeRect = (index, value) => {
    let temp = rect;
    temp
      .filter((data, indexValue) => indexValue === index)
      .map((data) => {
        data.text = value;
      });
    setRect(temp);
  }

  const textChangeDiamond = (index, value) => {
    let temp = diamond;
    temp
      .filter((data, indexValue) => indexValue === index)
      .map((data) => {
        data.text = value;
      });
    setDiamond(temp);
  }

  const textChangeSlantingRect = (index, value) => {
    let temp = slantingRect;
    temp
      .filter((data, indexValue) => indexValue === index)
      .map((data) => {
        data.text = value;
      });
    setSlantingRect(temp);
  }

  const handleDragChange = (e, index, shapeName) => {
    if (shapeName === 'ellipse') {
      let temp = ellipse;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setEllipse(temp);
    }
    else if (shapeName === 'rect') {
      let temp = rect;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setRect(temp);
    }
    else if (shapeName === 'diamond') {
      let temp = diamond;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setDiamond(temp);
    }
    else if (shapeName === 'slantingRect') {
      let temp = slantingRect;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setSlantingRect(temp);
    }
    else if (shapeName === 'arrow') {
      let temp = arrow;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setArrow(temp);
    }
    else if (shapeName === 'lineConnector') {
      let temp = lineConnector;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setLineConnector(temp);
    }
    else if (shapeName === 'yes') {
      let temp = yes;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setYes(temp);
    }
    else if (shapeName === 'hold') {
      let temp = hold;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setHold(temp);
    }
    else if (shapeName === 'group') {
      let temp = group;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setGroup(temp);
    }
    else if (shapeName === 'groupTwo') {
      let temp = groupTwo;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setGroupTwo(temp);
    }
    else {
      let temp = reject;
      temp[index].x = e.target.x();
      temp[index].y = e.target.y();
      setReject(temp);
    }
  }

  const checkBound = (e) => {
    let diamondYAxis = diamond?.map(data => data);
    let checkableValueX = 0;
    let checkableValueY = 0;
    let higherBoundY = 0;
    let lowerBoundY = 0;
    let higherBoundX = 0;
    let lowerBoundX = 0;
    let value = [];
    let response = false;
    for (let i = 0; i < diamondYAxis?.length; i++) {
      checkableValueY = diamondYAxis[i].y;
      checkableValueX = diamondYAxis[i].x;
      higherBoundY = checkableValueY + 100;
      lowerBoundY = checkableValueY - 100;
      higherBoundX = checkableValueX + 350;
      lowerBoundX = checkableValueX - 100;
      if (e.target.y() < higherBoundY && e.target.y() > lowerBoundY && e.target.x() < higherBoundX && e.target.x() > lowerBoundX) {
        value.push(true);
      } else {
        value.push(false);
      }
    }
    if (value.includes(true)) {
      response = true;
    } else {
      response = false;
    }
    return response;
  }
  console.log('Group', group);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef} onClick={handleStageOnClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <Layer>
        <Rect
          width={50}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={15}
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
          x={40}
          y={20}
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
          x={40}
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
                width: 120,
                height: 40,
                text: "",
                name: `${e.target.name()}${ellipse?.length ? ellipse?.length + 1 : 1}`
              }
            ]);

            // return draggable circle to original position
            // notice the dot (.) before "draggableCircle"
            var stage = stageRef.current;
            var draggable = stage.findOne(".draggableEllipse");
            draggable.position({ x: 40, y: 20 });
          }}
        />
        <Rect
          width={50}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={70}
          y={5}
        />

        <Rect
          width={40}
          height={20}
          fill="#fff"
          stroke="#A39CEB"
          strokeWidth={1}
          x={75}
          y={10}
        />
        <Rect
          width={40}
          height={20}
          fill="#fff"
          stroke="#A39CEB"
          strokeWidth={1}
          x={75}
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
                width: 120,
                height: 50,
                stroke: e.target.stroke(),
                text: "",
                name: `${e.target.name()}${rect?.length ? rect?.length + 1 : 1}`
              }
            ]);

            // return draggable circle to original position
            // notice the dot (.) before "draggableCircle"
            var stage = stageRef.current;
            var draggable = stage.findOne(".draggableRect");
            draggable.position({ x: 75, y: 10 });
          }}
        />
        <Rect
          width={50}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={125}
          y={5}
        />
        <Line
          x={0}
          y={0}
          points={[135, 20, 150, 10, 165, 20, 150, 30, 135, 20]}
          closed
          fill="#fff"
          stroke="#A39CEB"
          strokeWidth={1}
        />
        <Line
          name="draggableDiamond"
          x={0}
          y={0}
          points={[135, 20, 150, 10, 165, 20, 150, 30, 135, 20]}
          closed
          fill="#fff"
          // stroke="#A39CEB"
          stroke="red"
          strokeWidth={1}
          draggable
          onDragEnd={(e) => {
            // push new circle to view
            // note that we must push circle first before returning draggable circle
            // because e.target.x returns draggable circle's positions
            setDiamond((prevDiamond) => [
              ...prevDiamond,
              {
                x: e.target.x(), y: e.target.y(),
                fill: e.target.fill(),
                stroke: e.target.stroke(),
                strokeWidth: e.target.strokeWidth(),
                text: "",
                name: `${e.target.name()}${diamond?.length ? diamond?.length + 1 : 1}`
              }
            ]);

            // return draggable circle to original position
            // notice the dot (.) before "draggableCircle"
            var stage = stageRef.current;
            var draggable = stage.findOne(".draggableDiamond");
            draggable.position({ x: 0, y: 0 });
          }}
        />
        <Rect
          width={50}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={180}
          y={5}
        />
        <Line
          x={0}
          y={0}
          points={[185, 30, 190, 10, 225, 10, 220, 30, 185, 30]}
          closed
          fill="#fff"
          stroke="#A39CEB"
          strokeWidth={1}
        />
        <Line
          name="draggableSlantingRect"
          x={0}
          y={0}
          points={[185, 30, 190, 10, 225, 10, 220, 30, 185, 30]}
          closed
          draggable
          onDragEnd={(e) => {
            setSlantingRect((prevSlantingRect) => [
              ...prevSlantingRect,
              {
                x: e.target.x(), y: e.target.y(),
                fill: e.target.fill(),
                stroke: e.target.stroke(),
                strokeWidth: e.target.strokeWidth(),
                text: '',
                name: `${e.target.name()}${slantingRect?.length ? slantingRect?.length + 1 : 1}`
              }
            ]);
            var stage = stageRef.current;
            var draggable = stage.findOne(".draggableSlantingRect");
            draggable.position({ x: 0, y: 0 });
          }}
        />
        <Rect
          width={57}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={235}
          y={5}
        />
        <Text
          fontSize={12}
          text="GROUP 1"
          fontFamily="proxima-nova"
          fill="black"
          strokeWidth={1}
          stroke="black"
          x={240}
          y={15}
          name="group1"
          draggable
          onDragEnd={(e) => {
            setGroup((prevGroup) => [
              ...prevGroup,
              {
                x: e.target.x(), y: e.target.y(),
                fill: e.target.fill(),
                stroke: e.target.stroke(),
                strokeWidth: e.target.strokeWidth(),
                text: '',
                name: `${e.target.name()}${group?.length ? group?.length + 1 : 1}`
              }
            ]);
            var stage = stageRef.current;
            var draggable = stage.findOne(".group1");
            draggable.position({ x: 240, y: 15 });
          }}
        />
        <Rect
          width={57}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={300}
          y={5}
        />
        <Text
          fontSize={12}
          text="GROUP 2"
          fontFamily="proxima-nova"
          fill="black"
          strokeWidth={1}
          stroke="black"
          x={305}
          y={15}
          name="group2"
          draggable
          onDragEnd={(e) => {
            setGroupTwo((prevGroup) => [
              ...prevGroup,
              {
                x: e.target.x(), y: e.target.y(),
                fill: e.target.fill(),
                stroke: e.target.stroke(),
                strokeWidth: e.target.strokeWidth(),
                text: '',
                name: `${e.target.name()}${group?.length ? group?.length + 1 : 1}`
              }
            ]);
            var stage = stageRef.current;
            var draggable = stage.findOne(".group2");
            draggable.position({ x: 305, y: 15 });
          }}
        />
        <Rect
          width={50}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={15}
          y={40}
          onClick={() => setDrawable('Arrow')}
        />
        <Arrow
          points={[60, 55, 20, 55]}
          fill="#ECEDEE"
          stroke="#A39CEB"
          onClick={() => setDrawable('Arrow')}
        />
        <Rect
          width={50}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={15}
          y={75}
          onClick={() => setDrawable('Line')}
        />
        <Line
          points={[60, 90, 20, 90]}
          fill="#ECEDEE"
          stroke="#A39CEB"
          onClick={() => setDrawable('Line')}
        />
        <Rect
          width={50}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={15}
          y={110}
        />
        <Text
          fontSize={12}
          text="YES"
          fontFamily="proxima-nova"
          fill="#00C07F"
          x={27}
          y={120}
        />
        <Text
          fontSize={12}
          text="YES"
          fontFamily="proxima-nova"
          fill="#00C07F"
          x={27}
          y={120}
          name="draggableYes"
          draggable
          onDragEnd={(e) => {
            if (checkBound(e)) {
              setYes((prevYes) => [
                ...prevYes,
                {
                  x: e.target.x(),
                  y: e.target.y(),
                  fill: e.target.fill(),
                  name: `${e.target.name()}${yes?.length ? yes?.length + 1 : 1}`,
                  fontFamily: e.target.fontFamily(),
                  text: e.target.text(),
                  fontSize: 15,
                }
              ]);
            } else {
              alert(`Out of Bound! Deciding Text's are limited only around decision making elements`);
            }
            var stage = stageRef.current;
            var draggable = stage.findOne(".draggableYes");
            draggable.position({ x: 27, y: 120 });
          }}
        />
        <Rect
          width={50}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={15}
          y={145}
        />
        <Text
          fontSize={12}
          text="HOLD"
          fontFamily="proxima-nova"
          fill="#FEC106"
          x={23}
          y={155}
        />
        <Text
          fontSize={12}
          text="HOLD"
          fontFamily="proxima-nova"
          fill="#FEC106"
          x={23}
          y={155}
          name="draggableHold"
          draggable
          onDragEnd={(e) => {
            if (checkBound(e)) {
              setHold((prevHold) => [
                ...prevHold,
                {
                  x: e.target.x(),
                  y: e.target.y(),
                  fill: e.target.fill(),
                  name: `${e.target.name()}${hold?.length ? hold?.length + 1 : 1}`,
                  fontFamily: e.target.fontFamily(),
                  text: e.target.text(),
                  fontSize: 15,
                }
              ]);
            } else {
              alert(`Out of Bound! Deciding Text's are limited only around decision making elements`);
            }
            var stage = stageRef.current;
            var draggable = stage.findOne(".draggableHold");
            draggable.position({ x: 23, y: 155 });
          }}
        />
        <Rect
          width={50}
          height={30}
          fill="#d7d5f6"
          strokeWidth={1}
          x={15}
          y={180}
        />
        <Text
          fontSize={12}
          text="REJECT"
          fontFamily="proxima-nova"
          fill="#FF6F3B"
          x={18}
          y={190}
        />
        <Text
          fontSize={12}
          text="REJECT"
          fontFamily="proxima-nova"
          fill="red"
          x={18}
          y={190}
          name="draggableReject"
          draggable
          onDragEnd={(e) => {
            if (checkBound(e)) {
              setReject((prevReject) => [
                ...prevReject,
                {
                  x: e.target.x(),
                  y: e.target.y(),
                  fill: e.target.fill(),
                  name: `${e.target.name()}${reject?.length ? reject?.length + 1 : 1}`,
                  fontFamily: e.target.fontFamily(),
                  text: e.target.text(),
                  fontSize: 15,
                }
              ]);
            } else {
              alert(`Out of Bound! Deciding Text's are limited only around decision making elements`);
            }
            var stage = stageRef.current;
            var draggable = stage.findOne(".draggableReject");
            draggable.position({ x: 18, y: 190 });
          }}
        />
        {ellipse.map((eachEllipse, index) => (
          <EditableEllipse
            x={eachEllipse.x}
            y={eachEllipse.y}
            width={eachEllipse.width}
            height={eachEllipse.height}
            name={eachEllipse.name}
            selected={selected}
            onTextChange={(value) => {
              textChangeEllipse(index, value);
            }}
            onTextClick={(newSelected) => {
              setSelected(newSelected);
            }}
            deleteDisplay={() => displayDelete(eachEllipse.x - 40, eachEllipse.y - 12, 'ellipse', index)}
            dragChange={(e) => handleDragChange(e, index, 'ellipse')}
            transformChange={console.log('transformed')}
          />
        ))}
        {rect.map((eachRect, index) => (
          <EditableRect
            x={eachRect.x}
            y={eachRect.y}
            width={eachRect.width}
            height={eachRect.height}
            name={eachRect.name}
            selected={selected}
            onTextChange={(value) => {
              textChangeRect(index, value);
            }}
            onTextClick={(newSelected) => {
              setSelected(newSelected);
            }}
            ref={shapeRef}
            deleteDisplay={() => displayDelete(eachRect.x, eachRect.y, 'rect', index)}
            dragChange={(e) => handleDragChange(e, index, 'rect')}
          />
        ))}
        {diamond.map((eachDiamond, index) => (
          <EditableDiamond
            x={eachDiamond.x}
            y={eachDiamond.y}
            text={eachDiamond.text}
            points={[135, 20, 150, 10, 165, 20, 150, 30, 135, 20]}
            closed
            name={eachDiamond.name}
            selected={selected}
            onTextChange={(value) => {
              textChangeDiamond(index, value);
            }}
            onTextClick={(newSelected) => {
              setSelected(newSelected);
            }}
            deleteDisplay={(e) => displayDelete(eachDiamond.x + 115, eachDiamond.y + 26, 'diamond', index)}
            dragChange={(e) => handleDragChange(e, index, 'diamond')}
          />
        ))}
        {slantingRect.map((eachSlantingRect, index) => (
          <EditableSelectRect
            x={eachSlantingRect.x}
            y={eachSlantingRect.y}
            text={eachSlantingRect.text}
            closed
            name={eachSlantingRect.name}
            selected={selected}
            onTextChange={(value) => {
              textChangeSlantingRect(index, value);
            }}
            onTextClick={(newSelected) => {
              setSelected(newSelected);
            }}
            deleteDisplay={(e) => displayDelete(eachSlantingRect.x + 160, eachSlantingRect.y + 20, 'slantingRect', index)}
            dragChange={(e) => handleDragChange(e, index, 'slantingRect')}
          />
        ))}
        {
          arrow.map((eachArrow, index) => (
            <Arrow
              x={eachArrow.x}
              y={eachArrow.y}
              points={eachArrow.points}
              fill={eachArrow.fill}
              stroke={eachArrow.stroke}
              strokeWidth={eachArrow.strokeWidth}
              onClick={() => { displayDelete(eachArrow.points?.[2] + 5, eachArrow.points?.[3], 'arrow', index); }}
              draggable={drawable === '' ? true : false}
              name={eachArrow.name}
              onDragEnd={(e) => handleDragChange(e, index, 'arrow')}
            />
          ))
        }

        {
          lineConnector.map((eachLine, index) => (
            <Line
              x={eachLine.x}
              y={eachLine.y}
              points={eachLine.points}
              fill={eachLine.fill}
              stroke={eachLine.stroke}
              strokeWidth={eachLine.strokeWidth}
              onClick={() => { displayDelete(eachLine.points?.[2] + 5, eachLine.points?.[3], 'line', index); }}
              draggable={drawable === '' ? true : false}
              name={eachLine.name}
              onDragEnd={(e) => handleDragChange(e, index, 'lineConnector')}
            />
          ))
        }
        {yes.map((eachYes, index) => (
          <Text
            x={eachYes.x}
            y={eachYes.y}
            fill={eachYes.fill}
            name={eachYes.name}
            fontFamily={eachYes.fontFamily}
            fontSize={eachYes.fontSize}
            text={eachYes.text}
            onClick={() => displayDelete(eachYes.x - 15, eachYes.y - 15, 'yes', index)}
            draggable
            onDragEnd={(e) => {
              if (checkBound(e)) {
                handleDragChange(e, index, 'yes');
              } else {
                alert(`Out of Bound! Deciding Text's are limited only around decision making elements`);
                var stage = stageRef.current;
                var draggable = stage.findOne(`.${eachYes.name}`);
                draggable.position({ x: eachYes.x, y: eachYes.y });
              }
            }}
          />
        ))}
        {hold.map((eachHold, index) => (
          <Text
            x={eachHold.x}
            y={eachHold.y}
            fill={eachHold.fill}
            name={eachHold.name}
            fontFamily={eachHold.fontFamily}
            fontSize={eachHold.fontSize}
            text={eachHold.text}
            onClick={() => displayDelete(eachHold.x - 15, eachHold.y - 15, 'hold', index)}
            draggable
            onDragEnd={(e) => {
              if (checkBound(e)) {
                handleDragChange(e, index, 'hold');
              }
              else {
                alert(`Out of Bound! Deciding Text's are limited only around decision making elements`);
                var stage = stageRef.current;
                var draggable = stage.findOne(`.${eachHold.name}`);
                draggable.position({ x: eachHold.x, y: eachHold.y });
              }
            }}
          />
        ))}
        {reject.map((eachReject, index) => (
          <Text
            x={eachReject.x}
            y={eachReject.y}
            fill={eachReject.fill}
            name={eachReject.name}
            fontFamily={eachReject.fontFamily}
            fontSize={eachReject.fontSize}
            text={eachReject.text}
            onClick={() => displayDelete(eachReject.x - 15, eachReject.y - 15, 'reject', index)}
            draggable
            onDragEnd={(e) => {
              if (checkBound(e)) {
                handleDragChange(e, index, 'reject');
              }
              else {
                alert(`Out of Bound! Deciding Text's are limited only around decision making elements`);
                var stage = stageRef.current;
                var draggable = stage.findOne(`.${eachReject.name}`);
                draggable.position({ x: eachReject.x, y: eachReject.y });
              }
            }}
          />
        ))}
        {
          group.map((eachGroup, index) => (
            <FlowChartProcedureGroup
              x={eachGroup.x}
              y={eachGroup.y}
              fill={eachGroup.fill}
              name={eachGroup.name}
              deleteDisplay={() => displayDelete(eachGroup.x + 200, eachGroup.y + 100, 'group', index)}
              dragChange={(e) => handleDragChange(e, index, 'group')}
            />
          ))
        }
        {
          groupTwo.map((eachGroup, index) => (
            <FlowChartProcedureGroupTwo
              x={eachGroup.x}
              y={eachGroup.y}
              fill={eachGroup.fill}
              name={eachGroup.name}
              deleteDisplay={() => displayDelete(eachGroup.x - 40, eachGroup.y + 100, 'groupTwo', index)}
              dragChange={(e) => handleDragChange(e, index, 'groupTwo')}
            />
          ))
        }
        {deleteValue?.bool &&
          <Text
            x={deleteValue.x}
            y={deleteValue.y}
            name="deleteButton"
            text="Delete"
            id="deleteText"
            onClick={() => onDelete()}
          />
        }
        {
          // <TransformerComponent
          //   ref={trRef}
          //   selectedShapeName={selectedShapeName !== undefined && !selectedShapeName.includes('arrow') && !selectedShapeName.includes('line')?selectedShapeName:undefined}
          // />
        }

      </Layer>
    </Stage>

  );
}

export default ToolBar;
