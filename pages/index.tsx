import type { GetServerSideProps, NextPage } from 'next'
import { getSession, signIn, useSession } from 'next-auth/react'
import NextHead from 'next/head'
import VideoChat from '../components/VideoChat'
import LoginButton from '../components/LogginButton'
import Image from 'next/image'

const Home: NextPage = () => {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <Head />
        <VideoChat />
      </div>
    )
  }

  return (
    <>
      <Head />
      <div className='flex h-screen items-center justify-center space-between bg-background'>
        <div className='h-96 mx-auto w-96 bg-primary p-10 rounded text-center shadow-md'>

          <div className='flex flex-col justify-center items-center space-y-4 h-full'>
          <Image className='' src={'/logo.png'} alt='DEV MEET' width='200px' height='200px' priority layout='fixed' />
          <h2 className='text-newWhite'>Video Chat App for developers</h2>
            <div>
              <LoginButton provider='github'>
                LOG IN
              </LoginButton>
            </div>
          </div>
        </div>
      </div>
      <h1>LOG IN</h1>
      <button onClick={() => signIn('github')}>Log</button>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  return {
    props: {
      session
    }
  }
}

const Head: NextPage = () => {
  return (
    <NextHead>
        <title>Dev meet</title>
        <meta name="description" content="Video chat App for developers" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </NextHead>
  )
}
