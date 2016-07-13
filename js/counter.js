/**
* Projekt: noHit noDeath counter
* @author Toppi
* @version 1.00
*/
var X = X || {};
X.userData = function () {
	
	this.idxCurRun	= 0;
	this.isoLang	= 'EN';
	this.runs		= [];	
	
	var _objRun  = function () {
		
		this.idx		= 0;
		this.title 		= X.lang.get('newUntitledRun');
		this.splits		= [];
		this.curSplit 	= 0;
		this.style		= 'def-dark.css';
		this.curModRow	= 0;
		this.ts			= 0;
		this.totals		= {
			'currHits'	: 0,
			'pb'		: 0,
			'diff'		: 0
		};
		this.toArray = function () {
			var splits = [];
			for(var i=0; i<this.splits.length;i++){
				splits.push(this.splits[i].toArray());
			}
			return {
				idx			: this.idx,
				title 		: this.title,
				style		: this.style,
				splits		: splits,
				curSplit	: this.curSplit			
			};
		};
		this.setTitle = function (title){
			if(typeof(title) == 'string'){
				this.title = title;
				this.countTotals();
			}
		};
		this.setStyle = function (style){
			this.style = X.style.setStyle(style);
		};
		this.setCurrSplit = function (idx){
			if(!isNaN(idx)) {
				this.curSplit = idx;
				this.countTotals();
			}
		};
		this.addHit = function (){
			this.getCurrentSplit().addHit();
			this.countTotals();
		};
		this.remHit = function (){
			this.getCurrentSplit().remHit();
			this.countTotals();
		};
		this.getSplit = function (idx){
			if(isNaN(idx)){
				return 	this.splits;
			} else {
				return this.splits[idx] ? this.splits[idx] : new _objSplit();
			}
		};
		this.getCurrentSplit = function () {
			return this.getSplit(this.curSplit);
		};	
		this.addSplit = function (idx){
			var split = new _objSplit();
			if(isNaN(idx) || idx < 0 || idx > this.splits.length){
				idx = this.splits.length;
			}
			X.insertArrayValues(this.splits,idx,split);
			this.countTotals();
			return split;
		};
		this.updateSplit = function (otps) {
			if(typeof(otps.idx) == 'undefined'){
				return;
			}
			if(this.splits[otps.idx]){
				this.splits[otps.idx].set(otps);
				this.countTotals();
			}
		};
		this.delSplit = function (idx) {
			if(!isNaN(idx)){
				var tmp = [];
				for(var i=0; i<this.splits.length;i++){
					if(i != idx){
						tmp.push(this.splits[i]);
					}
				}
				this.splits = tmp;
				this.countTotals();
			}
		};
		this.nextSplit = function () {
			var setPB = false;
			var split = this.getCurrentSplit();
			split.calc();
			split.stopCountPB();			
			if(this.curSplit+1 >= this.splits.length){
				if(this.totals.diff < 0){
					if(confirm(X.lang.get('resetPB'))){
						setPB = true;
					}
				}
				if(setPB){
					this.resetRun(true);
				} else {
					this.resetRun();
				}	
			} else {
				this.curSplit++;
			}
			this.countTotals();
		};
		this.resetRun = function (runCompleted) {
			this.curSplit = 0;
			this.totals.diff = this.totals.pb = this.totals.currHits = 0;
			for(var i=0; i<this.splits.length;i++){
				this.splits[i].reset(runCompleted);
				this.totals.pb+= this.splits[i].pb;
			}
			this.ts	= new Date().getTime();
		};
		this.getTotals = function () {
			return {
				diff 		: this.totals.diff > 0 ? '+'+this.totals.diff : this.totals.diff,
				pb			: this.totals.pb,
				currHits 	: this.totals.currHits
			};
		};
		this.countTotals = function () {
			this.totals.diff = this.totals.pb = this.totals.currHits = 0;
			for(var i=0; i<this.splits.length;i++){
				var split = this.splits[i];
				split.rowNum = (i+1);
				this.totals.diff+=split.diff;
				this.totals.pb+=split.pb;
				this.totals.currHits+=split.curHits;
			}
			this.ts	= new Date().getTime();
		};
	};
	
	var _objSplit = function () {
		
		this.idx		= null;
		this.rowNum		= 0;
		this.name		= '';
		this.curHits	= 0;
		this.pb			= 0;
		this.countPB	= true;
		this.diff		= 0;
		
		this.stopCountPB = function (){
			this.countPB = false;
		};
		this.addHit = function () {
			if(this.countPB){
				this.pb++;
			}
			this.curHits++;
			this.calc();			
		};
		this.remHit = function () {
			if(this.curHits == 0){
				return;
			}
			if(this.countPB && this.countPB > 0){
				this.pb--;
			}
			this.curHits--;
			this.calc();	
		};
		this.getDiff = function () {
			if(this.diff > 0){
				return '+'+this.diff;
			} else {
				return this.diff;
			}
		};
		this.reset = function (runCompleted) {
			if(runCompleted && this.curHits < this.pb){
				//New PB after run Completed
				this.pb = this.curHits;	
			}
			this.curHits = 0;
			this.calc();
		}
		this.calc = function () {
			this.diff = this.curHits - this.pb;
		}
		this.toArray = function () {
			return {
				idx			: this.idx,
				name		: this.name,
				curHits		: this.curHits,
				pb			: this.pb,
				countPB		: this.countPB
			};
		};
		this.set = function (arrOpts){
			if(typeof(arrOpts) != 'object'){
				return;
			}
			for(var i in arrOpts) {
				switch(i){
					case 'idx':
						this.idx = !isNaN(arrOpts.idx) ? parseInt(arrOpts.idx) : null;
					break;
					case 'name':
						this.name = arrOpts.name ? arrOpts.name : '';
					break;
					case 'curHits':
						this.curHits = !isNaN(arrOpts.curHits) ? parseInt(arrOpts.curHits) : 0;
					break;
					case 'pb':
						this.pb = !isNaN(arrOpts.pb) && arrOpts.pb >=0 ? parseInt(arrOpts.pb) : 0;
					break;
					case 'countPB':
						this.countPB = arrOpts.countPB ? true : false;
					break;
				}	
			}
			this.calc();
		};
	};
	this.getRun = function (idx) {	
		var idx = !isNaN(idx) ? idx : this.idxCurRun;
		this.idxCurRun = idx;
		return this.runs[idx];
	};
	this.newRun = function () {
		this.runs.push(new _objRun());
		this.idxCurRun = this.runs.length-1;
		this.runs[this.idxCurRun].idx = this.idxCurRun;
		return this.runs[this.idxCurRun];
	};
	this.delRun = function (idx) {
		var idx = !isNaN(idx) ? idx : this.idxCurRun;
		var tmp = [];
		for(var i=0; i<this.runs.length;i++){
			if(i != idx){
				tmp.push(this.runs[i]);
			} else {
				this.idxCurRun = i>0 ? i-1 : 0;
			}
		}
		this.runs = tmp;
		if(!this.runs.length){
			this.newRun();
			this.idxCurRun = 0;
		}
		return this.runs[this.idxCurRun];
	};
	this.selectRun = function (idx){
		if(isNaN(idx) || !this.runs[idx]){
			return;
		} 
		this.idxCurRun = idx;		
	}
	this.setLang = function (iso) {
		var iso = X.lang.setIso(iso);
		if(iso){
			this.isoLang = iso;
		}
	};
	this.toArray = function () {
		var ret = {
			idxCurRun	: this.idxCurRun,
			isoLang		: this.isoLang,
			runs		: []	
		};		
		for (var i=0; i< this.runs.length;i++){
			ret.runs.push(this.runs[i].toArray());	
		}
		return ret;
	}
	this.getRunCombo = function (selectedId) {
		var selected = selectedId ? selectedId : 0;
		var combo = $(document.createElement("select"));
		for (var i=0; i< this.runs.length;i++){			
			var opt = $(document.createElement("option"));
  			opt.val(i);
  			opt.append(document.createTextNode(this.runs[i].title));
  			if(String(selected) == String(opt.val())) {
  				opt.attr('selected',"selected");
  			}
			combo.append(opt);
		}
		return combo;
	},
	this.save = function () {		
		if(typeof(X.counter.onSave) == 'function'){
			X.counter.onSave( this.toArray() );
		} 		
		if (typeof(localStorage) == "undefined") {
			console.log('Your Browser doesnt support local saves (localStorage)');
			return;
		}	
		localStorage.setItem("_userData", JSON.stringify( this.toArray() ) );		
	};
	this.loadFromLocalStorage = function () {
		if (typeof(localStorage) == "undefined") {
			return;
		}
		var data = localStorage.getItem("_userData");
		if(!data){
			//Very first programstart
			this.newRun();
		} else {
			this.setArrUdata(X.parseJson(data));
		}			
	};
	this.setArrUdata = function (arrUdata) {
		if(!arrUdata || ! typeof(arrUdata.idxCurRun) == 'undefined'){
			//Very first programstart
			this.newRun();
			return;
		}
		this.idxCurRun 	= arrUdata.idxCurRun;
		this.isoLang	= arrUdata.isoLang;
		
		for(var i=0; i < arrUdata.runs.length; i++){
			var tmp = arrUdata.runs[i];
			var run = this.newRun();
			run.setTitle(tmp.title);
			run.setStyle(tmp.style);
			run.setCurrSplit(tmp.curSplit);
			for(var x=0; x< tmp.splits.length; x++){
				var split = tmp.splits[x];
				run.addSplit(split.idx).set(split);	
			}
		}
	};
};

X.counter = {
	
	settings : {
		cells		: 5,
	},
	
	uData	: {}, //All user-runs
	curRun	: {}, //Shortcut current run
	
	init : function (objUdata) {
		if(objUdata){
			this.uData = objUdata;
		} else {
			this.uData = new X.userData();
			this.uData.loadFromLocalStorage();	
		}		
		this.curRun = this.uData.getRun();	
		this.setGui();
	},
	setGui : function () {

		//Add Base-Style
		if(!$('#counter-base-style').length){
			var style = $(document.createElement("link"));
			style.attr('id','counter-base-style');
			style.attr('rel','stylesheet');
			style.attr('type','text/css');
			style.attr('href','style/base.css');
			$('head').append(style);			
		}

		//User Style
		X.style.setStyle(this.curRun.style);
		
		//Wait for DOM after style got added
		var timer = setTimeout(function(){		
			
			clearTimeout(timer);
			
			var counter = $('#counter');
			
			if(!counter.length){
				console.log('No target-id "counter" in doc found.');
			}
			
			counter.html('');
			counter.addClass('counter');
						
			var lDiv = $(document.createElement('div'));
			lDiv.attr('class', 'sp50');
			counter.append(lDiv);
			
			var rDiv = $(document.createElement('div'));
			rDiv.attr('class', 'sp50');
			counter.append(rDiv);
					
			var p = $(document.createElement('p'));
			p.attr('class','clear');
			counter.append(p);
					
			var div = $(document.createElement('div'));
			div.attr('id', 'live');
			div.attr('class', 'live');
			lDiv.append(div);
			
			var div = $(document.createElement('div'));
			div.attr('id', 'mod');
			div.attr('class', 'mod');
			rDiv.append(div);
						
			var div = $(document.createElement('div'));
			div.attr('id', 'ctl');
			div.attr('class', 'ctl');
			rDiv.append(div);;
			
			X.counter.drawMod();
			X.counter.drawLive();
			X.counter.addControls();

		},100);
	},
	drawLive : function () {
				
		var mainDiv = $('#live');
		mainDiv.html('');
		
		//Main-Title
		var h1 = $(document.createElement('h1'));
		h1.attr('id', 'live-title');
		h1.attr('class', 'live-title');
		h1.html(this.curRun.title.replace(/\n/g,'<br>'));
		mainDiv.append(h1);
		
		//Split Headlines
		var div = $(document.createElement('div'));
		div.attr('class', 'live-headline-row');
		mainDiv.append(div);
				
		for (var i = 0; i < this.settings.cells ; i++){
			
			var h2 = $(document.createElement('h2'));
			div.append(h2);
						
			var val = '&nbsp;';
			switch(i){	
				case 0:
					h2.html(X.lang.get('number'));
					h2.attr('class', 'live-headline-cell-number');
					break;
				case 1:
					h2.html(X.lang.get('split'));
					h2.attr('class', 'live-headline-cell-split');
					break;
				case 2:
					h2.html(X.lang.get('now'));
					h2.attr('class', 'live-headline-cell-now');
					break;
				case 3:
					h2.html(X.lang.get('diff'));
					h2.attr('class', 'live-headline-cell-diff');
					break;
				case 4:
					h2.html(X.lang.get('pb'));
					h2.attr('class', 'live-headline-cell-pb');
					break;
				default:			
					continue;
			}
		}
		var p = $(document.createElement('p'));
		p.attr('class', 'clear');
		div.append(p);

		//Split Rows
		for (var i = 0; i < this.curRun.splits.length ; i++){
					
			var split = this.curRun.getSplit(i);
			
			var div = $(document.createElement('div'));
			div.attr('class', 'live-split-row');
			mainDiv.append(div);
			
			if(this.curRun.curSplit > i){
				div.addClass('live-split-done');
				if(split.diff < 0){
					div.addClass('live-split-newPB');
				} else if(split.diff > 0){
					div.addClass('live-split-bad');
				}
			} else if(this.curRun.curSplit == i) {
				div.addClass('live-split-active');
			}

			for (var x = 0; x < this.settings.cells ; x++){
				var val = '&nbsp;';
				var p = $(document.createElement('p'));
				switch(x){			
					case 0:
						val = split.rowNum;
						p.attr('class', 'live-split-cell-number');
						break;
					case 1:
						val = split.name || '&nbsp;';
						p.attr('class', 'live-split-cell-split');
						break;
					case 2:
						val = split.curHits;
						p.attr('class', 'live-split-cell-now');
						break;
					case 3:
						val = split.getDiff();
						p.attr('class', 'live-split-cell-diff');
						break;
					case 4:
						val = split.pb;
						p.attr('class', 'live-split-cell-pb');
						break;
					default:			
						continue;
				}
				p.html(val);
				div.append(p);
			}
			var p = $(document.createElement('p'));
			p.attr('class', 'clear');
			div.append(p);
		}
		/*
		 * Totals
		 */
		
		var totals = this.curRun.getTotals();
		
		var div = $(document.createElement('div'));
		div.attr('class', 'live-totals-row');
		mainDiv.append(div);
		
		if(totals.diff < 0){
			div.addClass('live-split-newPB');
		} else if(totals.diff > 0){
			div.addClass('live-split-bad');
		}
		
		var p = $(document.createElement('p'));
		p.attr('class', 'live-headline-cell-number');
		p.html('&nbsp;');
		div.append(p);
		
		
		var p = $(document.createElement('p'));
		p.attr('class', 'live-headline-cell-split');
		p.html(X.lang.get('totals'));
		div.append(p);
		
		var p = $(document.createElement('p'));
		p.attr('class', 'live-headline-cell-now');
		p.html(totals.currHits);
		div.append(p);
		
		var p = $(document.createElement('p'));
		p.attr('class', 'live-headline-cell-diff');
		p.html(totals.diff);
		div.append(p);
		
		var p = $(document.createElement('p'));
		p.attr('class', 'live-headline-cell-pb');
		p.html(totals.pb);
		div.append(p);
		
		var p = $(document.createElement('p'));
		p.attr('class', 'clear');
		div.append(p);		
		
		
	},
	drawMod : function () {
		
		var mainDiv = $('#mod');
		mainDiv.html('');		
		
		var form = $(document.createElement('form'));
		form.on('change', function () {
			X.counter.setDirty(1);
		});
		mainDiv.append(form);
		
		var cont = $(document.createElement('div'));
		cont.attr('class', 'mod-container mod-selectLang');
		form.append(cont);		

		/**
		 * Select Language and Style
		 */	

		var div = $(document.createElement('div'));
		div.attr('class', 'sp50');
		cont.append(div);
			
		//Style
		var p = $(document.createElement('p'));
		p.attr('class', 'smaLabel');
		p.html(X.lang.get('selStyle'));
		div.append(p);
				
		//ComboBox Style
		var combo = X.style.getStyleCombo(this.curRun.style);
		combo.attr('class','mod-combo-select-style');
		combo.on('change',function () {
			X.counter.curRun.style = $(this).val();			
			X.counter.setGui();
		});
		div.append(combo);			
		
		//Language
		var div = $(document.createElement('div'));
		div.attr('class', 'sp50');
		cont.append(div);			
			
		var p = $(document.createElement('p'));
		p.attr('class', 'smaLabel');
		p.html(X.lang.get('selLang'));
		div.append(p);
				
		//ComboBox Language
		var combo = X.lang.getLangCombo(this.uData.isoLang);
		combo.attr('class','mod-combo-select-lang');
		combo.on('change',function () {
			X.counter.uData.setLang($(this).val());			
			X.counter.setGui();
		});
		div.append(combo);
		
		var p = $(document.createElement('p'));
		p.attr('class', 'clear');
		div.append(p);
		
		
		/**
		 * Select Run
		 */			

		var div = $(document.createElement('div'));
		div.attr('class', 'mod-container mod-selectRun');
		cont.append(div);
				
		var p = $(document.createElement('p'));
		p.attr('class', 'smaLabel');
		p.html(X.lang.get('selRun'));
		div.append(p);
				
		//ComboBox MyRuns
		var combo = this.uData.getRunCombo(this.uData.idxCurRun);
		combo.attr('class','mod-combo-select-run');
		combo.on('change',function () {
			X.counter.curRun = X.counter.uData.getRun($(this).val());			
			X.counter.setGui();
		});
		div.append(combo);		
		
		var p = $(document.createElement('p'));
		p.attr('class', 'clear');
		cont.append(p);	
		
		
		/**
		 * AddHit - RemoveHit Next Split 
		 */
		var cont = $(document.createElement('div'));
		cont.attr('class', 'mod-container mod-runInterface');
		form.append(cont);

		var div = $(document.createElement('div'));
		div.attr('class', 'mod-btn mod-btn-addHit');
		var span = $(document.createElement('span'));
		span.html(X.lang.get('addHit'));
		div.append(span);
		div.on('click',function () {
			X.counter.curRun.addHit();
			X.counter.drawLive();
		});
		cont.append(div);		

		var div = $(document.createElement('div'));
		div.attr('class', 'mod-btn mod-btn-remHit');
		var span = $(document.createElement('span'));
		span.html(X.lang.get('remHit'));
		div.append(span);
		div.on('click',function () {
			X.counter.curRun.remHit();
			X.counter.drawLive();		
		});
		cont.append(div);
		
		var div = $(document.createElement('div'));
		div.attr('class', 'mod-btn mod-btn-nextSplit');
		var span = $(document.createElement('span'));
		span.html(X.lang.get('nextSplit'));
		div.append(span);
		div.on('click',function () {
			
			var split 		= X.counter.curRun.getCurrentSplit();
			var splitCount 	= X.counter.curRun.splits.length;
			var mySpan 		= $(this).find('span');
			
			X.counter.curRun.nextSplit();
			
			X.counter.uData.save();
			
			if(split.rowNum == splitCount-1){
				//Last Split -> Change button to 'Finish run'
				mySpan.html(X.lang.get('finRun'));
				$(this).addClass('glow');
			} else if(split.rowNum >= splitCount) {
				//Run regulare done -> Draw Mod-Gui for new PBs
				$(this).removeClass('glow');
				mySpan.html(X.lang.get('nextSplit'));
				X.counter.drawMod();
			}
			X.counter.drawLive();		
		});
		cont.append(div);
		
		var div = $(document.createElement('div'));
		div.attr('class', 'mod-btn mod-btn-reRun');
		var span = $(document.createElement('span'));
		span.html(X.lang.get('reRun'));
		div.append(span);
		div.on('click',function () {
			if(!confirm(X.lang.get('rusure'))){
				return;
			}
			X.counter.curRun.resetRun();
			X.counter.uData.save();
			X.counter.drawLive();		
		});
		cont.append(div);
		
		var p = $(document.createElement('p'));
		p.attr('class', 'clear');
		cont.append(p);

		/**
		 * Edit - Admin Splits
		 */
		var cont = $(document.createElement('div'));
		cont.attr('class', 'mod-container');
		form.append(cont);
		
		//Main Headline - Title
		var p = $(document.createElement('p'));
		p.attr('class', 'smaLabel');
		p.html(X.lang.get('title'));
		cont.append(p);
		
		//Title
		var input = $(document.createElement('textarea'));
		input.attr('class', 'mod-input-title');
		input.attr('placeholder',X.lang.get('title'));
		input.val(this.curRun.title);
		input.on('blur',function(){
			X.counter.curRun.setTitle($(this).val());
			$('.mod-combo-select-run option:selected').text($(this).val());			
		});
		cont.append(input);
		
		//Split-Headlines
		var div = $(document.createElement('div'));
		div.attr('class', 'mod-row-headline');
		cont.append(div);
		
		var h2 = $(document.createElement('h2'));
		h2.attr('class','sp80');
		h2.html(X.lang.get('split'));
		div.append(h2);
		
		var h2 = $(document.createElement('h2'));
		h2.attr('class','sp20');
		h2.html(X.lang.get('pb'));
		div.append(h2);
		
		var p = $(document.createElement('p'));
		p.attr('class', 'clear');
		div.append(p); 

		var splitDiv = $(document.createElement('div'));
		splitDiv.attr('class', 'mod-container-splits');
		cont.append(splitDiv);

		//Split-Rows Input Data	
		for (var i = 0; i < this.curRun.splits.length ; i++){
					
			var split = this.curRun.getSplit(i);
			
			var div = $(document.createElement('div'));
			div.attr('class', 'mod-split-row');
			div.data('idx', i);
			splitDiv.append(div);
				
			div.on('click',function(){
				if($(this).hasClass('mod-row-active')){
					return;
				} 
				$('.mod-row-active').removeClass('mod-row-active');
				$(this).addClass('mod-row-active');
				X.counter.curRun.curModRow = $(this).data('idx');
			});
		
			var p = $(document.createElement('p'));
			p.attr('class','sp80');
			div.append(p);
			
			var input = $(document.createElement('input'));
			input.data('idx',i);
			input.attr('placeholder',X.lang.get('split'));
			input.attr('tabindex',(i+1));
			input.val(split.name);
			input.on('blur',function () {
				var opts 	= {
					idx		: $(this).data('idx'),
					name 	: $(this).val()
				};
				X.counter.curRun.updateSplit(opts);
			});
			input.on('focus',function () {
				$(this).parent().parent().trigger('click');
			});
			p.append(input);
			
			if(this.curRun.curModRow === i){
				input.focus();
				div.addClass('mod-row-active');
			}			

			var p = $(document.createElement('p'));
			p.attr('class','sp20');
			div.append(p);
			
			var input = $(document.createElement('input'));
			input.attr('name','input-pb');
			input.data('idx',i);
			input.attr('disabled',true);
			input.attr('placeholder',X.lang.get('pb'));
			input.val(split.pb);
			input.on('blur',function () {
				if(isNaN($(this).val()) || $(this).val() < 0 ){
					$(this).val(0);
					return false;
				}
				var opts 	= {
					idx		: $(this).data('idx'),
					pb 		: $(this).val(),
					countPB	: false
				};
				X.counter.curRun.updateSplit(opts);
			});
			p.append(input);
			
			var p = $(document.createElement('p'));
			p.attr('class', 'clear');
			div.append(p);
		}
	},
	addControls : function () {
		
		var mainDiv = $('#ctl');
		mainDiv.html('');
					
		var btn = $(document.createElement('button'));
		btn.html(X.lang.get('insSplitBel'));
		btn.on('click',function () {
			var idx = X.counter.curRun.curModRow = X.counter.curRun.curModRow+1;
			X.counter.curRun.addSplit(idx);
			X.counter.drawMod();
			X.counter.setDirty(1);
		});
		mainDiv.append(btn);
				
		var btn = $(document.createElement('button'));
		btn.html(X.lang.get('editPBman'));
		btn.on('click',function () {		
			$('input[name=input-pb]').each(function(){
				if($(this).attr('disabled')){
					$(this).attr('disabled',false);
				} else {
					$(this).attr('disabled',true);
				}
			});
		});
		mainDiv.append(btn);
		
		var btn = $(document.createElement('button'));
		btn.html(X.lang.get('deleteSplit'));
		btn.on('click',function () {
			var idx = X.counter.curRun.curModRow;
			X.counter.curRun.delSplit(idx);
			X.counter.drawMod();
			X.counter.setDirty(1);
		});
		mainDiv.append(btn);
		
		var btn = $(document.createElement('button'));
		btn.attr('id','mod-btn-save');
		btn.html(X.lang.get('save'));
		btn.on('click',function () {
			X.counter.uData.save();
			X.counter.drawLive();
			X.counter.setDirty(false);
		});
		mainDiv.append(btn);
		
		var hr = $(document.createElement('hr'));
		mainDiv.append(hr);
		
		var btn = $(document.createElement('button'));
		btn.html(X.lang.get('newRun'));
		btn.on('click',function () {
			X.counter.curRun = X.counter.uData.newRun();
			X.counter.setGui();
		});
		mainDiv.append(btn);
		
		var btn = $(document.createElement('button'));
		btn.html(X.lang.get('delete'));
		btn.on('click',function () {
			if(!confirm(X.lang.get('rusure'))){
				return;
			}
			X.counter.curRun = X.counter.uData.delRun();
			X.counter.setGui();	
		});
		mainDiv.append(btn);
		
		var p = $(document.createElement('p'));
		p.attr('class','clear');
		mainDiv.append(p);

		var p = $(document.createElement('p'));
		p.attr('class','smaLabel');
		p.html(X.lang.get('saveInfo'));
		mainDiv.append(p);		
		
		var div = $(document.createElement('div'));
		div.css('float','right');
		div.html('&#66;&#121;&#32;&#84;&#111;&#112;&#112;&#105;&#54;&#56;');
		mainDiv.append(div);
				
	},
	setDirty : function (bool) {
		if(bool){
			$('#mod-btn-save').addClass('dirty');
		} else {
			$('#mod-btn-save').removeClass('dirty');
		}
	},
};
X.parseJson = function (json){
	var obj =  jQuery.parseJSON(json);
	var iterate = function (obj) {
	    for (var i in obj) {
            if (typeof obj[i] == "object") {
            	iterate(obj[i]);
            } else {
               obj[i] = obj[i] && !isNaN(Number(obj[i])) ? Number(obj[i]) : obj[i];
            }
	    }
	};
	iterate(obj);
	return obj;
};
X.insertArrayValues = function (arr,pos,daten) {
	arr.push();
	for(var i=arr.length-1;i>=pos;i--){
		arr[i+1]=arr[i];
	}
	arr[pos] = daten;
	return arr;
};