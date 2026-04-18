import ResourceTemplate from "./ResourceTemplate";

const ATSResumeCheckerLanding = () => {
    const content = (
        <div className="space-y-12 text-slate-600">
            <section>
                <h2 className="text-3xl font-black text-slate-900 border-b-4 border-indigo-600 w-fit pb-2 mb-6 italic uppercase tracking-tight">The Best ATS Resume Checker Online.</h2>
                <p>
                    Are you struggling to get interview calls even after applying to hundreds of jobs? The reason is likely the <strong>Applicant Tracking System (ATS)</strong>. Our online checker analyzes your resume's formatting, keywords, and hierarchy to ensure 100% compliance.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <h4 className="font-black text-indigo-900 uppercase italic text-sm mb-3">ATS Resume Tips</h4>
                    <ul className="text-xs space-y-2 font-bold opacity-80">
                        <li>• Use standard Arial or Inter fonts.</li>
                        <li>• Avoid tables and columns.</li>
                        <li>• Save as a standard PDF.</li>
                        <li>• Use reverse-chronological order.</li>
                    </ul>
                </div>
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <h4 className="font-black text-emerald-900 uppercase italic text-sm mb-3">India Job Market 2026</h4>
                    <p className="text-xs font-medium italic">
                        Candidex AI is the top <strong>ATS resume checker online free India</strong>. We understand the specific nuances of Fortune 500 tech hiring in Bangalore, Hyderabad, and Pune.
                    </p>
                </div>
            </div>

            <section>
                <h2 className="text-3xl font-black text-slate-900 mb-6 italic uppercase tracking-tight">How our ATS Checker works.</h2>
                <p>
                    Unlike basic keyword checkers, Candidex uses a <strong>Multi-layer Neural Audit</strong>. We simulate a recruiter's first pass, checking for "Readability Velocity" and "Skill Scannability." If your resume isn't readable within 6 seconds, the machine marks it as low-priority.
                </p>
                <p className="mt-4">
                    Our free tool provides an instant score and actionable suggestions to fix your formatting bugs and alignment errors.
                </p>
            </section>
        </div>
    );

    return (
        <ResourceTemplate 
            title="ATS Resume Checker"
            subtitle="The #1 ATS resume checker for professionals looking to dominate the 2026 job market."
            content={content}
            keywords={['ATS resume checker', 'ATS resume checker online free India', 'ATS resume tips', 'free ATS resume scan']}
        />
    );
};

export default ATSResumeCheckerLanding;
