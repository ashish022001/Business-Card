import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Globe, Linkedin, Download, Share2, Phone, MapPin, Calendar } from 'lucide-react';

const BusinessCardDisplay = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get employee data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const data = {
      fullName: urlParams.get('name') || 'John Doe',
      designation: urlParams.get('designation') || 'Software Engineer',
      officialEmail: urlParams.get('email') || 'john.doe@company.com',
      companyWebsite: urlParams.get('website') || 'https://company.com',
      linkedinProfile: urlParams.get('linkedin') || 'https://linkedin.com/in/johndoe'
    };
    
    setEmployeeData(data);
    setLoading(false);
  }, []);

  // Generate vCard for download
  const generateVCard = () => {
    if (!employeeData) return '';
    
    return `BEGIN:VCARD
VERSION:3.0
FN:${employeeData.fullName}
TITLE:${employeeData.designation}
EMAIL:${employeeData.officialEmail}
URL:${employeeData.companyWebsite}
URL;type=LinkedIn:${employeeData.linkedinProfile}
END:VCARD`;
  };

  // Download vCard file
  const downloadVCard = () => {
    if (!employeeData) return;
    
    const vCardData = generateVCard();
    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${employeeData.fullName.replace(/\s+/g, '_')}.vcf`;
    link.click();
  };

  // Share contact
  const shareContact = async () => {
    if (!employeeData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${employeeData.fullName} - Business Card`,
          text: `Contact information for ${employeeData.fullName}, ${employeeData.designation}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Contact URL copied to clipboard!');
    }
  };

  // Save to contacts (mobile only)
  const saveToContacts = () => {
    downloadVCard();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading business card...</div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Business card not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-bounce top-10 left-10"></div>
        <div className="absolute w-1 h-1 bg-purple-300 rounded-full opacity-20 animate-ping top-20 right-20"></div>
        <div className="absolute w-3 h-3 bg-blue-300 rounded-full opacity-15 animate-pulse top-32 left-1/4"></div>
        <div className="absolute w-2 h-2 bg-indigo-300 rounded-full opacity-10 animate-bounce bottom-20 right-10"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-ping bottom-32 left-16"></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto">
        {/* Main Business Card */}
        <div className="bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800 rounded-3xl p-8 shadow-2xl border border-purple-500/20 backdrop-blur-lg transform hover:scale-105 transition-all duration-500 mb-6">
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 blur-xl animate-pulse"></div>
          
          <div className="relative z-10">
            {/* Profile Section */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-all duration-300">
                <User className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                {employeeData.fullName}
              </h1>
              <p className="text-purple-300 font-medium text-lg">{employeeData.designation}</p>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="bg-purple-500/20 p-3 rounded-xl group-hover:bg-purple-500/30 transition-all duration-300">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">Email</p>
                  <a
                    href={`mailto:${employeeData.officialEmail}`}
                    className="text-white font-medium break-all hover:text-purple-300 transition-colors duration-300"
                  >
                    {employeeData.officialEmail}
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="bg-blue-500/20 p-3 rounded-xl group-hover:bg-blue-500/30 transition-all duration-300">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">Website</p>
                  <a
                    href={employeeData.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium break-all hover:text-blue-300 transition-colors duration-300"
                  >
                    {employeeData.companyWebsite}
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group">
                <div className="bg-indigo-500/20 p-3 rounded-xl group-hover:bg-indigo-500/30 transition-all duration-300">
                  <Linkedin className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">LinkedIn</p>
                  <a
                    href={employeeData.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium break-all hover:text-indigo-300 transition-colors duration-300"
                  >
                    {employeeData.linkedinProfile}
                  </a>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center mt-8 space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={saveToContacts}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Save Contact</span>
          </button>

          <button
            onClick={shareContact}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            📱 Tap "Save Contact" to add to your phone's contacts
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardDisplay;