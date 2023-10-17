import type { EtherscanConfig } from "../types";
import "hardhat/types/config";
declare module "hardhat/types/config" {
    interface HardhatUserConfig {
        etherscan?: Partial<EtherscanConfig>;
    }
    interface HardhatConfig {
        etherscan: EtherscanConfig;
    }
}
//# sourceMappingURL=type-extensions.d.ts.map