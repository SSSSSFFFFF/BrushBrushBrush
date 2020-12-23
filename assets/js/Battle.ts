// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label, Button, find, Canvas, UIOpacity, UITransform, Color } from 'cc';
const { ccclass, property, integer, float, boolean, string, type } = _decorator;
import { Player } from "./Player";
import { Enemy } from "./Enemy";

@ccclass('Battle')
export class Battle extends Component {
    callback: () => void;
    startBtn: Node;
    playerHp = 20;
    enemyHp = 10;
    battleShow: boolean = true;

    start() {
        this.Battle()
    }
    Battle() {
        this.startBtn = find("Canvas/Battle/Button")
        this.startBtn.on(Button.EventType.CLICK, this.btnClick, this)
    }
    btnClick(button: Button) {
        // 注意这种方式注册的事件，无法传递 customEventData
        let player = find("Canvas/Player").getComponent(Player)
        let enemy = find("Canvas/Battle/Enemy").getComponent(Enemy)
        this.startBtn.getComponent(Button).interactable = false;
        this.checkNums()
    }
    checkNums() {
        let player = find("Canvas/Player").getComponent(Player)
        let enemy = find("Canvas/Battle/Enemy").getComponent(Enemy)
        this.schedule(this.callback = function () {
            let damgeReult = player.ATK
            if (Math.random() < player.Crit) {
                //暴击成功
                damgeReult = player.ATK*player.CritD
            }

            let node = new Node('Label');
            node.parent = find("Canvas/Battle/ScrollView/view/content")
            console.log(node);
            node.addComponent(Label).fontSize = 16
            node.getComponent(Label).color = new Color("#000000")
            node.getComponent(Label).string += '\n你造成了' + damgeReult + '点伤害，受到了' + enemy.ATK + '点伤害'
            // 怪物血量
            enemy.HP -= damgeReult

            // 玩家血量
            player.HP -= enemy.ATK
            //player失败
            if (player.HP <= 0) {
                player.HP = 0;
                // result.string += '\n战斗失败'
            }
            //enemy失败
            if (enemy.HP <= 0) {
                player.EXP++;
                this.enemyHp += 4
                this.playerHp++
                enemy.HP = 0;
                // result.string += '\n战斗成功'
            }
            //结束
            if (player.HP <= 0 || enemy.HP <= 0) {
                player.reset(this.playerHp);
                enemy.reset(this.enemyHp);
                this.startBtn.getComponent(Button).interactable = true;
                this.unschedule(this.callback);
            }
        }, 1);
    }
    update(deltaTime: number) {
        //fight
        let PlayerCom = find("Canvas/Player").getComponent(Player)
        let EnemyCom = find("Canvas/Battle/Enemy").getComponent(Enemy)
        find("Canvas/Battle/Player/Info").getComponent(Label).string = "Player\nHP：" + PlayerCom.HP.toString()
        find("Canvas/Battle/Enemy/Info").getComponent(Label).string = "Enemy\nHP：" + EnemyCom.HP.toString() + "\nATK: " + EnemyCom.ATK.toString()


        console.log(find("Canvas/Battle/ScrollView/view/content").getComponent(UITransform).height);
        // find("Canvas/Battle/ScrollView/view/content").getComponent(UITransform).height = find("Canvas/Battle/ScrollView/view/content").getComponent(UITransform).height
    }
}
