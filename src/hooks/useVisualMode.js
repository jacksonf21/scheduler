import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    //console.log(newMode);
    setMode(newMode);

    if (replace) {
      // console.log([...history].slice(0, history.length - 1).concat(newMode));
      setHistory(history => [...history].slice(0, history.length - 1).concat(newMode));
    } else {
      setHistory(history => [...history, newMode]);
      console.log(history);
    }
  }; 

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(history => [...history].slice(0, history.length - 1));
    }
  };

  return { mode, transition, back };
}