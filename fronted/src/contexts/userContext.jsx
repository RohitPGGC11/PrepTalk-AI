import React, { useEffect } from 'react'
import { useState } from 'react';
import { createContext } from 'react';
import api from "../utils/api.js"

export const userContext = createContext();

 const UserProvider =(props)=>{
  const url ="http://localhost:4000";
  const [Token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedTier,   setSelectedTier]   = useState(null);
  const [confirmed,      setConfirmed]      = useState(false);

  useEffect(()=>{
    const checkAuth = async ()=>{
        const storedToken = localStorage.getItem("token");
        if(storedToken){
          setToken(storedToken)
        }else{
          try {
            const response= await api.post("/api/user-login/refresh");
            localStorage.setItem("token", response.data.accessToken);
            setToken(response.data.accessToken);
          } catch (error) {
              setToken(null)
          }
        }
        setLoading(false); // VERY IMPORTANT
    }
    checkAuth();
  },[])


  const contextvalue ={
    url,
    Token,
    setToken,
    selectedDomain,selectedTier,setSelectedDomain,setSelectedTier,confirmed,setConfirmed,loading
  }
      return (
        <userContext.Provider value={contextvalue}>
          {props.children}
        </userContext.Provider>
      )
}

export default UserProvider;
