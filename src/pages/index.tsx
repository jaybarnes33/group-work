import UnAuthContent from "@/components/Auth/UnAuthContent";
import config from "@/config";
import axios from "axios";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { Container } from "react-bootstrap";
import Logo from "../components/Atoms/Logo";
import Articles from "../components/Organisms/Landing/Articles";
import Intro from "../components/Organisms/Landing/Intro";
import Services from "../components/Organisms/Landing/Service";
import Footer from "../components/Organisms/Layout/Footer";
import styles from "../styles/Landing.module.scss";

const Home = ({ articles }: { articles: Record<string, any>[] }) => {
  return (
    <UnAuthContent>
      <Head>
        <title>Settlin - Study and work abroad</title>
        <meta
          name="description"
          content="Connect and interact with people in the study, work and live abroad community and get all the information that you need."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <>
          <Intro />
          <Services />
          <Articles articles={articles} />
        </>
      </main>
    </UnAuthContent>
  );
};

export const getStaticProps = async () => {
  const {
    data: { posts },
  } = await axios.get(`${config.serverUrl}/api/posts`);

  return {
    props: {
      articles: posts,
    },
  };
};
export default Home;
