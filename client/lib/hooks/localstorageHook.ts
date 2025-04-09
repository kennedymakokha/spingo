import { useEffect, useState } from 'react';

const useLocalStorage = (key: string, initialValue: any) => {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window !== 'undefined') {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        return initialValue;
    });

    const setValue = (value: any) => {
        if (typeof window !== 'undefined') {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
