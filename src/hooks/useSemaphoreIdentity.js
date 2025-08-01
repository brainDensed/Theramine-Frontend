import { Identity } from "@semaphore-protocol/identity";
import { useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi"

export const useSemaphoreIdentity = () => {
    const {address} = useAccount();
    const {signMessageAsync} = useSignMessage();
    const [identity, setIdentity] = useState();

    useEffect(() => {
        const generateIdentity = async () => {
            const identity = new Identity();
            const privateKey = identity.export();
            
        }
    }, [])
}