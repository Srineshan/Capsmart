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


const ToolBar = () => {
  const [ellipse,setEllipse] = useState([]);
  const [rect,setRect] = useState([]);
  const [diamond,setDiamond] = useState([]);
  const [slantingRect,setSlantingRect] = useState([]);
  const [arrow,setArrow] = useState([]);
  const [lineConnector,setLineConnector] = useState([]);
  const [text,setText] = useState([]);
  const [selectedShapeName,setSelectedShapeName] = useState('')
  const stageRef = useRef(null);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [arrowIndex,setArrowIndex] = useState(null);
  const [yes,setYes] = useState([]);
  const [hold,setHold] = useState([]);
  const [reject,setReject] = useState([]);
  const [selectedTextIndex,setSelectedTextIndex] = useState(null);
  const [deleteValue,setDeleteValue] = useState(null);
  const [startPos,setStartPos] = useState({startX:null,startY:null});
  const [pos,setPos] = useState({x:null,y:null});
  const [drawable,setDrawable] = useState('');

  const [selected,setSelected] = useState(false);

  const handleStageOnClick = (e) => {
    // if(!e.target.attrs.name.includes('arrow') && !e.target.attrs.name.includes('line')){
      setSelectedShapeName(e.target.attrs.name)
    // }
    if(!e.target.attrs.name){
      setDeleteValue({bool:false,name:'',shape:'',x:0,y:0})
    }
  }

  const handleTextDblClick = (e,index) => {
   setSelectedTextIndex(index)
   setIsTextSelected(true);
   const absPos = e.target.getAbsolutePosition();
   let temp = text;
   text[index].visible = true;
   text[index].x = absPos.x;
   text[index].y = absPos.y;
   setText(temp);
 };

   const handleTextareaKeyDown = (e,index) => {
    if (e.keyCode === 9) {
      let temp = text;
      temp[index].visible = false;
      setText(temp);
      setSelectedTextIndex(null);
    }
   };

  const handleTextEdit = (e,index) => {
    let temp = text;
    text[index].text = e.target.value;
    setText(text);
  };

  const displayTextArea = text[selectedTextIndex]?.visible?'block':'none'

  const displayDelete = (x,y,name,index)=>{
    console.log('inside displayDelete')
    setDeleteValue({...deleteValue,bool:true,x:x,y:y,name:name,index:index})
  }

  console.log('delete',deleteValue);

  const onDelete = () => {
    let type = deleteValue?.name;
    if(type === 'text'){
      setText(text?.filter((data,i)=>i!==deleteValue.index)?.map(data=>data));
    }else if(type === 'yes'){
      setYes(yes?.filter((data,i)=>i!==deleteValue.index)?.map(data=>data));
    }else if(type === 'hold'){
      setHold(hold?.filter((data,i)=>i!==deleteValue.index)?.map(data=>data));
    }else if(type === 'reject'){
      setReject(reject?.filter((data,i)=>i!==deleteValue.index)?.map(data=>data));
    }else if(type === 'rect'){
      setRect(rect?.filter((data,i)=>i!==deleteValue.index)?.map(data=>data));
    }else if(type === 'ellipse'){
      setEllipse(ellipse?.filter((data,i)=>i!==deleteValue.index)?.map(data=>data));
    }else if(type === 'slantingRect'){
      setSlantingRect(slantingRect?.filter((data,i)=>i!==deleteValue.index)?.map(data=>data));
    }else if(type === 'diamond'){
      setDiamond(diamond?.filter((data,i)=>i!==deleteValue.index)?.map(data=>data));
    }else{
      setArrow(arrow?.filter((data,i)=>i!==deleteValue.index)?.map(data=>data));
    }
    setDeleteValue({bool:false,x:0,y:0,name:'',index:null})
  }

  const handleMouseDown = (e) => {
    if(drawable!== ''){
      const {x,y} = e.target.getStage().getPointerPosition();
      setStartPos({startX:x,startY:y});
    }
  }

  const handleMouseMove = (e) => {
    const {x,y} = e.target.getStage().getPointerPosition();
    setPos({x:x,y:y});
  }

  const handleMouseUp = (e) => {
    const {x,y} = e.target.getStage().getPointerPosition();
    if(drawable === 'Arrow'){
      setArrow((prevArrow) => [
               ...prevArrow,
               {
                 x: e.target.x(),
                 y: e.target.y(),
                 points: [startPos.startX,startPos.startY,pos.x,pos.y],
                 fill:"#ECEDEE",
                 stroke:"#A39CEB",
                 strokeWidth:"2",
                 name:`arrow${arrow?.length}`
               }
             ]);
    }
    if(drawable === 'Line'){
      setLineConnector((prevLine) => [
               ...prevLine,
               {
                 x: e.target.x(),
                 y: e.target.y(),
                 points: [startPos.startX,startPos.startY,pos.x,pos.y],
                 fill:"#ECEDEE",
                 stroke:"#A39CEB",
                 strokeWidth:"2",
                 name:`line${lineConnector?.length}`
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

  const textChangeRect = (index,value) => {
    let temp = rect;
    temp
      .filter((data, indexValue) => indexValue === index)
      .map((data) => {
        data.text = value;
      });
    setRect(temp);
  }

  const textChangeDiamond = (index,value) => {
    let temp = diamond;
    temp
      .filter((data, indexValue) => indexValue === index)
      .map((data) => {
        data.text = value;
      });
    setDiamond(temp);
  }

  const textChangeSlantingRect = (index,value) => {
    let temp = slantingRect;
    temp
      .filter((data, indexValue) => indexValue === index)
      .map((data) => {
        data.text = value;
      });
    setSlantingRect(temp);
  }

    return (
      <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}  onClick={handleStageOnClick}
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
                       text:"",
                       name:`${e.target.name()}${ellipse?.length ? ellipse?.length+1 : 1}`
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
                       stroke: e.target.stroke(),
                       text:"",
                       name:`${e.target.name()}${rect?.length ? rect?.length+1 : 1}`
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
            <Line
              x={0}
              y={0}
              points={[435, 20, 450, 10, 465, 20, 450, 30, 435, 20]}
              closed
              fill="#fff"
              stroke="#A39CEB"
              strokeWidth={1}
              />
            <Line
              name="draggableDiamond"
              x={0}
              y={0}
              points={[435, 20, 450, 10, 465, 20, 450, 30, 435, 20]}
              closed
              fill="#fff"
              stroke="#A39CEB"
              strokeWidth={1}
              draggable
              onDragEnd={(e) => {
                // push new circle to view
                // note that we must push circle first before returning draggable circle
                // because e.target.x returns draggable circle's positions
                setDiamond((prevDiamond) => [
                  ...prevDiamond,
                  { x: e.target.x(), y: e.target.y(),
                    fill: e.target.fill(),
                    stroke: e.target.stroke(),
                    strokeWidth: e.target.strokeWidth(),
                    text:"",
                    name:`${e.target.name()}${diamond?.length ? diamond?.length+1 : 1}`
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
              x={480}
              y={5}
            />
            <Line
              x={0}
              y={0}
              points={[485, 30, 490, 10, 525, 10, 520, 30, 485, 30]}
              closed
              fill="#fff"
              stroke="#A39CEB"
              strokeWidth={1}
              />
              <Line
                name="draggableSlantingRect"
                x={0}
                y={0}
                points={[485, 30, 490, 10, 525, 10, 520, 30, 485, 30]}
                closed
                draggable
                onDragEnd={(e) => {
                  setSlantingRect((prevSlantingRect) => [
                    ...prevSlantingRect,
                    { x: e.target.x(), y: e.target.y(),
                      fill: e.target.fill(),
                      stroke: e.target.stroke(),
                      strokeWidth: e.target.strokeWidth(),
                      text:'',
                      name:`${e.target.name()}${slantingRect?.length ? slantingRect?.length+1 : 1}`
                    }
                  ]);
                  var stage = stageRef.current;
                  var draggable = stage.findOne(".draggableSlantingRect");
                  draggable.position({ x: 0, y: 0 });
                }}
              />

            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={480}
              y={40}
              onClick={()=>setDrawable('Arrow')}
            />
            <Arrow
                points={[520, 55, 490, 55]}
                fill="#ECEDEE"
                stroke="#A39CEB"
                onClick={()=>setDrawable('Arrow')}
                />
            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={480}
              y={75}
              onClick={()=>setDrawable('Line')}
            />
            <Line
                points={[520, 90, 490, 90]}
                fill="#ECEDEE"
                stroke="#A39CEB"
                onClick={()=>setDrawable('Line')}
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
              text="YES"
              fontFamily="Proxima Nova"
              fill="#00C07F"
              x={494}
              y={120}
              />
            <Text
              fontSize={12}
              text="YES"
              fontFamily="Proxima Nova"
              fill="#00C07F"
              x={494}
              y={120}
              name="draggableYes"
              draggable
               onDragEnd={(e) => {
                 setYes((prevYes) => [
                   ...prevYes,
                   {
                     x: e.target.x(),
                     y: e.target.y(),
                     fill: e.target.fill(),
                     name:`${e.target.name()}${yes?.length ? yes?.length+1 : 1}`,
                     fontFamily: e.target.fontFamily(),
                     text:e.target.text(),
                     fontSize:e.target.fontSize(),
                   }
                 ]);
                 var stage = stageRef.current;
                 var draggable = stage.findOne(".draggableYes");
                 draggable.position({ x: 494, y:120});
               }}
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
              text="HOLD"
              fontFamily="Proxima Nova"
              fill="#FEC106"
              x={488}
              y={155}
            />
            <Text
              fontSize={12}
              text="HOLD"
              fontFamily="Proxima Nova"
              fill="#FEC106"
              x={488}
              y={155}
              name="draggableHold"
              draggable
               onDragEnd={(e) => {
                 setHold((prevHold) => [
                   ...prevHold,
                   {
                     x: e.target.x(),
                     y: e.target.y(),
                     fill: e.target.fill(),
                     name:`${e.target.name()}${hold?.length ? hold?.length+1 : 1}`,
                     fontFamily: e.target.fontFamily(),
                     text:e.target.text(),
                     fontSize:e.target.fontSize(),
                   }
                 ]);
                 var stage = stageRef.current;
                 var draggable = stage.findOne(".draggableHold");
                 draggable.position({ x: 488, y: 155 });
               }}
            />
            <Rect
              width={50}
              height={30}
              fill="#d7d5f6"
              strokeWidth={1}
              x={480}
              y={180}
            />
            <Text
              fontSize={12}
              text="REJECT"
              fontFamily="Proxima Nova"
              fill="#FF6F3B"
              x={484}
              y={190}
            />
            <Text
              fontSize={12}
              text="REJECT"
              fontFamily="Proxima Nova"
              fill="#FF6F3B"
              x={484}
              y={190}
              name="draggableReject"
              draggable
               onDragEnd={(e) => {
                 setReject((prevReject) => [
                   ...prevReject,
                   {
                     x: e.target.x(),
                     y: e.target.y(),
                     fill: e.target.fill(),
                     name:`${e.target.name()}${reject?.length ? reject?.length+1 : 1}`,
                     fontFamily: e.target.fontFamily(),
                     text:e.target.text(),
                     fontSize:e.target.fontSize(),
                   }
                 ]);
                 var stage = stageRef.current;
                 var draggable = stage.findOne(".draggableReject");
                 draggable.position({ x: 484, y: 190 });
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
             deleteDisplay={()=>displayDelete(eachEllipse.x-10,eachEllipse.y-10,'ellipse',index)}
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
             deleteDisplay={()=>displayDelete(eachRect.x-5,eachRect.y-5,'rect',index)}
            />
          ))}
          {diamond.map((eachDiamond,index) => (
            <EditableDiamond
              x={eachDiamond.x}
              y={eachDiamond.y}
              text={eachDiamond.text}
              points={[435, 20, 450, 10, 465, 20, 450, 30, 435, 20]}
              closed
              name={eachDiamond.name}
              selected={selected}
              onTextChange={(value) => {
              textChangeDiamond(index, value);
              }}
               onTextClick={(newSelected) => {
                 setSelected(newSelected);
               }}
              deleteDisplay={(e)=>displayDelete(eachDiamond.x+410,eachDiamond.y+28,'diamond',index)}
            />
          ))}
          {slantingRect.map((eachSlantingRect,index) => (
            <EditableSelectRect
              x={eachSlantingRect.x}
              y={eachSlantingRect.y}
              text={eachSlantingRect.text}
              closed
              name={eachSlantingRect.name}
              selected={selected}
              onTextChange={(value) => {
              textChangeRect(index, value);
              }}
               onTextClick={(newSelected) => {
                 setSelected(newSelected);
               }}
              deleteDisplay={(e)=>displayDelete(eachSlantingRect.x+470,eachSlantingRect.y+20,'slantingRect',index)}
            />
          ))}
          {
          arrow.map((eachArrow,index) => (
            <Arrow
              x={eachArrow.x}
              y={eachArrow.y}
              points={eachArrow.points}
              fill={eachArrow.fill}
              stroke={eachArrow.stroke}
              strokeWidth={eachArrow.strokeWidth}
              onClick={()=>{displayDelete(eachArrow.x+500,eachArrow.y-15,'arrow',index);}}
              draggable={drawable === ''?true:false}
              name={eachArrow.name}
            />
          ))
        }

        {
        lineConnector.map((eachLine,index) => (
          <Line
            x={eachLine.x}
            y={eachLine.y}
            points={eachLine.points}
            fill={eachLine.fill}
            stroke={eachLine.stroke}
            strokeWidth={eachLine.strokeWidth}
            onClick={()=>{displayDelete(eachLine.x-15,eachLine.y-15,'line',index);}}
            draggable={drawable === ''?true:false}
            name={eachLine.name}
          />
        ))
      }
          {yes.map((eachYes,index) => (
            <Text
              x={eachYes.x}
              y={eachYes.y}
              fill={eachYes.fill}
              name={eachYes.name}
              fontFamily={eachYes.fontFamily}
              fontSize={eachYes.fontSize}
              text={eachYes.text}
              onClick={()=>displayDelete(eachYes.x-15,eachYes.y-15,'yes',index)}
              draggable
            />
          ))}
          {hold.map((eachHold,index) => (
            <Text
              x={eachHold.x}
              y={eachHold.y}
              fill={eachHold.fill}
              name={eachHold.name}
              fontFamily={eachHold.fontFamily}
              fontSize={eachHold.fontSize}
              text={eachHold.text}
              onClick={()=>displayDelete(eachHold.x-15,eachHold.y-15,'hold',index)}
              draggable
            />
          ))}
          {reject.map((eachReject,index) => (
            <Text
              x={eachReject.x}
              y={eachReject.y}
              fill={eachReject.fill}
              name={eachReject.name}
              fontFamily={eachReject.fontFamily}
              fontSize={eachReject.fontSize}
              text={eachReject.text}
              onClick={()=>displayDelete(eachReject.x-15,eachReject.y-15,'reject',index)}
              draggable
            />
          ))}
          {deleteValue?.bool &&
            <Text
              x={deleteValue.x}
              y={deleteValue.y}
              name="deleteButton"
              text="Delete"
              id="deleteText"
              onClick={()=>onDelete()}
            />
          }
          <TransformerComponent
            selectedShapeName={selectedShapeName}
          />
        </Layer>
      </Stage>

    );
  }

export default ToolBar;
