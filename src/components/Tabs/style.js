import styled from 'styled-components';

export const Tab = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
export const MenuWrap = styled.div`
  display: flex;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`

export const MenuItem = styled.div`
  background-color: ${props => props.selected ? 'blue' : 'wheat'};
`
export const Content = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`
export const ContentWrap = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  flex-wrap: nowrap;
  display: flex;
  transition: all 300ms;
`

export const TabItem = styled.div`
  flex-basis: 100%;
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
`

