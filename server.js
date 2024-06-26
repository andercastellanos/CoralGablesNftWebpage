const express = require('express');
const Web3 = require('web3');
const { OpenSeaPort, Network } = require('opensea-js');

const app = express();
app.use(express.json());

// Private key and account address
const privateKey = 'YOUR_PRIVATE_KEY'; // Replace with your private key
const accountAddress = 'YOUR_ACCOUNT_ADDRESS'; // Replace with your wallet address

const avalancheRpcUrl = 'https://api.avax.network/ext/bc/C/rpc'; // Avalanche Mainnet RPC URL

const web3 = new Web3(new Web3.providers.HttpProvider(avalancheRpcUrl));
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const seaport = new OpenSeaPort(web3.currentProvider, {
    networkName: Network.Main,
});

const transferNFT = async (recipientAddress, tokenAddress, tokenId) => {
    try {
        const transactionHash = await seaport.transfer({
            asset: {
                tokenId,
                tokenAddress,
                schemaName: "ERC-1155", // or "ERC1155" depending on your NFT type
            },
            fromAddress: accountAddress,
            toAddress: recipientAddress,
        });

        return transactionHash;
    } catch (error) {
        throw new Error("Transfer failed: " + error.message);
    }
};

app.post('/transfer', async (req, res) => {
    const { recipientAddress, tokenAddress, tokenId } = req.body;

    try {
        const transactionHash = await transferNFT(recipientAddress, tokenAddress, tokenId);
        res.status(200).send('Transfer successful, transaction hash: ' + transactionHash);
    } catch (error) {
        res.status(500).send('Transfer failed: ' + error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
