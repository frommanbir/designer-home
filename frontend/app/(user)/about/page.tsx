import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[650px]">
        <img
          src="/images/about-banner.jpg"
          alt="Designer Home"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent" />

        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-32 py-5">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-20 w-auto"
          />

          <div className="flex items-center gap-8 text-white">
            <a href="/">Home</a>
            <a href="/about" className="font-semibold">
              About
            </a>
            <a href="/services">Services</a>
            <a href="/projects">Projects</a>
            <a href="/portfolio">Portfolio</a>
            <a href="/blog">Blog</a>

            <button className="border border-white rounded-full px-6 py-2">
              Contact
            </button>
          </div>
        </div>

        {/* Hero Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-7xl font-bold text-white text-center">
            ESTABLISHED IN 2016 A.D
          </h1>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="max-w-6xl mx-auto py-24 px-6 text-center">
        <h2 className="text-6xl text-neutral-700">
          Welcome To{" "}
          <span className="font-bold">
            Designer Home
          </span>
        </h2>

        <p className="mt-8 text-neutral-700 leading-8">
          Established in 2016, we distill your ideas and tastes into designs
          that perfectly suit your space. As pioneers in customized design,
          we offer a wide array of services—from initial conceptualization
          and 3D modeling to full execution and site supervision.
        </p>
      </section>

      {/* About Company */}
      <section className="bg-gray-100 py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <img
            src="/images/about-company.jpg"
            alt="Interior Design"
            className="rounded-2xl w-full h-[520px] object-cover"
          />

          <div>
            <h2 className="text-6xl font-bold text-neutral-700 leading-tight">
              Best Interior Design Company in Nepal
            </h2>

            <p className="mt-8 text-neutral-700 leading-8 text-justify">
              Established in 2016 A.D., Designer Home Pvt. Ltd. is dedicated
              to transforming ideas into inspiring spaces through innovative
              interior design solutions.
            </p>

            <p className="mt-6 text-neutral-700 leading-8 text-justify">
              Driven by creativity, experience, and a passion for excellence,
              Designer Home has grown into a trusted name in Nepal’s interior
              industry.
            </p>

            <p className="mt-6 text-neutral-700 leading-8 text-justify">
              Designer Home is your one-stop solution—from design concept to
              completion—shaping your dreams into reality.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto py-28 px-6">
        <h2 className="text-6xl font-bold text-neutral-700 mb-16">
          WHY CHOOSE US
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Quality Assurance",
              desc: "Quality is at the center of everything we do.",
            },
            {
              title: "Cost Efficient Solutions",
              desc: "Beautiful and practical design solutions.",
            },
            {
              title: "Unlimited Custom Designs",
              desc: "Tailored concepts for every client.",
            },
            {
              title: "Timely Delivery",
              desc: "Projects delivered within agreed timelines.",
            },
            {
              title: "Strong Team of Professionals",
              desc: "Experienced designers and project managers.",
            },
            {
              title: "In-House Production Unit",
              desc: "Better quality control and customization.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-gray-100 p-8 rounded-lg"
            >
              <h3 className="text-3xl mb-4">{item.title}</h3>
              <p className="text-neutral-700 leading-7">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div>
            <img
              src="/images/logo-white.png"
              alt="Logo"
              className="h-20 mb-6"
            />

            <p className="text-white/80">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li>Home</li>
              <li>About Us</li>
              <li>Services</li>
              <li>Portfolio</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">
              Contact Details
            </h3>

            <p>Naxal, Kathmandu, Nepal 44600</p>
            <p className="mt-2">
              info@designerhomenepal.com
            </p>
            <p className="mt-2">
              +977 9709080688, 9702910457
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">
              Stay Connected
            </h3>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-white bg-transparent p-3 rounded"
            />

            <button className="w-full bg-white text-neutral-700 py-3 rounded mt-4">
              Submit
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;