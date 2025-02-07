const { JsonRpcProvider, id, Interface, formatUnits } = require("ethers");
const { abi } = require("./paymentAbi.json");

const provider = new JsonRpcProvider("https://apechain-curtis.g.alchemy.com/v2/c0bpigJtL6UZwWMmIkZYpkeQXKXJ7G2w");  // Maybe change later to support large number of RPC calls and store in .env

const CONTRACT_ADDRESS = "0x6E03e498c79bFFCd4450D634BAccA2a537A30318";  // Change later when contract deployed on mainnet and store in .env

const ContractInterface = new Interface(abi);

// STORED IN DB WITH NULL VALUE OR 0  
const lastProcessedBlock = 15484129;  // for testing purpose  


async function pollBlock(lastProcessedBlock) {      // change this argument form blocknumber => lastProcessedBlock
    console.log("before logs")


    try {

        const latestBlock = await provider.getBlockNumber();
        console.log(latestBlock);

        /* RETRIEVING lastProcessedBlock FROM THE DB
        let lastProcessedBlock = await prisma.networkStatus.findUnique({
            // some condition
          });
        
          // RUNS WHEN SERVER FIRSTLY STARTS
          if (!lastProcessedBlock) {
            const data = await prisma.networkStatus.create({
            //set lastProcessedBlock as latest block.
            });
        
          }

          */
        if (lastProcessedBlock >= latestBlock) {
            return;
        }

        const logs = await provider.getLogs({
            address: CONTRACT_ADDRESS,
            fromBlock: lastProcessedBlock + 1,
            toBlock: latestBlock,
            topics: [id("paymentDone(address,uint256,string,uint256)")]
        });

        console.log("logs:", logs.length);

        logs.forEach(async log => {
            const parsedLog = ContractInterface.parseLog(log);
            // console.log(log)   // if u need more info about the txn isko dekh lena 

            const txnHash = log.transactionHash;
            const from = parsedLog.args[0].toString();
            const amount = parsedLog.args[1].toString();
            const formattedAmount = formatUnits(amount, 18);

            // STORE THIS IN DB
            console.log("Txn Hash :", txnHash);
            console.log("From :", from);
            console.log("amount :", formattedAmount);

        });
    } catch (err) {
        console.log(err);
    }
}

setInterval(() => pollBlock(lastProcessedBlock), 5000);
