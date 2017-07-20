(function () {
  'use strict';

  angular.module('ftaeApp')
    .controller('applicationController', ['$scope', '$rootScope', '$http', 'SYSTEM_EVENT', 'toastService', applicationController]);

  function applicationController($scope, $rootScope, $http, SYSTEM_EVENT, toastService) {
    var vm = this;

    $scope.$on(SYSTEM_EVENT.MEMU_CHANGED, function (event, msg) {
      var item = msg.item;
      for (var i = 0; i < vm.menuList.length; i++) {
        vm.menuList[i].bActive = false;
      }
      if (item < 0) {
        return;
      }
      vm.menuList[item].bActive = true;
    });

    vm.onConnect = function () {
      vm.isBusy = true;
      $http.post('/api/applications', vm.application)
        .then(function (response) {
          angular.copy(response.data, vm.application);
          toastService.toast('success', 'Connect to application success', 'Connect')
          vm.onQueryServerList();
          vm.OnQueryAlarmLogDefinitions();
          vm.onSubscribe();
        }, function (error) {
          toastService.toast('error', 'Failed to connect to application', 'Connect')
          vm.errorMessage = 'Failed to add application';
        })
        .finally(function () {
          vm.isBusy = false;
        });
    }

    vm.onSubscribe = function () {
      var url = '/api/applications/Subscription?appPath=' + vm.application.path;
      $http.post(url)
        .then(function (response) {
          toastService.toast('success', 'Subscribe success', 'Alarm System')
        }, function (error) {
          toastService.toast('error', 'Failed to Subscribe to alarm system', 'Alarm System')
          vm.errorMessage = 'Failed to get server list';
        })
        .finally(function () {
        });
    }

    vm.onQueryServerList = function () {
      vm.isBusy = true;
      vm.rootItem.children = [];
      var url = '/api/applications/servers?appPath=' + vm.application.path;
      $http.get(url)
        .then(function (response) {
          angular.copy(response.data, vm.serverList);
          vm.parseServerList();
          toastService.toast('success', 'Get server list success', 'Connect')
        }, function (error) {
          toastService.toast('error', 'Failed to get server list', 'Get Server List')
          vm.errorMessage = 'Failed to get server list';
        })
        .finally(function () {
          vm.isBusy = false;
        });
    }

    vm.onQueryGroupList = function (item) {
      if (item.isServer == false) {
        return;
      }
      item.children = [];
      item.isBusy = true;
      var url = '/api/applications/servers/groups?serverpath=' + item.path;
      $http.get(url)
        .then(function (response) {
          vm.parseGroupList(response.data, item);
        }, function (error) {
          vm.errorMessage = 'Failed to query alarm groups';
        })
        .finally(function () {
          item.isBusy = false;
        });
    }

    vm.OnQueryAlarmLogDefinitions = function () {
      vm.historianRoot.children = [];
      var url = '/api/applications/AlarmLogDefinition?appPath=' + vm.application.path;
      $http.get(url)
        .then(function (response) {
          vm.parseAlarmLogDefs(response.data);
          toastService.toast('success', 'Get Historian Connections', 'Alarm System')
        }, function (error) {
          toastService.toast('error', 'Failed to query alarm historian connections', 'Alarm System')
          vm.errorMessage = 'Failed to query alarm configs';
        })
        .finally(function () {
        });
    }

    vm.parseServerList = function () {
      for (var i = 0; i < vm.serverList.length; i++) {
        var serverPath = vm.serverList[i].path;
        var serverPos = serverPath.indexOf(':');
        if (serverPos == -1) {
          var serverItem = new Object();
          serverItem.name = serverPath;
          serverItem.icon = 'fa fa-laptop';
          serverItem.isServer = true;
          serverItem.isBusy = false;
          serverItem.children = [];
          serverItem.path = vm.application.path + ':' + serverPath;
          serverItem.fullName = serverPath;
          vm.rootItem.children.push(serverItem);
        }
        else {
          var areaName = serverPath.slice(0, serverPos);
          var serverName = serverPath.slice(serverPos + 1);
          var areaItem = new Object();
          areaItem.name = areaName;
          areaItem.icon = 'fa fa-folder-open';
          areaItem.isServer = false;

          var serverItem = new Object();
          serverItem.name = serverName;
          serverItem.icon = 'fa fa-laptop';
          serverItem.isServer = true;
          serverItem.isBusy = false;
          serverItem.path = vm.application.path + '/' + serverPath;
          serverItem.fullName = serverPath

          if (!areaItem.children) {
            areaItem.children = [];
          }
          areaItem.children.push(serverItem);

          vm.rootItem.children.push(areaItem);
        }
        vm.rootItem.$$isExpend = true;
      }
    }

    vm.parseGroupList = function (groupList, item) {
      for (var i = 0; i < groupList.length; i++) {
        var group = groupList[i];
        var groupItem = new Object();

        var serverPos = group.name.lastIndexOf(':');
        groupItem.name = group.name.slice(serverPos + 1);
        groupItem.icon = 'fa fa-folder-open-o';
        groupItem.isServer = false;
        groupItem.isBusy = false;

        item.children.push(groupItem);
      }
    }

    vm.parseAlarmLogDefs = function (alarmLogDefs) {
      for (var i = 0; i < alarmLogDefs.length; i++) {
        var def = alarmLogDefs[i];
        var alarmLogDefItem = new Object();
        alarmLogDefItem.name = def;
        alarmLogDefItem.icon = 'fa fa-cloud';
        alarmLogDefItem.isServer = false;
        alarmLogDefItem.isBusy = false;
        alarmLogDefItem.isHistorian = true;

        vm.historianRoot.children.push(alarmLogDefItem);

      }
      vm.historianRoot.$$isExpend = true;
    }

    vm.onRefresh = function () {
      vm.onQueryServerList();
      vm.OnQueryAlarmLogDefinitions();
    }

    vm.init = function () {
      var vm = this;

      vm.title = 'applicationController';
      vm.serverList = [];
      vm.application = { path: 'RNA://$Global/DemoApp' };
      vm.errorMessage = '';
      vm.isBusy = false;

      vm.tree = [];
      var appItem = new Object();
      appItem.name = vm.application.path;
      appItem.icon = 'fa fa-folder-o';
      appItem.isServer = false;
      appItem.isBusy = false;
      appItem.children = [];
      appItem.bSelected = false;

      var historianItem = new Object();
      historianItem.name = "historian connections";
      historianItem.icon = 'fa fa-database';
      historianItem.isServer = false;
      historianItem.isBusy = false;
      historianItem.children = [];
      historianItem.bSelected = false;

      vm.tree.push(appItem);
      vm.tree.push(historianItem);

      vm.selectedItem = appItem;
      vm.rootItem = appItem;
      vm.historianRoot = historianItem;

      vm.menuList = [{ name: 'Alarm Management', href: '#!/alarmManagement', bActive: false },
      { name: 'Alarm Monitor', href: '#!/alarmMonitor', bActive: false },
      { name: 'Alarm Historian', href: '#!/alarmHistorian', bActive: false }];

    }

    vm.itemClicked = function ($item) {
      $item.bSelected = !$item.bSelected;
      if (vm.lastItem) {
        vm.lastItem.bSelected = !vm.lastItem.bSelected;
      }
      vm.lastItem = $item;

      if ($item.isServer) {
        vm.onQueryGroupList($item);
        $rootScope.$broadcast(SYSTEM_EVENT.SERVER_CLICK, { item: $item });
      }
      else if($item.isHistorian) {
        $rootScope.$broadcast(SYSTEM_EVENT.HISTORIAN_CLICK, { item: $item });
      }
    }

    vm.itemCheckedChanged = function ($item) {
    }

    vm.init();
  }
})();
