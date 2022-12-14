import React from "react";
import { Container } from "react-bootstrap";
//import { FriendsDataType } from '../FriendsList/FriendsData';
import FriendsData from "../FriendsList/FriendsData";
import styles from "../../../styles/friends.module.scss";
import { useSelector } from "@/redux/store";
import { selectUser } from "@/reduxFeatures/authState/authStateSlice";

const Articles = () => {
  const Data = useSelector(selectUser);

  return (
    <>
      <Container className={styles.friendBody}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo soluta
        harum repellendus saepe amet quos. Et aspernatur a ab! Consequuntur
        natus ratione dicta consectetur aspernatur omnis id nobis possimus
        molestias?
      </Container>
    </>
  );
};

export default Articles;
