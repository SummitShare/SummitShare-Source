// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ConversionContract {
    ISwapRouter public swapRouter;
    address public controller;
    address public usdt;
    address public usdc;
    address public storageContract;

    event Conversion(uint256 amountIn, uint256 amountOut, address indexed storageContract);

    modifier onlyController() {
        require(msg.sender == controller, "Only the controller can perform this action.");
        _;
    }

    function initialize(
        address _swapRouter,
        address _controller,
        address _usdt,
        address _usdc,
        address _storageContract
    ) external {
        require(controller == address(0), "Controller has already been set.");
        
        swapRouter = ISwapRouter(_swapRouter);
        controller = _controller;
        usdt = _usdt;
        usdc = _usdc;
        storageContract = _storageContract;
    }

    function initialApprove() external onlyController {
        TransferHelper.safeApprove(usdt, address(swapRouter), type(uint256).max);
    }

    function convertUSDTtoUSDC(uint256 amountIn, uint256 amountOutMinimum) external onlyController returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = usdt;
        path[1] = usdc;

        uint256 amountOut = swapRouter.exactInput(
            ISwapRouter.ExactInputParams({
                path: path,
                recipient: storageContract,
                deadline: block.timestamp + 15,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum
            })
        );

        emit Conversion(amountIn, amountOut, storageContract);
        return amountOut;
    }
}
