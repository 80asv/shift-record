import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import './ThemeToggle.scss';
import { ThemeContext } from '../../App';

const ThemeToggle = ({ isTheme }) => {

    
    const { toggleTheme } = useContext(ThemeContext);
    const [isOn, setIsOn] = useState(false);
    
    const toggleSwitch = () => {
        setIsOn(!isOn);
        isTheme && toggleTheme();
    };

    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30
    };

    return (
        <div className="switch" data-ison={isOn} onClick={toggleSwitch}>
            <motion.div className="handle" layout transition={spring} />
        </div>
    );
}

export default ThemeToggle