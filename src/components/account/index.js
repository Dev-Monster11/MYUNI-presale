import { useWeb3React } from "@web3-react/core";
import Authenticated from "./Authenticated";
import Unauthenticated from "./Unauthenticated";

function Account() {
    const { library, account } = useWeb3React();
    let width = "160px";
    let color = "#4d5f6b";
    let hoverColor = "#04070c";
    if (library) return <Authenticated library={library} account={account} width={width} color={color} hoverColor={hoverColor} />;

    return <Unauthenticated width={width} color={color} hoverColor={hoverColor} />;
}

export default Account;
