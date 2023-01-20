import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ThemeProvider } from '@mui/styles';
import { createTheme } from '@mui/material';
import MUIRichTextEditor from "mui-rte";
import { convertToRaw } from 'draft-js'
import { currentUser } from '../../utils/auth';

import style from './index.module.scss';

const Notes = () => {
    const [openNotesIndex, setOpenNotesIndex] = useState(0);
    const [isOpenNotes, setIsOpenNotes] = useState(true);
    const [notesArray, setNotesArray] = useState(['Notes 1', 'Notes 1', 'Notes 1']);
    const [value, setValue] = useState('');
    const [stringValue, setStringValue] = useState('');
    const currentUserDetails = currentUser();

    const handleOpenNotes = (index) => {
        setIsOpenNotes(true);
        setOpenNotesIndex(index);
    }

    const handleFunct = (event) => {
        console.log(event.getCurrentContent().getPlainText(), JSON.stringify(convertToRaw(event.getCurrentContent())));
        console.log(JSON.stringify(convertToRaw(event.getCurrentContent())));
        if (stringValue !== event.getCurrentContent().getPlainText()) {
            console.log('entered')
            setStringValue(event.getCurrentContent().getPlainText())
            setValue(JSON.stringify(convertToRaw(event.getCurrentContent())))
        }
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#7165E3',
            },
        },
    });

    console.log(value)
    return (
        notesArray?.map((data, index) => (
            <div className={`${style.notesContainer} ${style.marginTop}`}>
                <div className={`${style.notesHeader} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                    {(openNotesIndex === index && isOpenNotes) ? (
                        <AddIcon sx={{ fontSize: 20, color: '#93989f' }} className={style.cursorPointer} />
                    ) : (
                        <div className={style.notesTextColor}>
                            <strong>{currentUserDetails?.fullName}</strong> created a note on Oct 7, 2022 12:34 PM
                        </div>
                    )}
                    {(openNotesIndex === index && isOpenNotes) ? (
                        <div className={style.displayInRow}>
                            <RemoveCircleOutlineIcon sx={{ fontSize: 20, color: '#93989f' }} onClick={() => setIsOpenNotes(false)} className={style.cursorPointer} />
                            <DeleteOutlinedIcon sx={{ fontSize: 20, color: '#93989f' }} className={`${style.marginLeft10} ${style.cursorPointer}`} />
                        </div>
                    ) : (
                        <AddCircleOutlineIcon sx={{ fontSize: 20, color: '#93989f' }} onClick={() => handleOpenNotes(index)} className={style.cursorPointer} />
                    )}
                </div>
                {openNotesIndex === index && isOpenNotes && (
                    <div className={style.notesBody}>
                        <div className={style.notesTextColor}>
                            <strong>{currentUserDetails?.fullName}</strong> created a note on Oct 7, 2022 12:34 PM
                        </div>
                        <ThemeProvider theme={theme}>
                            <MUIRichTextEditor
                                label="To create a note in the contract scratch pad, you can type your note or you can highlight a section of text from the selected reference document on the left. Copy and paste the selected text over here. This text will remain in the scratch pad for you to refer to."
                                onChange={(event) => handleFunct(event)}
                                toolbar={false}
                                defaultValue={value}
                            />
                        </ThemeProvider>
                    </div>
                )}
            </div>
        ))
    )
}

export default Notes;