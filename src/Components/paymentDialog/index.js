import React, { useState, useEffect } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import ThirdPartyDialog from '../../Components/ThirdPartyDialog';

import { loadStripe } from '@stripe/stripe-js';
import style from './index.module.scss';
import { useParams } from 'react-router-dom';
import { GET } from '../../Screens/dataSaver';

const stripePromise = loadStripe('pk_test_51OPIp6SJfzua1uDJrMdrq3o5Sfq9wWdv7y3Ev62RkNJEHGrHdMRcrLrxzNMMXiQTCvi9eR3QuvzxqY1OTMPv9mnp003pgscIaj');


const PaymentDialog = ({ getIsOpen, continueClickFunc, paymentListData }) => {
    const [formIndex, setFormIndex] = useState();
    const [isContinue, setIsContinue] = useState(false);
    const [showThirdPartyDialog, setShowThirdPartyDialog] = useState(false);
    const { applicationId, section, step } = useParams()
    const [basicForm, setBasicForm] = useState({})

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
    }, [basicForm, step])

    useEffect(() => {
        getPreApplication()
    }, [applicationId])

    const getPreApplication = async () => {
        if (applicationId !== '') {
            const { data: basicForm } = await GET(
                `application-management-service/application/${applicationId}`
            );
            setBasicForm(basicForm)
        }
    }

    const getIsShowThirdPartyDialog = (value) => {
        setShowThirdPartyDialog(value);
    }

    const handleClick = async (event) => {
        // When the customer clicks on the button, redirect them to Checkout.
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{
                price: 'price_1QKXO1SJfzua1uDJrkF7cVWQ', // Replace with the ID of your price
                quantity: 1,
            }],
            mode: 'payment',
            // successUrl: `${window.location.origin}/app/reappointmentApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex + 1]?.formCategory}/${basicForm?.forms?.[formIndex + 1]?.schemaCategory}`,
            successUrl: `${window.location.origin}/app/reappointmentApplicationForm/${applicationId}/Form/${btoa(`UploadYourDoc`)}?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/app/reappointmentApplicationForm/${applicationId}/${section}/${btoa(step)}`,
        });
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
    };
    console.log(paymentListData)

    return (
        <>
            <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
                <div>
                    <div className={Classes.DIALOG_BODY}>
                        <div className={style.spaceBetween}>
                            <div className={style.heading}>Payment Required</div>
                            <div className={style.displayInRow}>
                                <img
                                    src={CrossPink}
                                    alt="cross"
                                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                    onClick={() => { getIsOpen(false) }}
                                />
                            </div>
                        </div>
                        <p className={`${style.description} ${style.marginTop}`}>{`For the Privilege category you have selected for your reappointment there is an application processing fee of ${paymentListData?.currencyType}${paymentListData?.fee}.`}</p>
                        <p className={`${style.description} ${style.marginTop}`}>Payment is required before you can complete the rest of your application.</p>
                        <div className={style.paymentGrid}>
                            <div className={`${style.description} ${style.marginTop}`}>Your Purchase</div>
                            <div className={`${style.description} ${style.marginTop}`}><strong>Reappointment Application Processing Fee</strong></div>
                        </div>
                        <div className={style.paymentGrid}>
                            <div className={`${style.description} ${style.marginTop10}`}>Amount</div>
                            <div className={`${style.description} ${style.marginTop10}`}><strong>{`${paymentListData?.currencyType}${paymentListData?.fee}`}</strong></div>
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CANCEL</div>
                            {/* <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); continueClickFunc(); }}>CONTINUE</div> */}
                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => {
                                getIsOpen(true); setShowThirdPartyDialog(true)
                                // handleClick()
                            }}>CONTINUE</div>
                        </div>
                    </div>

                </div>
            </Dialog >
            {showThirdPartyDialog && (
                <ThirdPartyDialog getIsOpen={getIsShowThirdPartyDialog} continueClick={continueClickFunc} paymentListData={paymentListData} />
            )}
        </>
    )
}

export default PaymentDialog;