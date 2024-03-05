import React from 'react';
import { Wrapper, CloseBtn } from './style';
import { useLocalStore, Observer } from 'mobx-react-lite';
import { useEffectOnce } from 'react-use';

export default function Splash({
  children,
  booting,
  remainSeconds = 5,
  can = false,
}) {
  const local = useLocalStore(() => ({
    showSplash: true,
    remainSeconds: remainSeconds,
  }));
  useEffectOnce(() => {
    // 倒计时关闭闪屏
    let timer = setInterval(() => {
      --local.remainSeconds;
      if (local.remainSeconds === 0) {
        clearInterval(timer);
        local.showSplash = false;
      }
    }, 1000);
  });
  return (
    <Observer>
      {() => (
        <Wrapper
          style={{
            display: booting || local.showSplash ? 'block' : 'none',
            position: 'fixed',
            left: 0,
            top: 0,
          }}
        >
          <img
            src="/logo.jpg"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%,-50%)',
              borderRadius: '50%',
              width: 50,
            }}
            alt=""
          />
          {/* <CloseBtn onClick={() => { if (local.remainSeconds === 0 || can) { local.showSplash = false } }}>{local.remainSeconds === 0 ? 'X' : local.remainSeconds}</CloseBtn> */}
          {children}
        </Wrapper>
      )}
    </Observer>
  );
}
