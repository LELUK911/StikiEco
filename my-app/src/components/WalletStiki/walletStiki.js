import React, { useState, useEffect } from 'react'
import { Button, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Text, Center, Input, Container } from '@chakra-ui/react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import NewStikiNft from '../../contract/NewStikiNFT.json'

export default function StikiMarketplace() {
    const { account } = useMoralis()
    const instance = useWeb3Contract()
    const [nfts, setNfts] = useState(undefined);


    let option = {
        abi: NewStikiNft.abi,
        contractAddress: NewStikiNft.networks[1337].address,
        functionName: 'viewAllNftsUser',
        params: {
            _owner: account
        }
    }
    async function getWallet() {
        const wal = await instance.runContractFunction({ params: option });
        console.log(wal.toString())
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
                    _tokenId: i
                }
            }
            const nftStat = await instance.runContractFunction({ params: optionStat });
            nftS.push(nftStat);

        }
        setNfts(nftS);
        console.log(nfts)
    }




    if (nfts == undefined) {
        return (
            <>
                <Container maxW={10000}>
                    <Text fontSize="3xl">Your Nft</Text>

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
                    <Text fontSize="3xl">Your Nft</Text>

                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>Imperial to metric conversion factors</TableCaption>
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
                            <Tbody>
                                {nfts.map(({ Id, name, level, lifepoint, power, dex, stamina, speed }) => (
                                    <Tr>
                                        <Th>{Id.toString()}</Th>
                                        <Th>{name.toString()}</Th>
                                        <Th>{level.toString()}</Th>
                                        <Th>{lifepoint.toString()}</Th>
                                        <Th>{power.toString()}</Th>
                                        <Th>{dex.toString()}</Th>
                                        <Th>{stamina.toString()}</Th>
                                        <Th>{speed.toString()}</Th>
                                    </Tr>
                                ))}
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    <Th><Button onClick={() => getWallet()}></Button>Refresh</Th>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>



                </Container>

            </>

        )
    }
}