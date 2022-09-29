import React, { useState } from 'react'
import {
    useDisclosure, AlertDialogCloseButton,
    AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast,
    Button, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption,
    TableContainer, Text, Container
} from '@chakra-ui/react'
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from 'react-moralis';
import NewStikiNft from '../../contract/NewStikiNFT.json'
import Market from '../../contract/MarketplaceStiki.json'




export default function ListAllNftSell() {
    const { account } = useMoralis()
    const instance = useWeb3Contract()
    const instanceEx = useWeb3ExecuteFunction()
    const [idNft, setIdNft] = useState(undefined)


    async function CountIdNft() {
        let option = {
            abi: NewStikiNft.abi,
            contractAddress: NewStikiNft.networks[1337].address,
            functionName: 'viewCurrentID',
            params: {}
        }

        let id = await instance.runContractFunction({ params: option });
        setIdNft(id.toNumber())
        console.log(idNft)
        //setIdNft(2)
        getList()

    }
    const [listBuy, setListBuy] = useState(undefined)

    async function getList() {

        let listForID = []

        for (let i = 0; i <= idNft; i++) {
            let optionStat = {
                abi: NewStikiNft.abi,
                contractAddress: NewStikiNft.networks[1337].address,
                functionName: 'viewStat',
                params: {
                    _tokenId: i
                }
            }
            let optionList = {
                abi: Market.abi,
                contractAddress: Market.networks[1337].address,
                functionName: 'viewPuttSell',
                params: {
                    _tokenId: i
                }
            }
            let txList = await instance.runContractFunction({ params: optionList })
            if (txList.Seller !== '0x0000000000000000000000000000000000000000') {

                let optionStat = {
                    abi: NewStikiNft.abi,
                    contractAddress: NewStikiNft.networks[1337].address,
                    functionName: 'viewStat',
                    params: {
                        _tokenId: txList.tokenId.toString()
                    }
                }
                let txStat = await instance.runContractFunction({ params: optionStat })

                listForID.push([txList, txStat])

            } else {
                continue;
            }
        }
        //listForID.push(txList)



        setListBuy(listForID)
        console.log(listBuy);
    }






    //Moralis.Units.ETH(0.5)

    async function buy(id, price) {
        //fillPutSell(uint256 _tokenId)
        let option = {
            abi: Market.abi,
            contractAddress: Market.networks[1337].address,
            functionName: 'fillPutSell',
            msgValue: price.toString(),
            params: {
                _tokenId: id,
            },
        }

        await instanceEx.fetch({ params: option });
        console.log(price.toString())
    }



    if (listBuy == undefined) {
        return (
            <>
                <Button margin={10} onClick={() => CountIdNft()}>Show list sell</Button>
            </>
        )
    }
    return (
        <>
            <Container maxW={10000}>
                <Text fontSize="3xl">MarketPlace Stiki</Text>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>tokenId</Th>
                                <Th>name</Th>
                                <Th>level</Th>
                                <Th>lifepoing</Th>
                                <Th>power</Th>
                                <Th>dex</Th>
                                <Th>stamina</Th>
                                <Th>speed</Th>
                                <Th>price</Th>
                                <Th>Seller</Th>
                                <Th>Buy</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {listBuy.map((item) => (
                                <Tr>
                                    <Th>{item[0].tokenId.toString()}</Th>
                                    <Th>{item[1].name.toString()}</Th>
                                    <Th>{item[1].level.toString()}</Th>
                                    <Th>{item[1].lifepoint.toString()}</Th>
                                    <Th>{item[1].power.toString()}</Th>
                                    <Th>{item[1].dex.toString()}</Th>
                                    <Th>{item[1].stamina.toString()}</Th>
                                    <Th>{item[1].speed.toString()}</Th>
                                    <Th>{item[0].price.toString()}</Th>
                                    <Th>{item[0].Seller}</Th>
                                    <Th><Button onClick={() => { buy(item[0].tokenId.toNumber(), item[0].price.toNumber()) }} >Buy</Button></Th>
                                </Tr>
                            ))}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th><Button margin={10} onClick={() => CountIdNft()}>Refresh</Button></Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Container>

        </>

    )
}

