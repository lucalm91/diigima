(function($) {
    var $body = $('body'),
        $main = $('#main'),
        $articles = $main.children('article');

    // Show the specific article based on hash
    function showArticle(hash) {
        var $article = $articles.filter(hash);

        // If the article doesn't exist, do nothing
        if ($article.length === 0) return;

        // Hide all articles and show the specific one
        $articles.hide();
        $article.show();
        $body.addClass('is-article-visible');
    }

    // Event: On page load
    $(window).on('load', function() {
        if (location.hash) {
            showArticle(location.hash); // Show article based on hash
        }
    });

    // Event: On hash change
    $(window).on('hashchange', function() {
        if (location.hash) {
            showArticle(location.hash); // Show article based on hash
        } else {
            $articles.hide(); // Hide all articles if no hash
            $body.removeClass('is-article-visible');
        }
    });

})(jQuery);
