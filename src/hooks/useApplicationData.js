import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_WS_UPDATE = "SET_WS_UPDATE";

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointment: {},
    interviewers: {}
  });

  function reducer(state, action) {

    const appointment = {
      ...state.appointment[action.value.id],
      interview: action.value.interview
    };

    const appointments = {
      ...state.appointment,
      [action.value.id]: appointment
    };

    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.value};
      case SET_APPLICATION_DATA:
        return {...state, days: action.value[0].data, appointment: action.value[1].data, interviewers: action.value[2].data};
      case SET_INTERVIEW: {;
        return {...state, appointment: action.value.appointment, days: action.value.values};
      }
      case SET_WS_UPDATE: {
        return {...state, appointment: appointments, days: action.value.days};
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const setDay = day => dispatch(
    {type: SET_DAY, value: day}
    );

  useEffect(() => {
    const sock = new WebSocket(`ws://localhost:8001`); 
    sock.addEventListener('open', () => {
      sock.send('ping');
    });

    sock.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      console.log(msg);
      
      if (msg.type === "SET_INTERVIEW") {
        axios.get("http://localhost:8001/api/days")
        .then(res => {
          const values = res.data;
          msg.days = values;
          dispatch({type: SET_WS_UPDATE, value: msg});
        })
      }
    })
    
    Promise.all([
      Promise.resolve(axios.get("http://localhost:8001/api/days")),
      Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
    ]).then(values => {
      dispatch({type: SET_APPLICATION_DATA, value: values})
    })

    return () => { sock.close(); };

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

    return axios.put(`http://localhost:8001/api/appointments/${id}`, {interview})
    .then(res => {
      axios.get("http://localhost:8001/api/days")
      .then(res => {
        const values = res.data;
        dispatch({type: SET_INTERVIEW, value: {appointment, values}});
      })
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
    
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(res => {
      axios.get("http://localhost:8001/api/days")
        .then(res => {
          const values = res.data;
          dispatch({type: SET_INTERVIEW, value: {appointment, values}});
        })
    })
  }

  return { state, setDay, bookInterview, cancelInterview };
};