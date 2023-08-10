require('dotenv').config()
const {ethers,Contract} = require('ethers')

//ABI of deployed contract
const ABI = require('./ABI.json')
  
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_ID}`)
//private key of wallet which deployed contract 
//only deployer of contract can call distribute 
const signer = new ethers.Wallet(process.env.CONTRACT_OWNER_PRIVATE_KEY,provider)

//sender
const rs1 ='0x9F95C1bc9F4e4A2d738F02d81Fc2A618334Aa81c'
//recievers
const rs2 = '0x3c622F22345EaB4f9e189e090Dee1Fb9EFF74f65'
const rs3 = '0xa9190D166Ca80A78Ef3da660c9dE996dA7477B85'

//contract depolyed on sepolia testnet
//funds have already been distributed once
const rvs="0x2F864185376b9AcFdd67483E5E6952F381d7bAC0"

//function to distribute funds
const main = async () => {
  const rs1BalanceBefore = await provider.getBalance(rs1)
  const rs2BalanceBefore = await provider.getBalance(rs2)
  const rs3BalanceBefore = await provider.getBalance(rs3)

  //logging balances
  console.log(`\nSender balance before (rs1): ${ethers.formatEther(rs1BalanceBefore)}\n`)
  console.log(`reciever balance before (rs2): ${ethers.formatEther(rs2BalanceBefore)}\n`)
  console.log(`reciever balance before (rs3): ${ethers.formatEther(rs3BalanceBefore)}\n`)
  
  //distribute
  async function distributeFunds() {
    const distribute = new Contract(rvs,ABI,signer) 
    let tx = await distribute.distributeFunds()
    console.log(tx)
  }

  distributeFunds()
  

  const rs1BalanceAfter = await provider.getBalance(rs1)
  const rs2BalanceAfter = await provider.getBalance(rs2)
  const rs3BalanceAfter = await provider.getBalance(rs3)

  //logging balances
  console.log(`\nSender balance after (rs1): ${ethers.formatEther(rs1BalanceAfter)}\n`)
  console.log(`reciever balance after (rs2): ${ethers.formatEther(rs2BalanceAfter)}\n`)
  console.log(`reciever balance after (rs3): ${ethers.formatEther(rs3BalanceAfter)}\n`)
}

main()

