import React from 'react';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Inputs from '../inputs/Inputs';

function footer() {
  return (
    <footer className="w-full space-y-2  ">
      <section className="w-full flex flex-col gap-6 items-center lg:flex-row md:justify-between lg:px-28 px-6  ">
        <div className="text-center lg:text-left">
          <h3>Newsletter </h3>
          <p>join our news letter and get the latest updates</p>
          <Inputs
            type="input"
            state="active"
            rightIcon={<ArrowRightCircleIcon />}
          />
        </div>

        <div className="]">
          <ul className="flex flex-col gap-10 lg:flex-row text-center ">
            <li className="space-y-2">
              <h3>Quick links</h3>
              <ul>
                <li>
                  <a href="">Blog</a>
                </li>
                <li>
                  <a href="">Help</a>
                </li>
                <li>
                  <a href="">Partners</a>
                </li>
              </ul>
            </li>
            <li className="space-y-2">
              <h3>Other links</h3>
              <ul>
                <li>
                  <a href="">Donate</a>
                </li>
                <li>
                  <a href="">Exhibit</a>
                </li>
                <li>
                  <a href="">Profile</a>
                </li>
              </ul>
            </li>
            <li className="space-y-2">
              <h3>Social links</h3>
              <ul className="flex flex-col items-center">
                <li>
                  <a href="">x</a>
                </li>
                <li>
                  <a className="flex flex-row gap-2 items-center" href="">
                    <GitHubLogoIcon className="w-4" />
                    Github
                  </a>
                </li>
                <li>
                  <a href="">Instagram</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </section>
      <section className="w-full text-center border-t border-primary-900-5 py-2">
        <p>Copyright@2024</p>
      </section>
    </footer>
  );
}

export default footer;
