//@ts-nocheck
import React, { useCallback, useMemo, useState } from "react";
import { BaseEditor, createEditor, Descendant } from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import Toolbar from "./Toolbar/Toolbar";
import { getMarked, getBlock } from "./utils/SlateUtilityFunctions.js";
import withLinks from "./plugins/withLinks.js";
import withEmbeds from "./plugins/withEmbeds.js";

import styles from "../../../styles/SlateEditor/Editor_Slate.module.scss";

import { CtrlShiftCombo } from "./utils/CtrlShiftCombo";
import FooterButtons from "./footerButtons/FooterButtons";
import { useRouter } from "next/router";
import deserializeFromHtml from "./utils/serializer";

import { selectSlatePostToEdit } from "@/reduxFeatures/app/editSlatePostSlice";
import { useSelector } from "@/redux/store";

// Best Practice Is To Declear & Export Custom Types
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  level: number;
  children: CustomText[];
};

export type CustomElement = ParagraphElement | HeadingElement;

export type FormattedText = { text: string; bold?: true };

// In this example, CustomText is equal to FormattedText but in a real editor, there can be more types of text like text in a code block which may not allow formatting for example
export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const Element = (props) => {
  return getBlock(props);
};
const Leaf = ({ attributes, children, leaf }) => {
  children = getMarked(leaf, children);
  return <span {...attributes}>{children}</span>;
};

const Editor = ({ slim, pageAt }: { slim: boolean; pageAt: string }) => {
  const editSlatePost = useSelector(selectSlatePostToEdit);
  // console.log("editSlatePost:", editSlatePost);
  const router = useRouter();
  const editorID = `${router.asPath}-slateRefId`;

  const renderElement = useCallback((props) => <Element {...props} />, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  // Create Editor Instance
  const editor = useMemo(
    () => withHistory(withEmbeds(withLinks(withReact(createEditor())))),
    []
  );

  // Below ifelse would prevent "cannot find a descendant path [0] error"
  if (editor.children.length === 0) {
    editor.children.push({
      type: "paragraph",
      children: [{ text: "" }],
    });
  }
  // console.log(
  //   "deserializeFromHtml(editSlatePost.post):",
  //   deserializeFromHtml(editSlatePost?.post)
  // );

  const initialState: Descendant[] = editSlatePost?.post
    ? deserializeFromHtml(editSlatePost?.post)
    : editSlatePost?.postBody
    ? deserializeFromHtml(editSlatePost?.postBody)
    : [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ];
  // console.log("initialState:", initialState);
  const [value, setValue] = useState(initialState);

  const handleEditorChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className={slim ? "container-fluid px-0 mx-0" : "container"}>
      <div className={`row justify-content-center ${slim && "px-0 mx-0"}`}>
        <div
          className={`${slim ? "col-10 col-md-11 px-0 me-0" : "col-12"} ${
            styles.main
          }`}
          style={{ border: "1px solid rgba(0, 0, 0, 0.125)" }}
        >
          <Slate editor={editor} value={value} onChange={handleEditorChange}>
            <div className="row">
              {slim && (
                <div
                  className={`${slim ? "col-1 col-md-2 col-lg-1" : "d-none"}`}
                  style={{ alignSelf: "flex-end", marginBottom: "1rem" }}
                >
                  <Toolbar position="slim" />
                </div>
              )}
              <div
                className={`${
                  slim ? "col-10 pe-1 pe-sm-0 pe-md-2 pe-lg-0" : "col-12"
                }`}
              >
                {!slim && <Toolbar position="top" />}
                <div
                  className={`${styles.editorWrapper} ${
                    slim && "pe-0 pe-md-2 pe-lg-0"
                  }`}
                >
                  <Editable
                    id={editorID}
                    className={`${
                      !slim ? styles.editable : styles.editableSlim
                    }`}
                    placeholder={slim ? "" : "Start writing your thoughts"}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    spellCheck
                    autoFocus
                    onKeyDown={(event) => CtrlShiftCombo(event, editor)}
                  />
                </div>
                {!slim && (
                  <div className="row mb-2 mx-1">
                    <div
                      className="col-12 col-lg-3"
                      style={{ marginTop: "-.4rem" }}
                    >
                      <Toolbar position="bottom" />
                    </div>
                    <FooterButtons
                      editorID={editorID}
                      pageAt={pageAt}
                      editorContentValue={value}
                    />
                  </div>
                )}
              </div>
            </div>
          </Slate>
        </div>
        {slim && (
          <div
            className="col-2 col-md-1 d-grid"
            style={{
              alignSelf: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <FooterButtons
              editorID={editorID}
              pageAt={pageAt}
              editorContentValue={value}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
