import ControlPad from "../components/ControlPad";

export async function getServerSideProps() {
  const audioUrl = "/audio/tts-audio.mp3"; // 
  return { props: { audioUrl } };
}

const Home = ({ audioUrl }) => {
  return (
    <>
      <div>
        <ControlPad />
      </div>
    </>
  );
};

export default Home;
