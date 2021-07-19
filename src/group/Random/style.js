import styled from 'styled-components'

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