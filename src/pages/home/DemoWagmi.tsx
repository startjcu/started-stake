import React from "react"
import {
  useAccount,
  useBalance,
  useBlock,
  useBlockNumber,
  useGasPrice,
  useReadContract,
  useSendTransaction,
  useTransactionCount,
  useWriteContract,
} from "wagmi"
import { addressWETH, abiERC20, address3 } from './common'
import { formatEther, parseAbi, parseEther } from "viem"
import { Box, Button } from '@mui/material'

export default function DemoWagmi() {

  const { address } = useAccount()

  /** contract react */
  const { writeContract } = useWriteContract()
  function interactiveFn() {
    /**
     * deposit
    writeContract({
      abi: parseAbi(abiERC20),
      address: addressWETH,
      functionName: 'deposit',
      value: parseEther('0.001')
    })
     */
    writeContract({
      abi: parseAbi(abiERC20),
      address: addressWETH,
      functionName: 'withdraw',
      args: [parseEther('0.001')]
    })
  }

  /** send ETH */
  const { sendTransaction } = useSendTransaction()
  function sendEthFn() {
    sendTransaction({
      to: address3,
      value: parseEther('0.01')
    })
  }

  /** read contract */
  const { data: wName } = useReadContract({
    abi: parseAbi(abiERC20),
    address: addressWETH,
    functionName: 'name'
  })
  const { data: wSymbol } = useReadContract({
    abi: parseAbi(abiERC20),
    address: addressWETH,
    functionName: 'symbol'
  })
  const { data: wTotalSupply } = useReadContract({
    abi: parseAbi(abiERC20),
    address: addressWETH,
    functionName: 'totalSupply'
  })
  const { data: wBalanceOf } = useReadContract({
    abi: parseAbi(abiERC20),
    address: addressWETH,
    functionName: 'balanceOf',
    args: [address]
  })

  function readContractFn() {
    console.table({
      wName,
      wSymbol,
      wTotalSupply: formatEther(wTotalSupply as bigint),
      wBalanceOf: formatEther(wBalanceOf as bigint)
    })
  }

  /** provider */
  const { data: balance } = useBalance({ address })
  const { data: block } = useBlock()
  const { data: blockNumber } = useBlockNumber()
  const { data: txCount } = useTransactionCount({ address })
  const { data: gasPrice } = useGasPrice()
  function providerFn() {
    console.table(balance)
    console.log(block)
    console.table({ blockNumber, txCount, gasPrice })
  }

  const fnObj = { providerFn, readContractFn, sendEthFn, interactiveFn }

  type fnType = 'providerFn' | 'readContractFn' | 'sendEthFn' | 'interactiveFn'

  const execFn = (key: fnType) => {
    console.log('==== wagmi ====')
    fnObj[key]()
  }

  return (
    <Box className="space-x-2 my-8">
      {
        Object.keys(fnObj).map((i) => (
          <Button variant='outlined' sx={{ textTransform: 'none' }} key={i} onClick={() => execFn(i as fnType)}>{i}</Button>
        ))
      }
    </Box>
  )
}
