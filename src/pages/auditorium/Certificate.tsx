import React, { useState, useRef } from 'react';
import { Camera, Download, Upload } from 'lucide-react';

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

  const downloadCertificate = () => {
    if (certificateRef.current) {
      // In a real implementation, you'd use html2canvas or similar library
      alert('Download functionality would be implemented with html2canvas library');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Marriage Certificate Template</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={downloadCertificate}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Editing Panel */}
          {isEditing && (
            <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Edit Certificate</h2>
              
              {/* Venue Details */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Venue Details</h3>
                <input
                  type="text"
                  placeholder="Venue Name"
                  value={certificateData.venueName}
                  onChange={(e) => updateField('venueName', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Slogan"
                  value={certificateData.slogan}
                  onChange={(e) => updateField('slogan', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Marriage Place"
                  value={certificateData.marriagePlace}
                  onChange={(e) => updateField('marriagePlace', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Venue Address"
                  value={certificateData.venueAddress}
                  onChange={(e) => updateField('venueAddress', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="date"
                  value={certificateData.marriageDate}
                  onChange={(e) => updateField('marriageDate', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                
                {/* Logo Upload */}
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('logo', e)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Bride Details */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Bride Details</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={certificateData.bride.name}
                  onChange={(e) => updateField('bride.name', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="date"
                  value={certificateData.bride.dateOfBirth}
                  onChange={(e) => updateField('bride.dateOfBirth', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Father's Name"
                  value={certificateData.bride.fatherName}
                  onChange={(e) => updateField('bride.fatherName', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Mother's Name"
                  value={certificateData.bride.motherName}
                  onChange={(e) => updateField('bride.motherName', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                
                {/* Residence */}
                <label className="block text-sm font-medium mb-1">Residence</label>
                {certificateData.bride.residence.map((line, index) => (
                  <input
                    key={index}
                    type="text"
                    value={line}
                    onChange={(e) => updateResidence('bride', index, e.target.value)}
                    className="w-full p-2 border rounded mb-1"
                  />
                ))}
                
                {/* Photo Upload */}
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('bride', e)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Groom Details */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Groom Details</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={certificateData.groom.name}
                  onChange={(e) => updateField('groom.name', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="date"
                  value={certificateData.groom.dateOfBirth}
                  onChange={(e) => updateField('groom.dateOfBirth', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Father's Name"
                  value={certificateData.groom.fatherName}
                  onChange={(e) => updateField('groom.fatherName', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Mother's Name"
                  value={certificateData.groom.motherName}
                  onChange={(e) => updateField('groom.motherName', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                
                {/* Residence */}
                <label className="block text-sm font-medium mb-1">Residence</label>
                {certificateData.groom.residence.map((line, index) => (
                  <input
                    key={index}
                    type="text"
                    value={line}
                    onChange={(e) => updateResidence('groom', index, e.target.value)}
                    className="w-full p-2 border rounded mb-1"
                  />
                ))}
                
                {/* Photo Upload */}
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('groom', e)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Certificate Details */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Certificate Details</h3>
                <input
                  type="date"
                  value={certificateData.issueDate}
                  onChange={(e) => updateField('issueDate', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                
                {/* Signature Upload */}
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Authorized Signature</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('signature', e)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                {/* Seal Upload */}
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Official Seal</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('seal', e)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Certificate Display */}
          <div className={`${isEditing ? 'w-2/3' : 'w-full'} flex justify-center`}>
            <div 
              ref={certificateRef}
              className="bg-gray-200 p-8 shadow-2xl w-full max-w-4xl"
              style={{ aspectRatio: '8.5/11' }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1"></div>
                <div className="text-center flex-1">
                  {certificateData.logo && (
                    <div className="mb-4">
                      <img 
                        src={certificateData.logo} 
                        alt="Logo" 
                        className="w-16 h-16 mx-auto object-contain"
                      />
                    </div>
                  )}
                  <h1 className="text-2xl font-bold text-purple-800 mb-1">{certificateData.venueName}</h1>
                  <h2 className="text-lg text-blue-600 font-semibold">Convention Centre</h2>
                </div>
                <div className="flex-1"></div>
              </div>

              <h3 className="text-center text-xl font-bold mb-8">INTIMATION OF MARRIAGE PERFORMED</h3>

              {/* Marriage Details */}
              <div className="mb-8">
                <div className="flex mb-2">
                  <span className="font-semibold w-32">Date of Marriage :</span>
                  <span>{certificateData.marriageDate}</span>
                </div>
                <div className="flex mb-4">
                  <span className="font-semibold w-32">Place of Marriage :</span>
                  <span>{certificateData.marriagePlace}</span>
                </div>
                <div className="text-center text-sm mb-4">
                  {certificateData.venueAddress}
                </div>
              </div>

              {/* Photos and Details */}
              <div className="flex justify-between mb-8">
                {/* Bride Section */}
                <div className="w-5/12">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-32 h-40 border-2 border-gray-400 mb-2 bg-white flex items-center justify-center">
                      {certificateData.bride.image ? (
                        <img 
                          src={certificateData.bride.image} 
                          alt="Bride" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="text-gray-400" size={32} />
                      )}
                    </div>
                    <div className="text-center text-xs">Bride Details</div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex">
                      <span className="font-semibold w-16">Name:</span>
                      <span>{certificateData.bride.name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-16">Date of Birth:</span>
                      <span>{certificateData.bride.dateOfBirth}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-16">Father's name:</span>
                      <span>{certificateData.bride.fatherName}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-16">Mother's name:</span>
                      <span>{certificateData.bride.motherName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">Residence:</span>
                      {certificateData.bride.residence.map((line, index) => (
                        <span key={index} className="text-xs ml-4">{line}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center Logo */}
                <div className="w-2/12 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-purple-300 bg-purple-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-purple-600">R</span>
                  </div>
                </div>

                {/* Groom Section */}
                <div className="w-5/12">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-32 h-40 border-2 border-gray-400 mb-2 bg-white flex items-center justify-center">
                      {certificateData.groom.image ? (
                        <img 
                          src={certificateData.groom.image} 
                          alt="Groom" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="text-gray-400" size={32} />
                      )}
                    </div>
                    <div className="text-center text-xs">Bride Groom Details</div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex">
                      <span className="font-semibold w-16">{certificateData.groom.name}</span>
                    </div>
                    <div className="flex">
                      <span>{certificateData.groom.dateOfBirth}</span>
                    </div>
                    <div className="flex">
                      <span>{certificateData.groom.fatherName}</span>
                    </div>
                    <div className="flex">
                      <span>{certificateData.groom.motherName}</span>
                    </div>
                    <div className="flex flex-col">
                      {certificateData.groom.residence.map((line, index) => (
                        <span key={index} className="text-xs">{line}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end mt-16">
                <div>
                  <div className="text-sm font-semibold mb-1">DATE OF ISSUE: {certificateData.issueDate}</div>
                  <div className="text-center font-semibold">{certificateData.slogan}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-semibold mb-2">AUTHORIZED SIGN & SEAL</div>
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

              {/* Contact Info */}
              <div className="text-center text-xs mt-4">
                <div>{certificateData.venueAddress}</div>
                <div>Phone: 0471 2618310</div>
                <div>Web: www.rashaj.com E-mail: rashaj1@hotmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarriageCertificateTemplate;