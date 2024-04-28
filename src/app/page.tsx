'use client'

import { useAccount, useBalance, useChainId, useConfig, useConnect, useDisconnect, useReadContract, useReadContracts } from 'wagmi'
import { writeContract } from 'wagmi/actions'
import { Address, formatUnits, parseEther } from 'viem'
import { COMPTROLLER_PROXY_ADDRESS } from "@/constants"
function App() {
  const config = useConfig()
  // console.log("chain",chain)
  const account = useAccount()
  const balance = useBalance({ address: account.address })
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  // console.log(account)
  // console.log("COMPTROLLER_PROXY_ADDRESS[account.chainId!]",COMPTROLLER_PROXY_ADDRESS[account.chainId!])
  const { data: getAllMarkets } = useReadContract({
    abi: [
      {
        "inputs": [],
        "name": "getAllMarkets",
        "outputs": [
          {
            "internalType": "contract MToken[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
    ],
    address: COMPTROLLER_PROXY_ADDRESS[account.chainId!],
    functionName: 'getAllMarkets',
  })
  // console.log("getAllMarkets",getAllMarkets)
  const contracts = getAllMarkets?.map(address => ({
    address,
    abi: [{
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }],
    functionName: "name",

  } as const))


  const { data: allMarketNames } = useReadContracts({
    contracts: contracts,

  })
  //  console.log(allMarketNames)
  const markets = (getAllMarkets && allMarketNames) ? getAllMarkets.map((market, index) => ({ address: market, name: allMarketNames![index].result ?? "" })) : []
  // console.log(markets)

  const onClaim = async (userAddress: Address, mtoken: Address, chainId: number) => {
    try {
      const result = await writeContract(config, {
        abi: [{
          "inputs": [
            {
              "internalType": "address",
              "name": "holder",
              "type": "address"
            },
            {
              "internalType": "contract MToken[]",
              "name": "mTokens",
              "type": "address[]"
            }
          ],
          "name": "claimReward",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }] as const,
        address: COMPTROLLER_PROXY_ADDRESS[chainId],
        functionName: 'claimReward',
        args: [userAddress, [mtoken]]
      })
      alert(`Check the transaction on your wallet or block explorer: ${result}`)
    } catch (error:any) {
      alert(error.message)
    }
  }

  return (
    <main style={{
      margin: 'auto',
      maxWidth: '1024px',
      paddingTop: "2rem"
    }}>
      <div>
        <h2>Account</h2>
        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chain?.name}
          <br />
          balance : {balance.data?.value && `${formatUnits(balance.data.value, 18)} ${balance.data.symbol}`}
        </div>

        {account.status === 'connected' ?
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
          :
          <div>
            <h2>Connect</h2>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                type="button"
              >
                {connector.name}
              </button>
            ))}
            {/* <div>{status}</div> */}
            <div>{error?.message}</div>
          </div>
        }
      </div>
      <div style={{paddingBlock:"1rem"}}>
        <p>This app allows you to claim rewards from the different <a href='https://moonwell.fi' target='_blank'>Moonwell</a> markets without using the button on the frontend.</p>
        <p><span style={{fontWeight:'bold'}}>Why do you need this?</span> Because the button on Moonwell's frontend claims rewards for all the markets and that is gas consuming (hence making you pay more gas).</p>
        <p>I did this because i'm lazy enough to not do this via etherscan every time, and also because i dont want to pay more fees than i should. The code is open and you can find it at the footer.</p>
        <p style={{color:'red'}}>You can also do this by yourself on etherscan, go to the Comptroller contract, get the contract address for the market you are in and then use the claimRewards function using your address and the market address</p>
      </div>
      {account.isConnected &&
        <div>
          <div style={{ paddingBlock: '1rem' }}>
            <h2>Current markets at {account.chain?.name}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', gap: "1rem" }}>
              {markets?.map(m => (
                <div key={m.address} style={{ padding: '1rem', border: "1px solid white" }}>
                  <p>{m.name}</p>
                  <p style={{ wordBreak: 'break-all', fontSize: '12px' }}>{m.address}</p>
                  <button onClick={() => onClaim(account.address!, m.address, account.chainId!)}>claim rewards</button>
                </div>
              ))}
            </div>
          </div>
        </div>

      }
    </main>
  )
}

export default App
