if(plugin.canChangeTabs())
{
	theWebUI.hideTabs = function(id)
	{
		for (var i=0; i<id.length; i++)
		{
			if(i!=0)
				$("#"+[id[i]]).hide();
		}
	}

	theWebUI.showTabs = function(id)
	{
		for (var i=0; i<id.length; i++)
		{
			if(i!=0)
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
				$("#tdetails").show();
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

		plugin.checkDetails();
	}

	theWebUI.addToggleDetailsButton = function(id,name,idBefore,init)
	{
		var newLbl = document.createElement("li");
		newLbl.id = "tab_"+id;
		newLbl.title = theUILang.Toggle_details;
		newLbl.innerHTML = "<a href=\"javascript://void();\" onmousedown=\"theWebUI.toggleDetailsButton();\" onfocus=\"this.blur();\">" + name + "</a>";
		var beforeLbl = $$("tab_"+idBefore);
		beforeLbl.parentNode.insertBefore(newLbl,beforeLbl);
		if(init && !theWebUI.settings["webui.show_dets"])
			theWebUI.toggleDetailsButton(true);
	}

	plugin.checkDetails = function(init)
	{
		plugin.removePageFromTabs("toggleDetailsButton");
		if(!theWebUI.settings["webui.show_dets"])
			theWebUI.addToggleDetailsButton("toggleDetailsButton","⇡","gcont",init);
		else
			theWebUI.addToggleDetailsButton("toggleDetailsButton","⇣","gcont",init);
	}

	plugin.allDone = function()
	{
		plugin.checkDetails(true);
	}

	plugin.onRemove = function()
	{
		plugin.removePageFromTabs("toggleDetailsButton");
	}

	plugin.config = theWebUI.config;
	theWebUI.config = function(data)
	{
		plugin.config.call(this,data);
		thePlugins.waitLoad( "thePlugins.get('toggle_details_button').allDone" );
	}
}
