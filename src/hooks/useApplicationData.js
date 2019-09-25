import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_WS_UPDATE } from "reducers/application";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointment: {},
    interviewers: {}
  });

  const setDay = day => dispatch(
    {type: SET_DAY, value: day}
    );

  useEffect(() => {
    const sock = new WebSocket(`ws://scheduler--api.herokuapp.com`); 
    sock.addEventListener('open', () => {
      sock.send('ping');
    });

    sock.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      
      if (msg.type === "SET_INTERVIEW") {
        axios.get("http://scheduler--api.herokuapp.com/api/days")
        .then(res => {
          const values = res.data;
          msg.days = values;
          dispatch({type: SET_WS_UPDATE, value: msg});
        })
      }
    })
    
    Promise.all([
      Promise.resolve(axios.get("http://scheduler--api.herokuapp.com/api/days")),
      Promise.resolve(axios.get("http://scheduler--api.herokuapp.com/api/appointments")),
      Promise.resolve(axios.get("http://scheduler--api.herokuapp.com/api/interviewers"))
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

    return axios.put(`http://scheduler--api.herokuapp.com/api/appointments/${id}`, {interview})
    .then(res => {
      axios.get("http://scheduler--api.herokuapp.com/api/days")
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
    
    return axios.delete(`http://scheduler--api.herokuapp.com/api/appointments/${id}`)
    .then(res => {
      axios.get("http://scheduler--api.herokuapp.com/api/days")
        .then(res => {
          const values = res.data;
          dispatch({type: SET_INTERVIEW, value: {appointment, values}});
        })
    })
  }

  return { state, setDay, bookInterview, cancelInterview };
};