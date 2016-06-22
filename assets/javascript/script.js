var clickSound = new Audio("assets/sounds/click_sound.mp3")
var quoteArray = ['"The people will believe what the media tells them they believe." -George Orwell', '"A nation of sheep will beget a government of wolves." ―Edward R. Murrow', '"Whoever controls the media, controls the mind." -Jim Morrison', '"If everything is amplified, we hear nothing." -Jon Stewart', '“Manipulating the media is akin to poisoning a nation’s water supply – it affects all of our lives in unimaginable ways.” -Lance Morcan', '“Until you realize how easily it is for your mind to be manipulated, you remain the puppet of someone else\'s game." -Evita Ochel', '“It doesn\'t matter if justice is on your side. You have to depict your position as just.” -Benjamin Netanyahu', '"Think of the press as a great keyboard on which the government can play." -Joseph Goebbels']
var quoteNumber = 1;


// API
$(document).ready(function() {
  var fromDate = '';
  var topic = '';

  var intervalID;

  function quoteFunction() {
    intervalID = setInterval(changeQuote, 10 * 1000);
  };

  var changeQuote = function() {
    if (quoteNumber == 0) {
      $('#scrollingQuote').html('<p style="font-family: \'Merriweather\', serif;">' + quoteArray[0] + '</p>');
    } else if (quoteNumber == 1) {
      $('#scrollingQuote').html('<p style="font-family: \'Titillium Web\', sans-serif;">' + quoteArray[1] + '</p>');
    } else if (quoteNumber == 2) {
      $('#scrollingQuote').html('<p style="font-family: \'Libre Baskerville\', serif;">' + quoteArray[2] + '</p>');
    } else if (quoteNumber == 3) {
      $('#scrollingQuote').html('<p style="font-family: \'Libre Franklin\', sans-serif;">' + quoteArray[3] + '</p>');
    } else if (quoteNumber == 4) {
      $('#scrollingQuote').html('<p style="font-family: \'Prompt\', sans-serif;">' + quoteArray[4] + '</p>');
    } else if (quoteNumber == 5) {
      $('#scrollingQuote').html('<p style="font-family: \'Amiri\', serif;">' + quoteArray[5] + '</p>');
    } else if (quoteNumber == 6) {
      $('#scrollingQuote').html('<p style="font-family: \'Taviraj\', serif;">' + quoteArray[6] + '</p>');
    } else if (quoteNumber == 7) {
      $('#scrollingQuote').html('<p style="font-family: Times New Roman">' + quoteArray[7] + '</p>');
    } else if (quoteNumber > 7 ) {
      quoteNumber = 0;
    };
    quoteNumber++;
  };

  $('#scrollingQuote').html('<p style="font-family: Times New Roman">' + quoteArray[0] + '</p>');
  quoteFunction();

  $(document).keydown(function(e) {
    var key = e.which;
    if (key == 13) {
      $('#btn1').click();
      return false;
    }
  });


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

    $('#topicInput').val('');

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
var skipWords = ['the', 'A', 'The', 'of','and','a','to','in','is','you','that','it','he','was','for','on','are','as','with','his','they', 'at','be','this','have','from','or','one','had','by','word','but','not','what','all','were','we','when','your','can','there','use','an','each','which','she','do','how','their','if','will','up','other','about','out','many','then','them','these','so','some','her','would','make','like','him','into','time','has','look','two','more','go','see','no','way','could','my','than','been','call','who','its','now','long','down','day','did','get','come','may','part', 'href', '<p>', '</p>', '<a', 'It', 'it\s', 'Mr.', 'Mrs.', '+', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ''];

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
    if (skipWords.indexOf(x) < 0 && x.length < 12 && x.length > 2 && x.indexOf('&') < 0 && x.indexOf('"') < 0 && x.indexOf('<') < 0 && x.indexOf('>') < 0) {
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
    clickSound.play();
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
    clickSound.play();
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