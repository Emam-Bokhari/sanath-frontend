import HomePage from '@/components/web-pages/HomePage'
import { Suspense } from 'react'

const page = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <HomePage />
            </Suspense>
        </div>
    )
}

export default page