import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonDateField from '../../Components/CommonFields/CommonDateField';
import { TextField } from '@mui/material';
import style from './index.module.scss';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

const MDManagerStep1 = ({ setStep1, setStep2 }) => {
    const [calendarStart, setCalendarStart] = useState(false);
    const [SelectedDate, setSelectedDate] = useState(null);
    return (
        <div className={style.stepsBackground}>
            <div className={`${style.stepHeader} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.stepNumber} ${style.marginLeft10}`}>Step 1</div>
                    <div className={`${style.stepHeading} ${style.marginLeft20}`}>Review & Verify Required Meta Data</div>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.spaceBetween}`}>
                        <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { setStep1(false) }} >SAVE IN PROGRESS</button>
                        <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep1(false); setStep2(true) }} >CONTINUE</button>
                    </div>
                </div>
            </div>
            <div className={style.stepContentCard}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter}`}>
                    <div className={style.stepsTitleText}>Medical Directive Meta Data</div>
                </div>
                <div className={style.padding20}>
                    <div className={`${style.pdfThumbnailDisplay} ${style.margin20}`}>

                    </div>
                    <div className={`${style.pdfFileText} ${style.margin20}`}>Perflutren (Definity®) for Contrast Echocardiography</div>
                    <div className={`${style.step1Grid} ${style.margin20}`}>
                        <div>
                            <div className={style.labelStyle}>Medical Directive Title*</div>
                            <CKEditor
                                editor={ClassicEditor}
                                data={''}
                                // onChange={(event, editor) => {
                                //   const data = editor.getData();
                                //   setNotes(data);
                                // }}
                                onReady={(editor) => {
                                    editor.editing.view.change((writer) => {
                                        writer.setStyle(
                                            "height",
                                            "50px",
                                            editor.editing.view.document.getRoot()
                                        );
                                    });
                                }}
                                disabled
                                config={{
                                    placeholder: "Type your content here...",
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
                        <div>
                            <div className={style.labelStyle}>Medical Directive ID *</div>
                            <CommonInputField
                                value={""}
                                //   onChange={(e) => {
                                //     const newDocumentDesc = [...documentDesc];
                                //     newDocumentDesc[index] = e.target.value;
                                //     setDocumentDesc(newDocumentDesc);
                                //   }}
                                type="text"
                                placeholder="Enter MD ID"
                            />
                        </div>
                        <div>
                            <div className={style.labelStyle}>Department / Division or Speciality*</div>
                            <CommonInputField
                                value={""}
                                //   onChange={(e) => {
                                //     const newDocumentDesc = [...documentDesc];
                                //     newDocumentDesc[index] = e.target.value;
                                //     setDocumentDesc(newDocumentDesc);
                                //   }}
                                type="text"
                                placeholder="Enter Department / Division or Speciality"
                            />
                        </div>
                        <CommonSelectField
                            //   value={selectedCategory}
                            //   onChange={(e) => setSelectedCategory(e.target.value)}
                            className={style.fullWidth1}
                            //   firstOptionLabel={'Select Category'}
                            //   firstOptionValue={''}
                            valueList={["Emergency Department Registered Users", "Every 2 Year", "Every 3 Year"]}
                            labelList={["Emergency Department Registered Users", "Every 2 Year", "Every 3 Year"]}
                            disabledList={false}
                            required={true}
                            label={"Authorized Implementers / Responsible Disciplines"}
                        />
                        <CommonSelectField
                            //   value={selectedCategory}
                            //   onChange={(e) => setSelectedCategory(e.target.value)}
                            className={style.fullWidth1}
                            //   firstOptionLabel={'Select Category'}
                            //   firstOptionValue={''}
                            valueList={["Every 1 Year", "Every 2 Year", "Every 3 Year"]}
                            labelList={["Every 1 Year", "Every 2 Year", "Every 3 Year"]}
                            disabledList={false}
                            required={true}
                            label={"Review Frequency"}
                        />
                        <div>
                            <div className={style.labelStyle}>Author / Owner Responsible</div>
                            <CommonInputField
                                value={""}
                                //   onChange={(e) => {
                                //     const newDocumentDesc = [...documentDesc];
                                //     newDocumentDesc[index] = e.target.value;
                                //     setDocumentDesc(newDocumentDesc);
                                //   }}
                                type="text"
                                placeholder="Enter Author / Owner Responsible"
                            />
                        </div>
                        <CommonDateField
                            className={style.fullWidth}
                            open={calendarStart}
                            onOpen={() => setCalendarStart(true)}
                            onClose={() => setCalendarStart(false)}
                            // minDate={sub(new Date(), { years: 3 })}
                            // maxDate={add(new Date(), { months: 6 })}
                            value={SelectedDate}
                            // onChange={(newValue) =>
                            //     handleChange(
                            //         fieldKey,
                            //         fieldData.format === "date-time"
                            //             ? format(new Date(newValue), "yyyy-MM-dd'T'HH:mm:ss'Z'")
                            //             : format(new Date(newValue), "yyyy-MM-dd'T'00:00"),
                            //         baseKey
                            //     )
                            // }
                            // minDate={minDate}
                            // maxDate={maxDate}
                            InputProps={{
                                style: {
                                    fontSize: 14,
                                    height: 30,
                                },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    inputProps={{
                                        ...params.inputProps,
                                        placeholder: 'System Date',
                                        readOnly: true
                                    }}
                                    fullWidth
                                />
                            )}
                            label={'First Published / Established Date'}
                        />
                        <div>
                            <div className={style.labelStyle}>Keywords / Tags</div>
                            <CommonInputField
                                value={""}
                                //   onChange={(e) => {
                                //     const newDocumentDesc = [...documentDesc];
                                //     newDocumentDesc[index] = e.target.value;
                                //     setDocumentDesc(newDocumentDesc);
                                //   }}
                                type="text"
                                placeholder="Enter Keywords / Tags"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MDManagerStep1;