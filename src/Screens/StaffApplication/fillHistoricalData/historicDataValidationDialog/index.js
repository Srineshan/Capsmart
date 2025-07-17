import React from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import style from "./index.module.scss";

const HistoricValidationDialog = ({ getIsOpen, labelList = [] }) => {
    const groupedErrors = {
        "Personal Information": labelList.filter((item) =>
            ["firstName", "lastName", "email", "dob"].includes(item.key)
        ),
        "Home Address": labelList.filter((item) =>
            ["homeAddress", "homeZipcode", "homeCity", "homeProvince", "contactNo", "preferredPhone"].includes(item.key)
        ),
        "Office Address": labelList.filter((item) =>
            ["officeAddress", "zipCode", "city", "province"].includes(item.key)
        ),
        "Privilege Category": labelList.filter((item) =>
            ["applicantType", "privilege", "department","dateOfStart","dateOfEnd"].includes(item.key)
        )
    };

    return (
        <Dialog
            isOpen={getIsOpen}
            onClose={() => getIsOpen(false)}
            className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
            canOutsideClickClose={false}
            canEscapeKeyClose={false}
        >
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Mandatory Fields Alert!</div>
                    </div>

                    <p className={`${style.description} ${style.marginTop}`}>
                        The following fields are mandatory:
                    </p>

                    {/* ✅ Render grouped errors */}
                    {Object.entries(groupedErrors).map(([heading, errors]) =>
                        errors.length > 0 ? (
                            <div key={heading}>
                                <p className={style.sectionHeading}>{heading}:</p>
                                {errors.map((data, index) => (
                                    <p key={index} className={`${style.description} ${style.marginTop10} ${style.marginLeft}`}>
                                        {index+1}. {data.label}
                                    </p>
                                ))}
                            </div>
                        ) : null
                    )}

                    <div className={`${style.justifyCenter} ${style.marginTop}`}>
                        <button className={style.saveInProgress} onClick={() => getIsOpen(false)}>Back To Form</button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default HistoricValidationDialog;
