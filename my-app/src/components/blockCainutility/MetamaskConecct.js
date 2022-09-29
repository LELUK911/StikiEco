import React from 'react';
import { useMoralis } from "react-moralis";
import { Button ,Text} from '@chakra-ui/react';


export default function MetamaskConnect() {

    const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();

    const login = async () => {
      if (!isAuthenticated) {

        await authenticate({signingMessage: "Prepar your NFT to DIE!" })
          .then(function (user) {
            console.log("logged in user:", user);
            console.log(!user.get("ethAddress"));
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }

    const logOut = async () => {
      await logout();
      console.log("logged out");
    }

  return (
    <>
      <Button onClick={login} margin={5}>Connect</Button>
      <Button onClick={logOut} disabled={isAuthenticating} margin={5}>Logout</Button>
    </>
  );
}


