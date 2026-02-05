import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
// import { initializeDevWallet } from '@/utils/dev/walletInit';
// import { contracts } from '@/utils/dev/contractInit';
import prisma from '../../../../../../config/db';
import path from 'path';
import * as fs from 'fs/promises';
import { emailServer, transporter } from '../../../../../../config/nodemailer';

// production values:
import { initializeDevWallet } from '@/utils/walletInit';
import { contracts } from '@/utils/contractInit';

const USDT_AMOUNT = ethers.utils.parseUnits('5', 6); // USDT decimals = 6
const MUSDC_AMOUNT = ethers.utils.parseUnits('5', 18); // MOCK decimals = 18
const ETH_AMOUNT = ethers.utils.parseEther('0.00000606');

export async function POST(req: Request) {
   if (req.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
   }

   try {
      const { recipient, user_id } = await req.json();
      if (!user_id) {
         console.log('no user sent');
         return NextResponse.json(
            { error: 'Something went wrong please try again' },
            { status: 401 }
         );
      }

      const user = await prisma.users.findFirst({
         where: { id: user_id },
      });

      if (!user_id) {
         console.log('no user found');
         return NextResponse.json(
            { error: 'Something went wrong please try again' },
            { status: 401 }
         );
      }

      const airdrop = await prisma.airdrops.findFirst({
         where: { user_id, claimed: false },
      });

      if (!airdrop) {
         console.log('no airdrop');
         return NextResponse.json(
            { error: 'Something went wrong please try again' },
            { status: 401 }
         );
      }

      if (!ethers.utils.isAddress(recipient)) {
         console.log('address error');
         return NextResponse.json({ error: 'ADDRESS' }, { status: 500 });
      }

      // initialize dev wallet
      const { provider, wallet } = initializeDevWallet();

      // intialize dev mock USDC contract
      // const usdtContract = contracts.getMUSDC();

      // initalize OP USDT contract
      const usdtContract = contracts.getUSDT();

      // wallet balance check
      const [usdtBalance, ethBalance, feeData] = await Promise.all([
         usdtContract.balanceOf(wallet.address),
         provider.getBalance(wallet.address),
         provider.getFeeData(),
      ]);

      if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
         throw new Error('Could not estimate gas fees');
      }
      PROD: if (usdtBalance.lt(USDT_AMOUNT)) {
         console.log('Insufficient USDT');
         return NextResponse.json(
            { error: 'Insufficient USDT' },
            { status: 400 }
         );
      }

      // //   DEV:
      // if (usdtBalance.lt(MUSDC_AMOUNT)) {
      //    return NextResponse.json(
      //       { error: 'Insufficient USDT' },
      //       { status: 400 }
      //    );
      // }

      if (ethBalance.lt(ETH_AMOUNT)) {
         console.log('insufficient eth ');
         return NextResponse.json({ error: 'Insufficient ETH' }, { status: 400 });
      }

      const nonce = await wallet.getTransactionCount();
      const txParams = {
         gasLimit: 100000,
         maxFeePerGas: feeData.maxFeePerGas,
         maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      };

      const [usdtTx, ethTx] = await Promise.all([
         usdtContract.transfer(recipient, USDT_AMOUNT, {
            ...txParams,
            nonce,
         }),
         wallet.sendTransaction({
            to: recipient,
            value: ETH_AMOUNT,
            ...txParams,
            gasLimit: 50000,
            nonce: nonce + 1,
         }),
      ]);

      const [usdtReceipt, ethReceipt] = await Promise.all([
         usdtTx.wait(1),
         ethTx.wait(1),
      ]);

      const updatedAirdrop = await prisma.airdrops.update({
         where: { id: airdrop.id },
         data: {
            wallet_address: recipient,
            claimed: true,
            claimed_at: new Date(),
         },
      });

      const link = 'https://summitshare.co/cya';

      // Define the receipt message
      const receiptMessage = ` ${link}`;

      const templatePath = path.join(
         process.cwd(),
         'src/features/emailNewsletter/main.html'
      );

      let htmlContent = await fs.readFile(templatePath, 'utf-8');

      // const host = req.headers.get('host');
      const host = process.env.HOST;

      const divisor = 1000000;

      // Perform division using the `.div()` method
      const result = USDT_AMOUNT.div(divisor);

      // Replace placeholders in the template with actual data
      htmlContent = htmlContent.replace('{{title}}', 'Airdrop claimed');
      htmlContent = htmlContent.replace('{{subtitle}}', 'Receipt for airdrop');
      htmlContent = htmlContent.replace(
         '{{message}}',
         `You have just claimed an airdrop of ${result} USDT using wallet address ${recipient}.Please proceed to purchase a ticket at the following link:  <a href="${link}">Exhibit</a>`
      );

      const mailOptions = {
         from: emailServer,
         to: user?.email,
         subject: 'Airdrop Claimed',
         html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);

      return NextResponse.json({
         success: true,
         usdtTxHash: usdtReceipt.transactionHash,
         ethTxHash: ethReceipt.transactionHash,
      });
   } catch (error: any) {
      console.error('Distribution error:', error);
      return NextResponse.json(
         {
            error: 'Distribution failed',
            details: error.message,
         },
         { status: 500 }
      );
   }
}

export async function GET(req: Request) {
   try {
      // Extract query parameters from the request URL
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('user_id');
      const code = searchParams.get('code');
      // Validate query parameters
      if (!userId) {
         return NextResponse.json({ error: 'no user id sent' }, { status: 400 });
      }
      // Query the database to find the user in the airdrops table
      const airdrop = await prisma.airdrops.findFirst({
         where: { user_id: userId },
      });
      // If user exists in the airdrops table, return their details
      if (airdrop) {
         return NextResponse.json(
            {
               valid: true,
               claimed: airdrop.claimed,
            },
            { status: 200 }
         );
      }
      // If the user is not found, return a 401 response
      return NextResponse.json(
         { error: 'User not found in airdrops table' },
         { status: 401 }
      );
   } catch (error) {
      console.error('Error processing airdrop:', error);
      return NextResponse.json(
         { error: 'Internal Server Error' },
         { status: 500 }
      );
   }
}
