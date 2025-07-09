import React, { useState, useEffect, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommonInputField from '../../../Components/CommonFields/CommonInputField';
import CommonDateField from '../../../Components/CommonFields/CommonDateField';
import { TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import style from './index.module.scss';
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import { format } from 'date-fns';
import { GET, POST } from '../../dataSaver';
import { ErrorToaster2, SuccessToaster2 } from '../../../utils/toaster';
import CommonMultiSelectField from '../../../Components/CommonFields/CommonMultiSelectField';
import { area } from 'd3';

const MDManagerStep1 = ({ setStep1, setStep2, mdFile, getMD }) => {
    const [calendarStart, setCalendarStart] = useState(false);
    const [SelectedDate, setSelectedDate] = useState(null);
    const [keywordList, setKeywordList] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [mdId, setMdId] = useState('');
    const [mdTitle, setMdTitle] = useState('');
    const [mdFileName, setMdFileName] = useState('');
    const [mdDescription, setMdDescription] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [selectedServiceArea, setSelectedServiceArea] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [reviewFrequency, setReviewFrequency] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileType, setFileType] = useState('');
    useEffect(() => {
        getDepartmentList();
        getStaffList()
    }, [])

    useEffect(() => {
        if (mdFile) {
            setFileType(mdFile.type);
            const url = URL.createObjectURL(mdFile);
            setPreviewUrl(url);
        }
    }, [mdFile])

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const filteredServiceAreas = useMemo(() => {
        const areas = departmentList
            .filter(dept => selectedDepartment.includes(dept.id))
            .flatMap(dept => dept?.serviceAreas || []);
        console.log(areas, departmentList, selectedDepartment)
        // Optional: remove duplicates
        return [...new Set(areas)];
    }, [departmentList, selectedDepartment]);

    useEffect(() => {
        setSelectedServiceArea(prev =>
            prev.filter(area => filteredServiceAreas?.map(data => data?.id)?.includes(area))
        );
    }, [filteredServiceAreas]);

    const handleEnter = () => {
        console.log('Enter pressed! Value:', keyword);
        let temp = keywordList;
        if (!keywordList?.includes(keyword?.trim())) {
            temp.push(keyword);
            setKeywordList(temp);
            setKeyword('')
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleEnter();
        }
    };

    const transformedOptions = departmentList?.flatMap((department) => {
        const departmentEntry = {
            value: department?.id,
            label: department?.departmentName?.name,
            type: 'department'
        };

        const serviceAreaEntries = department.serviceAreas?.map((serviceArea) => ({
            value: `${department.id}|${serviceArea.id}`,
            label: (
                <span className={style.marginLeft}>
                    {serviceArea?.name}
                </span>
            ),
            type: 'serviceArea'
        })) || [];

        return [departmentEntry, ...serviceAreaEntries]; // Include department first, then service areas
    }) || [];

    const handleDepartmentSelect = (id) => {
        console.log(id)
        if (Array.isArray(id)) {
            const newIds = id.filter(item => !selectedDepartment.includes(item));
            if (newIds.length > 0) {
                setSelectedDepartment(prev => [...prev, ...newIds]);
            }
        }
    }

    const handleServiceAreaSelect = (id) => {
        console.log(id)
        if (Array.isArray(id)) {
            const newIds = id.filter(item => !selectedServiceArea.includes(item));
            if (newIds.length > 0) {
                setSelectedServiceArea(prev => [...prev, ...newIds]);
            }
        }
    }

    const handleChange = (e) => {
        const selectedValue = e.target.value;
        const [departmentId, serviceAreaId] = selectedValue.split("|");

        setSelectedDepartment(departmentId || "");
        setSelectedServiceArea(serviceAreaId || "");

        console.log("selectedDept", selectedValue)
    }

    const getDepartmentList = async () => {
        const { data: department } = await GET(
            `entity-service/department`
        );
        setDepartmentList(department);
    }

    const getStaffList = async () => {
        const response = await GET(
            `application-management-service/staff?status=ACTIVE&sortByField=STAFF_NAME&isPaginationRequired=${false}&limit=${9999}`
        );
        console.log(response.data);
        setStaffList(response?.data?.staffs)
    }

    const handleContinue = async () => {
        const formData = new FormData();

        let data = {
            title: mdTitle,
            description: mdDescription,
            mdID: mdId,
            departments: selectedDepartment?.map(deptData => (
                {
                    id: deptData,
                    name: departmentList?.filter(data => data?.id === deptData)?.[0]?.departmentName?.name,
                    serviceAreas: filteredServiceAreas?.filter(data => data?.department?.id === deptData)?.filter(area =>
                        selectedServiceArea?.includes(area?.id)
                    ),
                    excludedServiceAreas: [],
                    serviceAreasExcluded: false,
                    serviceAreaSpecific: selectedServiceArea?.length !== 0 ? true : false
                }
            )),
            // implementers: [],
            reviewFrequency: {
                value: reviewFrequency === "EVERY_1_YEAR" ? 1 : reviewFrequency === "EVERY_2_YEARS" ? 2 : reviewFrequency === "EVERY_3_YEARS" ? 3 : 0,
                unit: "YEARS"
            },
            author: {
                id: selectedStaff,
                name: staffList?.filter(data => data?.id === selectedStaff)?.[0]?.applicant?.name,
                email: staffList?.filter(data => data?.id === selectedStaff)?.[0]?.applicant?.email,
            },
            publishedDate: SelectedDate,
            // tags: keywordList,
            file: {
                fileName: mdFile?.name,
            },
            autoTriggerOnUpdate: false,
            updateFor: 'ALL_STAFFS',
            groups: [],
            triggerForNewAppointment: false,
            triggerForReAppointment: false,
            departmentSpecific: selectedDepartment !== '' ? true : false,
        }

        formData.append(
            "metaDataDTO",
            new Blob([JSON.stringify(data)], {
                type: "application/json",
            })
        );
        formData.append("file", mdFile);

        console.log(mdFile, data)

        await POST(`medical-directive-service/medicalDirectives`, formData)
            .then(response => {
                setStep1(false);
                setStep2(true);
                SuccessToaster2('MD Uploaded Successfully');
                console.log(response?.data)
                getMD(response?.data);
            })
            .catch(error => {
                ErrorToaster2('MD Upload Failed');
            })

    }
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
                        <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => {
                            handleContinue();
                        }} >CONTINUE</button>
                    </div>
                </div>
            </div>
            <div className={style.stepContentCard}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter}`}>
                    <div className={style.stepsTitleText}>Medical Directive Meta Data</div>
                </div>
                <div className={style.padding20}>
                    <div className={`${style.pdfThumbnailDisplay} ${style.margin20}`}>
                        {previewUrl && fileType === 'application/pdf' && (
                            <embed src={previewUrl} type="application/pdf" width="192" height="192" />
                        )}
                        {previewUrl && fileType.startsWith('image/') && (
                            <img src={previewUrl} alt="Preview" width={192} height={192} />
                        )}
                    </div>
                    <div className={`${style.pdfFileText} ${style.margin20}`}>{mdFile?.name}</div>
                    <div className={`${style.step1Grid} ${style.margin20}`}>
                        {/* <div>
                            <div className={style.labelStyle}>File Name</div>
                            <CommonInputField
                                value={mdFileName}
                                onChange={(e) => setMdFileName(e.target.value)}
                                type="text"
                                placeholder="Enter File Name"
                            />
                        </div> */}
                        <div>
                            <div className={style.labelStyle}>Medical Directive Title*</div>
                            <CommonInputField
                                value={mdTitle}
                                onChange={(e) => setMdTitle(e.target.value)}
                                type="text"
                                placeholder="Enter Title"
                            />
                        </div>
                        <div>
                            <div className={style.labelStyle}>Medical Directive ID *</div>
                            <CommonInputField
                                value={mdId}
                                onChange={(e) => setMdId(e.target.value)}
                                type="text"
                                placeholder="Enter MD ID"
                            />
                        </div>
                        <div>
                            <div className={style.labelStyle}>Medical Directive Description*</div>
                            <CKEditor
                                editor={ClassicEditor}
                                data={mdDescription}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setMdDescription(data);
                                }}
                                onReady={(editor) => {
                                    editor.editing.view.change((writer) => {
                                        writer.setStyle(
                                            "height",
                                            "50px",
                                            editor.editing.view.document.getRoot()
                                        );
                                    });
                                }}
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
                        {/* <div>
                            <CommonSelectField
                                value={selectedDepartment}
                                onChange={handleChange}
                                className={style.fullWidth}
                                // firstOptionLabel={'All'}
                                // firstOptionValue={''}
                                valueList={transformedOptions.map(option => option?.value)}
                                labelList={transformedOptions.map(option => option?.label)}
                                disabledList={transformedOptions.map(() => false)}
                                required={true}
                                label={'Department / Division or Speciality'}
                            />
                        </div> */}
                        <div>
                            <div className={style.labelStyle}>Department*</div>
                            <CommonMultiSelectField
                                value={selectedDepartment}
                                onChange={(e) => handleDepartmentSelect(e.target.value)}
                                className={style.fullWidth}
                                // firstOptionLabel={'All'}
                                // firstOptionValue={''}
                                valueList={departmentList?.map(option => option?.id)}
                                labelList={departmentList?.map(option => `${option?.departmentName?.name}`)}
                                disabledList={departmentList?.map(() => false)}
                                required={true}
                                label={'Department'}
                            />
                            <div>
                                <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                                    {selectedDepartment?.map(data => {
                                        return (
                                            <div className={`${style.chips} ${style.displayInRow}`}>
                                                <div>{departmentList?.filter(deptData => data === deptData?.id)?.[0]?.departmentName?.name}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer}`}
                                                    onClick={() => setSelectedDepartment(selectedDepartment?.filter(innerData => innerData !== data))}
                                                ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={style.labelStyle}>Division / Service Area</div>
                            <CommonMultiSelectField
                                value={selectedServiceArea}
                                onChange={(e) => handleServiceAreaSelect(e.target.value)}
                                className={style.fullWidth}
                                // firstOptionLabel={'All'}
                                // firstOptionValue={''}
                                valueList={filteredServiceAreas?.map(option => option?.id)}
                                labelList={filteredServiceAreas?.map(option => `${option?.name}`)}
                                disabledList={filteredServiceAreas?.map(() => false)}
                                required={true}
                                label={'Division / Service Area'}
                            />
                            <div>
                                <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                                    {selectedServiceArea?.map(data => {
                                        return (
                                            <div className={`${style.chips} ${style.displayInRow}`}>
                                                <div>{filteredServiceAreas?.filter(divisionData => data === divisionData?.id)?.[0]?.name}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer}`}
                                                    onClick={() => setSelectedServiceArea(selectedServiceArea?.filter(innerData => innerData !== data))}
                                                ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <CommonSelectField
                            value={reviewFrequency}
                            onChange={(e) => setReviewFrequency(e.target.value)}
                            className={style.fullWidth1}
                            //   firstOptionLabel={'Select Category'}
                            //   firstOptionValue={''}
                            valueList={["EVERY_1_YEAR", "EVERY_2_YEARS", "EVERY_3_YEARS"]}
                            labelList={["Every 1 Year", "Every 2 Years", "Every 3 Years"]}
                            disabledList={false}
                            required={true}
                            label={"Review Frequency"}
                        />
                        <div>
                            <CommonSelectField
                                value={selectedStaff}
                                onChange={(e) => setSelectedStaff(e.target.value)}
                                className={style.fullWidth}
                                // firstOptionLabel={'All'}
                                // firstOptionValue={''}
                                valueList={staffList?.map(option => option?.id)}
                                labelList={staffList?.map(option => `${option?.applicant?.name?.firstName} ${option?.applicant?.name?.lastName}`)}
                                disabledList={staffList?.map(() => false)}
                                required={false}
                                label={'Author / Owner Responsible'}
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
                            onChange={(newValue) =>
                                setSelectedDate(format(new Date(newValue), "yyyy-MM-dd'T'00:00"))
                            }
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
                        {/* <div>
                            <div className={style.labelStyle}>Keywords / Tags</div>
                            <CommonInputField
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                type="text"
                                placeholder="Enter Keywords / Tags"
                                onKeyDown={handleKeyDown}
                            />
                            <div>
                                <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                                    {keywordList?.map(data => {
                                        return (
                                            <div className={`${style.chips} ${style.displayInRow}`}>
                                                <div>{data}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer}`}
                                                    onClick={() => setKeywordList(keywordList?.filter(innerData => innerData !== data))}
                                                ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MDManagerStep1;