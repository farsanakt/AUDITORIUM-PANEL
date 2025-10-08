
import  instance  from './axiosInstance';
// const API_URL = import.meta.env.VITE_USER_API_URL



const api=instance



export const singUpRequest = async (formData: any) => {
   
  try {
    const response = await api.post('/signup', formData)

    return response

  } catch (error: any) {

    return error.response
    
  }
};

export const AuditoriumLogin =async (email:string,password:string)=>{

  console.log('heooo')

  

  const response=await api.post('/login',{email,password}, { withCredentials: true })

  return response

}


export const addVenueAPI=async(formData:FormData)=>{


  console.log(formData,'kkkkkkkkkkk')
  const response=await api.post('/addvenue',formData)

  return response

}

export const checkUserExists=async(email:string)=>{

  console.log('reached api',email)

  const response=await api.post('/userexist',{email})

  return response

}


export const existingAllVenues = async (id: string) => {

  const response = await api.get(`/allvenues`, {

    params: { audiUserId: id },

  })

  return response
}



export const userDetails = async (email: string) => {
  const response = await api.get('/userDetails', {
    params: { email },
  });

  return response;
};

export const existingBookings=async(id:string)=>{

  const response=await api.get(`/audibookings/${id}`)

  return response

}

export const fetchAuditoriumUserdetails=async(id:string)=>{

  
  const response=await api.get(`/auditoriumUserdetatils/${id}`)
  
  return response

}

export const createVendorInquiry=async(data:any)=>{

    return await api.post('/vendorenquiry',data)

}

export const createVendorReview=async(data:any)=>{



}


export const verifyPswrd=async(id:string,password:string)=>{

  const response=await api.post(`/verify-password/${id}`,{password})

  return response

}

export const updateVenues = async (formData: any, id: string) => {
  const response = await api.put(`/updatevenues/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};


export const FindAuidtorium = async (event: string, place: string) => {
  const response = await api.get('/findauditorium', {
    params: {
      event,
      place
    }
  });
  return response.data;
};


export const FetchAuditoriumById = async (id: string) => {
  const response = await api.get(`/findvenues/${id}`);
  return response;
};

export const singleVenueDetails=async(id:string)=>{
  console.log('call',id)

  const response=await api.get(`/findVenueDetails/${id}`)

  return response

}

export const upComingEvents=async(id:string)=>{

  const response=await api.get(`/upcomigevents/${id}`)

  return response

}

//  acceptAuditorium, rejectAuditorium

export const getAllAuditoriums=async()=>{
  
  return await api.get('/allaudilist')

}

export const acceptAuditorium=async(id:string)=>{
  
  return await api.post(`/acceptauditorium/${id}`)

}

export const acceptVendor=async(id:string)=>{
  
  return await api.post(`/acceptvendor/${id}`)

}

export const activateVoucher=async(id:string)=>{
  
  return await api.post(`/acceptvoucher/${id}`)

}


export const deactivateVoucher=async(id:string)=>{
  
  return await api.post(`/rejectvoucher/${id}`)

}

export const rejectVendor=async(id:string)=>{

  return await api.post(`/rejectvendor/${id}`)

}



export const rejectAuditorium=async(id:string)=>{
 
  return await api.post(`/rejectauditorium/${id}`)
 
}


export const findCount=async()=>{

  return await api.get('/findcount')

}

 


export const fetchAllStaff=async()=>{
return await api.get('/allstaff')
}

export const addStaff=async(data:any)=>{

   return await api.post('/addstaff',data)

}

export const fetchAllExistingOffer=async()=>{

  return await api.get('/fetchalloffers')

}


export const fetchAllExistingVouchers=async()=>{

  return await api.get('/fetchallvouchers')

}

export const updateStaff=async(staffid:string,data:any)=>{

 return await api.put(`/updatestaff/${staffid}`,data)

 console.log(data)

}

export const fetchAllUsers=async()=>{

  return await api.get('/allusers')

}

export const fetchAllVendorUsers=async()=>{

  return await api.get('/allvendorusers')

}





export const deleteStaff=async(id:string)=>{

return await api.delete(`/deletestaff/${id}`)

}


// user api
export const userLogin =async (email:string,password:string)=>{

  const response=await api.post('/signin',{email,password}, { withCredentials: true })

  return response

}

export const venodrLogin=async(email:string,password:string)=>{

  const response=await api.post('/vendorsignin',{email,password}, { withCredentials: true })

  return response

}

export const addVendorAPI=async(formData:FormData)=>{

  return await api.post('/addvendor',formData)

}

export const existingAllVendors =async(id:string)=>{

  return await api.get(`/allVendorss`, {

    params: { vndrUserId: id },

  })

}



export const createBooking=async(formData:any)=>{

  console.log('i am reaching',formData)

  const response =await api.post('/bookings',formData)

  console.log('form data,',formData)

  return response

}

export const createVendorBooking=async(formData:any)=>{

  console.log('i am reaching',formData)

  const response =await api.post('/vendorbookings',formData)

  console.log('form data,',formData)

  return response

}

export const fetchExistingVendorBookings=async(id:string)=>{

  const response=await api.get(`/existingVendorBookings/${id}`)

  return response

}

export const existingBkngs=async(id:string)=>{

  const response=await api.get(`/existingBookings/${id}`)

  return response

}



export const createOffer=async(data:any)=>{

   const response=await api.post('/createoffer',data)

   return response

}

export const createVoucher=async(data:any)=>{
  return await api.post('/createvoucher',data)
}

export const fetchEnquiries=async(id:string)=>{

  return await api.get('/fetchenquiries',{params:{id}})

}

export const updateOffer = async (id: string, data: any) => {
  const response = await api.put(`/offers/${id}`, data);
  return response.data;
};

export const updateVoucher=async(id:string,data:any)=>{

  return await api.put(`/updatevoucher/${id}`,data)

}

export const deleteVoucher=async(id:string)=>{
  return await api.delete(`/delete/${id}`)
}

export const deleteOffer = async (id: string) => {
  const response = await api.delete(`/offers/${id}`);
  return response.data;
};
export const fetchOffers = async (id: string) => {
  return await api.get(`/fetchoffers/${id}`);
}

export const fetchVouchers=async(id:string)=>{
  console.log(id,'jopppeee')
  return await api.get(`/fetchvoucher/${id}`)
}

export const fetchUserBookingsByEmail=async(email:string)=>{

  const response=await api.get('/userexistingbooking',{params:{email}})

  return response

}

export const currentVendorUserData=async(id:string)=>{

  return await api.get('/currentvendorUser',{params:{id}})

}


export const userSingUpRequest=async(formData:any)=>{

  console.log('apiii',formData)

  try {

      const response = await api.post('/registration', formData)

    return response
    
  } catch (error:any) {
    
    return error.response

  }

}

export const vendorSingUpRequest=async(formData:any)=>{

  const response=await api.post('/vendorregistration',formData)

  return response

}


export const existingVenues=async()=>{

  const response=await api.get('/venues')

  return response

}

export const deleteVenueAPI=async(id:string)=>{

  const response=await api.delete(`/deletevenue/${id}`)

  return response
}


export const fetchAllVendors=async()=>{

  const response=await api.get('/allvendors')

  return response

}

export const singleVendorDetails=async(id:string)=>{

  const response=await api.get(`/singlevendor/${id}`)

  return response

}

export const submitBrideGroomDetails=async(formData:FormData)=>{



  const response = await api.post('/bride-groom-details', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  return response

}


export const findAuditoriumById=async(id:string)=>{

  return await api.get(`/findauditorium/${id}`)

}

export const updateAuditoriumProfile=async(data:any)=>{

}

export const verifyPasswordAndChangeEmail=async(pass:string,email:string)=>{

}


//################# Admin ############

export const addAdminStaff=async(formdata:any)=>{

  return await api.post('/addadminstaff',formdata)

}


export const fetchAllAdminStaff=async()=>{

  return await api.get('/fetchadminstaff')

}
