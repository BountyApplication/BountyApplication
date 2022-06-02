import { useState, useEffect } from "react";

export function toCurrency(number) {
    if(isNaN(number)) return;
    if(number == null) return;
    return `${number.toFixed(2)}€`;
}

export function useKeyPress(targetKey) {
    const [keyPressed, setKeyPressed] = useState(false);

    function getHandler(isPressed) {
        return ({key}) => {
            if(key !== targetKey) return;
            setKeyPressed(isPressed);
            console.log("test");
        }
    }

    const downHandler = getHandler(true);
    const upHandler = getHandler(false);

    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
    
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      }
    }, [keyPressed]);
    
    return keyPressed;
    
}