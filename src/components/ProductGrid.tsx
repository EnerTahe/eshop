import NextImage from "next/image";
import NextLink from "next/link";

import React, { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { AiOutlineRight } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
import { TApiAllCategoriesResp } from "../types";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface IProductGrid extends TApiAllCategoriesResp {
  showLink: boolean;
  hasMore?: boolean;
  loadMoreFun?: Function;
}

const ProductGrid = (props: IProductGrid) => {
  const { categories, showLink, loadMoreFun, hasMore } = props;
  const { ref, inView } = useInView();
  const [productOpen, setProductOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  const cancelButtonRef = useRef(null);

  const getSingleProduct = async (title) => {
    console.log("activated");
    console.log("title", title);
    try {
      const respJSON = await fetch(`/api/products/${title}`);
      const resp = await respJSON.json();
      console.log("success", resp.product);
      await setProductDetails(resp.product);
      console.log("productDetails1", productDetails.title);
      console.log("productDetails2", productDetails);
      return resp;
    } catch (error) {
      throw error;
    }
  };

  const openProductModal = async (title) => {
    console.log("start");
    setProductOpen(true);
    await getSingleProduct(title);
    console.log("done", productDetails);
  };

  useEffect(() => {
    if (inView) {
      if (loadMoreFun) loadMoreFun();
    }
  }, [inView, loadMoreFun]);

  return (
    <div className="bg-white">
      <Transition.Root show={productOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-0"
          initialFocus={cancelButtonRef}
          onClose={setProductOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-2 pt-3 pb-2 sm:p-3 sm:pb-2">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {productDetails.title}
                        </Dialog.Title>

                        <img
                          src={productDetails.image}
                          alt={productDetails.image}
                          className="h-max w-max object-cover object-center"
                        />
                        <div className="mt-2"></div>
                        <p className="text-sm text-gray-500">
                          Are you sure you want to deactivate your account? All
                          of your data will be permanently removed. This action
                          cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => setProductOpen(false)}
                    >
                      Deactivate
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setProductOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {categories.map((category) => (
        <div className="mt-12  p-6" key={category.name}>
          <div className="flex flex-row justify-between">
            <span className="inline-flex items-center rounded-md bg-sky-800 px-8 py-2 text-md font-medium text-white">
              {category.name}
            </span>
            {showLink && (
              <NextLink href={`/category/${category.id}`}>
                <p className="flex flex-row gap-2 underline hover:cursor-pointer items-center">
                  View More
                  <AiOutlineRight />
                </p>
              </NextLink>
            )}
          </div>
          <div className="mt-6  grid grid-cols-1 gap-y-10 gap-x-6 xl:gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {category?.products.map((product) => (
              <div
                className="p-6 group rounded-lg border border-gray-200 bg-neutral-200"
                key={product.title}
              >
                <div className="min-h-80 w-full overflow-hidden rounded-md group-hover:opacity-75 lg:aspect-none lg:h-80">
                  <NextImage
                    priority={true}
                    layout="responsive"
                    width="25"
                    height="25"
                    src={`${product.image}`}
                    alt={product.title}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="relative mt-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.price}</p>
                </div>
                <div className="mt-6">
                  {/* <NextLink
                                        href={`/product/${product.title}`}
                                    >
                                        <p className="relative flex items-center justify-center rounded-md border border-transparent bg-sky-800 py-2 px-8 text-sm font-medium text-white hover:bg-sky-900 hover:cursor-pointer">
                                            View More Details
                                        </p>
                                    </NextLink> */}
                  <button onClick={(title) => openProductModal(product.title)}>
                    {" "}
                    Click Me{product.title}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!showLink && (
            <div className="flex items-center justify-center mt-8">
              {hasMore ? (
                <button
                  ref={ref}
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-sky-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-900"
                >
                  Loading...
                </button>
              ) : (
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 w-full">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        You have viewed all the Products under this category.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {showLink && (
            <div className="w-full border-b border-gray-300 mt-24" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
