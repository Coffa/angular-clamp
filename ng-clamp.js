(function() {
  angular
    .module('directives.clamp', [])
    .directive('clamp', clampDirective);

  clampDirective.$inject = ['$timeout'];
  function clampDirective($timeout) {
    var directive = {
      restrict: 'A',
      link: linkDirective
    };

    return directive;

    function linkDirective(scope, element, attrs) {
      $timeout(function() {
        var lineCount = 1, lineMax = +attrs.clamp;
        var lineStart = 0, lineEnd = 0;
        var text = element.html().replace(/\n/g, ' ');
        var maxWidth = element.width();
        var estimateTag = createElement();

        element.empty();
        element.append(estimateTag);

        text.replace(/ /g, function(m, pos) {
          if (lineCount >= lineMax) {
            return;
          } else {
            estimateTag.html(text.slice(lineStart, pos));
            if (estimateTag.width() > maxWidth) {
              estimateTag.html(text.slice(lineStart, lineEnd));
              resetElement(estimateTag);
              lineCount++;
              lineStart = lineEnd + 1;
              estimateTag = createElement();
              element.append(estimateTag);
            }
            lineEnd = pos;
          }
        });
        estimateTag.html(text.slice(lineStart));
        resetElement(estimateTag, true);

        scope.$emit('clampCallback', element, attrs);
      });
    }
  }

  return;

  function createElement() {
    var tagDiv = document.createElement('div');
    (function(s) {
      s.position = 'absolute';
      s.whiteSpace = 'pre';
      s.visibility = 'hidden';
      s.display = 'inline-block';
    })(tagDiv.style);

    return $(tagDiv);
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
