if(plugin.canChangeTabs())
{
	plugin.hideTabs = function(id)
	{
		for (var i=0; i<id.length; i++)
		{
			$("#"+[id[i]]).hide();
		}
	}

	plugin.showTabs = function(id)
	{
		for (var i=0; i<id.length; i++)
		{
			$("#"+[id[i]]).show();
		}
	}

	theWebUI.newToggleDetails = function(init)
	{
		var idTabs = [];
		var tabsElm = document.getElementById("tabbar").children;
		for (var i=0; i<tabsElm.length; i++)
		{
			if(tabsElm[i].id !== "tab_toggleDetails")
				idTabs.push(tabsElm[i].id);
		}

		if(!init && !theWebUI.settings["webui.show_dets"])
		{
			plugin.showTabs(idTabs);
			$("#tdcont").show();
		}
		else
		{
			$("#tdcont").hide();
			plugin.hideTabs(idTabs);
			$("#tdetails").show();
			$("#tdetails").height(26);
		}

		if(!init)
		{
			theWebUI.settings["webui.show_dets"] = !theWebUI.settings["webui.show_dets"];
			theWebUI.resize();
			theWebUI.save();
			plugin.toggleDetailsButton();
		}
	}

	plugin.resize = function(hideDetails)
	{
		var ww = $(window).width();
		var wh = $(window).height();
		var sh = $("#StatusBar").height();
       		var w = Math.floor(ww * (1 - theWebUI.settings["webui.hsplit"])) - 5;
	        var th = ($("#t").is(":visible") ? $("#t").height() : -1)+sh+12;
		$("#StatusBar").width(ww);
		if(theWebUI.settings["webui.show_cats"])
		{
			theWebUI.resizeLeft( w, wh-th );
			w = ww - w;
		}
		else
		{
			$("#VDivider").width( ww-10 );
			w = ww;
		}
		w-=11;
		if(hideDetails)
		{
			theWebUI.resizeTop( w, Math.floor(wh * (1-(sh/wh)))-th-7 );
			theWebUI.resizeBottom( w, Math.floor(wh * (1 - (1-(sh/wh)))) );
			$("#tdetails").height(26);
		}
		else
		{
			theWebUI.resizeTop( w, Math.floor(wh * theWebUI.settings["webui.vsplit"])-th-7 );
			theWebUI.resizeBottom( w, Math.floor(wh * (1 - theWebUI.settings["webui.vsplit"])) );
		}
		$("#HDivider").height( wh-th+2 );
	}

	plugin.addToggleDetailsButton = function(id,name,idBefore)
	{
		var newLbl = document.createElement("li");
		newLbl.id = "tab_"+id;
		newLbl.title = theUILang.Toggle_details;
		newLbl.innerHTML = "<a href=\"javascript://void();\" onmousedown=\"theWebUI.newToggleDetails(); return(false);\" onfocus=\"this.blur();\">" + name + "</a>";
		var beforeLbl = $$("tab_"+idBefore);
		beforeLbl.parentNode.insertBefore(newLbl,beforeLbl);
	}

	plugin.assignEvents = function()
	{
		if(browser.isOpera)
			$(document).off('keypress');
		else
			$(document).off('keydown');

		var keyEvent = function (e)
		{
			switch(e.which)
			{
		   		case 27 :	// Esc
		   		{
		   			if(theContextMenu.hide() || theDialogManager.hideTopmost())
						return(false);
		   			break;
		   		}
		   		case 79 :	// ^O
   				{
					if(e.metaKey && !theDialogManager.isModalState())
   					{
      						theWebUI.showAdd();
						return(false);
      					}
		   			break;
				}
				case 80 :	// ^P
				{
					if(e.metaKey && !theDialogManager.isModalState())
					{
      						theWebUI.showSettings();
						return(false);
      					}
		   			break;
				}
		  		case 112:	// F1
   				{
   				        if(!theDialogManager.isModalState())
   				        {
			   		        theDialogManager.show(e.metaKey ? "dlgAbout" : "dlgHelp");
						return(false);
					}
		   		}
				case 115 :	// F4
				{
					theWebUI.toggleMenu();
					return(false);
				}
				case 117 :	// F6
				{
					theWebUI.newToggleDetails();
					return(false);
				}
				case 118 :	// F7
				{
					theWebUI.toggleCategories();
					return(false);
				}
			}
		};
		if(browser.isOpera)
			$(document).keypress(keyEvent);
		else
			$(document).keydown(keyEvent);
	}

	plugin.toggleDetailsButton = function(init)
	{
		if(!init)
			$("#tab_toggleDetails").remove();
		else if(!theWebUI.settings["webui.show_dets"])
		{
			$("#tdetails").show();
			$("#tdetails").height(26);
		}

		if(theWebUI.settings["webui.show_dets"])
			this.addToggleDetailsButton("toggleDetails","▼","gcont");
		else
			this.addToggleDetailsButton("toggleDetails","▲","gcont");
	}

	plugin.allDone = function()
	{
		this.toggleDetailsButton(true);

		if(!browser.isOpera || !e.fromTextCtrl)
			this.assignEvents();

		if(!theWebUI.settings["webui.show_dets"])
			theWebUI.newToggleDetails(true);
	}

	plugin.onRemove = function()
	{
		if(!browser.isOpera || !e.fromTextCtrl)
		{
			if(browser.isOpera)
				$(document).off('keypress');
			else
				$(document).off('keydown');
			theWebUI.assignEvents();
		}
		$("#tab_toggleDetails").remove();
	}

	theWebUI.oldResize = theWebUI.resize;
	theWebUI.resize = function()
	{
		if(plugin.enabled)
		{
			if(theWebUI.settings["webui.show_dets"])
				plugin.resize();
			else
				plugin.resize(true);
		}
		else
			theWebUI.oldResize();
	};

	theWebUI.tables.trt.ondblclick = function(obj)
	{
		if(plugin.enabled && !theWebUI.settings["webui.show_dets"])
			theWebUI.newToggleDetails();
		theWebUI.showDetails(obj.id);
		return(false);
	};

	thePlugins.waitLoad( "thePlugins.get('toggle_details_button').allDone" );
}
