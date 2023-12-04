import { createContext, useState } from "react";
const {ethers} = require("ethers")
import abi from "../utils/Upload.abi.json"


export const BlockchainContext = createContext();


export const BlockchainContextProvider = ({ children }) => {

    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const [address, setAddress] = useState(null);

  const connectWallet = async() => {
    if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
      try {
        const account = await window.ethereum.request({method: "eth_requestAccounts"});
        console.log(account[0]);
        setAddress(account[0])
      } catch (error) {
        console.log(error)
      }
    }
  }


// A function that takes a solidity output as a string and returns a readable time as a string
function convertToReadableTime(solidityOutput) {
  
    
  
    // Convert the BigNumber object to a number
    const seconds = Number(solidityOutput);
  
    // Create a Date object from the number
    const date = new Date(seconds * 1000); // multiply by 1000 to get milliseconds
  
    // Format the Date object as a readable string
    const readableTime = date.toLocaleString(); // use your preferred options
  
    // Return the readable time
    return readableTime;
  }
  

  const uploadFiles = async(address, hash) => {
    try{
        // Connect to a custom JSON-RPC endpoint
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
    
         const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                abi,
                signer,
              );
        
        const tx = await contract.addFile(address, hash);
        await tx.wait();
        alert("Process Successful")
    }catch(err){
        alert("process failed")
        alert(err);
    }
    
  }

  const grantAccess = async(fileId, ownerAddr, userAddr) => {
    try{
        // Connect to a custom JSON-RPC endpoint
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
    
         const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                abi,
                signer,
              );
        
        const tx = await contract.allowUser(fileId, ownerAddr, userAddr);
        await tx.wait();
        alert("Process Successful")
    }catch(err){
        alert("process failed")
        alert(err);
    }
    
  }

  const revokeAccess = async(fileId, ownerAddr, userAddr) => {
    try{
        // Connect to a custom JSON-RPC endpoint
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
    
         const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                abi,
                signer,
              );
        
        const tx = await contract.revokeUser(fileId, ownerAddr, userAddr);
        await tx.wait();
        alert("Process Successful")
    }catch(err){
        alert("process failed")
        alert(err);
    }
    
  }

  const viewFiles = async(fileId, address) => {
     // Connect to a custom JSON-RPC endpoint
     const provider = new ethers.BrowserProvider(window.ethereum);
     const signer = await provider.getSigner();
     const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi,
        signer,
      );
    try{
         
        
        const tx = await contract.logView(fileId, address)
        await tx.wait();
        alert("View Logged Successfully")
        
    }catch(err){
        alert("process failed")
        alert(err);
    }

    //GETTING RETURN VALUES
    
    try{
           
           
        const tx2 = contract.viewFile(fileId, address)
        
        alert("Fetched Values")
        return(tx2);
       
    }catch(err){
        alert("process failed")
        alert(err);
        return null;
    }
  }

  const getOwnerFiles = async(address) => {
        // Connect to a custom JSON-RPC endpoint
        const provider = new ethers.BrowserProvider(window.ethereum);
    try{
        const contract = new ethers.Contract(
               CONTRACT_ADDRESS,
               abi,
               provider,
             );
       
       const tx = await contract.getOwnerFiles(address)
       
       alert("Fetched Values")
       return(tx);
      
   }catch(err){
       alert("process failed")
       alert(err);
       return null;
   }
  }

  const getFileHistory = async(fileId, ownerAddress) => {
      // Connect to a custom JSON-RPC endpoint
      const provider = new ethers.BrowserProvider(window.ethereum);
  try{
      const contract = new ethers.Contract(
             CONTRACT_ADDRESS,
             abi,
             provider,
           );
     
     const tx = await contract.viewFileHistory(fileId, ownerAddress);
     
     alert("Fetched Values")
     return(tx);
    
 }catch(err){
     alert("process failed")
     alert(err);
     return null;
 }
  }

  const contextValue = {
    address,
    connectWallet,
    uploadFiles,
    viewFiles,
    getOwnerFiles,
    getFileHistory,
    grantAccess,
    revokeAccess,
    convertToReadableTime
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};
