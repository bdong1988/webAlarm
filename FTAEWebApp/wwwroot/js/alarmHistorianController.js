(function () {
  'use strict';

  angular.module('ftaeApp')
    .controller('alarmHistorianController', ['$scope', '$rootScope', '$http', 'SYSTEM_EVENT', 'toastService', alarmHistorianController]);

  function alarmHistorianController($scope, $rootScope, $http, SYSTEM_EVENT, toastService) {
    var vm = this;

    $scope.$on(SYSTEM_EVENT.HISTORIAN_CLICK, function (event, msg) {
      vm.dbConnection = msg.item.name;
      vm.queryItem = msg.item;
      vm.onQueryAlarmLogs();
    });

    vm.onQueryAlarmLogs = function () {
      vm.alarmLogs = [];
      vm.queryItem.isBusy = true;
      var url = '/api/applications/AlarmLog?dbConnection=' + vm.dbConnection;
      $http.get(url)
        .then(function (response) {
          vm.parseAlarmLogs(response.data);
          toastService.toast('success', 'Get Historian Data', 'Alarm Logs')
        }, function (error) {
          toastService.toast('error', 'Failed to query alarm logs', 'Alarm Logs')
        })
        .finally(function () {
          vm.queryItem.isBusy = false;
        });
    }

    vm.parseAlarmLogs = function (alarmLogs) {
      angular.copy(alarmLogs, vm.alarmLogs);
      vm.generateAlarmLogStatic();
    }

    vm.generateAlarmLogStatic = function () {
      var alarmLogDict = new Array();
      vm.pieChartData = [];

      var low = new Object();
      low.name = 'Low';
      low.value = 0;
      
      var medium = new Object();
      medium.name = 'Medium';
      medium.value = 0;
     
      var high = new Object();
      high.name = 'High';
      high.value = 0;

      var urgent = new Object();
      urgent.name = 'Urgent';
      urgent.value = 0;
      
      for (var i = 0; i < vm.alarmLogs.length; i++) {
        var alarm = vm.alarmLogs[i];
        if (alarm.severity >= 1 && alarm.severity <= 250) {
          low.value++;
        } else if (alarm.severity >= 251 && alarm.severity <= 500) {
          medium.value++;
        } else if (alarm.severity >= 501 && alarm.severity <= 750) {
          high.value++;
        } else if (alarm.severity >= 751 && alarm.severity <= 1000) {
          urgent.value++;
        }

        if (alarmLogDict[alarm.alarmName]) {
          alarmLogDict[alarm.alarmName] += 1;
        }
        else {
          alarmLogDict[alarm.alarmName] = 1;
        }
      }

      vm.barChartData = [];

      vm.barChartData.push(low);
      vm.barChartData.push(medium);
      vm.barChartData.push(high);
      vm.barChartData.push(urgent);

      for (var i in alarmLogDict) {
        alarmLogDict[i]
        var data = new Object();
        data.name = i;
        data.value = alarmLogDict[i];
        vm.pieChartData.push(data);
      }
    }

    vm.onToggleChart = function () {
      vm.showChart = !vm.showChart;
    }

    vm.init = function () {
      $rootScope.$broadcast(SYSTEM_EVENT.MEMU_CHANGED, { item: 2 });
      vm.queryItem = {};
      vm.isBusy = false;
      vm.columnHeaders = [
        'AlarmName',
        'Active',
        'Acknowledged',
        'Disabled',
        'Suppressed',
        'Shelved',
        'Severity',
        'AlarmMessage'
      ];

      vm.filterText = '';

      vm.alarmLogs = [];

      vm.showChart = false;

      vm.pieChartData = [{
        'value': 0,
        'name': 'Alarm1'
      }, {
        'value': 0,
        'name': 'Alarm2'
      }, {
        'value': 0,
        'name': 'Alarm3'
      }, {
        'value': 0,
        'name': 'Alarm4'
      }, {
        'value': 0,
        'name': 'Alarm5'
      }];

      vm.barChartData = [{
        'value': 0,
        'name': 'low'
      }, {
        'value': 0,
        'name': 'Medium'
      }, {
        'value': 0,
        'name': 'High'
      }, {
        'value': 0,
        'name': 'Urgent'
      }];
    }
    vm.init();
  }
})();
