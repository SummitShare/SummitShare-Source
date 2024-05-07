/**
 * ProductCard Component
 *
 * This component is designed to display a product card for items in an e-commerce or digital marketplace.
 * It features a visually appealing layout that showcases product images, author, title, price, and key details.
 * The component is built to be responsive, adapting its size for different screen widths. Each card is clickable,
 * leading to a more detailed product page or a related action.
 *
 * Props:
 * - `author`: The author or creator of the product.
 * - `title`: The title of the product.
 * - `price`: The price of the product.
 * - `detailOne` & `detailTwo`: Key details or specifications about the product.
 * - `valueOne` & `valueTwo`: Values corresponding to the details mentioned.
 *
 * The card design includes a background image (hardcoded for demonstration), visual indicators such as an author badge,
 * a price tag, and informative details about the product's features or specifications.
 *
 * Note: The background image is currently hardcoded. For dynamic image rendering, consider adding an `image` prop
 * to pass the image URL dynamically.
 */

import Link from "next/link";
import React from "react";
import { productCardsTypes } from "@/utils/dev/frontEndInterfaces";

const BlogCard: React.FC<any> = ({
  author,
  title,
  valueOne,

}: // image
productCardsTypes) => {
  return (
    <Link
      href="/"
      className="w-[48%] md:w-[16%] h-fit ring-1 ring-gray-300 rounded-xl p-2 space-y-2"
    >
     
      <div className="w-full flex flex-col justify-btween">
        <div className="ml-1 w-full flex flex-row gap-2 items-center justify-start">
          <div className="bg-blue-500 w-[6px] h-[6px] rounded-full"></div>
          <p className="text-[10px] text-gray-500">{author}</p>
        </div>
        <div className=" space-y-2">
        <div className=" ml-1 flex flex-row justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-950">{title}</h3>
        </div>
        <div className=" w-full rounded-xl bg-gray-100 p-[10px]">
          <div className="space-y-3">
            <p className="text-xs text-gray-500">Fahim, A., Hasan, M. and Chowdhurry, M.A. (2021) Smart Parking Systems: Comprehensive Review based on various aspects, Heliyon. Elsevier. Available a</p>
            <p className="text-xs font-semibold text-gray-950">{valueOne}</p>
          </div>
        </div>

        </div>
       
      </div>
    </Link>
  );
};

export default BlogCard;
