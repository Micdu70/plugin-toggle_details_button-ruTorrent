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
		if((init && !theWebUI.settings["webui.show_dets"] && (document.getElementById("tdcont").offsetParent !== null)) || !init)
		{
			var idTabs = [];
			var tabsElm = document.getElementById("tabbar").children;
			for (var i=0; i<tabsElm.length; i++)
			{
				if(tabsElm[i].id !== "tab_toggleDetails")
					idTabs.push(tabsElm[i].id);
			}
		}

		if((init && !theWebUI.settings["webui.show_dets"]) || (!init && theWebUI.settings["webui.show_dets"]))
		{
			if(document.getElementById("tdcont").offsetParent !== null)
			{
				$("#tdcont").hide();
				plugin.hideTabs(idTabs);
			}
			plugin.resize(true);
		}
		else
		{
			if(!init)
			{
				plugin.showTabs(idTabs);
				$("#tdcont").show();
			}
			plugin.resize();
		}

		if(!init)
		{
			theWebUI.settings["webui.show_dets"] = !theWebUI.settings["webui.show_dets"];
			theWebUI.save();
			plugin.toggleDetailsButton();
		}
	}

	plugin.resize = function(reduce)
	{
		var ww = $(window).width();
		var wh = $(window).height();
       		var w = Math.floor(ww * (1 - theWebUI.settings["webui.hsplit"])) - 5;
	        var th = ($("#t").is(":visible") ? $("#t").height() : -1)+$("#StatusBar").height()+12;
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
		if(reduce)
		{
			theWebUI.resizeTop( w, Math.floor(wh * (1-($("#StatusBar").height()/wh)))-th-7 );
			theWebUI.resizeBottom( w, Math.floor(wh * (1 - (1-($("#StatusBar").height()/wh)))) );
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
					if(!theWebUI.settings["webui.show_dets"])
						plugin.resize(true);
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
					if(!theWebUI.settings["webui.show_dets"])
						plugin.resize(true);
					return(false);
				}
			}
		};
		$(document).keydown(keyEvent);
	}

	plugin.toggleDetailsButton = function(init)
	{
		if(!init)
			$("#tab_toggleDetails").remove();
		else if(!theWebUI.settings["webui.show_dets"])
			$("#tdetails").show();

		if(theWebUI.settings["webui.show_dets"])
			this.addToggleDetailsButton("toggleDetails","▼","gcont");
		else
			this.addToggleDetailsButton("toggleDetails","▲","gcont");
	}

	plugin.allDone = function()
	{
		this.toggleDetailsButton(true);

		window.onresize = function(){!theWebUI.settings["webui.show_dets"] ? plugin.resize(true) : plugin.resize()};
		window.onorientationchange = function(){!theWebUI.settings["webui.show_dets"] ? plugin.resize(true) : plugin.resize()};

		if(!browser.isOpera)
			this.assignEvents();

		if(!theWebUI.settings["webui.show_dets"])
			theWebUI.newToggleDetails(true);
	}

	plugin.onRemove = function()
	{
		if(!browser.isOpera)
			$(document).off('keydown');
		theWebUI.assignEvents();
		$("#tab_toggleDetails").remove();
	}

	plugin.config = theWebUI.config;
	theWebUI.config = function(data)
	{
		plugin.oldResize = this.resize;
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
				plugin.oldResize();
		};

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
