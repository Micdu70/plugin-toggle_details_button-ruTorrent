if(plugin.canChangeTabs())
{
	theWebUI.hideTabs = function(id)
	{
		for (var i=0; i<id.length; i++)
		{
			if([id[i]]!="tab_toggleDetailsButton")
				$("#"+[id[i]]).hide();
		}
	}

	theWebUI.showTabs = function(id)
	{
		for (var i=0; i<id.length; i++)
		{
			if([id[i]]!="tab_toggleDetailsButton")
				$("#"+[id[i]]).show();
		}
	}

	theWebUI.toggleDetailsButton = function(init)
	{
		var check = false;
		var wh = $(window).height();

		var idTabs = [];
		var tabsElm = document.getElementById("tabbar").children;
		for (var i=0; i<tabsElm.length; i++)
		{
			idTabs.push(tabsElm[i].id);
		}

		h = theWebUI.settings["webui.vsplit"];

		$("#tdetails").show();

		if(theWebUI.settings["webui.show_dets"])
		{
			theWebUI.settings["webui.vsplit"] = 1-($("#StatusBar").height()/wh);
			$("#tdcont").hide();
			theWebUI.hideTabs(idTabs);
		}
		else
		{
			theWebUI.settings["webui.show_dets"] = true;
			if(init)
			{
				theWebUI.settings["webui.vsplit"] = 1-($("#StatusBar").height()/wh);
				$("#tdcont").hide();
				theWebUI.hideTabs(idTabs);
			}
			else
			{
				check = true;
				theWebUI.showTabs(idTabs);
				theWebUI.settings["webui.vsplit"] = h;
				$("#tdcont").show();
			}
		}

		theWebUI.resize();

		if(theWebUI.settings["webui.show_dets"])
			theWebUI.settings["webui.vsplit"] = h;

		if(check)
			theWebUI.settings["webui.show_dets"] = false;

		theWebUI.settings["webui.show_dets"] = !theWebUI.settings["webui.show_dets"];

		theWebUI.save();

		plugin.addToggleDetailsButton();
	}

	theWebUI.addToggleDetailsButton = function(id,name,idBefore)
	{
		var newLbl = document.createElement("li");
		newLbl.id = "tab_"+id;
		newLbl.title = theUILang.Toggle_details;
		newLbl.innerHTML = "<a href=\"javascript://void();\" onmousedown=\"theWebUI.toggleDetailsButton();\" onfocus=\"this.blur();\">" + name + "</a>";
		var beforeLbl = $$("tab_"+idBefore);
		beforeLbl.parentNode.insertBefore(newLbl,beforeLbl);
	}

	theWebUI.newKeyEvent = function()
	{
		$(document).off('keydown');

		var keyEvent = function (e)
		{
			switch(e.which)
			{
		   		case 27 : 				// Esc
		   		{
		   			if(theContextMenu.hide() || theDialogManager.hideTopmost())
						return(false);
		   			break;
		   		}
		   		case 79 : 				// ^O
   				{
					if(e.metaKey && !theDialogManager.isModalState())
   					{
      						theWebUI.showAdd();
						return(false);
      					}
		   			break;
				}
				case 80 :                               // ^P
				{
					if(e.metaKey && !theDialogManager.isModalState())
					{
      						theWebUI.showSettings();
						return(false);
      					}
		   			break;
				}
		  		case 112:				// F1
   				{
   				        if(!theDialogManager.isModalState())
   				        {
			   		        theDialogManager.show(e.metaKey ? "dlgAbout" : "dlgHelp");
						return(false);
					}
		   		}
				case 115 : 				// F4
				{
					theWebUI.toggleMenu();
					if(!theWebUI.settings["webui.show_dets"])
						theWebUI.toggleDetailsButton(true);
					return(false);
				}
				case 117 :                      	// F6
				{
					theWebUI.toggleDetailsButton();
					return(false);
				}
				case 118 :                      	// F7
				{
					theWebUI.toggleCategories();
					if(!theWebUI.settings["webui.show_dets"])
						theWebUI.toggleDetailsButton(true);
					return(false);
				}
			}
		};
		$(document).keydown(keyEvent);
	}

	plugin.addToggleDetailsButton = function()
	{
		this.removePageFromTabs("toggleDetailsButton");
		if(!theWebUI.settings["webui.show_dets"])
			theWebUI.addToggleDetailsButton("toggleDetailsButton","▲","gcont");
		else
			theWebUI.addToggleDetailsButton("toggleDetailsButton","▼","gcont");
	}

	plugin.checkDetails = function(init)
	{
		if(init && !theWebUI.settings["webui.show_dets"])
		{
			setTimeout('theWebUI.toggleDetailsButton(true)',1000);
			return;
		}
		this.addToggleDetailsButton();
	}

	plugin.allDone = function()
	{
		theWebUI.tables.trt.ondblclick = function(obj)
		{
			if(!theWebUI.settings["webui.show_dets"])
				theWebUI.toggleDetailsButton();
			theWebUI.showDetails(obj.id);
			return(false);
		}

		window.onresize = function(){!theWebUI.settings["webui.show_dets"] ? theWebUI.toggleDetailsButton(true) : theWebUI.resize()};
		window.onorientationchange = function(){!theWebUI.settings["webui.show_dets"] ? theWebUI.toggleDetailsButton(true) : theWebUI.resize()};

		if(!browser.isOpera)
			theWebUI.newKeyEvent();

		this.checkDetails(true);
	}

	plugin.onRemove = function()
	{
		if(!browser.isOpera)
		{
			$(document).off('keydown');
			theWebUI.assignEvents();
		}
		this.removePageFromTabs("toggleDetailsButton");
	}

	plugin.config = theWebUI.config;
	theWebUI.config = function(data)
	{
		plugin.trtOndblclick = this.tables.trt.ondblclick;
		theWebUI.tables.trt.ondblclick = function(obj)
		{
			if(plugin.enabled)
			{
				if(!theWebUI.settings["webui.show_dets"])
					theWebUI.toggleDetailsButton();
				theWebUI.showDetails(obj.id);
				return(plugin.trtOndblclick(obj));
			}
			theWebUI.showDetails(obj.id);
			return(false);
		};
		plugin.config.call(this,data);
		thePlugins.waitLoad( "thePlugins.get('toggle_details_button').allDone" );
	}
}
