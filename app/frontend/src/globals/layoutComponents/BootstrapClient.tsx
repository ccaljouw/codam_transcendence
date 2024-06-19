"use client";
import { useEffect } from 'react';

export default function BootstrapClient() : JSX.Element {
    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    return (<></>);
}
