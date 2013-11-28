'use strict';

angular.module('bricksApp.ui', [
    'ngRoute',
    'bricksApp.common'
  ])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'scripts/ui/ui.html'
      });
  })

  .directive('ui', function (apps, beautify, components) {
    return {
      controller: function ($scope, $element) {
        var iframe = $element.find('iframe');
        var currentPage, selectedElement, view;

        // Changes the scope template attribute.
        var updateTemplate = function () {
          if (!view) {
            view = iframe.contents().find('div[ng-view]');
          }
          currentPage.template = beautify.html(view.html());
        };

        var selectElement = function (element) {
          if (!element.is('html, body, [ng-view]')) {
            selectedElement = element;
            $scope.$broadcast('selection');
          }
        };

        var selection = function (element) {
          if (element) {
            selectedElement = element;
            $scope.$broadcast('selection');
          } else {
            return selectedElement;
          }
        };

        var page = function (current) {
          if (current) {
            current.template = beautify.html(current.template);
            currentPage = current;
          } else {
            return currentPage || apps.current().pages[0];
          }
        };

        return {
          iframe: iframe,
          updateTemplate: updateTemplate,
          selectElement: selectElement,
          selection: selection,
          page: page
        };
      },

      link: function (scope) {
        components.all().then(function (all) {
          scope.components = all;
        });
      }
    };
  })

  .service('components', function ($http, $q, $templateCache) {
    var deferred = $q.defer();

    // Gets the components template and parses it to return an object.
    $http.get('components/components.html', {cache: $templateCache})
      .success(function (response) {
        var components = [];

        jQuery('<div>' + response + '</div>').find('component')
          .each(function (i, component) {
            var object = {};

            [].forEach.call(component.children, function (child) {
              object[child.nodeName.toLowerCase()] = child.innerHTML.trim();
            });
            components.push(object);
          });

        deferred.resolve(components);
      });

    return {
      all: function () {
        return deferred.promise;
      }
    };
  });