import React from "react";
import { Button, Card, Image } from "react-bootstrap";
import Age from "../../../Atoms/Age";

const PostCard = ({ post }: { post: Record<string, any> }) => {
  const postButton = [
    {
      name: "Like",
      reaction: true,
    },
    {
      name: "Share",
      reaction: true,
    },
    {
      name: "Comment",
      reaction: true,
    },
    {
      name: "Bookmark",
      reaction: true,
    },
  ];
  return (
    <>
      <Card className="my-3" style={{ border: "none" }}>
        <Card.Title className="position-relative mx-2 d-flex justify-content-start gap-2 p-2 border-bottom">
          <Image
            src={post.user_avatar.full}
            width={45}
            height={45}
            alt=""
            roundedCircle
          />
          <div className="d-flex flex-column">
            <small
              style={{ fontSize: "0.8rem" }}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            <span style={{ fontSize: "0.9rem" }}>
              <Age time={post.date} />
            </span>
            <Button
              variant="light"
              size="sm"
              className="position-absolute end-0"
            >
              <i className="bi bi-three-dots-vertical" />
            </Button>
          </div>
        </Card.Title>
        <Card.Body
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        <Card.Footer className="mx-2 d-flex justify-content-between bg-white">
          {postButton.map((item, key) => (
            <Button
              variant="none"
              className="d-flex justify-content-center gap-1 align-items-center"
            >
              <Image
                src={`/assets/icons/${item.name.toLowerCase()}.svg`}
                alt=""
                width={20}
                height={20}
              />
              {item.name}
            </Button>
          ))}
        </Card.Footer>
      </Card>
      <style jsx>
        {`
          small a {
            color: var(--bs-secondary) !important;
            font-weight: bold !important;
            display: none !important;
          }
        `}
      </style>
    </>
  );
};

export default PostCard;
