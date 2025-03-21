import React from 'react';

export function Events({ events }: any) {
    return (
        <ul>
            {
                events.map((event: any, index: string) =>
                    <li key={index}>{event}</li>
                )
            }
        </ul>
    );
}