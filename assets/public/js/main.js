(function() {

  // mailcheck to auto-correct emails
  $(function() {

    var $mailCheckSuggestion = $('#mailcheck-suggestion');
    var $mailCheckAnchor = $('#mailcheck-a');
    var $mailCheckInput = $('#mailcheck-input');

    $mailCheckInput.on('keyup', function(ev) {
      var $that = $(this);
      // only suggest mailcheck
      // if there is a `@` + 1 character + `.`
      var val = $that.val();
      if (val.indexOf('@') === -1 || val.lastIndexOf('.') < val.indexOf('@') || val.lastIndexOf('.') - 1 === val.indexOf('@')) {
        $mailCheckSuggestion.addClass('hidden');
        return;
      }
      $that.mailcheck({
        suggested: function(el, suggestion) {
          $mailCheckAnchor.text(suggestion.full);
          $mailCheckSuggestion.removeClass('hidden');
        },
        empty: function(el) {
          $mailCheckSuggestion.addClass('hidden');
        }
      });
    });

    $mailCheckAnchor.on('click', function(ev) {
      ev.preventDefault();
      var email = $(this).text();
      $mailCheckInput.val(email);
      $mailCheckSuggestion.addClass('hidden');
    });

  });

}());
