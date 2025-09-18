import React, { useState, useRef } from 'react';
import { Camera, Download, Upload } from 'lucide-react';
import Swal from 'sweetalert2';

interface CertificateData {
  marriageDate: string;
  marriagePlace: string;
  venueAddress: string;
  bride: {
    name: string;
    dateOfBirth: string;
    fatherName: string;
    motherName: string;
    residence: string[];
    image: string;
  };
  groom: {
    name: string;
    dateOfBirth: string;
    fatherName: string;
    motherName: string;
    residence: string[];
    image: string;
  };
  issueDate: string;
  authorizedSignature: string;
  seal: string;
  logo: string;
  venueName: string;
  slogan: string;
}

const MarriageCertificateTemplate: React.FC = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [certificateData, setCertificateData] = useState<CertificateData>({
    marriageDate: '7/10/2024',
    marriagePlace: 'Rashaj Royale Convention Centre',
    venueAddress: 'Chempakamangalam Jn, Thonnakkal, Korani P.O, Thiruvananthapuram',
    bride: {
      name: 'THANSI A S',
      dateOfBirth: '04/12/1997',
      fatherName: 'ABDUL KALAM',
      motherName: 'SAJEENA',
      residence: [
        'THAHANI MANZIL',
        'GHS JUNCTION',
        'ATTINGAL P O',
        'PIN 695101',
        'THIRUVANANTHAPURAM',
        'KERALA, INDIA'
      ],
      image: ''
    },
    groom: {
      name: 'SHAHINSHA SUNAISA',
      dateOfBirth: '28/12/1995',
      fatherName: 'MUHAMMED SHEREEF',
      motherName: 'SUNAISA',
      residence: [
        'CHITHIRA HOUSE',
        'VATTATHRAMALA',
        'VAYYANAM P O',
        'AYOOR, PIN 691533',
        'KOLLAM',
        'KERALA, INDIA'
      ],
      image: ''
    },
    issueDate: '17/10/2024',
    authorizedSignature: '',
    seal: '',
    logo: '',
    venueName: 'Rashaj Royale',
    slogan: 'Making the Events Royale'
  });

  const certificateRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (
    type: 'bride' | 'groom' | 'signature' | 'seal' | 'logo',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'bride') {
          setCertificateData(prev => ({
            ...prev,
            bride: { ...prev.bride, image: result }
          }));
        } else if (type === 'groom') {
          setCertificateData(prev => ({
            ...prev,
            groom: { ...prev.groom, image: result }
          }));
        } else if (type === 'signature') {
          setCertificateData(prev => ({
            ...prev,
            authorizedSignature: result
          }));
        } else if (type === 'seal') {
          setCertificateData(prev => ({
            ...prev,
            seal: result
          }));
        } else if (type === 'logo') {
          setCertificateData(prev => ({
            ...prev,
            logo: result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = (field: string, value: any) => {
    setCertificateData(prev => {
      const keys = field.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const updateResidence = (person: 'bride' | 'groom', index: number, value: string) => {
    setCertificateData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        residence: prev[person].residence.map((line, i) => i === index ? value : line)
      }
    }));
  };

  const downloadCertificate = async () => {
    if (certificateRef.current) {
      await Swal.fire({
        title: 'Download Certificate',
        text: 'This feature would download the certificate using html2canvas.',
        icon: 'info',
        confirmButtonColor: '#ED695A',
        confirmButtonText: 'OK',
        buttonsStyling: true,
        customClass: {
          popup: 'rounded-xl',
          title: 'text-[#78533F] text-lg font-bold',
          htmlContainer: 'text-gray-600 text-sm',
          confirmButton: 'px-4 py-2 rounded-full text-white font-semibold'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#78533F] mb-4 sm:mb-0">Marriage Certificate Template</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-[#78533F] text-white rounded-full font-semibold hover:bg-[#634331] transition"
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={downloadCertificate}
              className="px-4 py-2 bg-[#ED695A] text-white rounded-full font-semibold hover:bg-[#f09c87ce] transition flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Editing Panel */}
          {isEditing && (
            <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg p-4 sm:p-6 max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold text-[#78533F] mb-4">Edit Certificate</h2>
              
              {/* Venue Details */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#78533F] mb-2">Venue Details</h3>
                <input
                  type="text"
                  placeholder="Venue Name"
                  value={certificateData.venueName}
                  onChange={(e) => updateField('venueName', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                <input
                  type="text"
                  placeholder="Slogan"
                  value={certificateData.slogan}
                  onChange={(e) => updateField('slogan', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                <input
                  type="text"
                  placeholder="Marriage Place"
                  value={certificateData.marriagePlace}
                  onChange={(e) => updateField('marriagePlace', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                <input
                  type="text"
                  placeholder="Venue Address"
                  value={certificateData.venueAddress}
                  onChange={(e) => updateField('venueAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                <input
                  type="date"
                  value={certificateData.marriageDate}
                  onChange={(e) => updateField('marriageDate', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                
                {/* Logo Upload */}
                <div className="mb-2">
                  <label className="block text-sm font-semibold text-[#78533F] mb-1 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#78533F]" />
                    Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('logo', e)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm"
                  />
                </div>
              </div>

              {/* Bride Details */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#78533F] mb-2">Bride Details</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={certificateData.bride.name}
                  onChange={(e) => updateField('bride.name', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                <input
                  type="date"
                  value={certificateData.bride.dateOfBirth}
                  onChange={(e) => updateField('bride.dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                <input
                  type="text"
                  placeholder="Father's Name"
                  value={certificateData.bride.fatherName}
                  onChange={(e) => updateField('bride.fatherName', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                <input
                  type="text"
                  placeholder="Mother's Name"
                  value={certificateData.bride.motherName}
                  onChange={(e) => updateField('bride.motherName', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                
                {/* Residence */}
                <label className="block text-sm font-semibold text-[#78533F] mb-1">Residence</label>
                {certificateData.bride.residence.map((line, index) => (
                  <input
                    key={index}
                    type="text"
                    value={line}
                    onChange={(e) => updateResidence('bride', index, e.target.value)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-1"
                  />
                ))}
                
                {/* Photo Upload */}
                <div className="mb-2">
                  <label className="block text-sm font-semibold text-[#78533F] mb-1 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#78533F]" />
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('bride', e)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm"
                  />
                </div>
              </div>

              {/* Groom Details */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#78533F] mb-2">Groom Details</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={certificateData.groom.name}
                  onChange={(e) => updateField('groom.name', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                <input
                  type="date"
                  value={certificateData.groom.dateOfBirth}
                  onChange={(e) => updateField('groom.dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                <input
                  type="text"
                  placeholder="Father's Name"
                  value={certificateData.groom.fatherName}
                  onChange={(e) => updateField('groom.fatherName', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                <input
                  type="text"
                  placeholder="Mother's Name"
                  value={certificateData.groom.motherName}
                  onChange={(e) => updateField('groom.motherName', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                
                {/* Residence */}
                <label className="block text-sm font-semibold text-[#78533F] mb-1">Residence</label>
                {certificateData.groom.residence.map((line, index) => (
                  <input
                    key={index}
                    type="text"
                    value={line}
                    onChange={(e) => updateResidence('groom', index, e.target.value)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-1"
                  />
                ))}
                
                {/* Photo Upload */}
                <div className="mb-2">
                  <label className="block text-sm font-semibold text-[#78533F] mb-1 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#78533F]" />
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('groom', e)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm"
                  />
                </div>
              </div>

              {/* Certificate Details */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#78533F] mb-2">Certificate Details</h3>
                <input
                  type="date"
                  value={certificateData.issueDate}
                  onChange={(e) => updateField('issueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent mb-2"
                />
                
                {/* Signature Upload */}
                <div className="mb-2">
                  <label className="block text-sm font-semibold text-[#78533F] mb-1 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#78533F]" />
                    Authorized Signature
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('signature', e)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm"
                  />
                </div>
                
                {/* Seal Upload */}
                <div className="mb-2">
                  <label className="block text-sm font-semibold text-[#78533F] mb-1 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#78533F]" />
                    Official Seal
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('seal', e)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Certificate Display */}
          <div className={`${isEditing ? 'w-full lg:w-2/3' : 'w-full'} flex justify-center`}>
            <div 
              ref={certificateRef}
              className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-4xl"
              style={{ aspectRatio: '8.5/11' }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex-1">
                  {certificateData.logo && (
                    <img 
                      src={certificateData.logo} 
                      alt="Logo" 
                      className="w-16 h-16 object-contain"
                    />
                  )}
                </div>
                <div className="text-center flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#78533F] mb-1">{certificateData.venueName}</h1>
                  <h2 className="text-lg font-semibold text-[#ED695A]">Convention Centre</h2>
                </div>
                <div className="flex-1 text-right text-xs text-gray-600">
                  <div>{certificateData.venueAddress}</div>
                  <div>Phone: 0471 2618310</div>
                  <div>Web: www.rashaj.com</div>
                  <div>E-mail: rashaj1@hotmail.com</div>
                </div>
              </div>

              <h3 className="text-center text-xl sm:text-2xl font-bold text-[#78533F] mb-8">INTIMATION OF MARRIAGE PERFORMED</h3>

              {/* Marriage Details */}
              <div className="mb-8 text-sm text-gray-600">
                <div className="flex mb-2">
                  <span className="font-semibold w-32 text-[#78533F]">Date of Marriage:</span>
                  <span>{certificateData.marriageDate}</span>
                </div>
                <div className="flex mb-4">
                  <span className="font-semibold w-32 text-[#78533F]">Place of Marriage:</span>
                  <span>{certificateData.marriagePlace}</span>
                </div>
                <div className="text-center">{certificateData.venueAddress}</div>
              </div>

              {/* Photos and Details */}
              <div className="flex justify-between mb-8">
                {/* Bride Section */}
                <div className="w-5/12">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-32 h-40 border-2 border-[#b09d94] rounded-lg bg-white flex items-center justify-center">
                      {certificateData.bride.image ? (
                        <img 
                          src={certificateData.bride.image} 
                          alt="Bride" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Camera className="text-[#78533F] opacity-50" size={32} />
                      )}
                    </div>
                    <div className="text-center text-xs text-[#78533F] font-semibold">Bride Details</div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex">
                      <span className="font-semibold w-24 text-[#78533F]">Name:</span>
                      <span>{certificateData.bride.name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-24 text-[#78533F]">Date of Birth:</span>
                      <span>{certificateData.bride.dateOfBirth}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-24 text-[#78533F]">Father's Name:</span>
                      <span>{certificateData.bride.fatherName}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-24 text-[#78533F]">Mother's Name:</span>
                      <span>{certificateData.bride.motherName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#78533F]">Residence:</span>
                      {certificateData.bride.residence.map((line, index) => (
                        <span key={index} className="text-xs ml-4">{line}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center Logo */}
                <div className="w-2/12 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-[#ED695A]/20 bg-[#ED695A]/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#ED695A]">R</span>
                  </div>
                </div>

                {/* Groom Section */}
                <div className="w-5/12">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-32 h-40 border-2 border-[#b09d94] rounded-lg bg-white flex items-center justify-center">
                      {certificateData.groom.image ? (
                        <img 
                          src={certificateData.groom.image} 
                          alt="Groom" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Camera className="text-[#78533F] opacity-50" size={32} />
                      )}
                    </div>
                    <div className="text-center text-xs text-[#78533F] font-semibold">Groom Details</div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex">
                      <span className="font-semibold w-24 text-[#78533F]">Name:</span>
                      <span>{certificateData.groom.name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-24 text-[#78533F]">Date of Birth:</span>
                      <span>{certificateData.groom.dateOfBirth}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-24 text-[#78533F]">Father's Name:</span>
                      <span>{certificateData.groom.fatherName}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-24 text-[#78533F]">Mother's Name:</span>
                      <span>{certificateData.groom.motherName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#78533F]">Residence:</span>
                      {certificateData.groom.residence.map((line, index) => (
                        <span key={index} className="text-xs ml-4">{line}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end mt-12 sm:mt-16">
                <div className="text-sm text-gray-600">
                  <div className="font-semibold text-[#78533F] mb-1">DATE OF ISSUE: {certificateData.issueDate}</div>
                  <div className="font-semibold text-[#ED695A]">{certificateData.slogan}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-semibold text-[#78533F] mb-2">AUTHORIZED SIGN & SEAL</div>
                  <div className="flex items-center gap-4">
                    {certificateData.authorizedSignature && (
                      <img 
                        src={certificateData.authorizedSignature} 
                        alt="Signature" 
                        className="w-24 h-12 object-contain"
                      />
                    )}
                    {certificateData.seal && (
                      <img 
                        src={certificateData.seal} 
                        alt="Seal" 
                        className="w-16 h-16 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarriageCertificateTemplate;