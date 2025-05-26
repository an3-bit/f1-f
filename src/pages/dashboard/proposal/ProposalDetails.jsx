import React from 'react';
import { useParams } from 'react-router-dom';

const ProposalDetails = ({ proposals }) => {
  const { id } = useParams();
  const proposal = proposals.find(p => p.id === id);

  if (!proposal) {
    return <div className="p-6 text-center text-gray-600">Proposal not found</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Proposal for {proposal.customerInfo.fullName}</h1>
      <p className="text-gray-700 mb-2"><strong>System:</strong> {proposal.systemDetails.name}</p>
      <p className="text-gray-700 mb-2"><strong>Submission Date:</strong> {proposal.submissionDate}</p>
      <p className="text-gray-700 mb-2"><strong>Status:</strong> {proposal.status}</p>
      <h2 className="text-xl font-semibold mt-4 mb-2">System Details</h2>
      <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">{JSON.stringify(proposal.systemDetails, null, 2)}</pre>
      <h2 className="text-xl font-semibold mt-4 mb-2">Customer Info</h2>
      <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">{JSON.stringify(proposal.customerInfo, null, 2)}</pre>
    </div>
  );
};

export default ProposalDetails;
