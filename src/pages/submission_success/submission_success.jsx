import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubmissionSuccess = () => {
    const navigate = useNavigate();

    const handleHomeRedirect = () => {
        navigate('/');
    };

    return (
        <div style={{ maxWidth: 400, margin: '80px auto', textAlign: 'center', padding: 32, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2>Thank You!</h2>
            <p>
                Your request has been submitted successfully.<br />
                An engineer will review it and get back to you within 1 hour.
            </p>
            <button
                onClick={handleHomeRedirect}
                style={{
                    marginTop: 24,
                    padding: '10px 24px',
                    fontSize: 16,
                    borderRadius: 6,
                    border: 'none',
                    background: '#1976d2',
                    color: '#fff',
                    cursor: 'pointer'
                }}
            >
                Go to Home
            </button>
        </div>
    );
};

export default SubmissionSuccess;