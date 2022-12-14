/* eslint-disable react-hooks/exhaustive-deps */
//@ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { Card } from "react-bootstrap";
import ChatBubble from "./ChatBubble";
import styles from "../../styles/chat.module.scss";
import "react-toastify/dist/ReactToastify.css";
import { BsDot, BsArrowLeft } from "react-icons/bs";
import Editor from "@/components/Organisms/SlateEditor/Editor";
import { useDispatch, useSelector } from "@/redux/store";
import {
  selectedUserInChatTimeline,
} from "@/reduxFeatures/app/chatSlice";
import {Button} from 'react-bootstrap'
import {FiSend} from 'react-icons/fi'

const MainDisplay = ({   currentChat, messages }) => {

  const selectUserToChatTimeline = useSelector(selectedUserInChatTimeline);
  const scrollRef = useRef();

  useEffect(()=>{
    
    scrollRef.current?.scrollIntoView()
  },[messages])
 
  return (
   
     
      <>
        <Card className={styles.cardBody} style={{  marginRight:'0px', overflow:'scroll', overflowX:'hidden' }}>
          
          <Card.Body className={styles.messageArea}>
            {currentChat && 
              <>
                {messages.map((message, index) => 
                    <div >
                      <ChatBubble message={message} />
                    </div>
                )}
              <div ref={scrollRef}></div>
              </>
            }
          </Card.Body>
          {/* <Card.Footer
            className="row border-0 pb-5 pb-md-2"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="col-10 col-lg-11 d-flex">
              <Editor slim={true} pageAt="/chat" /> 
              <Button onClick={()=>sendMessage()} style={{minWidth:'70px'}}> <FiSend size={22} /> </Button>
            </div>
          </Card.Footer> */}
        </Card>
      </>
   
  );
};

export default MainDisplay;
