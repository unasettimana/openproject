//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

import {wpDirectivesModule} from '../../../../angular-modules';
import {WorkPackageRelationsController} from "../../wp-relations.directive";
import {WorkPackageRelationsHierarchyController} from "../../wp-relations-hierarchy/wp-relations-hierarchy.directive";
import {WorkPackageResourceInterface} from "../../../api/api-v3/hal-resources/work-package-resource.service";

function wpRelationsAutocompleteDirective($q, PathHelper, $http, I18n) {
  return {
    restrict: 'E',
    templateUrl: '/components/wp-relations/wp-relations-create/wp-relations-autocomplete/wp-relations-autocomplete.template.html',
    require: ['^wpRelations', '?^wpRelationsHierarchy'],
    scope: {
      selectedWpId: '=',
      selectedRelationType: '=',
      filterCandidatesFor: '@',
      workPackage: '='
    },
    link: function (scope, element, attrs, controllers) {
      scope.text = {
        placeholder: I18n.t('js.relations_autocomplete.placeholder')
      };
      scope.options = [];
      scope.relatedWps = [];

      scope.onSelect = (selected) => {
        scope.selectedWpId = selected.id;
      };

      scope.getIdentifier = function(workPackage){
        if (workPackage) {
          return `#${workPackage.id} - ${workPackage.subject}`;
        }
      };

      scope.autocompleteWorkPackages = (query) => {
        if (!query) {
          return [];
        }

        return scope.workPackage
          .available_relation_candidates.$link.$fetch({
            query: query,
            type: scope.filterCandidatesFor
          }, {
            'caching': {
              enabled: false
            }
          }).then(collection => {
            return collection.elements;
          });
      };

      scope.$watch('autocompleteIsOpen', (isOpen) => {
        if (isOpen) {
          var searchInput = angular.element('input[uib-typeahead]');
          angular.element('.dropdown-menu').width(searchInput.outerWidth());
        }
      });
    }
  };
}

wpDirectivesModule.directive('wpRelationsAutocomplete', wpRelationsAutocompleteDirective);
