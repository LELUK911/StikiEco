import React from 'react'
import {
    isOpen, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption,
    TableContainer, Text, Center, Container, NumberInputField,
    NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput, Input, Fade, ScaleFade, Slide, SlideFade,
    useDisclosure, Button, Collapse, Box, Show
} from '@chakra-ui/react'

export default function List(listOffer) {
    return (
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
                        {listOffer.map(({ tokenId, price, Buyer, active, index }) => {
                            <Tr>
                                <Th>{tokenId}</Th>
                                <Th>{price.toString()}</Th>
                                <Th>{Buyer}</Th>
                                <Th>{index}</Th>
                                <Th>{active}</Th>
                                <Th><Button>Sell</Button></Th>
                            </Tr>

                        })}


                    </Tbody>

                </Table>
            </TableContainer>
        </Container>
    )
}
