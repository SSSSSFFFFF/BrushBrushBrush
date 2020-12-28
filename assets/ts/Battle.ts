// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Button, find, Prefab, instantiate, Label } from 'cc';
const { ccclass, property, integer, float, boolean, string, type } = _decorator;
import { Player } from "./Player";
import { Enemy } from "./Enemy";

@ccclass('Battle')
export class Battle extends Component {
    @property({ type: Prefab })
    private enemyPre: Prefab = null;

    enemyData: any;
    battling: () => void;
    playerData: any;
    enemyNodes: any[] = [];
    //怪物生成数量
    num: number = 10;
    result: string;

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
        if (this.playerData.HP <= 0){
            this.playerData.HP = 0;
            this.result = 'fail'
            console.log('失败了')
        }
    }
    generateEnemies(num){
        for (let i = 0; i < num; i++) {
            let node = instantiate(this.enemyPre);
            node.parent = find("Canvas/Battle/Enemies");
        }
    }
    btnClick(button: Button) {
        let num = this.num
        for (let i = 0; i < num; i++) {
            let node = instantiate(this.enemyPre);
            node.parent = find("Canvas/Battle/Enemies");
            this.enemyNodes.push(node)
        }
        this.battleProcess(num);
    }
    battleProcess(num){
        this.schedule(this.battling = function () {
            for (let i = 0; i < num; i++) {
                let enemyNow = this.enemyNodes[i].getComponent(Enemy).enemyNow
                this.playerData.HP = Number((this.playerData.HP - enemyNow.ATK).toFixed())
            }
        }, 1);
    }
    getenemyData() {
        this.enemyData = JSON.parse(localStorage.getItem('enemyData'));
        //如果不存在怪物数据则新建
        if (!this.enemyData) {
            this.enemyData = {
                white: {
                    Level: 'white',
                    MaxHp: '200',
                    ATK: '2',
                },
                blue: {
                    Level: 'blue',
                    MaxHp: '300',
                    ATK: '3',
                    chance: 0.3,//生成几率,实际为0.2 (0.3-0.1
                },
                gold: {
                    Level: 'gold',
                    MaxHp: '500',
                    ATK: '5',
                    chance: 0.1,//生成几率
                }
            }
            localStorage.setItem('enemyData', JSON.stringify(this.enemyData))
        }
        console.log(this.enemyData);
    }
}
