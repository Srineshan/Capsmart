import React, { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz'
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { format } from 'date-fns';
import { TenantID, GET } from '../../Screens/dataSaver';
import { corsUrl, siteTimeZone, timeZoneAbbreviation } from '../../utils/formatting';

import style from './index.module.scss';

const PrintHeader = () => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const userDetail = jwt(userDetails);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const [logo, setLogo] = useState({ logo: sessionStorage?.getItem('logo'), title: sessionStorage.getItem('title') });
    const [corsedLogo, setCorsedLogo] = useState('');
    const [currentTime, setCurrentTime] = useState((siteTimeZone() !== "null" && siteTimeZone() !== "undefined" && siteTimeZone()) ? `${formatInTimeZone(new Date(), siteTimeZone(), 'MMM d yyyy, H:mm ')} ${timeZoneAbbreviation()}` : format(new Date(), 'MMM d yyyy, H:mm '));
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');

    useEffect(() => {
        getLogo();
    }, [])

    const getLogo = async () => {
        const { data: data } = await GET(`entity-service/entity/${TenantID}`);
        setLogo({ logo: data?.logo?.file?.fileURL, title: data?.entityName?.entityName });
        // setCorsedLogo(`https://app.timesmartai.com/cors/${data?.logo?.file?.fileURL}`);
        setCorsedLogo(`${corsUrl}${data?.logo?.file?.fileURL}`);
        // setCorsedLogo(`${data?.logo?.file?.fileURL}`);
        setAddressLine1(`${data?.sites?.[0]?.address?.addressLine},`)
        setAddressLine2(`${data?.sites?.[0]?.address?.city}, ${data?.sites?.[0]?.address?.state} ${data?.sites?.[0]?.address?.zipcode}`)
    }

    return (
        <div className={`${style.headerBackground} ${style.onlyPrint}`}>
            <div className={` ${style.alignCenter}`}>
                <div className={`${style.centerAlignUsingBlock} ${style.textAlignCenter}`}>
                    <div className={`${style.centerAlignUsingBlock}`}>
                        {logo.logo && (
                            <img src={corsedLogo || logo?.logo} alt="" className={`${style.headerLogoReport} ${style.textAlignCenter}`} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintHeader;
