import PricingSection from '@/components/InfoPages/Pricing/PricingSection'
import PageHeader from '@/components/shared/PageHeader'
import { apiFetch } from '@/lib/api-fech'
import React from 'react'

const page = async () => {
    const res = await apiFetch(
        `/plans`,
        {
            next: {
                tags: ["plans"],
                revalidate: 3600,
            },
        },
        "server"
    );

    return (
        <div>
            <PageHeader title="Pricing" />
            <PricingSection plansInfo={(res as any)?.data || []} />
        </div>
    )
}

export default page