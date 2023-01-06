import { useState, useEffect } from "react";

export const useResize = () => {

    const [width, setWidth] = useState();
    const [height, setHeight] = useState();

    useEffect(() => {
        setWidth(window.innerWidth)
        window.addEventListener("resize", handleResize);
    
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    return { height, width }
}