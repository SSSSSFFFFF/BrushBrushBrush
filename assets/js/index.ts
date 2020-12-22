// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label, Button, find } from 'cc';
const { ccclass, property, integer, float, boolean, string, type } = _decorator;
import { Player } from "./Player";
import { Enemy } from "./Enemy";

@ccclass('Index')
export class Index extends Component {
    callback: () => void;
    buttonN: Node;
    // 声明 Player 属性
    // @property({ type: Player })
    // private Player = null;

    playerHp = 20;
    enemyHp = 10;
    // // 声明 Enemy 属性
    // @property({ type: Enemy })
    // private Enemy = null;

    start () {
        this.buttonN = find("Canvas/Button")
        this.buttonN.on(Button.EventType.CLICK, this.btnClick, this);
    }
    btnClick(button: Button) {
        let player = find("Canvas/Player").getComponent(Player)
        let enemy = find("Canvas/Enemy").getComponent(Enemy)
        this.buttonN.getComponent(Button).interactable = false;
        this.checkNums()
        console.log(1);
        // 注意这种方式注册的事件，无法传递 customEventData
    }
    checkNums() {
        find("Canvas/Result").getComponent(Label).string = 'Result'
        let player = find("Canvas/Player").getComponent(Player)
        let enemy = find("Canvas/Enemy").getComponent(Enemy)
        this.schedule(this.callback = function () {
            player.HP -= enemy.ATK;
            enemy.HP -= player.ATK;
            //player失败
            if (player.HP <= 0) {
                player.HP = 0;
                find("Canvas/Result").getComponent(Label).string = 'LOSE'
            }
            //enemy失败
            if (enemy.HP <= 0) {
                player.EXP++;
                this.enemyHp += 4
                this.playerHp++
                enemy.HP = 0;
                find("Canvas/Result").getComponent(Label).string = 'WIN'
            }
            if (player.HP <= 0 || enemy.HP <= 0) {
                console.log(this.playerHp, this.enemyHp);
                player.reset(this.playerHp);
                enemy.reset(this.enemyHp);
                this.buttonN.getComponent(Button).interactable = true;
                this.unschedule(this.callback);
            }
        }, 1);
    }
    update (deltaTime: number) {
        let PlayerCom = find("Canvas/Player").getComponent(Player)
        let EnemyCom = find("Canvas/Enemy").getComponent(Enemy)
        find("Canvas/Player/Info").getComponent(Label).string = "Player\nHP：" + PlayerCom.HP.toString() + "\nATK: " + PlayerCom.ATK.toString()
        find("Canvas/EXP").getComponent(Label).string = "EXP: " + PlayerCom.EXP.toString()
        find("Canvas/Enemy/Info").getComponent(Label).string = "Enemy\nHP：" + EnemyCom.HP.toString() + "\nATK: " + EnemyCom.ATK.toString()
        // Your update function goes here.
    }
}
