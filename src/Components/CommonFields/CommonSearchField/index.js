import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import style from './index.module.scss'
import CommonDivider from "../CommonDivider";

const CommonSearchField = ({ searchTerm, setSearchTerm, onChange, searchData, handleShowForSearch, isOnClickAvailable, onClickFunc, placeholder = "Search Staff Reappointments to Process" }) => {
    // const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
        setIsFocused(false);
        setSearchTerm('');
    }
    return (
        <>
            <TextField
                size="small"
                variant="outlined"
                placeholder={placeholder}
                value={searchTerm}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                // onBlur={() => setIsFocused(false)}
                fullWidth
                sx={{ height: "32px", maxWidth: '280px' }}
                InputProps={{
                    sx: { height: "32px", padding: "0px 5px" },
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: isFocused && (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClear} size="small">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            {isFocused && (
                <div className={style.searchDropdown}>
                    <div className={style.searchScroll}>
                        {(searchData || [])?.map((data,index) => (
                            <div className={isOnClickAvailable ? style.cursorPointer : ''} onClick={isOnClickAvailable ? () => onClickFunc(data,index) : () => { }}>
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