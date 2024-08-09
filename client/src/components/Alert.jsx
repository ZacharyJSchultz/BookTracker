import React from 'react'

const Alert = ( {strongtext, children, onClose}) => {
  return (
    <div className="alert alert-primary alert-dismissible fade show" role="alert">
        <strong>{strongtext}!</strong> {children}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClose}></button>
    </div>
  );
};

export default Alert;
