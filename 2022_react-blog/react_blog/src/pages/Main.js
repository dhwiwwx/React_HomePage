import React, { useState, useContext } from "react";
import styled from "styled-components";
import { HiOutlineDocument } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";

import Accordion from "../components/Accordion";
import Content from "../components/Content";
import AppContext from "../context/AppContext";
import { getPostOne } from "../common/common.function";
import PostWrap from "../components/PostWrap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Search from "./Search";
function Main() {
  const [selected, setSelected] = useState(null);
  const {
    theme,
    setTheme,
    setOpenPost,
    setSelectedPost,
    selectedPost,
    postData,
    openPost,
    selectedTag,
    setSelectedTag,
  } = useContext(AppContext);

  const listArr = [
    {
      icon: <HiOutlineDocument size={24} />,
      path: "EXPLORER",
      content: (
        <>
          <Accordion title="OPEN POSTS" isBold={true} initialExpended={true}>
            {openPost.map((one, index) => {
              const data = getPostOne(postData, one);
              return (
                <PostWrap
                  path={data.path}
                  title={data.title}
                  key={index}
                  isClose={true}
                />
              );
            })}
          </Accordion>
          <Accordion title="VSCODE" isBold={true} initialExpended={true}>
            {postData.map((one, index) => (
              <Content {...one} key={index} />
            ))}
          </Accordion>
        </>
      ),
    },
    {
      icon: <AiOutlineSearch size={24} />,
      path: "SEARCH",
      content: <Search />,
    },
  ];
  const data = getPostOne(postData, selectedPost);
  return (
    <Wrap>
      <LeftBar>
        <div>
          {listArr.map((one, index) => (
            <IconWrap
              selected={selected === index}
              onClick={() => setSelected(selected === index ? null : index)}
              key={index}
            >
              {one.icon}
            </IconWrap>
          ))}
        </div>
        <div>
          <div
            className={theme}
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          ></div>
        </div>
      </LeftBar>

      {selected !== null && listArr[selected] && (
        <LeftContent>
          <p>{listArr[selected].path}</p>
          {listArr[selected].content}
        </LeftContent>
      )}
      <RightWrap selected={selected}>
        {selectedTag ? (
          <RightTagContent>
            <div>
              <h2>
                {selectedTag.tagTitle} 관련 글 몰록{" "}
                <span>({selectedTag.path.length}개)</span>
              </h2>
              <div>
                {selectedTag.path.map((path) => {
                  console.log(path);
                  const tagData = getPostOne(postData, path);

                  return (
                    <div
                      className="post"
                      onClick={() => {
                        setSelectedPost(tagData.path);
                        setSelectedTag(null);

                        if (!openPost.includes(path)) {
                          setOpenPost([...openPost, path]);
                        }
                      }}
                    >
                      <div>
                        <div>
                          <img src={tagData.data.thumbnail}></img>
                        </div>
                        <h3>{tagData.title}</h3>
                      </div>
                      <div>
                        {tagData.data.tag.map((one) => [<span>{one}</span>])}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </RightTagContent>
        ) : (
          <>
            <RightHeader visible={openPost.length !== 0 ? true : false}>
              {openPost.map((one, index) => {
                const data = getPostOne(postData, one);

                return (
                  <div
                    className={selectedPost === one ? "selected" : ""}
                    onClick={() => {
                      setSelectedPost(data.path);
                    }}
                    key={index}
                  >
                    📝 {data.title}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        const openPostFilter = openPost.filter(
                          (one) => one !== data.path
                        );
                        setOpenPost(openPostFilter);

                        setSelectedPost(
                          openPostFilter.length !== 0 ? openPostFilter[0] : null
                        );
                      }}
                    >
                      &#215;
                    </span>
                  </div>
                );
              })}
            </RightHeader>
            <RightContent
              selected={selected}
              visible={openPost.length !== 0 ? true : false}
            >
              {data && (
                <>
                  <p>{data.path}</p>
                  <div>
                    <h1>{data.title}</h1>
                    <p>
                      <strong>Jungwon</strong> | {data.data?.date}
                    </p>
                    <div>
                      {data?.data?.tag?.map((one, index) => (
                        <span key={index}>{one}</span>
                      ))}
                    </div>
                    <div className="markdown">
                      <ReactMarkdown
                        children={data.data?.content}
                        remarkPlugins={{ remarkGfm }}
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <SyntaxHighlighter
                                children={String(children).replace(/\n$/, "")}
                                style={dark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              />
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </RightContent>
          </>
        )}
      </RightWrap>
    </Wrap>
  );
}

export default Main;

const IconWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
  cursor: pointer;

  border-left: ${({ theme, selected }) =>
    `${selected ? 2 : 0}px solid ${theme.color.text}`};

  > svg {
    color: ${({ theme, selected }) =>
      selected ? theme.color.text : "#7a7a7a"};
  }
`;

const Wrap = styled.div`
  display: flex;
  height: 100vh;
`;

const LeftBar = styled.div`
  height: 100%;
  width: 50px;
  min-width: 50px;
  background-color: ${({ theme }) => theme.color.third};
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  > div:last-child {
    padding-bottom: 30px;
    display: flex;
    align-items: center;
    flex-direction: column;

    > div {
      height: 50px;
      width: 30px;
      //border: 1px solid ${({ theme }) => theme.color.text};
      background: ${({ theme }) => theme.color.primary};
      border-radius: 50px;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 25px;
        height: 25px;
        border-radius: 20px;
        background-color: ${({ theme }) => theme.color.text};
        transition: 0.3s;
      }
      &.light::after {
        top: 25px;
      }
    }
  }
`;
const LeftContent = styled.div`
  width: 320px;
  min-width: 320px;
  height: 100%;
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 10px;

  > p {
    padding-bottom: 10px;
    color: #7a7a7a;
  }
  @media (max-width: 540px) {
    width: 100%;
  }
`;

const RightWrap = styled.div`
  width: ${({ selected }) =>
    selected === null ? "calc(100% - 50px)" : "calc(100% - 320px - 50px)"};
  @media (max-width: 540px) {
    display: ${({ selected }) => (selected === null ? "block" : "none")};
  }
`;
const RightHeader = styled.div`
  width: 100%;
  height: 50px;

  overflow-x: scroll;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  background-color: ${({ theme }) => theme.color.secondary};

  ::-webkit-scrollbar-thumb {
    display: none;
  }
  &:hover::-webkit-scrollbar-thumb {
    display: block;
  }

  > div {
    min-width: 150px;
    width: 150px;
    padding: 10px;
    background-color: ${({ theme }) => theme.color.secondary};
    position: relative;
    cursor: pointer;

    &.selected {
      background-color: ${({ theme }) => theme.color.primary};
    }

    &:not(.selected) > span {
      display: none;
    }
    &:hover > span {
      display: block;
    }
    > span {
      position: absolute;
      right: 15px;
      top: 10px;
    }
  }
`;
const RightContent = styled.div`
  background-color: ${({ theme }) => theme.color.primary};
  width: 100%;
  height: ${({ visible }) => (visible ? "calc(100% - 50px)" : "100%")};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;

  padding: 10px 20px;
  > p {
    width: 100%;
    color: #7a7a7a;
  }
  > div {
    width: 100%;
    max-width: 600px;
    > h1 {
      padding: 10px 0 20px 0;
    }
    > p {
      margin-bottom: 20px;
      padding-bottom: 10px;
      color: #7a7a7a;
      border-bottom: 1px solid ${({ theme }) => theme.color.selected};
    }
    > div:nth-child(3) {
      padding: 10px 0 20px 0;
      > span {
        padding: 7px;
        margin-right: 10px;
        border-radius: 13px;
        background-color: ${({ theme }) => theme.color.selected};
      }
    }
  }
`;

const RightTagContent = styled.div`
  background-color: ${({ theme }) => theme.color.primary};
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 10px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-y: scroll;
  > div {
    width: 100%;
    max-width: 600px;
    > h2 {
      border-bottom: 1px solid #505050;
      padding: 10px 0;

      > span {
        font-size: 0.8rem;
        color: ${({ theme }) => theme.color.selected};
      }
    }
    > div {
      > div.post {
        padding: 10px;
        margin-top: 20px;
        border-radius: 10px;
        background: ${({ theme }) => theme.color.secondary};
        cursor: pointer;
        &:hover {
          background-color: ${({ theme }) => theme.color.third};
          transform: scale(1.05);
          transition: 0.5s;
        }
        > div:first-child {
          display: flex;
          > div {
            width: 80px;
            height: 80px;

            border-radius: 10px;

            > img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          > h3 {
            padding-left: 10px;
          }
        }
        > div:last-child {
          padding-top: 10px;
          > span {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 10px;
            margin-right: 10px;
            background: ${({ theme }) => theme.color.selected};
          }
        }
      }
    }
  }
`;
