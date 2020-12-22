// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // 生命值
    @property
    HP = 0;

    // 攻击力
    @property
    ATK = 0;

    start () {
        // Your initialization goes here.
    }
    reset(hp) {
        this.HP = hp;
    }
    update (deltaTime: number) {
        // Your update function goes here.
    }
}
