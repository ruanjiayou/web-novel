import React from 'react';
import { Observer } from 'mobx-react-lite';
import MIconView from 'components/MIconView';
import globalStore from 'global-state';

export default ({ self, children }) => {
    return <Observer>
        {() => {
            return <div className="dd-common-centerXY">
                Hello World!
                <div onClick={() => {
                    globalStore.app.setLocked(true);
                }}>
                    <MIconView type="FaLock" />
                </div>
                {children}
            </div>;
        }}
    </Observer>;

};