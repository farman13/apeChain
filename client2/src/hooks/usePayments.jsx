import { useWriteContract } from 'wagmi';
import paymentAbi from '../ABIs/paymentAbi.json';
import tokenAbi from '../ABIs/tokenAbi.json';

export const usePayments = () => {

    const TokenAbi = tokenAbi.abi;
    const PaymentAbi = paymentAbi.abi;

    const { data: hash, writeContractAsync } = useWriteContract();

    const sendpayment = async (amount, purpose) => {
        try {
            await writeContractAsync({
                abi: TokenAbi,
                address: '0xe80350e7A905ac1b52D21C091B224Cf36D161B64',  // DUMMY TOKEN ADDRESS replace it with actual apeCoin address  ,STORE IN .ENV
                functionName: 'approve',
                args: [
                    '0x31AeBEF7D5DF572ac846d42314BB8C4AE9609Cc1',  // CONTRACT ADDRESS change later ,STORE IN .ENV 
                    amount,
                ],
            })

        } catch (error) {
            console.log("Error in apporve", error);
        }
        try {
            await writeContractAsync({
                abi: PaymentAbi,
                address: '0x31AeBEF7D5DF572ac846d42314BB8C4AE9609Cc1',  // CONTRACT ADDRESS change later , STORE IN .ENV
                functionName: 'processPayment',
                args: [
                    amount,
                    purpose
                ],
            })
        } catch (error) {
            console.log("Error in sending", error);
        }

    }
    return { sendpayment }
}