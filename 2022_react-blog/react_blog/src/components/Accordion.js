import React, { useState } from "react";
import styled from "styled-components";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";

function Accordion({ title, children, isBold, initialExpended }) {
  const [expended, setExpended] = useState(initialExpended || false);
  return (
    <>
      <AccordionWrap
        onClick={() => {
          setExpended(!expended);
        }}
      >
        {expended ? <VscChevronDown /> : <VscChevronRight />}
        <span>{isBold ? <strong>{title}</strong> : title}</span>
      </AccordionWrap>
      {
        <AccordionContentWrap expended={expended}>
          {children}
        </AccordionContentWrap>
      }
    </>
  );
}

export default Accordion;

const AccordionWrap = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.text};

  font-size: 0.8rem;
  padding: 5px 0;
  cursor: pointer;

  > span {
    padding-left: 5px;
    user-select: none;
  }
`;
const AccordionContentWrap = styled.div`
  max-height: ${({ expended }) => (expended ? "500px" : "0")};
  overflow: hidden;
  transition: ${({ expended }) =>
    expended ? "max-height 0.25s ease-in" : "max-height 0.15s ease-out"};
  user-select: none;
  margin-bottom: 5px;
  margin-left: 15px;
`;
