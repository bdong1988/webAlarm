(function () {
  'use strict';

  angular.module('ftaeApp')
    .controller('alarmManageController', ['$scope','$rootScope', '$http','SYSTEM_EVENT', 'toastService', alarmManageController]);

  function alarmManageController($scope, $rootScope, $http, SYSTEM_EVENT, toastService) {
    var vm = this;

    $scope.$on(SYSTEM_EVENT.SERVER_CLICK, function (event, msg) {
      vm.serverPath = msg.item.path;
      vm.onQueryAlarmConfigList(msg.item);
    });

    vm.onQueryAlarmConfigList = function (item) {
      vm.serverPath = item.path;
      vm.onRefresh();
    }

    vm.parseAlarmConfigList = function (alarmConfigList) {
      for (var i = 0; i < alarmConfigList.length; i++) {
        var alarm = alarmConfigList[i];

        var item = {
          alarmName: alarm.alarmName,
          alarmClass: { value: alarm.alarmClass, bDirty: false },
          ackedDataItem: { value: alarm.ackedDataItem, bDirty: false },
          acknowledgementRequired: { value: alarm.acknowledgementRequired, bDirty: false },
          delayInterval: { value: alarm.delayInterval, bDirty: false },
          disabledDataItem: { value: alarm.disabledDataItem, bDirty: false },
          enableTag: { value: alarm.enableTag, bDirty: false },
          grpID: { value: alarm.grpID, bDirty: false },
          inAlarmDataItem: { value: alarm.inAlarmDataItem, bDirty: false },
          latched: { value: alarm.latched, bDirty: false },
          msgID: { value: alarm.msgID, bDirty: false },
          remoteAckAll: { value: alarm.remoteAckAll, bDirty: false },
          remoteDisable: { value: alarm.remoteDisable, bDirty: false },
          remoteEnable: { value: alarm.remoteEnable, bDirty: false },
          remoteShelveAll: { value: alarm.remoteShelveAll, bDirty: false },
          remoteShelveDuration: { value: alarm.remoteShelveDuration, bDirty: false },
          remoteSuppress: { value: alarm.remoteSuppress, bDirty: false },
          remoteUnShelveAll: { value: alarm.remoteUnShelveAll, bDirty: false },
          remoteUnSuppress: { value: alarm.remoteUnSuppress, bDirty: false },
          resetRemoteAckAll: { value: alarm.resetRemoteAckAll, bDirty: false },
          resetRemoteDisable: { value: alarm.resetRemoteDisable, bDirty: false },
          resetRemoteEnable: { value: alarm.resetRemoteEnable, bDirty: false },
          resetRemoteShelveAll: { value: alarm.resetRemoteShelveAll, bDirty: false },
          resetRemoteSuppress: { value: alarm.resetRemoteSuppress, bDirty: false },
          resetRemoteUnShelveAll: { value: alarm.resetRemoteUnShelveAll, bDirty: false },
          resetRemoteUnSuppress: { value: alarm.resetRemoteUnSuppress, bDirty: false },
          severityConstantValue: { value: parseInt(alarm.severityConstantValue), bDirty: false },
          severityDataItem: { value: alarm.severityDataItem, bDirty: false },
          severityIsConstant: { value: alarm.severityIsConstant, bDirty: false },
          suppressedDataItem: { value: alarm.suppressedDataItem, bDirty: false },
          userData: { value: alarm.userData, bDirty: false },
          shelvedDataItem: { value: alarm.shelvedDataItem, bDirty: false },
          style: { value: alarm.style, bDirty: false },
          sourceDataItem: { value: alarm.sourceDataItem, bDirty: false},
          messageParams:[],
          bSelect: false,
          bDirty: false,
          bDelete: false,
          bNew: false
        };
        angular.copy(alarm.messageParams, item.messageParams);

        vm.alarmConfigs.push(item);
      }
    }

    vm.onAdd = function () {
      var item = {
        alarmName: '',
        alarmClass: { value: '', bDirty: false },
        ackedDataItem: { value: '', bDirty: false },
        acknowledgementRequired: { value: -1, bDirty: false },
        delayInterval: { value: 0, bDirty: false },
        disabledDataItem: { value: '', bDirty: false },
        enableTag: { value: 0, bDirty: false },
        grpID: { value: 0, bDirty: false },
        inAlarmDataItem: { value: '', bDirty: false },
        latched: { value: -1, bDirty: false },
        msgID: { value: 0, bDirty: false },
        remoteAckAll: { value: '', bDirty: false },
        remoteDisable: { value: '', bDirty: false },
        remoteEnable: { value: '', bDirty: false },
        remoteShelveAll: { value: '', bDirty: false },
        remoteShelveDuration: { value: '', bDirty: false },
        remoteSuppress: { value: '', bDirty: false },
        remoteUnShelveAll: { value: '', bDirty: false },
        remoteUnSuppress: { value: '', bDirty: false },
        resetRemoteAckAll: { value: 0, bDirty: false },
        resetRemoteDisable: { value: 0, bDirty: false },
        resetRemoteEnable: { value: 0, bDirty: false },
        resetRemoteShelveAll: { value: 0, bDirty: false },
        resetRemoteSuppress: { value: 0, bDirty: false },
        resetRemoteUnShelveAll: { value: 0, bDirty: false },
        resetRemoteUnSuppress: { value: 0, bDirty: false },
        severityConstantValue: { value: 500, bDirty: false },
        severityDataItem: { value: '', bDirty: false },
        severityIsConstant: { value: -1, bDirty: false },
        suppressedDataItem: { value: '', bDirty: false },
        userData: { value: '', bDirty: false },
        shelvedDataItem: { value: '', bDirty: false },
        style: { value: 0, bDirty: false },
        sourceDataItem: { value: '', bDirty: false },
        messageParams: [],
        bSelect: false,
        bDirty: true,
        bDelete: false,
        bNew: true
      };

      vm.alarmConfigs.push(item);
      vm.dataDirty = true;
    }

    vm.onDelete = function () {
      $('#deleteModal').modal();
    }

    vm.deleteItems = function () {
      $('#deleteModal').modal('hide');
      for (var i = 0; i < vm.alarmConfigs.length; i++) {
        var alarm = vm.alarmConfigs[i];
        if (alarm.bSelect) {
          alarm.bDelete = true;
        }
      }
      vm.bSelectCurrentPage = false;
      vm.dataDirty = true;
    }

    vm.onSourceTagChange = function (valid) {
      if (!valid) {
        toastService.toast('error', 'Invalid source tag format', 'Edit alarm')
      }
    }

    vm.onRefresh = function () {
      vm.alarmConfigs = [];
      var url = '/api/applications/servers/alarms?serverpath=' + vm.serverPath;
      $http.get(url)
        .then(function (response) {
          vm.parseAlarmConfigList(response.data);
          toastService.toast('success', 'Get Alarm Config List Successful', 'Alarm Management')
        }, function (error) {
          toastService.toast('error', 'Failed to query alarm configs', 'Alarm Management')
          vm.errorMessage = 'Failed to query alarm configs';
        })
        .finally(function () {
        });
    }

    vm.onSync = function () {
      var deleteNameList = [];
      var updateListItems = [];
      for (var i = 0; i < vm.alarmConfigs.length; i++) {
        var config = vm.alarmConfigs[i];
        if ((!config.bNew) && config.bDelete) {
          deleteNameList.push(config.alarmName);
        }
        else if ((config.bDirty || config.bNew) && !config.bDelete) {
          var item = {
            alarmName: config.alarmName,
            alarmClass: config.alarmClass.value,
            ackedDataItem: config.ackedDataItem.value,
            acknowledgementRequired: config.acknowledgementRequired.value,
            delayInterval: config.delayInterval.value,
            disabledDataItem: config.disabledDataItem.value,
            enableTag: config.enableTag.value,
            grpID: config.grpID.value,
            inAlarmDataItem: config.inAlarmDataItem.value,
            latched: config.latched.value,
            msgID: config.msgID.value,
            remoteAckAll: config.remoteAckAll.value,
            remoteDisable: config.remoteDisable.value,
            remoteEnable: config.remoteEnable.value,
            remoteShelveAll: config.remoteShelveAll.value,
            remoteShelveDuration: config.remoteShelveDuration.value,
            remoteSuppress: config.remoteSuppress.value,
            remoteUnShelveAll: config.remoteUnShelveAll.value,
            remoteUnSuppress: config.remoteUnSuppress.value,
            resetRemoteAckAll: config.resetRemoteAckAll.value,
            resetRemoteDisable: config.resetRemoteDisable.value,
            resetRemoteEnable: config.resetRemoteEnable.value,
            resetRemoteShelveAll: config.resetRemoteShelveAll.value,
            resetRemoteSuppress: config.resetRemoteSuppress.value,
            resetRemoteUnShelveAll: config.resetRemoteUnShelveAll.value,
            resetRemoteUnSuppress: config.resetRemoteUnSuppress.value,
            severityConstantValue: config.severityConstantValue.value,
            severityDataItem: config.severityDataItem.value,
            severityIsConstant: config.severityIsConstant.value,
            suppressedDataItem: config.suppressedDataItem.value,
            userData: config.userData.value,
            shelvedDataItem: config.shelvedDataItem.value,
            style: config.style.value,
            sourceDataItem: config.sourceDataItem.value,
            messageParams: []
          };
          updateListItems.push(item);
        }
      };

      var syncInfo = { deleteList: deleteNameList, updateList: updateListItems };

      var url = '/api/applications/servers/alarms?serverpath=' + vm.serverPath ;
      $http.post(url, syncInfo)
        .then(function (response) {
          toastService.toast('success', 'Syncnize Alarm Configuration Success', 'Alarm Management')
          //vm.onRefresh();
        }, function (error) {
          toastService.toast('error', 'Failed to Synchnize Alarm Configurations', 'Alarm Management')
          vm.errorMessage = 'Failed to query alarm configs';
          
        })
        .finally(function () {    
        });

    }

    vm.onEdit = function (alarm, index) {
      var item = {
        alarmName: alarm.alarmName,
        alarmClass: { value: alarm.alarmClass.value, bDirty: false },
        ackedDataItem: { value: alarm.ackedDataItem.value, bDirty: false },
        acknowledgementRequired: { value: alarm.acknowledgementRequired.value, bDirty: false },
        delayInterval: { value: alarm.delayInterval.value, bDirty: false },
        disabledDataItem: { value: alarm.disabledDataItem.value, bDirty: false },
        enableTag: { value: alarm.enableTag.value, bDirty: false },
        grpID: { value: alarm.grpID.value, bDirty: false },
        inAlarmDataItem: { value: alarm.inAlarmDataItem.value, bDirty: false },
        latched: { value: alarm.latched.value, bDirty: false },
        msgID: { value: alarm.msgID.value, bDirty: false },
        remoteAckAll: { value: alarm.remoteAckAll.value, bDirty: false },
        remoteDisable: { value: alarm.remoteDisable.value, bDirty: false },
        remoteEnable: { value: alarm.remoteEnable.value, bDirty: false },
        remoteShelveAll: { value: alarm.remoteShelveAll.value, bDirty: false },
        remoteShelveDuration: { value: alarm.remoteShelveDuration.value, bDirty: false },
        remoteSuppress: { value: alarm.remoteSuppress.value, bDirty: false },
        remoteUnShelveAll: { value: alarm.remoteUnShelveAll.value, bDirty: false },
        remoteUnSuppress: { value: alarm.remoteUnSuppress.value, bDirty: false },
        resetRemoteAckAll: { value: alarm.resetRemoteAckAll.value, bDirty: false },
        resetRemoteDisable: { value: alarm.resetRemoteDisable.value, bDirty: false },
        resetRemoteEnable: { value: alarm.resetRemoteEnable.value, bDirty: false },
        resetRemoteShelveAll: { value: alarm.resetRemoteShelveAll.value, bDirty: false },
        resetRemoteSuppress: { value: alarm.resetRemoteSuppress.value, bDirty: false },
        resetRemoteUnShelveAll: { value: alarm.resetRemoteUnShelveAll.value, bDirty: false },
        resetRemoteUnSuppress: { value: alarm.resetRemoteUnSuppress.value, bDirty: false },
        severityConstantValue: { value: alarm.severityConstantValue.value, bDirty: false },
        severityDataItem: { value: alarm.severityDataItem.value, bDirty: false },
        severityIsConstant: { value: alarm.severityIsConstant.value, bDirty: false },
        suppressedDataItem: { value: alarm.suppressedDataItem.value, bDirty: false },
        userData: { value: alarm.userData.value, bDirty: false },
        shelvedDataItem: { value: alarm.shelvedDataItem.value, bDirty: false },
        style: { value: alarm.style.value, bDirty: false },
        sourceDataItem: { value: alarm.sourceDataItem.value, bDirty: false },
        messageParams: [],
        bSelect: alarm.bSelect,
        bDirty: alarm.bDirty,
        bDelete: alarm.bDelete,
        bNew: alarm.bNew
      };
      vm.tempEditAlarm = item;
      vm.editAlarm = alarm;
      vm.editConfigIndex = index;
      $('#editModal').modal();
    }

    vm.configEdit = function () {
      vm.alarmConfigs[vm.editConfigIndex] = vm.tempEditAlarm;
      vm.editAlarm = vm.tempEditAlarm;
      vm.dataDirty = true;
      $('#editModal').modal('hide');
    }
    vm.selectAll = function () {
      for (var i = 0; i < vm.alarmConfigs.length; i++) {
        vm.alarmConfigs[i].bSelect = !vm.alarmConfigs[i].bSelect;
      }
    }

    vm.onItemChange = function (alarm, alarmInfo) {
      alarmInfo.bDirty = true;
      alarm.bDirty = true;
      vm.dataDirty = true;
    }

    vm.init = function () {
      $rootScope.$broadcast(SYSTEM_EVENT.MEMU_CHANGED, { item: 0 });

      vm.errorMessage = '';
      vm.isBusy = false;
      vm.dataDirty = false;
      vm.bSelectAll = false;
      vm.columnHeaders = [
        'AlarmName',
        'SourceTag',
        'Severity',
        'AlarmClass',
        'Edit'
      ];
      vm.serverPath = '';
      vm.alarmConfigs = [];
      vm.editAlarm = {};
      vm.tempEditAlarm = {};
      vm.editConfigIndex = 0;
    }
    vm.init();
  }
})();
