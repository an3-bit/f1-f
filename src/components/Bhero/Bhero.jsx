import { AiOutlineRobot } from "react-icons/ai";
import { FiBarChart2 } from "react-icons/fi";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { IoMdTrendingUp } from "react-icons/io";
import { BsGrid } from "react-icons/bs";
import { MdOutlineIntegrationInstructions } from "react-icons/md";

const features = [
  {
    icon: <AiOutlineRobot size={62} className="text-blue-500 border-4 rounded-full p-2" />, 
    title: "AI-Powered Triaging",
    description: "Interactive questionnaires that adapt to customer responses and provide intelligent recommendations."
  },
  {
    icon: <FiBarChart2 size={62} className="text-orange-500  border-4 rounded-full p-2" />, 
    title: "Standardized Sizing",
    description: "Consistent and accurate system sizing calculations across different solar hot water applications."
  },
  {
    icon: <HiOutlineClipboardCheck size={62} className="text-blue-500  border-4 rounded-full p-2" />, 
    title: "Automated Quotations",
    description: "Generate customer-friendly quotations with the right components selected from the D&S portfolio."
  },
  {
    icon: <IoMdTrendingUp size={62} className="text-blue-500  border-4 rounded-full p-2" />, 
    title: "Future-Proofing",
    description: "Plan for system expansion and include growth considerations in initial designs."
  },
  {
    icon: <BsGrid size={62} className="text-blue-500  border-4 rounded-full p-2" />, 
    title: "Centralized Dashboard",
    description: "Track customer inquiries, quotations, and system specifications in one place."
  },
  {
    icon: <MdOutlineIntegrationInstructions size={62} className="text-orange-500  border-4 rounded-full p-2" />, 
    title: "ERP Integration",
    description: "Seamless conversion of technical designs to business quotes in your existing ERP system."
  }
];

export default function Bhero() {
  return (
    <section className="py-16 bg-gradient-to-t from-secondary_blue to-white text-center">
      <div className="container mx-auto px-6 max-w-7xl">
        <button className="bg-primary_yellow text-white px-4 py-2 rounded-lg">Features</button>
        <h2 className="text-5xl font-semibold text-gray-900">Simplify Your Solar Hot Water Solutions</h2>
        <p className="text-gray-600 mt-2 text-xl font-xl mb-8">Our all-in-one platform streamlines the entire process from customer inquiry to system installation.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gradient-to-r hover:shadow cursor-pointer rounded-2xl">
              <div className="flex justify-center  mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 mt-2 text-[18px]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
