import React from 'react';
import style from './index.module.scss';

const SearchBar = () => {
  return(
    <div className={style.searchBarStyle}>
        <p>Search here</p>
        <p className={style.marginRight}>&#128269;</p>
    </div>
  )
}

export default SearchBar;
