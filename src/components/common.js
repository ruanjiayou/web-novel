import styled from 'styled-components';

/* 1.水平垂直居中 */
export const AlignCenterXY = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* 2.两端分散对齐 */
export const AlignSide = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
export const AlignAround = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
`;
export const AlignRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
`;

/* 3.上下高度占满 */
export const FullHeight = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const FullHeightFix = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FullHeightAuto = styled.div`
  flex: 1;
  overflow-y: auto;
`;

/* 4.多栏之固定+自适应 */
export const FullWidth = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
`;

export const FullWidthFix = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FullWidthAuto = styled.div`
  flex: 1;
`;
