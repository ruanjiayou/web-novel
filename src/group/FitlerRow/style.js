import styled from 'styled-components'

export const Container = styled.div`
margin: 5px 10px;
white-space: nowrap;
overflow-x: auto;
overflow-y: hidden;
&::-webkit-scrollbar {
  display: none;
}
scrollbar-width: none;
`;