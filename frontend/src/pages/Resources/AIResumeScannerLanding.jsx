import ResourceTemplate from "./ResourceTemplate";

const AIResumeScannerLanding = () => {
    const content = (
        <div className="space-y-12 text-slate-600">
            <section>
                <h2 className="text-3xl font-black text-slate-900 border-b-4 border-blue-600 w-fit pb-2 mb-6 italic uppercase tracking-tight">How to improve resume with AI.</h2>
                <p>
                    In 2026, recruiters are using Automated Tracking Systems (ATS) and LLMs to filter out 92% of applicants before a human even sees the file. To get indexed, you need to use a <strong>free AI resume scanner</strong> that understands how these machines think. 
                </p>
                <ul className="space-y-4 mt-6">
                    <li className="flex items-start gap-3">
                        <div className="mt-1 bg-emerald-100 p-1 rounded-full"><div className="w-2 h-2 bg-emerald-500 rounded-full" /></div>
                        <span><strong>Quantify Your Impact:</strong> AI models prioritize metrics. Replace "Managed teams" with "Led 15+ engineers to ship 3 SaaS products 20% faster."</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1 bg-emerald-100 p-1 rounded-full"><div className="w-2 h-2 bg-emerald-500 rounded-full" /></div>
                        <span><strong>Semantic Keywords:</strong> Don't just stuff keywords. Use contextual phrases that show <em>how</em> you applied a skill.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1 bg-emerald-100 p-1 rounded-full"><div className="w-2 h-2 bg-emerald-500 rounded-full" /></div>
                        <span><strong>Role Alignment:</strong> Our AI scanner matches your profile against real-world job descriptions to find gaps.</span>
                    </li>
                </ul>
            </section>

            <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-4 italic uppercase tracking-tight">Free AI Resume Scanner for Freshers</h3>
                <p className="text-sm italic">
                    If you are a student or a recent graduate with limited experience, our tool is specifically calibrated to highlight your "Potential Density." We analyze your internships, projects, and certifications to show recruiters you are ready for high-velocity environments.
                </p>
            </section>

            <section>
                <h2 className="text-3xl font-black text-slate-900 mb-6 italic uppercase tracking-tight">Top Resume Mistakes in 2026</h2>
                <p>The landscape has changed. Avoid these common pitfalls to keep your ATS score high:</p>
                <ol className="list-decimal pl-6 mt-4 space-y-4 font-medium">
                    <li>Using graphic-heavy templates (Canvas layouts often fail ATS parsing).</li>
                    <li>Forgetting to include a "Core Competencies" section for faster semantic indexing.</li>
                    <li>Vague job titles that don't match industry-standard labels.</li>
                </ol>
            </section>
        </div>
    );

    return (
        <ResourceTemplate 
            title="AI Resume Scanner"
            subtitle="The definitive guide on how to improve your resume with AI in seconds."
            content={content}
            keywords={['AI resume scanner', 'free AI resume scanner for freshers', 'improve resume with AI tool', 'resume mistakes 2026']}
        />
    );
};

export default AIResumeScannerLanding;
