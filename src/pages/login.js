import React from "react";
import LoginComponent from "@/components/Login";

const LoginPage = () => {
    return(
      <LoginComponent />
    )
};

export async function getServerSideProps(context) { 
  const {req, res, query} = context || {};
  const userData = req.user || {};

  if(userData?.userId?.length) {
    return {
      redirect: {
        destination: '/', 
        permanent: false,
      },
    };
  }

  return {
    props: {}
  }
}

export default LoginPage;
