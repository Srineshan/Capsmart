import React from 'react';
import { Icon, Intent } from '@blueprintjs/core';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { POST } from './../dataSaver';
import SetupCompleteImg from './../../images/setupCompleteImg.png';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import style from './index.module.scss';

const SetupComplete = ({ data, setCompleteValue, operation, isSuperAdminAccess }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const activateEntity = async () => {
        await POST(`entity-service/entity/${id}/notify`, JSON.stringify({}))
            .then(response => {
                SuccessToaster('Entity Activated');
            })
            .catch(error => {
                ErrorToaster('Unexpected Error Occured');
            })
    }

    return (
        <div className={style.welcomeBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} onClick={() => setCompleteValue(false)} />
            <div className={style.completedContentMargin}>

                <div className={style.completedHeading}>
                    {data} Setup {operation} Successfully
                </div>
                <div className={style.alignCenter}>
                    <img src={SetupCompleteImg} alt="Welcome Img" className={style.setupCompleteImgStyle} />
                </div>
                <div className={style.thanksTextStyle}>Thankyou, Mr. Doel Joe</div>

                <div className={`${style.welcomeDescription} ${style.marginTop30}`}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique,
                    lacus eget pulvinar aliquet, nibh turpis ultricies eros, nec scelerisque
                    ligula leo pharetra dui. Maecenas facilisis auctor sem, id eleifend mi
                    tristique vel. In vitae mattis magna. Donec faucibus lorem ac ligula elementum,
                    sit amet bibendum nisi viverra. Donec pharetra sodales nisl, sed tincidunt turpis
                    pulvinar et. Quisque sapien tortor, facilisis et efficitur in, ullamcorper non dolor.
                    Pellentesque odio magna, euismod eleifend massa nec, tincidunt consequat metus.
                    Phasellus luctus et metus nec dictum. Vivamus feugiat varius ex, dignissim gravida
                    dui accumsan sed. Proin a lorem a augue consectetur varius sit amet non sapien.
                    Nullam auctor lacus sit amet lectus efficitur bibendum.
                </div>
                <div className={`${style.welcomeDescription} ${style.marginTop20}`}>
                    Nullam mollis, urna vel pharetra tempor, sem quam condimentum tellus, consequat
                    vehicula purus urna ut turpis. Pellentesque sit amet vehicula sapien. Sed in interdum
                    quam, vitae dapibus massa. Sed condimentum pellentesque purus, pellentesque pharetra
                    nunc varius feugiat. Proin ornare tempus augue nec molestie. Nunc eu est dapibus, luctus
                    tortor sed, elementum quam. Duis convallis odio eu enim maximus ultricies in a massa.
                    Curabitur consectetur urna quam, ut tincidunt augue porttitor et. Praesent molestie
                    imperdiet augue quis facilisis. Fusce nulla eros, tempus in diam ac, porta tristique diam.
                </div>
                <div className={`${style.welcomeDescription} ${style.marginTop20}`}>
                    Praesent tristique purus mollis leo blandit, sed gravida nisi congue. Vivamus
                    suscipit lacinia tempus. Nam vitae luctus tortor, ac tempus magna. Aliquam erat
                    volutpat. In et vestibulum leo, sodales lobortis tortor. Nulla quis neque neque.
                    Aliquam erat volutpat.
                </div>
                <div className={style.marginTop50}>
                    <button className={`${style.setupCompleteButton} ${style.cursor}`} onClick={() => setCompleteValue(false)}>CANCEL</button>
                    <button className={`${style.setupCompleteButton} ${style.marginLeft20} ${style.cursor}`}
                        onClick={() => {
                            navigate('/user');
                        }}>DONE & EXIT SETUP</button>
                    {isSuperAdminAccess && (
                        <button className={`${style.setupCompleteButton} ${style.marginLeft20} ${style.cursor}`}
                            onClick={() => {
                                activateEntity();
                            }}>ACTIVATE ENTITY</button>
                    )}
                </div>
            </div>

        </div>
    )
}

export default SetupComplete;
