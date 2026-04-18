import ResourceTemplate from "./ResourceTemplate";

const ResumeScoreAILanding = () => {
    const content = (
        <div className="space-y-12 text-slate-600">
            <section>
                <h2 className="text-3xl font-black text-slate-900 border-b-4 border-rose-600 w-fit pb-2 mb-6 italic uppercase tracking-tight">Know Your Resume Score Instantly.</h2>
                <p>
                    What is your <strong>resume score AI</strong>? If it's below 80, you are likely being ignored by top-tier firms. Candidex AI provides a scientific score based on thousands of successful hires across the SaaS and Fintech industries.
                </p>
            </section>

            <section className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white border border-slate-100 p-8 rounded-3xl space-y-4">
                    <h3 className="text-xl font-black text-slate-900 italic uppercase">The 85% Rule.</h3>
                    <p className="text-sm italic">
                        Our research shows that candidates with an AI-calculated score of <strong>85% or higher</strong> are 4x more likely to secure a technical phone screen. 
                    </p>
                    <p className="text-sm italic">
                        We don't just give you a number; we show you the exact "Semantic Gaps" robbing you of points. 
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-black text-slate-900 mb-6 italic uppercase tracking-tight">How to calculate your ATS Score.</h2>
                <p>
                    Our algorithm breaks down your resume score into four critical pillars:
                </p>
                <div className="space-y-6 mt-6">
                    <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">1. Keyword Density <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400">PILLAR_A</span></h4>
                        <p className="text-sm">Matching against hard skills and tools specified in the JD.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">2. Impact Quantification <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400">PILLAR_B</span></h4>
                        <p className="text-sm">Measuring the density of numbers, percentages, and currencies in your work history.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">3. Role Resonance <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400">PILLAR_C</span></h4>
                        <p className="text-sm">Checking if your past experience aligns semantically with the target seniority level.</p>
                    </div>
                </div>
            </section>
        </div>
    );

    return (
        <ResourceTemplate 
            title="Resume Score AI"
            subtitle="Unlock your professional value with the world's most accurate resume scoring engine."
            content={content}
            keywords={['resume score AI', 'calculate ATS score', 'resume grading tool', 'AI resume ranker']}
        />
    );
};

export default ResumeScoreAILanding;
