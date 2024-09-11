import React, { useEffect, useState, useRef } from 'react';
import { GET, PUT } from '../dataSaver';
import { KeyboardReturnRounded } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';


const Applicant = () => {
    const navigate = useNavigate()

    const [applicationForms, setApplicationForms] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getApplications();
    }, [])

    const getApplications = async () => {
        setLoading(true);
        const { data: applications } = await GET(
            `application-management-service/application`
        );
        setApplicationForms(applications)
        navigate(`applicationForm/`)
        setLoading(false);
    }

    KeyboardReturnRounded
}

export default Applicant