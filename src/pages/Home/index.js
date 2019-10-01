import React from 'react';
import { Observer } from 'mobx-react-lite';
import MIcon from '../../components/MIcon';
import globalStore from '../../global-state';

export default ({ self, children }) => {
    return <Observer>
        {() => {
            return <div className="dd-common-centerXY">
                Hello World!
                <div onClick={() => {
                    globalStore.app.setLocked(true);
                }}>
                    <MIcon type="FaLock" />
                </div>
                {children}
            </div>;
        }}
    </Observer>;

};