import * as React from "react";
import { useState, useEffect } from "react";
import { Contract, ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import busdAbi from "../helpers/busd.json";
import mainAbi from "../helpers/contact.json";
import { GetContract } from "../helpers/Contract";
import Account from "./account";

import busdLogo from "../assets/images/busd.png";
import logo from "../assets/images/logo.png";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Typography,
    FormControl,
    OutlinedInput,
    InputAdornment,
    Stepper,
    Step,
    StepLabel,
    StepContent,
} from "@mui/material";

function Main(props) {
    const { library, account } = useWeb3React();
    const [presaleInfo, setPresaleInfo] = useState({
        hardcap: 0,
        presale_end: "",
        presale_start: "",
        raise_max: 0,
        raise_min: 0,
        token_rate: "",
    });
    const [presaleStatus, setPresaleStatus] = useState({ sold_amount: 0, raised_amount: 0, num_buyers: 0 });
    const [buyerInfo, setBuyerInfo] = useState({ base: 0, sale: 0 });
    const [presaleStep, setStep] = useState(0);
    const [vestingStep, setVestingStep] = useState(0);
    const [steps, setLockDate] = useState([
        {
            label: "25%",
            description: ``,
        },
        {
            label: "50%",
            description: ``,
        },
        {
            label: "75%",
            description: ``,
        },
        {
            label: "100%",
            description: ``,
        },
    ]);
    const [busd, setBusd] = useState(0);
    const presaleContract = GetContract("0xDB2967863cD12Be343D40Cb08ec96539E1CDee0b", mainAbi);
    const busdContract = GetContract("0xC20B7806aE386ACe91b529076867E8eFd6a09D22", busdAbi);
    const convert = (val) => {
        return ethers.utils.formatUnits(val, 18).toString() * 1;
    };
    const convertDate = (val) => {
        let d = new Date(val);
        let dformat =
            [d.getUTCFullYear(), ("0" + (d.getUTCMonth() + 1)).slice(-2), ("0" + d.getUTCDate()).slice(-2)].join("-") +
            " " +
            [("0" + d.getUTCHours()).slice(-2), ("0" + d.getUTCMinutes()).slice(-2), ("0" + d.getUTCSeconds()).slice(-2)].join(":");
        return dformat;
    };
    const handleBuy = async () => {
        if (!account) {
            alert("connect wallet first");
            return;
        }
        let buffer = await busdContract.approve("0xDB2967863cD12Be343D40Cb08ec96539E1CDee0b", (busd * Math.pow(10, 18)).toString());
        await buffer.wait();
        await presaleContract.userDeposit((busd * Math.pow(10, 18)).toString());
    };
    const handleWithdraw = () => {
        if (!account) alert("connect wallet first");
    };

    const setValues = async () => {
        await presaleContract.presale_info().then((val) => {
            console.log(val, "----------------------contractinfo");
            console.log(convert(val.token_rate));
            setPresaleInfo(val);
            setLockDate([
                {
                    label: "25%",
                    description: convertDate(val.presale_end * 1000 + 30 * 24 * 60 * 60 * 1000),
                },
                {
                    label: "50%",
                    description: convertDate(val.presale_end * 1000 + 60 * 24 * 60 * 60 * 1000),
                },
                {
                    label: "75%",
                    description: convertDate(val.presale_end * 1000 + 90 * 24 * 60 * 60 * 1000),
                },
                {
                    label: "100%",
                    description: convertDate(val.presale_end * 1000 + 120 * 24 * 60 * 60 * 1000),
                },
            ]);
        });
        await presaleContract.status().then((val) => {
            console.log(val, "-----------------status");
            setPresaleStatus(val);
        });
        await presaleContract.buyers(account).then((val) => {
            console.log(val, "-----------------------buyerinfo");
            setBuyerInfo(val);
        });
        await presaleContract.PreSaleStatus().then((val) => {
            console.log(ethers.utils.formatUnits(val, 0).toString() * 1, "--------------------presale status");
            setStep(ethers.utils.formatUnits(val, 0).toString() * 1);
        });
        await presaleContract.delayStep().then((val) => {
            console.log(ethers.utils.formatUnits(val, 0).toString() * 1, "--------------------lock status");
            setVestingStep(ethers.utils.formatUnits(val, 0).toString() * 1);
        });
    };
    useEffect(() => {
        if (account) {
            setValues();
        }
    }, [account]);

    return (
        <Box sx={{ maxWidth: "1200px", m: "auto" }}>
            <Box sx={{ float: "right", mt: 2, mr: 5 }}>
                <Account />
            </Box>
            <Grid container spacing={0}>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ m: 3, backgroundColor: "#1A1D1C", color: "white", borderRadius: "20px" }} className="mCard">
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", mb: 3 }}>
                                <Box
                                    component="img"
                                    src={logo}
                                    sx={{ float: "left", borderRadius: "20px", width: { sm: "150px", xs: "100px" } }}
                                    alt="BUSD"
                                />
                                <Typography sx={{ ml: 5, my: "auto", fontSize: { sm: "30px", xs: "20px" } }}>MYUNI Pre-sale</Typography>
                            </Box>
                            <Box className="spaceBetween">
                                <Typography variant="h6" component="span">
                                    Token Rate:
                                </Typography>
                                <Typography variant="h6" component="span">
                                    {presaleInfo.token_rate === "" ? "" : 1 / ethers.utils.formatUnits(presaleInfo.token_rate, 0)} BUSD
                                </Typography>
                            </Box>
                            <Box className="spaceBetween">
                                <Typography variant="h6" component="span">
                                    Hardcap:
                                </Typography>
                                <Typography variant="h6" component="span">
                                    {convert(presaleInfo.hardcap)} BUSD
                                </Typography>
                            </Box>
                            <Box className="spaceBetween">
                                <Typography variant="h6" component="span">
                                    Buy min:
                                </Typography>
                                <Typography variant="h6" component="span">
                                    {convert(presaleInfo.raise_min)} BUSD
                                </Typography>
                            </Box>
                            <Box className="spaceBetween">
                                <Typography variant="h6" component="span">
                                    Buy max:
                                </Typography>
                                <Typography variant="h6" component="span">
                                    {convert(presaleInfo.raise_max)} BUSD
                                </Typography>
                            </Box>
                            <Box className="spaceBetween">
                                <Typography variant="h6" component="span">
                                    Start
                                </Typography>
                                <Typography variant="h6" component="span">
                                    {convertDate(presaleInfo.presale_start * 1000)} (UTC)
                                </Typography>
                            </Box>
                            <Box className="spaceBetween">
                                <Typography variant="h6" component="span">
                                    End
                                </Typography>
                                <Typography variant="h6" component="span">
                                    {convertDate(presaleInfo.presale_end * 1000)} (UTC)
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card sx={{ m: 3, backgroundColor: "#1A1D1C", color: "white", borderRadius: "20px" }} className="mCard">
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom component="div" sx={{ borderBottom: "solid 6px", pb: 1 }}>
                                Pre-sale Status
                            </Typography>
                            <Box className="spaceBetween">
                                <Typography variant="h6" component="span">
                                    Raised Amount
                                </Typography>
                                <Typography variant="h6" component="span">
                                    {convert(presaleStatus.raised_amount)} BUSD
                                </Typography>
                            </Box>
                            <Box className="spaceBetween">
                                <Typography variant="h6" component="span">
                                    Sold Amount
                                </Typography>
                                <Typography variant="h6" component="span">
                                    {convert(presaleStatus.sold_amount)} MYUNI
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ m: 3, backgroundColor: "#1A1D1C", color: "white", borderRadius: "20px" }} className="mCard">
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom component="div" sx={{ borderBottom: "solid 6px", pb: 1 }}>
                                Buyer Information
                            </Typography>
                            <Box className="spaceBetween">
                                <Typography variant="h6" component="span">
                                    Invested
                                </Typography>
                                <Typography variant="h6" component="span">
                                    {convert(buyerInfo.base)} BUSD
                                </Typography>
                            </Box>
                            <Box className="spaceBetween">
                                <Typography variant="h6" component="span">
                                    MYUNI Amount
                                </Typography>
                                <Typography variant="h6" component="span">
                                    {convert(buyerInfo.sale)} MYUNI
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: "center", mt: 3 }}>
                                <Typography variant="h6" component="span">
                                    Unlock 25% at TGE, vesting in 4 stages:
                                </Typography>
                                <Stepper activeStep={vestingStep} orientation="vertical">
                                    {steps.map((step, index) => (
                                        <Step key={step.label}>
                                            <StepLabel
                                                sx={{
                                                    "& .MuiStepLabel-label": { color: "white !important" },
                                                    "& svg.Mui-completed": { color: "#4d5f6b" },
                                                    "& svg.Mui-active": { color: "#4d5f6b" },
                                                }}
                                                optional={
                                                    <Typography sx={{ color: "white" }} variant="caption">
                                                        {step.description}
                                                    </Typography>
                                                }
                                            >
                                                {step.label}
                                            </StepLabel>
                                            {/* <StepContent>
                                                <Typography>{step.description}</Typography>
                                            </StepContent> */}
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>

                            <Box sx={{ mt: 3, display: presaleStep === 1 ? "flex" : "none" }}>
                                <Box sx={{ width: { xs: 110, sm: 160 }, float: "left" }} component="img" src={busdLogo} alt="BUSD" />
                                <Box sx={{ my: "auto", ml: 3, textAlign: "center" }}>
                                    <FormControl>
                                        <OutlinedInput
                                            value={busd}
                                            sx={{
                                                backgroundColor: "white",
                                                "& .MuiOutlinedInput-notchedOutline legend": { display: "none" },
                                                "& .MuiOutlinedInput-notchedOutline": { display: "none" },
                                            }}
                                            onChange={(e) => {
                                                setBusd(e.target.value);
                                            }}
                                            endAdornment={<InputAdornment position="end">BUSD</InputAdornment>}
                                        />
                                    </FormControl>

                                    <Button
                                        variant="contained"
                                        disableElevation
                                        onClick={handleBuy}
                                        sx={{ mt: 2, backgroundColor: "#4d5f6b", "&:hover": { backgroundColor: "#04070c" } }}
                                    >
                                        Buy
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{ justifyContent: "center", mt: 3, display: presaleStep === 2 ? "flex" : "none" }}>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    onClick={handleWithdraw}
                                    sx={{ mt: 2, backgroundColor: "#4d5f6b", "&:hover": { backgroundColor: "#04070c" } }}
                                >
                                    Withdraw
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Main;
