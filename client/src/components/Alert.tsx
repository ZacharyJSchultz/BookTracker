import React, {ReactNode} from 'react'

interface Props {
  alertType?: String;
  strongtext: String;
  children: ReactNode;
  onClose: () => void;
}

const Alert = ({alertType = "alert-primary", strongtext, children, onClose} : Props) => {
  return (
    <div className={alertType.concat(" ", "alert alert-primary alert-dismissible fade show")} role="alert">
        <strong>{strongtext}!</strong> {children}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClose}></button>
    </div>
  );
};

export default Alert;
