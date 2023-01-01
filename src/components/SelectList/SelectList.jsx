import React, { useEffect, useState } from 'react'

const SelectList = ({ title, handleChange, data, id }) => {

    const [dataOptions, setDataOptions] = useState(data);

    useEffect(() => {
        setDataOptions(data);
    }, [data]);
    
    return (
		<div>
			<select onChange={handleChange}>
				<option value="" defaultChecked> filtrar por {title} </option>
                { dataOptions && dataOptions.map((option, index) => <option key={index}>{option}</option>) }
			</select>
		</div>
	)
}

export default SelectList