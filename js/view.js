function autoResize(){
	var width=$('.digitButton').eq(0).width();
	console.log(width);
	var height=width.toString()+"px";
	$(".digitButton").css("height",height);
	$(".equalButton").css("height",height);
	$(".opButton").css("height",height);
	$(".delButton").css("height",height);
	$(".clrButton").css("height",height);
}

var computeHis='';
var presInput='';
var prevRes=null;
function init(){
	$(".digitButton").click(function(){
		input($(this).eq(0).text());
	});
	$(".opButton").click(function(){
		input($(this).eq(0).text());
	});
	$(".delButton").click(function(){
		presInput=presInput.substr(0,presInput.length-1);
		updateOutput();
	});
	$(".clrButton").click(function(){
		prevRes=null;
	});
	$(".equalButton").click(function(){
		if(presInput.length==0)
		 return;
		var res=compute(presInput);
		computeHis+='\n'+presInput+'\n'+res.toString();
		presInput='';
		prevRes=res;
		updateOutput();
	});
}

function input(btnType){
//	console.log(btnType);
	if(prevRes!=null){
		presInput='('+prevRes.toString()+')';
		prevRes=null;
	}
	presInput+=btnType;
	updateOutput();
}

function updateOutput(){
	$(".outputBox").text(computeHis+'\n'+presInput);

	var scrollHeight = $('.outputBox').prop("scrollHeight");
	$('.outputBox').scrollTop(scrollHeight,500);

}
