import { useRef } from "react";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
import { usePayments } from "../hooks/usePayments";

const SendMessage = () => {

    const amountRef = useRef();
    const purposeRef = useRef();

    const { isConnected } = useAccount();
    const { sendpayment } = usePayments();  // Using hook 

    if (!isConnected) {
        return null;
    }

    function send() {
        const inputValue = amountRef.current.value;
        const amount = parseUnits(inputValue, 18);
        const purpose = purposeRef.current.value;
        sendpayment(amount, purpose);
    }
    return (
        <>
            <input type="text" placeholder='amount' ref={amountRef} /> <input type="text" placeholder='purpose' ref={purposeRef} />
            <button onClick={send}>Send tokens</button>
        </>
    )
};

export default SendMessage;