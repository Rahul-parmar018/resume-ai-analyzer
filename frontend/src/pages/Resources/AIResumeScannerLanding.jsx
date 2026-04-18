import ResourceTemplate from "./ResourceTemplate";

const AIResumeScannerLanding = () => {
    const content = (
        <div className="space-y-16 text-slate-600">
            {/* Section 1: What is AI Resume Scanner */}
            <section>
                <h2 className="text-3xl font-black text-slate-900 border-b-4 border-blue-600 w-fit pb-2 mb-6 italic uppercase tracking-tight">What is an AI Resume Scanner?</h2>
                <p className="text-lg leading-relaxed">
                    An <strong>AI resume scanner</strong> is a sophisticated tool that uses Machine Learning (ML) and Natural Language Processing (NLP) to evaluate how well your resume matches a specific job description. Unlike old-school keyword searchers, modern scanners like Candidex AI understand the <em>semantic meaning</em> of your experience, just like a recruiter does.
                </p>
            </section>

            {/* Section 2: How ATS works */}
            <section className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                <h2 className="text-3xl font-black text-slate-900 mb-6 italic uppercase tracking-tight">How does an ATS work?</h2>
                <p className="mb-6">
                    Applicant Tracking Systems (ATS) are the gatekeepers. They parse your document into a digital profile. If your <strong>resume analyzer online</strong> score is too low, the system automatically archives your application.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-blue-600 font-black mb-2 text-xs uppercase tracking-widest">Step 01</p>
                        <p className="text-sm font-bold text-slate-900">Parsing & Indexing</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-blue-600 font-black mb-2 text-xs uppercase tracking-widest">Step 02</p>
                        <p className="text-sm font-bold text-slate-900">Keyword Matching</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-blue-600 font-black mb-2 text-xs uppercase tracking-widest">Step 03</p>
                        <p className="text-sm font-bold text-slate-900">Ranking & Scoring</p>
                    </div>
                </div>
            </section>

            {/* Section 3: Why resumes get rejected */}
            <section>
                <h2 className="text-3xl font-black text-slate-900 mb-6 italic uppercase tracking-tight">Why Resumes Get Rejected.</h2>
                <p className="mb-8">Even the best candidates fail if their resume isn't optimized. To <strong>improve your resume with AI</strong>, you must fix these critical errors:</p>
                <ul className="space-y-6">
                    <li className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0 font-bold text-xs mt-1">!</div>
                        <div>
                            <p className="font-black text-slate-900 uppercase italic text-sm mb-1">Low Keyword Density</p>
                            <p className="text-sm">Missing core competencies found in the job description.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0 font-bold text-xs mt-1">!</div>
                        <div>
                            <p className="font-black text-slate-900 uppercase italic text-sm mb-1">Formatting Bugs</p>
                            <p className="text-sm">Tables, columns, and graphics that break ATS parsers.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0 font-bold text-xs mt-1">!</div>
                        <div>
                            <p className="font-black text-slate-900 uppercase italic text-sm mb-1">Weak Impact Evidence</p>
                            <p className="text-sm">Lacking numbers and metrics that prove your value.</p>
                        </div>
                    </li>
                </ul>
            </section>

            {/* Section 4: Extra Keywords Integration */}
            <section className="border-t border-slate-100 pt-16">
                <p className="text-sm text-slate-400 italic font-medium leading-relaxed">
                    Our <strong>ATS resume checker free</strong> tool is designed for modern professionals. Whether you're using our <strong>resume score AI</strong> to benchmark your profile or an <strong>online resume analyzer</strong> to polish your final draft, Candidex provides the intelligence you need to succeed.
                </p>
            </section>
        </div>
    );

    return (
        <ResourceTemplate 
            title="Free AI Resume Scanner (No Login Required)"
            subtitle="Get your ATS score instantly. Upload your resume and receive AI-powered feedback, keyword suggestions, and recruiter-level improvements — completely free."
            btnText="Scan Resume for Free"
            content={content}
            keywords={['AI resume scanner', 'ATS resume checker free', 'resume score AI', 'resume analyzer online', 'improve resume with AI']}
        />
    );
};

export default AIResumeScannerLanding;
