require('dotenv').config()
const ethers = require('ethers')

//profider config
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_ID}`)

//sender
const rs1 =''

//recievers
const rs2 = '' 
const rs3 = '' 

//contract depolyed on sepolia testnet
const rvs=""

// contract funder Private key of account 1
const rs1privateKey = process.env.CONTRACT_FUNDER_PRIVATE_KEY 
const rs1wallet = new ethers.Wallet(rs1privateKey, provider)

//function to fund contract
const main = async () => {
  const rs1BalanceBefore = await provider.getBalance(rs1)
  const rs2BalanceBefore = await provider.getBalance(rs2)
  const rs3BalanceBefore = await provider.getBalance(rs3)

  //logging balances
  console.log(`\nSender balance before (rs1): ${ethers.formatEther(rs1BalanceBefore)}\n`)
  console.log(`reciever balance before (rs2): ${ethers.formatEther(rs2BalanceBefore)}\n`)
  console.log(`reciever balance before (rs3): ${ethers.formatEther(rs3BalanceBefore)}\n`)
  
  //send to contract
  const tx = await rs1wallet.sendTransaction({
      to: rvs,
      value: ethers.parseEther("0.10")
  })

  await tx.wait()

  const rs1BalanceAfter = await provider.getBalance(rs1)
  const rs2BalanceAfter = await provider.getBalance(rs2)
  const rs3BalanceAfter = await provider.getBalance(rs3)

    //logging balances
  console.log(`\nSender balance after (rs1): ${ethers.formatEther(rs1BalanceAfter)}\n`)
  console.log(`reciever balance after (rs2): ${ethers.formatEther(rs2BalanceAfter)}\n`)
  console.log(`reciever balance after (rs3): ${ethers.formatEther(rs3BalanceAfter)}\n`)
}

main()
