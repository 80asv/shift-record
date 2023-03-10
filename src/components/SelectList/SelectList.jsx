import React, { useEffect, useState } from "react";
import "./SelectList.scss";

const SelectList = ({ title, handleChange, data, isFiltered, value }) => {
	const [dataOptions, setDataOptions] = useState(data);

	useEffect(() => {
		setDataOptions(data);
	}, [data]);

	return (
		<select
			onChange={handleChange}
			className={`selectlist ${value ? "active" : ""}`}
            value={value}
		>
			<option value="" defaultChecked className="seleclist__op">
				{title}
			</option>
			{dataOptions &&
				dataOptions.map((option, index) => (
					<option className="seleclist__op" key={index}>
						{option}
					</option>
				))}
		</select>
	);
};

export default SelectList;
