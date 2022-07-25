import React, { useEffect, useState, ReactNode } from "react";
import { Card, CardImg, Container, Nav, Spinner } from "react-bootstrap";
import PostCard from "../../components/Organisms/App/PostCard";
import CreatePost from "../../components/Organisms/CreatePost";
import axios from "axios";
import config from "@/config";
import styles from "../../styles/feed.module.scss";
import Head from "next/head";
import UserCard from "../../components/Organisms/App/UserCard";
import Discussions from "../../components/Organisms/App/Discussions/Discussions";
import { usePagination } from "../../hooks/usePagination-old";
import { useRouter } from "next/router";
import About from "../../components/Templates/Profile/About";
import Timeline from "../../components/Templates/Profile/Timeline";
import Friends from "../../components/Templates/Profile/Friends";
import Media from "../../components/Templates/Profile/Media";
import Bookmarks from "../../components/Templates/Profile/Bookmarks";
import Link from "next/link";
import ProfileCard from "../../components/Organisms/App/ProfileCard";
import AuthContent from "@/components/Auth/AuthContent";
interface IComponents {
  about: ReactNode;
  timeline: ReactNode;
  bookmarks: ReactNode;
  media: ReactNode;
  friends: ReactNode;
}

const Profile = () => {
  //const { posts,  hasMore, isFetchingMore } = usePagination();

  const [path, setPath] = useState("timeline");
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${config.serverUrl}/api/posts/user/all`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log(response.data);
        setData(response.data.posts);
      } catch (error) {
        console.log(error.response?.data);
      }
    })();
    document.body.style.backgroundColor = "#f6f6f6";

    return () => {
      document.body.style.backgroundColor = "initial";
    };
  }, []);

  const Components: IComponents = {
    timeline: <Timeline Posts={data} />,
    about: <About />,
    media: <Media />,
    friends: <Friends />,
    bookmarks: <Bookmarks />,
  };
  return (
    <AuthContent>
      <Head>
        <title>Profile</title>
      </Head>
      <Container>
        <div className={`padding-top mt-3 ${styles.profileWrapper}`}>
          <>
            <div
              style={{ width: 250 }}
              className="position-fixed d-none d-md-flex flex-column gap-4 vh-100"
            >
              <Discussions />
            </div>
          </>

          <main className={styles.profile}>
            <ProfileCard active={path} handlePath={setPath} />

            {Components[path as unknown as string]}
          </main>
        </div>
      </Container>
    </AuthContent>
  );
};

export default Profile;
