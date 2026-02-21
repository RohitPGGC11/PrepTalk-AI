import React from 'react'
import { useState } from 'react';
import { createContext } from 'react';

export const userContext = createContext();

 const UserProvider =(props)=>{
  const url ="http://localhost:4000";
  const [Token, setToken] = useState('')
  const contextvalue ={
    url,
    Token,
    setToken
  }
      return (
        <userContext.Provider value={contextvalue}>
          {props.children}
        </userContext.Provider>
      )
}

export default UserProvider;
