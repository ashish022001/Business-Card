import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Search, RefreshCw, Users, Database, Download, ExternalLink } from 'lucide-react';

const QRGeneratorPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  
  // Google Sheets configuration
  const [sheetConfig, setSheetConfig] = useState({
    spreadsheetId: '',
    apiKey: '',
    range: 'Sheet1!A:E' // Adjust range as needed
  });

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

  // Initialize with sample data
  useEffect(() => {
    setEmployees(sampleEmployees);
  }, []);

  // Function to fetch data from Google Sheets
  const fetchFromGoogleSheets = async () => {
    if (!sheetConfig.spreadsheetId || !sheetConfig.apiKey) {
      setError('Please provide both Spreadsheet ID and API Key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetConfig.spreadsheetId}/values/${sheetConfig.range}?key=${sheetConfig.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.values && data.values.length > 1) {
        // Skip header row and map data
        const employeeData = data.values.slice(1).map((row, index) => ({
          id: index + 1,
          fullName: row[0] || '',
          designation: row[1] || '',
          officialEmail: row[2] || '',
          companyWebsite: row[3] || '',
          linkedinProfile: row[4] || ''
        }));

        setEmployees(employeeData);
      } else {
        setError('No data found in the specified range');
      }
    } catch (err) {
      setError(`Error fetching data: ${err.message}`);
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
    const link = document.createElement('a');
    link.download = `${employee.fullName.replace(/\s+/g, '_')}_QR.png`;
    link.href = canvas.toDataURL();
    link.click();
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
          <p className="text-gray-300">Generate QR codes for employee business cards from Google Sheets</p>
        </div>

        {/* Google Sheets Configuration */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Google Sheets Configuration
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Spreadsheet ID
              </label>
              <input
                type="text"
                value={sheetConfig.spreadsheetId}
                onChange={(e) => setSheetConfig({...sheetConfig, spreadsheetId: e.target.value})}
                placeholder="Enter Google Sheets ID"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                API Key
              </label>
              <input
                type="text"
                value={sheetConfig.apiKey}
                onChange={(e) => setSheetConfig({...sheetConfig, apiKey: e.target.value})}
                placeholder="Enter Google API Key"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={fetchFromGoogleSheets}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Fetch Data</span>
                </>
              )}
            </button>

            <button
              onClick={downloadAllQRs}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download All QRs</span>
            </button>

            <div className="text-sm text-gray-300 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {employees.length} employees loaded
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="mt-4 text-xs text-gray-400">
            <p><strong>Sheet Format:</strong> Column A: Full Name, B: Designation, C: Email, D: Website, E: LinkedIn</p>
            <p><strong>Note:</strong> Currently showing sample data. Configure Google Sheets to load real data.</p>
          </div>
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

                <a
                  href={generateBusinessCardUrl(employee)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Preview Card</span>
                </a>
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