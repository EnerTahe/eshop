import NextImage from "next/image";
import NextLink from "next/link";
import { useEffect } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
import { TApiAllCategoriesResp } from "../types";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { CartContext } from "../components/CartContext";




interface IProductGrid extends TApiAllCategoriesResp {
  showLink: boolean;
  hasMore?: boolean;
  loadMoreFun?: Function;
}

const ProductGrid = (props: IProductGrid) => {
  const { categories, showLink, loadMoreFun, hasMore } = props;
  const { ref, inView } = useInView();

  const [open, setOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const {items, addToCart, removeFromCart} = useContext(CartContext);
  const [exists, setExists] = useState(false);


  const getSingleProduct = async (title) => {
    console.log("activated");
    console.log("title", title);
    try {
      const respJSON = await fetch(`/api/products/${title}`);
      const resp = await respJSON.json();
      console.log("success", resp.product);
      await setProductDetails(resp.product);
      console.log("productDetails1", productDetails);
      console.log("productDetails2", productDetails);
      return resp;
    } catch (error) {
      throw error;
    }
  };

  const openProductModal = async (title) => {
    console.log("start");
    setOpen(true);
    await getSingleProduct(title);
    console.log("done", productDetails);
  };

  useEffect(() => {
    const inCart = items.find((item) => item.id === id);

    if (inCart) {
      setExists(true);
    } else {
      setExists(false);
    }

    if (inView) {
      if (loadMoreFun) loadMoreFun();
    }
  }, [inView, loadMoreFun, items, id]);

  return (
    <div className="bg-white">
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                      <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                        <img
                          src={productDetails.image}
                          alt={productDetails.title}
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="sm:col-span-8 lg:col-span-7">
                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                          {productDetails.title}
                        </h2>

                        <section
                          aria-labelledby="information-heading"
                          className="mt-2"
                        >
                          <h3 id="information-heading" className="sr-only">
                            Product information
                          </h3>

                          <p className="text-2xl text-gray-900">
                            ${productDetails.price}
                          </p>
                          <p>In stock: {productDetails.quantity}</p>
                        </section>

                        <section
                          aria-labelledby="options-heading"
                          className="mt-10"
                        >
                          <h3 id="options-heading" className="">
                            {productDetails.description}
                          </h3>

                          <form>
                            

                            {/* <button
                              type="submit"
                              className="mt-20 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Add to bag
                            </button> */}
                            {
     exists
     ? <button onClick={() => removeFromCart(id)}>Remove from Cart</button>
     : <button onClick={() => addToCart({id, name, price})}>Add to Cart</button>
   }
                          </form>
                        </section>
                      </div>
                    </div>
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
                  {/* <NextLink href={`/product/${product.title}`}>
                    <p className="relative flex items-center justify-center rounded-md border border-transparent bg-sky-800 py-2 px-8 text-sm font-medium text-white hover:bg-sky-900 hover:cursor-pointer">
                      View More Details
                    </p>
                  </NextLink> */}
                  <button
                    className="relative flex items-center justify-center rounded-md border border-transparent bg-sky-800 py-2 px-8 text-sm font-medium text-white hover:bg-sky-900 hover:cursor-pointer"
                    onClick={(title) => openProductModal(product.title)}
                  >
                    CLICK ME PLS
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
