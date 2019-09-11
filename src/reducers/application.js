const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_WS_UPDATE = "SET_WS_UPDATE";

export default function reducer(state, action) {
  let appointment = {};
  let appointments = {};
  
  action.type !== null ? 
    appointment = {...state.appointment[action.value.id],
    interview: action.value.interview} : 
    appointment=false;

  appointment ? 
    appointments = {...state.appointment,
    [action.value.id]: appointment} : 
    appointments = false;

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

export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_WS_UPDATE };
