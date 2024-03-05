import styled from 'styled-components';

export const Wrap = styled.div`
  width: 100%;
  position: relative;
  padding-top: 100%;
  margin-bottom: 35%;
`;

export const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const Cell = styled.div`
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #81e2ac;
  color: white;
  border-radius: 50%;
  width: 28%;
  height: 28%;
  margin-bottom: 8%;
  font-size: 20px;
  -webkit-tap-highlight-color: #abefc9;
`;
