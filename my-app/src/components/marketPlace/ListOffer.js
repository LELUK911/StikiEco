import React, { useState } from 'react'
import {
    isOpen, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption,
    TableContainer, Text, Center, Container, NumberInputField,
    NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput, Input, Fade, ScaleFade, Slide, SlideFade,
    useDisclosure, Button, Collapse, Box, Show
} from '@chakra-ui/react'
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from 'react-moralis'
import Market from '../../contract/MarketplaceStiki.json'
import NewStikiNft from '../../contract/NewStikiNFT.json'


export default function ListOffer() {

    const { isOpen, onToggle } = useDisclosure()
    const { isOpenTable, onToggleTable } = useDisclosure()


    const { account } = useMoralis()
    const instance = useWeb3Contract()
    const instanceEx = useWeb3ExecuteFunction()

    const [tokenId, setTokenId] = useState()
    const [listOffer, setListOffer] = useState(undefined)



    async function getOffer() {
        const option = {
            abi: Market.abi,
            contractAddress: Market.networks[1337].address,
            functionName: 'viewBuyOfferForToken',
            params: {
                _tokenId: tokenId
            }
        }
        const list = await instance.runContractFunction({ params: option })
        setListOffer(list)
        console.log(listOffer)

    }

    async function SellNft() {
        const optionEx = {
            abi: Market.abi,
            contractAddress: Market.networks[1337].address,
            functionName: 'fillBuyerOffer',
            params: {
                _tokenId: listOffer.tokenId.toNumber(),
                _index: listOffer.index.toNumber()
            }
        }
        let optionApprove = {
            abi: NewStikiNft.abi,
            contractAddress: NewStikiNft.networks[1337].address,
            functionName: 'approve',
            params: {
                to: Market.networks[1337].address,
                tokenId: listOffer.tokenId.toNumber()
            }

        }

        await instanceEx.fetch({ params: optionApprove })
        await instanceEx.fetch({ params: optionEx })
    }

    async function fillBuyerOffer(id, index) {
        console.log(typeof (id))
        console.log(typeof (index))

        let optionApprove = {
            abi: NewStikiNft.abi,
            contractAddress: NewStikiNft.networks[1337].address,
            functionName: 'approve',
            params: {
                to: Market.networks[1337].address,
                tokenId: id
            }

        }

        await instanceEx.fetch({ params: optionApprove })

        //fillBuyerOffer(uint256 _tokenId, uint256 _index)
        let optionFill = {
            abi: Market.abi,
            contractAddress: Market.networks[1337].address,
            functionName: "fillBuyerOffer",
            params: {
                _tokenId: id,
                _index: index
            }
        }

        await instanceEx.fetch({ params: optionFill })

    }


    if (listOffer == undefined) {
        return (
            <>
                <Button onClick={onToggle}>List Offer</Button>
                <Collapse in={isOpen} animateOpacity>
                    <Box border={2} background='whiteAlpha.100'>
                        <Center margin={5}>
                            <Text fontSize='2xl' marginRight={5} >Token Id: </Text>
                            <NumberInput marginRight={10} htmlSize={2} width='auto' onChange={(e) => { setTokenId(+(e)) }} >
                                <NumberInputField id='amountOut' />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Button marginLeft={10} onClick={() => getOffer()}>Show Offer</Button>
                        </Center>
                    </Box>
                </Collapse>
            </>
        )
    } else {
        return (
            <>
                <Button onClick={onToggle}>List Offer</Button>
                <Collapse in={isOpen} animateOpacity>
                    <Box border={2} background='whiteAlpha.100'>
                        <Center margin={5}>
                            <Text fontSize='2xl' marginRight={5} >Token Id: </Text>
                            <NumberInput marginRight={10} htmlSize={2} width='auto' onChange={(e) => { setTokenId(+(e)) }} >
                                <NumberInputField id='amountOut' />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Button marginLeft={10} onClick={() => { getOffer() }}>Show Offer</Button>
                        </Center>
                    </Box>
                </Collapse>
                <Container maxW={10000} border={2} background='whiteAlpha.100'>
                    <Text fontSize="3xl">Offer</Text>
                    <TableContainer>
                        <Table variant='simple'>

                            <Thead>
                                <Tr>
                                    <Th>Id</Th>
                                    <Th>Price</Th>
                                    <Th>Buyer</Th>
                                    <Th>Status</Th>
                                    <Th>Sell</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {listOffer.map((item) => (
                                    <Tr>

                                        <Th>{item.tokenId.toString()}</Th>
                                        <Th>{item.price.toString()}</Th>
                                        <Th>{item.Buyer}</Th>
                                        <Th>{item.active.toString()}</Th>
                                        <Th><Button onClick={() => fillBuyerOffer(item.tokenId.toNumber(), item.index.toNumber())}>Sell</Button></Th>
                                    </Tr>
                                ))}

                            </Tbody>

                        </Table>
                    </TableContainer>
                </Container>
            </>
        )
    }
}



/**
     {listOffer.map(({ tokenId, price, Buyer, active, index }) => {
                                    <Tr>
                                        <Th>ciao</Th>
                                        <Th>{price.toString()}</Th>
                                        <Th>{Buyer}</Th>
                                        <Th>{index}</Th>
                                        <Th>{active}</Th>
                                        <Th><Button>Sell</Button></Th>
                                    </Tr>

                                })}
 */