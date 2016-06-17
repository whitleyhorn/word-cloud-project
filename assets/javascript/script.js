// API
$(document).ready(function() {

  $('#btn1').on('click', function() {
    var input1Val = $('#input1').val().trim();
    var url = ("https://content.guardianapis.com/search?q=" + input1Val + "&from-date=2014-01-01&api-key=adcd1e3d-5fa2-401b-b6f3-aefcd666d186");
    
    var anArray = [];

    $.ajax({
      url: url,
      method: 'GET'
    })
    .done(function(response) {

      console.log(response);

      for (var i = 0; i < response.response.results.length; i++) {
        var webTitle = response.response.results[i].webTitle;
        anArray.push(webTitle + " | ");
        $('#guardianDiv1').append(webTitle + '<br>');
      }
    });
  });

  $('#btn2').on('click', function() {

    var input2Val = $('#input2').val().trim();

    // Built by LucyBot. www.lucybot.com
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
    'api-key': "d75094cd314e4d3bb72232a3c0b82e00",
    'q': input2Val
    });

    console.log("url=" + url);

    var anArray = [];

    $.ajax({
      url: url,
      method: 'GET'
    })
    .done(function(response) {

      console.log(response);

      for (var i = 0; i < response.response.docs.length; i++) {
        var snippet = response.response.docs[i].headline.main;
        anArray.push(snippet + " | ");
        $('#guardianDiv2').append(snippet + '<br>');
      }
    });
  });
});




// WORD CLOUD
var skipWords = ['the','of','and','a','to','in','is','you','that','it','he','was','for','on','are','as','with','his','they','I','at','be','this','have','from','or','one','had','by','word','but','not','what','all','were','we','when','your','can','there','use','an','each','which','she','do','how','their','if','will','up','other','about','out','many','then','them','these','so','some','her','would','make','like','him','into','time','has','look','two','more','go','see','no','way','could','my','than','been','call','who','its','now','long','down','day','did','get','come','may','part'];

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
    if (skipWords.indexOf(x) < 0) {
      countArray.push([x, xCount * 20]);
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


var article1 = "President Obama angrily denounced Donald J. Trump on Tuesday for his remarks in the aftermath of the shooting massacre in Orlando, Fla., warning that Mr. Trump, the presumptive Republican presidential nominee, was peddling a “dangerous” mind-set that recalled the darkest and most shameful periods in American history. 'We hear language that singles out immigrants and suggests entire religious communities are complicit in violence,' Mr. Obama said at the Treasury Department, without mentioning Mr. Trump by name. His statement, an extraordinary condemnation by a sitting president of a man who is to be the opposing party’s nominee for the White House, came after Mr. Obama met with his national security team on the status of the American effort against the Islamic State, a meeting that the president said had been dominated by discussion of the Orlando rampage."

// Create word count array for article, then remove duplicate words
var dupeArr1 = wordCount(article1);
var finalArticle1 = unique(dupeArr1);

var article2 = "President Barack Obama lit into Donald Trump Tuesday, turning the tables to make the impassioned case that Trump is the one who's un-American. Obama's extraordinary denunciation of the presumptive Republican presidential nominee was about far more than a personal intervention on behalf of Hillary Clinton in the ugly general election campaign. The commander in chief's fury, which seethed out of him in a stunning soliloquy on live television, amounted to a moment of historic significance: a president castigating one of the two people who could succeed him as beyond the constitutional and political norms of the nation itself."

var dupeArr2 = wordCount(article2);
var finalArticle2 = unique(dupeArr2);


WordCloud(document.getElementById('canvas1'), { list: finalArticle1 } );
WordCloud(document.getElementById('canvas2'), { list: finalArticle2 } );