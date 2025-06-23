import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Search, RefreshCw, Users, Database, Download, ExternalLink } from 'lucide-react';

const QRGeneratorPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  
  // Google Apps Script configuration
  const gasConfig = {
  deploymentUrl: 'https://script.google.com/macros/s/AKfycby3gvhvedfvF1xfQwqRd6gM9X-9bo16buyYC62aJzkJHZ0irfgtVmevU-Ag62O7z3KF/exec'
};


  // Sample data for demonstration
  const sampleEmployees = [
    {
      id: 1,
      fullName: 'John Doe',
      designation: 'Senior Software Engineer',
      officialEmail: 'john.doe@company.com',
      companyWebsite: 'https://company.com',
      linkedinProfile: 'https://linkedin.com/in/johndoe'
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      designation: 'Product Manager',
      officialEmail: 'jane.smith@company.com',
      companyWebsite: 'https://company.com',
      linkedinProfile: 'https://linkedin.com/in/janesmith'
    },
    {
      id: 3,
      fullName: 'Mike Johnson',
      designation: 'UX Designer',
      officialEmail: 'mike.johnson@company.com',
      companyWebsite: 'https://company.com',
      linkedinProfile: 'https://linkedin.com/in/mikejohnson'
    },
    {
      id: 4,
      fullName: 'Sarah Wilson',
      designation: 'Marketing Director',
      officialEmail: 'sarah.wilson@company.com',
      companyWebsite: 'https://company.com',
      linkedinProfile: 'https://linkedin.com/in/sarahwilson'
    }
  ];

  // Initialize by fetching data from Google Apps Script
  useEffect(() => {
    fetchFromGoogleAppsScript();
  }, []);

  // Function to fetch data from Google Apps Script
  const fetchFromGoogleAppsScript = async () => {
    setLoading(true);
    setError('');

    try {
     const response = await fetch(gasConfig.deploymentUrl, {
  method: 'GET'
});


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.success && data.employees && Array.isArray(data.employees)) {
        const employeeData = data.employees.map((emp, index) => ({
          id: index + 1,
          fullName: emp.fullName || '',
          designation: emp.designation || '',
          officialEmail: emp.officialEmail || '',
          companyWebsite: emp.companyWebsite || '',
          linkedinProfile: emp.linkedinProfile || ''
        }));

        setEmployees(employeeData);
        setError('');
        console.log(`Successfully loaded ${employeeData.length} employees from Google Apps Script`);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Invalid data format received from Google Apps Script');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Error fetching data: ${err.message}`);
      // Fall back to sample data if fetch fails
      setEmployees(sampleEmployees);
    } finally {
      setLoading(false);
    }
  };

  // Generate vCard format for QR code
  const generateVCard = (employee) => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${employee.fullName}
TITLE:${employee.designation}
EMAIL:${employee.officialEmail}
URL:${employee.companyWebsite}
URL;type=LinkedIn:${employee.linkedinProfile}
END:VCARD`;
  };

  // Generate URL for business card page
  const generateBusinessCardUrl = (employee) => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      name: employee.fullName,
      designation: employee.designation,
      email: employee.officialEmail,
      website: employee.companyWebsite,
      linkedin: employee.linkedinProfile
    });
    return `${baseUrl}/business-card?${params.toString()}`;
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Download QR code as image
  const downloadQR = (employee) => {
    const canvas = document.getElementById(`qr-${employee.id}`);
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${employee.fullName.replace(/\s+/g, '_')}_QR.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Download all QR codes
  const downloadAllQRs = () => {
    filteredEmployees.forEach((employee, index) => {
      setTimeout(() => {
        downloadQR(employee);
      }, index * 500); // Delay to avoid browser blocking
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
            QR Code Generator
          </h1>
          <p className="text-gray-300">Generate QR codes for employee business cards</p>
          
          {loading && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-purple-300">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading employee data...</span>
            </div>
          )}
          
          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm max-w-md mx-auto">
              {error}
            </div>
          )}
          
          {!loading && !error && (
            <div className="mt-4 text-sm text-gray-300 flex items-center justify-center">
              <Users className="w-4 h-4 mr-1" />
              {employees.length} employees loaded
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employees..."
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* QR Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-105"
            >
              {/* Employee Info */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-1">{employee.fullName}</h3>
                <p className="text-purple-300 text-sm">{employee.designation}</p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-xl mb-4 flex justify-center">
                <QRCodeCanvas
                  id={`qr-${employee.id}`}
                  value={generateBusinessCardUrl(employee)}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#1a1a2e"
                  level="M"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => downloadQR(employee)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No employees found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGeneratorPage;