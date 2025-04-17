import React, { useEffect, useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import PdfDoc from '../../images/pdfDoc.png';

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import style from './index.module.scss';
import { useParams } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const PriorDataDialog = ({ getIsOpen, fieldKey, baseKey, handleSave, currentValue, basicForm, setBasicForm, disclosureBaseKey, disclosureFieldKey, disclosurSchema }) => {

  const { applicationId, section, step } = useParams();
  const [isCKEditorOpen, setIsCKEditorOpen] = useState(false);
  const [explanationText, setExplanationText] = useState("");
  const [priorData, setPriorData] = useState("");
  const [formIndex, setFormIndex] = useState(-1);

  useEffect(() => {
    if (basicForm !== undefined) {
      setPriorData(basicForm?.forms?.filter(data => data?.schemaCategory === atob(step))?.[0]?.priorData)
      setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }
  }, [basicForm])

  console.log(priorData?.disclosures, disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required, priorData?.disclosures?.[disclosureBaseKey]?.[disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required[0]])

  const handleIssueResolvedClick = () => {
    setIsCKEditorOpen(true);
  };

  const handleSaveClick = () => {
    setBasicForm((prevData) => {
      let tempBasicForm = { ...prevData };
      console.log(tempBasicForm.forms[formIndex].data, disclosureBaseKey)
      if (tempBasicForm.forms[formIndex].data === null) {
        tempBasicForm.forms[formIndex].data = {}
        tempBasicForm.forms[formIndex].data.disclosures = {}
      }
      if (tempBasicForm.forms[formIndex].data.disclosures[disclosureBaseKey] === undefined) {
        tempBasicForm.forms[formIndex].data.disclosures[disclosureBaseKey] = {}
      }
      tempBasicForm.forms[formIndex].data.disclosures[disclosureBaseKey][disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required[2]] = explanationText;
      return tempBasicForm;
    });
    getIsOpen(false);
  };


  const handleCancelClick = () => {
    setIsCKEditorOpen(false); // Close CKEditor dialog

  };

  const handleCopy = () => {
    setBasicForm((prevData) => {
      let tempBasicForm = { ...prevData };
      if (tempBasicForm.forms[formIndex].data === null) {
        tempBasicForm.forms[formIndex].data = {}
        tempBasicForm.forms[formIndex].data.disclosures = {}
      }
      if (tempBasicForm.forms[formIndex].data.disclosures[disclosureBaseKey] === undefined) {
        tempBasicForm.forms[formIndex].data.disclosures[disclosureBaseKey] = {}
      }
      if (priorData?.disclosures?.[disclosureBaseKey]?.[disclosureFieldKey] !== undefined) {
        tempBasicForm.forms[formIndex].data.disclosures[disclosureBaseKey][disclosureFieldKey] = priorData?.disclosures?.[disclosureBaseKey]?.[disclosureFieldKey];
      }
      if (priorData?.disclosures?.[disclosureBaseKey]?.[disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required[0]] !== undefined) {
        tempBasicForm.forms[formIndex].data.disclosures[disclosureBaseKey][disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required[0]] = priorData?.disclosures?.[disclosureBaseKey]?.[disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required[0]];
      }
      if (priorData?.disclosures?.[disclosureBaseKey]?.[disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required[1]] !== undefined) {
        tempBasicForm.forms[formIndex].data.disclosures[disclosureBaseKey][disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required[1]] = priorData?.disclosures?.[disclosureBaseKey]?.[disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required[1]];
      }
      return tempBasicForm;
    });
    getIsOpen(false)
  }

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
              On your prior Application, you had marked <strong>{priorData?.disclosures?.[disclosureBaseKey]?.[disclosureFieldKey]}</strong> to this disclosure. Notes and comments provided by you and any associated documents are displayed below.
            </p>

            <div className={style.notesSection}>
              <div className={style.noteHeading}>Notes and comments from prior application</div>
              <div className={style.description}
                dangerouslySetInnerHTML={{ __html: priorData?.disclosures?.[disclosureBaseKey]?.[disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required?.[0]] }}
              />
              {priorData?.disclosures?.[disclosureBaseKey]?.[disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required?.[1]] !== undefined && priorData?.disclosures?.[disclosureBaseKey]?.[disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required?.[1]] !== null && (
                <div className={style.marginTop}>
                  <div className={`${style.displayInRow} ${style.docCard}`}>
                    <div className={style.verticalAlignCenter}>
                      <img src={PdfDoc} alt="" className={style.docTypeImgStyle} />
                    </div>
                    <div className={`${style.description} ${style.marginLeft}`}>{priorData?.disclosures?.[disclosureBaseKey]?.[disclosurSchema?.allOf?.filter(data => disclosureFieldKey in data?.if?.properties)[0]?.then?.required?.[1]]?.fileName}</div>
                  </div>
                </div>
              )}
            </div>

            <div className={`${style.twoCol} ${style.marginTop}`}>
            <Tooltip title="Click to mark issue as resolved" arrow>
              <div className={`${style.saveInProgress} ${style.verticalAlignCenter} ${style.justifyCenter}`} onClick={handleIssueResolvedClick}>ISSUE RESOLVED, NO LONGER APPLICABLE</div></Tooltip>
              <Tooltip title="Click to copy for this reappointment" arrow>
              <div className={`${style.continue} ${style.verticalAlignCenter} ${style.justifyCenter}`} onClick={() => handleCopy()}>COPY FOR THIS REAPPOINTMENT</div></Tooltip>
            </div>

          </>
        ) : (

          <>
            <div className={`${style.editorSection} ${style.marginTop}`}>
              <div className={style.editorHeading}>Explain how this issue is no longer applicable</div>
              <div className={style.marginTop10}>
                <CKEditor
                  editor={ClassicEditor}
                  data={explanationText}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setExplanationText(data); // Update the CKEditor content
                  }}
                  config={{
                    placeholder: "Enter Prior Data",
                    toolbar: {
                      shouldNotGroupWhenFull: true,
                      sticky: true,
                      items: [
                        'undo', 'redo',
                        '|',
                        'heading',
                        '|',
                        'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                        '|',
                        'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                        '|',
                        'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                    ],
                    },
                    autoGrow: false,
                  }}
                />
              </div>
            </div>

            <div className={`${style.spaceBetween} ${style.displayInRow} ${style.marginTop}`}>
              <Tooltip title={"Click to Cancel"} arrow>
              <div
                className={`${style.continue} ${style.verticalAlignCenter} ${style.justifyCenter}`}
                onClick={handleCancelClick}
              >
                CANCEL
              </div>
              </Tooltip>
              <Tooltip title={"Click to Save"} arrow>
              <div
                className={`${style.saveInProgress} ${style.verticalAlignCenter} ${style.justifyCenter}`}
                onClick={handleSaveClick}
              >
                SAVE
              </div>
              </Tooltip>
            </div>
          </>
        )}

      </div>


    </Dialog>
  );
};

export default PriorDataDialog;