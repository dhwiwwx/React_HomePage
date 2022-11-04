import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlineDocument } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import Acordion from "./Accordion";
const listArr = [
  {
    icon: <HiOutlineDocument size={24} />,
    path: "EXPLORER",
  },
  {
    icon: <AiOutlineSearch size={24} />,
    path: "test",
  },
];

function Main() {
  const [selected, setSelected] = useState(0);
  return (
    <Wrap>
      <LeftBar>
        {listArr.map((one, index) => (
          <IconWrap
            selected={selected === index}
            onClick={() => {
              setSelected(selected === index ? null : index);
            }}
          >
            {one.icon}
          </IconWrap>
        ))}
      </LeftBar>
      {selected !== null && listArr[selected] && (
        <LeftContent>
          <p>{listArr[selected]?.path}</p>
          <Acordion title="OPEN POSTS">네용</Acordion>
        </LeftContent>
      )}
    </Wrap>
  );
}

export default Main;

const Wrap = styled.div`
  height: 100vh;
  background-color: aqua;
  display: flex;
`;
const LeftBar = styled.div`
  width: 50px;
  height: 100%;
  background-color: #333333;
`;

const LeftContent = styled.div`
  width: 320px;
  height: 100%;
  background-color: #252526;
  > p {
    padding: 10px 0 0 5px;
    color: #7a7a7a;
  }
`;

const IconWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
  cursor: pointer;

  border-left: ${({ selected }) => (selected ? 2 : 0)}px solid white;

  > svg {
    color: ${({ selected }) => (selected ? "white" : "#7a7a7a")};
  }
`;
