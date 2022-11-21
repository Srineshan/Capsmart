import React, {useState, useEffect} from 'react';
import {Icon} from '@blueprintjs/core';
import ChevronRight from './../../images/chevronRight.png';

import style from './index.module.scss';

const Pagination = ({selectedPage, selectPage, totalCount}) => {
  const count = totalCount;
  const [page, setPage] = useState(selectedPage);
  const limit = 10;
  let isLastPage = (page*limit) >= count;
  let isFirstPage = page === 1;
  const startCount = page === 1 ? 1 : (page*limit) - (limit-1);
  const endCount = isLastPage ? count : page*limit;

  useEffect(()=>{
    setPage(selectedPage);
  },[selectedPage])

  const updatePageCount = (type) => {
    if(type === 'increment'){
      if(!isLastPage){
        selectPage(page+1);
        setPage(page+1)
      }
    }else{
      if(!isFirstPage){
        selectPage(page-1);
        setPage(page-1)
      }
    }
  }
  return(
    <div className={style.spaceBetween}>
    <p></p>
        <div className={style.displayInRow}>
            <Icon icon="chevron-left" className={`${style.margin} ${style.cursor} ${style.border}`} onClick={()=>{updatePageCount('decrement');}}/>
              <p className={style.paginationStyle}>{startCount !== count ? `${startCount} - ${endCount} of ${count}` : `${startCount} of ${count}`}</p>
            <Icon icon="chevron-right" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={()=>{updatePageCount('increment');}}/>
            {
              // <img src={ChevronRight} className={style.roundChevron} />
            }
        </div>
    </div>
  )
}

export default Pagination;
