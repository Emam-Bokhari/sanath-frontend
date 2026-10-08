export default function TermsCondition({ terms }: { terms?: any }) {
    const displayContent = typeof terms === 'string' ? terms : terms?.content || "No content yet.";
    return (
        <section className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                {/* Sections */}
                <div className="max-w-4xl mx-auto space-y-4 text-black" dangerouslySetInnerHTML={{ __html: displayContent }} />

            </div>
        </section>
    );
}