import { Box, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import WorkIcon from '@mui/icons-material/Work';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Abi,
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
  Hash,
  http,
  parseEther,
  WalletClient
} from 'viem'
import { sepolia } from 'viem/chains'
import { stakeAbi } from '../../assets/stake'

interface cfgType {
  abi: Abi,
  address: Address
}
interface Irest {
  value?: bigint,
  args?: Array<unknown>
}
const pid = BigInt(0)
const cfg: cfgType = {
  abi: stakeAbi,
  address: '0x01A01E8B862F10a3907D0fC7f47eBF5d34190341'
}
const client = createPublicClient({ chain: sepolia, transport: http() })

export default function Withdraw() {

  const [account, setAccount] = useState<Address>()
  const [balance, setBalance] = useState('')
  const [avaBalance, setAvaBalance] = useState('')
  const [penBalance, setPenBanlanc] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [curFn, setCurFn] = useState('')
  const [hash, setHash] = useState<Hash>()
  const [walletClient, setWalletClient] = useState<WalletClient>()

  const arr = useMemo(() => [
    { label: 'Staked Amount', value: balance, icon: WorkIcon },
    { label: 'Available to Withdraw', value: avaBalance, icon: AssignmentTurnedInIcon },
    { label: 'Pending Withdraw', value: penBalance, icon: WorkHistoryIcon },
  ], [balance, avaBalance, penBalance])

  useEffect(() => {
    setWalletClient(createWalletClient({ chain: sepolia, transport: custom(window.ethereum!) }))
  }, [])

  const readFn = useCallback((async function (functionName: string, rest: Irest) {
    return await client.readContract({ ...cfg, functionName, ...rest })
  }), [])

  const getStake = useCallback(async function () {
    const data = await readFn('stakingBalance', { args: [pid, account] }) as bigint
    const balance = formatEther(data)
    setBalance(balance)
    console.table({ balance })
  }, [account, readFn])

  const getUnstake = useCallback(async function () {
    const [all, ava] = await readFn('withdrawAmount', { args: [pid, account] }) as [bigint, bigint]
    const avaVal = formatEther(ava)
    setAvaBalance(avaVal)
    const penVal = formatEther(all - ava)
    setPenBanlanc(penVal)
    console.table({ all, ava })
  }, [readFn, account])

  useEffect(() => {
    (async () => {
      if (account) {
        getStake()
        getUnstake()
      } else {
        if (walletClient) {
          const [address] = await walletClient.requestAddresses()
          setAccount(address)
        }
      }
    })()
  }, [account, walletClient, getStake, getUnstake])

  useEffect(() => {
    (async () => {
      if (hash) {
        console.log('wait for transaction receipt...')
        const receipt = await client.waitForTransactionReceipt({ hash })
        console.log(receipt)
      }
    })()
  }, [hash])

  async function writeFn(functionName: string, rest: Irest) {
    const { request } = await client.simulateContract({
      ...cfg, functionName, account, ...rest
    })
    if (walletClient) {
      const hash = await walletClient.writeContract(request)
      setHash(hash)
    }
  }

  async function handleStake() {
    await writeFn('depositETH', { value: parseEther(amount) })
  }

  async function handleUnStake() {
    await writeFn('unstake', { args: [pid, parseEther(amount)] })
  }

  async function handleWithdraw() {
    await writeFn('withdraw', { args: [pid] })
  }

  const fnMap = { getStake, handleStake, getUnstake, handleUnStake, handleWithdraw }
  type fnType = 'getStake' | 'handleStake' | 'getUnstake' | 'handleUnStake' | 'handleWithdraw'

  async function execFn(key: fnType) {
    const timer = 'time cost: '
    console.time(timer)
    setLoading(true)
    setCurFn(key)
    try {
      await fnMap[key]()
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
      console.timeEnd(timer)
    }
  }

  return (
    <Box className="p-4 space-y-2">
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {
          arr.map(i => <ListItem key={i.label}>
            <ListItemAvatar>
              <Avatar>
                <i.icon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={i.value + ' ETH'} secondary={i.label} />
          </ListItem>)
        }
      </List>
      <TextField
        autoComplete="off"
        size='small'
        onChange={(e) => setAmount(e.target.value)}
        label="Amount"
      />
      <Box className="space-x-2 py-2">
        {
          Object.keys(fnMap).map((i) => (
            <LoadingButton
              key={i}
              sx={{ textTransform: 'none' }}
              loading={loading && i == curFn}
              variant={i.startsWith('get') ? 'outlined' : 'contained'}
              onClick={() => execFn(i as fnType)}
            >{i}</LoadingButton>
          ))
        }
      </Box>
    </Box>
  )
}
