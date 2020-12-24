// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find, Label, Button, Prefab, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('Player')
export class Player extends Component {
    //当前用户信息
    playerData: any;
    //弹窗
    @property({ type: Prefab })
    private Model: Prefab = null;
    start() {
        //获取用户信息
        this.getPlayerData();
        //清除存档
        find("Canvas/Player/ClearSave").on(Button.EventType.CLICK, this.clickClearSave, this)
    }
    update(deltaTime: number) {
        //刷新属性面板
        this.updateUserInfo()
    }
    clickClearSave(){
        let node = instantiate(this.Model);
        node.parent = find("Canvas/Player");
        node.setPosition(0, 0);
        find("Canvas/Player/Model/Cancel").on(Button.EventType.CLICK, function(){
            node.destroy();
        }, this)
        find("Canvas/Player/Model/Confirm").on(Button.EventType.CLICK, function () {
            localStorage.removeItem('playerData')
            window.location.reload()
        }, this)
    }
    getPlayerData() {
        this.playerData = JSON.parse(localStorage.getItem('playerData'));
        //如果不存在用户数据则新建
        if (!this.playerData) {
            this.playerData = {
                'MaxHp': 20,
                'EXP': 0,
                'ATK': 2,
                'Crit': 0.1,
                'CritD': 1.5,
                'Level': 1,
                'LevelUpNeedExp':[0,5,20,50]
            }
            localStorage.setItem('playerData', JSON.stringify(this.playerData))
        }
        //创建临时血量
        this.playerData.HP = this.playerData.MaxHp
    }
    //存储用户信息
    setPlayerData(playerData) {
        localStorage.setItem('playerData', JSON.stringify(playerData))
    }
    //回复血量
    reset(HP) {
        this.playerData.HP = HP
    }
    updateUserInfo() {
        let playerData = this.playerData      
        find("Info", this.node).getComponent(Label).string =
            '\n等级：' + playerData.Level
            +'\n生命值：' + playerData.HP + '/' + playerData.MaxHp
            +'\n攻击力：' + playerData.ATK
            +'\n经验值：' + playerData.EXP + '/' + playerData.LevelUpNeedExp[playerData.Level]
            +'\n暴击率：' + playerData.Crit * 100 + '%'
            +'\n暴击伤害：' + playerData.CritD * 100 + '%'
    }
    //验证等级
    checkLevel(){
        let i = 1, playerData = this.playerData
        while (playerData.EXP >= playerData.LevelUpNeedExp[i]) {
            playerData.Level++
            this.setPlayerData(playerData)
            i++
        }
    }
}
