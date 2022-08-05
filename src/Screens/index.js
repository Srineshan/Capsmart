import React from 'react';
import {Link} from 'react-router-dom';
import style from './index.module.scss';


const EntryPage = () => {
    return(
        <div className={`${style.backgroundColor} ${style.alignCenter}`}>
            <div className={style.spaceBetween}>
                <Link to={'/tasks'}>
                    <div className={`${style.padding} ${style.cursorPointer}`}>
                        <div className={style.roundedBackgrounds}>
                        </div>
                        <div className={style.headingStyle}>Reports</div>
                    </div>
                </Link>
                <Link to={'/help'}>
                    <div className={`${style.padding} ${style.cursorPointer}`}>
                        <div className={style.roundedBackgrounds}>
                        </div>
                        <div className={style.headingStyle}>Help Management</div>
                    </div>
                </Link>
                <Link to={'/activeContracts'}>
                    <div className={`${style.padding} ${style.cursorPointer}`}>
                        <div className={style.roundedBackgrounds}>
                        </div>
                        <div className={style.headingStyle}>Contract Dashboard</div>
                    </div>
                </Link>
                <Link to={'/contracts'}>
                    <div className={`${style.padding} ${style.cursorPointer}`}>
                        <div className={style.roundedBackgrounds}>
                        </div>
                        <div className={style.headingStyle}>User Management</div>
                    </div>
                </Link>
                <Link to={'/login'}>
                    <div className={style.cursorPointer}>
                        <div className={style.roundedBackgrounds}>
                        </div>
                        <div className={style.headingStyle}>Super Admin Dashboard</div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default EntryPage;
