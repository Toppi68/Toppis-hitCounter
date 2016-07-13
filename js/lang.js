var X = X || {};
X.lang = {
	dicts : {
		en	: {
			'iso'					: 'EN',
			'isoName'				: 'English',
			'title'					: 'Titel',
			'split'					: 'Split',
			'now'					: 'Now',
			'diff'					: 'Diff',
			'pb'					: 'PB',
			'totals'				: 'Totals',
			'selStyle'				: 'Choose a style',
			'selLang'				: 'Select your language',		
			'number'				: '#',
			'addHit'				: 'Add (+1)',
			'remHit'				: 'Rem (-1)',
			'insSplitBel'			: 'Insert Split',
			'nextSplit'				: 'Next Split',
			'editPBman'				: 'Edit PB man.',
			'save'					: 'Save',
			'delete'				: 'Delete Run',
			'deleteSplit'			: 'Delete Split',
			'newRun'				: 'Create new Run',
			'newUntitledRun'		: 'New untitled Run',
			'reset'					: 'Reset Run',
			'setPB'					: 'Would you like to set these PB as your new PB?',
			'selRun'				: 'Select your Run',
			'reRun'					: 'Restart Run',
			'finRun'				: 'Finish Run',
			'rusure'				: 'Are you sure?',
			'saveInfo'				: 'All your runs are saved autom. in your browser-history.'		
		},
		de	: {
			'iso'					: 'DE',
			'isoName'				: 'German',
			'title'					: 'Titel',
			'split'					: 'Split',
			'now'					: 'Akt',
			'diff'					: 'Diff',
			'pb'					: 'PB',
			'totals'				: 'Total',
			'selStyle'				: 'Wähle ein Style',
			'selLang'				: 'Wähle eine Sprache',		
			'number'				: '#',
			'addHit'				: 'Add (+1)',
			'remHit'				: 'Sub (-1)',
			'insSplitBel'			: 'Split einfügen',
			'nextSplit'				: 'Nächster Split',
			'editPBman'				: 'Edit PB man.',
			'save'					: 'Speichern',
			'delete'				: 'Lauf löschen',
			'deleteSplit'			: 'Split löschen',
			'newRun'				: 'Neuer Lauf',
			'newUntitledRun'		: 'Unbenannter Lauf',
			'reset'					: 'Lauf zurücksetzten',
			'setPB'					: 'Die PB jetzt als neue PB festlegen?',
			'selRun'				: 'Wähle einen Lauf',
			'reRun'					: 'Restart Lauf',
			'finRun'				: 'Lauf beenden',
			'rusure'				: 'Bist Du sicher?',
			'saveInfo'				: 'Alle Daten werden automatisch in der Browserhistory gespeichert.'		
		}
	},
	/*
	 * No changes until here else you know what you do :)
	 */
	defIso	: 'en',
	curIso	: 'en',
	
	setIso : function (iso){
		iso = String(iso).toLowerCase();
		if(this.dicts[iso]){
			this.curIso = iso;
			return iso;
		}
	},
	get : function (key){
		return this.dicts[this.curIso][key] ? this.dicts[this.curIso][key] : 'undef.langKey'; 
	},
	getLangCombo : function (selectedId){
		var selected = selectedId ? selectedId : 0;
		var combo = $(document.createElement("select"));
		for (var i in this.dicts){
			var item = this.dicts[i];
			var opt = $(document.createElement("option"));
  			opt.val(String(i).toLowerCase());
  			opt.append(document.createTextNode('('+item.iso+') '+item.isoName));
  			if(String(selected) == String(opt.val())) {
  				opt.attr('selected',"selected");
  			}
			combo.append(opt);
		}
		return combo;
	}
}