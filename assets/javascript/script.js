var theGuardian = function() {
  fromDate = $('#fromDate').val().trim();
  if(fromDate == "") {
    fromDate = "2013-01-01";
  }
  input1Val = $('#input1').val().trim();
  if(input1Val == "") {
    var state = $(this).attr('data-noInput1');
    if (state == 'on' ) {
      $(this).attr('data-noInput1', 'off');
      $('#guardianDiv1').append('<br>');
    } else {
      $(this).attr('data-noInput1', 'on');
      $('#guardianDiv1').append('No search criteria entered for The Guardian !!!' + '<br>');
    };
    return;
  }

  $('#input1').val('');
  $('#guardianDiv1').append('Searching ...' + '<br>');

  var url = ("https://content.guardianapis.com/search?q=" + input1Val + "&from-date=" + fromDate + "&api-key=adcd1e3d-5fa2-401b-b6f3-aefcd666d186");

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
}

var nyTimes = function() {
fromDate = $('#fromDate').val().trim();
fromDate = fromDate.replace(/-/g,"");
if (fromDate == "") {
  fromDate = "20130101";
}

input2Val = input1Val;

if(input2Val == "") {
  var state = $(this).attr('data-noInput2');
  if (state == 'on' ) {
    $(this).attr('data-noInput2', 'off');
    $('#guardianDiv2').append('<br>');
  } else {
    $(this).attr('data-noInput2', 'on');
    $('#guardianDiv2').append('No search criteria entered for The NY Times !!!' + '<br>');
  };
  return;
}

$('#input2').val('');
$('#guardianDiv2').append('Searching ...' + '<br>');

// Built by LucyBot. www.lucybot.com
var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
url += '?' + $.param({
'api-key': "d75094cd314e4d3bb72232a3c0b82e00",
'q': input2Val, 'begin_date': fromDate
});

console.log("url=" + url);

var anArray = [];

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
    anArray.push(nytSnippet + " | ");
    $('#guardianDiv2').append('<p id="nytSnippet" data-alt="' + link + '">' + '&bull; ' + nytSnippet + '</p><br>');
  };
  $('#guardianDiv2').prepend('<h1>The New York Times: </h1>')
});
}

// API
$(document).ready(function() {
  // News ticker function
  $(function(){
   $("ul#ticker01").liScroll();
  });

  var fromDate = '';
  var input1Val = '';
  var input2Val = '';


  $('#btn1').on('click', function() {
    theGuardian();
    nyTimes();
  });

  $('#btn2').on('click', function() {
    nyTimes();
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


  // News ticker

jQuery.fn.liScroll = function(settings) {
    settings = jQuery.extend({
    travelocity: 0.07
    }, settings);   
    return this.each(function(){
        var $strip = jQuery(this);
        $strip.addClass("newsticker")
        var stripWidth = 1;
        $strip.find("li").each(function(i){
        stripWidth += jQuery(this, i).outerWidth(true); // thanks to Michael Haszprunar and Fabien Volpi
        });
        var $mask = $strip.wrap("<div class='mask'></div>");
        var $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");               
        var containerWidth = $strip.parent().parent().width();  //a.k.a. 'mask' width   
        $strip.width(stripWidth);     
        var totalTravel = stripWidth+containerWidth;
        var defTiming = totalTravel/settings.travelocity; // thanks to Scott Waye   
        function scrollnews(spazio, tempo){
        $strip.animate({left: '-='+ spazio}, tempo, "linear", function(){$strip.css("left", containerWidth); scrollnews(totalTravel, defTiming);});
        }
        scrollnews(totalTravel, defTiming);       
        $strip.hover(function(){
        jQuery(this).stop();
        },
        function(){
        var offset = jQuery(this).offset();
        var residualSpace = offset.left + stripWidth;
        var residualTime = residualSpace/settings.travelocity;
        scrollnews(residualSpace, residualTime);
        });     
    }); 
};