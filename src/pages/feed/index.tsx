// import useUser from "@/hooks/useUser";
import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "@/redux/store";
import { Col, Container, Image, Row, Spinner } from "react-bootstrap";
import AuthContent from "@/components/Auth/AuthContent";
import Discussions from "@/components/Organisms/App/Discussions/Discussions";
import PostCard from "@/components/Organisms/App/PostCard";
import UserCard from "@/components/Organisms/App/UserCard";
import CreatePost from "@/components/Organisms/CreatePost";
import Modal from "@/components/Organisms/Layout/Modal/Modal";
import { selectUser } from "@/reduxFeatures/authState/authStateSlice";

import { usePagination } from "@/hooks/usePagination";
import styles from "@/styles/feed.module.scss";

const Feed = () => {
  // const { data } = useSelector(s=>s.user);
  const data = useSelector(selectUser);
  //const { posts, setPage, hasMore, isFetchingMore } = usePagination();

  const [scrollInitialised, setScrollInitialised] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const checkScroll = () => {
    if (window.scrollY > 100) {
      setScrollInitialised(true);
    }
  };

  useEffect(() => {
    (async function () {
      try {
        const response = await axios.get(`/api/posts`);
        // console.log(response.data);

        setPosts(response.data.posts);
        setIsFetching(false);
        const userResponse = await axios.get("/api/user", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setUsers(userResponse.data.users);
      } catch (error) {
        // console.log(error.response?.data);
      }
    })();

    document.body.style.backgroundColor = "#f6f6f6";
    window.addEventListener("scroll", checkScroll);

    return () => {
      document.body.style.backgroundColor = "initial";
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <AuthContent>
      <Head>
        <title>Feed</title>
      </Head>
      <Container>
        <div className={`mt-3 ${styles.wrapper}`}>
          <>
            <div
              style={{ width: 250 }}
              className="position-fixed d-none d-lg-flex flex-column gap-4 vh-100"
            >
              <UserCard user={data!} />
              <Discussions posts={posts} />
            </div>
          </>

          <main className={styles.posts} id="posts">
            <CreatePost />
            <div
              id="instersection"
              style={{
                height: "30vh",
                width: "100%",
                position: "fixed",
                bottom: 0,
              }}
            ></div>
            {/* <InfiniteScroll
              dataLength={Number(posts?.length)} //This is important field to render the next data
              next={fetchData}
              hasMore={true}
              initialScrollY={0}
              loader={
                <div className="m-2 p-2 d-flex justify-content-center">
                <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  </div>
                }
                endMessage={
                  <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                  </p>
                }
              > */}
            {posts?.map((post) => (
              <PostCard post={post} key={`activity-post-${post.id}`} trimmed />
            ))}
            {isFetching && (
              <div className="m-2 p-2 d-flex justify-content-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
            {/* {!hasMore && (
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            )} */}
            {/* </InfiniteScroll> */}
          </main>
          <div
            style={{ width: 270 }}
            className="position-fixed d-none d-xxxl-flex  end-0 me-5  vh-100 "
          >
            <Discussions />
          </div>
        </div>
      </Container>
    </AuthContent>
  );
};

export default Feed;
