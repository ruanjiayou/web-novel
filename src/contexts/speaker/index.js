import React, { useContext } from 'react';
import { Slider } from 'antd-mobile';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { MIconView, Dragger, VisualBoxView } from 'components';
import store from '../../store';

// 上下文context.避免react多级一直传props
const Context = React.createContext(null);

function Speaker() {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  let voice = null;
  voices.forEach((v) => {
    if (v.lang === 'zh-CN') {
      voice = v;
    }
  });
  const speakerStore = store.speaker;
  const localStore = useLocalStore(() => ({
    left: speakerStore.left,
    top: speakerStore.top,
    rate: speakerStore.rate,
    pitch: speakerStore.pitch,
  }));
  let timer;
  return (
    <Observer>
      {() => (
        <VisualBoxView visible={store.app.showSpeaker}>
          <div
            style={{
              position: 'fixed',
              zIndex: 10,
              top: localStore.top,
              left: localStore.left,
              minWidth: 300,
            }}
            className="full-width"
          >
            <Dragger
              cb={(sstore) => {
                localStore.left = Math.max(0, sstore.left + sstore.offsetLeft);
                localStore.top = Math.max(0, sstore.top + sstore.offsetTop);
                clearTimeout(timer);
                timer = null;
                timer = setTimeout(() => {
                  speakerStore.store(localStore);
                }, 100);
              }}
            >
              <MIconView type="FaArrowsAlt" />
            </Dragger>
            <div
              onClick={(e) => {
                const utter = new SpeechSynthesisUtterance('测试');
                utter.onend = function () {
                  console.log('speak end');
                };
                utter.onerror = function () {
                  console.log('speak error');
                };
                utter.voice = voice;
                utter.pitch = localStore.pitch;
                utter.rate = localStore.rate;
                if (synth.speaking) {
                  console.log('is speaking');
                  return;
                }
                synth.speak(utter);
              }}
            >
              测试
            </div>
            <div className="full-width-auto">
              <div className="full-width" style={{ marginBottom: 10 }}>
                <span>速度</span>
                <div className="full-width-auto">
                  <Slider
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={localStore.rate}
                    onChange={(value) => {
                      localStore.rate = value;
                      speakerStore.store(localStore);
                    }}
                  />
                </div>
              </div>
              <div className="full-width">
                <span>声调</span>
                <div className="full-width-auto">
                  <Slider
                    min={0}
                    max={2}
                    step={0.1}
                    value={localStore.pitch}
                    onChange={(value) => {
                      localStore.pitch = value;
                      speakerStore.store(localStore);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </VisualBoxView>
      )}
    </Observer>
  );
}

export function createSpeakerProvider() {
  return [Speaker, Context];
}

export function useSpeakerContext() {
  return useContext(Context);
}
