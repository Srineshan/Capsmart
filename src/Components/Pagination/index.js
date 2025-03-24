import React, { useState, useEffect } from 'react';
import { Icon } from '@blueprintjs/core';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ChevronRight from './../../images/chevronRight.png';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import style from './index.module.scss';

const Pagination = ({ selectedPage, selectPage, totalCount, onLimitChange }) => {
  const count = totalCount;
  const [page, setPage] = useState(selectedPage);
  // const limit = 10;
  const [limit, setLimit] = useState(9999);
  let isLastPage = (page * limit) >= count;
  let isFirstPage = page === 1;
  const startCount = (page === 1 || limit === 9999) ? 1 : (page * limit) - (limit - 1);
  const endCount = isLastPage ? count : page * limit;
  const rowsPerPageOptions = [10, 20, 50, `All (${count})`];

  useEffect(() => {
    setPage(selectedPage);
  }, [selectedPage])

  const updatePageCount = (type) => {
    if (type === 'increment') {
      if (!isLastPage) {
        selectPage(page + 1);
        setPage(page + 1)
      }
    } else if (type === 'decrement') {
      if (!isFirstPage) {
        selectPage(page - 1);
        setPage(page - 1)
      }
    } else if (type === 'first') {
      if (!isFirstPage) {
        selectPage(1);
        setPage(1)
      }
    } else if (type === 'last') {
      if (!isLastPage) {
        selectPage(limit === totalCount ? 1 : Math.ceil(totalCount / limit));
        setPage(limit === totalCount ? 1 : Math.ceil(totalCount / limit))
      }
    }
  }
  return (
    <div className={style.spaceBetween}>
      <div></div>
      <div className={style.displayInRow}>
        <div className={`${style.paginationStyle} ${style.verticalAlignCenter}`}>Show</div>
        <div className={`${style.paginationStyle} ${style.marginLeft}  ${style.verticalAlignCenter}`}>
          <FormControl sx={{ minWidth: 70 }} size="small" >
            <Select
              value={limit === 9999 ? `All (${count})` : limit}
              onChange={(e) => { setLimit(e.target.value === `All (${count})` ? 9999 : e.target.value); onLimitChange(e.target.value === `All (${count})` ? 9999 : e.target.value) }}
              displayEmpty
              size="small"
              // variant="standard"
              sx={{
                fontSize: 12,
                padding: "4px 8px",
                height: "32px",
                minHeight: "32px",
                "& .MuiSelect-select": {
                  padding: "4px 4px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
              }}
            >
              {rowsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option} sx={{ fontSize: 12 }}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={style.verticalAlignCenter}>
          <FirstPageIcon sx={{ font: '16px' }} className={`${style.marginTopBottom} ${style.cursor} ${isFirstPage ? style.disabledLook : ''} ${style.marginLeft}`} onClick={() => { updatePageCount('first'); }} />
          <NavigateBeforeIcon sx={{ font: '16px' }} className={`${style.marginTopBottom} ${style.cursor} ${isFirstPage ? style.disabledLook : ''}`} onClick={() => { updatePageCount('decrement'); }} />
          <div className={style.paginationCount}>
            {/* <p className={`${style.paginationStyle} ${style.verticalAlignCenter}`}>{startCount !== count ? `${startCount} - ${endCount} of ${count}` : `${startCount} of ${count}`}</p> */}
            <p className={`${style.paginationStyle} ${style.verticalAlignCenter}`}>{`Page ${page} of ${Math.ceil(totalCount / limit)}`}</p>
          </div>
          <NavigateNextIcon sx={{ font: '16px' }} className={`${style.marginTopBottom} ${style.cursor} ${isLastPage ? style.disabledLook : ''}`} onClick={() => { updatePageCount('increment'); }} />
          <LastPageIcon sx={{ font: '16px' }} className={`${style.marginTopBottom} ${style.cursor} ${isLastPage ? style.disabledLook : ''}`} onClick={() => { updatePageCount('last'); }} />
        </div>
        {/* <Icon icon="chevron-left" className={`${style.margin} ${style.cursor} ${style.border} ${isFirstPage ? style.disabledLook : ''} ${style.marginLeft}`} onClick={() => { updatePageCount('decrement'); }} />
        <Icon icon="chevron-right" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight} ${isLastPage ? style.disabledLook : ''}`} onClick={() => { updatePageCount('increment'); }} /> */}
        {
          // <img src={ChevronRight} className={style.roundChevron} />
        }
      </div>
    </div >
  )
}

export default Pagination;
