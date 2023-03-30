import NextImage from "next/image";
import NextLink from "next/link";
import { useEffect } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
import { TApiAllCategoriesResp } from "../types";
import { Fragment, useState } from "react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";


interface IProductGrid extends TApiAllCategoriesResp {
  showLink: boolean;
  hasMore?: boolean;
  loadMoreFun?: Function;
}

const ProductGrid = (props: IProductGrid) => {
  const { categories, showLink, loadMoreFun, hasMore } = props;
  const { ref, inView } = useInView();



  useEffect(() => {
    if (inView) {
      if (loadMoreFun) loadMoreFun();
    }
  }, [inView, loadMoreFun]);

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">All categories</h2>
      <div className="mt-6 space-y-12 lg:grid lg:grid-cols-5 lg:gap-x-6 lg:space-y-0">
      {categories.map((category) => (
        <div key={category.name} className="group relative">
        <div className="relative h-full w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
          <img
            src={category.categoryImage}
            alt={category.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

  <div className=" mb-5"><NextLink href={`/category/${category.id}`}>
      <p className="flex flex-row gap-2 underline hover:cursor-pointer items-center">
        Go to {category.name} category
        <AiOutlineRight />
      </p>
    </NextLink></div>
        
    </div>
          ))}
    </div>
    </div>
    </div>
      </div>
  );
};

export default ProductGrid;
