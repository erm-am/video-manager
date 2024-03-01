import React from 'react';
import styled from '@emotion/styled';

export const DefaultLayout = ({ children }) => {
  return (
    <Page>
      <Sidebar>...</Sidebar>
      <Container>
        <Header>...</Header>
        <Content>{children}</Content>
      </Container>
    </Page>
  );
};

export const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  height: 100vh;
  outline: 1px solid pink;
`;

export const Sidebar = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  align-self: flex-start;
  padding: 20px;
  flex-basis: 80px;
  overflow-y: auto;
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 80px;
  height: 80px;
  width: 100%;
  padding: 20px;
  border: 1px solid black;
`;

export const Container = styled.div`
  height: 100%;
  width: 100%;
  min-width: 0px;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  padding: 20px;
`;
