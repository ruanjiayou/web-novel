import styled from 'styled-components'

export const EpTag = styled.span`
  color: ${({ selected }) => selected ? 'rgb(0 165 253)' : '#888'};
  margin: 2px 3px;
  padding: 2px;
  position: relative;
  display: inline-block;
  font-size: 12px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    height: 200%;
    border: 1px solid  ${({ selected }) => selected ? 'rgb(0 165 253)' : '#888'};
    border-radius: 6px;
    transform-origin: 0 0;
    transform: scale(0.5);
    box-sizing: border-box;
    pointer-events: none;
  }
`