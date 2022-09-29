import React, { useState } from 'react'
import { Text, Center, useDisclosure, Button, Collapse, Box } from '@chakra-ui/react'
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from 'react-moralis'
import Market from '../../contract/MarketplaceStiki.json'


export default function ProfitSell() {

    const { isOpen, onToggle } = useDisclosure()
    const { isOpenTable, onToggleTable } = useDisclosure()
    const { account } = useMoralis()
    const instance = useWeb3Contract()
    const instanceEx = useWeb3ExecuteFunction()
    const [balance, setBalance] = useState(0)


    async function getBalance() {
        //viewBalance(address _owner)
        let option = {
            abi: Market.abi,
            contractAddress: Market.networks[1337].address,
            functionName: 'viewBalance',
            params: {
                _owner: account
            }
        }

        let bal = await instance.runContractFunction({ params: option })
        setBalance(bal.toString());
        console.log(balance)
    }
    async function getWidrawal() {

        let option = {
            abi: Market.abi,
            contractAddress: Market.networks[1337].address,
            functionName: 'widrowProfitSell',
            params: {}
        }

        await instanceEx.fetch({ params: option })

    }





    return (
        <>
            <Button margin={10} onClick={() => { getBalance(); onToggle() }}>withdrawal</Button>
            <Collapse in={isOpen} animateOpacity>
                <Box border={2} background='whiteAlpha.100'>
                    <Center margin={5}>
                        <Text fontSize='2xl' marginRight={5} >withdrawal avvalible: </Text>
                        <Text fontSize='2xl' marginRight={5} >{balance} </Text>

                        <Button marginLeft={10} onClick={() => { getWidrawal() }}>withdrawal</Button>
                    </Center>
                </Box>
            </Collapse>

        </>
    )

}