/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import Age from "../../Atoms/Age";
import DOMPurify from "dompurify";
import { useSelector } from "@/redux/store";
import { selectUser } from "@/reduxFeatures/authState/authStateSlice";
import {
  selectCommentIsDeleted,
  selectCommentIsEdited,
} from "@/reduxFeatures/app/postModalCardSlice";
import config from "@/config";
import axios from "axios";

import styles from "@/styles/utils.module.scss";
import { PostMenuModal } from "./PostMenu";

const Replies = ({
  reply: replyComingIn,
  currentlyFollowing,
  handleEditComment,
  handleDeleteComment,
  changeFollowingStatus,
}: Record<string, any>) => {
  const [liked, setLiked] = useState(false);
  // const [comment, setCommentComingIn] = useState(commentComingIn);
  const [reply, setReplyComingIn] = useState(replyComingIn);
  const user = useSelector(selectUser);
  const replyIsEdited = useSelector(selectCommentIsEdited);
  const replyIsDeleted = useSelector(selectCommentIsDeleted);
  const sanitizer = DOMPurify.sanitize;
  // console.log(reply);

  // Auto Render Reply after post
  useEffect(() => {
    setReplyComingIn(replyComingIn);
  }, [replyComingIn]);

  // Auto Render Comment after post Edit
  useEffect(() => {
    if (reply?._id === replyIsEdited?._id) {
      setReplyComingIn(replyIsEdited);
    }
  }, [replyIsEdited]);

  // Auto Render Reply after post Deletion
  useEffect(() => {
    if (reply?._id === replyIsDeleted?._id) {
      setReplyComingIn(replyIsDeleted);
    }
  }, [replyIsDeleted]);

  useEffect(() => {
    // Monitor & Set Like Status
    if (reply?.likes?.includes(user?._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [reply]);

  const handleLike = async () => {
    try {
      const { data } = await axios.get(
        `${config.serverUrl}/api/likes/?type=comment&id=${reply?._id}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!reply?.likes.includes(user?._id)) {
        let newReply = { ...reply };
        newReply?.likes.push(user?._id);

        setLiked(true);
        setReplyComingIn(newReply);
      }
    } catch (error) {
      // console.error(error.response?.data);
    }
  };

  const handleUnLike = async () => {
    try {
      const { data } = await axios.delete(
        `${config.serverUrl}/api/likes/?type=comment&id=${reply?._id}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (reply?.likes.includes(user?._id)) {
        let newReply = { ...reply };
        let newLikesArr = newReply?.likes.filter((newC) => {
          return newC !== user?._id;
        });

        newReply.likes = newLikesArr;

        setLiked(false);
        setReplyComingIn(newReply);
      }
    } catch (error) {
      // console.error(error.response?.data);
    }
  };

  return (
    <Card
      className={`${styles.replies} mt-3 `}
      style={{
        border: "none",
        width: "90%",
        background: "none",
        lineHeight: "1.2",
      }}
    >
      {console.log("reply:", reply)}
      <hr
        className="w-75 mx-auto text-primary"
        style={{ marginTop: "-.2rem" }}
      />

      <div className="d-flex align-items-center justify-content-start gap-2 mt-1">
        <Image
          src="/images/friends3.png"
          alt="User avatar"
          width={50}
          height={50}
          fluid
          roundedCircle
        />
        <div>
          <h6 style={{ fontWeight: "bold" }}>
            {reply?.author?.firstName && reply?.author?.firstName}{" "}
            {reply?.author?.lastName && reply?.author?.lastName}
            <br />
            <small
              style={{ color: "gray", fontSize: "12px", fontWeight: "400" }}
            >
              <Age time={reply?.createdAt} />
            </small>
          </h6>
        </div>
        <div className="col-2 ms-auto me-5">
          {/* Menu Dots */}
          <PostMenuModal
            user={user}
            currentlyFollowing={currentlyFollowing}
            comment={reply}
            handleEditComment={handleEditComment}
            handleDeleteComment={handleDeleteComment}
            changeFollowingStatus={changeFollowingStatus}
          />
        </div>
      </div>
      <Card.Body
        className="container px-md-5"
        dangerouslySetInnerHTML={{
          __html: sanitizer(reply?.content),
        }}
      />

      <div className="buttons d-flex gap-2 justify-content-end mr-4">
        <small
          className="text-muted"
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (liked) {
              handleUnLike();
            } else {
              handleLike();
            }
          }}
        >
          {reply?.likes?.length > 0 && (
            <small className="badge rounded-pill bg-primary px-2 py-1 text-white">
              {reply.likes?.length}
            </small>
          )}{" "}
          {liked ? "Unlike" : "Like"}
        </small>
      </div>
    </Card>
  );
};

export default Replies;
