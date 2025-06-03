
import Header from '../../component/user/Header'
import image from '../../assets/image1.png'
import { useNavigate } from 'react-router-dom';



const AuditoriumDetails = () => {
  const navigate=useNavigate()

  const handleBooking=()=>{
    navigate('/user/bookings')

  }
  return (
    <div className='bg-[#FDF8F1] min-h-screen'>
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Headline - Left Aligned */}
        <div className="mb-4">
          <h1 className="text-4xl text-left font-bold text-[#9c7c5d]">Safa Auditorium</h1>
        </div>

        {/* Location - Left Aligned */}
        <div className="flex items-center mb-6">
          <svg className="w-5 h-5 text-[#9c7c5d] mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-600">MG Road, Kochi, Kerala 682016</span>
        </div>

        {/* Image Card - Left Aligned */}
            <div className="mb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl">
          <img 
            src={image} 
            alt="Safa Auditorium"
            className="w-full h-[450px] object-cover"
          />
        </div>
      </div>


        {/* About Venue (Left) and Go to Booking Button (Right) */}
        <div className="flex justify-between items-start mb-8 ">
          <div className="flex-1 pr-8 mt-9"> 
            <h3 className="text-xl font-semibold text-left text-[#9c7c5d] mt-10 mb-3">About Venue</h3>
            <p className="text-gray-600 text-left leading-relaxed">
              Safa Auditorium is a premier event venue located in the heart of Kochi, Kerala. 
              With its elegant architecture and modern amenities, it provides the perfect setting 
              for weddings, corporate events, conferences, and special celebrations. The venue 
              offers exceptional service and creates memorable experiences for all occasions.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button onClick={handleBooking} className="bg-[#9c7c5d] hover:bg-[#d85c4e] mt-15 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center space-x-2">
              <span>Go to Booking</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contact - Left Aligned */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-left mt-20  text-[#9c7c5d] mb-4">Contact</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[#9c7c5d] mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-gray-600">+91 9876543210</span>
            </div>
            {/* <div className="flex items-center">
              <svg className="w-5 h-5 text-orange-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-gray-600">info@safaauditorium.com</span>
            </div> */}
          </div>
        </div>

           <div className="bg-[#fef9f5] p-0 rounded-md w-fit">
      <p className="text-sm text-gray-500 mb-3 text-left">Price per plate</p>
      <div className="flex gap-4">
        {/* Veg Option */}
        <div className="flex items-center gap-2 border border-[#b09d94] rounded-md px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-green-500 inline-block"></span>
          <span className="text-sm font-medium">Veg</span>
          <span className="font-bold text-lg">1299/-</span>
          <span className="text-gray-400 line-through ml-1 text-sm">1600/-</span>
        </div>

        {/* Non Veg Option */}
        <div className="flex items-center gap-2 border border-[#b09d94] rounded-md px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500 inline-block"></span>
          <span className="text-sm font-medium">Non Veg</span>
          <span className="font-bold text-lg">1499/-</span>
          <span className="text-gray-400 line-through ml-1 text-sm">1800/-</span>
        </div>
      </div>
    </div>

        {/* Table - Hall Details */}
              <div className="mb-8">
        <div className="bg-white rounded-lg mt-20 border border-[#b09d94] shadow-sm overflow-hidden">
          <table className="w-full border border-[#b09d94]">
            <thead className="bg-[#9c7c5d]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 border border-[#b09d94]">Hall Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 border border-[#b09d94]">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 border border-[#b09d94]">Capacity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 border border-[#b09d94]">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800 font-medium border border-[#b09d94]">Main Hall</td>
                <td className="px-6 py-4 text-gray-600 border border-[#b09d94]">Banquet Hall</td>
                <td className="px-6 py-4 text-gray-600 border border-[#b09d94]">500 Guests</td>
                <td className="px-6 py-4 text-gray-600 border border-[#b09d94]">₹25,000</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800 font-medium border border-[#b09d94]">Conference Room</td>
                <td className="px-6 py-4 text-gray-600 border border-[#b09d94]">Meeting Room</td>
                <td className="px-6 py-4 text-gray-600 border border-[#b09d94]">50 Guests</td>
                <td className="px-6 py-4 text-gray-600 border border-[#b09d94]">₹5,000</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800 font-medium border border-[#b09d94]">VIP Hall</td>
                <td className="px-6 py-4 text-gray-600 border border-[#b09d94]">Premium Hall</td>
                <td className="px-6 py-4 text-gray-600 border border-[#b09d94]">200 Guests</td>
                <td className="px-6 py-4 text-gray-600 border border-[#b09d94]">₹15,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


        {/* Service Cards Grid */}
              <div className="bg-white border mt-20 border-gray-200 rounded-xl shadow-sm p-6 md:p-8 text-gray-800 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            
            {/* Timing Slot */}
          <div className="text-left">
          <h4 className="font-semibold text-lg mb-2">Timing Slot</h4>
          <p className="mb-1">Morning : <span className="font-semibold">NA</span></p>
          <p className="mb-1">Evening : <span className="font-semibold">NA</span></p>
          <p className="mb-1">Closing time : <span className="font-semibold">NA</span></p>
        </div>


            {/* Lodging */}
            <div>
              <h4 className="font-semibold text-lg mb-2 text-left">Lodging</h4>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Rooms Available</li>
                <li>Number of rooms: <span className="font-semibold text-left">180</span></li>
                <li>Average price: <span className="font-semibold text-left">7900/-</span></li>
              </ul>
            </div>

            {/* Changing Rooms */}
            <div>
              <h4 className="font-semibold text-lg mb-2 text-left">Changing Rooms</h4>
              <ul className="list-disc list-inside space-y-1  text-left">
                <li>Changing Rooms Available</li>
                <li>AC Rooms available</li>
                <li>No. of rooms: <span className="font-semibold">2</span></li>
              </ul>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-semibold text-lg mb-2 text-left">Amenities</h4>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li><span className="text-gray-500">Parking:</span> <span className="text-gray-800 font-semibold">Available</span></li>
                <li>Halls are Air Conditioned</li>
              </ul>
            </div>

            {/* Decoration */}
            <div>
              <h4 className="font-semibold text-lg mb-2 text-left">Decoration</h4>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Outside decoration allowed</li>
                <li>Decor provided by the venue</li>
              </ul>
            </div>

          </div>
        </div>


        {/* Location Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-left text-[#9c7c5d] mt-20  mb-6">Location</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-[#9c7c5d] mb-4 text-left">Address Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-800">Safa Auditorium</p>
                      <p className="text-gray-600">MG Road, Kochi, Kerala 682016</p>
                      <p className="text-gray-600">Near Metro Station</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">Easily accessible by public transport</p>
                  </div>
                </div>
              </div>
              
              {/* Map placeholder */}
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-500 font-medium">View on Map</p>
                  <p className="text-sm text-gray-400">Click to open location</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AuditoriumDetails;