// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, _decorator, Component, Button, find, Prefab, instantiate, Label, RichText, __private, ProgressBar,Animation } from 'cc';
const { ccclass, property, integer, float, boolean, string, type } = _decorator;
import { Player } from "./Player";
import { Enemy } from "./Enemy";

@ccclass('Battle')
export class Battle extends Component {
    @property({ type: Prefab })
    private enemyPre: Prefab = null;


    @property({ type: Prefab })
    private playerStatus: Prefab = null;

    @property({ type: Prefab })
    private enemyStatus: Prefab = null;

    // 怪物数据
    enemyData: any;
    // 玩家数据
    playerData: any;
    //怪物节点
    enemyNodes: any[] = [];
    //怪物生成数量
    num: number = 2;
    // 战斗结果
    result: string;
    // 怪物攻击定时器
    time: any;
    //玩家攻击定时器
    playerTime:any;
    gameStartTime: number;
    enemyNodesIndex: number = 0;
    boss: boolean;
    cd1: number;
    cd1Time: number;
    onLoad() {

        //加载玩家数据
        this.playerData = find("Canvas/Player").getComponent(Player).playerData;
        //加载敌人数据
        this.getenemyData()
        //变更进度条
        this.updateProgress();
    }

    update(deltaTime: number) {
        //判断结果
        this.checkResult()
        //检查展示角色状态
        this.checkPlayer()
    }
    start() {

        // 玩家攻击
        find("Canvas/Battle/SpriteSplash").on('touch-start', this.playerNormalAtk, this)
        // 玩家停止攻击
        find("Canvas/Battle/SpriteSplash").on('touch-end', this.playerNormalAtkStop, this)

        // 技能1
        find("Canvas/Battle/skill1").on(Node.EventType.TOUCH_START, this.playerSkill1, this)

        //开始
        find("Canvas/Battle/Button").on('click', this.startBtn, this)

        //初步调整难度
        find("Canvas/Battle/ScrollView/view/content/Button").on(Button.EventType.CLICK, this.Button, this)
        find("Canvas/Battle/ScrollView/view/content/Button-001").on(Button.EventType.CLICK, this.Button, this)
        find("Canvas/Battle/ScrollView/view/content/Button-002").on(Button.EventType.CLICK, this.Button, this)
    }
    updateProgress() {
        find("Canvas/Battle/ProgressBar").getComponent(ProgressBar).progress = Number((this.playerData.progress >= 100 ? 100 : this.playerData.progress / 100).toFixed(2))
        find("Canvas/Battle/ProgressLabel").getComponent(Label).string = ((this.playerData.progress >= 100) ? "100" : this.playerData.progress) + "%"
    }
    Button(button) {
        let that = this;
        switch (button.node.name) {
            case 'Button':
                localStorage.setItem('hard', '1')
                break;
            case 'Button-001':
                localStorage.setItem('hard', '1.5')
                break;
            case 'Button-002':
                localStorage.setItem('hard', '2')
                break;
            default:
                break;
        }
        //加载敌人数据
        this.getenemyData()
    }
    checkPlayer(){
        let playerData = this.playerData
        find("Canvas/Battle/Player/Info").getComponent(Label).string = 'HP:' + playerData.HP+'/'+playerData.MaxHp
    }
    checkResult (){
        let that = this;
        if (this.result){
            find("Canvas/Battle/Result").getComponent(Label).string = '失败'
            this.playerData.progress = Number((this.playerData.progress * 0.8).toFixed())
            //变更进度条
            find("Canvas/Battle").getComponent(Battle).updateProgress();
            //战斗结束
            that.battleEnd()
        }
        if (that.enemyNodes.length > 0 && that.enemyNodes[that.enemyNodes.length - 1].getComponent(Enemy).enemyNow.status == 'lose') {
            find("Canvas/Battle/Result").getComponent(Label).string = '成功'
            if (this.boss){
                this.playerData.progress = 0
                //变更进度条
                find("Canvas/Battle").getComponent(Battle).updateProgress();
            }
            this.boss = false
            //战斗结束
            that.battleEnd()
        }
    } 
    battleEnd() {
        console.log("战斗结束");
        let that = this
        //清除玩家攻击定时器
        // clearInterval(that.playerTime)
        //清除怪物攻击定时器
        for (let i = 0; i < Object.keys(that.time).length; i++) {
            clearInterval(that.time[i])
        }
        //清除怪物节点
        for (let i = 0; i < that.enemyNodes.length; i++) {
            that.enemyNodes[i].destroy()
        }
        that.enemyNodes = []
        that.playerData.HP = that.playerData.MaxHp 
        //清空战斗结果
        this.result = null
        this.enemyNodesIndex = 0
        this.gameStart()
        // find("Canvas/Battle/Button").getComponent(Button).interactable = true
    }

    startBtn(){
        this.gameStart()
        find("Canvas/Battle/Button").destroy();
    }
    gameStart() {
        let that = this
        let time = 3
        let countdown = null
        countdown = setInterval(() => {
            if(time>0){
                find("Canvas/Battle/Result").getComponent(Label).string = time.toString()
                time -- 
            } else {
                clearInterval(countdown)
            }
        },1000)
        clearTimeout(this.gameStartTime)
        // find("Canvas/Battle/Button").getComponent(Button).interactable = false
        this.gameStartTime = setTimeout(() => {
            find("Canvas/Battle/Result").getComponent(Label).string = "战斗开始"
            if (this.playerData.progress >= 100) {
                //boss
                this.boss = true
                let node = instantiate(this.enemyPre);
                node.parent = find("Canvas/Battle/Enemies");
                this.enemyNodes.push(node)
                this.battleProcess(1);
            } else {
                //小怪
                let num = this.num
                for (let i = 0; i < num; i++) {
                    let node = instantiate(this.enemyPre);
                    node.parent = find("Canvas/Battle/Enemies");
                    this.enemyNodes.push(node)
                }
                //战斗过程
                this.battleProcess(num);
            }

        }, 4000);
    }
    battleProcess(num){
        let that = this
        this.time = {}
        //怪物攻击
        for (let i = 0; i < num; i++) {
            let enemyNow = this.enemyNodes[i].getComponent(Enemy).enemyNow
            this.time[i] = setInterval(() => {
                //显示受到攻击
                this.enemyNodes[i].getComponent(Animation).play("enemyAtack")
                let node = instantiate(that.playerStatus);
                node.parent = find("Canvas/Battle/Player")
                node.getComponent(RichText).string = '-' + Number(enemyNow.ATK).toFixed()
                this.playerData.HP = Number((this.playerData.HP - enemyNow.ATK).toFixed())
                node.getComponent(Animation).play("atacked")

                if (this.playerData.HP <= 0) {
                    this.playerData.HP = 0;
                    this.result = 'fail';
                }
            }, enemyNow.AtkRate)
        }
    }
    playerSkill1() {
        let that = this;
        // 技能1
        find("Canvas/Battle/skill1").off(Node.EventType.TOUCH_START)
        this.cd1 = 10;
        this.cd1Time = setInterval(()=>{
            find("Canvas/Battle/skill1/Label").getComponent(Label).string = (this.cd1).toFixed();
            this.cd1 = this.cd1 - 1
            if (this.cd1 <= 0) {
                clearInterval(this.cd1Time)
                // 技能1
                find("Canvas/Battle/skill1").on(Node.EventType.TOUCH_START, this.playerSkill1, this)
            }
        },1000)
        for (let i = 0; i < that.enemyNodes.length; i++) {
            let enemyNow = that.enemyNodes[i].getComponent(Enemy).enemyNow
            enemyNow.MaxHp = Number((enemyNow.MaxHp - 100).toFixed())
            find("RichText", that.enemyNodes[i]).getComponent(RichText).string = '-' + Number(100).toFixed()
        }
    }
    playerNormalAtk(){
        this.playerAtk()
        // this.playerAtk(0)
    }
    
    playerNormalAtkStop(){
        clearInterval(this.playerTime)
    }

    playerAtk() {
        let that = this

        that.playerTime = setInterval(() => {
            atack()
        }, that.playerData.AtkRate)

        function atack(){
            console.log("atack");
            find("Canvas/Battle/Player").getComponent(Animation).play("atack")
            let i = that.enemyNodesIndex;
            if (that.enemyNodes.length > 0) {
                let enemyNow = that.enemyNodes[i].getComponent(Enemy).enemyNow
                enemyNow.MaxHp = Number((enemyNow.MaxHp - that.playerData.ATK).toFixed())
                let node = instantiate(that.enemyStatus);
                node.parent = find("Widget", that.enemyNodes[i])
                node.getComponent(RichText).string = '-' + Number(that.playerData.ATK).toFixed()
                node.getComponent(Animation).play("atacked")
                
                if (enemyNow.status == 'lose' && i < that.num - 1) {
                    clearInterval(that.playerTime)
                    that.enemyNodesIndex = i + 1
                    that.playerAtk()
                }
            } 
        }
    }
    getenemyData() {
        let that = this
        //难度等级
        let n = localStorage.getItem('hard')
        if (!n){
            localStorage.setItem('hard', '1')
            setEnemyData(1)
        } else {
            setEnemyData(Number(n))
        }
        //设置材料掉率
        function setSpoils(level){
            let result:any[];
            switch (level) {
                case 'boss':
                    result = [
                        {
                            name: '白银',
                            chance: 1
                        },
                        {
                            name: '黄金',
                            chance: 1
                        }
                    ]
                    break;
                case 'white':
                    result = [
                        {
                            name: '黑铁',
                            chance: 0.7
                        },
                        {
                            name: '黄铜',
                            chance: 0.3
                        },
                    ]
                    break;
                case 'blue':
                    result = [
                        {
                            name: '黑铁',
                            chance: 0.8
                        },
                        {
                            name: '黄铜',
                            chance: 0.5
                        },
                    ]
                    break;
                case 'gold':
                    result = [
                        {
                            name: '黑铁',
                            chance: 0.9
                        },
                        {
                            name: '黄铜',
                            chance: 0.7
                        },
                    ]
                    break;
                default:
                    break;
            }
            return result
        }
        //设置装备掉率(怪物等级，当前难度)
        function setEquip(level,n) {
            let result: any[];
            switch (level) {
                case 'boss':
                    result = [
                        {
                            name: '橙装',
                            ATK: Number((10 * n).toFixed(2)),
                            type: '武器',
                            chance: 1
                        }
                    ]
                    break;
                case 'white':
                    result = [
                        {
                            name: '白装',
                            ATK: Number((2 * n).toFixed(2)),
                            type: '武器',
                            chance: 0.8
                        },
                        {
                            name: '蓝装',
                            ATK: Number((5 * n).toFixed(2)),
                            type: '衣服',
                            chance: 0.2
                        },
                    ]
                    break;   
                case 'blue':
                    result = [
                        {
                            name: '白装',
                            ATK: Number((2 * n).toFixed(2)),
                            type: '衣服',
                            chance: 0.5
                        },
                        {
                            name: '蓝装',
                            ATK: Number((5 * n).toFixed(2)),
                            type: '衣服',
                            chance: 0.5
                        },
                    ]
                    break;  
                case 'gold':
                    result = [
                        {
                            name: '白装',
                            ATK: Number((2 * n).toFixed(2)),
                            type: '武器',
                            chance: 0.4
                        },
                        {
                            name: '蓝装',
                            ATK: Number((5 * n).toFixed(2)),
                            type: '武器',
                            chance: 0.7
                        },
                        {
                            name: '橙装',
                            ATK: Number((10 * n).toFixed(2)),
                            type: '武器',
                            chance: 0.2
                        }
                    ]
                    break;   
                default:
                    break;
            }
            return result
        }
        function setEnemyData(n){
            that.enemyData = {
                boss:{
                    Level: 'boss',
                    MaxHp: Number((400 * n).toFixed(2)),
                    ATK: Number((88 * n).toFixed(2)),
                    AtkRate: Number((1000 / n).toFixed(2)),//攻速(多少毫秒攻击一次)
                    spoils: setSpoils('boss'),
                    equipment: setEquip('boss',n)
                },
                white: {
                    Level: 'white',
                    MaxHp: Number((200 * n).toFixed(2)),
                    ATK: Number((5 * n).toFixed(2)),
                    AtkRate: Number((800 / n).toFixed(2)),//攻速(多少毫秒攻击一次)
                    spoils: setSpoils('white'),
                    equipment: setEquip('white', n)
                },
                blue: {
                    Level: 'blue',
                    MaxHp: Number((300 * n).toFixed(2)),
                    ATK: Number((6 * n).toFixed(2)),
                    chance: 0.3,//生成几率,实际为0.2 (0.3-0.1
                    AtkRate: Number((700 / n).toFixed(2)),
                    spoils: setSpoils('blue'),
                    equipment: setEquip('blue', n)
                },
                gold: {
                    Level: 'gold',
                    MaxHp: Number((350 * n).toFixed(2)),
                    ATK: Number((7 * n).toFixed(2)),
                    chance: 0.1,//生成几率c
                    AtkRate: Number((600 / n).toFixed(2)),
                    spoils: setSpoils('gold'),
                    equipment: setEquip('gold', n)
                }
            }
            globalThis.enemyData = that.enemyData
        }
    }
}
