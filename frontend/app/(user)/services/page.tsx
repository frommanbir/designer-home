import { redirect } from "next/navigation";
import { getServices } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function ServicesMainPage() {
  // Fetch services to find the first one
  const services = await getServices().catch(() => []);

  if (services && services.length > 0) {
    // Automatically 'open' the first service by selecting it
    redirect(`/services/${services[0].slug}`);
  }

  // If no services exist, we can show a placeholder or common hero
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black uppercase text-neutral-200">Services</h1>
        <p className="text-neutral-400 italic">Please select a service from the menu to discover our expertise.</p>
      </div>
    </div>
  );
}