// CustomSelect.js
import React, { useState, useRef } from 'react';
import './CustomSelect.css'; // Подключите свой CSS файл

const CustomSelect = ({ options, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState('Select an option');
	const selectRef = useRef(null);

	const handleSelectClick = () => setIsOpen(!isOpen);

	const handleOptionClick = (option) => {
		setSelectedOption(option.label);
		onChange(option.value);
		setIsOpen(false);
	};

	const handleOutsideClick = (e) => {
		if (selectRef.current && !selectRef.current.contains(e.target)) {
			setIsOpen(false);
		}
	};

	React.useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	return (
		<div className="custom-select" ref={selectRef}>
			<div className="select-box" onClick={handleSelectClick}>
				<span className="selected-option">{selectedOption}</span>
				{isOpen && (
					<ul className="options">
						{options.map((option) => (
							<li
								key={option.value}
								onClick={() => handleOptionClick(option)}
							>
								{option.label}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default CustomSelect;