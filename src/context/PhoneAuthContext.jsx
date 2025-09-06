import React, { createContext, useContext, useState } from "react";

const PhoneAuthContext = createContext();

export const PhoneAuthProvider = ({ children }) => {
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [idToken, setIdToken] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const verify = (token, phone) => {
    setIsPhoneVerified(true);
    setIdToken(token);
    setPhoneNumber(phone);
  };

  return (
    <PhoneAuthContext.Provider value={{ isPhoneVerified, idToken, phoneNumber, verify }}>
      {children}
    </PhoneAuthContext.Provider>
  );
};

export const usePhoneAuth = () => useContext(PhoneAuthContext);
