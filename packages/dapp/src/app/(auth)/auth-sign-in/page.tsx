import Buttons from '@/app/components/button/Butons';
import Inputs from '@/app/components/inputs/Inputs';
import React from 'react';

function Page() {
  return (
    <div className="px-6 my-12  flex flex-col space-y-9 md:w-[50%] lg:w-[30%]">
      <nav className="w-full flex flex-row justify-end items-center">
        <p>Exit</p>
      </nav>
      <header className="text-center space-y-2">
        <h2>Log in</h2>
        <p>Learn about the history you love!</p>
      </header>

      <form action="" className="space-y-[48px]">
        <section className="space-y-4">
          <Inputs type="input" state="active" label="Email" />
          <Inputs type="input" state="active" label="Password" />
        </section>
      </form>
      <section className="text-center space-y-6">
        <Buttons type="primary" size="large">
          Create my account
        </Buttons>
        <p>
          By continuing you accept our standard{' '}
          <a className="underline" href="">
            terms and conditions
          </a>{' '}
          and{' '}
          <a className="underline" href="">
            our privacy policy
          </a>
          .
        </p>
        <p>
          I don’t have an account{' '}
          <a className="underline" href="">
            Register
          </a>
        </p>
      </section>
    </div>
  );
}

export default Page;
