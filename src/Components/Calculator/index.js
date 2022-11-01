import React,{useState} from 'react';
import Calculator from "awesome-react-calculator";
import style from './index.module.scss';

const CalculatorComponent = () => {
  return(
      <div className={`${style.calculator}`}>
        <Calculator/>
      </div>
  )
}

export default CalculatorComponent;
