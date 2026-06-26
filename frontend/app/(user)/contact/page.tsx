import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactInfo = settings?.contact_info || {};
  const contactDetails = settings?.contact_details || {};
  
  const address = contactInfo.address || contactDetails.physical_address || "Naxal, Kathmandu, Nepal 44600";
  const phone = contactInfo.phone || contactDetails.primary_phone || "+977 9709080688";
  const phone2 = contactInfo.phone2 || contactDetails.secondary_phone || "9702910457";
  const email = contactInfo.email || contactDetails.email_address || "info@designerhomenepal.com";
  const mapEmbed = contactInfo.map_embed || contactDetails.google_maps_embed;

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen">
      {/* ── Hero Section ──────────────────────────────── */}
      <section className="relative h-[650px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/trunky.png"
            alt="Contact Designer Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 z-10" />
        </div>
      </section>

      {/* ── Info Cards Section ────────────────────────── */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
            {/* Address Card */}
            <div className="flex flex-col items-center text-center py-20 px-8 space-y-6 group">
              <div className="w-16 h-16 flex items-center justify-center text-[#C59D5F] group-hover:scale-110 transition-transform duration-500">
                <MapPin size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-neutral-700 text-3xl font-normal font-baumans">
                Address
              </h3>
              <p className="text-neutral-500 text-sm font-inter leading-relaxed max-w-xs">
                Visit us to explore our creative design workspace, project portfolio, material samples, and innovative interior solutions.
              </p>
              <p className="text-neutral-700 text-xl font-normal font-baumans">
                {address}
              </p>
            </div>

            {/* Contact Number Card */}
            <div className="flex flex-col items-center text-center py-20 px-8 space-y-6 group">
              <div className="w-16 h-16 flex items-center justify-center text-[#C59D5F] group-hover:scale-110 transition-transform duration-500">
                <Phone size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-neutral-700 text-3xl font-normal font-baumans">
                Contact Number
              </h3>
              <p className="text-neutral-500 text-sm font-inter leading-relaxed max-w-xs">
                Speak directly with our design team for quick assistance, project consultations, and service-related information.
              </p>
              <p className="text-neutral-700 text-xl font-normal font-baumans">
                {phone}{phone2 ? `, ${phone2}` : ""}
              </p>
            </div>

            {/* Email Card */}
            <div className="flex flex-col items-center text-center py-20 px-8 space-y-6 group">
              <div className="w-16 h-16 flex items-center justify-center text-[#C59D5F] group-hover:scale-110 transition-transform duration-500">
                <Mail size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-neutral-700 text-3xl font-normal font-baumans">
                Email Address
              </h3>
              <p className="text-neutral-500 text-sm font-inter leading-relaxed max-w-xs">
                Send us your questions, project requirements, or appointment requests anytime, and we will respond as soon as possible.
              </p>
              <p className="text-neutral-700 text-xl font-normal font-baumans">
                {email}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map Section ──────────────────────────────── */}
      {mapEmbed ? (
        <section className="w-full h-[500px] transition-all duration-700">
          {mapEmbed.includes("<iframe") ? (
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{
                __html: mapEmbed
                  .replace(/width="[^"]*"/, 'width="100%"')
                  .replace(/height="[^"]*"/, 'height="100%"'),
              }}
            />
          ) : (
            <iframe
              src={mapEmbed.includes("http") ? mapEmbed : `https://${mapEmbed}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </section>
      ) : (
        <section className="h-[500px] w-full bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 font-bold uppercase tracking-widest">
            Interactive Map Integration
          </div>
        </section>
      )}

      {/* ── Contact Form Section ─────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-24 space-y-12">
        <div className="text-center space-y-5">
          <h2 className="text-neutral-800 text-4xl font-semibold font-inter">
            Get in Touch
          </h2>
          <p className="text-neutral-600 text-base font-inter max-w-[746px] mx-auto leading-relaxed">
            We are always ready to answer your questions and assist you with design consultations, project planning, construction services, and all aspects of your design-and-build requirements.
          </p>
        </div>

        <ContactForm />
      </section>
    </div>
  );
}