import Header from '@/components/Header'
import { BlockchainContextProvider } from '@/context/BlockChainContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return <>
  <BlockchainContextProvider>
  <Component {...pageProps} />
  </BlockchainContextProvider>
  </>
}
