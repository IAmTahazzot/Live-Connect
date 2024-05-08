'use client'

import {useState, useEffect} from "react";
import {UserButton} from "@clerk/nextjs";

const ClerkUserButton = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    } ,[]);

    if (!mounted) {
        return null;
    }

    return <UserButton
        afterSignOutUrl={'/sign-in'}
        appearance={{
            elements: {
                avatarBox: 'h-[48px] w-[48px]'
            }
        }}/>
}

export default ClerkUserButton