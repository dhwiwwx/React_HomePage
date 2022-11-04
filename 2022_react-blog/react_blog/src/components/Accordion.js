import React, { useState } from "react";
import styled from "styled-components";
import { VscChevronRight } from "react-icons/vsc";

function Accordion({ title, children }) {
  const [expended, setExpended] = useState(false);
  return (
    <>
      <AccordionWrap
        onClick={() => {
          setExpended(!expended);
        }}
      >
        <VscChevronRight />
        <span>{title}</span>
      </AccordionWrap>
      {expended && <AccordionContentWrap>{children}</AccordionContentWrap>}
    </>
  );
}

export default Accordion;

const AccordionWrap = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  padding-left: 5px;

  > span {
    padding-left: 5px;
  }
`;
const AccordionContentWrap = styled.div``;
