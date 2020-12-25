// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label, Button, find, Canvas, UIOpacity, UITransform } from 'cc';
const { ccclass, property, integer, float, boolean, string, type } = _decorator;
import { Player } from "./Player";
import { Enemy } from "./Enemy";

@ccclass('Battle')
export class Battle extends Component {
    callback: () => void;
    startBtn: Node;
    enemyHp = 10;
    enemyATK = 1.5;
    battleShow: boolean = true;

    start() {
        this.Battle()
    }
    update(deltaTime: number) {
        //fight
        let PlayerCom = find("Canvas/Player").getComponent(Player).playerData
        let EnemyCom = find("Canvas/Battle/Enemy").getComponent(Enemy)
        find("Canvas/Battle/Player/Info").getComponent(Label).string = "Player\nHP：" + PlayerCom.HP.toString()
        find("Canvas/Battle/Enemy/Info").getComponent(Label).string = "Enemy\nHP：" + EnemyCom.HP.toString() + "\nATK: " + EnemyCom.ATK.toString()

        find("Canvas/Battle/ScrollView/view/content").getComponent(UITransform).height = find("Canvas/Battle/ScrollView/view/content/item").getComponent(UITransform).height
    }
    Battle() {
        this.startBtn = find("Canvas/Battle/Button")
        this.startBtn.on(Button.EventType.CLICK, this.btnClick, this)
    }
    btnClick(button: Button) {
        // 注意这种方式注册的事件，无法传递 customEventData
        let player = find("Canvas/Player").getComponent(Player)
        let enemy = find("Canvas/Battle/Enemy").getComponent(Enemy)
        this.startBtn.getComponent(Button).interactable = false
        this.checkNums()
    }
    checkNums() {
        //战斗结果
        let result = find("Canvas/Battle/ScrollView/view/content/item").getComponent(Label)
        result.string = '\n' + result.string
        let player = find("Canvas/Player").getComponent(Player).playerData
        let enemy = find("Canvas/Battle/Enemy").getComponent(Enemy)
        this.schedule(this.callback = function () {
            let damgeReult = player.ATK
            if (Math.random() < player.Crit) {
                //暴击成功
                damgeReult = player.ATK*player.CritD
                result.string = '暴击了！你造成了' + damgeReult + '点伤害，受到了' + enemy.ATK + '点伤害\n' + result.string
            } else {
                result.string = '你造成了' + damgeReult + '点伤害，受到了' + enemy.ATK + '点伤害\n' + result.string
            }

            // 怪物血量
            enemy.HP = Number((enemy.HP - damgeReult).toFixed(2))

            // 玩家血量
            player.HP -= enemy.ATK

            let battleResult
            //player失败
            if (player.HP <= 0) {
                player.HP = 0
                battleResult = '战斗失败\n' + result.string
            }

            //enemy失败
            if (enemy.HP <= 0) {
                let enemyExp = 3
                player.EXP += enemyExp;
                // find("Canvas/Player").getComponent(Player).checkLevel()
                this.enemyHp += 4
                this.enemyATK += 1
                enemy.HP = 0
                battleResult = '战斗成功，获得' + enemyExp+'点经验值\n' + result.string
            }
            //结束
            if (player.HP <= 0 || enemy.HP <= 0) {
                result.string = battleResult
                find("Canvas/Player").getComponent(Player).setPlayerData(player)
                find("Canvas/Player").getComponent(Player).reset(player.MaxHp);
                enemy.reset(this.enemyHp, this.enemyATK);
                this.startBtn.getComponent(Button).interactable = true;
                this.unschedule(this.callback);
            }
        }, 1);
    }

}
