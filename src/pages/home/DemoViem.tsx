import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  Abi,
  Address,
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  parseAbi,
  custom,
  parseEther,
  Hash,
  stringify,
  WalletClient
} from 'viem'
import { LoadingButton } from '@mui/lab'
import { sepolia } from 'viem/chains'
import { addressWETH, abiERC20, address3 } from './common'

const client = createPublicClient({ chain: sepolia, transport: http() })

interface configType { abi: Abi, address: Address }
const cfg: configType = { abi: parseAbi(abiERC20), address: addressWETH }

interface IProps { amount: string }

export default function DemoViem(props: IProps) {

  const [curFn, setCurFn] = useState('')
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState<Address>()
  const [hash, setHash] = useState<Hash>()
  const [walletClient, setWalletClient] = useState<WalletClient>()

  useEffect(() => {
    console.log('set wallet client ==>')
    setWalletClient(createWalletClient({ chain: sepolia, transport: custom(window.ethereum!) }))
    return () => console.log('demo viem component unmount =xxx=')
  }, [])

  useEffect(() => {
    console.log('get address via wallet ==>', walletClient);
    (async () => {
      if (!walletClient) return
      const [address] = await walletClient.requestAddresses()
      setAccount(address)
    })()
  }, [walletClient])

  useEffect(() => {
    (async () => {
      if (!hash) { return }
      const receipt = await client.waitForTransactionReceipt({ hash })
      console.log(stringify(receipt, null, 2))
    })()
  }, [hash])

  async function providerFn() {
    console.log(props.amount)
    const blockNumber = await client.getBlockNumber()
    console.log(blockNumber)
    const block = await client.getBlock()
    console.log(block)
  }

  async function readContractFn() {
    const name = await client.readContract({ ...cfg, functionName: 'name' })
    const symbol = await client.readContract({ ...cfg, functionName: 'symbol' })
    const totalSupply = await client.readContract({ ...cfg, functionName: 'totalSupply' })
    const balanceOf = await client.readContract({ ...cfg, functionName: 'balanceOf', args: [address3] })
    console.table({
      name, symbol,
      totalSupply: formatEther(totalSupply as bigint),
      balanceOf: formatEther(balanceOf as bigint)
    })
  }

  async function sendEthFn() {
    console.table({ account })
    if (!account) return
    if (walletClient) {
      const tx = await walletClient.sendTransaction({
        account,
        to: address3,
        value: parseEther(props.amount),
        chain: undefined
      })
      console.log(tx)
    }
  }

  async function interactiveFn() {
    if (!account) return
    const amount = '0.001'
    /**
     * deposit
    const { request } = await client.simulateContract({
      ...cfg, functionName: 'deposit', account, value: parseEther(amount)
    })
     */

    /**
     * withdraw
    const { request } = await client.simulateContract({
      ...cfg, functionName: 'withdraw', account, args: [parseEther(amount)]
    })
     */

    const { request } = await client.simulateContract({
      ...cfg, account, functionName: 'transfer', args: [address3, parseEther(amount)]
    })
    if (!walletClient) return
    const hash = await walletClient.writeContract(request)
    console.table({ hash })
    setHash(hash)
  }

  const fnMap = { providerFn, readContractFn, sendEthFn, interactiveFn }

  type fnType = 'providerFn' | 'readContractFn' | 'sendEthFn' | 'interactiveFn'

  const execFn = async (key: fnType) => {
    const timer = 'viem timer: '
    console.time(timer)
    try {
      setCurFn(key)
      setLoading(true)
      console.log('==== viem ====')
      await fnMap[key]()
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
      console.timeEnd(timer)
    }
  }

  return (
    <Box className="space-x-2 my-8">
      {
        Object.keys(fnMap).map((i) => (
          <LoadingButton loading={loading && i == curFn} variant='contained' sx={{ textTransform: 'none' }} key={i} onClick={() => execFn(i as fnType)}>{i}</LoadingButton>
        ))
      }
    </Box>
  )
}
