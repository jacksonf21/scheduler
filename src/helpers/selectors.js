
export function getAppointmentsForDay(state, day) {
  const selectAppoint = [];

  const filteredAppointmentsDay = state.days.filter(objDay => objDay.name === day);
  if (!filteredAppointmentsDay.length) return selectAppoint;

  const appointments = filteredAppointmentsDay[0].appointments;

  let i = 0;
  let j = 1;

  while (i < appointments.length) {
    if (appointments[i] === state.appointment[j].id) {
      selectAppoint.push(state.appointment[j]);
      i++;
      j = 1;
    } else {
      j++;
    }
  }
  
  return selectAppoint;
};

export function getInterview(state, interview) {
  const retObj = interview;
  const stateKeys = Object.keys(state.interviewers);
  
  if (interview === null) return null; 

  stateKeys.forEach(key => {
    if (state.interviewers[key].id === interview.interviewer) retObj.interviewer = state.interviewers[key];
  })
  console.log(retObj);
  return retObj;
};