/**
 * Footer Component
 *
 * This component is designed to serve as a comprehensive footer for a website, providing links to important pages,
 * a newsletter subscription input, and social media links. It's structured to be responsive, ensuring that the content
 * is organized and accessible on both mobile and desktop devices. The Footer component makes use of Next.js's `Link`
 * for navigation and integrates icons for visual enhancement and interaction cues.
 *
 * Features:
 * - Newsletter subscription input field with an integrated submit button for mobile views and a separate submit
 *   button for larger screens.
 * - Dynamic links to blog, help, products, partners, signup, signin, register, tickets, and social media platforms
 *   including GitHub, Facebook, and Instagram.
 * - Quick access links to terms of service, privacy policy, and community guidelines.
 * - Responsive design that adjusts content layout from column on mobile to row on desktop.
 * - Utilizes Radix Icons for visually appealing, interactive elements.
 *
 * The Footer's layout and content are optimized for usability, ensuring users have easy access to important information
 * and resources. The implementation of input fields and buttons is styled with Tailwind CSS for a consistent and
 * modern look and feel.
 *
 * Implementation Note:
 * - The `Link` components are placeholders and should be updated with the correct paths to the respective pages.
 * - Consider implementing form functionality for the newsletter subscription to handle email submissions.
 */

// React import statement

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import ButtonOrange from "../../button/buttonOrange";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

function Footer() {
  return (
    <div className="w-full text-center space-y-6 mt-40  ">
      <div className=" w-full space-y-6 md:flex md:justify-between  md:space-y-0 px-6 ">
        <div className="w-full md:w-fit space-y-3 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="text-lg text-gray-950 font-semibold">
              Join Our News Letter
            </h4>
            <p className="text-sm text-gray-700">
              Input yore email to assess all our latest news
            </p>
          </div>

          <div className="relative w-full md:w-[400px] space-y-3">
            <input
              className="w-full h-10 focus:outline-none ring-1 ring-gray-300 focus:ring-orange-500 rounded-md py-[0.5rem] px-[0.8rem] transition-all input-autofill placeholder:text-gray-500 placeholder:text-[0.7rem] shadow-sm text-[0.7rem] text-gray-700"
              placeholder="Email"
            />
            {/* Search icon positioned inside the input field */}
            <ArrowRightCircleIcon className="w-6 text-gray-400 absolute -top-1 right-2 md:hidden" />
          </div>
          <div className="sm:block hidden ">
            <ButtonOrange text="text-sm " width="w-fit">
              Submit
            </ButtonOrange>
          </div>
        </div>

        <div className="space-y-2 ">
          <h4 className="text-lg text-gray-950 font-semibold">Exhibit</h4>
          <div className="text-sm flex flex-col gap-1 items-center text-gray-700">
            <Link href={""}>Blog</Link>
            <Link href={""}>Help</Link>
            <Link href={""}>Products</Link>
            <Link href={""}>Partners</Link>
          </div>
        </div>
        <div className="space-y-2 ">
          <h4 className="text-lg text-gray-950 font-semibold">Link</h4>
          <div className=" text-sm flex flex-col gap-1 items-center text-gray-700">
            <Link href={""}>signUp</Link>
            <Link href={""}>signIn</Link>
            <Link href={""}>Register</Link>
            <Link href={""}>Tickets</Link>
          </div>
        </div>
        <div className="space-y-2 ">
          <h4 className="text-lg text-gray-950 font-semibold">Join Us</h4>
          <div className="text-sm flex flex-col gap-1 items-center text-gray-700">
            <Link href={""}>x</Link>
            <Link
              className=" w-full flex items-center justify-center gap-2"
              href={"https://github.com/SummitShare/SummitShare"}
            >
              <GitHubLogoIcon /> Github
            </Link>
            <Link href={""}>facebook</Link>
            <Link href={""}>Instagram</Link>
          </div>
        </div>
      </div>
      <div className="border-t w-full flex flex-col gap-1 text-gray-700  items-center py-5 md:flex-row md:px-80 md:justify-between text-sm">
        <Link href={""}>Terms</Link>
        <Link href={""}>Privacy policy</Link>
        <Link href={""}>Community guidelines</Link>
        copyRight@2023
      </div>
    </div>
  );
}

export default Footer;
