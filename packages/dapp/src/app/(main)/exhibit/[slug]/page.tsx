'use client';
import SummitShareCanvas from '@/app/components/3DCanvas/3dCanvas';
import { Calabash } from '@/app/components/3DCanvas/models/Calabash';
import { Drum } from '@/app/components/3DCanvas/models/Drum';
import { Mask } from '@/app/components/3DCanvas/models/Mask';
import { Snuff } from '@/app/components/3DCanvas/models/Snuff';
import { Cowry } from '@/app/components/3DCanvas/models/Cowry';
import { Headrest } from '@/app/components/3DCanvas/models/Headrest';
import Buttons from '@/app/components/button/Butons';
import { ObjectDescription } from '@/utils/dev/frontEndInterfaces';
import { X } from 'lucide-react';
import React, { ReactNode, useState } from 'react';

const data: ObjectDescription[] = [
   // Double Sided Drum - Mwenya Mukulu
   {
      title: 'Mwenya Mukulu',
      object_URL: <Drum />,
      object_name: 'Double Sided Drum',
      Object_description: [
         [
            'A royal drum made out of wood, fibres, and python skin and decorated in black colour.',
         ],
         ['It was used when the chief is coming to or leaving a meeting.'],
      ],
      Figure_artifact_details:
         'Mwenya Mukulu was the leader of the Lungu, Azamba, Azao or Sao people. The Lungu or Azamba people came down the lake in canoes from the eastern side of Lake Tanganyika at the end of the 17th century. They put to shore on the south end of the lake and Mwenya Mukulu became their Queen. She consolidated her leadership and the power among her people and the people of the new land. She then divided this area amongst her four sisters and made them rulers over the people they found there, founding the Lungu nation in the present day Mbala/Mpulungu areas of Zambia.',
      figure_images_URLs: [
         'https://s3.example.com/images/mwenya_1.jpg',
         'https://s3.example.com/images/mwenya_2.jpg',
      ],
      figure_details: [['Known as the 17th century Diplomat'], ['(1910 - 1986)']],
      figure_biography: [
         [
            'Mwenya Mukulu was the leader of the Lungu, Azamba, Azao or Sao people. The Lungu or Azamba people came down the lake in canoes from the eastern side of Lake Tanganyika at the end of the 17th century.',
         ],
         [
            'They put to shore on the south end of the lake and Mwenya Mukulu became their Queen. She consolidated her leadership and the power among her people and the people of the new land.',
         ],
         [
            'She then divided this area amongst her four sisters and made them rulers over the people they found there, founding the Lungu nation in the present day Mbala/Mpulungu areas of Zambia.',
         ],
      ],
      figure_references: [
         ['https://collections.smvk.se/carlotta-em/web/object/1996946'],
         ['https://youtu.be/xzCoP4NEbTg'],
      ],
   },

   // Headrest - Julia Chikamoneka
   {
      title: 'Julia Chikamoneka',
      object_URL: <Headrest />,
      object_name: 'Headrest',
      Object_description: [
         [
            'Made from one block of wood, with a support on top that has a depression to hold the neck of a sleeping person.',
         ],
         [
            'The headrest has decorations made by chipping out pieces of wood, completely cut out of wood pieces and also engravings in the wood.',
         ],
         [
            'The headrest is supported by two pieces of wood that are shaped like two half kneeling legs.',
         ],
         ['Base of the head rests burnt in black as a way of treating the wood.'],
      ],
      Figure_artifact_details:
         'Julia Mulenga ‘Chikamoneka’ was born Mary Nsofwa Lombe between 1904 and 1910 in Kasama Northern Zambia. She was the daughter of Mulenga Lombe son of Chief Chitimukulu-Ponde, who served as an African sergeant during the First world war. The exposure to the welfare associations introduced Julia to politics and she quit her job and opened a food stall near Kabwata where she mobilized fellow women marketeers into organized protests groups for the NRAC which later became known as the African National Congress (ANC). She used her position in the market where she interacted with many women of all walks of life to effectively recruit them to join ANC and encourage them to attend rallies. She went around at night ringing a stone-filled tin as a call to upcoming political events rallies. She also took up a leading role in planning protest marches and organizing boycotts of shops that discriminated based on race. Julia Chikamoneka’s led protests had such profound effects and ultimately led to the independence of Zambia in 1964.',
      figure_images_URLs: [
         'https://s3.example.com/images/julia_1.jpg',
         'https://s3.example.com/images/julia_2.jpg',
      ],
      figure_details: [
         ['The fierce activist and pioneer of freedom from colonial rule'],
         ['(1910 - 1986)'],
      ],
      figure_biography: [
         [
            'Julia Mulenga ‘Chikamoneka’ was born Mary Nsofwa Lombe between 1904 and 1910 in Kasama Northern Zambia. She was the daughter of Mulenga Lombe son of Chief Chitimukulu-Ponde, who served as an African sergeant during the First World War.',
         ],
         [
            'The exposure to the welfare associations introduced Julia to politics and she quit her job and opened a food stall near Kabwata where she mobilized fellow women marketeers into organized protests groups for the NRAC which later became known as the African National Congress (ANC).',
         ],
         [
            'She used her position in the market where she interacted with many women of all walks of life to effectively recruit them to join ANC and encourage them to attend rallies. She went around at night ringing a stone-filled tin as a call to upcoming political events rallies.',
         ],
         [
            'She also took up a leading role in planning protest marches and organizing boycotts of shops that discriminated based on race. Julia Chikamoneka’s led protests had such profound effects and ultimately led to the independence of Zambia in 1964.',
         ],
      ],
      figure_references: [
         ['https://collections.smvk.se/carlotta-em/web/object/1261202'],
         ['https://youtu.be/Ytc_wKNzows'],
      ],
   },

   // Mask - Loongo
   {
      title: 'Loongo',
      object_URL: <Mask />,
      object_name: 'Luvale Mask',
      Object_description: [
         [
            'The mask of Mwanapewo used in the Makishi masquerade. It is a female Likishi in an all male mask squad.',
         ],
         ['It represents beauty, fertility, and agility.'],
         [
            'During the Mukanda camp school, it provides the connection between the school, the village, and between the initiates and their mothers.',
         ],
         [
            'It had tribal markings of the Luvale people that showed beauty and it also has sharpened teeth, this is because Luvale women used to file their teeth to look beautiful.',
         ],
         [
            'However, the tribal markings and sharpening of teeth are no longer practiced.',
         ],
      ],
      Figure_artifact_details:
         'Loongo was the ruler of the Sala people of the Mumbwa area. She was the current ruler of the Sala people when the Makololo invaded her land. Loongo organized an all-women army and fought the Makololo, leaving a mark on the Makololo ranks through their sheer courage and determination. Although she was not successful in repelling the Makololo and was captured and held prisoner for a time by the Makololo, upon her release, she re-organized her people and brought back peace and dignity to her Kingdom. Due to her unusual courage and powers, the Makololo respected her and even though the Sala were conquered, they were never made to pay tribute by the Makololo like other conquered peoples.',
      figure_images_URLs: [
         'https://s3.example.com/images/loongo_1.jpg',
         'https://s3.example.com/images/loongo_2.jpg',
      ],
      figure_details: [
         ['The Warrior Queen of the Sala people'],
         ['(1910 - 1986)'],
      ],
      figure_biography: [
         [
            'She ruled the Sala people of the Mumbwa area. She was the current ruler of the Sala people when the Makololo invaded her land.',
         ],
         [
            'Loongo organized an all-women army and fought the Makololo, leaving a mark on the Makololo ranks through their sheer courage and determination.',
         ],
         [
            'Although she was not successful in repelling the Makololo and was captured and held prisoner for a time by the Makololo, upon her release, she re-organized her people and brought back peace and dignity to her Kingdom.',
         ],
         [
            'Due to her unusual courage and powers, the Makololo respected her and even though the Sala were conquered, they were never made to pay tribute by the Makololo like other conquered peoples.',
         ],
      ],
      figure_references: [
         ['https://collections.smvk.se/carlotta-em/web/object/2042752'],
         ['https://youtu.be/_wQ21pmFYZY'],
      ],
   },

   // Calabash - Mukwae
   {
      title: 'Mukwae',
      object_URL: <Calabash />,
      object_name: 'Calabash',
      Object_description: [
         [
            'Made from gourd, upper part decorated with engravings, braising, and chip offs darkened by burning.',
         ],
         ['Lower part knitted with fibres.'],
         [
            'The fibres are used for carrying as a handle but also a grip for the slippery nature of the gourd.',
         ],
      ],
      Figure_artifact_details:
         'The Mukwae Nalolo governed a province of the Barotse Kingdom of Nalolo. She also maintained a dignity second only to the Litunga, who was the King. After the scramble for Africa of 1884 to 1888, the Italians were given charge of delineating boundaries into new nations and many previous tribal boundaries were affected. The Mukwae wrote to the Italian Government and demanded that her land be clearly delineated from that of the Portuguese and stop them from infringing on her people’s rights. The Italians were forced to demarcate the boundary of her province along the 38th parallel of Longitude, which is the boundary line of Zambia that still stands today.',
      figure_images_URLs: [
         '  https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650977809986-EJ8RCQMPATGA7SH2TQK0/mukwae.dcca9f02ec09b75af383.png?format=2500w',
      ],

      figure_details: [
         ['The secretary of state for the Nalolo western province'],
         ['(1910 - 1986)'],
      ],
      figure_biography: [
         [
            'The Mukwae Nalolo governed a province of the Barotse Kingdom of Nalolo. She also maintained a dignity second only to the Litunga, who was the King.',
         ],
         [
            'After the scramble for Africa of 1884 to 1888, the Italians were given charge of delineating boundaries into new nations and many previous tribal boundaries were affected.',
         ],
         [
            'The Mukwae wrote to the Italian Government and demanded that her land be clearly delineated from that of the Portuguese and stop them from infringing on her people’s rights.',
         ],
         [
            'The Italians were forced to demarcate the boundary of her province along the 38th parallel of Longitude, which is the boundary line of Zambia that still stands today.',
         ],
      ],
      figure_references: [
         ['https://collections.smvk.se/carlotta-em/web/object/1996935'],
         ['https://www.youtube.com/watch?v=VwOAMAnLJQw'],
      ],
   },

   // Snuff Cup - Lueji Wa Nkonde
   {
      title: 'Lueji Wa Nkonde',
      object_URL: <Snuff />,
      object_name: 'Snuff Cup',
      Object_description: [
         ['Used to store and carry snuff (Tobacco).'],
         ['It has three openings: on both ends for loading the snuff.'],
         ['On one end it is closed with a wood stopper.'],
         [
            'Another small opening on the side of the container, for pouring out the snuff when one wants to use it. It is closed with an elaborate wood lid.',
         ],
         [
            'The wood is burnt black and oiled (Traditional way of treating wood) and decorated with engravings.',
         ],
      ],
      Figure_artifact_details:
         'Lueji was the daughter of Mwata Iyala Mwaku, a descendant of Queen Kenga Naweji. Mwata Iyala Mwaku appointed Lueji wa Konde as his successor, or Nswana Mu Luunda. He then gave her the Lukano bracelet, a sign of authority over all the Luunda tu buungo. She ruled the Lunda federation of Tubungo in the 1650s. Lueji’s reign resulted in the migration of various groups who became the Lunda, Luchazi, Luwena, Luvale and Chokwe, the Ndembu, Mbwela, Samba, Munungu, and the Mbunda people in today’s North-Western Province of Zambia. The migration also spread to adjacent areas in The Democratic Republic of Congo, Namibia, and Angola. Which has now become most of the population of Northwestern Province.',
      figure_images_URLs: [
         'https://s3.example.com/images/lueji_1.jpg',
         'https://s3.example.com/images/lueji_2.jpg',
      ],
      figure_details: [
         ['The 17th Century Political Negotiator'],
         ['(1910 - 1986)'],
      ],
      figure_biography: [
         [
            'Lueji was the daughter of Mwata Iyala Mwaku, a descendant of Queen Kenga Naweji. Mwata Iyala Mwaku appointed Lueji wa Konde as his successor, or Nswana Mu Luunda.',
         ],
         [
            'He then gave her the Lukano bracelet, a sign of authority over all the Luunda tu buungo. She ruled the Lunda federation of Tubungo in the 1650s.',
         ],
         [
            'Lueji’s reign resulted in the migration of various groups who became the Lunda, Luchazi, Luwena, Luvale and Chokwe, the Ndembu, Mbwela, Samba, Munungu, and the Mbunda people in today’s North-Western Province of Zambia.',
         ],
         [
            'The migration also spread to adjacent areas in The Democratic Republic of Congo, Namibia, and Angola. Which has now become most of the population of Northwestern Province.',
         ],
      ],
      figure_references: [
         ['https://collections.smvk.se/carlotta-em/web/object/1304494'],
         ['https://youtu.be/A1HEPtkt8P4'],
      ],
   },

   //Cowry Beads - Mwape
   {
      title: 'Mwape',
      object_URL: <Cowry />,
      object_name: 'Cowry Beads',
      Object_description: [
         [
            'A belt made of leather and cowry shells. Cowries were expensive in places far away from the sea like Zambia and could only be acquired by people of influence.',
         ],
         [
            'To possess such an item with such a large number of cowries meant the person that owned this belt was very wealthy.',
         ],
         [
            'The shells were also used as a medium of exchange and are also an indicator of the presence of long distance trade in the interior of Zambia.',
         ],
      ],
      Figure_artifact_details:
         'She was a ruler of a Kingdom that comprised the middle Luangwa and the Chuambira valley and further east, Mulilo, and Chisenga respectively at Chinshumbu and Kaundi who owed her allegiance.',
      figure_images_URLs: [
         'https://s3.example.com/images/mwenya_1.jpg',
         'https://s3.example.com/images/mwenya_2.jpg',
      ],
      figure_details: [
         ['A fearless warrior and ruler of middle Luangwa and Chuambira valley'],
         ['(1910 - 1986)'],
      ],
      figure_biography: [
         [
            'Being a fierce warrior, Mwape fought battles with the Chikunda slave traders and other Chiefs, extended her influence, protected her people, and imposed control over the trade routes in her land.',
         ],
      ],
      figure_references: [
         ['https://collections.smvk.se/carlotta-em/web/object/1600518'],
         ['https://youtu.be/VjXktuYSgfQ'],
      ],
   },
];

// Fetch the data based on the slug
const getData = (slug: string) => {
   return data.find(
      (item) => item.title.toLowerCase().replace(/ /g, '-') === slug
   );
};

interface PageProps {
   params: { slug: string };
}

const Page = ({ params }: { params: { slug: string } }) => {
   const [currentIndex, setCurrentIndex] = useState(() =>
      data.findIndex(
         (item) => item.title.toLowerCase().replace(/ /g, '-') === params.slug
      )
   );

   const figure = data[currentIndex];

   if (!figure) {
      return <div>Figure not found</div>;
   }

   const handleBack = () => {
      if (currentIndex > 0) {
         setCurrentIndex(currentIndex - 1);
         window.scrollTo(0, 0);
      }
   };

   const handleNext = () => {
      if (currentIndex < data.length - 1) {
         setCurrentIndex(currentIndex + 1);
         window.scrollTo(0, 0);
      }
   };

   const handleClose = () => {
      // Since we can't use the router, we'll use a simple redirect
      window.location.href = '/exhibit';
   };

   return (
      <div className="space-y-12 mx-6 my-28 lg:mx-[15%] relative">
         <button
            onClick={handleClose}
            className="absolute top-[-20px] right-0 text-brown-500 hover:text-brown-700"
            aria-label="Close and return to exhibit"
         >
            <X size={24} />
         </button>

         <h2>{figure.title}</h2>
         <article className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 gap-6 w-full">
            <SummitShareCanvas>{figure.object_URL}</SummitShareCanvas>

            <ul className="flex flex-col gap-3">
               <h2>About the {figure.object_name}</h2>
               {figure.Object_description.map((desc, index) => (
                  <li key={index}>
                     <p>{desc}</p>
                  </li>
               ))}
            </ul>
         </article>

         <ul className="space-y-3">
            <h2>Biography</h2>
            <ul className="space-y-3">
               <li>
                  <ul className="space-y-4 ">
                     {figure.figure_details.map((desc, index) => (
                        <li key={index}>
                           <p className="text-primary-100">{desc}</p>
                        </li>
                     ))}
                  </ul>
               </li>
            </ul>
            {figure.figure_biography.map((bio, index) => (
               <li key={index}>
                  <p>{bio}</p>
               </li>
            ))}
         </ul>

         <div className="space-y-3">
            <h2>References</h2>
            <ul className="space-y-2">
               {figure.figure_references.map((refArray, index) => (
                  <li key={index}>
                     {refArray.map((ref, subIndex) => (
                        <a
                           key={subIndex}
                           href={ref}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-block bg-white text-gray-800 border border-gray-300 rounded-full px-3 py-1 text-sm font-medium shadow-sm"
                        >
                           {ref}
                        </a>
                     ))}
                  </li>
               ))}
            </ul>
         </div>

         <div className="w-full rounded-[8px] bg-primary-50 space-y-4 px-[45px] py-6">
            <div className="space-y-2">
               <h3>Was this page informative?</h3>
               <p>Those who walked before us and those to come.</p>
            </div>

            <div className="flex flex-row gap-4">
               <div className="w-[73px]">
                  <Buttons type="primary" size="small">
                     Yes
                  </Buttons>
               </div>
               <div className="w-[73px]">
                  <Buttons type="secondary" size="small">
                     No
                  </Buttons>
               </div>
            </div>
         </div>

         <div className="space-y-4 md:flex md:flex-row md:gap-4 md:space-y-0">
            <Buttons
               type="secondary"
               active={currentIndex > 0}
               onClick={handleBack}
               disabled={currentIndex === 0}
            >
               Back
            </Buttons>
            <Buttons
               type="primary"
               active={currentIndex < data.length - 1}
               onClick={handleNext}
               disabled={currentIndex === data.length - 1}
            >
               Next
            </Buttons>
         </div>
      </div>
   );
};

export default Page;
