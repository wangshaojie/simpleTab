//数据
var objData ;
var newData = JSON.parse(localStorage.getItem('data'))
if(newData){
	objData = newData;
}else{
	objData = [
		{
			text:'&#8677;',
			url:'',
		},
		{
			text:'Q',
			url:'https://www.google.com',
		},
		{
			text:'W',
			url:'https://www.baidu.com',
		},
		{
			text:'E',
			url:'http://www.qq.com',
		},
		{
			text:'R',
			url:'',
		},
		{
			text:'T',
			url:'',
		},
		{
			text:'Y',
			url:'',
		},
		{
			text:'U',
			url:'',
		},
		{
			text:'I',
			url:'',
		},
		{
			text:'O',
			url:'',
		},
		{
			text:'P',
			url:'',
		},
		{
			text:'[',
			url:'',
		},
		{
			text:']',
			url:'',
		},
		{
			text:'&#8592;',
			url:'',
		},
		//dierhang
		{
			text:'&#8682;',
			url:'',
		},
		{
			text:'A',
			url:'',
		},
		{
			text:'S',
			url:'',
		},
		{
			text:'D',
			url:'',
		},
		{
			text:'F',
			url:'',
		},
		{
			text:'G',
			url:'',
		},
		{
			text:'H',
			url:'',
		},
		{
			text:'J',
			url:'',
		},
		{
			text:'K',
			url:'',
		},
		{
			text:'L',
			url:'',
		},
		{
			text:';',
			url:'',
		},

		{
			text:'\'',
			url:'',
		},
		{
			text:'\\',
			url:'',
		},

		{
			text:'&#8617;',
			url:'',
		},
		//disanhang
		{
			text:'&#8679',
			url:'',
		},
		{
			text:'~',
			url:'',
		},
		{
			text:'Z',
			url:'',
		},

		{
			text:'X',
			url:'',
		},
			{
			text:'C',
			url:'',
		},

		{
			text:'V',
			url:'',
		},
		{
			text:'B',
			url:'',
		},

		{
			text:'N',
			url:'',
		},
		{
			text:'M',
			url:'',
		},
		{
			text:',',
			url:'',
		},
		{
			text:'.',
			url:'',
		},

		{
			text:'/',
			url:'',
		},
		{
			text:'&#8679',
			url:'',
		},
	];
}

localStorage.setItem('data',JSON.stringify(objData));

//点击事件
var main = document.querySelector(".main");
main.addEventListener("click", function(event){
	var target = event.target;
	if(target.nodeName == "I"){
		var num = event.target.parentNode.getAttribute("data-index");
		Dialog.setup("请输入网址：",{
			inputType: 'text', 
		 	inputPlaceholder:objData[num].url , 
		 	//inputValue: 'default value'
		},
		function(value){
			objData[num].url = value;
			localStorage.setItem('data',JSON.stringify(objData));
			location.reload();
  		},
  		function(){
  			//alert('cancel callback')
  			return ;
  		})
	}else if(target.nodeName == "DIV" ){
		var num = event.target.getAttribute("data-index");
		console.log(num);
		if(objData[num].url){
			window.open(objData[num].url)
		}
	}
});



var html = "";
for(var i = 0;i < objData.length;i++){
	html = ""
	if(i == 0 || i == 13 || i == 14 || i == 27 || i == 28 || i == 40 
		|| i == 11 || i == 12 || i == 24 || i == 25 || i == 26 || i == 37 || i == 38 || i == 39 || i == 29){
		html += '<div class="button pip textPip item_list blue" data-index='+i+'>';
	}else{
		html += '<div class="button pip textPip item_list" data-index='+i+'>';
		html += '<i class="fa fa-pencil-square-o icon-edit" aria-hidden="true"></i>';
	}
	
	html += '<span>'+objData[i].text+'</span>';
	if(objData[i].url){
		html += '<img src="'+objData[i].url+'/favicon.ico" class="img-log"/>';
	}
	html += '</div>';
	document.getElementById("myList").insertAdjacentHTML('beforeEnd',html);
}


 /*
	template render
 */

var tmpl = '<li>'
				+ '<a href="">' 
				+ '<span class="level-name"></span>'
				+ '</a>'
				+ '<div>'
				+ '<ul>'
				+ '</ul>'
				+ '</div>'
			'</li>'

var buildTree = function(nodeList, $ul){
	for(var i = 0; i < nodeList.length; i++){
		var node = nodeList[i];
		var nodeName = node.title;
		var nodeId = node.id;
		var pid = node.parentId;
		var url = node.url;
		var children = node.children;
		var $li = $(tmpl);
		//console.log(url)
		if(url == undefined){
			url = "javascript:;";
		}
		$li.find(".level-name").text(nodeName);
		$li.find("a").attr("data-id",nodeId);
		$li.find("a").attr("href",url);
		$li.appendTo($ul);

		if(children && children.length>0){
            var $subUl = $li.children("div").children("ul");
            $li.find("a").append("<span class='caret'></span>");
            buildTree(children,$subUl);
       	}
	}
};
 /*
 	get bookmark
 */

 chrome.bookmarks.getTree(function(arrar){
 	var data = arrar[0].children[0].children;
 	//console.log(data)
 	buildTree(data, $(".mcd-menu"));
 });


/*
	搜索
*/
var btnSearch = document.querySelector(".btngroup");
btnSearch.addEventListener("click", function(event){
	var target = event.target;
	var type = target.getAttribute("data-type");
	var x = document.querySelector(".searchTerm").value;
	console.log(type)
	if(type == 1){
		window.open("http://www.baidu.com/s?wd=" + x)
	}else if(type == 2){
		window.open("http://www.google.com/search?q=" + x)
	}else if(type == 3){
		window.open("https://cn.bing.com/search?q=" + x)
	}
	
})