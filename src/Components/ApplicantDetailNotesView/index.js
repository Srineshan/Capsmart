import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, POST, PUT } from "../../Screens/dataSaver";
import { Dialog } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import style from "./index.module.scss";
import { Tooltip } from "@mui/material";

const ApplicantNotesViewDialog = ({ getIsOpen }) => {
  const id = sessionStorage.getItem("applicationId");
  const applicationType = sessionStorage.getItem('applicationCreationType') ?? 'REAPPOINTMENT';
  const notesData = [
    {
      title: "Staff Manager Review",
      author: "Nina G.",
      role: "Staff Manager",
      date: "08:00",
      content:
        "The Staff Manager has reviewed the initial application documents and verified completeness. The applicant's qualifications and employment history appear satisfactory. Awaiting department head evaluation."
    },
    {
      title: "Department Head Evaluation",
      author: "Nina G.",
      role: "Department Head",
      date: "08:00",
      content:
        "The Department Head has conducted an initial assessment of the applicant’s clinical experience and fit within the surgical team. Recommendation forwarded for credentialing review."
    },
    {
      title: " Credentialing Committee Assessment",
      author: "Nina G.",
      role: "Credentialing Committee",
      date: "08:00",
      content:
        "Credentialing Committee has verified licenses, board certifications, malpractice history, and references. No red flags identified. Credentials meet institutional standards."
    },
    {
      title: "Advisory Committee Feedback",
      author: "username",
      role: "Advisory Committee",
      date: "10:00",
      content:
        "Advisory Committee has reviewed the case and provided a positive recommendation based on clinical expertise, departmental needs, and peer feedback.",
      attachment: "Document File Name"
    },
    {
      title: "Board Final Decision",
      author: "Nina G.",
      role: "Board",
      date: "08:00",
      content:
        "The Board has approved the application based on comprehensive evaluations from all prior levels. Formal offer and onboarding process can proceed."
    }
  ];

  return (
    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        <div>
          <div className={style.spaceBetween}>
            <div className={style.heading}>
              Notes
            </div>
            <Tooltip title="Click to Close" arrow>
            <img
              src={CrossPink}
              alt="cross"
              className={`${style.crossStyle} ${style.cursorPointer}`}
              onClick={() => {getIsOpen(false)}}
            />
            </Tooltip>
          </div>
          {notesData.map((note, index) => (
            <div key={index} className={style.marginTop10}>
            <div className={style.notesTitle}>{note?.title}</div>
            <div className={`${style.notesUsertext} ${style.marginTop10}`}>
                ({note?.author}
                {note?.role ? `, ${note?.role}` : ""} on dd/mm/yyyy, {note?.date})
            </div>
            <div className={`${style.notesDataTextStyle}  ${style.marginTop10}`}>{note?.content}</div>
            </div>
        ))}
        </div>
      </div>
    </Dialog>
  );
};

export default ApplicantNotesViewDialog;