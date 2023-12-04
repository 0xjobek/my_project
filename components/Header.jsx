import Link from "next/link";

export default function Header({address, clickButton, otherButton}) {

  return (
    <nav className="bg-black w-full text-white md:px-32 px-3 flex justify-center">

          <div>
            <button
              onClick={clickButton}
              className="border border-[#fff] px-6 py-2.5 font-medium"
            >
              {address
                ? `${address.slice(0, 5)}...${address.slice(30, 40)}`
                : "Connect Wallet"}
            </button>
          </div>
        
          {address && <Link href="/files"
              
              className="border border-[#fff] px-6 py-2.5 font-medium block ml-auto text-white"
            >
              View FileHistory
            </Link>}

    </nav>
  );
}