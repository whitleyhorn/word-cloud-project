// Group Project 1: The NewsCloud
// Team members: Nancy Lukas, Whitley Horn, Tom Keel
// Presentation Date: June 25, 2016



// Sound to play when user clicks headline
var clickSound = new Audio("assets/sounds/click_sound.mp3")

// Array of quotes about media to be displayed on the screen
var quoteArray = ['"The people will believe what the media tells them they believe." -George Orwell', '"A nation of sheep will beget a government of wolves." ―Edward R. Murrow', '"Whoever controls the media, controls the mind." -Jim Morrison', '"If everything is amplified, we hear nothing." -Jon Stewart', '“Manipulating the media is akin to poisoning a nation’s water supply – it affects all of our lives in unimaginable ways.” -Lance Morcan', '“Until you realize how easily it is for your mind to be manipulated, you remain the puppet of someone else\'s game." -Evita Ochel', '"All I know is just what I read in the papers, and that\'s an alibi for my ignorance." - Will Rogers', '"Think of the press as a great keyboard on which the government can play." -Joseph Goebbels']
var quoteNumber = 1;


var wordCloudsLoaded = 0;

var searchNum = 0;

$(document).ready(function() {
  var fromDate = '';
  var topic = '';
  var intervalID;

  function quoteFunction() {
    intervalID = setInterval(changeQuote, 10 * 1000);
  };

// New font for each new quote
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

  // Show first quote on document ready, then begin changing them
  $('#scrollingQuote').html('<p style="font-family: \'Merriweather\', serif;">' + quoteArray[0] + '</p>');
  quoteFunction();

  // Enter key activates button 1 onClick function
  $(document).keydown(function(e) {
    var key = e.which;
    if (key == 13) {
      $('#btn1').click();
      return false;
    }
  });



// When "search" is clicked..
  $('#btn1').on('click', function() {

    // Store date to search from and search term
    fromDate = $('#fromDate').val().trim();

    topic = $('#topicInput').val().trim();

    // If no search term entered, alert user; else, hide search box
    if(topic == "") {
      $('.noSearch').removeClass('hide');
      function blink2() {
        $('.noSearch').fadeOut(500).fadeIn(500, blink2);
      };
      blink2();
      setTimeout(function(){ $('.noSearch').addClass('hide'); }, 3000);
      return;
    } else {
      $('.searchArea').addClass('hide');
      $('.searchAgainDiv').removeClass('hide');
    };

    $('#topicInput').val('');

    var url = ("https://content.guardianapis.com/search?q=" + topic + "&from-date=" + fromDate + "&api-key=adcd1e3d-5fa2-401b-b6f3-aefcd666d186");

    var anArray = [];

    $.ajax({
      url: url,
      method: 'GET'
    })
    .done(function(response) {
      $('#guardianDiv').empty();
      $('#guardianDiv').removeClass('hide');

      console.log(response);

      for (var i = 0; i < 7; i++) {
        var guardianSnippet = response.response.results[i].webTitle;
        var link = response.response.results[i].webUrl;
        anArray.push(guardianSnippet + " | ");
        // Populate div with Guardian headlines & URL; store article URL as data-alt
        $('#guardianDiv').append('<p id="guardianSnippet" data-alt="' + link + '">' + '&bull; ' + guardianSnippet + ' ' + '<a href="' + link + '" target="_blank"><i class="fa fa-external-link" aria-hidden="true"></i></a></p><br>');
      };
      $('#guardianDiv').prepend('<h1>The Guardian: </h1>')
    });
    // NY Times
    // Format fromDate for NY Times API (thanks Tom)
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
      $('#nytDiv').empty();
      $('#nytDiv').removeClass('hide');
      console.log(response);

      for (var i = 0; i < 7; i++) {
        var nytSnippet = response.response.docs[i].headline.main;
        var link = response.response.docs[i].web_url;
        anArray2.push(nytSnippet + " | ");
        // Populate div with NYTimes headlines & URL; store article URL as data-alt
        $('#nytDiv').append('<p id="nytSnippet" data-alt="' + link + '">' + '&bull; ' + nytSnippet + ' ' + '<a href="' + link + '" target="_blank"><i class="fa fa-external-link" aria-hidden="true"></i></a></p><br>');
      };
      $('#nytDiv').prepend('<h1>The New York Times: </h1>')
    });
  });
});

$('#searchAgainP').on('click', function() {
  $('.searchAgainDiv').addClass('hide');
  $('.searchArea').removeClass('hide');
})

// X out of instruction cloud
$('#xIcon').on('click', function() {
  $('#cloud').addClass('hide');
})


// WORD CLOUD
var skipWords = ['the', 'A', 'The', 'said', 'should','let\'s', 'of','and','a','to','in','is','you','that','it','he','was','for','on','are','as','with','his','they', 'at','be','this','have','from','or','one','had','by','word','but','not','what','all','were','we','when','your','can','there','use','an','each','which','she','do','how','their','if','will','up','other','about','out','many','then','them','these','so','some','her','would','make','like','him','into','time','has','look','two','more','go','see','no','way','could','my','than','been','call','who','its','now','long','down','day','did','get','come','may','part', 'href', '<p>', '</p>', '<a', 'It', 'it\'s', 'Mr.', 'Mrs.', '+', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ''];


// Pass in article text, return array of words used and frequency of each word
function wordCount(s) {
  var wordArray = s.split(' ');
  var countArray = [];
  for (var i=0; i < wordArray.length; i++) {
    var x = wordArray[i];
    var xCount = 0;
    // Loop through wordArray, incrementing count each time x == the current word
    for (var j=0; j < wordArray.length; j++) {
      if (wordArray[j] == x) {
        xCount++;
      };
    };
    // Filter out words that aren't useful for wordcloud, image URLs, etc.
    if (skipWords.indexOf(x) < 0 && x.length < 12 && x.length > 2 && x.indexOf('&') < 0 && x.indexOf('"') < 0 && x.indexOf('<') < 0 && x.indexOf('>') < 0) {
      countArray.push([x, xCount * 10]);
    };
  };
  // Prevent function from returning duplicate arrays -- thanks http://stackoverflow.com/a/26261010
  var hash = {};
  var out = [];
  for (var i = 0; i < countArray.length; i++) {
    var key = countArray[i].join('|');
    if (!hash[key]) {
      out.push(countArray[i]);
      hash[key] = 'found';
    }
  };
  return out;
}

  var guardianArticleURL = '';
  var article1 = '';


  $(document).on('click', '#guardianSnippet', function() {
    wordCloudsLoaded++;
    clickSound.play();
    guardianArticleURL = $(this).attr('data-alt');
    $.getJSON('https://api.embedly.com/1/extract?' + $.param({
      url: guardianArticleURL,
      key: 'aa992939d6f74f4090e6ea8d7dac9d1b'
    }))
    .done(function(response) {
      article1 = response.content;
      console.log(response);
      var cloudArr1 = wordCount(article1);
      // Generate word cloud in canvas
      WordCloud(document.getElementById('canvas1'), {color: 'random-dark', list: cloudArr1 } );
      $('#canvas1').removeClass('hide');
      if (wordCloudsLoaded == 1) {
        $('#cloud').removeClass('hide');
      };
    });
  });
  

  // NY Times headline on click
  var nytArticleURL = '';
  var article2 = '';


  $(document).on('click', '#nytSnippet', function() {
    wordCloudsLoaded++;
    clickSound.play();
    nytArticleURL = $(this).attr('data-alt');
    $.getJSON('https://api.embedly.com/1/extract?' + $.param({
      url: nytArticleURL,
      key: 'aa992939d6f74f4090e6ea8d7dac9d1b'
    }))
    .done(function(response) {
      article2 = response.content;
      var cloudArr2 = wordCount(article2);
      // Generate word cloud in canvas
      WordCloud(document.getElementById('canvas2'), {color: 'random-dark', list: cloudArr2});
      $('#canvas2').removeClass('hide');
      if (wordCloudsLoaded == 1) {
        $('#cloud').removeClass('hide');
      };
    });
  });