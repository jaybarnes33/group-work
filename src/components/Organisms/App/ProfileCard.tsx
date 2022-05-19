import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { Card, CardImg, Nav } from "react-bootstrap";
import About from "../../Templates/Profile/About";
import Bookmarks from "../../Templates/Profile/Bookmarks";
import Friends from "../../Templates/Profile/Friends";
import Media from "../../Templates/Profile/Media";
import Timeline from "../../Templates/Profile/Timeline";

interface IComponents {
  about: ReactNode;
  timeline: ReactNode;
  bookmarks: ReactNode;
  media: ReactNode;
  friends: ReactNode;
}
const Components: IComponents = {
  timeline: <Timeline />,
  about: <About />,
  media: <Media />,
  friends: <Friends />,
  bookmarks: <Bookmarks />,
};

const ProfileCard = () => {
  const { path } = useRouter().query;

  return (
    <Card>
      <CardImg
        src="/images/formbg.png"
        height={200}
        style={{ objectFit: "cover" }}
      />
      <Card.Body className="d-flex justify-content-center align-items-center flex-column ">
        <text className="bold fs-4">Mike Dike</text>
        <text className="text-muted">@MikeD</text>
        <text className="text-muted text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
          illum quasi voluptatem explicabo, tempore enim!
        </text>
        <text
          className="d-flex justify-content-between"
          style={{ width: "60%" }}
        >
          <div className="d-flex flex-column align-items-center">
            <span>1000</span>
            <span>following</span>
          </div>
          <div className="d-flex flex-column align-items-center">
            <span>1000</span>
            <span>following</span>
          </div>
        </text>
      </Card.Body>
      <Card.Footer>
        {" "}
        <Nav className="d-flex justify-content-around  text-capitalize">
          {Object.keys(Components).map((item, index) => (
            <Nav.Item
              key={item}
              className={item === path ? "text-primary" : "text-muted"}
            >
              <Link href={`/profile/${item}`}>{item}</Link>
            </Nav.Item>
          ))}
        </Nav>
      </Card.Footer>
    </Card>
  );
};

export default ProfileCard;
