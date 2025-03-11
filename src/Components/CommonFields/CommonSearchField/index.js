import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import style from './index.module.scss'
import CommonDivider from "../CommonDivider";

const CommonSearchField = ({ searchTerm, setSearchTerm, onChange, searchData, handleShowForSearch }) => {
    // const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    return (
        <>
            <TextField
                size="small"
                variant="outlined"
                placeholder="Search Staff Reappointments to Process"
                value={searchTerm}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                // onBlur={() => setIsFocused(false)}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            {isFocused && (
                <div className={style.searchDropdown}>
                    <div className={style.searchScroll}>
                        {(searchData || [])?.map(data => (
                            <div>
                                <div className={style.padding10}>
                                    <div className={style.marginTop10}>
                                        <div className={style.searchName}>{data?.name}</div>
                                        <div className={style.searchDesc}>{data?.desc}</div>
                                    </div>
                                </div>
                                <div className={`${style.padding10} ${style.reduceMarginTop}`}><CommonDivider /></div>
                            </div>
                        ))}
                    </div>
                    {searchTerm !== "" && (
                        <div className={`${style.padding10} ${style.marginTop10} ${style.cursorPointer} ${style.showAllText}`} onClick={() => { handleShowForSearch() }}>
                            {`Show All Search Results For "${searchTerm}"`}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default CommonSearchField;