
import Buttons from '@/app/components/button/Butons'
import Inputs from '@/app/components/inputs/Inputs'
import Link from 'next/link'
import React from 'react'

function Page() {
  return (
  
    <div className=" flex flex-col justify-between px-6 py-10 bg-white h-screen md:w-[50%] lg:w-[30%] md:float-right">
      <nav className="w-full flex flex-row justify-between items-center">
        <p className="text-p2-m">
          Step 1<span> of 2</span>
        </p>
        <Link href="/">Exit</Link>
      </nav>

      <section className="space-y-4">

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
      </section>
      
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
