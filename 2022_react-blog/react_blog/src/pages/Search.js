import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Accordion from "../components/Accordion";
import AppContext from "../context/AppContext";

function Search() {
  const { postData, setSelectedTag } = useContext(AppContext);
  const [tagData, setTagData] = useState([
    {
      tagTitle: "Tech",
      count: 3,
      postArr: [],
    },
    {
      tagTitle: "일상",
      count: 3,
      postArr: [],
    },
  ]);

  useEffect(() => {
    const tempArr = [];

    searchTagFnc(postData);

    function searchTagFnc(nowPostDataArr) {
      nowPostDataArr.map((nowPostData) => {
        if (nowPostData.type === "post") {
          nowPostData.data.tag?.map((tag) => {
            const tempTarget = tempArr.find((temp) => tag === temp.tagTitle);

            if (tempTarget) {
              tempTarget.count += 1;
              tempTarget.postArr.push(nowPostData.path);

              tempTarget.postArr = [...new Set(tempTarget.postArr)];
            } else {
              tempArr.push({
                tagTitle: tag,
                count: 1,
                postArr: [nowPostData.path],
              });
            }
          });
        } else {
          nowPostData.children && searchTagFnc(nowPostData.children);
        }
      });
    }

    setTagData(tempArr);
  }, [postData]);
  return (
    <Accordion title="Tag" initialExpended={true} isBold={true}>
      <TagWrap>
        {tagData.map((one, index) => (
          <Tag
            key={index}
            onClick={() => {
              setSelectedTag({
                tagTitle: one.tagTitle,
                path: [one.postArr],
              });
            }}
          >
            {one.tagTitle} <span>{one.count}</span>
          </Tag>
        ))}
      </TagWrap>
    </Accordion>
  );
}
export default Search;

const TagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  margin: 5px;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.color.third};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.color.hover};
  }
  > span {
    color: red;
  }
`;
