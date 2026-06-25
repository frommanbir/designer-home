import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getAboutPageData } from "@/lib/about-page";

const DEFAULT_FEATURES = [
  { title: "Quality Assurance", description: "Quality is at the center of everything we do. We maintain careful attention to detail, select suitable materials, and provide professional supervision throughout every stage." },
  { title: "Cost Efficient Solutions", description: "We believe great design should be both beautiful and practical. Through efficient planning, in-house production, and optimized execution." },
  { title: "Unlimited Custom Designs", description: "Every client has a unique vision, and we are committed to bringing it to life with customized concepts tailored to your needs." },
  { title: "Timely Delivery", description: "With a structured workflow and dedicated supervision, we ensure projects are delivered within the agreed timeline." },
  { title: "Strong Team of Professionals", description: "Our experienced team of designers, project managers, and production specialists work collaboratively." },
  { title: "In-House Production Unit", description: "Having our own production unit allows us to maintain better quality assurance and greater flexibility in customization." },
];

export default async function AboutPage() {
  const data = await getAboutPageData().catch(() => ({})) as any;
  const { hero, welcome, main_about, why_choose_us } = data ?? {};

  const features =
    why_choose_us?.features?.length > 0
      ? why_choose_us.features
      : DEFAULT_FEATURES;

  return (
    <div className="bg-white font-sans overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src={hero?.image?.url || "/images/about-home.png"}
            alt="About Designer Home"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 flex flex-col items-center text-center px-6 animate-in fade-in slide-in-from-bottom-10 duration-[1500ms]">
          <h1 className="text-white text-5xl md:text-8xl font-black uppercase tracking-widest leading-tight">
            {hero?.title || "ESTABLISHED IN 2016 A.D"}
          </h1>
          <div className="w-20 h-1 bg-[#C59D5F] mt-8" />
        </div>
      </section>

      {/* Welcome */}
      <section className="max-w-7xl mx-auto py-20 px-6 text-center">
        <h2 className="text-4xl md:text-6xl text-[#333] mb-10 tracking-tight leading-tight">
          <span className="font-extrabold text-[#222]">
            {welcome?.title || "Welcome To Designer Home"}
          </span>
        </h2>
        <p className="text-lg md:text-xl text-[#555] leading-relaxed w-full whitespace-pre-line text-justify">
          {welcome?.description || "Established in 2016, we distill your ideas and tastes into designs that perfectly suit your space. From conceptualization and 3D modeling to execution and site supervision, Designer Home provides a complete design solution."}
        </p>
      </section>

      {/* Best Interior Design Company */}
      <section className="bg-[#F9F9F9] py-6 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-16 items-center">
          <div className="lg:col-span-1 relative group">
            <div className="absolute -inset-4 rounded-[2rem] transform group-hover:scale-105 transition-transform duration-500" />
            <img
              src={main_about?.image?.url || "/images/about-company.jpg"}
              alt="Our Work"
              className="relative rounded-[1.5rem] w-full h-[320px] md:h-[500px] object-cover shadow-2xl z-0"
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-[#222] leading-[1.1] tracking-tight whitespace-pre-line">
              {main_about?.title || "Best Interior Design\nCompany in Nepal"}
            </h2>
            <div className="space-y-6 text-[#444] text-md leading-relaxed whitespace-pre-line text-justify">
              <p>{main_about?.description || "Established in 2016 A.D., Designer Home Pvt. Ltd. is dedicated to transforming ideas into inspiring spaces through innovative interior design solutions."}</p>
            </div>
            <div className="pt-4">
              <Link href="/projects" className="px-8 py-4 bg-[#222] text-white font-bold rounded-lg hover:bg-[#C59D5F] transition-all transform hover:-translate-y-1 inline-block">
                EXPLORE OUR PROJECTS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto py-6 px-6">
        <h2 className="text-5xl font-black text-[#222] mb-6 tracking-tight uppercase">
          WHY CHOOSE US
        </h2>
        {/* {why_choose_us?.description && (
          <p className="text-xl text-[#666] mb-16 max-w-3xl leading-relaxed whitespace-pre-line">
            {why_choose_us.description}
          </p>
        )} */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {features.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#F5F5F5] p-12 rounded-lg space-y-6 transition-all duration-300 hover:shadow-md">
              <h3 className="text-3xl font-bold text-[#222] tracking-tight">{item.title}</h3>
              <p className="text-[#555] leading-relaxed text-lg font-light">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}