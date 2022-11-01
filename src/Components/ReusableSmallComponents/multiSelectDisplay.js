import React, {useState, useEffect} from 'react';
import CloseIcon from '@mui/icons-material/Close';

import style from './index.module.scss';

const MultiSelectDisplay = ({values, removeItem}) => {
  const [list, setList] = useState([]);
  useEffect(()=>{
    setList(values);
  },[values])

    return(
        <div>
            <div className={`${style.siteDeptFieldCard} ${style.displayInRow} ${style.marginTop10}`}>
                {list?.map((data, index) => (
                    <div className={`${style.deptCard} ${style.displayInRow} ${style.verticalAlignCenter}`} key={index}>
                        <div className={`${style.siteDeptTextStyle} ${style.marginLeft10}`}>{data}</div>
                        <CloseIcon fontSize="20px" className={`${style.siteDeptCrossStyle} ${style.marginLeft10} ${style.cursorPointer}`} onClick={()=>removeItem(index)}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MultiSelectDisplay;
