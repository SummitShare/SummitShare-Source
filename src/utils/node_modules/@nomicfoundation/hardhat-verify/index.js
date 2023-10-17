"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const contract_names_1 = require("hardhat/utils/contract-names");
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const task_names_2 = require("./internal/task-names");
const config_2 = require("./internal/config");
const errors_1 = require("./internal/errors");
const utilities_1 = require("./internal/utilities");
const etherscan_1 = require("./internal/etherscan");
const bytecode_1 = require("./internal/solc/bytecode");
const artifacts_1 = require("./internal/solc/artifacts");
require("./internal/type-extensions");
(0, config_1.extendConfig)(config_2.etherscanConfigExtender);
/**
 * Main verification task.
 *
 * This is a meta-task that gets all the verification tasks and runs them.
 * Right now there's only a "verify-etherscan" task.
 */
(0, config_1.task)(task_names_2.TASK_VERIFY, "Verifies a contract on Etherscan")
    .addOptionalPositionalParam("address", "Address of the contract to verify")
    .addOptionalVariadicPositionalParam("constructorArgsParams", "Contract constructor arguments. Cannot be used if the --constructor-args option is provided", [])
    .addOptionalParam("constructorArgs", "Path to a Javascript module that exports the constructor arguments", undefined, config_1.types.inputFile)
    .addOptionalParam("libraries", "Path to a Javascript module that exports a dictionary of library addresses. " +
    "Use if there are undetectable library addresses in your contract. " +
    "Library addresses are undetectable if they are only used in the contract constructor", undefined, config_1.types.inputFile)
    .addOptionalParam("contract", "Fully qualified name of the contract to verify. Skips automatic detection of the contract. " +
    "Use if the deployed bytecode matches more than one contract in your project")
    .addFlag("listNetworks", "Print the list of supported networks")
    .setAction(async (taskArgs, { run }) => {
    if (taskArgs.listNetworks) {
        await run(task_names_2.TASK_VERIFY_PRINT_SUPPORTED_NETWORKS);
        return;
    }
    const verificationArgs = await run(task_names_2.TASK_VERIFY_RESOLVE_ARGUMENTS, taskArgs);
    const verificationSubtasks = await run(task_names_2.TASK_VERIFY_GET_VERIFICATION_SUBTASKS);
    for (const verificationSubtask of verificationSubtasks) {
        await run(verificationSubtask, verificationArgs);
    }
});
(0, config_1.subtask)(task_names_2.TASK_VERIFY_RESOLVE_ARGUMENTS)
    .addOptionalParam("address")
    .addOptionalParam("constructorArgsParams", undefined, [], config_1.types.any)
    .addOptionalParam("constructorArgs", undefined, undefined, config_1.types.inputFile)
    .addOptionalParam("libraries", undefined, undefined, config_1.types.inputFile)
    .addOptionalParam("contract")
    .setAction(async ({ address, constructorArgsParams, constructorArgs: constructorArgsModule, contract, libraries: librariesModule, }) => {
    if (address === undefined) {
        throw new errors_1.MissingAddressError();
    }
    const { isAddress } = await Promise.resolve().then(() => __importStar(require("@ethersproject/address")));
    if (!isAddress(address)) {
        throw new errors_1.InvalidAddressError(address);
    }
    if (contract !== undefined && !(0, contract_names_1.isFullyQualifiedName)(contract)) {
        throw new errors_1.InvalidContractNameError(contract);
    }
    const constructorArgs = await (0, utilities_1.resolveConstructorArguments)(constructorArgsParams, constructorArgsModule);
    const libraries = await (0, utilities_1.resolveLibraries)(librariesModule);
    return {
        address,
        constructorArgs,
        libraries,
        contractFQN: contract,
    };
});
/**
 * Returns a list of verification subtasks.
 */
(0, config_1.subtask)(task_names_2.TASK_VERIFY_GET_VERIFICATION_SUBTASKS, async () => {
    return [task_names_2.TASK_VERIFY_ETHERSCAN];
});
/**
 * Main Etherscan verification subtask.
 *
 * Verifies a contract in Etherscan by coordinating various subtasks related
 * to contract verification.
 */
(0, config_1.subtask)(task_names_2.TASK_VERIFY_ETHERSCAN)
    .addParam("address")
    .addParam("constructorArgs", undefined, undefined, config_1.types.any)
    .addParam("libraries", undefined, undefined, config_1.types.any)
    .addOptionalParam("contractFQN")
    .addFlag("listNetworks")
    .setAction(async ({ address, constructorArgs, libraries, contractFQN }, { config, network, run }) => {
    const chainConfig = await etherscan_1.Etherscan.getCurrentChainConfig(network.name, network.provider, config.etherscan.customChains);
    const etherscan = etherscan_1.Etherscan.fromChainConfig(config.etherscan.apiKey, chainConfig);
    const isVerified = await etherscan.isVerified(address);
    if (isVerified) {
        const contractURL = etherscan.getContractUrl(address);
        console.log(`The contract ${address} has already been verified.
${contractURL}`);
        return;
    }
    const configCompilerVersions = await (0, utilities_1.getCompilerVersions)(config.solidity);
    const deployedBytecode = await bytecode_1.Bytecode.getDeployedContractBytecode(address, network.provider, network.name);
    const matchingCompilerVersions = await deployedBytecode.getMatchingVersions(configCompilerVersions);
    // don't error if the bytecode appears to be OVM bytecode, because we can't infer a specific OVM solc version from the bytecode
    if (matchingCompilerVersions.length === 0 && !deployedBytecode.isOvm()) {
        throw new errors_1.CompilerVersionsMismatchError(configCompilerVersions, deployedBytecode.getVersion(), network.name);
    }
    const contractInformation = await run(task_names_2.TASK_VERIFY_ETHERSCAN_GET_CONTRACT_INFORMATION, {
        contractFQN,
        deployedBytecode,
        matchingCompilerVersions,
        libraries,
    });
    const minimalInput = await run(task_names_2.TASK_VERIFY_ETHERSCAN_GET_MINIMAL_INPUT, {
        sourceName: contractInformation.sourceName,
    });
    const encodedConstructorArguments = await (0, utilities_1.encodeArguments)(contractInformation.contractOutput.abi, contractInformation.sourceName, contractInformation.contractName, constructorArgs);
    // First, try to verify the contract using the minimal input
    const { success: minimalInputVerificationSuccess } = await run(task_names_2.TASK_VERIFY_ETHERSCAN_ATTEMPT_VERIFICATION, {
        address,
        compilerInput: minimalInput,
        contractInformation,
        verificationInterface: etherscan,
        encodedConstructorArguments,
    });
    if (minimalInputVerificationSuccess) {
        return;
    }
    console.log(`We tried verifying your contract ${contractInformation.contractName} without including any unrelated one, but it failed.
Trying again with the full solc input used to compile and deploy it.
This means that unrelated contracts may be displayed on Etherscan...
`);
    // If verifying with the minimal input failed, try again with the full compiler input
    const { success: fullCompilerInputVerificationSuccess, message: verificationMessage, } = await run(task_names_2.TASK_VERIFY_ETHERSCAN_ATTEMPT_VERIFICATION, {
        address,
        compilerInput: contractInformation.compilerInput,
        contractInformation,
        verificationInterface: etherscan,
        encodedConstructorArguments,
    });
    if (fullCompilerInputVerificationSuccess) {
        return;
    }
    throw new errors_1.ContractVerificationFailedError(verificationMessage, contractInformation.undetectableLibraries);
});
(0, config_1.subtask)(task_names_2.TASK_VERIFY_ETHERSCAN_GET_CONTRACT_INFORMATION)
    .addParam("deployedBytecode", undefined, undefined, config_1.types.any)
    .addParam("matchingCompilerVersions", undefined, undefined, config_1.types.any)
    .addParam("libraries", undefined, undefined, config_1.types.any)
    .addOptionalParam("contractFQN")
    .setAction(async ({ contractFQN, deployedBytecode, matchingCompilerVersions, libraries, }, { network, artifacts }) => {
    let contractInformation;
    if (contractFQN !== undefined) {
        let artifactExists;
        try {
            artifactExists = await artifacts.artifactExists(contractFQN);
        }
        catch (error) {
            artifactExists = false;
        }
        if (!artifactExists) {
            throw new errors_1.ContractNotFoundError(contractFQN);
        }
        const buildInfo = await artifacts.getBuildInfo(contractFQN);
        if (buildInfo === undefined) {
            throw new errors_1.BuildInfoNotFoundError(contractFQN);
        }
        if (!matchingCompilerVersions.includes(buildInfo.solcVersion) &&
            !deployedBytecode.isOvm()) {
            throw new errors_1.BuildInfoCompilerVersionMismatchError(contractFQN, deployedBytecode.getVersion(), deployedBytecode.hasVersionRange(), buildInfo.solcVersion, network.name);
        }
        contractInformation = (0, artifacts_1.extractMatchingContractInformation)(contractFQN, buildInfo, deployedBytecode);
        if (contractInformation === null) {
            throw new errors_1.DeployedBytecodeMismatchError(network.name, contractFQN);
        }
    }
    else {
        contractInformation = await (0, artifacts_1.extractInferredContractInformation)(artifacts, network, matchingCompilerVersions, deployedBytecode);
    }
    // map contractInformation libraries
    const libraryInformation = await (0, artifacts_1.getLibraryInformation)(contractInformation, libraries);
    return {
        ...contractInformation,
        ...libraryInformation,
    };
});
(0, config_1.subtask)(task_names_2.TASK_VERIFY_ETHERSCAN_GET_MINIMAL_INPUT)
    .addParam("sourceName")
    .setAction(async ({ sourceName }, { run }) => {
    const cloneDeep = require("lodash.clonedeep");
    const dependencyGraph = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH, { sourceNames: [sourceName] });
    const resolvedFiles = dependencyGraph
        .getResolvedFiles()
        .filter((resolvedFile) => resolvedFile.sourceName === sourceName);
    if (resolvedFiles.length !== 1) {
        throw new errors_1.UnexpectedNumberOfFilesError();
    }
    const compilationJob = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE, {
        dependencyGraph,
        file: resolvedFiles[0],
    });
    const minimalInput = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_COMPILER_INPUT, {
        compilationJob,
    });
    return cloneDeep(minimalInput);
});
(0, config_1.subtask)(task_names_2.TASK_VERIFY_ETHERSCAN_ATTEMPT_VERIFICATION)
    .addParam("address")
    .addParam("compilerInput", undefined, undefined, config_1.types.any)
    .addParam("contractInformation", undefined, undefined, config_1.types.any)
    .addParam("verificationInterface", undefined, undefined, config_1.types.any)
    .addParam("encodedConstructorArguments")
    .setAction(async ({ address, compilerInput, contractInformation, verificationInterface, encodedConstructorArguments, }) => {
    // Ensure the linking information is present in the compiler input;
    compilerInput.settings.libraries = contractInformation.libraries;
    const { message: guid } = await verificationInterface.verify(address, JSON.stringify(compilerInput), `${contractInformation.sourceName}:${contractInformation.contractName}`, `v${contractInformation.solcLongVersion}`, encodedConstructorArguments);
    console.log(`Successfully submitted source code for contract
${contractInformation.sourceName}:${contractInformation.contractName} at ${address}
for verification on the block explorer. Waiting for verification result...
`);
    // Compilation is bound to take some time so there's no sense in requesting status immediately.
    await (0, utilities_1.sleep)(700);
    const verificationStatus = await verificationInterface.getVerificationStatus(guid);
    if (!(verificationStatus.isFailure() || verificationStatus.isSuccess())) {
        // Reaching this point shouldn't be possible unless the API is behaving in a new way.
        throw new errors_1.VerificationAPIUnexpectedMessageError(verificationStatus.message);
    }
    if (verificationStatus.isSuccess()) {
        const contractURL = verificationInterface.getContractUrl(address);
        console.log(`Successfully verified contract ${contractInformation.contractName} on the block explorer.
${contractURL}`);
    }
    return {
        success: verificationStatus.isSuccess(),
        message: verificationStatus.message,
    };
});
/**
 * This subtask is used for backwards compatibility.
 * It validates the parameters as it is done in TASK_VERIFY_RESOLVE_ARGUMENTS
 * and calls TASK_VERIFY_ETHERSCAN directly.
 */
(0, config_1.subtask)(task_names_2.TASK_VERIFY_VERIFY)
    .addOptionalParam("address")
    .addOptionalParam("constructorArguments", undefined, [], config_1.types.any)
    .addOptionalParam("libraries", undefined, {}, config_1.types.any)
    .addOptionalParam("contract")
    .setAction(async ({ address, constructorArguments, libraries, contract }, { run }) => {
    if (address === undefined) {
        throw new errors_1.MissingAddressError();
    }
    const { isAddress } = await Promise.resolve().then(() => __importStar(require("@ethersproject/address")));
    if (!isAddress(address)) {
        throw new errors_1.InvalidAddressError(address);
    }
    if (contract !== undefined && !(0, contract_names_1.isFullyQualifiedName)(contract)) {
        throw new errors_1.InvalidContractNameError(contract);
    }
    // This can only happen if the subtask is invoked from within Hardhat by a user script or another task.
    if (!Array.isArray(constructorArguments)) {
        throw new errors_1.InvalidConstructorArgumentsError();
    }
    if (typeof libraries !== "object" || Array.isArray(libraries)) {
        throw new errors_1.InvalidLibrariesError();
    }
    await run(task_names_2.TASK_VERIFY_ETHERSCAN, {
        address,
        constructorArgs: constructorArguments,
        libraries,
        contractFQN: contract,
    });
});
(0, config_1.subtask)(task_names_2.TASK_VERIFY_PRINT_SUPPORTED_NETWORKS, "Prints the supported networks list").setAction(async ({}, { config }) => {
    await (0, utilities_1.printSupportedNetworks)(config.etherscan.customChains);
});
//# sourceMappingURL=index.js.map