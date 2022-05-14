import React, { useRef } from 'react'
import { useMoralis } from 'react-moralis';
import { Input, Button, Flex, Box, Heading, Spacer, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, UnorderedList, ListItem, } from '@chakra-ui/react'
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import MetamaskConnect from '../blockCainutility/MetamaskConecct';
import { Link } from "react-router-dom";





export default function NavBarPage() {


  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
    <>
      <Flex maxW='100%' w='95%'>
        <Box p='2'>
          <Heading size='md'>Stiki WAR!!!!</Heading>
        </Box>
        <Spacer />
        <Box>
          <MetamaskConnect></MetamaskConnect>
          <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
            Menu
          </Button>
          <ColorModeSwitcher justifySelf="flex-end" width='10' marginleft={300} />
        </Box>
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>MENU</DrawerHeader>

          <DrawerBody>
            <UnorderedList fontSize='3xl'>

              <ListItem><Link to="/">Home</Link></ListItem>
              <ListItem><Link to="MintSTK">Buy STK token</Link></ListItem>
              <ListItem><Link to="MintStiki">Mint Stiki Warrior</Link></ListItem>
              <ListItem><Link to="WalletNFT">Wallet Stiki</Link></ListItem>
              <ListItem><Link to="StikiMarketPlace">MarketPlace</Link></ListItem>

            </UnorderedList>

          </DrawerBody>


        </DrawerContent>
      </Drawer>
    </>
  )
}




