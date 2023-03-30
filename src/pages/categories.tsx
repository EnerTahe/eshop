import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import CategoryGrid from "../components/CategoryGrid";
import Skelton from "../components/Skelton";

const Home: NextPage = () => {
    const getAllCategories = async () => {
        try {
            const respJSON = await fetch("/api/categories");
            const resp = await respJSON.json();
            return resp;
        } catch (error) {
            throw error;
        }
    };

    const { isLoading, data } = useQuery(
        ["AllCategoreiesWithProducts"],
        getAllCategories
    );

    const categories = data?.categories;

    return (
        <div>
            <Head>
                <title>All Products</title>
                <meta name="description" content="All Products" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="">
                <Navbar />
                {isLoading ? (
                    <Skelton />
                ) : (
                    <>
                        {categories && categories?.length > 0 && (
                            <CategoryGrid
                                showLink={true}
                                categories={categories}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Home;