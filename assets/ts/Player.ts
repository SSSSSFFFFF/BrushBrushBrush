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

    @property({ type: Prefab })
    private pop: Prefab = null;

    onLoad(){
        //获取用户信息
        this.getPlayerData();
        //穿上装备
        this.setEquipment();
    }
    start() {
        //清除存档
        find("Canvas/Player/ClearSave").on(Button.EventType.CLICK, this.clickClearSave, this)
        //每秒恢复生命值
        this.secondHp()
    }
    update(dt: number) {
        //刷新属性面板
        this.updateUserInfo()
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
                playerData.HP = Number(playerData.HP) + Number(Number(playerData.HPS).toFixed(2))
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
            //临时
            localStorage.removeItem('enemyData')
            window.location.reload()
        }, this)
    }
    getPlayerData() {
        this.playerData = JSON.parse(localStorage.getItem('playerData'));
        //如果不存在用户数据则新建
        if (!this.playerData) {
            this.playerData = {
                nickName: '',
                MaxHp: 1000,//最大生命值
                EXP: 0,//经验值  
                ATK: 40,//攻击力
                AtkRate: 300,//攻速(多少毫秒攻击一次)
                Crit: 0.1,//暴击率
                CritD: 1.5,//暴击伤害
                Level: 1,//等级
                LevelUpNeedExp:[0,5,20,50,100,'Max'],//升级所需经验
                Points:10, //天赋点
                HPS:5.5,//秒回
                addPoints: { //记录天赋添加的值
                    MaxHp:0,
                    ATK:0,
                    Crit:0,
                    CritD:0,
                    HPS:0,
                },
                bag:[],
                progress:99,
                equip:{
                    weapon:{},
                    clothes:{},
                },
                skill:[
                    {
                        name:'aoe',
                        description:'攻击全体',
                        ATK:100,
                        cd:10
                    }
                ]
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
    setEquipment(){
        for (const key in this.playerData.equip) {
            let value = this.playerData.equip[key]
            this.changeEquipment(value)
        }
    }
    changeEquipment(good){
        let that = this;
        switch (good.type) {
            case '武器':
                this.playerData.equip.weapon = good
                equipPop("SpriteSplash")
                break;
            case '衣服':
                this.playerData.equip.clothes = good
                equipPop("SpriteSplash-001")
                break;
            default:
                break;
        }
        function equipPop(name){
            find("Canvas/Player/"+name).off(Node.EventType.TOUCH_START);
            that.playerData.ATK = that.playerData.ATK + good.ATK
            find("Canvas/Player/"+name+"/Label").getComponent(Label).string = good.name;
            find("Canvas/Player/"+name).on(Node.EventType.TOUCH_START, (event) => {
                //弹窗
                let node = instantiate(that.pop);
                node.parent = find("Canvas/Player")
                find("Label", node).getComponent(Label).string = '物品名：' + good.name + '\n攻击力：' + good.ATK + '\n类别：' + good.type
                find("Button", node).on(Button.EventType.CLICK, (event) => {
                    node.destroy();
                }, that)
            }, that);
        }
        this.setPlayerData(this.playerData)
    }
    updateUserInfo() {
        let playerData = this.playerData
        find("Info", this.node).getComponent(Label).string =
            '\n等级：' + playerData.Level
            +'\n生命值：' + playerData.HP + '/' + playerData.MaxHp
            +'\n攻击力：' + playerData.ATK
            +'\n经验值：' + playerData.EXP + '/' + playerData.LevelUpNeedExp[playerData.Level]
        + '\n攻击速度：' + Number((Number(playerData.AtkRate)/1000).toFixed(2))*100 +'%'
        // + '\n暴击率：' + (playerData.Crit * 100).toFixed(2)+ '%'
        //     + '\n暴击伤害：' + (playerData.CritD * 100).toFixed(2) + '%'
        + '\n每秒恢复生命值：' + playerData.HPS+ '/s'
    }
}
