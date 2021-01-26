// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label, find, BlockInputEvents } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('Skill')
export class Skill extends Component {
    cd1: any;
    cd1Time: number;
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
    }


    // aoe
    skill1(_this) {
        let that = this
        find("Canvas/Battle/skill1/Node").getComponent(BlockInputEvents).enabled = true
        this.cd1 = 3;
        this.cd1Time = setInterval(() => {
            find("Canvas/Battle/skill1/Label").getComponent(Label).string = (that.cd1).toFixed();
            that.cd1 = that.cd1 - 1
            if (that.cd1 <= 0) {
                clearInterval(that.cd1Time)
                // 技能1
                find("Canvas/Battle/skill1/Node").getComponent(BlockInputEvents).enabled = false
            }
        }, 1000)
        console.log(_this);
        for (let i = 0; i < _this.enemyNodes.length; i++) {
            let enemyNow = _this.enemyNodes[i].getComponent(Enemy).enemyNow
            enemyNow.MaxHp = Number((enemyNow.MaxHp - 100).toFixed())
            _this.enemyAtackedAnimation(_this.enemyNodes[i])
        }
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
