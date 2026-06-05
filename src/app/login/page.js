import { Suspense } from "react";
import LoginContent from "./LoginContent";

import React from 'react'

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />      
    </Suspense>
  );
}

export default LoginPage
