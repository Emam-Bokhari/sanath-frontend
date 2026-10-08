import ContactUs from '@/components/InfoPages/ContactUs'
import PageHeader from '@/components/shared/PageHeader'
import React from 'react'

const page = () => {
    return (
        <div>
            <PageHeader title="Contact Us" />
            <ContactUs />
        </div>
    )
}

export default page