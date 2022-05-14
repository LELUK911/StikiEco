import React, { useState, useRef } from 'react'
import {
    useDisclosure, AlertDialogCloseButton,
    AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast,
    Button, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption,
    TableContainer, Text, Container
} from '@chakra-ui/react'
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from 'react-moralis'
import NewStikiNft from '../../contract/NewStikiNFT.json'
import Market from '../../contract/MarketplaceStiki.json'




export default function ListNftInSell() {
    const { account } = useMoralis()
    const instance = useWeb3Contract()
    const instanceEx = useWeb3ExecuteFunction()
    const [nfts, setNfts] = useState(undefined);
    const toast = useToast()
    const [INFoffer, setInfOffer] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const [tokenSel, setTokenSel] = useState(undefined)




    async function getWallet() {
        console.log(account)
        let option = {
            abi: Market.abi,
            contractAddress: Market.networks[1337].address,
            functionName: 'viewUserListSell',
            params: {
                _user: account
            }
        }
        const wal = await instance.runContractFunction({ params: option });
        console.log(wal)
        const walArr = []
        for (let i = 0; i < wal.length; i++) {
            if (wal[i] != ",") {

                walArr.push(+(wal[i]));
            }
        }
        console.log(walArr);


        let nftS = [];
        for (let i = 0; i < walArr.length; i++) {
            let optionStat = {
                abi: NewStikiNft.abi,
                contractAddress: NewStikiNft.networks[1337].address,
                functionName: 'viewStat',
                params: {
                    _tokenId: walArr[i]
                }
            }
            const nftStat = await instance.runContractFunction({ params: optionStat });
            nftS.push(nftStat);

        }
        setNfts(nftS);
        console.log(nfts)
    }

    async function run(tokenID) {
        setTokenSel(tokenID)
        let option = {
            abi: Market.abi,
            contractAddress: Market.networks[1337].address,
            functionName: "viewPuttSell",
            params: {
                _tokenId: tokenID
            }
        }
        let tx = await instance.runContractFunction({ params: option })
        let sellerID = tx[0].toString()
        let priceId = tx[1].toString()
        let tokenIDid = tx[2].toString()

        if (tokenIDid == "0" && priceId == "0") {
            setInfOffer(`Not avvalible`)
        } else {
            setInfOffer(`Nft Id: ${tokenIDid} Sellprice: ${priceId} Eth`)
        }

        //return (
        //    `
        //    Seller: ${sellerID}
        //    price: ${priceId}
        //    tokenId: ${tokenIDid}
        //    `
        //)
    }

    async function remove(id) {
        //removePutSell(uint256 _tokenId)
        let option = {
            abi: Market.abi,
            contractAddress: Market.networks[1337].address,
            functionName: "removePutSell",
            params: {
                _tokenId: id
            }
        }
        await instanceEx.fetch({ params: option })
        console.log(id)

    }




    if (nfts == undefined) {
        return (
            <>
                <Container maxW={10000}>
                    <Text fontSize="3xl">sales announcements</Text>
                    <TableContainer>
                        <Table variant='simple'>

                            <Thead>
                                <Tr>
                                    <Th>Id</Th>
                                    <Th>Name</Th>
                                    <Th>level</Th>
                                    <Th>life point</Th>
                                    <Th>power</Th>
                                    <Th>dex</Th>
                                    <Th>Stamin</Th>
                                    <Th>Speed</Th>
                                </Tr>
                            </Thead>
                            <Tfoot>
                                <Tr>
                                    <Th><Button onClick={() => getWallet()}>Refresh</Button></Th>

                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Container>

            </>
        )
    } else {
        return (
            <>
                <Container maxW={10000}>
                    <Text fontSize="3xl">Sales announcements</Text>
                    <TableContainer>
                        <Table variant='simple'>

                            <Thead>
                                <Tr>
                                    <Th>Id</Th>
                                    <Th>Name</Th>
                                    <Th>level</Th>
                                    <Th>life point</Th>
                                    <Th>power</Th>
                                    <Th>dex</Th>
                                    <Th>Stamin</Th>
                                    <Th>Speed</Th>
                                    <Th>Sale announcement</Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                                {nfts.map(({ Id, name, level, lifepoint, power, dex, stamina, speed }) => (
                                    <Tr>
                                        <Th onClick={() => {
                                            run(Id.toNumber());
                                            toast({
                                                title: 'Nft offer Sell',
                                                description: `${INFoffer}`,
                                                status: 'info',
                                                duration: 9000,
                                                isClosable: true,
                                            })
                                        }}

                                        >{Id.toString()}</Th>
                                        <Th>{name.toString()}</Th>
                                        <Th>{level.toString()}</Th>
                                        <Th>{lifepoint.toString()}</Th>
                                        <Th>{power.toString()}</Th>
                                        <Th>{dex.toString()}</Th>
                                        <Th>{stamina.toString()}</Th>
                                        <Th>{speed.toString()}</Th>
                                        <Th><Button onClick={() => { run(Id.toNumber()); onOpen() }}>Show</Button>
                                            <AlertDialog
                                                motionPreset='slideInBottom'
                                                leastDestructiveRef={cancelRef}
                                                onClose={onClose}
                                                isOpen={isOpen}
                                                isCentered
                                            >
                                                <AlertDialogOverlay />

                                                <AlertDialogContent>
                                                    <AlertDialogHeader>Sales announcements</AlertDialogHeader>
                                                    <AlertDialogCloseButton />
                                                    <AlertDialogBody>
                                                        {INFoffer}
                                                    </AlertDialogBody>
                                                    <AlertDialogFooter>
                                                        <Button ref={cancelRef} onClick={onClose}>
                                                            <Text>Close</Text>
                                                        </Button>
                                                        <Button colorScheme='red' ml={3} onClick={() => { remove(tokenSel) }}>
                                                            Remove Sell
                                                        </Button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog></Th>
                                    </Tr>
                                ))}
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    <Th><Button onClick={() => getWallet()}>Refresh</Button></Th>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Container>

            </>

        )
    }
}







