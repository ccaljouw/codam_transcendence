"use client";
import { useEffect, useState } from "react";

interface screen {
    width: number,
    height: number,
    ratio: number,
}

export default function DottedEllipses() {
    const [screen, setScreen] = useState<screen>({width:(window.innerWidth), height:(window.innerHeight), ratio: (window.innerWidth / window.innerHeight)});
    const [isLoading, setIsloading] = useState<boolean>(false);

    // useEffect(() => {
    //     const handleResize = () => {
    //         // Perform actions on window resize
    //         if (isLoading == false)
    //         {
    //             setIsloading(true);
    //             setScreen({width:(window.innerWidth), height:(window.innerHeight), ratio: (window.innerWidth / window.innerHeight)});
    //             setIsloading(false);
    //         }

    //       };
    //       window.addEventListener('resize', handleResize);
    //       return () => {
    //         window.removeEventListener('resize', handleResize);
    //       };
        
    // }, []);

    return (
        <svg width="0" height="0" viewBox="0 0 400 300">
            <defs>
                <mask id="mask">
                <ellipse fill="#FFFFFF" cx={screen.width / 4 * 3} cy={screen.height / 2} rx={screen.width / 10} ry={screen.height / 10} />
                <ellipse fill="#FFFFFF" cx={screen.width / 4} cy={screen.height / 2} rx={window.innerWidth / 15} ry={window.innerHeight / 5} />
                </mask>
            </defs>
        </svg>
        // <svg width="0" height="0" viewBox="0 0 400 300">
        // <defs>
        //     <mask id="mask">
        //     {/* <rect fill="#000000" x="0" y="0" width="400" height="300"></rect> */}
        //     <ellipse fill="#FFFFFF" cx={window.innerWidth / 4 * 3} cy={window.innerHeight / 2} rx={window.innerWidth / 10} ry={window.innerHeight / 10} />
        //     <ellipse fill="#FFFFFF" cx={window.innerWidth / 4} cy={window.innerHeight / 2} rx={window.innerWidth / 15} ry={window.innerHeight / 5} />
        //     </mask>
        // </defs>
        // </svg>
    );
}
