import React, { useState } from 'react'
import { NumberInputField, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, NumberInput, Input, Text, Fade, ScaleFade, Slide, SlideFade, useDisclosure, Button, Collapse, Box, Center, Show } from '@chakra-ui/react'
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from 'react-moralis'
import NewStikiNft from '../../contract/NewStikiNFT.json'
import Market from '../../contract/MarketplaceStiki.json'


export default function SellMyNft() {
    const { account } = useMoralis()
    const instance = useWeb3Contract()
    const instanceEx = useWeb3ExecuteFunction()

    const { isOpen, onToggle } = useDisclosure()
    const [tokenId, setTokenId] = useState()
    const [price, setPrice] = useState()

    async function show() {
        let option = {
            abi: NewStikiNft.abi,
            contractAddress: NewStikiNft.networks[1337].address,
            functionName: 'viewStat',
            params: {
                _tokenId: tokenId
            }
        }

        let nft = await instance.runContractFunction({ params: option })
        console.log(tokenId)
        alert(
            `
            Token in Sell

            Token ID: ${nft.Id.toString()}
            Name: ${nft.name.toString()}
            Level: ${nft.level.toString()}
            LifePoint: ${nft.lifepoint.toString()}
            Power: ${nft.power.toString()}
            Dex: ${nft.dex.toString()}
            Stamina: ${nft.stamina.toString()}
            Speed: ${nft.speed.toString()}
            `
        )

    }

    async function setPutSell() {

        let optionApprove = {
            abi: NewStikiNft.abi,
            contractAddress: NewStikiNft.networks[1337].address,
            functionName: 'approve',
            params: {
                to: Market.networks[1337].address,
                tokenId: tokenId
            }

        }

        let optionPutSell = {
            abi: Market.abi,
            contractAddress: Market.networks[1337].address,
            functionName: 'putSell',
            params: {
                _tokenId: tokenId,
                _price: price
            }
        }

        await instanceEx.fetch({ params: optionApprove });

        await instanceEx.fetch({ params: optionPutSell });
    }



    return (
        <>
            <Button margin={10} onClick={onToggle}>Put your nft in sell offer</Button>
            <Collapse in={isOpen} animateOpacity>
                <Box border={2} background='whiteAlpha.100'>
                    <Center margin={5}>
                        <Text fontSize='2xl' marginRight={5} >Token Id: </Text>
                        <NumberInput marginRight={10} htmlSize={2} width='auto' onChange={(e) => { setTokenId(+(e)) }}>
                            <NumberInputField id='amountOut' />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Text fontSize='2xl' marginRight={5} >Price: </Text>
                        <NumberInput marginRight={10} htmlSize={2} width='auto' onChange={(e) => { setPrice(+(e)) }}>
                            <NumberInputField id='amountOut' />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Button marginLeft={10} onClick={() => show()}>Show nft</Button>

                        <Button marginLeft={10} onClick={() => setPutSell()}>Put Offer</Button>
                    </Center>
                </Box>
            </Collapse>
        </>
    )
}
