
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

export const addVenueAPI=async(formData:FormData)=>{


  console.log(formData,'kkkkkkkkkkk')
  const response=await api.post('/addvenue',formData)

  return response

}

export const existingAllVenues=async()=>{

  const response=await api.get('/allvenues')

  return response

}

export const updateVenues=async(id:any,data:any)=>{

  const response=await api.put('/updatevenues ',{id,data})

  return response

}


export const userLogin =async (email:string,password:string)=>{

  console.log('heooo')

  

  const response=await api.post('/login',{email,password}, { withCredentials: true })

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
