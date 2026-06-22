import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const BlogPage = () => {
  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0 text-center">
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          <img
            src="/images/blog-banner.jpg" 
            alt="Designer Home Blog"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase shadow-sm">
            Our <span className="text-[#C59D5F]">Journal</span>
          </h1>
          <p className="text-xl text-gray-300 mt-6 font-light drop-shadow italic">
            Insights, trends, and inspiration for modern interior design.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="relative group overflow-hidden rounded-[2rem] h-[500px] md:h-[600px] shadow-2xl flex items-end">
           <img src="/images/blog-featured.jpg" alt="Featured Post" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
           <div className="relative z-10 p-8 md:p-20 max-w-3xl space-y-6">
              <span className="bg-[#C59D5F] text-white px-6 py-2 rounded-full font-black text-xs tracking-widest uppercase">Featured Article</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Designing for Small Spaces: <br/>Maximizing Every Inch</h2>
              <p className="text-gray-300 text-lg font-light leading-relaxed">Discover how our expert designers use reflective surfaces, multifunctional furniture, and strategic lighting to make compact apartments feel grand.</p>
              <Link href="/blog/small-spaces" className="inline-block text-[#C59D5F] font-black tracking-widest text-sm uppercase border-b-2 border-[#C59D5F] pb-2 hover:text-white hover:border-white transition-all">Read More Insights</Link>
           </div>
        </div>
      </section>

      {/* Blog Categories & Feed */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex flex-col lg:flex-row gap-20">
           {/* Sidebar/Categories */}
           <div className="lg:w-1/4 space-y-12">
              <div>
                <h3 className="text-xl font-black text-[#222] uppercase tracking-tight mb-8 border-l-4 border-[#C59D5F] pl-4">Categories</h3>
                <ul className="space-y-4">
                  {["Interior Trends", "Color Psychology", "Furniture Design", "Sustainable Living", "Case Studies", "DIY Tips"].map((cat) => (
                    <li key={cat}>
                       <a href="#" className="flex items-center justify-between text-gray-500 hover:text-[#C59D5F] font-bold text-sm tracking-wide transition-colors group">
                          {cat.toUpperCase()}
                          <span className="text-xs text-gray-300 group-hover:text-[#C59D5F] transition-colors">(12)</span>
                       </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#FBFBFB] p-8 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-black text-[#222] uppercase tracking-tight mb-6">Newsletter</h3>
                <p className="text-gray-500 text-sm mb-6">Stay updated with our latest design trends and projects.</p>
                <div className="space-y-4">
                   <input type="email" placeholder="Your Email" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-sm outline-none focus:border-[#C59D5F]" />
                   <button className="w-full bg-[#222] text-white font-black text-xs tracking-[0.2em] uppercase py-4 rounded-lg hover:bg-[#C59D5F] transition-all">Subscribe Now</button>
                </div>
              </div>
           </div>

           {/* Grid Feed */}
           <div className="lg:w-3/4 space-y-16">
              <div className="grid md:grid-cols-2 gap-12">
                 {[
                   { title: "The Psychology of Color in Living Rooms", cat: "Color Psychology", date: "June 15, 2024", img: "/images/blog-1.jpg" },
                   { title: "Eco-Friendly Materials for Modern Homes", cat: "Sustainable Living", date: "June 10, 2024", img: "/images/blog-2.jpg" },
                   { title: "Revitalizing Traditional Nepali Architecture", cat: "Case Studies", date: "June 05, 2024", img: "/images/blog-3.jpg" },
                   { title: "5 Lighting Trends to Watch in 2024", cat: "Interior Trends", date: "May 28, 2024", img: "/images/blog-4.jpg" },
                 ].map((post, i) => (
                   <article key={i} className="group space-y-6">
                      <div className="h-72 overflow-hidden rounded-2xl relative">
                         <img src={post.img} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                         <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1 rounded-sm text-[10px] font-black tracking-widest uppercase text-[#222]">{post.cat}</div>
                      </div>
                      <div className="space-y-3">
                         <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{post.date}</span>
                         <h3 className="text-2xl font-black text-[#222] group-hover:text-[#C59D5F] transition-colors leading-tight">{post.title}</h3>
                         <p className="text-gray-500 font-light text-sm line-clamp-3 leading-relaxed">
                            Explore how the choice of your wall colors can influence the overall mood and social dynamics of your primary gathering space...
                         </p>
                         <Link href="/blog/detail" className="inline-flex items-center text-xs font-black tracking-[0.2em] text-[#222] uppercase group-hover:text-[#C59D5F] transition-colors">
                            Read More <span className="ml-2 text-lg">&rarr;</span>
                         </Link>
                      </div>
                   </article>
                 ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 pt-10">
                 {[1, 2, 3].map((num) => (
                   <button key={num} className={`w-12 h-12 rounded-full border-2 font-black transition-all ${num === 1 ? 'border-[#C59D5F] bg-[#C59D5F] text-white shadow-lg' : 'border-gray-100 text-gray-400 hover:border-[#C59D5F] hover:text-[#C59D5F]'}`}>
                      {num}
                   </button>
                 ))}
                 <button className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#C59D5F] hover:text-[#C59D5F] transition-all">
                    &rarr;
                 </button>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
