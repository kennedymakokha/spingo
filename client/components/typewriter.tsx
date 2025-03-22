'use client'
import React, { useState, useEffect } from 'react';

const TypewriterEffect = ({ text, speed }: any) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[index]);
                setIndex(index + 1);
            }, speed);

            return () => clearTimeout(timeout); // Clean up timeout
        }
    }, [index, text, speed]);

    return (
        <div style={{ fontFamily: 'Courier New', fontSize: '24px', color: 'white' }}>
            {displayedText}
        </div>
    );
};

export default TypewriterEffect
