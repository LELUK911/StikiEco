import React from 'react'
import { useMoralis,useWeb3ExecuteFunction } from 'react-moralis'
import Stk from '../../contract/stikiToken.json' 

export default async function BalanceSTK() {
    const executeInstance = useWeb3ExecuteFunction();
    const {account} = useMoralis();
  

    let option = {
      abi: Stk.abi,
      contracAddress: Stk.networks[1337].address,
      functionName: "balanceOf",
      params: {
        account: account
      }
    };
   
   return await executeInstance.fetch({params:option});
   
}
