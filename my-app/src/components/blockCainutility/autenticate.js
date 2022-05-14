import React from 'react'
import { useMoralis } from 'react-moralis';

export default function Autenticate() {
    const { authenticate, isAuthenticated, user } = useMoralis();

    if (!isAuthenticated) {
      return (
        <div>
          <button onClick={() => authenticate({ provider: "walletconnect" })}>Authenticate</button>
        </div>
      );
    }
  
    return (
      <div>
        <h1>Hi {user.get("username")}</h1>
      </div>
    );
  };

