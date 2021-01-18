
import { _decorator, Component, Node, find, Button,Animation, Label, color, Color, Sprite, ProgressBar } from 'cc';
const { ccclass, property  } = _decorator;
import {Player} from './Player'

@ccclass('UI')
export class UI extends Component {
    //上一个页面index
    lastIndex: number;
    playerData: any;

    onLoad() {
        //加载玩家数据
        this.playerData = find("Canvas").getComponent(Player).playerData;
        this.lastIndex = 3
        find("Canvas/UI/Layout/toPlayer").on(Button.EventType.CLICK, this.toPlayer, this)
        find("Canvas/UI/Layout/toBag").on(Button.EventType.CLICK, this.toBag, this)
        find("Canvas/UI/Layout/toSkill").on(Button.EventType.CLICK, this.toSkill, this)
        find("Canvas/UI/Layout/toBattle").on(Button.EventType.CLICK, this.toBattle, this)
    }

    update() {
        this.updateHead();
    }

    updateHead() {
        let playerData = this.playerData
        find("Canvas/UI/Header/Lv").getComponent(Label).string = playerData.Level
        find("Canvas/UI/Header/Hp/Label").getComponent(Label).string = playerData.HP + '/' + playerData.MaxHp
        find("Canvas/UI/Header/Hp").getComponent(ProgressBar).progress = Number((playerData.HP / playerData.MaxHp).toFixed(2))
        find("Canvas/UI/Header/Exp/Label").getComponent(Label).string = playerData.EXP + '/' + find("Canvas").getComponent(Player).levelUpNeedExp(playerData.Level)
        find("Canvas/UI/Header/Exp").getComponent(ProgressBar).progress = Number((playerData.EXP / find("Canvas").getComponent(Player).levelUpNeedExp(playerData.Level)).toFixed(2))
    }

    toPlayer() {
        this.changeIndex(0)
        this.lastIndex = 0
    }
    toBag () {
        this.changeIndex(1)
        this.lastIndex = 1
    }
    toSkill(){
        this.changeIndex(2)
        this.lastIndex = 2
    }
    toBattle() {
        this.changeIndex(3)
        this.lastIndex = 3
    }
    changeIndex(num) {
        let that = this;
        find("Canvas/UI/Layout/toPlayer").getComponent(Sprite).color = new Color('#646464')
        find("Canvas/UI/Layout/toBag").getComponent(Sprite).color = new Color('#646464')
        find("Canvas/UI/Layout/toSkill").getComponent(Sprite).color = new Color('#646464')
        find("Canvas/UI/Layout/toBattle").getComponent(Sprite).color = new Color('#646464')
        find("Canvas/UI/Layout/toPlayer").getComponent(Button).interactable = true
        find("Canvas/UI/Layout/toBag").getComponent(Button).interactable = true
        find("Canvas/UI/Layout/toSkill").getComponent(Button).interactable = true
        find("Canvas/UI/Layout/toBattle").getComponent(Button).interactable = true
        switch (num) {
            case 0:
                find("Canvas/UI/Layout/toPlayer").getComponent(Sprite).color = new Color('#ffffff')
                find("Canvas/UI/Layout/toPlayer").getComponent(Button).interactable = false
                if (checkFrom()) {
                } else {
                    find("Canvas/Player").getComponent(Animation).play("fromLeft");
                    find(checkNode(this.lastIndex)).getComponent(Animation).play("toright");
                }
                break;
            case 1:
                find("Canvas/UI/Layout/toBag").getComponent(Sprite).color = new Color('#ffffff')
                find("Canvas/UI/Layout/toBag").getComponent(Button).interactable = false
                if (checkFrom()) {
                    find("Canvas/Bag").getComponent(Animation).play("fromRight");
                    find(checkNode(this.lastIndex)).getComponent(Animation).play("toleft");
                } else {
                    find("Canvas/Bag").getComponent(Animation).play("fromLeft");
                    find(checkNode(this.lastIndex)).getComponent(Animation).play("toright");
                }
                break;
            case 2:
                find("Canvas/UI/Layout/toSkill").getComponent(Sprite).color = new Color('#ffffff')
                find("Canvas/UI/Layout/toSkill").getComponent(Button).interactable = false
                if (checkFrom()) {
                    find("Canvas/Skills").getComponent(Animation).play("fromRight");
                    find(checkNode(this.lastIndex)).getComponent(Animation).play("toleft");
                } else {
                    find("Canvas/Skills").getComponent(Animation).play("fromLeft");
                    find(checkNode(this.lastIndex)).getComponent(Animation).play("toright");
                }
                break;
            case 3:
                find("Canvas/UI/Layout/toBattle").getComponent(Sprite).color = new Color('#ffffff')
                find("Canvas/UI/Layout/toBattle").getComponent(Button).interactable = false
                if (checkFrom()) {
                    find("Canvas/Battle").getComponent(Animation).play("fromRight");
                    find(checkNode(this.lastIndex)).getComponent(Animation).play("toleft");
                } else {
                   
                }
                break;
            default:
                break;
        }
        //index是否从左边来，本体从右边来
        function checkFrom() {
            let result
            if (num > that.lastIndex) {
                result =  true
            } else {
                result = false
            }
            return result
        }
        function checkNode(num) {
            let result
            switch (num) {
                case 0:
                    result = "Canvas/Player"   
                    break;
                case 1:
                    result = "Canvas/Bag"
                    break;
                case 2:
                    result = "Canvas/Skills"
                    break;
                case 3:
                    result = "Canvas/Battle"
                    break;
                default:
                    break;
            }
            return result
        }
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
