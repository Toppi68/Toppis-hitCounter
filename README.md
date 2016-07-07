# hitCounter
Hit Counter - Overlay for streamers

https://toppi68.github.io/hitCounter/

**QUICKSTART:

Just open the index.html in your fav. browser.
All your gamedata like runs, splits, pb's is autom. saved in the local browser storage.
To embed the coutner on your webserver. See **AJAX

**ADVANCED STUFF:

This software is free. You can edit, extend, change it for your own needs, 
solong you spend my note at the Mod-buttom-place. 
Thank you very much :-)

**AJAX:

To save your runs to your webservers database, take a look in the ajax-demo.html. 
It will give you an idea about get/send the run-data via ajax-request to your server.

**EXTEND STYLES, LANGS:

How to add a style:
1. copy paste the default style in /style/ - rename it to yours.
2. edit /js/style.js
3. Add a line of code:

		styles	: {
			'def-dark.css'			: 'Dark (default)',
			'light.css'				: 'Light',
			'AddYourStyle.css'		: 'Your name / your theme'
		},

How to add a language:
1. edit /js/lang.js
2. duplicate the english dict-key and rename it like below:

		en	: {
			'iso'					: 'EN',
			'isoName'				: 'English',
			'title'					: 'Title',
			'split'					: 'Split',
			.
			.
			.
			.....
		},
		esp	: {
			'iso'					: 'ESP',
			'isoName'				: 'Spanisch',
			'title'					: 'Título',
			'split'					: 'Sección',
			.
			.
			.
			.....
		},
