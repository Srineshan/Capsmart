import React, { useState } from "react"
import TimezoneSelect, { allTimezones, useTimezoneSelect } from "react-timezone-select"
import cityTimezones from 'city-timezones';

const Timezone = ({ selectedTimezone, setSelectedTimezone, cityName }) => {
    const [selectStyle, setSelectStyle] = useState("react-select")
    const [labelStyle, setLabelStyle] = useState("altName")

    const cityLookup = cityTimezones.findFromCityStateProvince(cityName)

    const allowedKey = cityLookup?.[0]?.timezone;

    const filteredData = Object.keys(allTimezones)
        .filter(key => key === allowedKey)
        .reduce((obj, key) => {
            obj[key] = allTimezones[key];
            return obj;
        }, {});

    const timezones = cityName !== "" ? { ...filteredData } : { ...allTimezones }

    const selectOptions = {
        timezones,
        labelStyle,
    }

    return (
        <div className="wrapper">
            <div className="select-wrapper">
                {selectStyle === "react-select" ? (
                    <TimezoneSelect
                        value={selectedTimezone}
                        onChange={setSelectedTimezone}
                        menuPlacement="auto"
                        maxMenuHeight={250}
                        menuPosition="fixed"
                        {...selectOptions}
                    />
                ) : (
                    <NativeSelectTimezone
                        value={selectedTimezone}
                        selectOptions={selectOptions}
                        onChange={setSelectedTimezone}
                    />
                )}
            </div>
        </div>
    )
}

const NativeSelectTimezone = ({ selectOptions, value, onChange }) => {
    const { options, parseTimezone } = useTimezoneSelect(selectOptions)
    return (
        <select
            value={parseTimezone(value).value}
            onChange={e => onChange(parseTimezone(e.currentTarget.value))}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

export default Timezone
