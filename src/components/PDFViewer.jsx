import React, { useState } from 'react';
import { BiDownload, BiSearch } from 'react-icons/bi';

const PDFViewer = () => {
    const [selectedPDF, setSelectedPDF] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const pdfList = [
        { name: 'AQUASTRONG SMART45 Water Boosting Systems', path: '/pdfs/Aquasmart 45.pdf' },
        { name: 'Dayliff CSW Centralised Hot Water Systems', path: '/pdfs/Dayliff CSW.pdf' },
        { name: 'Dayliff HPW Heat Pump Hot Water Systems', path: '/pdfs/Dayliff HPW.pdf' },
        { name: 'Dayliff Solar Modules', path: '/pdfs/Dayliff Solar Modules.pdf' },
        { name: 'DDC Domestic Pipes', path: '/pdfs/DDC.pdf' },
        { name: 'DDF Fountain Pipes', path: '/pdfs/DDF.pdf' },
        { name: 'DDG Centrifugal Booster Pumps', path: '/pdfs/DDG.pdf' },
        { name: 'DDJ Domestic Pumps', path: '/pdfs/DDJ.pdf' },
        { name: 'DDP Domestic Pumps', path: '/pdfs/DDP.pdf' },
        { name: 'DDP50.65 Domestic Pumps', path: '/pdfs/DDP50.65.pdf' },
        { name: 'DDS Centrifugal Booster Pumps', path: '/pdfs/DDS.pdf' },
        { name: 'DDT Plastic Centrifugal Booster Pumps', path: '/pdfs/DDT.pdf' },
        { name: 'DDV60 Vibration Pumps', path: '/pdfs/DDV60.pdf' },
        { name: 'DSmart Smart Water Boosting System', path: '/pdfs/DSmart.pdf' },
        { name: 'Suntower', path: '/pdfs/Suntower.pdf' },
        { name: 'Support Structures', path: '/pdfs/Support Structures.pdf' },
        { name: 'Ultrasun UFS Flatplate Solar Water Heaters', path: '/pdfs/Ultrasun UFS.pdf' },
        { name: 'Ultrasun UFX Flatplate Solar Water Heaters', path: '/pdfs/Ultrasun UFX.pdf' },
        { name: 'Ultrasun UVR Vacrod Solar Water Heaters', path: '/pdfs/Ultrasun UVR.pdf' },
        { name: 'Ultrasun UVT Vacuum Tubes Water Heaters', path: '/pdfs/Ultrasun UVT.pdf' },
    ];

    const filteredPDFs = pdfList.filter(pdf =>
        pdf.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    const handlePDFSelect = (pdfPath) => {
        setSelectedPDF(pdfPath);
        window.open(pdfPath, '_blank');
    };

    return (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Product Manuals</h2>
            <h3 className="text-sm text-gray-500 mb-3">Scroll down and click on the PDF to view or download</h3>
            
            <div className="relative mb-4">
                <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search manuals..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredPDFs.map((pdf, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handlePDFSelect(pdf.path)}
                    >
                        <span className="text-gray-700">{pdf.name}</span>
                        <BiDownload className="text-blue-600" size={20} />
                    </div>
                ))}
                {filteredPDFs.length === 0 && (
                    <div className="p-3 text-center text-gray-500">
                        No manuals found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;