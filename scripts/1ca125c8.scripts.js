"use strict";angular.module("bricksApp",["ngAnimate","ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/editor.html",controller:"EditorCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/database",{templateUrl:"views/database.html",controller:"DatabaseCtrl"}).when("/start",{templateUrl:"views/start.html",controller:"StartCtrl"}).when("/settings",{templateUrl:"views/settings.html",controller:"SettingsCtrl"}).otherwise({redirectTo:"/"})}]).run(["apps","$location",function(a,b){0===a.all().length&&b.path("/start")}]),angular.module("bricksApp").controller("AboutCtrl",["$scope",function(){}]),angular.module("bricksApp").controller("DatabaseCtrl",["$scope","$window","apps","Storage",function(a,b,c,d){a.showMenu={actions:!1},a.defaultColumns=[{name:"id"},{name:"created_at"},{name:"updated_at"}],a.app=c.current(),a.storage=new d(a.app.id),a.app.tables&&(a.currentIndex=0,a.currentTable=a.app.tables[0],a.data=a.storage.getTable(a.currentTable.name)),a.showModal={newTable:!1,newColumn:!1},a.newTable={},a.newColumn={},a.newRow={},a.appsService=c,a.$watch("appsService.current().id",function(){a.app=c.current(),a.storage=new d(a.app.id),a.app.tables?a.selectTable(0):a.app.tables=[]},!0),a.hasTables=function(){return a.app.tables&&a.app.tables.length>0},a.selectTable=function(b){a.currentTable=a.app.tables[b],a.currentIndex=b,a.data=a.storage.getTable(a.currentTable.name)},a.isDefaultColumn=function(b){var c=!1;return a.defaultColumns.forEach(function(a){a.name===b.name&&(c=!0)}),c},a.addTable=function(){var b=angular.element(document.newTableForm);if(b.controller("form").$valid){a.newTable.columns=angular.copy(a.defaultColumns);var d=a.app.tables.push(angular.copy(a.newTable))-1;c.update(a.app),a.selectTable(d),a.newTable={},a.showModal.newTable=!1}},a.deleteTable=function(){var d=b.confirm('Are you sure you want to delete the table "'+a.currentTable.name+'"?');d&&(a.app.tables.splice(a.currentIndex,1),c.update(a.app),a.selectTable(0)),a.showMenu.actions=!1},a.addColumn=function(){var b=angular.element(document.newColumnForm);b.controller("form").$valid&&(a.currentTable.columns.push(angular.copy(a.newColumn)),c.update(a.app),a.newColumn={},a.showModal.newColumn=!1)},a.deleteColumn=function(d,e){var f=b.confirm('Are you sure you want to delete the column "'+d.name+'"?');f&&(a.currentTable.columns.splice(e,1),c.update(a.app))},a.addRow=function(){a.storage.addRow(a.currentTable.name,a.newRow),a.data.push(a.newRow),a.showModal.newRow=!1},a.deleteRow=function(b,c){a.storage.removeRow(a.currentTable.name,b),a.data.splice(c,1)},a.emptyTable=function(){var c='Are you sure you want to delete all the rows in the table "'+a.currentTable.name+'"?';b.confirm(c)&&(a.storage.emptyTable(a.currentTable.name),a.data=[]),a.showMenu.actions=!1}}]),angular.module("bricksApp").controller("EditorCtrl",["$scope","components","pages",function(a,b,c){a.components=b.all(),a.currentPage=c.current(),a.loadPanel=function(b){a.panel=b},a.$on("select",function(b,c){b.stopPropagation(),a.$broadcast("selected",c)}),a.$on("change",function(b){b.stopPropagation(),a.$broadcast("changed")})}]),angular.module("bricksApp").controller("NavbarCtrl",["$location","$route","$scope","apps",function(a,b,c,d){c.show="/start"!==a.path(),c.showAppsMenu=!1,c.showAppsModal=!1,c.app={},c.appsService=d,c.$watch("appsService.all()",function(){c.apps=d.all(),c.currentApp=d.current()},!0),c.location=a,c.$watch("location.path()",function(a,b){a!==b&&(c.show="/start"!==a)}),c.addApp=function(){var a=angular.element(document.newAppForm);a.controller("form").$valid&&(c.apps.push(c.app),d.add(c.app),d.current(c.app),c.currentApp=c.app,c.app={},c.showAppsModal=!1)},c.selectApp=function(a){d.current(a),c.currentApp=a,c.showAppsMenu=!1},c.toggleAppsMenu=function(){c.showAppsMenu=!c.showAppsMenu},c.toggleAppsModal=function(){c.showAppsModal=!c.showAppsModal,c.showAppsMenu=!1},c.hideAppsModal=function(){c.showAppsModal=!1}}]),angular.module("bricksApp").controller("SettingsCtrl",["$location","$scope","$window","apps",function(a,b,c,d){b.appsService=d,b.$watch("appsService.current()",function(a){b.app=a},!0),b.saveSettings=function(){var a=angular.element(document.settingsForm);a.controller("form").$valid&&d.update(b.app)},b.deleteApp=function(b){var e=c.confirm('Are you sure you want to delete the app "'+b.name+"\"? There's no going back.");e&&(d.remove(b.id),a.path("/"))}}]),angular.module("bricksApp").controller("StartCtrl",["$location","$scope","apps",function(a,b,c){c.all().length>0&&a.path("/").replace(),b.app={},b.addApp=function(){b.newAppForm.$valid&&(c.add(b.app),c.current(b.app),a.path("/").replace())}}]),angular.module("bricksApp").directive("activelink",["$location",function(a){return{restrict:"A",link:function(b,c,d){var e=d.activelink,f=c.find("a")[0].hash.substring(1);b.$location=a,b.$watch("$location.path()",function(a){f.length>1&&a.substr(0,f.length)===f||a.split("/")[1]===f.substr(1,f.length)||1===f.length&&1===a.length?c.addClass(e):c.removeClass(e)})}}}]),angular.module("bricksApp").directive("collapseButton",["$animate",function(a){return{replace:!0,restrict:"E",template:'<button class="collapse-button"></button>',link:function(b,c,d){var e=angular.element("body"),f="collapsed-"+d.position,g="collapse-button-parent "+d.position,h=c.parent().addClass(g),i=!0;c.bind("click",function(){i=!i,i?a.removeClass(h,"closed",function(){e.removeClass(f)}):a.addClass(h,"closed",function(){e.addClass(f)})})}}}]),angular.module("bricksApp").directive("componentOptions",["$compile","components",function($compile,components){return{restrict:"E",replace:!0,scope:{},template:"<div></div>",link:function(scope,element){var allComponents=components.all();scope.component={},scope.selection={},scope.options={},scope.updateSelection=function(){},scope.change=function(){scope.updateSelection(),scope.$emit("change")},scope.$on("selected",function(e,iframe){var page=angular.element(iframe).contents();scope.selection=page.find(".bricks-selected"),allComponents.some(function(a){var b=scope.selection.is(a.selector);return b&&(scope.component=a),b}),eval(scope.component["admin-script"]),element.empty().append($compile(scope.component.admin)(scope)),scope.$apply()})}}}]),angular.module("bricksApp").directive("draggable",function(){return function(a,b,c){b.on("dragstart",function(b){var d=a.$eval(c.html);b.originalEvent.dataTransfer.effectAllowed="move",b.originalEvent.dataTransfer.setData("text/plain",d)})}}),angular.module("bricksApp").directive("editorFrame",function(){return{replace:!0,restrict:"E",scope:{template:"="},template:'<div id="canvas"><iframe src="about:blank"></iframe><overlay iframe="#canvas iframe"></overlay></div>',link:function(a,b){var c,d,e,f,g,h,i=b.find("iframe"),j=i.contents(),k=angular.element('<div style="width: 100%; height: 3px;background:#428bca;">'),l=angular.element("<style>");l.append(".bricks-empty {min-height: 50px; min-width: 50px; border: 4px dashed #f0ad4e;}");var m=function(){l.detach(),g&&g.removeClass("bricks-selected"),h="<!DOCTYPE html>"+j[0].documentElement.outerHTML,a.template=h,f.append(l)},n=function(a){if(!(["HTML","BODY"].indexOf(a.target.nodeName)>-1)){var b=angular.element(a.target);c=a.target.draggable,a.target.draggable=!0,b.on("dragstart",function(a){a.originalEvent.dataTransfer.effectAllowed="move",d=b})}},o=function(a){c||a.target.removeAttribute("draggable")},p=function(a,b){b=angular.element(b),"HTML"===b[0].nodeName&&(b=e),"BODY"===b[0].nodeName||b.is(":empty")?b.append(a):b.after(a)},q=function(a,b){var c;b=angular.element(b),angular.isElement(a)?c=a.parent():a=angular.element(a),p(a,b),b.removeClass("bricks-empty"),c&&""===c.text().trim()&&"BODY"!==c[0].nodeName&&c.addClass("bricks-empty"),""===a.text().trim()&&a.addClass("bricks-empty")},r=function(a){a.preventDefault(),a.originalEvent.dataTransfer.dropEffect="move",p(k,a.target)},s=function(){k.remove()},t=function(b){var c;return b.stopPropagation(),d?(c=d,d=null):c=b.originalEvent.dataTransfer.getData("text/plain"),k.remove(),q(c,b.target),m(),a.$apply(),!1},u=function(b){["HTML","BODY"].indexOf(b.target.nodeName)>-1||(g&&g.removeClass("bricks-selected"),g=angular.element(b.target).addClass("bricks-selected"),a.$emit("select","#canvas iframe"))};a.$watch("template",function(a){a&&a!==h&&(j[0].open(),j[0].write(a),j[0].close(),e=j.find("body"),f=j.find("head"))}),i.on("load",function(){j.on("click",u),j.on("dragover",r),j.on("dragleave",s),j.on("drop",t),j.on("mouseover",n),j.on("mouseout",o)}),a.$on("changed",function(){m()})}}}),angular.module("bricksApp").directive("modal",function(){return{replace:!0,restrict:"E",scope:{closeable:"&",close:"&",open:"&",submit:"&",title:"="},templateUrl:"views/modal.html",transclude:!0,link:function(a){a.closeable=a.closeable(),void 0===a.closeable&&(a.closeable=!0)}}}),angular.module("bricksApp").directive("overlay",function(){return{replace:!0,restrict:"E",template:'<div class="overlay"><div class="overlay-highlight"></div><div class="overlay-select"><a href="" class="delete"><span class="glyphicon glyphicon-trash"></span></a></div>',link:function(a,b,c){var d,e=angular.element(c.iframe),f=b.find(".overlay-select"),g=b.find(".overlay-highlight"),h=e.contents(),i=b.find(".delete"),j=function(a,b){var c=e[0].offsetTop,d=e[0].offsetLeft,f=angular.element(b).offset();a.css("display","block").css("width",b.clientWidth+"px").css("height",b.clientHeight+"px").css("top",c+f.top+"px").css("left",d+f.left+"px")},k=function(a){-1===["HTML","BODY"].indexOf(a.target.nodeName)&&j(g,a.target)},l=function(a){-1===["HTML","BODY"].indexOf(a.target.nodeName)&&(d=angular.element(a.target),j(f,a.target),g.detach())};e.on("load",function(){h.on("mouseover",k),h.on("click",l)}),i.on("click",function(a){a.preventDefault(),d.remove(),f.css("display","none")}),a.$watch(function(){return d&&d.prop("outerHTML")},function(){d&&j(f,d[0])})}}}),angular.module("bricksApp").directive("validationClass",function(){return{require:"ngModel",restrict:"A",scope:{form:"@"},link:function(a,b,c){var d=b.controller("form"),e=b.parent().parent();a.$watch(c.ngModel,function(){var a=b[0].name;d[a].$dirty&&(d[a].$invalid?e.removeClass("has-success").addClass("has-error"):e.removeClass("has-error").addClass("has-success"))})}}}),angular.module("bricksApp").service("apps",["$window",function(a){var b="bricks_apps",c="bricks_current",d=a.localStorage.getItem(b),e=a.localStorage.getItem(c);return d=d?JSON.parse(d):[],{all:function(){return angular.copy(d)},current:function(b){if(!b){var f;return e=a.localStorage.getItem(c),d.forEach(function(a){a.id===e&&(f=a)}),angular.copy(f?f:d[0])}e=b.id,a.localStorage.setItem(c,e)},add:function(c){c.id=uuid(),d.push(angular.copy(c)),a.localStorage.setItem(b,JSON.stringify(d))},update:function(c){d.forEach(function(e,f){e.id===c.id&&(d[f]=angular.copy(c),a.localStorage.setItem(b,JSON.stringify(d)))})},remove:function(c){d.forEach(function(e,f){e.id===c&&(d.splice(f,1),a.localStorage.setItem(b,JSON.stringify(d)))})}}}]),angular.module("bricksApp").service("components",["$http",function(a){var b=[];return a.get("views/components.html",{cache:!0}).success(function(a){jQuery(a).find("component").each(function(a,c){var d={};[].forEach.call(c.children,function(a){d[a.nodeName.toLowerCase()]=a.innerHTML.trim()}),b.push(d)})}),{all:function(){return b}}}]),angular.module("bricksApp").service("pages",["$http",function(a){var b={template:""};return a.get("views/default-template.html",{cache:!0}).success(function(a){b.template=a}),{current:function(){return b}}}]),angular.module("bricksApp").factory("Storage",["$window",function(a){var b=function(a){this.app=a,this.prefix="bricks_app_"+a+"_"};return b.prototype.getTable=function(b){var c=a.localStorage.getItem(this.prefix+b);return c?JSON.parse(c):[]},b.prototype.emptyTable=function(b){return a.localStorage.removeItem(this.prefix+b)},b.prototype.addRow=function(b,c){var d=this.getTable(b),e=this._date();c.id=uuid(),c.created_at=e,c.updated_at=e,d.push(c),a.localStorage.setItem(this.prefix+b,JSON.stringify(d))},b.prototype.removeRow=function(b,c){var d=this.getTable(b);d.forEach(function(a,b){a.id===c.id&&d.splice(b,1)}),a.localStorage.setItem(this.prefix+b,JSON.stringify(d))},b.prototype._date=function(){return(new Date).toISOString().split(".")[0].replace("T"," ")},b}]);