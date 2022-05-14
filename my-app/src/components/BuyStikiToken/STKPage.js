import React, { useState, useEffect } from 'react'
import {
  Text, Container, Button, FormControl, FormLabel, FormHelperText, NumberInput, NumberInputField, NumberIncrementStepper, NumberDecrementStepper, Input, NumberInputStepper, Image
} from '@chakra-ui/react'
import { useWeb3ExecuteFunction, useWeb3Contract } from 'react-moralis'
import { useMoralis } from 'react-moralis';
import MintContract from '../../contract/MintContract.json'
import mockUsdc from '../../contract/mockUsdc.json'
import Stk from '../../contract/stikiToken.json'





export default function STKPage() {
  // set constant price but in next use function for return price
  const price = 10;
  const contractProcessor = useWeb3ExecuteFunction();
  const contractView = useWeb3Contract()
  const [amountIn, setAmountIn] = useState(0)
  const { account } = useMoralis();
  const [balanceStk, setBalanceStk] = useState(undefined);
  const [balanceUsdc, setBalanceUsdc] = useState(undefined);



  let optionBalance = {
    abi: Stk.abi,
    contracAddress: Stk.networks[1337].address,
    functionName: "balanceOf",
    params: {
      account: account
    }
  };
  async function giveBal() {
    const bal = await contractView.runContractFunction({ params: optionBalance })
    console.log(bal)
    return bal;
  }


  // contract section 
  let optionMintContract = {
    abi: MintContract.abi,
    contractAddress: MintContract.networks[1337].address,
    functionName: "BuyStikiToken",
    params: {
      _to: account,
      _amount: amountIn,
    }
  }
  let optionApprove = {
    abi: mockUsdc.abi,
    contractAddress: mockUsdc.networks[1337].address,
    functionName: "approve",
    params: {
      spender: MintContract.networks[1337].address,
      amount: amountIn,
    }
  }


  async function Swap() {
    await contractProcessor.fetch({ params: optionMintContract });

  }

  async function ApproveUsdc() {
    await contractProcessor.fetch({ params: optionApprove });
  }


  return (
    <>
      <FormControl>
        <FormLabel htmlFor='amountIn'><Text fontsize='4xl'>Minting STK</Text></FormLabel>

        Sell:
        <NumberInput min={0} onChange={(e) => { setAmountIn(+(e)) }}>
          <NumberInputField id='amountIn' />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        Buy:
        <NumberInput value={amountIn * price} >
          <NumberInputField id='amountOut' />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Container alignContent=''>
          <Button onClick={() => ApproveUsdc()} margin={5}> Approve </Button>
          <Button onClick={() => Swap()} >Swap</Button>
        </Container>
      </FormControl>

    </>


  )
}


