import { useState, useRef, useContext } from "react";
import Head from "next/head";
import Files from "@/components/Files";
import { BlockchainContext } from "@/context/BlockChainContext";
import Header from "@/components/Header";

export default function Home() {

  const{address, connectWallet, uploadFiles, grantAccess, revokeAccess, viewFiles, getOwnerFiles} = useContext(BlockchainContext)

  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [granting, setGranting] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [fileViewing, setFileViewing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [accessAddress, setAccessAddress] = useState("");
  const [accessFileId, setAccessFileId] = useState("");

  const [revokeAddress, setRevokeAddress] = useState("");
  const [revokeFileId, setRevokeFileId] = useState("");
  
  const [fileViewAddress, setFileViewAddress] = useState("");
  const [fileViewFileId, setFileViewFileId] = useState("");

  const inputFile = useRef(null);

  const uploadFile = async (e) => {
    try {
      e.preventDefault();
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file, { filename: file.name });
      formData.append("name", form.name);
      formData.append("description", form.description);
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const ipfsHash = await res.text();
      // setCid(ipfsHash);
     await uploadFiles(address, ipfsHash)
     const tokenId = await getOwnerFiles(address);
    alert(`Your token Id is ${tokenId[tokenId.length - 1]}`)
      setUploading(false);
      setFile("")
    } catch (e) {
      console.log(e);
      setUploading(false);
      setFile("")
      alert("Trouble uploading file");
    }
  };

  const grantAccessToUser = async (e) => {
    e.preventDefault();
    if(!accessAddress) return;
    if(!accessFileId) return;
    try {
      console.log(e)
      console.log("file id --", accessFileId)
      console.log("file address --", accessAddress)
      await grantAccess(accessFileId, address, accessAddress);
      alert("Access Granted !");
  
    } catch (e) {
      alert("Access Not granted")
    }
  };

  const revokeAccessToUser = async (e) => {
    e.preventDefault();
    if(!revokeAddress) return;
    if(!revokeFileId) return;
    try {
      console.log("revokeForm--- ", revokeFileId, revokeAddress)
      await revokeAccess(revokeFileId, address, revokeAddress);
      alert("Access Revoked For ", revokeAddress);
      // setRevokeForm({
      //   address: "",
      //   fileId: "",
      // })
    } catch (e) {
      alert("Access Revoked")
    }
  };

  const viewFile = async (e) => {
    if(!fileViewAddress) return;
    if(!fileViewFileId) return;
    try {
      e.preventDefault();
      const returnValue = await viewFiles(fileViewFileId, fileViewAddress);
      console.log(returnValue)
      setCid(returnValue)
    } catch (e) {
      console.log(e);
      alert("Trouble fetching file");
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const loadRecent = async () => {
    try {
      const res = await fetch("/api/files");
      const json = await res.json();
      setCid(json.ipfs_pin_hash);
    } catch (e) {
      console.log(e);
      alert("trouble loading files");
    }
  };



  
  return (
    <>
      <Head>
        <title>Josiah's Project</title>
        <meta name="description" content="Generated with create-pinata-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/pinnie.png" />
      </Head>
      <Header address={address} clickButton={connectWallet}/>
      <h1 className="mt-5 text-center">Josiah Obeka's Project</h1>
      <p className="mt-5 text-center text-xl">2017/1/65138CS</p>
      <main className="m-auto flex min-h-screen w-full items-center">


 {address &&<>
 <div className="m-auto w-1/4 text-center border-1 ">
    {/* <p className="mt-2">
      With Simple IPFS, you can upload a file, get a link, and share
      it with anyone who needs to access the file. The link is
      permanent, but it will only be shared once.
    </p> */}
    <input
      type="file"
      id="file"
      ref={inputFile}
      onChange={handleChange}
      style={{ display: "none" }}
    />
    <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-light p-2 text-center text-secondary">
      <button
        disabled={uploading}
        onClick={() => {inputFile.current.click()}}
        className="align-center flex h-64 w-3/4 flex-row items-center justify-center rounded-3xl bg-secondary px-4 py-2 text-light transition-all duration-300 ease-in-out hover:bg-accent hover:text-light"
      >
        {uploading ? (
          "Uploading..."
        ) : (
          <div>
            <p className="text-lg font-light">
              Select a file to upload to Uploader.inc
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="m-auto mt-4 h-12 w-12 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
        )}
      </button>
    </div>
    {file && (
      <form onSubmit={uploadFile}>
        <div className="mb-2">
          <label htmlForm="name">Name</label><br/>
          <input onChange={(e) => setForm({
            ...form, 
            name: e.target.value
          })} className="border border-secondary rounded-md p-2 outline-none" id="name" value={form.name} placeholder="Name" />
        </div>
        <div>
          <label htmlForm="description">Description</label><br />
          <textarea
            className="border border-secondary rounded-md p-2 outline-none"
            value={form.description}
            onChange={(e) => setForm({
              ...form, 
              description: e.target.value
            })}
            placeholder="Description..."
          />                      
        </div>
        <button className="rounded-lg bg-secondary text-white w-auto p-4" type="submit">Upload</button>
      </form>
    )}
  </div>
  <div className="m-auto w-1/4 text-center border-1 ">
    
    
    <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-light p-2 text-center text-secondary">
      <button
        className="align-center flex h-64 w-3/4 flex-row items-center justify-center rounded-3xl bg-secondary px-4 py-2 text-light transition-all duration-300 ease-in-out hover:bg-accent hover:text-light"
        onClick={() => {setFileViewing(!fileViewing)
                        setGranting(false)
                        setRevoking(false)
                        
        }}
      >
        
          <div>
            <p className="text-lg font-light">
              Access File
            </p>
           
          </div>
      </button>
    </div>
    {fileViewing && (
      <form onSubmit={viewFile}>
        <div className="mb-2">
          <label htmlFor="address">File Owner Address</label><br/>
          <input onChange={(e) => setFileViewAddress(e.target.value)} className="border border-secondary rounded-md p-2 outline-none" placeholder="Address" />
        </div>
        <div>
          <label htmlForm="File Id">File Id</label><br />
          <input
            className="border border-secondary rounded-md p-2 outline-none"
            onChange={(e) => setFileViewFileId(e.target.value)}
            placeholder="set file Id"
          />                      
        </div>
        <button className="rounded-lg bg-blue-600 text-white w-auto p-4 mt-4" type="submit">View File</button>
      </form>
      
    )}
     {cid && <Files cid={cid} />}
  </div>
  <div className="m-auto w-1/4 text-center border-1 ">
    
    
    <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-light p-2 text-center text-secondary">
      <button
        className="align-center flex h-64 w-3/4 flex-row items-center justify-center rounded-3xl bg-secondary px-4 py-2 text-light transition-all duration-300 ease-in-out hover:bg-accent hover:text-light"
        onClick={() => {setFileViewing(false)
          setGranting(!granting)
          setRevoking(false)
          }}
      >
        
          <div>
            <p className="text-lg font-light">
              Grant Access
            </p>
           
          </div>
      </button>
    </div>
    {granting && (
      <form onSubmit={grantAccessToUser}>
        <div className="mb-2">
          <label htmlFor="address">Address</label><br/>
          <input onChange={(e) => {setAccessAddress(e.target.value); console.log(e.target.value)}} className="border border-secondary rounded-md p-2 outline-none" id="address" placeholder="Address" type="text"/>
        </div>
        <div>
          <label htmlFor="File Id">File Id</label><br />
          <input
            className="border border-secondary rounded-md p-2 outline-none"
            onChange={(e) => setAccessFileId(e.target.value)}
            placeholder="set file Id" type="text"
          />                      
        </div>
        <button className="rounded-lg bg-secondary text-white w-auto p-4 mt-4" type="submit">Grant User Access</button>
      </form>
    )}
  </div>
  <div className="m-auto w-1/4 text-center border-1 ">
    
    
    <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-light p-2 text-center text-secondary">
      <button
        className="align-center flex h-64 w-3/4 flex-row items-center justify-center rounded-3xl bg-secondary px-4 py-2 text-light transition-all duration-300 ease-in-out hover:bg-accent hover:text-light"
        onClick={() => {setFileViewing(false)
          setGranting(false)
          setRevoking(!revoking)
          }}
      >
        
          <div>
            <p className="text-lg font-light">
              Revoke Access
            </p>
           
          </div>
      </button>
    </div>
    {revoking && (
      <form onSubmit={revokeAccessToUser}>
        <div className="mb-2">
          <label htmlFor="address">Address</label><br/>
          <input onChange={(e) => setRevokeAddress(e.target.value)} className="border border-secondary rounded-md p-2 outline-none" placeholder="Address" type="text"/>
        </div>
        <div>
          <label htmlForm="File Id">File Id</label><br />
          <input
            className="border border-secondary rounded-md p-2 outline-none"
            value={revokeFileId}
            onChange={(e) => setRevokeFileId(e.target.value)}
            placeholder="set file Id"
          />                      
        </div>
        <button className="rounded-lg bg-red-600 text-white w-auto p-4 mt-4" type="submit">Revoke User Access</button>
      </form>
    )}
  </div>
  
  
  </> 
  }
  {!address && <div className="m-auto w-3/4 text-center border-1 ">
    <p className="text-xl">
      Please Connect Wallet 

      </p></div>}
  

</main>

    </>
  );
}
