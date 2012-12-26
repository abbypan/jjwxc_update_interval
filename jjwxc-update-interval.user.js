// --------------------------------------------------------------------
//
// ==UserScript==
// @name          jjwxc-update-interval
// @namespace     http://abbypan.github.com/
// @description   绿晋江( http://www.jjwxc.net )作品中章节的更新间隔统计图
// @copyright     2009+, Abby Pan (http://abbypan.github.com/)
// @author        Abby Pan (abbypan@gmail.com)
// @version       0.4
// @homepage      http://abbypan.github.com/
// @include       http://www.jjwxc.net/onebook.php*
// @exclude       http://www.jjwxc.net/onebook.php*chapterid=*
// @grant         none
// ==/UserScript==
//
// --------------------------------------------------------------------

//找到图片插入点，就是搜索关键字的后面
var insert_path = "/html/body/table/tbody/tr/td/div[3]";

//进度
var process_path = "/html/body/table/tbody/tr/td[3]/div[2]/ul/li[4]";

//更新时间间隔
var update_time_path = "/html/body/table[2]/tbody/tr";

plot_update_time(insert_path, process_path,update_time_path);

function plot_update_time(insert_path, process_path){

	var link = document.evaluate(insert_path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null);
	link=link.singleNodeValue;

	//统计信息
	var update_time = extract_update_time(update_time_path);
	var result = calc_update_time_interval(update_time, process_path);

	//最长更新间隔
	var max_int = create_element_max_interval(result['max_interval']);
	link.parentNode.insertBefore(max_int,link.nextSibling);

	//最后一次更新距今
	var last_t = create_element_last_time_diff(result['last_time_diff']);
	link.parentNode.insertBefore(last_t,link.nextSibling);

	//创建一个画统计图按钮
	var pie_url=google_pie_url(result['type_stat']);
	var bar_url = google_bar_url(result);
	var btn_p = create_element_chart_btn(pie_url, bar_url);
	link.parentNode.insertBefore(btn_p,link.nextSibling);

	//显示或隐藏柱状图
	var check_bar = create_element_bar_btn();
	link.parentNode.insertBefore(check_bar,link.nextSibling);
	var bar = create_element_bar_chart(bar_url);
	link.parentNode.insertBefore(bar,link.nextSibling);


	//显示或隐藏饼图
	var check_pie = create_element_pie_btn();
	link.parentNode.insertBefore(check_pie,link.nextSibling);
	var pie = create_element_pie_chart(pie_url);
	link.parentNode.insertBefore(pie,link.nextSibling);

}

function create_element_last_time_diff(last_time_diff){
	var last_t_text = document.createTextNode('  最后一次更新距今：'+last_time_diff+'天');
	var last_t=document.createElement("p");
	last_t.setAttribute('id', 'last_time_diff');
	last_t.appendChild(last_t_text);
	return last_t;
}

function create_element_max_interval(max_interval) {
	var max_int_text = document.createTextNode('  最长更新间隔：'+max_interval+'天');
	var max_int=document.createElement("p");
	max_int.setAttribute('id', 'max_interval');
	max_int.appendChild(max_int_text);
	return max_int;
}

function create_element_chart_btn(pie_url,bar_url) {
	var	btn=document.createElement("input");
	btn.setAttribute('type','button');
	btn.setAttribute('id','btn_graph');
	btn.setAttribute('value','画章节更新时间间隔的柱状图及饼图');

	var btn_func = 'javascript:{'
		+		'var bar_div = document.getElementById("bar_graph_url"); var bar =document.createElement("img");bar.setAttribute("style","max-width:750px"); bar.setAttribute("id","time_bar_graph"); bar.setAttribute("src", "'+bar_url+'" ); bar_div.appendChild(bar); document.getElementById("check_bar_graph").setAttribute("style","display:visable;"); document.getElementById("check_bar_graph").setAttribute("style","display:visable;");bar.scrollIntoView(true);'
			+		'var pie_div = document.getElementById("pie_graph_url"); var pie =document.createElement("img");pie.setAttribute("style","max-width:750px"); pie.setAttribute("id","time_pie_graph"); pie.setAttribute("src", "'+pie_url+'" ); pie_div.appendChild(pie); document.getElementById("check_bar_graph").setAttribute("style","display:visable;"); document.getElementById("check_pie_graph").setAttribute("style","display:visable;");pie.scrollIntoView(true);'
			+			'this.parentNode.removeChild(this);};';
	btn.setAttribute('onclick',btn_func);

	var btn_p=document.createElement("p");
	btn_p.appendChild(btn);
	return btn_p;
}

function create_element_bar_btn() {
	var check_bar=document.createElement("input");
	check_bar.setAttribute('type','button');
	check_bar.setAttribute('style','display:none');
	check_bar.setAttribute('id','check_bar_graph');
	check_bar.setAttribute('value','隐藏柱状图');
	check_bar.setAttribute('onclick','javascript:{ var  bar = document.getElementById("bar_graph"); var style = bar.getAttribute("style");if(style.match(/none/)){ bar.setAttribute("style","display:block !important;"); this.setAttribute("value","隐藏柱状图");bar.scrollIntoView(true);}else{ bar.setAttribute("style","display:none !important;"); this.setAttribute("value","显示柱状图");document.all.last_time_diff.scrollIntoView(true);} }');
	return check_bar;
}

function create_element_bar_chart(bar_url) {
	var bar =document.createElement("div");
	bar.setAttribute('id','bar_graph');
	bar.setAttribute("style","display:block !important;"); 
	var bar_a =document.createElement("a");
	bar_a.setAttribute('id','bar_graph_url');
	bar_a.setAttribute('href',bar_url);
	bar.appendChild(bar_a);
	return bar;
}

function create_element_pie_btn() {
	var check_pie=document.createElement("input");
	check_pie.setAttribute('type','button');
	check_pie.setAttribute('style','display:none');
	check_pie.setAttribute('id','check_pie_graph');
	check_pie.setAttribute('value','隐藏饼图');
	check_pie.setAttribute('onclick','javascript:{ var  pie = document.getElementById("pie_graph"); var style = pie.getAttribute("style");if(style.match(/none/)){ pie.setAttribute("style","display:block !important;"); this.setAttribute("value","隐藏饼图");pie.scrollIntoView(true);}else{ pie.setAttribute("style","display:none !important;"); this.setAttribute("value","显示饼图");document.all.last_time_diff.scrollIntoView(true);} }');
	return check_pie;
}

function create_element_pie_chart(pie_url) {
	var pie =document.createElement("div");
	pie.setAttribute('id','pie_graph');
	pie.setAttribute("style","display:block !important;"); 
	var pie_a =document.createElement("a");
	pie_a.setAttribute('id','pie_graph_url');
	pie_a.setAttribute('href',pie_url);
	pie.appendChild(pie_a);
	return pie;
}

function google_bar_url(r)
{
	var cht = 'bvg';
	var chs= '750x300';
	var chdl = r['indexs'].join('|');
	var chd = 't:' + r['intervals'].join(',');
	var chco = r['colors'].join('|');
	var chds=r['max_interval'];
	var title = encodeURI("章节更新间隔柱状图");

	var bar_url='http://chart.apis.google.com/chart?'
		+ 'cht=' + cht
		+ '&chs=' + chs
		+ '&chds=0,' + chds 
		+ '&chxt=x'
		+ '&chxl=0:|' + chdl
		+ '&chd=' + chd
		+ '&chco=' + chco 
		+ '&chtt=' + title
		+ '&chbh=r,.7'
		+'&chm=N,FF0000,-1,,12'
		;
	return bar_url;
}

function google_pie_url(r){
	var x_data=[];
	var y_data=[];
	var label_data=[];
	var color_data=[];
	for(var k in r){
		var n = r[k];
		if(n==undefined) continue;
		var t=encodeURI(k);
		label_data.push(t);
		x_data.push(t+" : "+n);
		y_data.push(n);
		var c = specify_type_color(k);
		color_data.push(c);
	}
	if(x_data.length === 0) return "";
	var label = label_data.join('%7C');
	var x = x_data.join('%7C');
	var y = y_data.join(',');
	var chco = color_data.join(',');
	var title = encodeURI("章节更新间隔饼图");
	var pie_url='http://chart.apis.google.com/chart?chd=t:' + y
		+ '&cht=p3&chtt='+title
		+'&chl=' + x +'&chdl='+label
		+'&chdlp=b&chts=000000,18&chs=750x300&chco='+chco; 
	return pie_url;
}

function calc_update_time_interval(update_time, process_path){
	//计算更新间隔
	var max_interval=0;
	var intervals = [];
	var indexs = [];
	var types = [];
	var colors = [];
	var type_stat = {};

	var today = new Date();
	var last_time_diff = calc_date_interval(update_time[update_time.length-1], today);
	var temp = update_time.slice(0);
	var flag= get_process_flag(process_path);
	if(flag==1) temp.push(today);
	for (var i = 1; i < temp.length; i++) {
		var diff = calc_date_interval(temp[i-1], temp[i]);

		if(diff === null)  continue;
		if(diff > max_interval) max_interval =diff;

		indexs.push(i);
		intervals.push(diff);
		var type = check_update_type(diff);
		types.push(type);
		if(type_stat[type] == undefined){
			type_stat[type]=1;
		}else{
			type_stat[type]++;
		}
		var color = specify_type_color(type);
		colors.push(color);
	}

	return {
		'indexs' : indexs, 
			'intervals' : intervals, 
			'types' : types, 
			'colors' : colors, 
			'type_stat' : type_stat, 
			'max_interval' : max_interval,
			'last_time_diff' : last_time_diff
	};
}

function get_process_flag(process_path) {
	var li = document.evaluate(process_path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
	var flag=1; 
	if(li.snapshotLength > 0){
		var pro = li.snapshotItem(0);
		var process = pro.textContent||pro.innerText || "";
		if(process.match(/完成/))  flag = 0;
	}

	return flag;
}

function check_update_type(intervals) {
	if( intervals<0 ) return '错误';
	if( intervals<4 ) return '日更';
	if( intervals<8 ) return '周更';
	if( intervals<16 ) return '半月更';
	if( intervals<32 ) return '月更';
	if( intervals<94 ) return '季更';
	if( intervals<184 ) return '半年更';
	if( intervals<366 ) return '年更';
	if( intervals<732 ) return '太阳黑子活动周期更';
	return '冰川周期更';
}

function specify_type_color(type) {
	if(type == '错误') return 'ffffff';	
	if(type == '日更') return 'ef1c21';
	if(type == '周更') return 'f76521';
	if(type == '半月更') return 'ffe3c6';
	if(type == '月更') return 'fff300';
	if(type == '季更') return '00aa9c';
	if(type == '半年更') return '0071bd';
	if(type == '年更') return '21459c';
	if(type == '太阳黑子活动周期更') return 'ff0ff0';
	return '000000';
}

function extract_update_time(update_time_path){
	//取出更新时间序列，并排序
	var timeTrs = document.evaluate(update_time_path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
	var pattern = /(\d+-\d+-\d+)/;
	var chap_times = [];
	for (var i = 1; i < timeTrs.snapshotLength; i++) {
		var timeTr = timeTrs.snapshotItem(i);
		var timeTd = timeTr.lastChild.previousSibling;
		var ts = pattern.exec(timeTd.innerHTML);
		if(!ts) continue;
		var t = ts[0].replace(/-/g,'/');
		chap_times.push(t);
	}

	var chap_sorted = chap_times.sort();
	for (i = 0; i <chap_sorted.length; i++) {
		chap_sorted[i] = new Date(chap_sorted[i]);
	}

	return chap_sorted; 
}

function calc_date_interval(date_a, date_b){
	if(!date_a ||  !date_b) return null;
	var ms_a = date_a.getTime();
	var ms_b = date_b.getTime();
	var ms_diff = ms_b - ms_a;
	var interval =  Math.round((((ms_diff / 1000 ) / 60 ) / 60) / 24);
	return  interval;
}
