import React from 'react';

const BlogAuthority = () => {
  const posts = [
    {
      title: "Why Most Resumes Fail ATS — And How to Fix It",
      category: "Research",
      readTime: "6 min read",
      desc: "An in-depth study of 10,000 resumes and their success rates in modern screening systems."
    },
    {
      title: "The Shift to Semantic Hiring in 2026",
      category: "Market Insights",
      readTime: "4 min read",
      desc: "How enterprises are moving from keyword filters to contextual intelligence."
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] opacity-40">The Knowledge Hub</h2>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Insights Backed by Real Hiring Data</h1>
          </div>
          <button className="text-slate-900 font-black text-sm uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-all">
             Read All Research
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{post.category}</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">{post.desc}</p>
              </div>
              
              <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                 <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-600 transition-colors group-hover:translate-x-2 transition-transform">arrow_forward</span>
                 <div className="flex -space-x-2">
                    {[1,2,3].map(j => (
                      <div key={j} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">P</div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] font-black text-white">+5</div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogAuthority;
