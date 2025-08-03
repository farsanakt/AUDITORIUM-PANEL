
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

}


export const existingAllVenues = async (id: string) => {

  const response = await api.get(`/allvenues`, {

    params: { audiUserId: id },

  })

  return response
}


export const existingBookings=async(id:string)=>{

  const response=await api.get(`/audibookings/${id}`)

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

export const createBooking=async(formData:any)=>{

  console.log('i am reaching',formData)

  const response =await api.post('/bookings',formData)

  console.log('form data,',formData)

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


export const existingVenues=async()=>{

  const response=await api.get('/venues')

  return response

}

export const deleteVenueAPI=async(id:string)=>{

  const response=await api.delete(`/deletevenue/${id}`)

  return response
}
