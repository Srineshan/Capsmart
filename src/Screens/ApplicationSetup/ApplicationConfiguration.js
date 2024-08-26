import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import Navbar from "../../Components/Navbar";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./card.module.scss";

const ApplicationConfiguration = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      title: "Start with setting up your Reference Lists",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      completed: "0 of 16",
      status: "Yet to Start",
    },
    {
      step: 2,
      title: "Set up new applicant credentialing and privileging Application",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      completed: "0 of 16",
      status: "Yet to Start",
    },
    {
      step: 3,
      title: "Set up new application processing work flows",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      completed: "0 of 16",
      status: "Yet to Start",
    },
    {
      step: 4,
      title: "Set up of Re-Appointment Applications",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      completed: "0 of 16",
      status: "Yet to Start",
    },
    {
      step: 5,
      title: "Set up of Re-Appointment Applications processing work flows",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      completed: "0 of 16",
      status: "Yet to Start",
    },
  ];

  const handleCardClick = (step) => {
    if (step === 1) {
      navigate("/referenceList");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.topContent}>
        <h2 className={styles.textAlignCenterMargin0}>
          GET STARTED WITH CREDENTIALING AND PRIVILEGING
        </h2>
        <CancelIcon className={styles.cancelIcon} />
      </div>
      <div className={styles.referenceListContainer}>
        <h2 className={styles.applicationConfiguration}>
          Application Configuration
        </h2>
        {steps.map((stepData, index) => (
          <Card
            key={index}
            step={stepData.step}
            title={stepData.title}
            description={stepData.description}
            completed={stepData.completed}
            status={stepData.status}
            onClick={() => handleCardClick(stepData.step)}
          />
        ))}
      </div>
    </>
  );
};

export default ApplicationConfiguration;
