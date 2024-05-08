'use client'

import { SignIn } from "@clerk/nextjs";
import {useEffect, useState} from "react";

const SignInPage = () => {

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, []);

    if (!mounted) return null

    return <SignIn />
}

export default SignInPage