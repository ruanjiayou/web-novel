import styled from 'styled-components';

export const Tab = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
export const MenuWrap = styled.div`
  display: flex;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  position: relative;
`;

export const MenuItem = styled.div`
  margin: 10px;
  font-size: 18px;
  color: ${(props) => (props.selected ? '#108ee9' : '#666')};
`;

export const Slider = styled.div`
  height: 3px;
  width: 10px;
  background-color: #108ee9;
  position: absolute;
  left: 0;
  bottom: 0;
  width: ${(prop) => prop.width + 'px'};
  transform: translateX(${(prop) => prop.left + 'px'});
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  overflow: hidden;
`;
export const ContentWrap = styled.div`
  width: 100%;
  position: relative;
  flex-wrap: nowrap;
  display: flex;
  transition: all 80ms ease;
`;

export const TabItem = styled.div`
  flex-basis: 100%;
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
`;
