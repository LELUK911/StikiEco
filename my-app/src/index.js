import { ColorModeScript, Container, ChakraProvider, theme } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { MoralisProvider } from "react-moralis";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBarPage from './components/head/navBar';
import MintSection from './components/MintStiki/MintSection';
import WalletStiki from './components/WalletStiki/walletStiki';
import StikiMarketplace from './components/marketPlace/StikiMarketplace';




ReactDOM.render(
  <StrictMode>
    <BrowserRouter >
      <MoralisProvider appId="" serverUrl="">
        <ChakraProvider theme={theme} margin={0}>
          <ColorModeScript />
          <Container width={1000} maxWidth={1000} display="flex-box" >
            <NavBarPage marginleft={100} width={1000} maxWidth={1000} display="flex-box">
            </NavBarPage>
          </Container>
          <Routes>
            <Route path='/' ></Route>
            <Route path='MintSTK' element={<App />} />
            <Route path='MintStiki' element={<MintSection />} />
            <Route path='WalletNFT' element={<WalletStiki />} />
            <Route path='StikiMarketPlace' element={<StikiMarketplace />} />

          </Routes>
        </ChakraProvider>
      </MoralisProvider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
