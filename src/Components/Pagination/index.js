import React, { useState, useEffect } from 'react';
import { Icon } from '@blueprintjs/core';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ChevronRight from './../../images/chevronRight.png';

import style from './index.module.scss';

const Pagination = ({ selectedPage, selectPage, totalCount, onLimitChange }) => {
  const count = totalCount;
  const [page, setPage] = useState(selectedPage);
  // const limit = 10;
  const [limit, setLimit] = useState(10);
  let isLastPage = (page * limit) >= count;
  let isFirstPage = page === 1;
  const startCount = page === 1 ? 1 : (page * limit) - (limit - 1);
  const endCount = isLastPage ? count : page * limit;
  const rowsPerPageOptions = [10, 20, 50, 'All'];

  useEffect(() => {
    setPage(selectedPage);
  }, [selectedPage])

  const updatePageCount = (type) => {
    if (type === 'increment') {
      if (!isLastPage) {
        selectPage(page + 1);
        setPage(page + 1)
      }
    } else {
      if (!isFirstPage) {
        selectPage(page - 1);
        setPage(page - 1)
      }
    }
  }
  return (
    <div className={style.spaceBetween}>
      <p></p>
      <div className={style.displayInRow}>
        <p className={style.paginationStyle}>{startCount !== count ? `Page ${startCount} - ${endCount} of ${count}` : `Page ${startCount} of ${count}`}</p>
        <div className={`${style.paginationStyle} ${style.marginLeft}`}>Display</div>
        <FormControl sx={{ minWidth: 70 }} size="small">
          <Select
            value={limit === 9999 ? 'All' : limit}
            onChange={(e) => { setLimit(e.target.value === 'All' ? 9999 : e.target.value); onLimitChange(e.target.value === 'All' ? 9999 : e.target.value) }}
            displayEmpty
            size="small"
            variant="standard"
            sx={{ fontSize: 12, padding: "4px 8px", height: "auto" }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option} sx={{ fontSize: 12 }}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={`${style.paginationStyle} ${style.marginLeft}`}>Rows</div>
        <Icon icon="chevron-left" className={`${style.margin} ${style.cursor} ${style.border} ${isFirstPage ? style.disabledLook : ''} ${style.marginLeft}`} onClick={() => { updatePageCount('decrement'); }} />
        <Icon icon="chevron-right" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight} ${isLastPage ? style.disabledLook : ''}`} onClick={() => { updatePageCount('increment'); }} />
        {
          // <img src={ChevronRight} className={style.roundChevron} />
        }
      </div>
    </div >
  )
}

export default Pagination;
