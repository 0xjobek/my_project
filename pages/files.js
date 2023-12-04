import { useState, useRef, useContext } from "react";
import Head from "next/head";
import { BlockchainContext } from "@/context/BlockChainContext";
import Header from "@/components/Header";

export default function Home() {

  const{address, getOwnerFiles , connectWallet} = useContext(BlockchainContext);
  const [userFileIds, setUserFileIds]  = useState([])



 

  const fetchUserFiles  = async() => {
    const _userFileIds = await getOwnerFiles(address);
    if(!_userFileIds) return;
    alert(_userFileIds)
    setUserFileIds(_userFileIds)
    console.log(_userFileIds[0]) 
  }

  
  return (
    <>
      <Head>
        <title>Simple IPFS</title>
        <meta name="description" content="Generated with create-pinata-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/pinnie.png" />
      </Head>
      <Header address={address} clickButton={connectWallet} />
      {address && <button className="block mx-auto mt-5 text-center p-12 bg-black text-white" onClick={fetchUserFiles}>Click to fetch your Uploaded files</button>}
      <main className="flex min-h-screen w-full items-center">


 
  {!address && <div className="m-auto w-3/4 text-center border-1 ">
    <p className="text-xl">
      Please Connect Wallet 

      </p></div>}

      {userFileIds?.map(id => <IdBox id={id} key={id}/>)}
  

</main>

    </>
  );
}

const IdBox = ({id}) => {
  const{getFileHistory, address, convertToReadableTime} = useContext(BlockchainContext);

    const[boxActive, setBoxActive] = useState(false);
    const[fileHistory, setFileHistory] = useState([]);

    const viewFileHistory = async() =>{
        const fileHistory  = await getFileHistory(id, address)
        console.log("file history at ---", fileHistory)
        setFileHistory(fileHistory)
    }

    return(
    <div className="m-auto w-1/4 text-center border-1 ">
    
    
    <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-light p-2 text-center text-secondary">
      <button
        className="align-center flex h-64 w-3/4 flex-row items-center justify-center rounded-3xl bg-secondary px-4 py-2 text-light transition-all duration-300 ease-in-out hover:bg-accent hover:text-light"
        onClick={() => setBoxActive(!boxActive)}
      >
        
          <div>
            <p className="text-lg font-light">
              {`File # ${id}`}
            </p>
           
          </div>
      </button>
    </div>
    {boxActive && (
       <button className="rounded-lg bg-secondary text-white w-auto p-4 mt-4" onClick={viewFileHistory}>View File History</button>
    )}
    {fileHistory?.map((history, i) => <p key={i}>{history[0]} accessed your file at {convertToReadableTime(history[1])} </p>)}
  </div>)
}
