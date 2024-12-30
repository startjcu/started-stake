import React, { useState } from 'react'
import { Box, Button, Divider, TextField } from '@mui/material'
import DemoEthers from './DemoEthers'
import DemoWagmi from './DemoWagmi'
import DemoViem from './DemoViem'

export default function App() {

  const [amount, setAmount] = useState('0')

  return (
    <Box className="p-4">
      <Box className="space-x-2 flex items-end pb-8">
        <TextField autoComplete="off" size='small' onChange={(e) => setAmount(e.target.value)} label="Amount" />
        <Button variant='contained' onClick={() => console.log(amount)}>InputValue</Button>
      </Box>
      <Divider textAlign='left'>Viem</Divider>
      <DemoViem amount={amount} />
      <Divider textAlign='left'>Wagmi</Divider>
      <DemoWagmi />
      <Divider textAlign='left'>Ethers</Divider>
      <DemoEthers />
    </Box>
  )
}
