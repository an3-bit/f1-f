import { useLocation, useNavigate } from 'react-router-dom';
import { FaHandPointLeft, FaHandPointRight } from "react-icons/fa";

const System_Size = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendData } = location.state || {};

  const handleSubmit = (selectedSystem) => {
    navigate('/client-proposal', {
      state: {
        selectedSystem,
        fullData: backendData,
      },
    });
  };

  const handleBack = () => {
    alert("Navigating back to questionnaire...");
    navigate('/questionnaire');
  };

  if (!backendData) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        No recommendations found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold text-center">Recommended Systems</h1>

      {/* SYSTEM CARDS CONTAINER - CENTERED */}
      <div className="flex flex-wrap justify-center gap-6 pb-4">
        {backendData.recommended_systems.map((system, index) => (
          <div
            key={index}
            className="bg-white w-full sm:w-[320px] md:w-[350px] p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-blue-700">{system.name}</h2>
            <h3 className="text-gray-800 font-medium">System Model: {system.model}</h3>
            <p className="mt-2 text-gray-700">{system.description}</p>

            <ul className="mt-3 space-y-1 text-sm text-gray-800">
              <li><strong>Capacity:</strong> {system.specifications.tank_capacity}</li>
              {system.specifications.max_heat_output && (
                <li><strong>Max Heat Output:</strong> {system.specifications.max_heat_output}</li>
              )}
              {system.specifications.min_heat_output && (
                <li><strong>Min Heat Output:</strong> {system.specifications.min_heat_output}</li>
              )}
              {system.specifications.collector_area && (
                <li><strong>Collector Area:</strong> {system.specifications.collector_area}</li>
              )}
              {system.specifications.number_of_tubes && (
                <li><strong>Number of Tubes:</strong> {system.specifications.number_of_tubes}</li>
              )}
            </ul>

            <div className="mt-4">
              <h4 className="font-semibold">System Features</h4>
              <ul className="list-disc list-inside text-sm">
                <li>{system.specifications.features}</li>
              </ul>
            </div>

            <button
              onClick={() => handleSubmit(system)}
              className="mt-6 w-full bg-primary_yellow flex justify-center items-center gap-2 text-white px-4 py-2 rounded-full hover:scale-105 hover:opacity-95 transition-all duration-300"
            >
              Choose this and get a proposal from the sales engineer
              <FaHandPointRight className="text-green-200" />
            </button>
          </div>
        ))}
      </div>

      {/* REASONING SECTION */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reasoning</h3>
        <p className="text-gray-800">{backendData.reasoning}</p>
      </div>

      {/* ADDITIONAL CONSIDERATIONS */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Considerations</h3>
        <ul className="list-decimal ml-6 text-gray-800 space-y-1">
          {backendData.additional_considerations.map((consideration, index) => (
            <li key={index}>{consideration}</li>
          ))}
        </ul>
      </div>

      {/* BACK BUTTON */}
      <div className="bg-pink-100 rounded-xl p-4 flex justify-between items-center">
        <p className="font-bold">NOT SATISFIED?</p>
        <button
          onClick={handleBack}
          className="hover:scale-105 hover:opacity-90 duration-300 transition-all flex bg-red-500 px-4 py-2 text-white font-semibold rounded-xl justify-center items-center gap-2"
        >
          <FaHandPointLeft />
          Back to Questionnaire
        </button>
      </div>
    </div>
  );
};

export default System_Size;
