"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Etherscan = void 0;
const plugins_1 = require("hardhat/plugins");
const errors_1 = require("./errors");
const undici_1 = require("./undici");
const utilities_1 = require("./utilities");
const chain_config_1 = require("./chain-config");
// Used for polling the result of the contract verification.
const VERIFICATION_STATUS_POLLING_TIME = 3000;
/**
 * Etherscan verification provider for verifying smart contracts.
 * It should work with other verification providers as long as the interface
 * is compatible with Etherscan's.
 */
class Etherscan {
    /**
     * Create a new instance of the Etherscan verification provider.
     * @param apiKey - The Etherscan API key.
     * @param apiUrl - The Etherscan API URL, e.g. https://api.etherscan.io/api.
     * @param browserUrl - The Etherscan browser URL, e.g. https://etherscan.io.
     */
    constructor(apiKey, apiUrl, browserUrl) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.browserUrl = browserUrl;
    }
    static async getCurrentChainConfig(networkName, ethereumProvider, customChains) {
        const currentChainId = parseInt(await ethereumProvider.send("eth_chainId"), 16);
        const currentChainConfig = [
            // custom chains has higher precedence than builtin chains
            ...[...customChains].reverse(),
            ...chain_config_1.builtinChains,
        ].find(({ chainId }) => chainId === currentChainId);
        if (currentChainConfig === undefined) {
            if (networkName === plugins_1.HARDHAT_NETWORK_NAME) {
                throw new errors_1.HardhatNetworkNotSupportedError();
            }
            throw new errors_1.ChainConfigNotFoundError(currentChainId);
        }
        return currentChainConfig;
    }
    static fromChainConfig(apiKey, chainConfig) {
        const resolvedApiKey = resolveApiKey(apiKey, chainConfig.network);
        const apiUrl = chainConfig.urls.apiURL;
        const browserUrl = chainConfig.urls.browserURL.trim().replace(/\/$/, "");
        return new Etherscan(resolvedApiKey, apiUrl, browserUrl);
    }
    /**
     * Check if a smart contract is verified on Etherscan.
     * @link https://docs.etherscan.io/api-endpoints/contracts#get-contract-source-code-for-verified-contract-source-codes
     * @param address - The address of the smart contract.
     * @returns True if the contract is verified, false otherwise.
     */
    async isVerified(address) {
        const parameters = new URLSearchParams({
            apikey: this.apiKey,
            module: "contract",
            action: "getsourcecode",
            address,
        });
        const url = new URL(this.apiUrl);
        url.search = parameters.toString();
        const response = await (0, undici_1.sendGetRequest)(url);
        const json = await response.body.json();
        if (json.message !== "OK") {
            return false;
        }
        const sourceCode = json?.result?.[0]?.SourceCode;
        return sourceCode !== undefined && sourceCode !== "";
    }
    /**
     * Verify a smart contract on Etherscan.
     * @link https://docs.etherscan.io/api-endpoints/contracts#verify-source-code
     * @param contractAddress - The address of the smart contract to verify.
     * @param sourceCode - The source code of the smart contract.
     * @param contractName - The name of the smart contract, e.g. "contracts/Sample.sol:MyContract"
     * @param compilerVersion - The version of the Solidity compiler used, e.g. `v0.8.19+commit.7dd6d404`
     * @param constructorArguments - The encoded constructor arguments of the smart contract.
     * @returns A promise that resolves to an `EtherscanResponse` object.
     * @throws {ContractVerificationRequestError} if there is an error on the request.
     * @throws {ContractVerificationInvalidStatusCodeError} if the API returns an invalid status code.
     * @throws {ContractVerificationMissingBytecodeError} if the bytecode is not found on the block explorer.
     * @throws {HardhatVerifyError} if the response status is not OK.
     */
    async verify(contractAddress, sourceCode, contractName, compilerVersion, constructorArguments) {
        const parameters = new URLSearchParams({
            apikey: this.apiKey,
            module: "contract",
            action: "verifysourcecode",
            contractaddress: contractAddress,
            sourceCode,
            codeformat: "solidity-standard-json-input",
            contractname: contractName,
            compilerversion: compilerVersion,
            constructorArguements: constructorArguments,
        });
        let response;
        try {
            response = await (0, undici_1.sendPostRequest)(new URL(this.apiUrl), parameters.toString());
        }
        catch (error) {
            throw new errors_1.ContractVerificationRequestError(this.apiUrl, error);
        }
        if (!(response.statusCode >= 200 && response.statusCode <= 299)) {
            // This could be always interpreted as JSON if there were any such guarantee in the Etherscan API.
            const responseText = await response.body.text();
            throw new errors_1.ContractVerificationInvalidStatusCodeError(this.apiUrl, response.statusCode, responseText);
        }
        const etherscanResponse = new EtherscanResponse(await response.body.json());
        if (etherscanResponse.isBytecodeMissingInNetworkError()) {
            throw new errors_1.ContractVerificationMissingBytecodeError(this.apiUrl, contractAddress);
        }
        if (!etherscanResponse.isOk()) {
            throw new errors_1.HardhatVerifyError(etherscanResponse.message);
        }
        return etherscanResponse;
    }
    /**
     * Get the verification status of a smart contract from Etherscan.
     * This method performs polling of the verification status if it's pending.
     * @link https://docs.etherscan.io/api-endpoints/contracts#check-source-code-verification-submission-status
     * @param guid - The verification GUID to check.
     * @returns A promise that resolves to an `EtherscanResponse` object.
     * @throws {ContractStatusPollingError} if there is an error on the request.
     * @throws {ContractStatusPollingInvalidStatusCodeError} if the API returns an invalid status code.
     * @throws {ContractStatusPollingResponseNotOkError} if the response status is not OK.
     */
    async getVerificationStatus(guid) {
        const parameters = new URLSearchParams({
            apikey: this.apiKey,
            module: "contract",
            action: "checkverifystatus",
            guid,
        });
        const url = new URL(this.apiUrl);
        url.search = parameters.toString();
        let response;
        try {
            response = await (0, undici_1.sendGetRequest)(url);
        }
        catch (error) {
            throw new errors_1.ContractStatusPollingError(url.toString(), error);
        }
        if (!(response.statusCode >= 200 && response.statusCode <= 299)) {
            // This could be always interpreted as JSON if there were any such guarantee in the Etherscan API.
            const responseText = await response.body.text();
            throw new errors_1.ContractStatusPollingInvalidStatusCodeError(response.statusCode, responseText);
        }
        const etherscanResponse = new EtherscanResponse(await response.body.json());
        if (etherscanResponse.isPending()) {
            await (0, utilities_1.sleep)(VERIFICATION_STATUS_POLLING_TIME);
            return this.getVerificationStatus(guid);
        }
        if (etherscanResponse.isFailure()) {
            return etherscanResponse;
        }
        if (!etherscanResponse.isOk()) {
            throw new errors_1.ContractStatusPollingResponseNotOkError(etherscanResponse.message);
        }
        return etherscanResponse;
    }
    /**
     * Get the Etherscan URL for viewing a contract's details.
     * @param address - The address of the smart contract.
     * @returns The URL to view the contract on Etherscan's website.
     */
    getContractUrl(address) {
        return `${this.browserUrl}/address/${address}#code`;
    }
}
exports.Etherscan = Etherscan;
class EtherscanResponse {
    constructor(response) {
        this.status = parseInt(response.status, 10);
        this.message = response.result;
    }
    isPending() {
        return this.message === "Pending in queue";
    }
    isFailure() {
        return this.message === "Fail - Unable to verify";
    }
    isSuccess() {
        return this.message === "Pass - Verified";
    }
    isBytecodeMissingInNetworkError() {
        return this.message.startsWith("Unable to locate ContractCode at");
    }
    isOk() {
        return this.status === 1;
    }
}
function resolveApiKey(apiKey, network) {
    if (apiKey === undefined || apiKey === "") {
        throw new errors_1.MissingApiKeyError(network);
    }
    if (typeof apiKey === "string") {
        return apiKey;
    }
    const key = apiKey[network];
    if (key === undefined || key === "") {
        throw new errors_1.MissingApiKeyError(network);
    }
    return key;
}
//# sourceMappingURL=etherscan.js.map