(function () {
  'use strict';

  angular.module('ftaeApp', ['simpleControls', 'ngRoute'])
    .constant('SYSTEM_EVENT', {
      SERVER_CLICK: '1',
      HISTORIAN_CLICK: '2',
      MEMU_CHANGED:'3'
    })
    .service('toastService', function () {
      this.toast = function (level, message, title) {
        toastr.options = {
          closeButton: false,
          debug: false,
          progressBar: false,
          positionClass: "toast-top-center",
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          timeOut: "5000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut"
        };

        var $toast = toastr[level](message, title);
      }

    })
    .directive('treeView', function () {
      return {
        restrict: 'E',
        templateUrl: 'views/treeView.html',
        scope: {
          treeData: '=',
          canChecked: '=',
          textField: '@',
          itemClicked: '&',
          itemCheckedChanged: '&',
          itemTemplateUrl: '@'
        },
        controller: ['$scope', function ($scope) {
          $scope.itemExpended = function (item, $event) {
            item.$$isExpend = !item.$$isExpend;
            $event.stopPropagation();
          };

          $scope.getItemIcon = function (item) {
            var isLeaf = $scope.isLeaf(item);
            return item.icon;
          };

          $scope.isLeaf = function (item) {
            return !item.children || !item.children.length;
          };

          $scope.warpCallback = function (callback, item, $event) {
            ($scope[callback] || angular.noop)({
              $item: item,
              $event: $event
            });
          };
        }]
      };
    }).directive('pieChart', function ($window) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var myChart = echarts.init(element[0]);
          $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {
            var legend = [];
            angular.forEach(newValue, function (val) {
              legend.push(val.name);
            });
            var option = {
              title: {
                text: 'Alarm Name Statics',
                subtext: 'Ratio',
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              series: [{
                name: 'Alarm',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: newValue,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }]
            };
            myChart.setOption(option);
          }, true);
          window.addEventListener("resize", function () { 
            myChart.resize();
          });
        }
      };
    }).directive('barChart', function ($window) {
      return {
        restrict: 'A', 
        link: function ($scope, element, attrs) { 
          var myChart = echarts.init(element[0]); 
          $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {
            var xData = [],
              sData = [],
              data = newValue;
            angular.forEach(data, function (val) {
              xData.push(val.name);
              sData.push(val.value);
            });
            var option = {
              title: {
                text: 'Alarm Priority Statics',
                subtext: 'Ratio',
                x: 'center'
              },
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                data: xData,
                axisTick: {
                  alignWithLabel: true
                }
              }],
              yAxis: [{
                type: 'value'
              }],
              series: [{
                name: 'Alarm Priority',
                type: 'bar',
                barWidth: '60%',
                data: sData
              }]
            };
            myChart.setOption(option);
          }, true); 
          $window.onresize = function () { 
            myChart.resize();
          };
        }
      };
    })
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
      $routeProvider.when('/', {
        controller: 'homeController',
        controllerAs: 'vm',
        templateUrl: 'views/home.html'
      });

      $routeProvider.when('/alarmManagement', {
        controller: 'alarmManageController',
        controllerAs: 'vm',
        templateUrl: 'views/alarmManage.html'
      });

      $routeProvider.when('/alarmMonitor', {
        controller: 'alarmMonitorController',
        controllerAs: 'vm',
        templateUrl: 'views/alarmMonitor.html'
      });

      $routeProvider.when('/alarmHistorian', {
        controller: 'alarmHistorianController',
        controllerAs: 'vm',
        templateUrl: 'views/alarmHistorian.html'
      });

      $routeProvider.otherwise({ redirectTo: "/" });
    }])

})();