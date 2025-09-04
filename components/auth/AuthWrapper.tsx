"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Login from './Login'
import Register from './Register'

const AuthWrapper = () => {

  const [state,setState] = useState<AuthType>("Login")
  return (
    <div >
        <Card className='px-8 py-6 font-poppins flex items-center justify-start flex-col w-[28vw]'>
            <CardHeader>
                <CardTitle className='text-2xl font-bold'>
                   {state !== "None" &&  `${state} to EchoVault` }
                </CardTitle>
            </CardHeader>
            <CardContent className='w-full'>
                {state == "Login" ? <Login state={state} setState={setState}/> : <Register state={state} setState={setState}/>}
            </CardContent>
        </Card>
    </div>
  )
}

export default AuthWrapper  