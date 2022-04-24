import type { GetServerSideProps, NextPage } from 'next'
import { getSession, signIn, useSession } from 'next-auth/react'
import NextHead from 'next/head'
import VideoChat from '../components/VideoChat'

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
    <div>
      <Head />
      <h1>LOG IN</h1>
      <button onClick={() => signIn('github')}>Log</button>
    </div>
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
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
  )
}
