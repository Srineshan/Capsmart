import React, { useState } from "react"
import TimezoneSelect, { allTimezones, useTimezoneSelect } from "react-timezone-select"

const timezones = {
    ...allTimezones,
}

const Timezone = ({ selectedTimezone, setSelectedTimezone }) => {
    const [selectStyle, setSelectStyle] = useState("react-select")
    const [labelStyle, setLabelStyle] = useState("altName")

    const handleSelectChange = event => {
        setSelectStyle(event.target.value)
    }
    const handleLabelChange = event => {
        setLabelStyle(event.target.value)
    }

    const selectOptions = {
        timezones,
        labelStyle
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
