import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useWalletConnector, setNet } from "./WalletConnector.js";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import WalletConnect from "../../assets/images/wallet-logos/walletconnect.svg";
import MetaMask from "../../assets/images/wallet-logos/metamask.svg";
import TrustWallet from "../../assets/images/wallet-logos/trustwallet.svg";
import Avatar from "@mui/material/Avatar";

const wallets = [
    { label: "Metamask", value: "injected", icon: <img src={MetaMask} alt="Metamask Logo" width={40} /> },
    { label: "Wallet Connect", value: "walletconnect", icon: <img src={WalletConnect} alt="Wallet Connect Logo" width={40} /> },
    { label: "Trust Wallet ", value: "trustwallet", icon: <img src={TrustWallet} alt="Trust Wallet Logo" width={40} /> },
];

const setWalletProvider = (wallet) => {
    localStorage.setItem("wallet", wallet);
};

const NetworkWalletProviders = ({ walletProvidersDialogOpen, handleWalletProvidersDialogToggle }) => {
    const { library, account } = useWeb3React();
    const { loginMetamask, loginWalletConnect } = useWalletConnector();

    useEffect(() => {
        if (library) {
            handleWalletProvidersDialogToggle();
        }
    }, [library, account]);

    const connectWallet = async (walletprovider) => {
        localStorage.setItem("connected", true);
        setNet();
        switch (walletprovider) {
            case "injected":
                setWalletProvider("injected");
                loginMetamask();
                break;
            case "walletconnect":
                setWalletProvider("walletconnect");
                loginWalletConnect();
                break;
            case "trustwallet":
                setWalletProvider("trustwallet");
                loginWalletConnect();
                break;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (localStorage.getItem("connected")) {
            connectWallet(localStorage.getItem("wallet"));
        }
    }, []);

    return (
        <Dialog
            open={walletProvidersDialogOpen}
            onClose={handleWalletProvidersDialogToggle}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            BackdropProps={{ style: { backgroundColor: "rgba(111, 126, 140, 0.2)", backdropFilter: "blur(2px)" } }}
            PaperProps={{
                style: { borderRadius: 25, boxShadow: "none", p: "20px" },
            }}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle id="alert-dialog-title" sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Box>
                        <Typography variant="button" sx={{ fontWeight: 700 }}>
                            Connect Wallet
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={handleWalletProvidersDialogToggle} aria-label="close">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} alignItems="center" justifyContent="space-evenly">
                    {wallets.map((wallet) => (
                        <Stack
                            direction="row"
                            component={Button}
                            backgroundColor="#F0F4F5"
                            width="100%"
                            justifyContent="space-between"
                            borderRadius="20px"
                            px={3}
                            key={wallet.value}
                            onClick={() => {
                                connectWallet(wallet.value);
                            }}
                        >
                            <Typography variant="button" display="block" sx={{ fontWeight: 600 }}>
                                {wallet.label}
                            </Typography>
                            <Avatar sx={{ width: 40, height: 40 }}>{wallet.icon}</Avatar>
                            {/* </Badge> */}
                        </Stack>
                    ))}
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default NetworkWalletProviders;
