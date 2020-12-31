// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Button, find, Prefab, instantiate, Label, RichText, __private } from 'cc';
const { ccclass, property, integer, float, boolean, string, type } = _decorator;
import { Player } from "./Player";
import { Enemy } from "./Enemy";

@ccclass('Battle')
export class Battle extends Component {
    @property({ type: Prefab })
    private enemyPre: Prefab = null;
    // 怪物数据
    enemyData: any;
    // 玩家数据
    playerData: any;
    //怪物节点
    enemyNodes: any[] = [];
    //怪物生成数量
    num: number = 3;
    // 战斗结果
    result: string;
    // 怪物攻击定时器
    time: any;
    //玩家攻击定时器
    playerTime:any;
    onLoad() {
        //加载玩家数据
        this.playerData = find("Canvas/Player").getComponent(Player).playerData;
        //加载敌人数据
        this.getenemyData()
    }
    start() {
        find("Canvas/Battle/Button").on(Button.EventType.CLICK, this.btnClick, this)
        //初步调整难度
        find("Canvas/Battle/ScrollView/view/content/Button").on(Button.EventType.CLICK, this.Button, this)
        find("Canvas/Battle/ScrollView/view/content/Button-001").on(Button.EventType.CLICK, this.Button, this)
        find("Canvas/Battle/ScrollView/view/content/Button-002").on(Button.EventType.CLICK, this.Button, this)
    }
    Button(button) {
        let that = this;
        console.log(button.node.name);
        switch (button.node.name) {
            case 'Button':
                localStorage.setItem('hard', '1')
                break;
            case 'Button-001':
                localStorage.setItem('hard', '2')
                break;
            case 'Button-002':
                localStorage.setItem('hard', '3')
                break;
            default:
                break;
        }
        //加载敌人数据
        this.getenemyData()

    }
    update(deltaTime: number) {
        //判断结果
        this.checkResult()
        //检查展示角色状态
        this.checkPlayer()
    }
    checkPlayer(){
        let playerData = this.playerData
        find("Canvas/Battle/Player/Info").getComponent(Label).string = 'HP:' + playerData.HP+'/'+playerData.MaxHp
    }
    checkResult (){
        let that = this;
        if (this.result){
            find("Canvas/Battle/Result").getComponent(Label).string = this.result
            //战斗结束
            that.battleEnd()
        }
    } 
    battleEnd() {
        console.log("战斗结束");
        let that = this
        //清除玩家攻击定时器
        clearInterval(that.playerTime)
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
    }

    btnClick(button: Button) {
        let num = this.num
        for (let i = 0; i < num; i++) {
            let node = instantiate(this.enemyPre);
            node.parent = find("Canvas/Battle/Enemies");
            this.enemyNodes.push(node)
        }
        console.log(this.enemyNodes);
        //战斗过程
        this.battleProcess(num);
    }
    battleProcess(num){
        let that = this
        this.time = {}
        //怪物攻击
        for (let i = 0; i < num; i++) {
            let enemyNow = this.enemyNodes[i].getComponent(Enemy).enemyNow
            console.log(enemyNow);
            this.time[i] = setInterval(() => {
                //显示受到攻击
                find("Canvas/Battle/Player/Status").getComponent(RichText).string = '-' + Number(enemyNow.ATK).toFixed()
                this.playerData.HP = Number((this.playerData.HP - enemyNow.ATK).toFixed())
                if (this.playerData.HP <= 0) {
                    this.playerData.HP = 0;
                    this.result = 'fail';
                    console.log('失败了')
                }
            }, enemyNow.AtkRate)
        }
        // 玩家攻击
        playerAtk(0)
        function playerAtk(i) {
            let enemyNow = that.enemyNodes[i].getComponent(Enemy).enemyNow
            console.log(i, enemyNow);
            that.playerTime = setInterval(() => {
                enemyNow.MaxHp = Number((enemyNow.MaxHp - that.playerData.ATK).toFixed())
                find("RichText", that.enemyNodes[i]).getComponent(RichText).string = '-' + Number(that.playerData.ATK).toFixed()
                if (enemyNow.status == 'lose' && i < that.num-1) {
                    clearTimeout(that.playerTime)
                    let newi = i + 1
                    playerAtk(newi)
                }
                if (enemyNow.status == 'lose' && i == that.num -1 ) {
                    clearTimeout(that.playerTime)
                    that.result = 'success'
                    console.log('成功了')
                }
            }, that.playerData.AtkRate)
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
        function setEnemyData(n){
            that.enemyData = {
                white: {
                    Level: 'white',
                    MaxHp: Number((200 * n).toFixed(2)),
                    ATK: Number((5 * n).toFixed(2)),
                    AtkRate: Number((500 / n).toFixed(2)),//攻速(多少毫秒攻击一次)
                },
                blue: {
                    Level: 'blue',
                    MaxHp: Number((300 * n).toFixed(2)),
                    ATK: Number((10 * n).toFixed(2)),
                    chance: 0.3,//生成几率,实际为0.2 (0.3-0.1
                    AtkRate: Number((300 / n).toFixed(2)),
                },
                gold: {
                    Level: 'gold',
                    MaxHp: Number((500 * n).toFixed(2)),
                    ATK: Number((15 * n).toFixed(2)),
                    chance: 0.1,//生成几率c
                    AtkRate: Number((200 / n).toFixed(2)),
                }
            }
            window.enemyData = that.enemyData
            console.log(that.enemyData);
        }

    }
}
