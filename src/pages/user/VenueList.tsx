import React from 'react';
import Header from '../../component/user/Header';
import bgImg from '../../assets/vector.png'
import venue1 from '../../assets/image 11.png'

const VenuePage: React.FC = () => {
  return (
    <section className="min-h-screen bg-[#fff9f4] px-6 py-12">
      {/* Header and Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-8">

             <div
                      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${bgImg})`,
                      }}
                    ></div>
          <Header />

          {/* Content */}
          <div className="relative z-20 w-full max-w-7xl px-6 flex flex-col md:flex-row justify-between items-start gap-10 mt-12">
            {/* Left Content */}
            <div className="text-left md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-serif text-[#5B4336] mb-4">
                Choose
              </h2>
              <h1 className="text-5xl font-bold text-[#5B4336] mb-4">
                Your Venue
              </h1>
              <p className="text-gray-700 mb-6">
                Your wedding venue sets the stage for one of the most memorable
                days of your life. Whether you envision an intimate garden
                ceremony, a grand ballroom reception, or a picturesque
                beachfront wedding, choosing the right venue is the first step
                in bringing your dream to life.
              </p>
              <button className="bg-[#6e3d2b] text-white px-6 py-2 rounded-full shadow-md hover:bg-[#5a2f20]">
                View Details
              </button>
            </div>

            {/* Right Content */}
            <div className="md:w-1/2 flex flex-col gap-4 items-start">
              <div className="flex gap-4 w-full flex-wrap md:flex-nowrap">
                <div className="w-full md:w-1/2">
                  <select className="w-full p-3 rounded shadow-md border">
                    <option>Place</option>
                  </select>
                </div>
                <div className="w-full md:w-1/2">
                  <input
                    type="date"
                    className="w-full p-3 rounded shadow-md border"
                  />
                </div>
              </div>
              <div className="flex gap-4 w-full flex-wrap md:flex-nowrap">
                <div className="w-full md:w-1/2">
                  <select className="w-full p-3 rounded shadow-md border">
                    <option>Event</option>
                  </select>
                </div>
                <button className="bg-[#6e3d2b] text-white px-6 py-3 rounded shadow-md hover:bg-[#5a2f20] w-full md:w-1/2 flex items-center justify-center">
                  Find Venues
                  <span className="ml-2">🔍</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      {/* Venue Result Section */}
      <div className="max-w-7xl mx-auto mt-12">
  <div className="flex flex-col md:flex-row gap-8 items-stretch">
    {/* Image Card */}
    <div className="w-full md:w-1/3 rounded-2xl overflow-hidden shadow-lg relative h-full">
      <img
        src={venue1}
        alt="Venue"
        className="w-full h-full object-cover"
      />
      <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
        Outdoor
      </span>
    </div>

    {/* Venue Details */}
    <div className="w-full md:w-2/3 flex flex-col justify-between">
      {/* Top Info */}
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold text-[#6e3d2b]">Safa Auditorium</h3>
            <p className="text-gray-600 text-sm">Attingal</p>
          </div>
          <button className="bg-[#9c7c5d] text-white text-sm px-4 py-2 rounded shadow hover:bg-[#483b2f]">
            📞 +91 9895580000
          </button>
        </div>

        {/* Pricing Tabs */}
        <div className="mt-4 flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded shadow text-green-700">
            <span className="text-green-600 text-xl">●</span> Veg 1299/- <span className="line-through text-gray-400 text-sm">1600/-</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded shadow text-red-700">
            <span className="text-red-600 text-xl">●</span> Non Veg 1499/- <span className="line-through text-gray-400 text-sm">1800/-</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
            <thead>
              <tr className="bg-[#6e3d2b] text-white text-left">
                <th className="py-2 px-3">Hall Name</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Capacity</th>
                <th className="py-2 px-3">Price</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((_, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-3">AC Hall</td>
                  <td className="py-2 px-3">AC Hall</td>
                  <td className="py-2 px-3">100-150</td>
                  <td className="py-2 px-3">Rs 3,00,000</td>
                  <td className="py-2 px-3">
                    <button className="text-[#6e3d2b] hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="w-full px-4 py-2 border rounded text-[#6e3d2b] hover:bg-[#fceee5]">
          View Details
        </button>
        <button className="w-full px-4 py-2 border rounded text-[#6e3d2b] hover:bg-[#fceee5]">
          Shortlist
        </button>
        <button className="w-full px-4 py-2 border rounded text-[#6e3d2b] hover:bg-[#fceee5]">
          Send Query
        </button>
        <button className="w-full px-4 py-2 border rounded text-[#6e3d2b] hover:bg-[#fceee5]">
          Check Availability
        </button>
      </div>
    </div>
  </div>
</div>

    </section>
  );
};

export default VenuePage;
