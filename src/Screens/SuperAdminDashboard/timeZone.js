import React, { useMemo, useState } from "react"
import spacetime from "spacetime"
import TimezoneSelect, { allTimezones, useTimezoneSelect } from "react-timezone-select"

const timezones = {
    ...allTimezones,
}

const Timezone = ({ selectedTimezone, setSelectedTimezone }) => {
    const [selectStyle, setSelectStyle] = useState("react-select")
    const [labelStyle, setLabelStyle] = useState("altName")
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectChange = event => {
        setSelectStyle(event.target.value)
    }
    const handleLabelChange = event => {
        setLabelStyle(event.target.value)
    }

    const [datetime, setDatetime] = useState(spacetime.now())

    useMemo(() => {
        const tzValue =
            typeof selectedTimezone === "string"
                ? selectedTimezone
                : selectedTimezone.value
        setDatetime(datetime.goto(tzValue))
    }, [selectedTimezone])

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

            {/* <div className="code"> */}
            {/* <div>
                    Current Date / Time in{" "}
                    {typeof selectedTimezone === "string"
                        ? selectedTimezone.split("/")[1]
                        : selectedTimezone.value.split("/")[1]}
                    : <pre>{datetime.unixFmt("dd.MM.YY HH:mm:ss")}</pre>
                </div> */}
            {/* <pre>{JSON.stringify(selectedTimezone, null, 2)}</pre> */}
            {/* </div> */}
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
