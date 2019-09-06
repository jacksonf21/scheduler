import { useEffect, useReducer } from "react";
import Axios from "axios";

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointment: {},
    interviewers: {}
  });

  function reducer(state, action) {

    const newDays = () => {
      if (action.value.spots === "dec") {
        return state.days.map(day => {
          if (day.name !== state.day) {
            return day;
          } else {
            return {
              ...day, spots: day.spots - 1
            }
          }
        });
      } else {
        return state.days.map(day => {
          if (day.name !== state.day) {
            return day;
          } else {
            return {
              ...day, spots: day.spots + 1
            }
          }
        });
      } 
    }

    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.value}
      case SET_APPLICATION_DATA:
        return {...state, days: action.value[0].data, appointment: action.value[1].data, interviewers: action.value[2].data}
      case SET_INTERVIEW: {
        return {...state, appointment: action.value.appointment, days: newDays()}
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const setDay = day => dispatch({type: SET_DAY, value: day});

  useEffect(() => {
    Promise.all([
      Promise.resolve(Axios.get("http://localhost:8001/api/days")),
      Promise.resolve(Axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(Axios.get("http://localhost:8001/api/interviewers"))
    ]).then(values => {
      dispatch({type: SET_APPLICATION_DATA, value: values})
    })
  },[]);

  function bookInterview(id, interview) {
    
    const appointmentLoader = {
      ...state.appointment[id],
      interview: { ...interview }
    };
    
    const appointment = {
      ...state.appointment,
      [id]: appointmentLoader
    };

    const spots = "dec";

    return Axios.put(`http://localhost:8001/api/appointments/${id}`, {interview})
    .then(res => {
      dispatch({type: SET_INTERVIEW, value: {appointment, spots}});
    })
  }

  function cancelInterview(id, interview) {
    const appointmentLoader = {
      ...state.appointment[id],
      interview: null
    };
    
    const appointment = {
      ...state.appointment,
      [id]: appointmentLoader
    };
    
    const spots = "inc";
    
    return Axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(res => dispatch({type: SET_INTERVIEW, value: {appointment, spots, }}))
  }

  return { state, setDay, bookInterview, cancelInterview };
};