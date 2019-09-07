import React, { useEffect } from "react";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import "components/Appointment/styles.scss";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDITING = "EDITING";
  const ERRORSAVE = "ERRORSAVE";
  const ERRORDELETE = "ERRORDELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
     transition(EMPTY);
    }
   }, [props.interview, transition, mode]);

  function save(name, interviewer) {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    };

    if (interview.student.length !== 0 && interviewer) {
      props.bookInterview(props.id, interview)
      .then((res) => {
        transition(SHOW);
      })
      .catch(error => transition(ERRORSAVE, true));
    } else {
      transition(ERRORSAVE, true);
    }
  }

  function deleteInt(name, interviewer) {
    transition(DELETING, true);
    const interview = {
      student: name,
      interviewer
    };
    props.cancelInterview(props.id, interview)
    .then((res) => {
      transition(EMPTY);
    })
    .catch(error => transition(ERRORDELETE, true));
  }
  
  return (
    <article className="appointment">
      <Header 
        time={props.time}
      />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>} 
      {mode === SHOW && props.interview && (
        <Show 
          student={props.interview.student} 
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDITING)}
        />)}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />)}
      {mode === EDITING && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onSave={save}
          onCancel={() => back()}
        />
      )}
      {mode === SAVING && (
        <Status
          message={"Saving"}
        />
      )}
      {mode === DELETING && (
        <Status 
          message={"Deleting"}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message={"Confirm Delete?"}
          onCancel={() => back()}
          onConfirm={() => deleteInt()}
        />
      )}
      {mode === ERRORSAVE && (
        <Error
          message={"An error with saving has occured"}
          onClose={() => back()}
        />
      )}
      {mode === ERRORDELETE && (
        <Error
          message={"An error with deleting has occured"}
          onClose={() => back()}
        />
      )}
    </article>
  );
};