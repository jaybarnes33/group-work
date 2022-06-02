import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { Card, CardImg, Image, Nav } from "react-bootstrap";
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
    <Card className="mb-3">
      <CardImg
        src="/images/formbg.png"
        className="image2"
      />
      <Card.Body className="d-flex position-relative justify-content-center align-items-center flex-column ">
        <Image
          width={130}
          height={130}
          src={"/images/friends2.png"}
          alt="avatar"
          className="top-0 position-absolute"
          style={{
            transform: "translateY(-70%)",
          }}
          roundedCircle
        />
        <text className=" mt-4 bold text-center fs-7">Mike Dike</text>
        <text className="text-muting">@MikeD</text>
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
