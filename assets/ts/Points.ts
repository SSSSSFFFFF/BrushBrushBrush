// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find, Label, Button, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;
import { Player } from './Player'

@ccclass('Points')
export class Points extends Component {
    playerData: any;

    @property({ type: Prefab })
    private Points: Prefab = null;
    onLoad() {
        //加载玩家数据
        let that = this
        this.playerData = find("Canvas").getComponent(Player).playerData;
        that.getPoints();
    }

    fixed(num, fix) {
        return Number(num.toFixed(fix))
    }
    getPoints(){
        let that = this
        find("Canvas/UI/Header/Lv").on(Node.EventType.TOUCH_START, () => {
            let node = instantiate(that.Points);
            node.parent = find("Canvas");
            //暂存两次加点，一个用来新增，一个用来初始化
            let lastPoints = JSON.parse(JSON.stringify(that.playerData.UsedPoints))
            let lastPointsSave = JSON.parse(JSON.stringify(that.playerData.UsedPoints))
            //暂存技能点数
            let lastpointsNum = JSON.parse(JSON.stringify(that.playerData.Points))
            find("Points/PointsNum", node).getComponent(Label).string = lastpointsNum

            setsKill("ATK")
            setsKill("MaxHp")
            function setsKill(name) {
                find("Skills/" + name +"/Left/Num", node).getComponent(Label).string = lastPoints[name]
                find("Skills/" + name +"/Button", node).on(Button.EventType.CLICK, () => {
                    if (lastpointsNum > 0) {
                        lastpointsNum--
                        find("Points/PointsNum", node).getComponent(Label).string = lastpointsNum
                        lastPoints[name]++
                        find("Skills/" + name +"/Left/Num", node).getComponent(Label).string = lastPoints[name]
                    }
                }, this);
            }

            find("Reset", node).on(Button.EventType.CLICK, () => {
                for (const key in lastPoints) {
                    lastpointsNum = lastpointsNum + lastPoints[key]
                    find("Points/PointsNum", node).getComponent(Label).string = lastpointsNum
                    lastPoints[key] = 0
                    find("Skills/" + key + "/Left/Num", node).getComponent(Label).string = "0"
                }
            }, this);
            find("Confirm", node).on(Button.EventType.CLICK, () => {
                //减去之前添加的属性
                that.playerData.ATK = that.playerData.ATK - (lastPointsSave.ATK*5)
                that.playerData.MaxHp = that.playerData.MaxHp - (lastPointsSave.MaxHp * 100)
                //增加新添加的属性
                that.playerData.ATK = that.playerData.ATK + (lastPoints.ATK * 5)
                that.playerData.MaxHp = that.playerData.MaxHp + (lastPoints.MaxHp * 100)
                //扣去技能点
                that.playerData.Points = lastpointsNum
                that.playerData.UsedPoints = lastPoints
                find("Canvas").getComponent(Player).setPlayerData(that.playerData)
                 node.destroy()
            }, this);
            find("Cancel", node).on(Button.EventType.CLICK, () => {
                node.destroy()
            }, this);
        })

        // that.playerData.UsedPoints.HP = this.fixed((that.playerData.UsedPoints.HP + 1), 0)
    }
}
