import React from "react";
import "components/DayListItem.scss"
import classnames from "classnames";

export default function DayListItem(props) {
  const dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  });
  
  const formatSpots = (num) => {
    if (num > 1) return `${num} spots remaining`;
    else if (num === 1) return `${num} spot remaining`; 
    return `no spots remaining`;
  };

  return (
    <li key={props.id} onClick={() => props.setDay(props.name)} className={dayClass} data-testid="day">
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>    
  );
  
}