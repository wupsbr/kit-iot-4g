//Auth
app.service("Auth", function ($rootScope, Storage, $location) {
  'use strict';

  this.isLoggedIn = function () {
    return Storage.get("token");
  };

  this.hasLonLat = function () {
    return Storage.get('lonLat');
  };

  this.login = function (usuario, password, token, apikey, name, email, tel) {
    $rootScope.name     = name;
    $rootScope.token    = token;
    $rootScope.usuario  = usuario;
    $rootScope.password = password;
    $rootScope.apikey  = apikey;

    Storage.put('usuario', usuario);
    Storage.put('password', password);
    Storage.put('token', token);
    Storage.put('apikey', apikey);
    Storage.put('name', name);
    Storage.put('email', email);
    Storage.put('tel', tel);
  };

  this.logout = function () {
    $rootScope.name     = null;
    $rootScope.token    = null;
    $rootScope.apikey   = null;
    $rootScope.usuario  = null;
    $rootScope.password = null;
    $rootScope.lonLat   = null;

    Storage.delete('usuario');
    Storage.delete('password');
    Storage.delete('token');
    Storage.delete('apikey');
    Storage.delete('name');
    Storage.delete('email');
    Storage.delete('tel');
    Storage.delete('lonLat');
  };
});
