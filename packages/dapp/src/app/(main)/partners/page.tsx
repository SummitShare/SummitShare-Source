import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Partner {
  name: string;
  logo: string;
  website: string;
}

const partners: Partner[] = [
  {
    name: "Women's History Museum of Zambia",
    logo: 'https://s3.tebi.io/summitshare-images/whmzacc.png',
    website: 'https://www.whmzambia.org/',
  },
  {
    name: 'Ethereum Foundation',
    logo: 'https://s3.tebi.io/summitshare-images/EF.png',
    website: 'https://ethereum.foundation/',
  },
  {
    name: 'Octant',
    logo: 'https://s3.tebi.io/summitshare-images/octant.png',
    website: 'https://octant.app/',
  },
];

const Partners: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4 sm:p-8 mt-12 sm:mt-24">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">
        Our Partners and Supporters
      </h1>
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-8 mb-8 sm:mb-12">
        {partners.map((partner, index) => (
          <div key={index} className="relative group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={160}
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white px-3 py-1 rounded-full text-sm flex items-center"
              >
                Go to website
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center font-bold max-w-3xl text-sm sm:text-base mb-8">
        SummitShare is more than a project; it&apos;s a collaborative journey and
        vehicle aimed at ushering in a new narrative around the repatriation and
        reclamation of history for a newer generation. Our partners are
        instrumental in assisting the realization of SummitShare&apos;s vision. The
        canvas of SummitShare is better painted together, and these are some of
        the partners that have aided and continue to aid the building of
        SummitShare.
      </p>
      <Link
        href="https://summitshare.co/blog/BkntmFS8R"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-blue-500 font-medium text-sm sm:text-base bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-center"
      >
        Read more about our partners
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </Link>
    </div>
  );
};

export default Partners;
