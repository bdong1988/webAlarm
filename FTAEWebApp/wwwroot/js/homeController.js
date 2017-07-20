(function () {
  'use strict';

  angular.module('ftaeApp')
    .controller('homeController', ['$scope', '$rootScope', '$http', 'SYSTEM_EVENT', 'toastService', homeController]);

  function homeController($scope, $rootScope, $http, SYSTEM_EVENT, toastService) {
    var vm = this;

    vm.init = function () {
      var vm = this;

      $rootScope.$broadcast(SYSTEM_EVENT.MEMU_CHANGED, { item: -1 });
    }

    vm.init();
  }
})();
