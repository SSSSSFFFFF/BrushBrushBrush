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
    callback: () => void;
    //当前用户信息
    playerData: any;
    //弹窗
    @property({ type: Prefab })
    private Model: Prefab = null;
    result: Label;
    start() {
        //消息窗
        this.result = find("Canvas/Battle/ScrollView/view/content/item").getComponent(Label)
        //获取用户信息
        this.getPlayerData();
        //清除存档
        find("Canvas/Player/ClearSave").on(Button.EventType.CLICK, this.clickClearSave, this)
        //使用天赋点
        this.usePoints()

        //每秒恢复生命值
        this.secondHp()
    }
    update(dt: number) {
        //刷新属性面板
        this.updateUserInfo()
        this.checkLevel()
        //确保hp不超过最大生命值
        this.HP();
    }
    
    HP(){
        let playerData = this.playerData
        if (playerData.HP > playerData.MaxHp) {
            playerData.HP = playerData.MaxHp
        }
    }
    secondHp(){
        //每秒恢复生命值
        let playerData = this.playerData
        this.schedule(this.callback = function () {
            if (playerData.HP < playerData.MaxHp) {
                playerData.HP = playerData.HP + playerData.HPS
            }
        }, 1);
    }
    clickClearSave(){
        let node = instantiate(this.Model);
        if (!find("Canvas/Player/Model")) {
            node.parent = find("Canvas/Player");
            node.setPosition(0, 0);
        }
        find("Canvas/Player/Model/Cancel").on(Button.EventType.CLICK, function () {
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
                'MaxHp': 20,//最大生命值
                'EXP': 0,//经验值  
                'ATK': 2,//攻击力
                'Crit': 0.1,//暴击率
                'CritD': 1.5,//暴击伤害
                'Level': 1,//等级
                'LevelUpNeedExp':[0,5,20,50,100,'Max'],//升级所需经验
                'Points':10, //天赋点
                'HPS':1,//秒回
                'addPoints': { //记录天赋添加的值
                    'MaxHp':0,
                    'ATK':0,
                    'Crit':0,
                    'CritD':0,
                    'HPS':0,
                }
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
        + '\n暴击率：' + (playerData.Crit * 100).toFixed(2)+ '%'
            + '\n暴击伤害：' + (playerData.CritD * 100).toFixed(2) + '%'
        + '\n每秒恢复：' + playerData.HPS+ '/s'
        // 刷新天赋点
        find("Canvas/Player/Label").getComponent(Label).string ='使用天赋点 剩余' + playerData.Points
    }
    //验证等级
    checkLevel(){
        let playerData = this.playerData
        let i = playerData.Level
        if (playerData.EXP >= playerData.LevelUpNeedExp[i] && playerData.LevelUpNeedExp[i] != 'Max') {
            //升级
            playerData.Level++
            playerData.EXP = playerData.EXP - playerData.LevelUpNeedExp[i]
            //每集增加天赋点
            let addPoint = 3
            this.result.string = '升级了！天赋点+' + addPoint + '\n' + this.result.string
            playerData.Points += addPoint
            this.setPlayerData(playerData)
        }
    }
    //使用天赋点
    usePoints(){
        let playerData = this.playerData
        //重置天赋点
        find("Canvas/Player/ResetPoints").on(Button.EventType.CLICK, function () {
            for (const key in playerData.addPoints) {
                let value = playerData.addPoints[key]
                // console.log(value);
                switch (key) {
                    case 'MaxHp':
                        playerData.MaxHp = playerData.MaxHp - value * 2
                        playerData.Points += value
                        break;
                    case 'ATK':
                        playerData.ATK -= value
                        playerData.Points += value
                        break;
                    case 'Crit':
                        playerData.Crit = (Number(playerData.Crit) - value * 0.05).toFixed(2)
                        playerData.Points += value
                        break;
                    case 'CritD':
                        playerData.CritD = (Number(playerData.CritD) - value * 0.1).toFixed(2)
                        playerData.Points += value
                        break; 
                    case 'HPS':
                        playerData.HPS = playerData.HPS - value
                        playerData.Points += value
                        break;
                    default:
                        break;
                }

                playerData.addPoints[key] = 0
            }
        }, this)
        //增加生命值
        find("Canvas/Player/Layout/Button").on(Button.EventType.CLICK, function () {
            if (playerData.Points > 0) {
                playerData.MaxHp += 2
                playerData.Points--
                playerData.addPoints.MaxHp++
                this.setPlayerData(playerData)
            }
        }, this)        
        // //增加攻击力
        find("Canvas/Player/Layout/Button-001").on(Button.EventType.CLICK, function () {
            if (playerData.Points > 0) {
                playerData.ATK++
                playerData.Points--
                playerData.addPoints.ATK++
                this.setPlayerData(playerData)
            }
        }, this)
        // //增加暴击
        find("Canvas/Player/Layout/Button-002").on(Button.EventType.CLICK, function () {
            if (playerData.Points > 0) {
                playerData.Crit = (Number(playerData.Crit) + 0.05).toFixed(2)
                playerData.Points--
                playerData.addPoints.Crit++
                this.setPlayerData(playerData)
            }
        }, this)
        //增加爆伤
        find("Canvas/Player/Layout/Button-003").on(Button.EventType.CLICK, function () {
            if (playerData.Points > 0) {
                playerData.CritD = (Number(playerData.CritD) + 0.1).toFixed(2)
                playerData.Points--
                playerData.addPoints.CritD++
                this.setPlayerData(playerData)
            }
        }, this)
        // //增加秒回
        find("Canvas/Player/Layout/Button-004").on(Button.EventType.CLICK, function () {
            if (playerData.Points > 0) {
                playerData.HPS = playerData.HPS + 1
                playerData.Points--
                playerData.addPoints.HPS++
                this.setPlayerData(playerData)
            }
        }, this)
        
    }
    formatNum(f:number, digit:number) {
        let m = Math.pow(10, digit);
        return Number(parseInt((f*m).toString(), 10) / m);
    } 
}
