import React, { Fragment, useEffect, useState } from "react";
import style from './index.module.scss';

const Titlebar = () => {

    const [titleMenuData, setTitleMenuData] = useState([]);
    const getTitleMenuData = () => {
        fetch("http://localhost:1234/Titlebar")
            .then(response => response.json())
            .then(data => {
                setTitleMenuData(data)
                console.log(data)
            })

    }

    useEffect(() => {
        getTitleMenuData()
    }, [])
    return (
        <Fragment>
            <div className={style.displayInCol}>
                {
                    titleMenuData.map((data, index) => {
                        console.log(data)
                        return (
                            <div className={`${style.industriesCardStyle} ${style.selectedIndustriesBackground}`}>
                                <div className={style.spaceBetween} key={index}>
                                    <p className={style.industriesCardTextStyle1}> {data.name} </p>
                                    <p className={style.industriesCardTextStyle1}>{data.SkillSet.length}</p>
                                    {/* {
                                        data.SkillSet.map((data1,index1) => {
                                            console.log(data1)
                                            return (
                                                <p className={style.industriesCardTextStyle1} key={index1}>{data.SkillSet.length}</p>
                                            )
                                        })
                                    } */}
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </Fragment>
    )
}

export default Titlebar;