import React from 'react';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Input from '../inputs/Inputs';

function footer() {
  return (
    <footer className="w-full space-y-10  ">
      <section className=" w-full flex flex-col gap-10 items-center md:flex-row md:justify-between px-6 lg:px-28">
        <div className="text-center md:text-left">
          <h3>Newsletter </h3>
          <p className="">join our news letter and get the latest updates</p>
          <Input
            placeholder="example@email.com"
            type="input"
            state="active"
            rightIcon={<ArrowRightCircleIcon />}
          />
        </div>

        <div className=" ">
          <ul className="w-full  flex flex-col  md:flex-row text-center gap-10">
            <li className="space-y-2">
              <h3>Quick links</h3>

              <ul className="text-stone-600">
                <li>
                  <a href="/blog">Blogs</a>
                </li>
                <li>
                  <a href="https://www.kraken.com/learn/web3-wallets">Help</a>
                </li>
                <li>
                  <a href="/partners">Partners</a>
                </li>
              </ul>
            </li>

            <li className="space-y-2">
              <h3>Other links</h3>
              <ul>
                <li>
                  <a href="/donate">Donate</a>
                </li>
                <li>
                  <a href="/distribution">Exhibit</a>
                </li>
                <li>
                  <a href="/profile">Profile</a>
                </li>
              </ul>
            </li>
            <li className="space-y-2">
              <h3>Social links</h3>
              <ul className="flex flex-col items-center">
                <li>
                  <a href="https://x.com/summitshare_zm">X</a>
                </li>
                <li>
                  <a
                    className="flex flex-row gap-2 items-center"
                    href="https://github.com/SummitShare"
                  >
                    <GitHubLogoIcon className="w-4" />
                    Github
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </section>
      <section className="text-sm  w-full text-center border-t border-primary-900-5 py-2 ">
        <p className="">Copyright@2024</p>
      </section>
    </footer>
  );
}

export default footer;
