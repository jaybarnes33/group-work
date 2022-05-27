//@ts-nocheck
import React, { useState } from "react";
import { Card, Container, Fade, Image, Row } from "react-bootstrap";
import ChatBubble from "../components/Chat/ChatBubble";
import { dummyData } from "../components/Chat/dummyData";

const Chat = () => {
  const [open, setOpen] = useState(true);
  const [selectUserToChatTimeline, setSelectUserToChatTimeline] = useState("");
  const [initMessages, setInitMessages] = useState(dummyData);

  const [messages, setMessages] = useState(initMessages);

  const backToSideMessages = (e) => {
    if (window.innerWidth < 768) {
      document.querySelector("#mainDisplay").classList.add("d-none");
      document.querySelector("#mainSidebar").classList.remove("d-none");
    }
  };

  const startChat = () => {
    setSelectUserToChatTimeline("");

    // Mid Point Display (using Bootstrap d-md-block)
    if (window.innerWidth < 768) {
      document.querySelector("#mainDisplay").classList.remove("d-none");
      document.querySelector("#mainSidebar").classList.add("d-none");
    } else if (window.innerWidth >= 768) {
      document.querySelector("#mainDisplay").classList.remove("d-none");
      document.querySelector("#mainSidebar").classList.remove("d-none");
    }
  };

  const startChattingWith = (e) => {
    // Mid Point Display (using Bootstrap d-md-block)
    if (window.innerWidth < 768) {
      document.querySelector("#mainDisplay").classList.remove("d-none");
      document.querySelector("#mainSidebar").classList.add("d-none");
    } else if (window.innerWidth >= 768) {
      document.querySelector("#mainDisplay").classList.remove("d-none");
      document.querySelector("#mainSidebar").classList.remove("d-none");
    }

    // get data of custom attribute
    const id = e.target.dataset.nameid;

    // Get current user
    const user = messages.filter((message) => {
      return message.id === id && message;
    });

    // If Same Message is selected twice, then the displayed message would be removed from message UI
    if (JSON.stringify(selectUserToChatTimeline) === JSON.stringify(user[0])) {
      setSelectUserToChatTimeline("");
    } else {
      // change unread message to "" because it is now been read
      user[0].unreadMessage = "";
      setSelectUserToChatTimeline(user[0]);
    }
  };
  //   Leave below event for Event Bobbling
  const startChattingWithChild = (e) => {};

  const searchMessages = (e) => {
    let currentMessages = [...initMessages];

    currentMessages = currentMessages.filter((item) => {
      return item.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setMessages(currentMessages);
  };

  const sendMessageToRecipient = (e) => {
    const text = (
      document.getElementById("writeMessage") as HTMLTextAreaElement
    ).value;
    if (text !== "") {
      if (selectUserToChatTimeline === "") {
        /*
         ** No Previous Chat Is Selected On Sidebar
         ** Compose Chat & Manually Type in recipient Name
         */
        let sendTo = (document.getElementById("sendTo") as HTMLInputElement)
          .value;

        if (sendTo !== "") {
          let sendToRecipients = sendTo.split(",");
          let chatValue = {
            message: text,
            sender: "self",
            read: true,
            dateTime: new Date().toLocaleString(),
          };

          let previousChatWithUser = [];
          let noPreviousChatWithUser = [];
          let trimmedSendToRecipients = sendToRecipients.map((recipient) => {
            return recipient.trim();
          });
          let allUsers = [];

          // Check if recipient had previous chat
          initMessages.forEach((user) => {
            let trimmedUser = user.name.trim();
            allUsers.push(trimmedUser);
            if (trimmedSendToRecipients.includes(trimmedUser)) {
              // User Had Previous Chat
              previousChatWithUser.push(user);
            }
          });

          // New User Chat
          trimmedSendToRecipients.forEach((user) => {
            if (!allUsers.includes(user)) {
              noPreviousChatWithUser.push(user);
            }
          });

          // .... Recurring Chat ....
          let tempInitMessages = [];
          let tempInitName = [];
          previousChatWithUser.forEach((user) => {
            // Update Previous Chat Array/Timeline of Recipient with new Chat
            user.message.push(chatValue);

            // Update initMessages with the updated current Recipient
            tempInitMessages.push(user);
            tempInitName.push(user.name);
          });
          // Last name in the list should come first
          tempInitMessages.reverse();
          initMessages.forEach((init) => {
            if (!tempInitName.includes(init.name)) {
              tempInitMessages.push(init);
            }
          });

          // Set State
          setInitMessages(tempInitMessages);
          setMessages(tempInitMessages);

          // ....... For New Users Chat .......
          let tempNewUserInitMessages = [];
          noPreviousChatWithUser.forEach((user, index) => {
            // Create a new Message for user
            let newUser = {
              name: user,
              id: `${new Date()}${index}`,
              faceImage: "https://source.unsplash.com/random",
              message: [
                {
                  message: text,
                  sender: "self",
                  read: true,
                  dateTime: new Date().toLocaleString(),
                },
              ],
              unreadMessage: "",
              online: true,
            };
            // Update Temp Message with the updated current Recipient Message
            tempNewUserInitMessages.push(newUser);
          });
          // Last name in the list should come first
          tempNewUserInitMessages.reverse();
          tempNewUserInitMessages = [
            ...tempNewUserInitMessages,
            ...tempInitMessages,
          ];

          // Set State
          setInitMessages(tempNewUserInitMessages);
          setMessages(tempNewUserInitMessages);

          // Clear Input Values
          (
            document.getElementById("writeMessage") as HTMLTextAreaElement
          ).value = "";
          (
            document.getElementById("searchMessages") as HTMLInputElement
          ).value = "";
          (document.getElementById("sendTo") as HTMLInputElement).value = "";
        }
      } else {
        /*
         ** Has Previous Chat With User
         ** Compose Chat for Recurring recipient chosen at sidebar
         */
        const chatValue = {
          message: text,
          sender: "self",
          read: true,
          dateTime: new Date().toLocaleString(),
        };
        let currentRecipient = selectUserToChatTimeline;
        // Update Current Recipient with new Chat
        currentRecipient.message.push(chatValue);
        // Update initMessages with the updated current Recipient
        let tempInitMessages = [];
        // Add new chat to top
        tempInitMessages.push(currentRecipient);
        // Other chat to follow
        initMessages.forEach((user) => {
          if (user.name !== currentRecipient.name) {
            tempInitMessages.push(user);
          }
        });
        // Set State
        setInitMessages(tempInitMessages);
        setMessages(tempInitMessages);
        // Clear Input Values
        (document.getElementById("writeMessage") as HTMLTextAreaElement).value =
          "";
        (document.getElementById("searchMessages") as HTMLInputElement).value =
          "";
      }
    }
  };

  return (
    <section>
      <Container>
        <div className="row shadow">
          {/* SideBar */}
          <div id="mainSidebar" className="d-md-block col-12 col-md-4 shadow">
            <div className="row my-4 mx-1">
              <div className="col-8">
                <h4>Messages</h4>
              </div>
              <div
                className="col-2 mt-2"
                style={{
                  cursor: "pointer",
                }}
              >
                <i className="bi bi-pencil-square me-2" onClick={startChat}></i>{" "}
              </div>
              <div
                className="col-2 btn"
                onClick={() => setOpen(!open)}
                aria-controls="toggleMessagingBody"
                aria-expanded={open}
              >
                {!open && (
                  <i
                    id="chevron-double-up"
                    className="d-none d-md-inline bi bi-chevron-double-up ms-auto"
                  ></i>
                )}
                {open && (
                  <i
                    id="chevron-double-down"
                    className="d-none d-md-inline bi bi-chevron-double-down ms-auto"
                  ></i>
                )}
              </div>
              <Fade in={open}>
                <div
                  id="toggleMessagingBody"
                  style={{
                    height: "26.3rem",
                    overflowY: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  <input
                    id="searchMessages"
                    type="search"
                    className="form-control my-2 mb-3"
                    placeholder="&#128269; Search"
                    aria-label="Search Message"
                    onChange={searchMessages}
                  />
                  <Card
                    className="border-0 navbar-nav"
                    style={{ margin: "-.5rem" }}
                  >
                    {messages.map((message) => {
                      return (
                        <Card.Body
                          key={message.id}
                          className="nav-item nav-link"
                          style={{
                            margin: "-.8rem 0",
                            cursor: "pointer",
                          }}
                          data-nameid={message.id}
                          onClick={startChattingWith}
                        >
                          <div
                            className="row"
                            data-nameid={message.id}
                            onClick={startChattingWithChild}
                          >
                            <div
                              className="col-12 col-lg-3"
                              data-nameid={message.id}
                              onClick={startChattingWithChild}
                            >
                              <Image
                                src={message.faceImage}
                                alt="image"
                                className="img-fluid"
                                roundedCircle={true}
                                data-nameid={message.id}
                                onClick={startChattingWithChild}
                              ></Image>
                            </div>
                            <div
                              className="col-11 col-lg-9 ms-auto p-0"
                              data-nameid={message.id}
                              onClick={startChattingWithChild}
                            >
                              <div
                                className="col-11 d-flex"
                                data-nameid={message.id}
                                onClick={startChattingWithChild}
                              >
                                <div
                                  className="col-8 fs-5"
                                  data-nameid={message.id}
                                  onClick={startChattingWithChild}
                                >
                                  {message.name}
                                </div>
                                <div
                                  className="col-4 text-muted text-center"
                                  data-nameid={message.id}
                                  onClick={startChattingWithChild}
                                >
                                  {message.message[
                                    message.message.length - 1
                                  ].dateTime.substring(11)}
                                </div>
                              </div>
                              <div
                                className="col-11 d-flex"
                                data-nameid={message.id}
                                onClick={startChattingWithChild}
                              >
                                <p
                                  className="col-10"
                                  data-nameid={message.id}
                                  onClick={startChattingWithChild}
                                >
                                  {message.message[
                                    message.message.length - 1
                                  ].message.substring(0, 26)}
                                  {message.message[message.message.length - 1]
                                    .message.length > 26 && <span>...</span>}
                                </p>
                                <h6
                                  className="col-2 text-center"
                                  data-nameid={message.id}
                                  onClick={startChattingWithChild}
                                >
                                  <span
                                    className="badge bg-primary rounded-pill fw-normal"
                                    data-nameid={message.id}
                                    onClick={startChattingWithChild}
                                  >
                                    {message.unreadMessage}
                                  </span>
                                </h6>
                              </div>
                            </div>

                            <hr
                              className="mx-auto"
                              style={{ width: "75%", marginTop: "-.9rem" }}
                              data-nameid={message.id}
                              onClick={startChattingWithChild}
                            />
                          </div>
                        </Card.Body>
                      );
                    })}
                  </Card>
                </div>
              </Fade>
            </div>
          </div>

          {/* Main Display */}
          <div
            id="mainDisplay"
            className="d-none d-md-block col-12 col-md-8 shadow"
            style={{
              height: "31.6em",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <Card
              className="border-0 d-flex flex-column"
              style={{ height: "500px" }}
            >
              <Card.Header className="sticky-top bg-light">
                <div className="row">
                  <h3 className="col-12 mt-2">
                    {selectUserToChatTimeline !== "" && (
                      <i
                        className="bi bi-arrow-left me-2 d-inline d-md-none"
                        onClick={backToSideMessages}
                        style={{
                          cursor: "pointer",
                        }}
                      ></i>
                    )}
                    {selectUserToChatTimeline.name}
                  </h3>
                </div>
                {selectUserToChatTimeline === "" ? (
                  <div className="row">
                    <div className="col-12">
                      <h3>
                        {" "}
                        <i
                          className="bi bi-arrow-left me-2 d-inline d-md-none"
                          onClick={backToSideMessages}
                          style={{
                            cursor: "pointer",
                          }}
                        ></i>
                        New message
                      </h3>
                    </div>
                    <div className="col-12 ">
                      <input
                        id="sendTo"
                        type="text"
                        className="form-control"
                        placeholder="Type a name or multiple names seperated by comma"
                      />
                    </div>
                  </div>
                ) : selectUserToChatTimeline.online === false ? (
                  <div className="row">
                    <h1
                      className="col-sm-1"
                      style={{
                        fontSize: "3rem",
                        margin: "-.9rem -.5rem",
                        color: "white",
                        WebkitTextStroke: "",
                        WebkitTextStrokeColor: "black",
                        WebkitTextStrokeWidth: "1px",
                      }}
                    >
                      <i className="bi bi-dot"></i>
                    </h1>
                    <div className="col-sm-2">
                      <span className="h6 text-muted">offline</span>
                    </div>
                  </div>
                ) : selectUserToChatTimeline.online === true ? (
                  <div className="row">
                    <h1
                      className="col-1"
                      style={{
                        fontSize: "3rem",
                        margin: "-.9rem -.5rem",
                        color: "#4c959f",
                      }}
                    >
                      <i className="bi bi-dot"></i>
                    </h1>
                    <div className="col-2">
                      <span className="h6 text-muted">online</span>
                    </div>
                  </div>
                ) : null}
              </Card.Header>
              <Card.Body>
                {selectUserToChatTimeline !== "" && (
                  <>
                    {selectUserToChatTimeline.message.map((message, index) => {
                      return ChatBubble(message, index);
                    })}
                  </>
                )}
              </Card.Body>
              <Card.Footer
                className="row mt-auto border-0"
                style={{ backgroundColor: "transparent" }}
              >
                <h2
                  className="col-lg-1 text-muted"
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-link-45deg"></i>
                </h2>
                <div className="col-lg-9 mb-3">
                  <textarea
                    id="writeMessage"
                    className="form-control"
                    placeholder=" &#128522; Write something..."
                  ></textarea>
                </div>
                <div className="col-lg-2 d-grid">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ borderRadius: "15%" }}
                    onClick={sendMessageToRecipient}
                  >
                    Send
                  </button>
                </div>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Chat;