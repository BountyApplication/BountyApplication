import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const NotifyContext = createContext(() => {});

export const useNotify = () => useContext(NotifyContext);

let _globalNotify = null;

export function setGlobalNotify(fn) {
    _globalNotify = fn;
}

export function notifyError(message) {
    if (_globalNotify) _globalNotify(message, 'danger');
    else console.error(message);
}

export function NotificationProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const notify = useCallback((message, variant = 'danger') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, variant }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    }, []);

    useEffect(() => {
        setGlobalNotify(notify);
        return () => setGlobalNotify(null);
    }, [notify]);

    const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <NotifyContext.Provider value={notify}>
            {children}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999, position: 'fixed' }}>
                {toasts.map(({ id, message, variant }) => (
                    <Toast key={id} bg={variant} onClose={() => dismiss(id)} show>
                        <Toast.Header closeButton>
                            <strong className="me-auto">
                                {variant === 'danger' ? 'Fehler' : 'Hinweis'}
                            </strong>
                        </Toast.Header>
                        <Toast.Body className="text-white">{message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </NotifyContext.Provider>
    );
}
