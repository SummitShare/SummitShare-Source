import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { ethers } from 'ethers';
import { contracts } from '@/utils/dev/contractInit';

interface Token {
    name: string;
    address: string;
    decimals: number;
}

const DonationForm = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [values, setValues] = useState({
        amount: '',
        tokenName: '',
        decimals: 18,  // init with a default to tell react its a number 
        toProject: true, // Donation target controller
        donorName: '',
        isAnonymous: false
    });

    // Effect to fetch token data on component mount
    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await fetch('/api/tokenConfig');
                if (!response.ok) throw new Error('Failed to fetch tokens');
                const data = await response.json();
                setTokens(data);
            } catch (error) {
                console.error("Error fetching tokens:", error);
            }
        };
        fetchTokens();
    }, []);
    

    // Handle token selection change
    const handleTokenChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedToken = tokens.find(token => token.name === event.target.value as string);
        if (selectedToken) {
            setValues(v => ({
                ...v,
                tokenName: selectedToken.name,
                decimals: selectedToken.decimals
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!window.ethereum) {
            alert('Please install MetaMask to use this feature.');
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();

            const selectedToken = tokens.find(token => token.name === values.tokenName);
            if (!selectedToken) {
                alert('Token selection error. Please try again.');
                return;
            }

            const donationsContract = contracts.getDonations("DONATIONS_CONTRACT_ADDRESS");
            const transaction = await donationsContract.donate(
                ethers.utils.parseUnits(values.amount, selectedToken.decimals),
                selectedToken.address,
                values.toProject,
                values.donorName,
                values.isAnonymous
            );
            await transaction.wait();
            alert('Donation successful!');
        } catch (error) {
            console.error('Failed to submit donation:', error);
            alert('Failed to submit donation. See console for details.');
        }
    };

    // UI for the donation form
    return (
        <div>
            <Typography variant="h4" gutterBottom>Donate to SummitShare</Typography>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Donation Amount" type="number" name="amount" value={values.amount} onChange={(e: { target: { value: any; }; }) => setValues({ ...values, amount: e.target.value })} margin="normal"/>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Token</InputLabel>
                    <Select name="tokenName" value={values.tokenName} onChange={(e: { target: { value: any; }; }) => setValues({ ...values, amount: e.target.value })} label="Token">
                        {tokens.map((token) => (
                            <MenuItem key={token.name} value={token.name}>{token.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Donate To</InputLabel>
                    <Select name="toProject" value={values.toProject} onChange={(e: { target: { value: any; }; }) => setValues({ ...values, amount: e.target.value })} label="Donate To">
                        <MenuItem value={true}>Project</MenuItem>
                        <MenuItem value={false}>Heritage Community</MenuItem>
                    </Select>
                </FormControl>
                <TextField fullWidth label="Donor Name (Optional)" type="text" name="donorName" value={values.donorName} onChange={(e: { target: { value: any; }; }) => setValues({ ...values, amount: e.target.value })} margin="normal"/>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Anonymous Donation</InputLabel>
                    <Select name="isAnonymous" value={values.isAnonymous} onChange={(e: { target: { value: any; }; }) => setValues({ ...values, amount: e.target.value })} label="Anonymous Donation">
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">Donate</Button>
            </form>
        </div>
    );
};

export default DonationForm;