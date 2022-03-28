import styled from 'styled-components'

export const Wrapper = styled.div`
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
background-color: white;
z-index: 9999;
background: url('/novel/logo.jpg') white center center no-repeat;
background-size: cover;
`

export const CloseBtn = styled.div`
position: absolute;
top: 20px;
right: 20px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 50%;
width: 30px;
height: 30px;
background-color: red;
`