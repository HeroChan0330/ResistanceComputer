
function Resistance(expression){
	this.re=0;
	this.im=0;
	if(expression!=null){
		var nums=expression.split("+");
		for(var index=0;index<nums.length;index++){
			if(nums[index][nums[index].length-1]!='j'){
				var num=parseFloat(nums[index]);
				this.re+=num;
			}else{
				if(nums[index].length==1){ //单独一个j，默认虚部为1
					this.im+=1;
				}else{
					var num=parseFloat(nums[index].substring(0,nums[index].length-1));
					this.im+=num;			
				}
			}
		}
	};
	this.plus=function(resistanceB){
		var ret=new Resistance();
		ret.re=this.re+resistanceB.re;
		ret.im=this.im+resistanceB.im;
		return ret;
	};
	this.mul=function(k){
		if(k.im!=0){
			throw "can not multiply a complex number";
		}
		var ret=new Resistance();
		ret.re=this.re*k.re;
		ret.im=this.im*k.re;
		return ret;
	}
	this.parallel=function(resistanceB){
		var ret=new Resistance();
		var a=this.re,b=this.im,c=resistanceB.re,d=resistanceB.im;
		var denominator=(a+c)*(a+c)-(b+d)*(b+d);
		ret.re=((a*c-b*d)*(a+c)+(a*d+b*c)*(b+d))/denominator;
		ret.im=(-(a*c-b*d)*(b+d)+(a*d+b*c)*(a+c))/denominator;
		return ret;
	};
	this.parallelRepeat=function(t){
		var ret=this;
		for(var i=1;i<t;i++){
			ret=this.parallel(ret);
		}
		return ret;
	};
	this.toString=function(){
		return this.re.toString()+'+'+this.im.toString()+'j';
	};
};

function opPriority(op){
	switch(op){
	    case '(':
	        return 0;
	        break;
	    case '+':
	        return 1;
	        break;
	    case '/':
	        return 2;
	        break;
	    case '*':
	    	return 3;
	    	break;
	    case '^':
	    	return 4;
	    	break;
	}
}

function singleCompute(a,b,op){
	switch(op){
		case '+':
//			console.log('a+b a:'+a.toString()+"b:"+b.toString());
			return a.plus(b);
		break;
		case '/':
//			console.log('a//b a:'+a.toString()+"b:"+b.toString());
			return a.parallel(b);
		break;
		case '*':
//			console.log('a*b a:'+a.toString()+"b:"+b.toString());
			return a.mul(b);
		break;
		case '^':
//			console.log('a^b a:'+a.toString()+"b:"+b.toString());
			return a.parallelRepeat(b);
		break;
	}
}

function compute(expression){
	expression=expression.replace(/\/\//g,'/');
	expression='('+expression+')';
	var numStack=new Array();
	var opStack=new Array();
	var index=0;
	while(index<expression.length){
		if(expression[index]=='('){
			opStack.push('(');
			index++;
		}else if(expression[index]=='+'||expression[index]=='/'||expression[index]=='*'||expression[index]=='^'){//运算符号入栈
            if(opStack.length<1||opPriority(expression[index])>opPriority(opStack[opStack.length-1]))
                opStack.push(expression[index]);//直接入栈
            else{//把前面高优先级的式子算完再入栈
                do{
                    var v=numStack.pop();
                    v=singleCompute(numStack.pop(),v,opStack.pop());
                    numStack.push(v);
                }while(opStack.length<1||opPriority(expression[index])<=opPriority(opStack[opStack.length-1]));
                opStack.push(expression[index]);
            }
            index++;
        }else if(expression[index]==')'){
        	if(numStack.length==0){
        		return new Resistance('0');
        	}
        	else if(numStack.length==1){
        		return numStack.pop();
        	}
            do{//一直算直到得到左括号
                var v=numStack.pop();
                v=singleCompute(numStack.pop(),v,opStack.pop());
                numStack.push(v);
            }while(opStack[opStack.length-1]!='(');
            opStack.pop();
            index++;
        }else{
            var i=index;
            var charCode=expression.charCodeAt(i);
//          console.log(charCode);
            while(expression[i]=='.'||expression[i]=='j'||(charCode>=48&&charCode<=57)){
                i++;
                charCode=expression.charCodeAt(i);
            }
            var num=new Resistance(expression.substring(index,i));
//          console.log(num.toString());
            numStack.push(num);
            index=i;
        }
	}
	return numStack.pop();
}

function test(){
	alert(compute('(1+2j)*3'));
}
