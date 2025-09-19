"use client";

import { createContext, useState, useContext } from 'react';
import { Alert } from "@/components/retroui/Alert";
import { CheckCircle, InfoIcon, XIcon } from "lucide-react";

export const AlertContext = createContext<{
    showAlert: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}>({
    showAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
    const [visible, setVisible] = useState(false);

    const showAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        setMessage(message);
        setType(type);
        setVisible(true);
        
        // Hide alert after 3 seconds
        setTimeout(() => {
            setVisible(false);
        }, 4000);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {visible && (
                <div className="fixed bottom-4 right-4 z-50">
                    <Alert status={type} className="flex items-center">
                        {type === 'success' && <CheckCircle className="h-4 w-4 mr-4" />}
                        {type === 'info' && <InfoIcon className="h-4 w-4 mr-4" />}
                        {type === 'error' && <XIcon className="h-4 w-4 mr-4" />}
                        {type === 'warning' && <InfoIcon className="h-4 w-4 mr-4" />}
                        <Alert.Title>{message}</Alert.Title>
                    </Alert>
                </div>
            )}
        </AlertContext.Provider>
    );
};
