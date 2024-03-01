import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const Table = styled.table`
  display: table;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0px;
  margin: 0px;
  padding: 0px;
  background-color: white;
`;

export const TableHeader = styled.thead``;
export const TableHeaderRow = styled.tr``;
export const TableHeaderCell = styled.th<{ sticky?: boolean; size?: number }>`
  ${(props) =>
    props.sticky &&
    css`
      position: sticky;
      right: 0px;
      color: red;
      z-index: 2;
    `}

  ${(props) =>
    props.size &&
    css`
      width: ${props.size}px;
    `};

  white-space: nowrap;
  font-weight: normal;
  text-align: left;
  padding: 0 20px 0 30px;
  background-color: #fff;
  color: #6e7478;
  font-size: 18px;
  height: 60px;
  box-shadow: inset 0px -1px 0 0px rgba(0, 0, 0, 0.05);
  border: 1px solid #208cff;
`;

export const TableBody = styled.tbody``;
export const TableBodyRow = styled.tr`
  border: 1px solid #208cff;
`;
export const TableBodyCell = styled.td<{ sticky?: boolean }>`
  height: 30px;
  font-size: 16px;
  ${(props) =>
    props.sticky &&
    css`
      z-index: 2;
      position: sticky;
      right: 0px;
      color: red;
    `}
`;
