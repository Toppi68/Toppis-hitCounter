var X = X || {};
X.style = {

	/*
	 * Add your own styles here 
	*/
	styles	: {
		'def-red.css'			: 'Dark-Red (default)',
		'silver.css'			: 'Silver',
		'light.css'				: 'Light'
	},
	
	/*
	 * No chagens from here else you know what u do :) 
	 */
	setStyle : function (filename){
		
		if(!filename){
			filename = 'def-red.css';
		}
		
		$('#counter-user-theme').remove();
		
		//Add
		var ts = (new Date().getTime()/1000);
		var style = $(document.createElement("link"));
		style.attr('id','counter-user-theme');
		style.attr('rel','stylesheet');
		style.attr('type','text/css');
		style.attr('href','style/'+filename+'?'+ts);
		$('head').append(style);
		
		return filename;

	},
	getStyleCombo : function (selectedId){
		var selected = selectedId ? selectedId : 0;
		var combo = $(document.createElement("select"));
		for (var i in this.styles){	
			var opt = $(document.createElement("option"));
  			opt.val(i);
  			opt.append(document.createTextNode(this.styles[i]));
  			if(String(selected) == String(opt.val())) {
  				opt.attr('selected',"selected");
  			}
			combo.append(opt);
		}
		return combo;
	}
}