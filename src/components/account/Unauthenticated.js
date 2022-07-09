import { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import WalletProviders from "./NetworkWalletProviders";

const Unauthenticated = (props) => {
    const [walletProvidersDialogOpen, setWalletProvidersDialogOpen] = useState(false);

    const handleWalletProvidersDialogToggle = () => {
        setWalletProvidersDialogOpen(!walletProvidersDialogOpen);
    };

    return (
        <Fragment>
            <Button
                variant="contained"
                disableElevation
                onClick={handleWalletProvidersDialogToggle}
                sx={{
                    width: props.width,
                    borderRadius: 25,
                    fontSize: "0.8rem",
                    boxShadow: "rgb(0 0 0 / 8%) 0px 8px 28px",
                    backgroundColor: props.color,
                    "&:hover": { backgroundColor: props.hoverColor },
                }}
            >
                Connect Wallet
            </Button>
            <WalletProviders
                walletProvidersDialogOpen={walletProvidersDialogOpen}
                handleWalletProvidersDialogToggle={handleWalletProvidersDialogToggle}
            />
        </Fragment>
    );
};

export default Unauthenticated;
