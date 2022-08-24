function Digit(data) {
    /**
     * 数字动画执行
     * @func render
     * @param {Number} number 到达指定数值停止滚动
     * @param {int} finish 动画执行完毕时间
     * @param {int} speed 数值越大，越多数字同时进行翻滚，取值范围（0 ~ 10）
     * @param {String} direction 动画方向
     * @param {Object} dom 在指定dom节点插入动画
     */
    Digit.prototype.render = function() {
        var direction = data.direction // 动画方向
        var finish = data.finish // 总完成时间
        var speed = data.speed // 数值越大，越多数字同时进行翻滚，取值范围（0 ~ 10）
        var number = (data.number.toString()).replace('.', '').length - 1 // 需要执行动画的数量
        var single = Number((finish / number).toFixed(2)) // 单个完成时间

        var animation = {
            number : number,
            single : single,
            speed : speed,
            timerTemp : 0 // 定时器临时记录时间
        }

        animation.timerTemp -= animation.single

        initDom(data.dom, data.number) // 加载dom节点
        initAnimation(data.dom, animation, direction) // 执行数字滚动动画

    };

    /**
     * 加载dom节点
     * @func thousandsFormat
     * @param {Object} baseDom 父级dom
     * @param {Number} number 用户传入的数值
     * @param {Object} animation 动画相关属性
     */
    function initDom(baseDom, number){
        var strNumber = thousandsFormat(number) // 千位数格式化
        var length = strNumber.toString().length // 获取数字长度

        for(var i = 0; i < length; i++){
            var dom = document.createElement("div")
            if(strNumber[i] != "," && strNumber[i] != "."){
                dom.className = "to__led-number"
            }
            else{
                dom.className = "to__led-number to__led-number--no"
            }
            dom.innerHTML = strNumber[i]
            baseDom.appendChild(dom)
        }
    }

    /**
     * 执行数字滚动动画
     * @func initAnimation
     * @param {Object} animation 动画相关属性
     */
    function initAnimation(baseDom, animation, direction){
        var desc = baseDom.childNodes.length - 1

        for(var i = 0; i < baseDom.childNodes.length; i++){
            var dom = {}
            if(direction == "left"){
                dom = baseDom.childNodes[i]
            }
            else{
                dom = baseDom.childNodes[desc]
            }

            // 获取0 ~ 9 数字
            var oidNum = dom.innerHTML
            var num = 0
            function getNumber(){
                if(num == 9){
                    num = 0
                }
                else{
                    num++
                }
                return num
            }
            dom.innerHTML = ""

            // 调整动画速度
            if(oidNum != "," && oidNum != "."){
                animation.timerTemp += animation.single
            }
            var timerStart = (animation.timerTemp * 0.5 ) / animation.speed // 定时器开始时间
            var timerEnd = animation.timerTemp - timerStart  // 定时器结束时间

            // console.log('animation.timerTemp : ' + animation.timerTemp)
            // console.log('timerStart : ' + timerStart + " , timerEnd : " + timerEnd)

            // 按顺序排队执行动画
            !function(dom, oidNum){
                setTimeout(function(){
                    dom.innerHTML = oidNum
                    if(oidNum != "," && oidNum != "."){
                        dom.innerHTML = oidNum
    
                        // 开启定时器
                        var timer = setInterval(function(){
                            dom.innerHTML = getNumber()
                        }, 50);
                        
                        // 关闭定时器
                        setTimeout(function(){
                            clearInterval(timer)
                            dom.innerHTML = oidNum
                        }, 1000 * timerEnd);
                    }
                    else{
                        dom.innerHTML = oidNum
                    }
                }, 1000 * timerStart);
            }(dom, oidNum)

            desc--
        }
    }

    /**
     * 千位数逗号格式化
     * @func thousandsFormat
     * @param {int} data 数值
     * @param {Boolean} isRetain 如果有小数是否保留：1:是; 0:否
     */
    function thousandsFormat(data, isRetain){
        data = data.toString()
        var splitArr = data.split('.')
        var number = splitArr[0] // 整数
        var decimal = "." + splitArr[1] // 小数

        // 添加逗号
        var res = number
        for(var i = 1; i <= (Math.floor((number.length - 1) / 3)); i++){
            res = insertStr(res, number.length - (i * 3), ",")
        }

        // 组合整数和小数
        if(splitArr[1]){
            res += decimal 
        }

        return res
    }

    /**
     * 字符串指定位置插入新字符串
     * @func insertStr
     * @param {String} soure 原有字符串
     * @param {Number} start 指定位置索引值
     * @param {String} newStr 需要插入的字符串文本
     */

    function insertStr(soure, start, newStr){
        return soure.slice(0, start) + newStr + soure.slice(start)
    }
}
