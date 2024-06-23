
import Buttons from '@/app/components/common/button/Butons'
import Inputs from '@/app/components/common/inputs/input/Inputs'
import React from 'react'

function Page() {
  return (
    <div className="w-full px-6 my-[48px] flex flex-col justify-between min-h-screen">
      <nav className="w-full flex flex-row justify-between items-center">
        <p className="text-p2-m">
          Step 1<span> of 3</span>
        </p>
        <p>Exit</p>
      </nav>
      <header className="text-center space-y-2">
        <h2>Create account</h2>
        <p>Learn about the history you love!</p>
      </header>

      <form action="">
        <section className="space-y-4">
          <Inputs type="input" state="active" label="Full name" />
          <Inputs type="input" state="active" label="Email" />
          <Inputs type="input" state="active" label="Password" />
        </section>
      </form>
      <section className="text-center space-y-6">
        <Buttons type="primary" size="large">Create my account</Buttons>
        <p>
          By continuing you accept our standard{" "}
          <a className="underline" href="">
            terms and conditions
          </a>{" "}
          and{" "}
          <a className="underline" href="">
            our privacy policy
          </a>
          .
        </p>
        <p>
          Already have an account?{" "}
          <a className="underline" href="">
            Log in
          </a>
        </p>
      </section>
    </div>
  )
}

export default Page
