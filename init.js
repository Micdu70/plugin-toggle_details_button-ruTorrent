if(plugin.canChangeTabs())
{
	plugin.hideTabs = function(id)
	{
		for (var i=0; i<id.length; i++)
		{
			if([id[i]]!="tab_toggleDetailsButton")
				$("#"+[id[i]]).hide();
		}
	}

	plugin.showTabs = function(id)
	{
		for (var i=0; i<id.length; i++)
		{
			if([id[i]]!="tab_toggleDetailsButton")
				$("#"+[id[i]]).show();
		}
	}

	theWebUI.newToggleDetails = function(init)
	{
		var check = false;
		var wh = $(window).height();

		var idTabs = [];
		var tabsElm = document.getElementById("tabbar").children;
		for (var i=0; i<tabsElm.length; i++)
		{
			idTabs.push(tabsElm[i].id);
		}

		$("#tdetails").show();

		if((init && !theWebUI.settings["webui.show_dets"]) || (!init && theWebUI.settings["webui.show_dets"]))
		{
			if(init)
				theWebUI.settings["webui.show_dets"] = true;
			h = theWebUI.settings["webui.vsplit"];
			theWebUI.settings["webui.vsplit"] = 1-($("#StatusBar").height()/wh);
			$("#tdcont").hide();
			plugin.hideTabs(idTabs);
		}
		else
		{
			check = true;
			theWebUI.settings["webui.show_dets"] = true;
			plugin.showTabs(idTabs);
			$("#tdcont").show();
		}

		theWebUI.resize();

		if(check)
			theWebUI.settings["webui.show_dets"] = false;

		if(theWebUI.settings["webui.show_dets"])
			theWebUI.settings["webui.vsplit"] = h;

		theWebUI.settings["webui.show_dets"] = !theWebUI.settings["webui.show_dets"];

		if(!init)
		{
			theWebUI.save();
			plugin.toggleDetailsButton();
		}
	}

	plugin.addToggleDetailsButton = function(id,name,idBefore)
	{
		var newLbl = document.createElement("li");
		newLbl.id = "tab_"+id;
		newLbl.title = theUILang.Toggle_details;
		newLbl.innerHTML = "<a href=\"javascript://void();\" onmousedown=\"theWebUI.newToggleDetails();\" onfocus=\"this.blur();\">" + name + "</a>";
		var beforeLbl = $$("tab_"+idBefore);
		beforeLbl.parentNode.insertBefore(newLbl,beforeLbl);
	}

	plugin.assignEvents = function()
	{
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
					theWebUI.newToggleDetails(true);
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
					theWebUI.newToggleDetails(true);
					return(false);
				}
			}
		};
		$(document).keydown(keyEvent);
	}

	plugin.toggleDetailsButton = function(init)
	{
		if(!init)
			$("#tab_toggleDetailsButton").remove();
		else if(!theWebUI.settings["webui.show_dets"])
		{
			this.addToggleDetailsButton("toggleDetailsButton","▲","gcont");
			setTimeout('theWebUI.newToggleDetails(true)');
			return;
		}

		if(theWebUI.settings["webui.show_dets"])
			this.addToggleDetailsButton("toggleDetailsButton","▼","gcont");
		else
			this.addToggleDetailsButton("toggleDetailsButton","▲","gcont");
	}

	plugin.allDone = function()
	{
		window.onresize = function(){!theWebUI.settings["webui.show_dets"] ? theWebUI.newToggleDetails(true) : theWebUI.resize()};
		window.onorientationchange = function(){!theWebUI.settings["webui.show_dets"] ? theWebUI.newToggleDetails(true) : theWebUI.resize()};

		if(!browser.isOpera)
			this.assignEvents();

		this.toggleDetailsButton(true);
	}

	plugin.onRemove = function()
	{
		if(!browser.isOpera)
			$(document).off('keydown');
		theWebUI.assignEvents();
		$("#tab_toggleDetailsButton").remove();
	}

	plugin.config = theWebUI.config;
	theWebUI.config = function(data)
	{
		plugin.trtOndblclick = this.tables.trt.ondblclick;
		theWebUI.tables.trt.ondblclick = function(obj)
		{
			if(plugin.enabled && !theWebUI.settings["webui.show_dets"])
				theWebUI.newToggleDetails();
			theWebUI.showDetails(obj.id);
			return(false);
		};
		plugin.config.call(this,data);
		thePlugins.waitLoad( "thePlugins.get('toggle_details_button').allDone" );
	}
}
