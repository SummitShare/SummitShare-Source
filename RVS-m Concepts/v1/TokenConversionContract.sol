// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenConversionContract {
    ISwapRouter public immutable swapRouter;
    address public usdt;
    address public usdc;
    uint24 public feeTier = 3000;  // Example fee tier, can be adjusted
    address public storageContract; 

    constructor(address _swapRouter, address _usdt, address _usdc, address _storageContract) {
        swapRouter = ISwapRouter(_swapRouter);
        usdt = _usdt;
        usdc = _usdc;
        storageContract = _storageContract;
    }


    function convertUSDTtoUSDC(uint256 amountIn, uint256 minOut, uint160 priceLimit) external {
        // Transfer USDT to this contract
        TransferHelper.safeTransferFrom(usdt, msg.sender, address(this), amountIn);
        // Approve the router to spend USDT
        TransferHelper.safeApprove(usdt, address(swapRouter), amountIn);

        // Params for the swap
        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: usdt,
                tokenOut: usdc,
                fee: feeTier,
                recipient: msg.sender,  // Funds returned to sender
                deadline: block.timestamp + 15,  // 15-second deadline
                amountIn: amountIn,
                amountOutMinimum: minOut,
                sqrtPriceLimitX96: priceLimit
            });

        // Execute the swap
        uint256 amountOut = swapRouter.exactInputSingle(params);
        IERC20(usdc).transfer(storageContract, amountOut);
    }


}
