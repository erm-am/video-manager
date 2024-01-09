import React from 'react';
import styled from '@emotion/styled';

export const DefaultLayout = ({ children }) => {
  return (
    <Page>
      <Header>Header</Header>
      <Container>
        <Sidebar>Sidebar</Sidebar>
        <Content>{children}</Content>
      </Container>
    </Page>
  );
};

const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  height: 60px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  z-index: 10;
`;

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-basis: 200px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 10px;
  border: 1px solid red;
  flex: 1;
`;
