// API
$(document).ready(function() {
  var fromDate = '';
  var topic = '';

  $('#btn1').on('click', function() {
    // Guardian
    fromDate = $('#fromDate').val().trim();

    topic = $('#topicInput').val().trim();
    if(topic == "") {
      $('.noSearch').removeClass('hide');
      function blink() {
        $('.noSearch').fadeOut(500).fadeIn(500, blink);
      };
      blink();
      setTimeout(function(){ $('.noSearch').addClass('hide'); }, 3000);
      return;
    };

    $('#input1').val('');

    var url = ("https://content.guardianapis.com/search?q=" + topic + "&from-date=" + fromDate + "&api-key=adcd1e3d-5fa2-401b-b6f3-aefcd666d186");

    var anArray = [];

    $.ajax({
      url: url,
      method: 'GET'
    })
    .done(function(response) {
      $( "#guardianDiv1" ).empty();
      $('#guardianDiv1').removeClass('hide');

      console.log(response);

      for (var i = 0; i < 9; i++) {
        var guardianSnippet = response.response.results[i].webTitle;
        var link = response.response.results[i].webUrl;
        anArray.push(guardianSnippet + " | ");
        $('#guardianDiv1').append('<p id="guardianSnippet" data-alt="' + link + '">' + '&bull; ' + guardianSnippet + '</p><br>');
      };
      $('#guardianDiv1').prepend('<h1>The Guardian: </h1>')
    });
    // NY Times
    fromDate = fromDate.replace(/-/g,"");
    if (fromDate == "") {
      fromDate = "20130101";
    }

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
      url += '?' + $.param({
      'api-key': "d75094cd314e4d3bb72232a3c0b82e00",
      'q': topic, 'begin_date': fromDate
    });

    var anArray2 = [];

    $.ajax({
      url: url,
      method: 'GET'
    })
    .done(function(response) {
      $('#guardianDiv2').empty();
      $('#guardianDiv2').removeClass('hide');
      console.log(response);

      for (var i = 0; i < 9; i++) {
        var nytSnippet = response.response.docs[i].headline.main;
        var link = response.response.docs[i].web_url;
        anArray2.push(nytSnippet + " | ");
        $('#guardianDiv2').append('<p id="nytSnippet" data-alt="' + link + '">' + '&bull; ' + nytSnippet + '</p><br>');
      };
      $('#guardianDiv2').prepend('<h1>The New York Times: </h1>')
    });
  });
});





// WORD CLOUD
var skipWords = ['the', 'The', 'of','and','a','to','in','is','you','that','it','he','was','for','on','are','as','with','his','they','I','at','be','this','have','from','or','one','had','by','word','but','not','what','all','were','we','when','your','can','there','use','an','each','which','she','do','how','their','if','will','up','other','about','out','many','then','them','these','so','some','her','would','make','like','him','into','time','has','look','two','more','go','see','no','way','could','my','than','been','call','who','its','now','long','down','day','did','get','come','may','part', 'href', '<p>', '</p>', '<a'];

function unique(list) {
  var result = [];
  $.each(list, function(i, e) {
    if ($.inArray(e, result) == -1) result.push(e);
  });
  return result;
};

function wordCount(s) {
  var wordArray = s.split(' ');
  var countArray = [];
  for (var i=0; i < wordArray.length; i++) {
    var x = wordArray[i];
    var xCount = 0;
//  loop through wordArray, incrementing count each time x == the current word
    for (var j=0; j < wordArray.length; j++) {
      if (wordArray[j] == x) {
        xCount++;
      };
    };
    if (skipWords.indexOf(x) < 0 && x.length < 12 && x.indexOf('&') < 0 && x.indexOf('"') < 0 && x.indexOf('<') < 0 && x.indexOf('>') < 0) {
      countArray.push([x, xCount * 10]);
    };
  };
  
  var hash = {};
  var out = [];
  for (var i = 0, l = countArray.length; i < l; i++) {
    var key = countArray[i].join('|');
    if (!hash[key]) {
      out.push(countArray[i]);
      hash[key] = 'found';
    }
  }
  return out;
}


  // Guardian headline on click
  var guardianArticleURL = '';
  var article1 = '';


  $(document).on('click', '#guardianSnippet', function() {
    guardianArticleURL = $(this).attr('data-alt');
    $.getJSON('https://api.embedly.com/1/extract?' + $.param({
      url: guardianArticleURL,
      key: 'aa992939d6f74f4090e6ea8d7dac9d1b'
    }))
    .done(function(response) {
      article1 = response.content;
      console.log(response);
      var dupeArr1 = wordCount(article1);
      var finalArticle1 = unique(dupeArr1);
      WordCloud(document.getElementById('canvas1'), { list: finalArticle1 } );
      $('#canvas1').removeClass('hide');
    });
  });
  

  // NY Times headline on click
  var nytArticleURL = '';
  var article2 = '';


  $(document).on('click', '#nytSnippet', function() {
    nytArticleURL = $(this).attr('data-alt');
    $.getJSON('https://api.embedly.com/1/extract?' + $.param({
      url: nytArticleURL,
      key: 'aa992939d6f74f4090e6ea8d7dac9d1b'
    }))
    .done(function(response) {
      article2 = response.content;
      var dupeArr2 = wordCount(article2);
      var finalArticle2 = unique(dupeArr2);
      WordCloud(document.getElementById('canvas2'), {list: finalArticle2});
      $('#canvas2').removeClass('hide');
    });
  });