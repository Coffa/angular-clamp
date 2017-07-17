(function() {
  angular
    .module('directives.clamp', [])
    .directive('clamp', clampDirective);

  function clampDirective($timeout, $rootScope) {
    var directive = {
      restrict: 'A',
      scope: {
        clampExpandable: '@',
        disabledForSeo: '@',
        clampAutoresize: '@'
      },
      link: linkDirective
    };

    return directive;

    function linkDirective(scope, element, attrs) {
      var originalHtml = '';

      var reset = function reset() {
        $timeout(function() {
          element.css('display', 'block');

          originalHtml = element.html();

          doClamp(scope, element, attrs, originalHtml);
        });
      };

      // ==========

      if (scope.clampAutoresize === 'true') {
        $rootScope.$on('window_resized', function() {
          doClamp(scope, element, attrs, originalHtml);
        });
      }

      // hide the element for a bit to prevent flicker
      element.css('display', 'none');

      reset();

      // a way to refresh all clampings without data binding
      scope.$on('clampReset', reset);
    }
  }

  return;

  function doClamp(scope, element, attrs, originalHtml) {
    var lineCount = 1, lineMax = isNaN(attrs.clamp) ? 3 : +attrs.clamp;
    var lineStart = 0, lineEnd = 0;

    var expandable = scope.clampExpandable === 'true';
    var shouldExpand = false;

    // reset
    element.html(originalHtml);

    // 2 things:
    // - we need only the text for clamping & remove excessive spaces (>1 to 1)
    // - append a whitespace, so that the exact last word (rare case) will be calculated
    var text = element.text().replace(/\s+/g, ' ') + ' ';
    var maxWidth = element[0].offsetWidth ;
    var estimateTag = createElement();

    element.empty();
    element.append(estimateTag);

    text.replace(/ /g, function(m, pos) {
      if (lineCount <= lineMax) {
        estimateTag.html(text.slice(lineStart, pos));

        if (estimateTag[0].offsetWidth > maxWidth) {
          lineCount++;

          if (lineCount > lineMax) {
            shouldExpand = true;
            return;
          }

          estimateTag.html(text.slice(lineStart, lineEnd));
          resetElement(estimateTag);
          lineStart = lineEnd + 1;
          estimateTag = createElement();
          element.append(estimateTag);
        }

        lineEnd = pos;
      }
    });
    estimateTag.html(text.slice(lineStart));
    resetElement(estimateTag, true);

    if (expandable && shouldExpand) {
      element.css('cursor', 'pointer');

      // clean up
      element.off('click');

      element.one('click', function() {
        element.html(originalHtml);
        element.css('cursor', 'default');
      });

      var showMore = angular.element('<a style="display: block; text-align: center">Read more</a>');

      element.append(showMore);
    }
  }

  function createElement() {
    var tagDiv = document.createElement('div');
    (function(s) {
      s.position = 'absolute';
      s.whiteSpace = 'pre';
      s.visibility = 'hidden';
      s.display = 'inline-block';
    })(tagDiv.style);

    return angular.element(tagDiv);
  }

  function resetElement(element, type) {
    element.css({
      position: 'inherit',
      overflow: 'hidden',
      display: 'block',
      textOverflow: (type ? 'ellipsis' : 'clip'),
      visibility: 'inherit',
      whiteSpace: 'nowrap',
      width: '100%'
    });
  }
})();
