
export function getAppointmentsForDay(state, day) {
  const filteredApptDay = state.days.filter(objDay => objDay.name === day);
  let selectAppoint = [];
  
  if (filteredApptDay.length) {
    const appointments = filteredApptDay[0].appointments;
    selectAppoint = appointments.map(num => state.appointment[num]);
  }
  
  return selectAppoint;
};

export function getInterviewersForDay(state, day) {
  const filteredApptDay = state.days.filter(objDay => objDay.name === day);
  let selectInterviewer = [];

  if (filteredApptDay.length) {
    const interviewers = filteredApptDay[0].interviewers;

    let i = 0;
    let j = 1;
  
    while (i < interviewers.length) {
      if (interviewers[i] === state.interviewers[j].id) {
        selectInterviewer.push(state.interviewers[j]);
        i++;
        j = 1;
      } else {
        j++;
      }
    }
  }

  return selectInterviewer;
};

export function getInterview(state, interview) {
  const retObj = interview;
  const stateKeys = Object.keys(state.interviewers);
  
  if (interview === null) return null; 

  stateKeys.forEach(key => {
    if (state.interviewers[key].id === interview.interviewer) retObj.interviewer = state.interviewers[key];
  })
  return retObj;
};

