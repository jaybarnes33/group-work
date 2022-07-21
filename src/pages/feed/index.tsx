/* eslint-disable react-hooks/exhaustive-deps */
import MessageButton from "@/components/Atoms/messageButton";
import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";
import {
  Container,
  Spinner,
  Modal,
  Form,
  Image,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import AuthContent from "@/components/Auth/AuthContent";
import Discussions from "@/components/Organisms/App/Discussions/Discussions";
import ModalCard from "@/components/Organisms/App/ModalCard";
import PostCard from "@/components/Organisms/App/PostCard";
import UserCard from "@/components/Organisms/App/UserCard";
import CreatePost from "@/components/Organisms/CreatePost";
import { toast, ToastContainer } from "react-toastify";
import { selectUser } from "@/reduxFeatures/authState/authStateSlice";
import { MdOutlineCancel } from "react-icons/md";
// import { usePagination } from "@/hooks/usePagination";
import usePagination, { Loader } from "@/hooks/usePagination2";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/feed.module.scss";
import Follow from "@/components/Organisms/App/Follow";
import { useDispatch, useSelector } from "@/redux/store";
import { selectNewFeed } from "@/reduxFeatures/api/feedSlice";

import { MdOutlineCancel } from "react-icons/md";
import formStyles from "../../styles/templates/new-group/formField.module.css";
import Editor from "@/components/Organisms/SlateEditor/Editor";
import { useModalWithData } from "@/hooks/useModalWithData";
import { FaTimes } from "react-icons/fa";

const Feed = () => {
  const data = useSelector(selectUser);
  const dispatch = useDispatch();
  const newFeed = useSelector(selectNewFeed);
  //const { posts, setPage, hasMore, isFetchingMore } = usePagination();
  const [scrollInitialised, setScrollInitialised] = useState(false);
  const [posts, setPosts] = useState([]);
  // const [numPages, setNumPages] = useState(0);
  const [errorState, setErrorState] = useState(null);
  const [loadingMoreState, setLoadingMoreState] = useState(null);
  const [sizeState, setSizeState] = useState(0);

  const [isFetching, setIsFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const { modalOpen, toggle, selected, setSelected } = useModalWithData();

  const [formData, setFormData] = useState({
    post: "",
  });
  // const [newFeed, setNewFeed] = useState();

  // const checkScroll = () => {
  //   if (window.scrollY > 100) {
  //     setScrollInitialised(true);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (formData.post == "")
  //     return toast.error("Field cannot be empty", {
  //       position: toast.POSITION.TOP_RIGHT,
  //       toastId: "1",
  //     });
  //   setUploading(true);
  //   console.log(formData);

  //   try {
  //     const response = await axios.post(
  //       `${config.serverUrl}/api/feeds`,
  //       { ...formData },
  //       {
  //         headers: {
  //           authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     toast.success("Post uploaded successfully", {
  //       position: toast.POSITION.TOP_RIGHT,
  //       toastId: "1",
  //     });
  //     setNewFeed(response.data);
  //     setShowModal(false);
  //     setUploading(false);
  //     // fetchPost()
  //   } catch (error) {
  //     console.log(error.response?.data);
  //     toast.error("Failed to upload post", {
  //       position: toast.POSITION.TOP_RIGHT,
  //       toastId: "1",
  //     });
  //     setShowModal(false);
  //     setUploading(false);
  //   }
  // };

  const {
    paginatedData,
    isReachedEnd,
    loadingMore,
    size,
    setSize,
    error,
    mutate,
    isValidating,
  } = usePagination("/api/feed", sizeState);

  useEffect(() => {
    // Auto-Update new post to feed
    setPosts([newFeed.feed, ...posts]);
  }, [newFeed]);

  useEffect(() => {
    if (paginatedData) {
      // console.log("POSTS:", posts);
      // let newPost = [...posts, ...paginatedData[0]?.feed];
      // console.log("newPost:", newPost);
      // console.log("posts:", posts);
      // console.log("paginatedData[0]?.feed:", paginatedData[0]?.feed);
      // setPosts(newPost);
      setPosts((pre) => {
        // console.log("PRE:", pre);
        return paginatedData[0]?.feed;
      });
      // setPosts(newPost);
      // setPosts([...paginatedData[0]?.feed]);
      // setPosts((pre) => [...paginatedData[0]?.feed]);
      // console.log("paginatedData CHANGED", paginatedData);
    }
    // if (size) {
    //   setSizeState(size);
    //   // console.log("SIZZZZE");
    //   if (paginatedData) {
    //     setPosts(paginatedData[0]?.feed);
    //   }
    // }
    if (loadingMore) {
      setLoadingMoreState(loadingMore);
    }
    if (error) {
      // console.log("ERROR:", error);
      setErrorState(error);
    }
    // (async function () {
    //   try {
    //     const response = await axios.get(`${config.serverUrl}/api/feed`);
    //     setPosts(response.data.feed);
    //   } catch (error) {
    //     console.log(error.response?.data);
    //   }
    // })();
    // document.body.style.backgroundColor = "#f6f6f6";
    // window.addEventListener("scroll", checkScroll);
    // return () => {
    //   document.body.style.backgroundColor = "initial";
    //   window.removeEventListener("scroll", checkScroll);
    // };
    // // }, [handleSubmit]);
    // }, []);
  }, [paginatedData]);
  // }, [paginatedData, error, loadingMore, size, sizeState]);

  // const handleChange = (e) => {
  //   const clone = { ...formData };
  //   clone[e.currentTarget.name] = e.currentTarget.value;
  //   setFormData(clone);
  //   console.log(formData);
  // };

  return (
    <AuthContent>
      <ToastContainer />
      <Head>
        <title>Feed</title>
      </Head>
      <MessageButton />
      <Container>
        <div className="row mt-lg-5">
          {/* <div className={`mt-3 ${styles.wrapper}`}> */}
          <div className="d-none d-lg-flex col-lg-3 col-xl-2 me-xl-4">
            <div
              // style={{ width: 230 }}
              // className="position-fixed d-none d-lg-flex flex-column vh-100"
              className={`${styles.userCardDiscussion} position-fixed d-flex flex-column vh-100`}
            >
              <div className="col-xs-12">
                <UserCard user={data!} />
              </div>
              <div className="col-xs-12">
                <Discussions posts={posts} />
              </div>
            </div>
          </div>

          <main
            className={`${styles.posts} col-12 col-lg-7 col-xl-7 ms-xl-5 ms-xxl-4`}
            id="posts"
          >
            <CreatePost pageAt={"/feed"} />
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

            {posts?.map((post, index) => (
              // <div
              //   onClick={() => {
              //     setSelected(post);
              //     toggle();
              //   }}
              // >
              <PostCard
                post={post}
                key={`activity-post-${index}-${post.id}`}
                trimmed
              />
              // </div>
            ))}

            {errorState && (
              <p style={{ textAlign: "center" }}>
                <b>Oops! Something went wrong (STATE)</b>
              </p>
            )}

            {error && (
              <p style={{ textAlign: "center" }}>
                <b>Oops! Something went wrong</b>
              </p>
            )}

            {!posts && <Loader />}
            {!paginatedData && <Loader />}

            {/* {loadingMoreState && <Loader />} */}
            {loadingMore && <Loader />}

            {/* {isFetching && (
              <div className="m-2 p-2 d-flex justify-content-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )} */}

            {/* {!hasMore && (
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            )} */}
            {/* </InfiniteScroll> */}
          </main>
          <div
            // style={{ width: 270 }}
            // className="position-fixed d-none d-xxl-flex end-0 me-5 vh-100 "
            className="d-none d-lg-flex col-lg-3 col-xl-3 position-fixed end-0 ps-lg-5 ps-xxl-3 me-xl-2 ms-xxl-4 vh-100"
          >
            <Follow />
            {!isReachedEnd && (
              // <button onClick={() => setSize(size + 1)}>Load More</button>
              <button
                onClick={() => {
                  setSizeState(sizeState + 1);
                  setSize(sizeState);
                }}
              >
                Load More
              </button>
            )}
            {/* {console.log("size:", size)}
            {console.log("isReachedEnd:", isReachedEnd)} */}
            {/* {console.log("loadingMore:", loadingMore)} */}
          </div>
          {/* </div> */}
        </div>
      </Container>

      {/* <Modal
        show={showModal}
        className={styles.GistModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <span className={styles.closeBtn}>
          {" "}
          <FaTimes
            color="#207681"
            style={{ cursor: "pointer" }}
            size={35}
            onClick={() => setShowModal(false)}
          />{" "}
        </span>
        <div className={styles.newGistModal}>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className={formStyles.formGroup}>
              <Form.Control
                className={formStyles.bigForm}
                as="textarea"
                name="post"
                type="text"
                required
                placeholder="Write something"
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <Button variant="primary" className="d-flex mx-auto" type="submit">
              {uploading ? "uploading..." : "Continue"}
            </Button>
          </Form>
        </div>
      </Modal> */}

      <Modal
        show={modalOpen}
        className={styles.FeedModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="xl"
        scrollable={true}
      >
        <span className={styles.openBtn}>
          {" "}
          <MdOutlineCancel
            style={{ cursor: "pointer" }}
            size={30}
            onClick={() => toggle()}
          />{" "}
        </span>
        {selected.images ? (
          <Row>
            <Col lg={6}></Col>
            <Col lg={6}>
              {" "}
              <ModalCard post={selected} />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col lg={12} className="px-5">
              <ModalCard post={selected} />
            </Col>
          </Row>
        )}
      </Modal>
    </AuthContent>
  );
};

export default Feed;
