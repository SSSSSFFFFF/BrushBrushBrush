// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Status')
export class Status extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
    }

    //扣血动画结束清除扣血节点
    statusDone() {
        this.node.destroy();
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
