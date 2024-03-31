import React from "react";
import Hero from "../components/common/hero/hero";
import ProductsContainer from "../components/common/productsContainer/productsContainer";
import AdminRegisterCard from "../components/common/adminRegisterCard/adminRegisterCard";

function Page() {
  return (
    <div className="space-y-12">
      <Hero />
      <ProductsContainer />
      <ProductsContainer />
      <AdminRegisterCard />
      <ProductsContainer />
    </div>
  );
}

export default Page;
