'use client';
import React, { useState } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StepCardProps } from '@/utils/dev/frontEndInterfaces';

const steps = [
  {
    id: 1,
    title: 'Set Up Web3 Wallet',
    description: (
      <>
        <div className="mb-2">
          Start your Web3 journey by setting up a digital wallet:
        </div>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Download a Web3 wallet like{' '}
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              MetaMask
            </a>{' '}
            or{' '}
            <a
              href="https://www.coinbase.com/wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              Coinbase Wallet
            </a>
            .
          </li>
          <li>
            Follow the wallet&apos;s setup instructions to create your account.
          </li>
          <li>Secure your wallet by safely storing your recovery phrase.</li>
          <li>Fund your wallet with USDT or USDC stablecoins.</li>
        </ol>
        <div className="mt-2">
          SummitShare uses on-chain transactions with stablecoins for speed,
          transparency, and price stability.
        </div>
      </>
    ),
  },
  {
    id: 2,
    title: 'Connect Wallet',
    description: (
      <>
        <div>
          Click on the <strong>&#39;Connect Wallet&#39;</strong> button on the
          SummitShare platform to link your wallet. Ensure that your wallet is{' '}
          <strong>unlocked</strong> and you are connected to the{' '}
          <strong>correct network</strong> (e.g., Optimism Mainnet).
        </div>
      </>
    ),
  },
  {
    id: 3,
    title: 'Purchase a Ticket',
    description: (
      <>
        <div>
          After connecting your wallet, proceed to{' '}
          <strong>purchase a ticket</strong> by selecting the event you want to
          attend. You will be prompted to{' '}
          <strong>approve the token transfer</strong> in your wallet. Ensure
          that you have enough tokens for the transaction, and{' '}
          <a
            href="https://support.metamask.io/hc/en-us/articles/360015489871-What-are-gas-fees-"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline"
          >
            learn more about gas fees
          </a>
          .
        </div>
      </>
    ),
  },
  {
    id: 4,
    title: 'Confirmation',
    description: (
      <>
        <div>
          Once you <strong>confirm the transaction</strong> in your wallet, it
          will be processed on-chain. You will receive a{' '}
          <strong>confirmation notification</strong>, and your ticket will
          appear in your wallet as an <strong>NFT</strong>. Track your
          transaction status via your wallet&apos;s activity section or check it
          on a blockchain explorer like{' '}
          <a
            href="https://etherscan.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline"
          >
            Etherscan Block Scanner
          </a>{' '}
          or{' '}
          <a
            href="https://optimistic.etherscan.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline"
          >
            Optimism Block Scanner
          </a>
          .
        </div>
      </>
    ),
  },
];

const StepCard: React.FC<StepCardProps> = ({
  step,
  isActive,
  isCompleted,
  onClick,
}) => (
  <Card
    className={`w-full sm:w-64 m-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
      isActive ? 'ring-2 ring-orange-700' : ''
    }`}
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Step {step.id}</CardTitle>
      {isCompleted ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <ChevronRight className="h-4 w-4 text-gray-500" />
      )}
    </CardHeader>
    <CardContent>
      <p className="text-xs text-muted-foreground">{step.title}</p>
    </CardContent>
  </Card>
);

const HelpPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const goToStep = (step: React.SetStateAction<number>) => {
    setCurrentStep(step);
  };

  return (
    <div className="container mx-auto p-4 pt-20 sm:pt-24">
      <h1 className="text-2xl font-bold mb-6 text-center">
        How to Get Started with SummitShare
      </h1>
      <div className="flex flex-wrap justify-center mb-8">
        {steps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            isActive={currentStep === step.id}
            isCompleted={currentStep > step.id}
            onClick={() => goToStep(step.id)}
          />
        ))}
      </div>
      <Card className="w-full max-w-full sm:max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-orange-700">
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {steps[currentStep - 1].description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
