// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Button, find, Prefab, instantiate, Label, RichText } from 'cc';
const { ccclass, property, integer, float, boolean, string, type } = _decorator;
import { Player } from "./Player";
import { Enemy } from "./Enemy";

@ccclass('Battle')
export class Battle extends Component {
    @property({ type: Prefab })
    private enemyPre: Prefab = null;

    enemyData: any;
    playerData: any;
    enemyNodes: any[] = [];
    //怪物生成数量
    num: number = 2;
    result: string;
    time: any;

    onLoad() {
        //加载玩家数据
        this.playerData = find("Canvas/Player").getComponent(Player).playerData;
        //加载敌人数据
        this.getenemyData()
    }
    start() {
        find("Canvas/Battle/Button").on(Button.EventType.CLICK, this.btnClick, this)
        //生成敌人(数量)
        // this.generateEnemies(10)
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
        if(this.result){
            if (this.playerData.HP <= 0) {
                this.playerData.HP = 0;
                this.result = 'fail';
                console.log('失败了')
                battleEnd()
            }
            //战斗结束
            function battleEnd() {
                //清除怪物攻击定时器
                for (let i = 0; i < Object.keys(that.time).length; i++) {
                    clearInterval(that.time[i])
                }
                //清除怪物节点
                for (let i = 0; i < that.enemyNodes.length; i++) {
                    that.enemyNodes[i].destroy()
                }
            }
        }
    }

    generateEnemies(num){
        for (let i = 0; i < num; i++) {
            let node = instantiate(this.enemyPre);
            node.parent = find("Canvas/Battle/Enemies");
        }
    }
    btnClick(button: Button) {
        //清空战斗结果
        this.result = ''
        let num = this.num
        for (let i = 0; i < num; i++) {
            let node = instantiate(this.enemyPre);
            node.parent = find("Canvas/Battle/Enemies");
            this.enemyNodes.push(node)
        }
        //战斗过程
        this.battleProcess(num);
    }
    battleProcess(num){
        this.time = {}
        for (let i = 0; i < num; i++) {
            let enemyNow = this.enemyNodes[i].getComponent(Enemy).enemyNow
            console.log(enemyNow);
            this.time[i] = setInterval(() => {
                //收到攻击显示
                find("Canvas/Battle/Player/Status").getComponent(RichText).string = '-' + Number(enemyNow.ATK).toFixed()
                this.playerData.HP = Number((this.playerData.HP - enemyNow.ATK).toFixed())
                
            }, enemyNow.AtkRate)
            // if (this.playerData.HP <= 0){
            //     clearInterval(time[num])
            // }
        }
        console.log(this.time);
    }
    getenemyData() {
        this.enemyData = JSON.parse(localStorage.getItem('enemyData'));
        //如果不存在怪物数据则新建
        if (!this.enemyData) {
            this.enemyData = {
                white: {
                    Level: 'white',
                    MaxHp: '200',
                    ATK: '5',
                    AtkRate: '300',//攻速(多少毫秒攻击一次)
                },
                blue: {
                    Level: 'blue',
                    MaxHp: '300',
                    ATK: '10',
                    chance: 0.3,//生成几率,实际为0.2 (0.3-0.1
                    AtkRate: '500',
                },
                gold: {
                    Level: 'gold',
                    MaxHp: '500',
                    ATK: '15',
                    chance: 0.1,//生成几率
                    AtkRate: '200',
                }
            }
            localStorage.setItem('enemyData', JSON.stringify(this.enemyData))
        }
        console.log(this.enemyData);
    }
}
