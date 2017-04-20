$(document).ready(function () {
	$(window).on("load", function () {  //监听window的load事件
		imgLocation();
		//模拟网络加载图片
		var dataImg = { "data": [{ "src": "1.jpg" }, { "src": "2.jpg" }, { "src": "3.jpg" }, { "src": "4.jpg" }, { "src": "5.jpg" }, { "src": "11.jpg" }, { "src": "12.jpg" }, { "src": "13.jpg" }, { "src": "14.jpg" }, { "src": "15.jpg" }] };
		window.onscroll = function () {  //通过window监听鼠标滚动事件，鼠标滚动，事件自动加载
			if (scrollside()) {            //满足条件则加载图片
				$.each(dataImg.data, function (index, value) {  //each遍历循环
					var box = $("<div>").addClass("box").appendTo($("#container"));   //动态的创建类为box的div，追到到container中
					var content = $("<div>").addClass("content").appendTo(box);			//动态的创建类名为content的div，追加到box中
					$("<img>").attr("src", "images/" + $(value).attr("src")).appendTo(content);//动态的创建一个img，设置img属性，添加到content
				});
				imgLocation();       //遵循imgLocation()方法加载图片
			}
		};
		window.onresize = function () {      //监测浏览器窗口的变化，重新加载图片
			imgLocation();
		}
	});
});

//当鼠标到达最后一张图片的一半时，开始加载
function scrollside() {
	var box = $(".box");           //创建box对象
	//获取最后一张图片顶部到第一张图片顶部的高度，再加上最后一张图片的一半，取整
	var lastboxHeight = box.last().get(0).offsetTop + Math.floor(box.last().height() / 2);
	var documentHeight = $(document).width();   //获取当前容器的高度
	var scrollHeight = $(window).scrollTop();	//获取鼠标滚动的高度
	//做一个判断，lastboxHeight小于容器高度加上鼠标滚动高度，则允许滚动加载新图片，否则不允许
	return (lastboxHeight < scrollHeight + documentHeight) ? true : false;
}


function imgLocation() {
	var box = $(".box");           //创建box对象
	var boxWidth = box.eq(0).width();  //通过eq获取第一个图片的宽度（所有图片宽度一样）
	var num = Math.floor($(window).width() / boxWidth); //浏览器的宽度除以box的宽度，得到一行可以摆放的box个数，取整
	var boxArr = [];                              //获取一行中box的高度
	box.each(function (index, value) {                 //使用each循环遍历，index确定位置，value确定当前元素对象
		var boxHeight = box.eq(index).height();      //获取box的高度
		if (index < num) {							//做一个判断
			boxArr[index] = boxHeight;				//储存每一个box的高度放入数组
			$(value).css({                           //对样式进行重新设置，随着浏览器宽度变化，重新加载图片
				"position": "absolute",
				"top": 0,
				"left": boxWidth * index
			});
		} else {                                      //一行放满后，就开始设置寻找位置摆放而不是添加了
			var minboxHeight = Math.min.apply(null, boxArr);     //获取最小高度的box
			var minboxIndex = $.inArray(minboxHeight, boxArr);   //获取最小高度box的位置，第几行第几个的一个数组对象
			//通过最小高度图片css信息获取要插入的jQuery对象
			$(value).css({                       //通过css进行操作
				"position": "absolute",
				"top": minboxHeight,					//确定要插入图片的顶端距离，即最小图片的高度
				"left": box.eq(minboxIndex).position().left   //确定左边距离，即最小图片左边到左侧的距离
			});
			//第一张图片放入最小图片下方后，应该重新计算这2张图的高度，否则所有图片都放置在最小图片下方
			boxArr[minboxIndex] += box.eq(index).height();
		}
	});
}
