// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    // 生命值
    @property
    HP = 0;
    // 攻击力
    @property
    ATK = 0;
    // 经验值
    @property
    EXP = 0;
    // 暴击率
    @property
    Crit = 0;
    // 暴击伤害倍数
    @property
    CritD = 0;
    MaxHp: number;

    start() {
        this.MaxHp = this.HP
    }

    reset(hp) {
        this.HP = hp;
    }
    update(deltaTime: number) {
        find("Info", this.node).getComponent(Label).string =
            '生命值：' + this.HP + '/'+ this.MaxHp+
            '\n攻击力：' + this.ATK +
            '\n经验值：' + this.EXP +
            '\n暴击率：' + this.Crit * 100 + '%' +
            '\n暴击伤害：' + this.CritD * 100 + '%'
        // console.log(deltaTime);
        // Your update function goes here.
    }
}
