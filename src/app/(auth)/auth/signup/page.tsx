import Signup from '@/components/auth/Signup/Signup'
import React, { Suspense } from 'react'

const page = () => {
    return <Suspense fallback={<div>Loading...</div>}>
        <Signup />
    </Suspense>
}

export default page