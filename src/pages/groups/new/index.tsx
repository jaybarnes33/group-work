import React, { useEffect, useState } from "react";
import Head from "next/head";
import { BsArrowLeft } from "react-icons/bs";
import styles from "@/styles/new-group.module.css";
import { Card, Badge } from "react-bootstrap";
import FormField from "@/components/Templates/new-group/form";
import Settings from "@/components/Templates/new-group/settings";
import AddConnections from "@/components/Templates/new-group/connections";
import AuthContent from "@/components/Auth/AuthContent";
import Link from "next/link";
import { useRouter } from "next/router";

const CreateNewGroup = () => {
  const router = useRouter();
  const [tabs, setTabs] = useState([
    {
      label: "Details",
      component: <FormField />,
      active: true,
    },
    {
      label: "Settings",
      component: <Settings />,
      active: false,
    },
    {
      label: "Add members",
      component: <AddConnections />,
      active: false,
    },
  ]);

  useEffect(() => {
    document.body.style.backgroundColor = "#f6f6f6";

    return () => {
      document.body.style.backgroundColor = "initial";
    };
  }, []);

  const handleSelectTabs = (tab, i) => {
    const allTabs = [...tabs];
    allTabs.map((item) => (item.active = false));
    allTabs[i].active = true;
    setTabs(allTabs);
  };

  const goBack = () => {
    if (sessionStorage.getItem("newGroup_coming4rm")) {
      let backTo = JSON.parse(sessionStorage.getItem("newGroup_coming4rm"));
      sessionStorage.removeItem("newGroup_coming4rm");
      router.push(backTo);
    } else {
      router.push("/");
    }
  };

  return (
    <AuthContent>
      <Head>
        <title>New group</title>
      </Head>
      <div className={styles.createGroupFlex}>
        <div className={styles.createGroupLayout}>
          <div className={styles.ArrowBox}>
            <div className="btn" onClick={goBack}>
              <BsArrowLeft size={30} />
            </div>
          </div>
          <div className={styles.createGroupContent}>
            <div className={`${styles.createGroupHeader} text-center`}>
              Create New Group
            </div>

            <div className={`${styles.steppersBox} `}>
              {tabs.map((item, i) => (
                <div className={styles.stepperBoxItem} key={i}>
                  <Badge
                    onClick={() => handleSelectTabs(item, i)}
                    className={`${styles.stepperBadge} ${
                      item.active
                        ? styles.stepperBadgeActive
                        : styles.stepperBadgePassive
                    }`}
                  >
                    {i + 1}
                  </Badge>
                  <span className={styles.stepperLabel}>{item.label}</span>
                  {i == tabs.length - 1 ? (
                    ""
                  ) : (
                    <button className={styles.stepperLine}></button>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.createGroupElement}>
              {/* {tabs.map((item) => (item.active ? item.component : ""))} */}
              {tabs.map((item, index) => (
                <div key={index}>{item.active ? item.component : ""}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthContent>
  );
};

export default CreateNewGroup;
