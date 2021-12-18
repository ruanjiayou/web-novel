import styled from 'styled-components'

export const ITag = styled.span`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 20px;
  margin: 5px 5px 0;
  display: inline-block;
  font-size: 14px;
`

export const Container = styled.div`
  display: flex;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`