var app = angular.module('app', ['ngCookies']);
app.directive('setFocus', function(){
    return function(scope, element){
        element[0].focus();
    };
});
app.controller('login', function($scope, $http, $location, $timeout,$cookies,$document) {
    $scope.username = '';// 用户名
    $scope.password = '';// 密码
    $scope.isShowName = false; // 是否显示姓名叉叉
    $scope.isShowPass = false; // 是否显示密码叉叉
    $scope.noLogin = false; // 登录错误
    $scope.msg = '';
    $scope.bgcolor = 'noAcess'; // 登录背景
    $scope.getLogin = function() {
        if ($scope.username != '' && $scope.password != '') {                
            $http.post('login' , JSON.stringify({name:$scope.username, passwd:$scope.password}) , {
            headers : {'contentType' : 'application/json','url-mapping' : '/app/platform/login'}
            }).success(function(data, status, headers, config) {
                // console.log(data);
                var code = data.statusCode;
                if (code != 200){
                    $scope.noLogin = true;
                    $scope.msg = data.message;
                    $timeout(function(){$scope.noLogin = false;}, 3000);
                } else {
                    $scope.user = angular.fromJson(data.result);
                    console.log($scope.user);
                    $cookies.put('userId', $scope.user.id);// 用户ID
                    $cookies.put('token', $scope.user.token);// 用户token
                    $cookies.put('name', $scope.user.name);// 用户姓名
                    $cookies.put('loginName', $scope.user.loginName);// 用户登录账户
                    $cookies.put('avatar', $scope.user.avatar);// 用户登录头像ID
                    $cookies.put('loginTime', $scope.user.lastAccess.loginDate);// 用户最后登录时间
                    $cookies.put('authority', angular.toJson($scope.user.roles[0].authority));// 用户权限
                    window.location = 'index.html';                    
                }
                //...
            }).error(function(data, status, headers, config ) {
                alert(data);
            });
        } else {
            $scope.noLogin = true;
            $scope.msg = '登录名或密码不能为空';
            $timeout(function(){$scope.noLogin = false;}, 3000);
        }
    };
    $scope.checkpass = function() {        
        if ($scope.password == '') {
            $scope.bgcolor = 'noAcess';
            $scope.isShowPass = false;
            $scope.isAbled = false;
        } else if ($scope.username == '' && $scope.password != '') {
            $scope.isShowPass = true;
        } else if($scope.username != '' && $scope.password != '') {
            $scope.isShowPass = true;
            $scope.bgcolor = 'acess';
        }
    }; 
    $scope.checkname = function() {
        if ($scope.username == '') {
            $scope.isShowName = false;
            $scope.bgcolor = 'noAcess';
            $scope.isAbled = false;
        } else if ($scope.username != '' && $scope.password == '') {
            $scope.isShowName = true;
        } else if ($scope.username != '' && $scope.password != '') {
            $scope.bgcolor = 'acess';
            $scope.isShowName = true;
        }
    };
    $scope.clear = function(type) {
        if (type == 'name') {                
            $scope.username = '';// 用户名
            $scope.password = '';// 密码
            $scope.bgcolor = 'noAcess';
            $scope.isShowName = false; // 是否显示姓名叉叉
            $scope.isShowPass = false; // 是否显示密码叉叉s
        } else {
            $scope.bgcolor = 'noAcess';
            $scope.password = '';// 密码
            $scope.isShowPass = false; // 是否显示密码叉叉s
        }
    }
    $scope.keyEnter = function() {            
        $document.bind("keypress", function(e) {        
            var keycode = window.event?e.keyCode:e.which; 
            if(keycode == 13){
                $scope.getLogin();
            }
        });
    }()
});