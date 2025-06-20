import React from 'react';

const Spinner = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        height: '80vh',
        width: '90vw',
        background: '#fff',
      }}
    >
      <div
        className="spinner-border text-primary rainbow-spinner"
        role="status"
        style={{
          width: '3rem',     
          height: '3rem',       
          borderWidth: '0.4em', 
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>

      <style jsx>{`
        .rainbow-spinner {
          border-top-color: red;
          border-right-color: orange;
          border-bottom-color: green;
          border-left-color: blue;
          animation: spin 1.1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
