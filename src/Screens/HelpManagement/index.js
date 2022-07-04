import React, { Fragment, useState } from 'react';
import Navbar from './../../Components/Navbar';
import Tickets from './tickets';
import Tutorials from './tutorials';
import './../../index.scss';

const HelpHome = () => {
    const [selectedHelp, setSelectedHelp] = useState('Tickets');

    const getSelectedHelp = (value) => {
        setSelectedHelp(value);
    }

return(
        <Fragment> 
            <Navbar />
            {selectedHelp === "Tickets" ? (
                <Tickets 
                    getSelectedHelp={getSelectedHelp} 
                /> 
            ) : selectedHelp === "TUTORIALS & VIDEOS" ? (
                <Tutorials
                    getSelectedHelp={getSelectedHelp} 
                />
            ) : ''}
        </Fragment>
    )
}

export default HelpHome;