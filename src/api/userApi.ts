
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



}

export const createVendorReview=async(data:any)=>{



}


export const verifyPswrd=async(id:string,password:string)=>{

  const response=await api.post(`/verify-password/${id}`,{password})

  return response

}

export const updateVenues=async(id:any,data:any)=>{

  const response=await api.put('/updatevenues ',{id,data})

  return response

}

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


export const findAuditoriumById=async(id:string)=>{

  return await api.get(`/findauditorium/${id}`)

}

export const updateAuditoriumProfile=async(data:any)=>{

}

export const verifyPasswordAndChangeEmail=async(pass:string,email:string)=>{

}
