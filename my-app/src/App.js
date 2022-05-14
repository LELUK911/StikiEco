import React from 'react';
import {ChakraProvider,Container,theme,} from '@chakra-ui/react';
import NavBarPage from './components/head/navBar';
import STKPage from './components/BuyStikiToken/STKPage';
import MintSection from './components/MintStiki/MintSection';



function App() {
  return (
    <>
      <Container  width={1000}  maxWidth={1000} display="flex-box" >
        <Container width={500} margin={200}>
            <STKPage></STKPage>
        </Container>
      </Container>
      
    </>
  );
}

export default App;



