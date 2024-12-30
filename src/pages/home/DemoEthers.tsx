import React, { useState } from 'react'
import { Box } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { JsonRpcProvider, Contract, Wallet, formatEther, parseEther } from 'ethers'
import { addressWETH, abiERC20, address3 } from './common'

const rpcUrl = 'https://eth-sepolia.public.blastapi.io'
const address = '0xad64812Acc6C927dFE4334eE8c99F25bdcBC02E4'

export default function DemoEthers() {

  const [curFn, setCurFn] = useState('')
  const [loading, setLoading] = useState(false)

  async function providerFn() {
    const provider = new JsonRpcProvider(rpcUrl)
    console.log('getBalance =>')
    const data = await provider.getBalance(address)
    console.table({ data, ETH: formatEther(data) })
    console.log('getNetwork =>')
    const network = await provider.getNetwork()
    console.table({ network: network.toJSON() })
    console.log('getBlockNumber =>')
    const blockNumber = await provider.getBlockNumber()
    console.table({ blockNumber })
    console.log('getBlock =>')
    const block = await provider.getBlock(blockNumber)
    console.log(block)
    console.log('getTransactionCount =>')
    const txCount = await provider.getTransactionCount(address!)
    console.table({ txCount })
    console.log('getFeeData =>')
    const feeData = await provider.getFeeData()
    console.log(feeData.gasPrice)
    console.log('getCode =>')
    const code = await provider.getCode('0x44419af9F4844A04DD9531a0F18b3789DaE74f70')
    console.log(code)
  }

  async function readContractFn() {
    const provider = new JsonRpcProvider(rpcUrl)
    const contract = new Contract(addressWETH, abiERC20, provider)
    console.log('contract name =>')
    const nameWETH = await contract.name()
    console.table({ nameWETH })
    console.log('contract symbol =>')
    const symbolWETH = await contract.symbol()
    console.table({ symbolWETH })
    console.log('contract total supply =>')
    const totalSupplyWETH = await contract.totalSupply()
    console.table({ totalSupplyWETH: formatEther(totalSupplyWETH) })
    console.log('balance of ' + address)
    const balanceWETH = await contract.balanceOf(address)
    console.table({ balanceWETH: formatEther(balanceWETH) })
  }

  async function sendEthFn() {
    const provider = new JsonRpcProvider(rpcUrl)
    const wallet = new Wallet(process.env.tempkey!, provider)
    console.log('send transaction =>')
    const tx = await wallet.sendTransaction({
      to: address3,
      value: parseEther('0.01')
    })
    console.log('wait...')
    await tx.wait()
    console.log(tx)
  }

  async function interactiveFn() {
    const type = 'D'
    const provider = new JsonRpcProvider(rpcUrl)
    const wallet = new Wallet(process.env.tempkey!, provider)
    const contract = new Contract(addressWETH, abiERC20, wallet)
    const address = wallet.getAddress()
    let balance = await contract.balanceOf(address)
    console.table({ desc: 'before =>', balance: formatEther(balance) })
    let tx
    if (type == 'D') {
      console.log('deposit =>')
      tx = await contract.deposit({ value: parseEther('0.001') })
    } else if (type == 'W') {
      console.log('withdraw =>')
      tx = await contract.withdraw(parseEther('0.001'))
    } else if (type == 'T') {
      console.log('transfer =>')
      tx = await contract.transfer(address3, parseEther('0.001'))
    }
    await tx!.wait()
    console.log(tx)
    balance = await contract.balanceOf(address)
    console.table({ desc: 'after =>', balance: formatEther(balance) })
  }

  const fnObj = { providerFn, readContractFn, sendEthFn, interactiveFn }

  type fnType = 'providerFn' | 'readContractFn' | 'sendEthFn' | 'interactiveFn'

  const execFn = async (key: fnType) => {
    setCurFn(key)
    setLoading(true)
    console.log('==== ethers ====')
    const timer = 'ethers timer: '
    console.time(timer)
    await fnObj[key]()
    console.timeEnd(timer)
    setLoading(false)
  }

  return (
    <Box className="space-x-2 my-8">
      {
        Object.keys(fnObj).map((i) => (
          <LoadingButton loading={loading && i == curFn} variant='contained' sx={{ textTransform: 'none' }} key={i} onClick={() => execFn(i as fnType)}>{i}</LoadingButton>
        ))
      }
    </Box>
  )
}
