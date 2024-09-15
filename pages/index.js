import Head from "next/head";
import ControlPad from "../components/ControlPad";

export async function getServerSideProps() {
  const audioUrl = "/audio/tts-audio.mp3"; // 
  return { props: { audioUrl } };
}

const Home = ({ audioUrl }) => {
  return (
    <>
      <div>
        <Head>
          <link rel="stylesheet" href="/globals.css" />
        </Head>
        <ControlPad />
      </div>
    </>
  );
};

export default Home;
