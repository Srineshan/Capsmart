import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import style from './index.module.scss';

const PriorDataDialog = ({  getIsOpen, fieldKey, baseKey, handleSave, currentValue   }) => {
    

    const [isCKEditorOpen, setIsCKEditorOpen] = useState(false);
    const [explanationText, setExplanationText] = useState("");
    const [priorData, setPriorData] = useState("");

    const handleIssueResolvedClick = () => {
        setIsCKEditorOpen(true); 
      };

      const handleSaveClick = () => {
        
        const updatedFieldData = {
          fieldKey,
          baseKey,
          currentValue: explanationText, 
        };
        handleSave(updatedFieldData); 
        setIsCKEditorOpen(false); 
        
      };


      const handleCancelClick = () => {
        setIsCKEditorOpen(false); // Close CKEditor dialog
   
      };

    return (
        <Dialog
        isOpen={getIsOpen} onClose={() => getIsOpen(false)}
            className={`${style.dialog} ${style.dialogBackground}`}
            canOutsideClickClose={false}
            canEscapeKeyClose={false}
        >
            <div className={Classes.DIALOG_BODY}>
                <div className={style.spaceBetween}>
                    <div className={style.heading}> Response Confirmation</div>
                </div>
{!isCKEditorOpen ? (
    <>
                {/* Content */}
                <p className={style.description}>
                    On your prior Application, you had marked <strong>{currentValue}</strong> to this disclosure. Notes and comments provided by you and any associated documents are displayed below.
                </p>

                <div className={style.notesSection}>
                    <div className={style.noteHeading}>Notes and comments from prior application</div>
                    <p className={style.description}>
                    {priorData}
                    </p>
                </div>

                <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.saveInProgress}`} onClick={handleIssueResolvedClick}>ISSUE RESOLVED,NO LONGER APPLICABLE</div>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false) }}>COPY FOR THIS REAPPOINTMENT</div>
                    </div>

                    </>
        ) : (
          
          <>
            <div className={style.editorSection}>
              <div className={style.editorHeading}>Edit your response</div>
              <CKEditor
                editor={ClassicEditor}
                data={explanationText}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setExplanationText(data); // Update the CKEditor content
                }}
              />
            </div>

            <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
            <div
                className={`${style.continue} ${style.marginLeft}`}
                onClick={handleCancelClick} 
              >
                CANCEL
              </div>
              <div
                className={`${style.saveInProgress}`}
                onClick={handleSaveClick}
              >
                SAVE
              </div>
              
            </div>
          </>
        )}
                   
            </div>
           

        </Dialog>
    );
};

export default PriorDataDialog;