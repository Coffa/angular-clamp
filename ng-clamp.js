angular.module('ngClamp', [])
  .directive('clamp', ['$timeout', function($timeout) {
    return function(scope, element, attrs) {
      $timeout(function() {
        var lineCount = 1, lineMax = +attrs.clamp;
        var lineStart = 0, lineEnd = 0;
        var text = element.html().replace(/\n/g, ' ');
        var maxWidth = element.width();
        var estimateTag = createElement();

        element.empty();
        element.append(estimateTag);

        text.replace(/ /g, function(m, pos) {
          if (lineCount > lineMax) {
            return;
          } else if (lineCount === lineMax) {
            estimateTag.html(text.slice(lineStart));
            resetElement(estimateTag, true);
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
        resetElement(estimateTag, true);

        if (scope.clampCallback) { scope.clampCallback(element, attrs);}
      })

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
    };
  }]);
