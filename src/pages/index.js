import ProductViewComponet from "@/components/ProductView";
import React from "react";

export function ProductsPage({role='user'}) {
  return <ProductViewComponet role={role}/>
}

export async function getServerSideProps(context) { 
  const {req, res, query} = context || {};
  const role = req.role || 'user';
  const userData = req.user || {};

  if(!userData?.userId?.length) {
    return {
      redirect: {
        destination: '/login', 
        permanent: false,
      },
    };
  }
  
  return {
    props: {
      role: role
    }
  }
}

export default ProductsPage;