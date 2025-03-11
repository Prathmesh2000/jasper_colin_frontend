import SignUpComponent from "@/components/Signup";
import React from "react";

const SignUp = () => {
  return (
    <SignUpComponent />
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

export default SignUp;
