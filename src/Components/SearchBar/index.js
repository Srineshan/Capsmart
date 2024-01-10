import React from 'react';
import { InputGroup, Button, Intent } from "@blueprintjs/core";
import style from './index.module.scss';

const SearchBar = ({ getSearchKey, searchKey, className }) => {
  const searchButton = (
    <Button
      icon={"search"}
      intent={Intent.PRIMARY}
      minimal={true}
    />
  );

  return (
    <InputGroup
      large={true}
      round={true}
      type="search"
      placeholder="Search here"
      value={searchKey}
      rightElement={searchButton}
      onChange={(e) => getSearchKey(e.target.value)}
      className={`${className} ${style.searchBarStyle} .bp4-round`}
    />
  )
}

export default SearchBar;
