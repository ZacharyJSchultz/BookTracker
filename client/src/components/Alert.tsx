import React, {ReactNode} from 'react'

interface Props {
  alertType?: string;
  strongtext: string;
  children: ReactNode;
  onClose: () => void;
}

const Alert = ({alertType = "alert-primary", strongtext, children, onClose} : Props) => {
  return (
    <div className={alertType.concat(" ", "alert alert-primary alert-dismissible fade show")} role="alert" style={{marginTop: "32px"}}>
        <strong>{strongtext}!</strong> {children}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClose}></button>
    </div>
  );
};

export default Alert;
