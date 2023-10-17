import type { JsonFragment } from "@ethersproject/abi";
import type { SolidityConfig } from "hardhat/types";
import type { ChainConfig } from "../types";
import { LibraryToAddress } from "./solc/artifacts";
export declare function sleep(ms: number): Promise<void>;
/**
 * Prints a table of networks supported by hardhat-verify, including both
 * built-in and custom networks.
 */
export declare function printSupportedNetworks(customChains: ChainConfig[]): Promise<void>;
/**
 * Returns the list of constructor arguments from the constructorArgsModule
 * or the constructorArgsParams if the first is not defined.
 */
export declare function resolveConstructorArguments(constructorArgsParams: string[], constructorArgsModule?: string): Promise<string[]>;
/**
 * Returns a dictionary of library addresses from the librariesModule or
 * an empty object if not defined.
 */
export declare function resolveLibraries(librariesModule?: string): Promise<LibraryToAddress>;
/**
 * Retrieves the list of Solidity compiler versions for a given Solidity
 * configuration.
 * It checks that the versions are supported by Etherscan, and throws an
 * error if any are not.
 */
export declare function getCompilerVersions({ compilers, overrides, }: SolidityConfig): Promise<string[]>;
/**
 * Encodes the constructor arguments for a given contract.
 */
export declare function encodeArguments(abi: JsonFragment[], sourceName: string, contractName: string, constructorArguments: any[]): Promise<string>;
//# sourceMappingURL=utilities.d.ts.map