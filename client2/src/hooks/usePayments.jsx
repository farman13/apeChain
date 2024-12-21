import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import paymentAbi from '../ABIs/paymentAbi.json';
import tokenAbi from '../ABIs/tokenAbi.json';

export const usePayments = () => {

    const TokenAbi = tokenAbi.abi;
    const PaymentAbi = paymentAbi.abi;

    const { data: hash, writeContractAsync } = useWriteContract();
    const { data } = useWaitForTransactionReceipt({ hash });

    const sendpayment = async (amount, purpose) => {
        try {
            await writeContractAsync({
                abi: TokenAbi,
                address: '0xe80350e7A905ac1b52D21C091B224Cf36D161B64',
                functionName: 'approve',
                args: [
                    '0x49Ec91C42be262c1E871b423B9C73F54D7D1E0e3',
                    amount,
                ],
            })

        } catch (error) {
            console.log("Error in apporve", error);
        }
        try {
            await writeContractAsync({
                abi: PaymentAbi,
                address: '0x31AeBEF7D5DF572ac846d42314BB8C4AE9609Cc1',
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