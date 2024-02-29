import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const Table = styled.table`
  display: table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0px;
  margin: 0px;
  padding: 0px;
  min-width: 650px;
`;

export const TableHeader = styled.thead``;
export const TableHeaderRow = styled.tr``;
export const TableHeaderCell = styled.th<{ sticky?: boolean; size?: number }>`
  border: 1px solid gray;
  background-color: white;
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
`;

export const TableBody = styled.tbody``;
export const TableBodyRow = styled.tr``;
export const TableBodyCell = styled.td<{ sticky?: boolean }>`
  border: 1px solid gray;
  background-color: white;
  height: 30px;
  ${(props) =>
    props.sticky &&
    css`
      z-index: 2;
      position: sticky;
      right: 0px;
      color: red;
    `}
`;
