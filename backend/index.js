const { JsonRpcProvider, id, Interface, formatUnits } = require("ethers");
const { abi } = require("./paymentAbi.json");

const provider = new JsonRpcProvider("https://apechain-curtis.g.alchemy.com/v2/c0bpigJtL6UZwWMmIkZYpkeQXKXJ7G2w");  // Maybe change later to support large number of RPC calls

const CONTRACT_ADDRESS = "0x6E03e498c79bFFCd4450D634BAccA2a537A30318";  // Change later when contract deployed on mainnet

const ContractInterface = new Interface(abi);

async function pollBlock(blockNumber) {
    console.log("before logs")

    const latestBlock = await provider.getBlockNumber();
    console.log(latestBlock);
    try {
        const logs = await provider.getLogs({
            address: CONTRACT_ADDRESS,
            fromBlock: blockNumber,
            toBlock: latestBlock,
            topics: [id("paymentDone(address,uint256,string,uint256)")]
        });

        console.log("logs:", logs.length);

        logs.forEach(async log => {
            const parsedLog = ContractInterface.parseLog(log);
            const from = parsedLog.args[0].toString();
            const amount = parsedLog.args[1].toString();
            const formattedAmount = formatUnits(amount, 18);
            console.log("From :", from);
            console.log("amount :", formattedAmount);
        });
    } catch (err) {
        console.log(err);
    }
}

setInterval(() => pollBlock(15484129), 5000);
