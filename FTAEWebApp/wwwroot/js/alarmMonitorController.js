(function () {
  'use strict';

  angular.module('ftaeApp')
    .controller('alarmMonitorController', ['$scope', '$rootScope', '$http', 'SYSTEM_EVENT', 'toastService', alarmMonitorController]);

  function alarmMonitorController($scope, $rootScope, $http, SYSTEM_EVENT, toastService) {
    var vm = this;

    $scope.$on(SYSTEM_EVENT.SERVER_CLICK, function (event, msg) {
      vm.serverPath = msg.item.path;
      vm.onQueryAlarmStates();
    });

    vm.onQueryAlarmStates = function () {
      if (!vm.serverPath) {
        return;
      }

      vm.alarmLogs = [];
      var url = '/api/applications/servers/AlarmStates?serverPath=' + vm.serverPath;
      $http.get(url)
        .then(function (response) {
          vm.parseAlarmStates(response.data);
          //toastService.toast('success', 'Get Alarm State', 'Alarm Monitor');
        }, function (error) {
          clearInterval(vm.interval);
          toastService.toast('error', 'Failed to get alarm states', 'Alarm Monitor')
        })
        .finally(function () {
        });
    }

    vm.parseAlarmStates = function (states) {
      angular.copy(states, vm.alarmStates);

      for (var i = 0; i < vm.alarmStates.length; i++) {
        vm.alarmStates[i].bSelect = false;
      }
    }

    vm.getIcon = function (alarm) {
      if (alarm.active) {
        return 'fa fa-bell redIcon center-block text-center';
      } else {
        return 'fa fa-bell blueIcon center-block text-center';
      }
    }

    vm.getRowColor = function (alarm) {
      if (alarm.active) {
        return 'danger';
      } else {
        return '';
      }
    }

    vm.startInterval = function () {
      vm.interval = setInterval(vm.queryAlarmStateInterval, 5000);
    }

    vm.queryAlarmStateInterval = function () {
      vm.onQueryAlarmStates();
    }

    vm.selectAll = function () {
      for (var i = 0; i < vm.alarmStates.length; i++) {
        vm.alarmStates[i].bSelect = !vm.alarmStates[i].bSelect;
      }
    }

    vm.init = function () {
      $rootScope.$broadcast(SYSTEM_EVENT.MEMU_CHANGED, { item: 1 });

      vm.bSelectAll = false;
      vm.columnHeaders = [
        'Alarm Name',
        'Severity',
        'Event Time',
        'Alarm Message'
      ];
      vm.alarmStates = [];
      vm.startInterval();
    }
    vm.init();
  }
})();
